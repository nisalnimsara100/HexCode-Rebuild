"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/auth/auth-context";
import { database } from "@/lib/firebase";
import { onValue, ref } from "firebase/database";
import {
  Calendar,
  CheckCircle,
  Clock,
  FolderOpen,
  Mail,
  Ticket,
  User,
  ClipboardList,
  Building,
} from "lucide-react";

interface ProfileData {
  name?: string;
  email?: string;
  role?: string;
  department?: string;
  employeeId?: string;
  profilePicture?: string;
  dateOfBirth?: string;
  timezone?: string;
  joinDate?: string;
  createdAt?: string;
  hireDate?: string;
}

interface ProjectItem {
  id: string;
  title?: string;
  status?: string;
  team?: string[];
}

interface TaskItem {
  id: string;
  title?: string;
  status?: string;
  assignedTo?: string | string[];
  dueDate?: string;
}

interface TicketItem {
  id: string;
  title?: string;
  status?: string;
  assignedTo?: string | string[];
  createdAt?: string;
}

const formatDate = (dateValue?: string) => {
  if (!dateValue) return "Not available";
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) {
    return dateValue;
  }
  return parsed.toLocaleDateString();
};

const includesUser = (value: string | string[] | undefined, uid: string) => {
  if (!value) return false;
  if (Array.isArray(value)) return value.includes(uid);
  return value === uid;
};

