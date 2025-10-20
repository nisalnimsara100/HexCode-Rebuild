"use client";

import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from '@/lib/firebase';

interface Project {
  id: string;
  clientId: string;
  name: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  budget: {
    total: number;
    spent: number;
    remaining: number;
    currency: string;
  };
  timeline: {
    startDate: string;
    expectedEndDate: string;
    actualEndDate?: string;
    estimatedHours: number;
    spentHours: number;
  };
  team: {
    projectManager: string;
    leadDeveloper: string;
    members: string[];
  };
  technologies: string[];
  repository?: {
    url: string;
    branch: string;
    lastCommit: string;
  };
  roadmap?: {
    phases: Array<{
      id: string;
      name: string;
      description: string;
      status: string;
      startDate: string;
      endDate: string;
      progress?: number;
      deliverables: string[];
      milestones: Array<{
        id: string;
        name: string;
        description: string;
        dueDate: string;
        status: string;
        completedDate?: string;
        progress?: number;
      }>;
    }>;
    dependencies: Array<{
      from: string;
      to: string;
      type: string;
      description?: string;
    }>;
    criticalPath?: string[];
    risks?: Array<{
      id: string;
      description: string;
      impact: string;
      probability: string;
      mitigation: string;
      owner: string;
    }>;
  };
  communications?: Array<{
    id: string;
    type: string;
    subject: string;
    date: string;
    participants?: string[];
    summary: string;
    actionItems?: Array<{
      item: string;
      assignee: string;
      dueDate: string;
      status: string;
    }>;
    from?: string;
    to?: string[];
    duration?: string;
    attachments?: string[];
  }>;
  documents?: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    version: string;
    uploadDate: string;
    uploadedBy: string;
  }>;
  metrics?: {
    codeQuality: {
      coverage: number;
      complexity: string;
      bugs: number;
      vulnerabilities: number;
    };
    performance: {
      responseTime: string;
      throughput: string;
      uptime: string;
    };
  };
}

interface Client {
  uid: string;
  email: string;
  name: string;
  company: string;
  phone: string;
  profilePicture: string;
  role: string;
  joinDate: string;
  projects: string[];
}

export const useClientProjects = (userEmail?: string) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientData, setClientData] = useState<Client | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      setError('No user email provided');
      return;
    }

    setLoading(true);
    setError(null);

    // First, find the client by email
    const clientsRef = ref(database, 'clients');
    
    const unsubscribeClients = onValue(clientsRef, (snapshot) => {
      try {
        if (snapshot.exists()) {
          const clientsData = snapshot.val();
          const client = Object.values(clientsData as Record<string, Client>)
            .find((client) => client.email === userEmail);

          if (client && client.projects) {
            setClientData(client);
            
            // Fetch notifications for the client
            const notificationsRef = ref(database, `notifications/${client.uid}`);
            onValue(notificationsRef, (notifSnapshot) => {
              if (notifSnapshot.exists()) {
                const notifData = notifSnapshot.val();
                setNotifications(Array.isArray(notifData) ? notifData : Object.values(notifData));
              } else {
                setNotifications([]);
              }
            });
            
            // Now fetch the projects
            const projectsRef = ref(database, 'projects');
            
            const unsubscribeProjects = onValue(projectsRef, (projectSnapshot) => {
              try {
                if (projectSnapshot.exists()) {
                  const projectsData = projectSnapshot.val();
                  const clientProjects = client.projects
                    .map((projectId: string) => ({
                      id: projectId,
                      ...projectsData[projectId]
                    }))
                    .filter(project => project.id && project.name); // Filter out incomplete projects

                  setProjects(clientProjects);
                } else {
                  console.warn('No projects data found in database');
                  setProjects([]);
                }
                setLoading(false);
              } catch (error) {
                console.error('Error processing projects data:', error);
                setError('Failed to process projects data');
                setLoading(false);
              }
            }, (error) => {
              console.error('Error fetching projects:', error);
              setError('Failed to fetch projects from database');
              setLoading(false);
            });

            // Cleanup function will handle unsubscribing from projects
            return () => {
              off(projectsRef, 'value', unsubscribeProjects);
            };
          } else {
            console.warn(`No client found with email: ${userEmail} or no projects associated`);
            setProjects([]);
            setClientData(null);
            setLoading(false);
          }
        } else {
          console.warn('No clients data found in database');
          setError('No client data found');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error processing client data:', error);
        setError('Failed to process client data');
        setLoading(false);
      }
    }, (error) => {
      console.error('Error fetching clients:', error);
      setError('Failed to fetch client data from database');
      setLoading(false);
    });

    // Cleanup function
    return () => {
      off(clientsRef, 'value', unsubscribeClients);
    };
  }, [userEmail]);

  const refreshProjects = () => {
    if (userEmail) {
      setLoading(true);
      setError(null);
      // The useEffect will handle the refetch when loading state changes
    }
  };

  return {
    projects,
    loading,
    error,
    clientData,
    notifications,
    refreshProjects
  };
};

// Hook to get a specific project by ID with real-time updates
export const useProject = (projectId: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const projectRef = ref(database, `projects/${projectId}`);
    
    const unsubscribe = onValue(projectRef, (snapshot) => {
      try {
        if (snapshot.exists()) {
          const projectData = snapshot.val();
          setProject({
            id: projectId,
            ...projectData
          });
        } else {
          setProject(null);
          setError('Project not found');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error processing project data:', error);
        setError('Failed to process project data');
        setLoading(false);
      }
    }, (error) => {
      console.error('Error fetching project:', error);
      setError('Failed to fetch project data');
      setLoading(false);
    });

    return () => {
      off(projectRef, 'value', unsubscribe);
    };
  }, [projectId]);

  return {
    project,
    loading,
    error
  };
};