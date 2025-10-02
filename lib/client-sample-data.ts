// Sample data for client dashboard - would be replaced with real API calls

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "planning" | "in-progress" | "review" | "completed" | "on-hold";
  progress: number;
  startDate: string;
  estimatedCompletion: string;
  assignedTeam: string[];
  budget: {
    total: number;
    used: number;
  };
  priority: "low" | "medium" | "high";
  type: "web-development" | "mobile-app" | "e-commerce" | "custom-software";
  techStack: string[];
  milestones: Array<{
    id: string;
    title: string;
    dueDate: string;
    completed: boolean;
    description: string;
  }>;
  recentUpdates: Array<{
    id: string;
    date: string;
    update: string;
    author: string;
  }>;
}

export const sampleProjects: Project[] = [
  {
    id: "1",
    name: "E-Commerce Platform",
    description: "Modern e-commerce platform with advanced features including inventory management, multi-vendor support, and integrated payment processing.",
    status: "in-progress",
    progress: 65,
    startDate: "2024-01-15",
    estimatedCompletion: "2024-04-15",
    assignedTeam: ["John Doe", "Sarah Wilson", "Mike Chen"],
    budget: {
      total: 25000,
      used: 16250
    },
    priority: "high",
    type: "e-commerce",
    techStack: ["Next.js", "TypeScript", "Stripe", "PostgreSQL", "Redis"],
    milestones: [
      {
        id: "m1",
        title: "Frontend Development",
        dueDate: "2024-02-28",
        completed: true,
        description: "Complete responsive frontend with shopping cart and user authentication"
      },
      {
        id: "m2",
        title: "Backend API",
        dueDate: "2024-03-15",
        completed: true,
        description: "REST API with product management and order processing"
      },
      {
        id: "m3",
        title: "Payment Integration",
        dueDate: "2024-03-30",
        completed: false,
        description: "Stripe payment gateway integration with multi-currency support"
      },
      {
        id: "m4",
        title: "Testing & Launch",
        dueDate: "2024-04-15",
        completed: false,
        description: "Comprehensive testing and production deployment"
      }
    ],
    recentUpdates: [
      {
        id: "u1",
        date: "2024-01-20",
        update: "Frontend components completed. Moving to backend development phase.",
        author: "Sarah Wilson"
      },
      {
        id: "u2",
        date: "2024-01-18",
        update: "UI/UX design approved by client. Ready to start development.",
        author: "John Doe"
      },
      {
        id: "u3",
        date: "2024-01-16",
        update: "Project kickoff meeting completed. Requirements finalized.",
        author: "Mike Chen"
      }
    ]
  },
  {
    id: "2",
    name: "Mobile Fitness App",
    description: "Cross-platform mobile application for fitness tracking with social features, workout plans, and nutrition guidance.",
    status: "planning",
    progress: 15,
    startDate: "2024-02-01",
    estimatedCompletion: "2024-06-30",
    assignedTeam: ["Emma Rodriguez", "David Kim", "Lisa Zhang"],
    budget: {
      total: 35000,
      used: 5250
    },
    priority: "medium",
    type: "mobile-app",
    techStack: ["React Native", "Node.js", "MongoDB", "Firebase", "AWS"],
    milestones: [
      {
        id: "m1",
        title: "App Architecture",
        dueDate: "2024-02-15",
        completed: true,
        description: "Define app architecture and technical specifications"
      },
      {
        id: "m2",
        title: "UI/UX Design",
        dueDate: "2024-03-01",
        completed: false,
        description: "Complete app design and user flow"
      },
      {
        id: "m3",
        title: "Core Features",
        dueDate: "2024-04-15",
        completed: false,
        description: "Implement workout tracking and user profiles"
      },
      {
        id: "m4",
        title: "Beta Testing",
        dueDate: "2024-06-01",
        completed: false,
        description: "Beta release and user feedback collection"
      }
    ],
    recentUpdates: [
      {
        id: "u1",
        date: "2024-02-03",
        update: "Technical requirements gathering in progress. Meeting scheduled with stakeholders.",
        author: "Emma Rodriguez"
      },
      {
        id: "u2",
        date: "2024-02-01",
        update: "Project initiated. Team assigned and initial planning started.",
        author: "David Kim"
      }
    ]
  },
  {
    id: "3",
    name: "Corporate Website Redesign",
    description: "Complete redesign of corporate website with modern design, improved performance, and CMS integration.",
    status: "completed",
    progress: 100,
    startDate: "2023-11-01",
    estimatedCompletion: "2024-01-15",
    assignedTeam: ["Alex Thompson", "Maria Garcia"],
    budget: {
      total: 15000,
      used: 14750
    },
    priority: "low",
    type: "web-development",
    techStack: ["Next.js", "Tailwind CSS", "Contentful", "Vercel"],
    milestones: [
      {
        id: "m1",
        title: "Design System",
        dueDate: "2023-11-20",
        completed: true,
        description: "Create comprehensive design system and component library"
      },
      {
        id: "m2",
        title: "Development",
        dueDate: "2023-12-15",
        completed: true,
        description: "Build responsive website with CMS integration"
      },
      {
        id: "m3",
        title: "Content Migration",
        dueDate: "2024-01-05",
        completed: true,
        description: "Migrate all content from old website"
      },
      {
        id: "m4",
        title: "Launch",
        dueDate: "2024-01-15",
        completed: true,
        description: "Production deployment and DNS setup"
      }
    ],
    recentUpdates: [
      {
        id: "u1",
        date: "2024-01-15",
        update: "Project successfully launched! Website is live and performing well.",
        author: "Alex Thompson"
      },
      {
        id: "u2",
        date: "2024-01-10",
        update: "Final testing completed. Ready for launch.",
        author: "Maria Garcia"
      }
    ]
  }
];

