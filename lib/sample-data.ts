import { database } from "./firebase";
import { ref, set } from "firebase/database";

// Sample users data
export const sampleUsers = [
  {
    uid: "admin-001",
    email: "admin@hexcode.com",
    firstName: "John",
    lastName: "Admin",
    displayName: "John Admin",
    role: "admin",
    department: "Management",
    employeeId: "ADM001",
    phoneNumber: "+1 (555) 123-4567",
    avatar: "",
    isActive: true,
    permissions: [
      "view_dashboard",
      "view_profile",
      "edit_profile",
      "manage_users",
      "manage_roles",
      "manage_departments",
      "view_analytics",
      "manage_settings",
      "manage_tickets",
      "assign_tickets",
      "delete_tickets",
      "manage_projects",
      "view_all_data"
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    settings: {
      notifications: {
        email: true,
        push: true,
        system: true
      },
      preferences: {
        theme: "dark",
        language: "en",
        timezone: "UTC"
      }
    }
  },
  {
    uid: "manager-001",
    email: "manager@hexcode.com",
    firstName: "Sarah",
    lastName: "Manager",
    displayName: "Sarah Manager",
    role: "manager",
    department: "Engineering",
    employeeId: "MGR001",
    phoneNumber: "+1 (555) 234-5678",
    avatar: "",
    isActive: true,
    permissions: [
      "view_dashboard",
      "view_profile",
      "edit_profile",
      "manage_team",
      "view_team_analytics",
      "manage_tickets",
      "assign_tickets",
      "manage_projects",
      "approve_timesheets"
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    settings: {
      notifications: {
        email: true,
        push: true,
        system: true
      },
      preferences: {
        theme: "dark",
        language: "en",
        timezone: "UTC"
      }
    }
  },
  {
    uid: "employee-001",
    email: "employee@hexcode.com",
    firstName: "Mike",
    lastName: "Developer",
    displayName: "Mike Developer",
    role: "employee",
    department: "Engineering",
    employeeId: "EMP001",
    phoneNumber: "+1 (555) 345-6789",
    avatar: "",
    isActive: true,
    permissions: [
      "view_dashboard",
      "view_profile",
      "edit_profile",
      "view_assigned_tickets",
      "update_ticket_status",
      "track_time",
      "submit_timesheet"
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    settings: {
      notifications: {
        email: true,
        push: false,
        system: true
      },
      preferences: {
        theme: "dark",
        language: "en",
        timezone: "UTC"
      }
    }
  }
];

// Sample tickets data
export const sampleTickets = [
  {
    id: "ticket-001",
    title: "Fix login authentication bug",
    description: "Users are unable to login with correct credentials",
    priority: "high",
    status: "in-progress",
    assignedTo: {
      id: "employee-001",
      name: "Mike Developer",
      email: "employee@hexcode.com",
      avatar: "/placeholder-user.jpg"
    },
    assignedBy: "manager-001",
    createdBy: "admin-001",
    estimatedHours: 8,
    actualHours: 3,
    timeSpent: 10800, // 3 hours in seconds
    isTimerRunning: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now (critical)
    tags: ["bug", "authentication", "urgent"],
    department: "Engineering",
    project: "E-commerce Platform v2.0",
    adminNotes: "This is a critical bug affecting user login. Please prioritize this task.",
    extraTimeReason: "Additional time for thorough testing",
    extraTimeAdded: 2,
    ruralSituations: [
      {
        type: "electricity",
        description: "Power outage in rural area",
        timeExtension: 4,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ],
    comments: [],
    watchers: ["manager-001"],
    attachments: [],
    reporter: {
      id: "admin-001",
      name: "John Admin",
      email: "admin@hexcode.com",
      avatar: "/placeholder-user.jpg"
    },
    category: "Bug Fix",
    createdDate: new Date().toISOString()
  },
  {
    id: "ticket-002",
    title: "Design new landing page",
    description: "Create a modern, responsive landing page for the company website",
    priority: "medium",
    status: "open",
    assignedTo: {
      id: "employee-001",
      name: "Mike Developer",
      email: "employee@hexcode.com",
      avatar: "/placeholder-user.jpg"
    },
    assignedBy: "manager-001",
    createdBy: "manager-001",
    estimatedHours: 16,
    actualHours: 0,
    timeSpent: 0,
    isTimerRunning: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    tags: ["design", "frontend", "website"],
    department: "Design",
    project: "Company Website Redesign",
    adminNotes: "Focus on mobile-first design approach",
    extraTimeReason: "",
    extraTimeAdded: 0,
    ruralSituations: [],
    comments: [],
    watchers: ["manager-001"],
    attachments: [],
    reporter: {
      id: "manager-001",
      name: "Sarah Manager",
      email: "manager@hexcode.com",
      avatar: "/placeholder-user.jpg"
    },
    category: "Design",
    createdDate: new Date().toISOString()
  },
  {
    id: "ticket-003",
    title: "Database optimization",
    description: "Optimize database queries for better performance",
    priority: "low",
    status: "completed",
    assignedTo: {
      id: "employee-001",
      name: "Mike Developer",
      email: "employee@hexcode.com",
      avatar: "/placeholder-user.jpg"
    },
    assignedBy: "manager-001",
    createdBy: "admin-001",
    estimatedHours: 12,
    actualHours: 10,
    timeSpent: 36000, // 10 hours in seconds
    isTimerRunning: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    updatedAt: new Date().toISOString(),
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago (overdue)
    tags: ["database", "optimization", "backend"],
    department: "Engineering",
    project: "Performance Improvements",
    adminNotes: "Great work! Task completed ahead of schedule.",
    extraTimeReason: "",
    extraTimeAdded: 0,
    ruralSituations: [],
    comments: [],
    watchers: ["manager-001", "admin-001"],
    attachments: [],
    reporter: {
      id: "admin-001",
      name: "John Admin",
      email: "admin@hexcode.com",
      avatar: "/placeholder-user.jpg"
    },
    category: "Optimization",
    createdDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "ticket-004",
    title: "Implement payment gateway integration",
    description: "Integrate Stripe payment gateway with the e-commerce platform",
    priority: "critical",
    status: "open",
    assignedTo: {
      id: "employee-001",
      name: "Mike Developer",
      email: "employee@hexcode.com",
      avatar: "/placeholder-user.jpg"
    },
    assignedBy: "admin-001",
    createdBy: "admin-001",
    estimatedHours: 20,
    actualHours: 0,
    timeSpent: 0,
    isTimerRunning: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now (urgent)
    tags: ["payment", "integration", "critical"],
    department: "Engineering",
    project: "E-commerce Platform v2.0",
    adminNotes: "This is blocking the release. Please start immediately after login bug fix.",
    extraTimeReason: "Complex integration requires additional testing",
    extraTimeAdded: 5,
    ruralSituations: [
      {
        type: "internet",
        description: "Intermittent internet connectivity in rural office",
        timeExtension: 3,
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      }
    ],
    comments: [],
    watchers: ["admin-001", "manager-001"],
    attachments: [],
    reporter: {
      id: "admin-001",
      name: "John Admin",
      email: "admin@hexcode.com",
      avatar: "/placeholder-user.jpg"
    },
    category: "Integration",
    createdDate: new Date().toISOString()
  }
];

// Sample projects data
export const sampleProjects = [
  {
    id: "project-001",
    name: "E-commerce Platform",
    description: "Building a modern e-commerce platform with Next.js and Firebase",
    status: "active",
    progress: 65,
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
    teamMembers: ["employee-001", "manager-001"],
    budget: 50000,
    spent: 32000,
    department: "Engineering",
    priority: "high",
    createdBy: "admin-001",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "project-002",
    name: "Mobile App Development",
    description: "Cross-platform mobile app using React Native",
    status: "planning",
    progress: 15,
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(), // 120 days from now
    teamMembers: ["manager-001"],
    budget: 75000,
    spent: 0,
    department: "Engineering",
    priority: "medium",
    createdBy: "admin-001",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Sample departments data
export const sampleDepartments = [
  {
    id: "dept-001",
    name: "Engineering",
    description: "Software development and technical operations",
    headId: "manager-001",
    memberCount: 2,
    budget: 150000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "dept-002",
    name: "Design",
    description: "UI/UX design and creative services",
    headId: null,
    memberCount: 0,
    budget: 50000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "dept-003",
    name: "Management",
    description: "Administrative and executive functions",
    headId: "admin-001",
    memberCount: 1,
    budget: 200000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Function to initialize sample data
export async function initializeSampleData() {
  try {
    console.log("Initializing sample data...");

    // Add sample users
    for (const user of sampleUsers) {
      const userRef = ref(database, `users/${user.uid}`);
      await set(userRef, user);
      console.log(`Added user: ${user.email}`);
    }

    // Add sample tickets
    for (const ticket of sampleTickets) {
      const ticketRef = ref(database, `tickets/${ticket.id}`);
      await set(ticketRef, ticket);
      console.log(`Added ticket: ${ticket.title}`);
    }

    // Add sample projects
    for (const project of sampleProjects) {
      const projectRef = ref(database, `projects/${project.id}`);
      await set(projectRef, project);
      console.log(`Added project: ${project.name}`);
    }

    // Add sample departments
    for (const department of sampleDepartments) {
      const departmentRef = ref(database, `departments/${department.id}`);
      await set(departmentRef, department);
      console.log(`Added department: ${department.name}`);
    }

    console.log("Sample data initialized successfully!");
    return true;
  } catch (error) {
    console.error("Error initializing sample data:", error);
    return false;
  }
}

// Sample credentials for testing
export const sampleCredentials = {
  admin: {
    email: "admin@hexcode.com",
    password: "admin123",
    role: "admin"
  },
  manager: {
    email: "manager@hexcode.com", 
    password: "manager123",
    role: "manager"
  },
  employee: {
    email: "employee@hexcode.com",
    password: "employee123", 
    role: "employee"
  }
};