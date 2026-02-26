"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/auth/auth-context";
import { database } from "@/lib/firebase";
import { onValue, ref, update } from "firebase/database";
import { Briefcase, Calendar, Clock, MessageSquare } from "lucide-react";

type TaskStatus = "pending" | "in-progress" | "completed" | "overdue";

interface TaskItem {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: "low" | "medium" | "high" | "critical";
  assignedTo: string | string[];
  projectId?: string;
  dueDate?: string;
  estimatedHours?: number | string;
  progress?: number;
  comments?: unknown[];
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

const mapToBoardColumn = (status: TaskStatus): BoardColumn["key"] => {
  if (status === "completed") return "completed";
  if (status === "in-progress") return "in-progress";
  return "planning";
};

export function StaffTasksBoard() {
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [projectsMap, setProjectsMap] = useState<Record<string, string>>({});
  const [savingTaskId, setSavingTaskId] = useState<string | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [activeDropColumn, setActiveDropColumn] = useState<BoardColumn["key"] | null>(null);
  const [loading, setLoading] = useState(true);

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
    const unsubscribeTasks = onValue(tasksRef, (snapshot) => {
      if (!snapshot.exists()) {
        setTasks([]);
        setLoading(false);
        return;
      }

      const taskList = Object.entries(snapshot.val() as Record<string, any>)
        .map(([taskId, taskValue]) => ({
          id: taskId,
          ...(taskValue as Record<string, any>),
        }))
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
      unsubscribeTasks();
    };
  }, [userProfile?.uid]);

  const tasksByColumn = useMemo(() => {
    return BOARD_COLUMNS.reduce<Record<BoardColumn["key"], TaskItem[]>>(
      (accumulator, column) => {
        accumulator[column.key] = tasks.filter((task) => mapToBoardColumn(task.status) === column.key);
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
    let nextStatus: TaskStatus = "pending";
    if (destination === "in-progress") nextStatus = "in-progress";
    if (destination === "completed") nextStatus = "completed";

    if (task.status === nextStatus) {
      return;
    }

    setSavingTaskId(task.id);
    try {
      const payload: Record<string, any> = {
        status: nextStatus,
      };

      if (nextStatus === "completed") {
        payload.progress = 100;
        payload.completedDate = new Date().toISOString().split("T")[0];
      } else if (nextStatus === "pending") {
        payload.progress = 0;
        payload.completedDate = null;
      } else if (nextStatus === "in-progress") {
        payload.progress = typeof task.progress === "number" && task.progress > 0 && task.progress < 100 ? task.progress : 50;
        payload.completedDate = null;
      }

      await update(ref(database, `staffdashboard/tasks/${task.id}`), payload);
      toast({ title: "Task Updated", description: `${task.title} moved to ${destination}.` });
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

                      <div className="space-y-1.5 text-xs text-gray-400">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-3.5 w-3.5" />
                          <span>{projectsMap[task.projectId || ""] || "Unknown Project"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{task.dueDate || "No due date"}</span>
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
    </div>
  );
}