// Sample notifications for the client
export interface Notification {
  id: string;
  type: "update" | "milestone" | "payment" | "meeting";
  title: string;
  message: string;
  date: string;
  read: boolean;
  projectId?: string;
}

export const sampleNotifications: Notification[] = [
  {
    id: "n1",
    type: "milestone",
    title: "Milestone Completed",
    message: "Frontend Development milestone completed for E-Commerce Platform project.",
    date: "2024-01-20",
    read: false,
    projectId: "1"
  },
  {
    id: "n2",
    type: "update",
    title: "Project Update",
    message: "Mobile Fitness App project has entered the planning phase with requirements gathering.",
    date: "2024-01-19",
    read: false,
    projectId: "2"
  },
  {
    id: "n3",
    type: "payment",
    title: "Invoice Ready",
    message: "Monthly invoice for January 2024 is ready for review and payment.",
    date: "2024-01-18",
    read: true
  },
  {
    id: "n4",
    type: "meeting",
    title: "Upcoming Meeting",
    message: "Weekly project review meeting scheduled for Friday at 2:00 PM.",
    date: "2024-01-17",
    read: true
  }
];

// Helper functions
export const getStatusColor = (status: Project["status"]) => {
  switch (status) {
    case "planning":
      return "from-blue-500 to-cyan-600";
    case "in-progress":
      return "from-orange-500 to-red-600";
    case "review":
      return "from-yellow-500 to-orange-600";
    case "completed":
      return "from-green-500 to-emerald-600";
    case "on-hold":
      return "from-gray-500 to-gray-600";
    default:
      return "from-gray-500 to-gray-600";
  }
};

export const getPriorityColor = (priority: Project["priority"]) => {
  switch (priority) {
    case "high":
      return "text-red-400 bg-red-500/20";
    case "medium":
      return "text-yellow-400 bg-yellow-500/20";
    case "low":
      return "text-green-400 bg-green-500/20";
    default:
      return "text-gray-400 bg-gray-500/20";
  }
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};