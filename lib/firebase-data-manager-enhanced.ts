import { ref, get, set, push, update } from "firebase/database";
import { database } from "@/lib/firebase";

// Enhanced Firebase data management utilities for client project system
export class FirebaseDataManager {
  
  // Client-related operations
  static async getClientProfile(clientId: string) {
    try {
      const clientRef = ref(database, `clients/${clientId}`);
      const snapshot = await get(clientRef);
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      console.error('Error fetching client profile:', error);
      throw error;
    }
  }

  static async updateClientProfile(clientId: string, profileData: any) {
    try {
      const clientRef = ref(database, `clients/${clientId}`);
      await update(clientRef, profileData);
      return true;
    } catch (error) {
      console.error('Error updating client profile:', error);
      throw error;
    }
  }

  // Project-related operations
  static async getClientProjects(clientId: string) {
    try {
      const client = await this.getClientProfile(clientId);
      if (!client || !client.projects) {
        return [];
      }

      const projectPromises = client.projects.map(async (projectId: string) => {
        const projectRef = ref(database, `projects/${projectId}`);
        const snapshot = await get(projectRef);
        return snapshot.exists() ? { id: projectId, ...snapshot.val() } : null;
      });

      const projects = await Promise.all(projectPromises);
      return projects.filter(project => project !== null);
    } catch (error) {
      console.error('Error fetching client projects:', error);
      throw error;
    }
  }

  static async getProjectDetails(projectId: string) {
    try {
      const projectRef = ref(database, `projects/${projectId}`);
      const snapshot = await get(projectRef);
      return snapshot.exists() ? { id: projectId, ...snapshot.val() } : null;
    } catch (error) {
      console.error('Error fetching project details:', error);
      throw error;
    }
  }

