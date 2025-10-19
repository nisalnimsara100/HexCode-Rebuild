/**
 * Firebase Database Import Utility
 * Use this to populate Firebase Realtime Database with sample data
 */

import { ref, set, get } from "firebase/database";
import { database } from "./firebase";
import firebaseData from "../firebase-database-structure.json";

export class FirebaseDataManager {
  
  /**
   * Import all sample data to Firebase Realtime Database
   */
  static async importAllData() {
    try {
      console.log("🔄 Starting Firebase data import...");
      
      // Import clients
      await this.importClients();
      
      // Import projects  
      await this.importProjects();
      
      // Import communications
      await this.importCommunications();
      
      // Import company info
      await this.importCompanyInfo();
      
      // Import settings
      await this.importSettings();
      
      console.log("✅ Firebase data import completed successfully!");
      return { success: true, message: "All data imported successfully" };
      
    } catch (error: any) {
      console.error("❌ Firebase data import failed:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Import client data
   */
  static async importClients() {
    const clientsRef = ref(database, 'clients');
    await set(clientsRef, firebaseData.clients);
    console.log("📝 Clients imported");
  }

  /**
   * Import project data
   */
  static async importProjects() {
    const projectsRef = ref(database, 'projects');
    await set(projectsRef, firebaseData.projects);
    console.log("🚀 Projects imported");
  }

  /**
   * Import communications
   */
  static async importCommunications() {
    const communicationsRef = ref(database, 'communications');
    await set(communicationsRef, firebaseData.communications);
    console.log("💬 Communications imported");
  }

  /**
   * Import company information
   */
  static async importCompanyInfo() {
    const companyRef = ref(database, 'company');
    await set(companyRef, firebaseData.company);
    console.log("🏢 Company info imported");
  }

  /**
   * Import settings and templates
   */
  static async importSettings() {
    const settingsRef = ref(database, 'settings');
    await set(settingsRef, firebaseData.settings);
    
    const templatesRef = ref(database, 'templates');
    await set(templatesRef, firebaseData.templates);
    console.log("⚙️ Settings and templates imported");
  }

  /**
   * Get client projects
   */
  static async getClientProjects(clientId: string) {
    try {
      const clientRef = ref(database, `clients/${clientId}`);
      const clientSnapshot = await get(clientRef);
      
      if (clientSnapshot.exists()) {
        const client = clientSnapshot.val();
        const projectIds = client.projects || [];
        
        const projects = [];
        for (const projectId of projectIds) {
          const projectRef = ref(database, `projects/${projectId}`);
          const projectSnapshot = await get(projectRef);
          if (projectSnapshot.exists()) {
            projects.push(projectSnapshot.val());
          }
        }
        
        return projects;
      }
      return [];
    } catch (error) {
      console.error("Error fetching client projects:", error);
      return [];
    }
  }

  /**
   * Get project details with team and milestones
   */
  static async getProjectDetails(projectId: string) {
    try {
      const projectRef = ref(database, `projects/${projectId}`);
      const projectSnapshot = await get(projectRef);
      
      if (projectSnapshot.exists()) {
        return projectSnapshot.val();
      }
      return null;
    } catch (error) {
      console.error("Error fetching project details:", error);
      return null;
    }
  }

  /**
   * Update project status
   */
  static async updateProjectStatus(projectId: string, status: string, completion?: number) {
    try {
      const updates: any = { status };
      if (completion !== undefined) {
        updates.completion = completion;
      }
      
      const projectStatusRef = ref(database, `projects/${projectId}`);
      await set(projectStatusRef, { ...updates });
      
      return { success: true };
    } catch (error: any) {
      console.error("Error updating project status:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Add new client communication
   */
  static async addCommunication(projectId: string, communication: any) {
    try {
      const commId = `comm_${Date.now()}`;
      const communicationRef = ref(database, `projects/${projectId}/communications/${commId}`);
      
      await set(communicationRef, {
        id: commId,
        ...communication,
        timestamp: new Date().toISOString()
      });
      
      return { success: true, id: commId };
    } catch (error: any) {
      console.error("Error adding communication:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create demo client account with sample projects
   */
  static async createDemoClient(email: string, name: string, company: string) {
    const clientId = `demo_${Date.now()}`;
    
    const demoClient = {
      uid: clientId,
      email,
      name,
      company,
      role: "client",
      joinDate: new Date().toISOString().split('T')[0],
      projects: ["demo_project_001"],
      phone: "+1 (555) 000-0000",
      profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.toLowerCase()}`,
      businessInfo: {
        industry: "Technology",
        companySize: "10-50 employees",
        foundedYear: 2020
      },
      preferences: {
        notifications: {
          email: true,
          sms: false,
          push: true
        },
        communicationPreference: "email",
        timezone: "America/Los_Angeles"
      }
    };

    const demoProject = {
      id: "demo_project_001",
      name: "Demo Project - Website Redesign",
      description: "Modern website redesign with improved user experience and performance optimization",
      clientId: clientId,
      status: "in-progress",
      priority: "high",
      type: "web-application",
      projectValue: 45000,
      currency: "USD",
      timeline: {
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
        estimatedHours: 300,
        actualHours: 120,
        completion: 40
      },
      tasks: [
        {
          id: "demo_task_001",
          title: "UI/UX Design",
          description: "Create modern design mockups and prototypes",
          completed: true,
          priority: "high",
          estimatedHours: 80,
          actualHours: 75,
          tags: ["design", "ui", "ux"]
        },
        {
          id: "demo_task_002", 
          title: "Frontend Development",
          description: "Implement responsive design with modern frameworks",
          completed: false,
          priority: "high",
          estimatedHours: 120,
          actualHours: 45,
          tags: ["frontend", "react", "responsive"]
        }
      ]
    };

    try {
      // Save client
      const clientRef = ref(database, `clients/${clientId}`);
      await set(clientRef, demoClient);
      
      // Save project  
      const projectRef = ref(database, `projects/demo_project_001`);
      await set(projectRef, demoProject);
      
      return { success: true, clientId, client: demoClient };
    } catch (error: any) {
      console.error("Error creating demo client:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Clean up demo data (for development)
   */
  static async cleanupDemoData() {
    try {
      // Remove demo clients and projects
      const clientsRef = ref(database, 'clients');
      const clientsSnapshot = await get(clientsRef);
      
      if (clientsSnapshot.exists()) {
        const clients = clientsSnapshot.val();
        const demoClientIds = Object.keys(clients).filter(id => id.startsWith('demo_'));
        
        for (const clientId of demoClientIds) {
          const clientRef = ref(database, `clients/${clientId}`);
          await set(clientRef, null); // Delete client
        }
      }
      
      const projectsRef = ref(database, 'projects');
      const projectsSnapshot = await get(projectsRef);
      
      if (projectsSnapshot.exists()) {
        const projects = projectsSnapshot.val();
        const demoProjectIds = Object.keys(projects).filter(id => id.startsWith('demo_'));
        
        for (const projectId of demoProjectIds) {
          const projectRef = ref(database, `projects/${projectId}`);
          await set(projectRef, null); // Delete project
        }
      }
      
      console.log("🧹 Demo data cleaned up");
      return { success: true };
    } catch (error: any) {
      console.error("Error cleaning up demo data:", error);
      return { success: false, error: error.message };
    }
  }
}

// Export individual functions for convenience
export const {
  importAllData,
  getClientProjects, 
  getProjectDetails,
  updateProjectStatus,
  addCommunication,
  createDemoClient,
  cleanupDemoData
} = FirebaseDataManager;