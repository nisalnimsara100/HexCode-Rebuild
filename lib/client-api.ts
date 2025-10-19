// Client-side API simulation utilities
export const clientAPI = {
  // Simulate fetching client projects
  async getProjects(clientId: string) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In production, this would be:
    // const response = await fetch(`/api/clients/${clientId}/projects`);
    // return response.json();
    
    return [
      {
        id: "1",
        name: "E-Commerce Platform",
        status: "in-progress",
        progress: 65,
        startDate: "2024-01-15",
        estimatedCompletion: "2024-03-15",
        budget: 45000,
        spent: 29250,
        team: ["John Doe", "Jane Smith", "Mike Johnson"],
        description: "Full-featured e-commerce platform with payment integration",
        technologies: ["React", "Node.js", "MongoDB", "Stripe"],
        priority: "high",
        lastUpdate: "2 hours ago"
      },
      {
        id: "2",
        name: "Mobile App Development",
        status: "planning",
        progress: 15,
        startDate: "2024-02-01",
        estimatedCompletion: "2024-05-01",
        budget: 35000,
        spent: 5250,
        team: ["Sarah Wilson", "Tom Brown"],
        description: "Cross-platform mobile application for iOS and Android",
        technologies: ["React Native", "Firebase", "TypeScript"],
        priority: "medium",
        lastUpdate: "1 day ago"
      }
    ];
  },

  // Simulate fetching client activities
  async getActivities(clientId: string) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      { id: 1, type: "update", message: "Project milestone completed: Frontend Development", time: "2 hours ago", project: "E-Commerce Platform" },
      { id: 2, type: "message", message: "New message from project manager", time: "4 hours ago", project: "Mobile App Development" },
      { id: 3, type: "payment", message: "Invoice payment received: $15,000", time: "1 day ago", project: "E-Commerce Platform" },
      { id: 4, type: "document", message: "Project documentation updated", time: "2 days ago", project: "Company Website Redesign" },
      { id: 5, type: "meeting", message: "Weekly standup meeting scheduled", time: "3 days ago", project: "Mobile App Development" }
    ];
  },

  // Simulate fetching client notifications
  async getNotifications(clientId: string) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return [
      { id: 1, title: "Project Update Available", message: "E-Commerce Platform has reached 65% completion", type: "info", time: "1 hour ago" },
      { id: 2, title: "Payment Reminder", message: "Invoice #INV-2024-001 is due in 3 days", type: "warning", time: "2 hours ago" },
      { id: 3, title: "Meeting Scheduled", message: "Project review meeting tomorrow at 2 PM", type: "info", time: "1 day ago" }
    ];
  }
};