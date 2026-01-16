"use client";

// ... (imports remain)
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { database } from "@/lib/firebase";
import { ref, onValue, get } from "firebase/database";
import { useAuth } from "@/components/auth/auth-context";
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  User,
  Zap,
  Activity,
  AlertCircle,
  XCircle,
  Wifi,
  WifiOff,
  CheckSquare,
  Briefcase
} from "lucide-react";

interface TaskItem {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string | string[]; // UID or array of UIDs
  projectId: string;
  dueDate: string;
  estimatedHours: string;
  assignedBy?: string;
  createdAt?: string;
}

export default function EmployeeView() {
  const { userProfile } = useAuth();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userTimeSettings, setUserTimeSettings] = useState({ timezone: 'America/New_York', timeFormat: '12h' });

  // Projects Map for displaying project names
  const [projectsMap, setProjectsMap] = useState<Record<string, string>>({});

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch User Time Settings
  useEffect(() => {
    if (!userProfile?.uid) return;
    const fetchTimeSettings = async () => {
      try {
        const snapshot = await get(ref(database, `users/${userProfile.uid}`));
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserTimeSettings({
            timezone: data.timezone || 'America/New_York',
            timeFormat: data.timeFormat || '12h'
          });
        }
      } catch (error) {
        console.error("Error fetching time settings:", error);
      }
    };
    fetchTimeSettings();
  }, [userProfile]);

  // Fetch Projects (for naming) & Tasks
  useEffect(() => {
    if (!userProfile?.uid) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // 1. Fetch Projects to map ID -> Title
    const projectsRef = ref(database, 'staffdashboard/projects');
    const unsubscribeProjects = onValue(projectsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const map: Record<string, string> = {};
        Object.entries(data).forEach(([id, val]: [string, any]) => {
          map[id] = val.title || "Unknown Project";
        });
        setProjectsMap(map);
      }
    });

    // 2. Fetch Tasks
    const tasksRef = ref(database, 'staffdashboard/tasks');
    const unsubscribeTasks = onValue(tasksRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const taskList = Object.entries(data)
          .map(([id, val]: [string, any]) => ({
            id,
            ...val
          }))
          .filter((t: TaskItem) => {
            if (Array.isArray(t.assignedTo)) {
              return t.assignedTo.includes(userProfile.uid);
            }
            return t.assignedTo === userProfile.uid;
          })
          .sort((a, b) => {
            const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
            const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
            return dateA - dateB;
          });

        setTasks(taskList);
      } else {
        setTasks([]);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeProjects();
      unsubscribeTasks();
    }
  }, [userProfile?.uid]);

  // Fetch Projects assigned to current user (Existing Logic kept for Active Projects section)
  const [activeProjects, setActiveProjects] = useState<any[]>([]);
  useEffect(() => {
    if (!userProfile?.uid) return;

    const projectsRef = ref(database, 'staffdashboard/projects');
    const unsubscribe = onValue(projectsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const projectList = Object.entries(data)
          .map(([id, val]: [string, any]) => ({
            id,
            ...val,
            team: val.team || []
          }))
          .filter(project => project.team && project.team.includes(userProfile.uid));

        setActiveProjects(projectList);
      } else {
        setActiveProjects([]);
      }
    });

    return () => unsubscribe();
  }, [userProfile?.uid]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      case 'in-progress': return <Activity className="h-4 w-4 text-blue-400" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default: return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return "bg-yellow-900/20 text-yellow-300 border-yellow-600/50";
      case 'in-progress': return "bg-blue-900/20 text-blue-300 border-blue-600/50";
      case 'completed': return "bg-green-900/20 text-green-300 border-green-600/50";
      case 'overdue': return "bg-red-900/20 text-red-300 border-red-600/50";
      default: return "bg-gray-900 text-gray-300 border-gray-600";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <Zap className="h-3 w-3" />;
      case 'high': return <AlertTriangle className="h-3 w-3" />;
      default: return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return "bg-red-900/20 text-red-300 border-red-600/50";
      case 'high': return "bg-orange-900/20 text-orange-300 border-orange-600/50";
      case 'medium': return "bg-yellow-900/20 text-yellow-300 border-yellow-600/50";
      case 'low': return "bg-green-900/20 text-green-300 border-green-600/50";
      default: return "bg-gray-900 text-gray-300 border-gray-600";
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-gray-400">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={userProfile?.profilePicture || '/placeholder-user.jpg'} />
              <AvatarFallback className="bg-blue-600 text-white font-bold">
                {userProfile?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                {getGreeting()}, {userProfile?.name || 'Team Member'}!
              </h1>
              <p className="text-lg text-gray-300 mt-2">
                Welcome to your workspace
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>
                {new Intl.DateTimeFormat('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                  hour12: userTimeSettings.timeFormat === '12h',
                  timeZone: userTimeSettings.timezone
                }).format(currentTime)}
              </span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>
                {new Intl.DateTimeFormat('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  timeZone: userTimeSettings.timezone
                }).format(currentTime)}
              </span>
            </div>
          </div>
        </div>

                

        {/* Section Separator */}
        <div className="border-t border-orange-500/20"></div>
                
                {/* Tasks Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="bg-gray-900/50 border-orange-700/50 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-300">
                {tasks.filter(t => t.status === 'pending').length}
              </div>
              <div className="text-sm text-orange-400">Open Tasks</div>
            </div>
          </Card>
          <Card className="bg-gray-900/50 border-blue-700/50 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-300">
                {tasks.filter(t => t.status === 'in-progress').length}
              </div>
              <div className="text-sm text-blue-400">In Progress</div>
            </div>
          </Card>
          {/* Note: 'review' status is not standard in my previous implementation but keeping card for layout stability or mapping 'overdue' */}
          <Card className="bg-gray-900/50 border-red-700/50 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-300">
                {tasks.filter(t => t.status === 'overdue').length}
              </div>
              <div className="text-sm text-red-400">Overdue</div>
            </div>
          </Card>
          <Card className="bg-gray-900/50 border-green-700/50 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-300">
                {tasks.filter(t => t.status === 'completed').length}
              </div>
              <div className="text-sm text-green-400">Completed</div>
            </div>
          </Card>
        </div> 

                 {/* Section Separator */}
        <div className="border-t border-orange-500/20"></div>
        {/* Active Projects Section */}
        {activeProjects.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Activity className="w-5 h-5 mr-2 text-orange-500" />
              Your Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeProjects.map(project => (
                <Card key={project.id} className="bg-gray-900 border-gray-800 p-4 hover:border-orange-500/30 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-white text-lg">{project.title}</h3>
                    <Badge variant="outline" className="border-gray-600 text-gray-400 capitalize">
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">{project.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500" style={{ width: `${project.progress}%` }}></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {project.endDate || 'No deadline'}
                    </div>
                    {/* Placeholder for task count if needed */}
                  </div>
                </Card>
              ))}
            </div>
            <div className="border-t border-orange-500/20 my-6"></div>
          </div>
        )}

       

       
        {/* Task Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center">
              <CheckSquare className="w-5 h-5 mr-2 text-orange-500" />
              Your Tasks
            </h2>
          </div>

          {tasks.length === 0 ? (
            <Card className="bg-gray-900 border-gray-700 p-8 text-center">
              <div className="text-gray-400 space-y-2">
                <CheckCircle className="h-12 w-12 mx-auto text-orange-400" />
                <h3 className="text-lg font-medium text-white">No tasks assigned</h3>
                <p>You don't have any tasks assigned at the moment.</p>
              </div>
            </Card>
          ) : (
            tasks.map((task) => (
              <Card key={task.id} className="bg-gray-900 border-gray-700 hover:bg-gray-800 transition-all duration-200">
                <div className="p-4 sm:p-6">
                  <div className="space-y-4">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <div className="flex items-center space-x-2 min-w-0 flex-1">
                            {getStatusIcon(task.status)}
                            <h3 className="text-lg font-semibold text-white truncate">
                              {task.title}
                            </h3>
                          </div>
                          <div className="flex flex-wrap gap-2 shrink-0">
                            <Badge className={getStatusColor(task.status)}>
                              {task.status.toUpperCase()}
                            </Badge>
                            <Badge className={getPriorityColor(task.priority)}>
                              <div className="flex items-center space-x-1">
                                {getPriorityIcon(task.priority)}
                                <span>{task.priority.toUpperCase()}</span>
                              </div>
                            </Badge>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm sm:text-base mb-3 line-clamp-2">
                          {task.description}
                        </p>
                      </div>
                    </div>

                    {/* Countdown Timer (Only for pending/in-progress) */}
                    {(task.status === 'pending' || task.status === 'in-progress') && task.dueDate && (
                      <div className="mb-4">
                        {/* Simplified timer placeholder or reuse component if compatible. 
                               CountdownTimer expects ISO date string. verify format.
                               Assuming task.dueDate is 'YYYY-MM-DD'.
                            */}
                        <div className="text-sm text-gray-400 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-orange-500" />
                          Due: {task.dueDate}
                        </div>
                      </div>
                    )}


                    {/* Task Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center text-gray-400">
                        <Briefcase className="h-4 w-4 mr-2 shrink-0" />
                        <span>Project: {projectsMap[task.projectId] || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <Clock className="h-4 w-4 mr-2 shrink-0" />
                        <span>Est: {task.estimatedHours}h</span>
                      </div>
                    </div>

                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

      </div>
    </div>
  );
}