  static async updateProject(projectId: string, projectData: any) {
    try {
      const projectRef = ref(database, `projects/${projectId}`);
      await update(projectRef, projectData);
      return true;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  // Roadmap and milestone operations
  static async getProjectRoadmap(projectId: string) {
    try {
      const projectRef = ref(database, `projects/${projectId}/roadmap`);
      const snapshot = await get(projectRef);
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      console.error('Error fetching project roadmap:', error);
      throw error;
    }
  }

  static async updateMilestone(projectId: string, milestoneId: string, milestoneData: any) {
    try {
      // Find the phase containing this milestone
      const roadmap = await this.getProjectRoadmap(projectId);
      if (!roadmap?.phases) return false;

      for (let phase of roadmap.phases) {
        const milestoneIndex = phase.milestones?.findIndex((m: any) => m.id === milestoneId);
        if (milestoneIndex !== -1) {
          const milestoneRef = ref(database, `projects/${projectId}/roadmap/phases/${phase.id}/milestones/${milestoneIndex}`);
          await update(milestoneRef, milestoneData);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error updating milestone:', error);
      throw error;
    }
  }

  // Communication operations
  static async getProjectCommunications(projectId: string) {
    try {
      const projectRef = ref(database, `projects/${projectId}/communications`);
      const snapshot = await get(projectRef);
      return snapshot.exists() ? snapshot.val() : [];
    } catch (error) {
      console.error('Error fetching project communications:', error);
      throw error;
    }
  }

  static async addCommunication(projectId: string, communicationData: any) {
    try {
      const communicationsRef = ref(database, `projects/${projectId}/communications`);
      const newCommRef = push(communicationsRef);
      await set(newCommRef, {
        id: newCommRef.key,
        ...communicationData,
        date: new Date().toISOString()
      });
      return newCommRef.key;
    } catch (error) {
      console.error('Error adding communication:', error);
      throw error;
    }
  }

  // Task operations
  static async getProjectTasks(projectId: string) {
    try {
      const tasksRef = ref(database, 'tasks');
      const snapshot = await get(tasksRef);
      
      if (!snapshot.exists()) return [];
      
      const allTasks = snapshot.val();
      const projectTasks = Object.values(allTasks).filter((task: any) => task.projectId === projectId);
      return projectTasks;
    } catch (error) {
      console.error('Error fetching project tasks:', error);
      throw error;
    }
  }

  static async updateTask(taskId: string, taskData: any) {
    try {
      const taskRef = ref(database, `tasks/${taskId}`);
      await update(taskRef, taskData);
      return true;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  // Financial operations
  static async getProjectFinancials(projectId: string) {
    try {
      const financialRef = ref(database, `financials/${projectId}`);
      const snapshot = await get(financialRef);
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      console.error('Error fetching project financials:', error);
      throw error;
    }
  }

  // Notification operations
  static async getClientNotifications(clientId: string) {
    try {
      const notificationRef = ref(database, `notifications/${clientId}`);
      const snapshot = await get(notificationRef);
      return snapshot.exists() ? snapshot.val() : [];
    } catch (error) {
      console.error('Error fetching client notifications:', error);
      throw error;
    }
  }

  static async markNotificationAsRead(clientId: string, notificationId: string) {
    try {
      const notificationRef = ref(database, `notifications/${clientId}/${notificationId}/read`);
      await set(notificationRef, true);
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Team and staff operations
  static async getProjectTeam(projectId: string) {
    try {
      const project = await this.getProjectDetails(projectId);
      if (!project?.team) return [];

      const teamPromises = project.team.members.map(async (staffId: string) => {
        const staffRef = ref(database, `staff/${staffId}`);
        const snapshot = await get(staffRef);
        return snapshot.exists() ? { id: staffId, ...snapshot.val() } : null;
      });

      const teamMembers = await Promise.all(teamPromises);
      return teamMembers.filter(member => member !== null);
    } catch (error) {
      console.error('Error fetching project team:', error);
      throw error;
    }
  }

  // Report operations
  static async getWeeklyReport(projectId: string, week: string) {
    try {
      const reportRef = ref(database, `reports/weekly/${week}/projects/${projectId}`);
      const snapshot = await get(reportRef);
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      console.error('Error fetching weekly report:', error);
      throw error;
    }
  }

  // Analytics and metrics
  static async getProjectMetrics(projectId: string) {
    try {
      const project = await this.getProjectDetails(projectId);
      return project?.metrics || null;
    } catch (error) {
      console.error('Error fetching project metrics:', error);
      throw error;
    }
  }

  // Batch operations for efficiency
  static async getClientDashboardData(clientId: string) {
    try {
      const [profile, projects, notifications] = await Promise.all([
        this.getClientProfile(clientId),
        this.getClientProjects(clientId),
        this.getClientNotifications(clientId)
      ]);

      // Get additional data for each project
      const enhancedProjects = await Promise.all(
        projects.map(async (project) => {
          const [roadmap, tasks, financials, team] = await Promise.all([
            this.getProjectRoadmap(project.id),
            this.getProjectTasks(project.id),
            this.getProjectFinancials(project.id),
            this.getProjectTeam(project.id)
          ]);

          return {
            ...project,
            roadmap,
            tasks,
            financials,
            team: { ...project.team, memberDetails: team }
          };
        })
      );

      return {
        profile,
        projects: enhancedProjects,
        notifications,
        totalBudget: enhancedProjects.reduce((sum, p) => sum + (p.budget?.total || 0), 0),
        totalSpent: enhancedProjects.reduce((sum, p) => sum + (p.budget?.spent || 0), 0),
        activeProjects: enhancedProjects.filter(p => p.status === 'in-progress').length,
        completedMilestones: enhancedProjects.reduce((sum, p) => {
          if (!p.roadmap?.phases) return sum;
          return sum + p.roadmap.phases.reduce((phaseSum: number, phase: any) => {
            return phaseSum + (phase.milestones?.filter((m: any) => m.status === 'completed').length || 0);
          }, 0);
        }, 0)
      };
    } catch (error) {
      console.error('Error fetching client dashboard data:', error);
      throw error;
    }
  }

  // Initialize database with sample data
  static async initializeWithSampleData() {
    try {
      // This would be used to populate the database with the enhanced structure
      // In a real application, you'd load this from the JSON file
      const sampleData = require('../firebase-database-structure-enhanced.json');
      
      const rootRef = ref(database);
      await set(rootRef, sampleData);
      
      console.log('Database initialized with sample data');
      return true;
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  // Fetch authenticated user's profile and projects
  static async getAuthenticatedUserData() {
    try {
      // Check localStorage for clientProfile
      const storedProfile = localStorage.getItem('clientProfile');
      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        if (profile.role === 'client') {
          const projects = await this.getClientProjects(profile.id);
          return { profile, projects };
        }
      }

      // Fallback to Firebase Authentication
      const auth = (await import('@/lib/firebase')).auth;
      const user = auth.currentUser;
      if (user) {
        const clientId = user.uid;
        const profile = await this.getClientProfile(clientId);
        const projects = await this.getClientProjects(clientId);
        return { profile, projects };
      }

      return null;
    } catch (error) {
      console.error('Error fetching authenticated user data:', error);
      throw error;
    }
  }
}

// Export for easier importing
export default FirebaseDataManager;