export function StaffProfilePage() {
  const { userProfile } = useAuth();

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userProfile?.uid) {
      setLoading(false);
      return;
    }

    const profileRef = ref(database, `users/${userProfile.uid}`);
    const projectsRef = ref(database, "staffdashboard/projects");
    const tasksRef = ref(database, "staffdashboard/tasks");
    const ticketsRef = ref(database, "staffdashboard/tickets");

    const unsubProfile = onValue(profileRef, (snapshot) => {
      if (snapshot.exists()) {
        setProfileData(snapshot.val() as ProfileData);
      } else {
        setProfileData(null);
      }
    });

    const unsubProjects = onValue(projectsRef, (snapshot) => {
      if (!snapshot.exists()) {
        setProjects([]);
        return;
      }

      const list = Object.entries(snapshot.val() as Record<string, any>)
        .map(([id, value]) => ({ id, ...(value as Record<string, any>) }))
        .filter((project) => Array.isArray(project.team) && project.team.includes(userProfile.uid));

      setProjects(list as ProjectItem[]);
    });

    const unsubTasks = onValue(tasksRef, (snapshot) => {
      if (!snapshot.exists()) {
        setTasks([]);
        return;
      }

      const list = Object.entries(snapshot.val() as Record<string, any>)
        .map(([id, value]) => ({ id, ...(value as Record<string, any>) }))
        .filter((task) => includesUser(task.assignedTo, userProfile.uid));

      setTasks(list as TaskItem[]);
    });

    const unsubTickets = onValue(ticketsRef, (snapshot) => {
      if (!snapshot.exists()) {
        setTickets([]);
        return;
      }

      const list = Object.entries(snapshot.val() as Record<string, any>)
        .map(([id, value]) => ({ id, ...(value as Record<string, any>) }))
        .filter((ticket) => includesUser(ticket.assignedTo, userProfile.uid));

      setTickets(list as TicketItem[]);
    });

    setLoading(false);
    return () => {
      unsubProfile();
      unsubProjects();
      unsubTasks();
      unsubTickets();
    };
  }, [userProfile?.uid]);

  const joinDateText = useMemo(() => {
    const value =
      profileData?.joinDate ||
      profileData?.hireDate ||
      profileData?.createdAt;
    return formatDate(value);
  }, [profileData?.createdAt, profileData?.hireDate, profileData?.joinDate]);

  const totalProjects = projects.length;
  const completedProjects = projects.filter((project) => project.status === "completed").length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const totalTickets = tickets.length;
  const resolvedTickets = tickets.filter((ticket) => ["closed", "completed"].includes(ticket.status || "")).length;

  const recentTasks = [...tasks]
    .sort((a, b) => {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      return dateA - dateB;
    })
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">My Profile</h2>
        <p className="text-gray-400 mt-1">View your personal details and work summary.</p>
      </div>

      <Card className="bg-gray-900 border-gray-800 p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <Avatar className="h-24 w-24 border-2 border-gray-700">
            <AvatarImage src={profileData?.profilePicture || "/placeholder-user.jpg"} />
            <AvatarFallback className="text-2xl bg-gray-800 text-white">
              {(profileData?.name || userProfile?.name || "U").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="text-white">
              <p className="text-xs text-gray-500">Full Name</p>
              <p className="font-semibold">{profileData?.name || userProfile?.name || "Not available"}</p>
            </div>
            <div className="text-white">
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-semibold break-all">{profileData?.email || userProfile?.email || "Not available"}</p>
            </div>
            <div className="text-white">
              <p className="text-xs text-gray-500">Role</p>
              <Badge className="mt-1 bg-blue-900/30 text-blue-300 border border-blue-700/40 capitalize">
                {profileData?.role || userProfile?.role || "staff"}
              </Badge>
            </div>
            <div className="text-white">
              <p className="text-xs text-gray-500">Department</p>
              <p className="font-semibold">{profileData?.department || userProfile?.department || "Not available"}</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-orange-400" />
            <div>
              <p className="text-xs text-gray-500">Joined Date</p>
              <p className="text-white font-semibold">{joinDateText}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-gray-900 border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <Building className="h-5 w-5 text-blue-400" />
            <div>
              <p className="text-xs text-gray-500">Employee ID</p>
              <p className="text-white font-semibold">{profileData?.employeeId || userProfile?.employeeId || "Not available"}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-gray-900 border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-emerald-400" />
            <div>
              <p className="text-xs text-gray-500">Timezone</p>
              <p className="text-white font-semibold">{profileData?.timezone || userProfile?.timezone || "Asia/Colombo"}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-gray-900 border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-purple-400" />
            <div>
              <p className="text-xs text-gray-500">Date of Birth</p>
              <p className="text-white font-semibold">{formatDate(profileData?.dateOfBirth || userProfile?.dateOfBirth)}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-900 border-gray-800 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Projects</p>
              <p className="text-3xl text-white font-bold">{totalProjects}</p>
              <p className="text-xs text-gray-500 mt-1">{completedProjects} completed</p>
            </div>
            <FolderOpen className="h-8 w-8 text-blue-400" />
          </div>
        </Card>
        <Card className="bg-gray-900 border-gray-800 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Tasks</p>
              <p className="text-3xl text-white font-bold">{totalTasks}</p>
              <p className="text-xs text-gray-500 mt-1">{completedTasks} completed</p>
            </div>
            <ClipboardList className="h-8 w-8 text-orange-400" />
          </div>
        </Card>
        <Card className="bg-gray-900 border-gray-800 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Tickets</p>
              <p className="text-3xl text-white font-bold">{totalTickets}</p>
              <p className="text-xs text-gray-500 mt-1">{resolvedTickets} resolved</p>
            </div>
            <Ticket className="h-8 w-8 text-emerald-400" />
          </div>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Assigned Tasks</h3>
        <div className="space-y-3">
          {recentTasks.length === 0 ? (
            <p className="text-sm text-gray-500">No task history available.</p>
          ) : (
            recentTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-800 bg-gray-900/60">
                <div>
                  <p className="text-white font-medium">{task.title || "Untitled Task"}</p>
                  <p className="text-xs text-gray-500">Due: {formatDate(task.dueDate)}</p>
                </div>
                <Badge className="bg-gray-800 text-gray-300 border border-gray-700 capitalize">
                  {task.status || "pending"}
                </Badge>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
