"use client";

import { getDatabase, ref, onValue } from 'firebase/database';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { FaBell as Bell, FaCheckCircle as CheckCircle, FaClock as Clock, FaExclamationCircle as AlertCircle, FaBriefcase as Briefcase, FaPauseCircle as PauseCircle, FaPlayCircle as PlayCircle, FaCalendar as Calendar, FaUsers as Users, FaCog as Settings } from 'react-icons/fa';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Input } from '../ui/input';

// Mock currentUser for now
const currentUser = {
  name: 'John Doe',
  avatar: '/placeholder-user.jpg',
  role: 'Developer'
};

// Mock useAuth hook
const useAuth = () => ({ user: { uid: '12345' } });

// Define TicketItem type
interface TicketItem {
  id: string;
  assignedTo: { id: string };
  dueDate: string;
}

// Define missing types
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  project: string;
  dueDate: string;
  estimatedHours: number;
  timeSpent: number;
  isTimerRunning: boolean;
  timerStartTime?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: string;
  dueDate: string;
  teamSize: number;
}

interface TimeEntry {
  id: string;
  date: string;
  hours: number;
  task: string;
  project: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

// Initialize Firebase database
const db = getDatabase();

export default function EmployeeView() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timers, setTimers] = useState<Record<string, number>>({});
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch tickets assigned to current user
  useEffect(() => {
    if (!user?.uid) return;

    const ticketsRef = ref(db, 'tickets');
    const unsubscribe = onValue(ticketsRef, (snapshot) => {
      if (snapshot.exists()) {
        const ticketsData = snapshot.val();
        const ticketsList = Object.entries(ticketsData)
          .map(([id, data]: [string, any]) => ({
            id,
            ...data
          }))
          .filter((ticket: TicketItem) => ticket.assignedTo.id === user.uid)
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        
        setTickets(ticketsList);
      } else {
        setTickets([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // Timer updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prevTimers => {
        const newTimers = { ...prevTimers };
        tasks.forEach(task => {
          if (task.isTimerRunning && task.timerStartTime) {
            const startTime = new Date(task.timerStartTime).getTime();
            const currentTime = Date.now();
            const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
            newTimers[task.id] = task.timeSpent + elapsedSeconds;
          } else {
            newTimers[task.id] = task.timeSpent;
          }
        });
        return newTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [tasks]);

  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      
      // In real implementation, fetch user-specific data from Firebase
      // const tasksRef = collection(db, "tasks");
      // const q = query(tasksRef, where("assignedTo", "==", currentUser.id));
      // const unsubscribe = onSnapshot(q, (snapshot) => {
      //   const tasksData = snapshot.docs.map(doc => ({
      //     id: doc.id,
      //     ...doc.data()
      //   })) as Task[];
      //   setTasks(tasksData);
      // });

      // Mock data for now
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const mockTasks: Task[] = [
        {
          id: "1",
          title: "Implement user authentication",
          description: "Create login and registration functionality with JWT tokens",
          status: "in-progress",
          priority: "high",
          project: "E-commerce Platform v2.0",
          dueDate: "2024-01-25T17:00:00Z",
          estimatedHours: 16,
          timeSpent: 28800, // 8 hours in seconds
          isTimerRunning: true,
          timerStartTime: new Date(Date.now() - 7200000).toISOString(), // Started 2 hours ago
        },
        {
          id: "2",
          title: "Fix payment gateway integration",
          description: "Resolve issues with payment processing and error handling",
          status: "pending",
          priority: "critical",
          project: "E-commerce Platform v2.0",
          dueDate: "2024-01-18T17:00:00Z",
          estimatedHours: 8,
          timeSpent: 0,
          isTimerRunning: false,
        },
        {
          id: "3",
          title: "Update API documentation",
          description: "Document new endpoints and update existing ones",
          status: "completed",
          priority: "medium",
          project: "API Documentation",
          dueDate: "2024-01-15T17:00:00Z",
          estimatedHours: 4,
          timeSpent: 14400, // 4 hours
          isTimerRunning: false,
        }
      ];

      const mockProjects: Project[] = [
        {
          id: "1",
          name: "E-commerce Platform v2.0",
          description: "Major update to the e-commerce platform with new features",
          progress: 65,
          status: "active",
          dueDate: "2024-03-15",
          teamSize: 8,
        },
        {
          id: "2",
          name: "Mobile Banking App",
          description: "Development of new mobile banking application",
          progress: 30,
          status: "active",
          dueDate: "2024-04-20",
          teamSize: 6,
        },
        {
          id: "3",
          name: "API Documentation",
          description: "Comprehensive API documentation update",
          progress: 90,
          status: "active",
          dueDate: "2024-02-10",
          teamSize: 3,
        }
      ];

      const mockTimeEntries: TimeEntry[] = [
        { id: "1", date: "2024-01-15", hours: 8, task: "Implement user authentication", project: "E-commerce Platform v2.0" },
        { id: "2", date: "2024-01-14", hours: 6, task: "Update API documentation", project: "API Documentation" },
        { id: "3", date: "2024-01-13", hours: 7, task: "Bug fixes and testing", project: "E-commerce Platform v2.0" },
        { id: "4", date: "2024-01-12", hours: 8, task: "Feature development", project: "Mobile Banking App" },
        { id: "5", date: "2024-01-11", hours: 5, task: "Code review and optimization", project: "E-commerce Platform v2.0" },
      ];

      const mockNotifications: Notification[] = [
        {
          id: "1",
          title: "New task assigned",
          message: "You have been assigned to 'Fix payment gateway integration'",
          type: "info",
          timestamp: "2024-01-15T10:30:00Z",
          read: false,
        },
        {
          id: "2",
          title: "Task deadline approaching",
          message: "Task 'Implement user authentication' is due in 2 days",
          type: "warning",
          timestamp: "2024-01-15T09:00:00Z",
          read: false,
        },
        {
          id: "3",
          title: "Task completed",
          message: "Well done! You completed 'Update API documentation'",
          type: "success",
          timestamp: "2024-01-14T16:45:00Z",
          read: true,
        }
      ];

      setTasks(mockTasks);
      setProjects(mockProjects);
      setTimeEntries(mockTimeEntries);
      setNotifications(mockNotifications);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTimer = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const updatedTask = {
        ...task,
        isTimerRunning: !task.isTimerRunning,
        timerStartTime: !task.isTimerRunning ? new Date().toISOString() : undefined,
        timeSpent: task.isTimerRunning ? timers[taskId] || task.timeSpent : task.timeSpent
      };

      // In real implementation, update Firebase
      // await updateDoc(doc(db, "tasks", taskId), {
      //   isTimerRunning: updatedTask.isTimerRunning,
      //   timerStartTime: updatedTask.timerStartTime,
      //   timeSpent: updatedTask.timeSpent,
      // });

      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
    } catch (error) {
      console.error("Error toggling timer:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "medium":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTimeRemaining = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffMs = due.getTime() - now.getTime();
    
    if (diffMs <= 0) {
      return { text: "Overdue", color: "text-red-500", urgent: true };
    }
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 1) {
      return { text: `${diffDays} days left`, color: "text-gray-400", urgent: false };
    } else if (diffHours > 24) {
      return { text: "1 day left", color: "text-yellow-400", urgent: false };
    } else if (diffHours > 1) {
      return { text: `${diffHours} hours left`, color: "text-orange-400", urgent: true };
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return { text: `${diffMinutes} minutes left`, color: "text-red-400", urgent: true };
    }
  };

  const totalHoursThisWeek = timeEntries
    .filter(entry => {
      const entryDate = new Date(entry.date);
      const now = new Date();
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      return entryDate >= weekStart;
    })
    .reduce((total, entry) => total + entry.hours, 0);

  const completedTasksThisWeek = tasks.filter(task => {
    if (task.status !== "completed") return false;
    // In real implementation, check completion date
    return true;
  }).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 mx-auto"></div>
          <p className="text-gray-400">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-white">Employee Portal</h1>
              </div>
              <nav className="hidden md:ml-8 md:space-x-8 md:flex">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === "dashboard"
                      ? "bg-emerald-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-700"
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab("tasks")}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === "tasks"
                      ? "bg-emerald-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-700"
                  }`}
                >
                  My Tasks
                </button>
                <button
                  onClick={() => setActiveTab("projects")}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === "projects"
                      ? "bg-emerald-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-700"
                  }`}
                >
                  Projects
                </button>
                <button
                  onClick={() => setActiveTab("timesheet")}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === "timesheet"
                      ? "bg-emerald-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-700"
                  }`}
                >
                  Time Tracking
                </button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white relative">
                <Bell className="h-5 w-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </Button>
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback>{currentUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-white">{currentUser.name}</p>
                  <p className="text-xs text-gray-400">{currentUser.role}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white">
                Welcome back, {currentUser.name.split(' ')[0]}!
              </h2>
              <p className="mt-2 text-gray-400">
                Here's what's happening with your work today.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
              <Card className="bg-gradient-to-br from-blue-900 to-blue-800 border-blue-700">
                <div className="p-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-blue-300" />
                    <div className="ml-4">
                      <p className="text-sm text-blue-200">Tasks Completed</p>
                      <p className="text-2xl font-semibold text-white">{completedTasksThisWeek}</p>
                      <p className="text-xs text-blue-300">This week</p>
                    </div>
                  </div>
                </div>
              </Card>
              <Card className="bg-gradient-to-br from-emerald-900 to-emerald-800 border-emerald-700">
                <div className="p-6">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-emerald-300" />
                    <div className="ml-4">
                      <p className="text-sm text-emerald-200">Hours Logged</p>
                      <p className="text-2xl font-semibold text-white">{totalHoursThisWeek}</p>
                      <p className="text-xs text-emerald-300">This week</p>
                    </div>
                  </div>
                </div>
              </Card>
              <Card className="bg-gradient-to-br from-orange-900 to-orange-800 border-orange-700">
                <div className="p-6">
                  <div className="flex items-center">
                    <AlertCircle className="h-8 w-8 text-orange-300" />
                    <div className="ml-4">
                      <p className="text-sm text-orange-200">Pending Tasks</p>
                      <p className="text-2xl font-semibold text-white">
                        {tasks.filter(t => t.status === "pending").length}
                      </p>
                      <p className="text-xs text-orange-300">Assigned to you</p>
                    </div>
                  </div>
                </div>
              </Card>
              <Card className="bg-gradient-to-br from-purple-900 to-purple-800 border-purple-700">
                <div className="p-6">
                  <div className="flex items-center">
                    <Briefcase className="h-8 w-8 text-purple-300" />
                    <div className="ml-4">
                      <p className="text-sm text-purple-200">Active Projects</p>
                      <p className="text-2xl font-semibold text-white">{projects.length}</p>
                      <p className="text-xs text-purple-300">Participating</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Current Tasks & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Current Tasks */}
              <Card className="bg-gray-800 border-gray-700">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-white mb-4">Active Tasks</h3>
                  <div className="space-y-4">
                    {tasks
                      .filter(task => task.status === "in-progress" || task.status === "pending")
                      .slice(0, 3)
                      .map((task) => {
                        const timeRemaining = getTimeRemaining(task.dueDate);
                        const currentTime = timers[task.id] || task.timeSpent;
                        
                        return (
                          <div key={task.id} className="bg-gray-700 p-4 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="font-medium text-white truncate">{task.title}</h4>
                                <p className="text-sm text-gray-400 mt-1">{task.project}</p>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                <Badge className={getPriorityColor(task.priority)}>
                                  {task.priority}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleTimer(task.id)}
                                  className={`${
                                    task.isTimerRunning 
                                      ? "text-red-400 hover:text-red-300" 
                                      : "text-emerald-400 hover:text-emerald-300"
                                  }`}
                                >
                                  {task.isTimerRunning ? (
                                    <PauseCircle className="h-4 w-4" />
                                  ) : (
                                    <PlayCircle className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className={`${timeRemaining.color} ${timeRemaining.urgent ? "font-semibold" : ""}`}>
                                {timeRemaining.text}
                              </span>
                              <span className="text-gray-400 font-mono">
                                {formatTime(currentTime)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </Card>

              {/* Notifications */}
              <Card className="bg-gray-800 border-gray-700">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-white mb-4">Recent Notifications</h3>
                  <div className="space-y-3">
                    {notifications.slice(0, 5).map((notification) => (
                      <div key={notification.id} className={`p-3 rounded-lg border-l-4 ${
                        notification.type === "info" ? "bg-blue-900/20 border-blue-500" :
                        notification.type === "success" ? "bg-emerald-900/20 border-emerald-500" :
                        notification.type === "warning" ? "bg-orange-900/20 border-orange-500" :
                        "bg-red-900/20 border-red-500"
                      } ${!notification.read ? "bg-opacity-80" : "bg-opacity-40"}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-white">{notification.title}</h4>
                            <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                          </div>
                          {!notification.read && (
                            <div className="h-2 w-2 bg-emerald-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">My Tasks</h2>
              <div className="flex space-x-2">
                <Input
                  placeholder="Search tasks..."
                  className="w-64 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              {tasks.map((task) => {
                const timeRemaining = getTimeRemaining(task.dueDate);
                const currentTime = timers[task.id] || task.timeSpent;
                
                return (
                  <Card key={task.id} className="bg-gray-800 border-gray-700">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                            <Badge className={getStatusColor(task.status)}>
                              {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
                            </Badge>
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-gray-400 mb-3">{task.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-gray-400">
                            <span>Project: {task.project}</span>
                            <span className={timeRemaining.color}>
                              Due: {timeRemaining.text}
                            </span>
                            <span>Estimated: {task.estimatedHours}h</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <div className="text-right">
                            <p className="text-sm text-gray-400">Time Spent</p>
                            <p className="text-lg font-mono text-white">{formatTime(currentTime)}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleTimer(task.id)}
                            className={`${
                              task.isTimerRunning 
                                ? "text-red-400 hover:text-red-300" 
                                : "text-emerald-400 hover:text-emerald-300"
                            }`}
                          >
                            {task.isTimerRunning ? (
                              <PauseCircle className="h-5 w-5" />
                            ) : (
                              <PlayCircle className="h-5 w-5" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-400">Progress</span>
                          <span className="text-sm font-medium text-white">
                            {Math.round((currentTime / (task.estimatedHours * 3600)) * 100) || 0}%
                          </span>
                        </div>
                        <Progress
                          value={Math.min((currentTime / (task.estimatedHours * 3600)) * 100, 100) || 0}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">My Projects</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="bg-gray-800 border-gray-700">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                        <p className="text-sm text-gray-400 mt-1">{project.description}</p>
                      </div>
                      <Badge className={
                        project.status === "active" ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
                        project.status === "planning" ? "bg-blue-100 text-blue-800 border-blue-200" :
                        project.status === "on-hold" ? "bg-orange-100 text-orange-800 border-orange-200" :
                        "bg-gray-100 text-gray-800 border-gray-200"
                      }>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('-', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-400">Progress</span>
                          <span className="text-sm font-medium text-white">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-400">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{project.teamSize} members</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Timesheet Tab */}
        {activeTab === "timesheet" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Time Tracking</h2>
              <div className="text-right">
                <p className="text-sm text-gray-400">This Week</p>
                <p className="text-2xl font-bold text-white">{totalHoursThisWeek} hours</p>
              </div>
            </div>

            <Card className="bg-gray-800 border-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-medium text-white mb-4">Recent Time Entries</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Task</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Project</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Hours</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timeEntries.map((entry) => (
                        <tr key={entry.id} className="border-b border-gray-700">
                          <td className="py-3 px-4 text-sm text-white">
                            {new Date(entry.date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-sm text-white">{entry.task}</td>
                          <td className="py-3 px-4 text-sm text-gray-400">{entry.project}</td>
                          <td className="py-3 px-4 text-sm text-white text-right font-mono">
                            {entry.hours}h
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}