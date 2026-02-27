"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/auth/auth-context";
import { database } from "@/lib/firebase";
import { onValue, ref, update } from "firebase/database";
import { Briefcase, Calendar, Clock, MessageSquare, Users } from "lucide-react";

type TaskStatus = "pending" | "in-progress" | "completed" | "overdue";
type AssigneeStage = "planning" | "in-progress" | "completed";

interface TaskItem {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: "low" | "medium" | "high" | "critical";
  assignedTo: string | string[];
  projectId?: string;
  dueDate?: string;
  dueTime?: string;
  estimatedHours?: number | string;
  progress?: number;
  comments?: unknown[];
  assigneeProgress?: Record<string, AssigneeStage>;
}

interface StaffMemberLite {
  uid: string;
  name: string;
  role?: string;
}

interface BoardColumn {
  key: "planning" | "in-progress" | "completed";
  title: string;
  subtitle: string;
}

const BOARD_COLUMNS: BoardColumn[] = [
  { key: "planning", title: "Planning", subtitle: "Awaiting start" },
  { key: "in-progress", title: "In Progress", subtitle: "Active work" },
  { key: "completed", title: "Completed", subtitle: "Finished tasks" },
];

const mapStatusToStage = (status: TaskStatus): AssigneeStage => {
  if (status === "completed") return "completed";
  if (status === "in-progress") return "in-progress";
  return "planning";
};

const mapStageToTaskStatus = (stage: AssigneeStage): TaskStatus => {
  if (stage === "completed") return "completed";
  if (stage === "in-progress") return "in-progress";
  return "pending";
};

const getAssignedMemberIds = (task: TaskItem): string[] => {
  if (Array.isArray(task.assignedTo)) {
    return task.assignedTo.filter(Boolean);
  }
  return task.assignedTo ? [task.assignedTo] : [];
};

const getAssigneeProgressMap = (task: TaskItem): Record<string, AssigneeStage> => {
  const assigned = getAssignedMemberIds(task);
  const baseStage = mapStatusToStage(task.status || "pending");
  const source = task.assigneeProgress || {};
  const normalized: Record<string, AssigneeStage> = {};

  assigned.forEach((uid) => {
    const stage = source[uid];
    normalized[uid] = stage === "planning" || stage === "in-progress" || stage === "completed" ? stage : baseStage;
  });

  return normalized;
};

const getCurrentUserColumn = (task: TaskItem, userId?: string): BoardColumn["key"] => {
  if (!userId) return "planning";
  const stage = getAssigneeProgressMap(task)[userId] || mapStatusToStage(task.status || "pending");
  return stage;
};

const roundPercent = (value: number) => {
  return Math.round(value * 10) / 10;
};

const getAggregateFromProgressMap = (progressMap: Record<string, AssigneeStage>, assignedMemberIds: string[]) => {
  const totalMembers = assignedMemberIds.length;
  if (totalMembers === 0) {
    return {
      completedCount: 0,
      inProgressCount: 0,
      planningCount: 0,
      overallPercent: 0,
      status: "pending" as TaskStatus,
      allCompleted: false,
    };
  }

  let completedCount = 0;
  let inProgressCount = 0;

  assignedMemberIds.forEach((uid) => {
    const stage = progressMap[uid] || "planning";
    if (stage === "completed") completedCount += 1;
    if (stage === "in-progress") inProgressCount += 1;
  });

  const planningCount = Math.max(0, totalMembers - completedCount - inProgressCount);
  const weight = 100 / totalMembers;
  const overallPercent = roundPercent(completedCount * weight + inProgressCount * (weight / 2));

  let status: TaskStatus = "pending";
  if (completedCount === totalMembers) {
    status = "completed";
  } else if (completedCount > 0 || inProgressCount > 0) {
    status = "in-progress";
  }

  return {
    completedCount,
    inProgressCount,
    planningCount,
    overallPercent,
    status,
    allCompleted: completedCount === totalMembers,
  };
};

const formatDueDateTime = (dueDate?: string, dueTime?: string) => {
  if (!dueDate) return "No due date";

  const datePart = dueDate.includes("T") ? dueDate.split("T")[0] : dueDate;
  const timePart = dueTime || (dueDate.includes("T") ? (dueDate.split("T")[1] || "").slice(0, 5) : "");
  const composed = timePart ? `${datePart}T${timePart}` : datePart;
  const parsed = new Date(composed);

  if (Number.isNaN(parsed.getTime())) {
    return `${datePart}${timePart ? ` ${timePart}` : ""}`;
  }

  return parsed.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: timePart ? "2-digit" : undefined,
    minute: timePart ? "2-digit" : undefined,
  });
};

