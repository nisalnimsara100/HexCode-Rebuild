"use client";

import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '@/lib/firebase';

interface TeamMember {
  id: string;
  name: string;
  role: string;
}

interface RoadmapPhase {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'upcoming' | 'not-started';
  tasks: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
  dependencies: string[];
  duration: string;
  priority: string;
  category: string;
  position: { x: number; y: number };
  color: string;
  radius: number;
  progress?: number;
}

export interface FirebaseClientProject {
  email: string;
  id: string;
  name: string;
  description: string;
  startDate: string;
  dueDate: string;
  budget: number;
  nextMilestone: string;
  progress: number;
  teamMembers: TeamMember[];
  technologies: string[];
  roadmap: RoadmapPhase[];
  status?: string;
  priority?: string;
  currency?: string;
}

export function useFirebaseClientProjects(userEmail?: string) {
  const [projects, setProjects] = useState<FirebaseClientProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Transform Firebase roadmap phases to match your desired format
  const transformRoadmapPhases = (firebasePhases: any[]): RoadmapPhase[] => {
    if (!firebasePhases || !Array.isArray(firebasePhases)) {
      return [];
    }

    return firebasePhases.map((phase, index) => ({
      id: phase.id || `phase-${index}`,
      title: phase.name || phase.title || 'Unnamed Phase',
      description: phase.description || '',
      status: mapFirebaseStatusToRoadmapStatus(phase.status),
      tasks: transformDeliverablesToTasks(phase.deliverables || [], phase.status),
      dependencies: phase.dependencies || [],
      duration: calculatePhaseDuration(phase.startDate, phase.endDate),
      priority: 'high',
      category: mapPhaseToCategory(phase.name || phase.title || ''),
      position: { 
        x: 200 + (index * 250), 
        y: 150 + (index % 2 === 0 ? 0 : 100) 
      },
      color: getPhaseColor(phase.status),
      radius: 40,
      progress: phase.progress || (phase.status === 'completed' ? 100 : phase.status === 'in-progress' ? 50 : 0)
    }));
  };

  // Helper functions
  const mapFirebaseStatusToRoadmapStatus = (status: string): 'completed' | 'in-progress' | 'upcoming' | 'not-started' => {
    switch (status) {
      case 'completed': return 'completed';
      case 'in-progress': return 'in-progress';
      case 'not-started': return 'not-started';
      default: return 'upcoming';
    }
  };

  const transformDeliverablesToTasks = (deliverables: string[], phaseStatus: string) => {
    return deliverables.map((deliverable, index) => ({
      id: `task-${index}`,
      title: deliverable,
      completed: phaseStatus === 'completed'
    }));
  };

  const calculatePhaseDuration = (startDate?: string, endDate?: string): string => {
    if (!startDate || !endDate) return '2 weeks';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.ceil(diffDays / 7);
    
    return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''}`;
  };

  const mapPhaseToCategory = (phaseName: string): string => {
    const name = phaseName.toLowerCase();
    if (name.includes('design') || name.includes('ui') || name.includes('ux')) return 'design';
    if (name.includes('develop') || name.includes('code') || name.includes('implement')) return 'development';
    if (name.includes('test') || name.includes('qa') || name.includes('quality')) return 'testing';
    if (name.includes('deploy') || name.includes('launch') || name.includes('release')) return 'deployment';
    return 'design';
  };

  const getPhaseColor = (status: string): string => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#f59e0b';
      case 'not-started': return '#6b7280';
      default: return '#6366f1';
    }
  };

  const transformTeamMembers = (firebaseTeam: any): TeamMember[] => {
    if (!firebaseTeam) return [];
    
    const members: TeamMember[] = [];
    
    if (firebaseTeam.projectManager) {
      members.push({
        id: 'pm',
        name: 'Project Manager',
        role: 'Project Manager'
      });
    }
    
    if (firebaseTeam.leadDeveloper || firebaseTeam.technicalLead) {
      members.push({
        id: 'tl',
        name: 'Technical Lead',
        role: 'Technical Lead'
      });
    }
    
    if (firebaseTeam.members && Array.isArray(firebaseTeam.members)) {
      firebaseTeam.members.forEach((memberId: string, index: number) => {
        members.push({
          id: memberId,
          name: `Developer ${index + 1}`,
          role: 'Developer'
        });
      });
    }
    
    return members;
  };

  const calculateProjectProgress = (roadmapPhases: any[]): number => {
    if (!roadmapPhases || roadmapPhases.length === 0) return 0;
    
    let totalProgress = 0;
    roadmapPhases.forEach(phase => {
      if (phase.status === 'completed') {
        totalProgress += 100;
      } else if (phase.status === 'in-progress') {
        totalProgress += phase.progress || 50;
      }
    });
    
    return Math.round(totalProgress / roadmapPhases.length);
  };

  const getNextMilestone = (roadmapPhases: any[]): string => {
    if (!roadmapPhases || roadmapPhases.length === 0) return 'No milestones';
    
    const nextPhase = roadmapPhases.find(phase => phase.status !== 'completed');
    if (nextPhase) {
      return nextPhase.name || nextPhase.title || 'Next Phase';
    }
    
    return 'Project Completed';
  };

  // Main fetch function
  const fetchClientProjects = async (email: string): Promise<FirebaseClientProject[]> => {
    try {
      console.log('Fetching client projects for email:', email);
      
      // Find the client by email
      const clientsRef = ref(database, 'clients');
      const clientsSnapshot = await get(clientsRef);
      
      if (!clientsSnapshot.exists()) {
        throw new Error('No clients data found in database');
      }
      
      const clientsData = clientsSnapshot.val();
      const client = Object.values(clientsData as Record<string, any>)
        .find((client: any) => client.email === email);
      
      if (!client || !client.projects) {
        console.warn(`No client found with email: ${email} or no projects associated`);
        return [];
      }
      
      // Fetch the projects
      const projectsRef = ref(database, 'projects');
      const projectsSnapshot = await get(projectsRef);
      
      if (!projectsSnapshot.exists()) {
        throw new Error('No projects data found in database');
      }
      
      const projectsData = projectsSnapshot.val();
      
      // Transform Firebase data to match your desired format
      const transformedProjects: FirebaseClientProject[] = client.projects.map((projectId: string) => {
        const firebaseProject = projectsData[projectId];
        
        if (!firebaseProject) {
          console.warn(`Project ${projectId} not found in database`);
          return null;
        }
        
        const roadmapPhases = firebaseProject.roadmap?.phases || [];
        const transformedRoadmap = transformRoadmapPhases(roadmapPhases);
        const progress = calculateProjectProgress(roadmapPhases);
        
        return {
          email: email,
          id: projectId,
          name: firebaseProject.name || 'Unnamed Project',
          description: firebaseProject.description || 'No description available',
          startDate: firebaseProject.timeline?.startDate || new Date().toISOString().split('T')[0],
          dueDate: firebaseProject.timeline?.expectedEndDate || firebaseProject.timeline?.endDate || new Date().toISOString().split('T')[0],
          budget: firebaseProject.budget?.total || 0,
          nextMilestone: getNextMilestone(roadmapPhases),
          progress: progress,
          teamMembers: transformTeamMembers(firebaseProject.team),
          technologies: firebaseProject.technologies || [],
          roadmap: transformedRoadmap,
          status: firebaseProject.status || 'planning',
          priority: firebaseProject.priority || 'medium',
          currency: firebaseProject.budget?.currency || 'USD'
        };
      }).filter(Boolean);
      
      return transformedProjects;
      
    } catch (error) {
      console.error('Error fetching client projects:', error);
      throw error;
    }
  };

  // Load projects on component mount or when userEmail changes
  useEffect(() => {
    const loadProjects = async () => {
      if (!userEmail) {
        setLoading(false);
        setError('No user email provided');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const fetchedProjects = await fetchClientProjects(userEmail);
        setProjects(fetchedProjects);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects');
        console.error('Error loading projects:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [userEmail]);

  // Refresh function
  const refreshProjects = async () => {
    if (userEmail) {
      try {
        setLoading(true);
        setError(null);
        const fetchedProjects = await fetchClientProjects(userEmail);
        setProjects(fetchedProjects);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to refresh projects');
        console.error('Error refreshing projects:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    projects,
    loading,
    error,
    refreshProjects
  };
}