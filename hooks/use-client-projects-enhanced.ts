"use client";

import { useState, useEffect, useCallback } from "react";
import { ref, get, set, push, remove, update, onValue, off } from "firebase/database";
import { database } from "@/lib/firebase";

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completedDate?: string;
  status: "pending" | "in-progress" | "completed" | "delayed";
  deliverables: string[];
  stakeholders: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  avatar?: string;
  skills: string[];
  availability: number;
  hourlyRate: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  assignedTo: string;
  priority: "low" | "medium" | "high" | "critical";
  estimatedHours: number;
  actualHours: number;
  startDate: string;
  endDate: string;
  tags: string[];
  category: string;
  dependencies: string[];
  attachments: Array<{
    name: string;
    url: string;
    type: string;
    uploadedBy: string;
    uploadedDate: string;
  }>;
}

export interface Timeline {
  startDate: string;
  endDate: string;
  estimatedHours: number;
  actualHours: number;
  completion?: number;
  milestones: Milestone[];
}

export interface Finances {
  totalBudget: number;
  paidAmount: number;
  remainingAmount: number;
  paymentSchedule: Array<{
    milestone: string;
    amount: number;
    dueDate: string;
    paidDate?: string;
    status: "pending" | "paid" | "overdue";
  }>;
}

export interface ClientProject {
  id: string;
  name: string;
  description: string;
  clientId: string;
  status: "planning" | "in-progress" | "on-hold" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "critical";
  type: "web-application" | "mobile-app" | "desktop-app" | "api" | "consulting" | "other";
  projectValue: number;
  currency: string;
  timeline: Timeline;
  team: {
    projectManager: TeamMember;
    technicalLead: TeamMember;
    developers: TeamMember[];
    designer?: TeamMember;
  };
  tasks: Task[];
  technologies: string[];
  deliverables: {
    completed: Array<{
      name: string;
      description: string;
      deliveryDate: string;
      type: string;
      downloadUrl?: string;
    }>;
    pending: Array<{
      name: string;
      description: string;
      expectedDate: string;
      type: string;
    }>;
  };
  finances: Finances;
  communications: Array<{
    id: string;
    type: "meeting" | "email" | "demo" | "call";
    title: string;
    date: string;
    participants: string[];
    summary: string;
    attachments?: string[];
  }>;
  risks: Array<{
    id: string;
    title: string;
    description: string;
    probability: "low" | "medium" | "high";
    impact: "low" | "medium" | "high";
    status: "open" | "mitigated" | "resolved";
    mitigation: string;
  }>;
  feedback?: {
    clientRating: number;
    clientTestimonial: string;
    internalLessonsLearned: string[];
  };
}

export function useClientProjectsEnhanced() {
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projectsRef = ref(database, 'projects');
      const snapshot = await get(projectsRef);
      
      if (snapshot.exists()) {
        const projectsData = snapshot.val();
        const projectsList = Object.keys(projectsData).map(key => ({
          id: key,
          ...projectsData[key]
        }));
        setProjects(projectsList);
      } else {
        setProjects([]);
      }
    } catch (err) {
      setError("Failed to fetch projects");
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create new project
  const createProject = async (projectData: Omit<ClientProject, 'id'>) => {
    try {
      const projectsRef = ref(database, 'projects');
      const newProjectRef = push(projectsRef);
      const projectWithId = {
        ...projectData,
        id: newProjectRef.key
      };
      
      await set(newProjectRef, projectWithId);
      await fetchProjects(); // Refresh the list
      return newProjectRef.key;
    } catch (err) {
      setError("Failed to create project");
      console.error("Error creating project:", err);
      throw err;
    }
  };

  // Update project
  const updateProject = async (projectId: string, updates: Partial<ClientProject>) => {
    try {
      const projectRef = ref(database, `projects/${projectId}`);
      await update(projectRef, updates);
      await fetchProjects(); // Refresh the list
    } catch (err) {
      setError("Failed to update project");
      console.error("Error updating project:", err);
      throw err;
    }
  };

  // Delete project
  const deleteProject = async (projectId: string) => {
    try {
      const projectRef = ref(database, `projects/${projectId}`);
      await remove(projectRef);
      await fetchProjects(); // Refresh the list
    } catch (err) {
      setError("Failed to delete project");
      console.error("Error deleting project:", err);
      throw err;
    }
  };

  // Add milestone to project
  const addMilestone = async (projectId: string, milestone: Omit<Milestone, 'id'>) => {
    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) throw new Error("Project not found");

      const newMilestone = {
        ...milestone,
        id: `milestone_${Date.now()}`
      };

      const updatedMilestones = [...project.timeline.milestones, newMilestone];
      await updateProject(projectId, {
        timeline: {
          ...project.timeline,
          milestones: updatedMilestones
        }
      });
    } catch (err) {
      setError("Failed to add milestone");
      console.error("Error adding milestone:", err);
      throw err;
    }
  };

  // Update milestone
  const updateMilestone = async (projectId: string, milestoneId: string, updates: Partial<Milestone>) => {
    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) throw new Error("Project not found");

      const updatedMilestones = project.timeline.milestones.map(m =>
        m.id === milestoneId ? { ...m, ...updates } : m
      );

      await updateProject(projectId, {
        timeline: {
          ...project.timeline,
          milestones: updatedMilestones
        }
      });
    } catch (err) {
      setError("Failed to update milestone");
      console.error("Error updating milestone:", err);
      throw err;
    }
  };

  // Add task to project
  const addTask = async (projectId: string, task: Omit<Task, 'id'>) => {
    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) throw new Error("Project not found");

      const newTask = {
        ...task,
        id: `task_${Date.now()}`
      };

      const updatedTasks = [...project.tasks, newTask];
      await updateProject(projectId, { tasks: updatedTasks });
    } catch (err) {
      setError("Failed to add task");
      console.error("Error adding task:", err);
      throw err;
    }
  };

  // Update task
  const updateTask = async (projectId: string, taskId: string, updates: Partial<Task>) => {
    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) throw new Error("Project not found");

      const updatedTasks = project.tasks.map(t =>
        t.id === taskId ? { ...t, ...updates } : t
      );

      await updateProject(projectId, { tasks: updatedTasks });
    } catch (err) {
      setError("Failed to update task");
      console.error("Error updating task:", err);
      throw err;
    }
  };

  // Get project by ID
  const getProject = (projectId: string) => {
    return projects.find(p => p.id === projectId);
  };

  // Get projects by client
  const getProjectsByClient = (clientId: string) => {
    return projects.filter(p => p.clientId === clientId);
  };

  // Get projects by status
  const getProjectsByStatus = (status: ClientProject['status']) => {
    return projects.filter(p => p.status === status);
  };

  // Calculate project progress
  const calculateProgress = (project: ClientProject) => {
    if (project.tasks.length === 0) return 0;
    const completedTasks = project.tasks.filter(t => t.completed).length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    addMilestone,
    updateMilestone,
    addTask,
    updateTask,
    getProject,
    getProjectsByClient,
    getProjectsByStatus,
    calculateProgress
  };
}