export function StaffTasksBoard() {
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [projectsMap, setProjectsMap] = useState<Record<string, string>>({});
  const [staffMap, setStaffMap] = useState<Record<string, StaffMemberLite>>({});
  const [savingTaskId, setSavingTaskId] = useState<string | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [activeDropColumn, setActiveDropColumn] = useState<BoardColumn["key"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (!userProfile?.uid) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const projectsRef = ref(database, "staffdashboard/projects");
    const unsubscribeProjects = onValue(projectsRef, (snapshot) => {
      if (!snapshot.exists()) {
        setProjectsMap({});
        return;
      }

      const mappedProjects: Record<string, string> = {};
      Object.entries(snapshot.val() as Record<string, any>).forEach(([projectId, projectValue]) => {
        mappedProjects[projectId] = (projectValue as Record<string, any>).title || "Unknown Project";
      });
      setProjectsMap(mappedProjects);
    });

    const tasksRef = ref(database, "staffdashboard/tasks");
    const usersRef = ref(database, "users");

    const unsubscribeUsers = onValue(usersRef, (snapshot) => {
      if (!snapshot.exists()) {
        setStaffMap({});
        return;
      }

      const mappedStaff: Record<string, StaffMemberLite> = {};
      Object.entries(snapshot.val() as Record<string, any>).forEach(([uid, value]) => {
        const record = value as Record<string, any>;
        const name = (record.name || record.profile?.name || "").trim();
        if (!name) return;

        mappedStaff[uid] = {
          uid,
          name,
          role: record.role || record.profile?.role || "staff",
        };
      });

      setStaffMap(mappedStaff);
    });

    const unsubscribeTasks = onValue(tasksRef, (snapshot) => {
      if (!snapshot.exists()) {
        setTasks([]);
        setLoading(false);
        return;
      }

      const taskList = Object.entries(snapshot.val() as Record<string, any>)
        .map(([taskId, taskValue]) => {
          const rawTask = taskValue as Record<string, any>;
          const assignedTo = Array.isArray(rawTask.assignedTo)
            ? rawTask.assignedTo
            : rawTask.assignedTo
              ? [rawTask.assignedTo]
              : [];

          return {
            id: taskId,
            ...rawTask,
            assignedTo,
          };
        })
        .filter((task) => {
          if (Array.isArray(task.assignedTo)) {
            return task.assignedTo.includes(userProfile.uid);
          }
          return task.assignedTo === userProfile.uid;
        })
        .sort((a, b) => {
          const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          return dateA - dateB;
        });

      setTasks(taskList as TaskItem[]);
      setLoading(false);
    });

    return () => {
      unsubscribeProjects();
      unsubscribeUsers();
      unsubscribeTasks();
    };
  }, [userProfile?.uid]);

  const selectedTask = useMemo(() => {
    if (!selectedTaskId) return null;
    return tasks.find((task) => task.id === selectedTaskId) || null;
  }, [selectedTaskId, tasks]);

  const getTaskProgressSummary = (task: TaskItem) => {
    const assignedMemberIds = getAssignedMemberIds(task);
    const totalMembers = assignedMemberIds.length;
    const map = getAssigneeProgressMap(task);

    const completedIds = assignedMemberIds.filter((uid) => map[uid] === "completed");
    const inProgressIds = assignedMemberIds.filter((uid) => map[uid] === "in-progress");
    const planningIds = assignedMemberIds.filter((uid) => map[uid] !== "completed" && map[uid] !== "in-progress");

    const memberUnit = totalMembers > 0 ? 100 / totalMembers : 0;
    const overallPercent = roundPercent((completedIds.length * memberUnit) + (inProgressIds.length * (memberUnit / 2)));

    return {
      totalMembers,
      memberUnit,
      overallPercent,
      completedIds,
      inProgressIds,
      planningIds,
      map,
    };
  };

  const formatPercent = (value: number) => {
    if (Number.isInteger(value)) return `${value}%`;
    return `${value.toFixed(1)}%`;
  };

  const tasksByColumn = useMemo(() => {
    return BOARD_COLUMNS.reduce<Record<BoardColumn["key"], TaskItem[]>>(
      (accumulator, column) => {
        accumulator[column.key] = tasks.filter((task) => getCurrentUserColumn(task, userProfile?.uid) === column.key);
        return accumulator;
      },
      {
        planning: [],
        "in-progress": [],
        completed: [],
      }
    );
  }, [tasks]);

  const handleMoveTask = async (task: TaskItem, destination: BoardColumn["key"]) => {
    if (!userProfile?.uid) {
      return;
    }

    const currentColumn = getCurrentUserColumn(task, userProfile.uid);
    if (currentColumn === destination) {
      return;
    }

    const assignedMemberIds = getAssignedMemberIds(task);
    const nextProgressMap = {
      ...getAssigneeProgressMap(task),
      [userProfile.uid]: destination,
    };
    const aggregate = getAggregateFromProgressMap(nextProgressMap, assignedMemberIds);

    setSavingTaskId(task.id);
    try {
      const payload: Record<string, any> = {
        assigneeProgress: nextProgressMap,
        progress: aggregate.overallPercent,
        status: aggregate.status,
        completedDate: aggregate.allCompleted ? new Date().toISOString().split("T")[0] : null,
      };

      await update(ref(database, `staffdashboard/tasks/${task.id}`), payload);
      toast({ title: "Task Updated", description: `${task.title} moved to ${mapStageToTaskStatus(destination)}.` });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Unable to move task status right now.",
        variant: "destructive",
      });
    } finally {
      setSavingTaskId(null);
    }
  };

  const getPriorityClass = (priority?: TaskItem["priority"]) => {
    switch (priority) {
      case "critical":
        return "bg-red-900/30 text-red-300 border-red-700/40";
      case "high":
        return "bg-orange-900/30 text-orange-300 border-orange-700/40";
      case "medium":
        return "bg-blue-900/30 text-blue-300 border-blue-700/40";
      case "low":
        return "bg-green-900/30 text-green-300 border-green-700/40";
      default:
        return "bg-gray-900/30 text-gray-300 border-gray-700/40";
    }
  };

  const handleDragStart = (taskId: string) => {
    setDraggedTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setActiveDropColumn(null);
  };

  const handleColumnDragOver = (event: React.DragEvent<HTMLDivElement>, columnKey: BoardColumn["key"]) => {
    event.preventDefault();
    if (activeDropColumn !== columnKey) {
      setActiveDropColumn(columnKey);
    }
  };

  const handleColumnDrop = async (event: React.DragEvent<HTMLDivElement>, columnKey: BoardColumn["key"]) => {
    event.preventDefault();
    setActiveDropColumn(null);

    if (!draggedTaskId) {
      return;
    }

    const draggedTask = tasks.find((task) => task.id === draggedTaskId);
    if (!draggedTask) {
      setDraggedTaskId(null);
      return;
    }

    await handleMoveTask(draggedTask, columnKey);
    setDraggedTaskId(null);
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 border-2 border-orange-300/30 border-t-orange-400 rounded-full animate-spin mx-auto" />
          <p className="text-gray-400">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Tasks</h1>
        <p className="text-gray-400">Move your assigned tasks across planning, in progress, and completed.</p>
        <p className="text-xs text-gray-500 mt-1">Drag and drop cards between columns to update status.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {BOARD_COLUMNS.map((column) => (
          <Card key={column.key} className="bg-gray-900 border-gray-800 p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-white">{column.title}</h2>
                <p className="text-xs text-gray-400">{column.subtitle}</p>
              </div>
              <Badge className="bg-orange-900/40 text-orange-300 border border-orange-700/40">
                {tasksByColumn[column.key].length}
              </Badge>
            </div>

            <div
              className={`space-y-3 min-h-[220px] rounded-lg transition-all ${
                activeDropColumn === column.key ? "ring-2 ring-orange-500/60 bg-orange-500/5" : ""
              }`}
              onDragOver={(event) => handleColumnDragOver(event, column.key)}
              onDrop={(event) => void handleColumnDrop(event, column.key)}
              onDragLeave={() => {
                if (activeDropColumn === column.key) {
                  setActiveDropColumn(null);
                }
              }}
            >
              {tasksByColumn[column.key].length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-700 p-6 text-center text-sm text-gray-500">
                  No tasks in this section.
                </div>
              ) : (
                tasksByColumn[column.key].map((task) => {
                  const isSaving = savingTaskId === task.id;
                  const isDragging = draggedTaskId === task.id;

                  return (
                    <Card
                      key={task.id}
                      className={`bg-gray-900 border-gray-800 p-4 space-y-3 cursor-grab active:cursor-grabbing ${
                        isDragging ? "opacity-50" : "opacity-100"
                      }`}
                      draggable
                      onClick={() => setSelectedTaskId(task.id)}
                      onDragStart={() => handleDragStart(task.id)}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-white leading-5">{task.title}</h3>
                        <Badge className={getPriorityClass(task.priority)}>
                          {(task.priority || "other").toUpperCase()}
                        </Badge>
                      </div>

                      {task.description && (
                        <p className="text-sm text-gray-400 line-clamp-2">{task.description}</p>
                      )}

                      <div className="grid grid-cols-1 lg:grid-cols-[1fr_190px] gap-3 items-start">
                        <div className="space-y-1.5 text-xs text-gray-400">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-3.5 w-3.5" />
                            <span>{projectsMap[task.projectId || ""] || "Unknown Project"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{formatDueDateTime(task.dueDate, task.dueTime)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Est: {task.estimatedHours || 0}h</span>
                          </div>
                          {Array.isArray(task.comments) && task.comments.length > 0 && (
                            <div className="flex items-center gap-2 text-orange-300">
                              <MessageSquare className="h-3.5 w-3.5" />
                              <span>{task.comments.length} comment(s)</span>
                            </div>
                          )}
                        </div>

                        {task.status !== "completed" && task.dueDate ? (
                          <CountdownTimer
                            dueDate={task.dueDate}
                            priority={task.priority || "medium"}
                            size="sm"
                            className="w-full"
                          />
                        ) : null}
                      </div>

                      <div className="text-[11px] text-gray-500">
                        {isSaving ? "Updating task..." : "Drag this card to another column"}
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTaskId(null)}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-[760px]">
          {selectedTask && (() => {
            const details = getTaskProgressSummary(selectedTask);
            const memberRows = getAssignedMemberIds(selectedTask).map((uid) => {
              const stage = details.map[uid] || "planning";
              const displayName = staffMap[uid]?.name || "Assigned Staff";
              const role = staffMap[uid]?.role || "staff";
              const contribution = stage === "completed"
                ? details.memberUnit
                : stage === "in-progress"
                  ? details.memberUnit / 2
                  : 0;

              return {
                uid,
                displayName,
                role,
                stage,
                contribution,
              };
            });

            return (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">{selectedTask.title}</DialogTitle>
                </DialogHeader>

                <div className="space-y-5 py-2">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getPriorityClass(selectedTask.priority)}>
                      {(selectedTask.priority || "other").toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/40 uppercase">
                      {selectedTask.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs uppercase tracking-wider text-gray-400">Description</h4>
                    <div className="rounded-lg border border-gray-700 bg-gray-800/60 p-3 text-sm text-gray-200">
                      {selectedTask.description || "No description provided."}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="rounded border border-gray-700 bg-gray-800/40 p-3">
                      <p className="text-gray-500 text-xs mb-1">Project</p>
                      <p className="text-gray-200">{projectsMap[selectedTask.projectId || ""] || "Unknown Project"}</p>
                    </div>
                    <div className="rounded border border-gray-700 bg-gray-800/40 p-3">
                      <p className="text-gray-500 text-xs mb-1">Due</p>
                      <p className="text-gray-200">{formatDueDateTime(selectedTask.dueDate, selectedTask.dueTime)}</p>
                    </div>
                    <div className="rounded border border-gray-700 bg-gray-800/40 p-3">
                      <p className="text-gray-500 text-xs mb-1">Est. Hours</p>
                      <p className="text-gray-200">{selectedTask.estimatedHours || 0}h</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Overall Progress</span>
                      <span className="text-white font-medium">{formatPercent(details.overallPercent)}</span>
                    </div>
                    <Progress value={details.overallPercent} className="h-2 bg-gray-700" indicatorClassName="bg-orange-500" />
                    <div className="flex flex-wrap gap-2 text-xs">
                      <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/40">
                        Completed {details.completedIds.length}/{details.totalMembers}
                      </Badge>
                      <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/40">
                        In Progress {details.inProgressIds.length}/{details.totalMembers}
                      </Badge>
                      <Badge variant="outline" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/40">
                        Planning {details.planningIds.length}/{details.totalMembers}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs uppercase tracking-wider text-gray-400 flex items-center gap-2">
                      <Users className="h-3.5 w-3.5" /> Assigned Staff ({details.totalMembers})
                    </h4>

                    {memberRows.length === 0 ? (
                      <div className="rounded border border-gray-700 bg-gray-800/40 p-3 text-sm text-gray-400">
                        No assigned staff members.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                        {memberRows.map((member) => (
                          <div key={member.uid} className="rounded border border-gray-700 bg-gray-800/40 p-3 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-white truncate">
                                {member.displayName}
                                {member.uid === userProfile?.uid ? " (You)" : ""}
                              </p>
                              <p className="text-xs text-gray-500 capitalize">{member.role}</p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <Badge
                                variant="outline"
                                className={member.stage === "completed"
                                  ? "bg-green-500/20 text-green-300 border-green-500/40"
                                  : member.stage === "in-progress"
                                    ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                                    : "bg-yellow-500/20 text-yellow-300 border-yellow-500/40"
                                }
                              >
                                {member.stage === "in-progress" ? "In Progress" : member.stage === "completed" ? "Completed" : "Planning"}
                              </Badge>
                              <Badge variant="outline" className="bg-orange-500/10 text-orange-300 border-orange-500/30">
                                {formatPercent(roundPercent(member.contribution))}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
