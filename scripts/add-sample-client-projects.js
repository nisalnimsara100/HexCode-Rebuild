import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';

// Firebase config from your existing setup
const firebaseConfig = {
  apiKey: "AIzaSyD_mq2ETgW45C-qEaOVjc3ZEgCPbPPfPoE",
  authDomain: "hexcode-website-897f4.firebaseapp.com",
  databaseURL: "https://hexcode-website-897f4-default-rtdb.firebaseio.com",
  projectId: "hexcode-website-897f4",
  storageBucket: "hexcode-website-897f4.firebasestorage.app",
  messagingSenderId: "968376624063",
  appId: "1:968376624063:web:e4c893fa4945b155b4370a",
  measurementId: "G-Z8J9M847RD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Sample client projects data that matches the structure shown in the screenshots
const sampleClientProjects = [
  {
    id: "project-1",
    email: "nisalnimsara100@gmail.com", // Use your test email
    name: "Mobile Banking App",
    description: "Secure mobile banking application with biometric authentication.",
    budget: 140000,
    dueDate: "2023-12-15",
    nextMilestone: "Project Completed",
    progress: 100,
    startDate: "2023-06-01",
    status: "completed",
    technologies: ["React Native", "Node.js", "MongoDB", "Firebase"],
    teamMembers: [
      { id: "tm1", name: "John Smith", role: "Lead Developer" },
      { id: "tm2", name: "Sarah Johnson", role: "UI/UX Designer" },
      { id: "tm3", name: "Mike Chen", role: "Backend Developer" }
    ],
    roadmap: [
      {
        id: "discovery",
        title: "Discovery",
        description: "Requirements gathering and planning",
        status: "completed",
        category: "design",
        color: "#8B5CF6",
        position: { x: 200, y: 150 },
        priority: "high",
        duration: "2 weeks",
        radius: 40,
        dependencies: [],
        tasks: [
          { id: "task1", title: "User Research", completed: true },
          { id: "task2", title: "Technical Architecture", completed: true }
        ]
      },
      {
        id: "development",
        title: "Development",
        description: "Core application development",
        status: "completed",
        category: "development",
        color: "#10B981",
        position: { x: 400, y: 150 },
        priority: "high",
        duration: "8 weeks",
        radius: 40,
        dependencies: ["discovery"],
        tasks: [
          { id: "task3", title: "Authentication System", completed: true },
          { id: "task4", title: "Banking Features", completed: true }
        ]
      },
      {
        id: "testing",
        title: "Testing & Launch",
        description: "Quality assurance and deployment",
        status: "completed",
        category: "testing",
        color: "#06B6D4",
        position: { x: 600, y: 150 },
        priority: "high",
        duration: "3 weeks",
        radius: 40,
        dependencies: ["development"],
        tasks: [
          { id: "task5", title: "Security Testing", completed: true },
          { id: "task6", title: "App Store Deployment", completed: true }
        ]
      }
    ]
  },
  {
    id: "project-2",
    email: "nisalnimsara100@gmail.com", // Use your test email
    name: "E-Commerce Platform",
    description: "Full-featured e-commerce platform with payment integration",
    budget: 45000,
    dueDate: "2024-03-15",
    nextMilestone: "Payment Integration",
    progress: 65,
    startDate: "2024-01-01",
    status: "in-progress",
    technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
    teamMembers: [
      { id: "tm4", name: "Jessica Brown", role: "Full Stack Developer" },
      { id: "tm5", name: "David Wilson", role: "DevOps Engineer" }
    ],
    roadmap: [
      {
        id: "planning",
        title: "Planning",
        description: "Project planning and architecture design",
        status: "completed",
        category: "planning",
        color: "#10B981",
        position: { x: 200, y: 150 },
        priority: "high",
        duration: "2 weeks",
        radius: 40,
        dependencies: [],
        tasks: [
          { id: "task7", title: "Requirements Analysis", completed: true },
          { id: "task8", title: "System Design", completed: true }
        ]
      },
      {
        id: "development-phase",
        title: "Development",
        description: "Core platform development",
        status: "in-progress",
        category: "development",
        color: "#06B6D4",
        position: { x: 400, y: 150 },
        priority: "high",
        duration: "8 weeks",
        radius: 40,
        dependencies: ["planning"],
        tasks: [
          { id: "task9", title: "Product Catalog", completed: true },
          { id: "task10", title: "Shopping Cart", completed: false }
        ]
      },
      {
        id: "integration",
        title: "Integration",
        description: "Payment and third-party integrations",
        status: "planning",
        category: "integration",
        color: "#F59E0B",
        position: { x: 600, y: 150 },
        priority: "medium",
        duration: "3 weeks",
        radius: 40,
        dependencies: ["development-phase"],
        tasks: [
          { id: "task11", title: "Payment Gateway", completed: false },
          { id: "task12", title: "Inventory Management", completed: false }
        ]
      }
    ]
  },
  {
    id: "project-3",
    email: "nisalnimsara100@gmail.com", // Use your test email
    name: "AI Dashboard",
    description: "Machine learning analytics dashboard for business intelligence",
    budget: 75000,
    dueDate: "2024-05-01",
    nextMilestone: "Data Pipeline Setup",
    progress: 15,
    startDate: "2024-03-01",
    status: "planning",
    technologies: ["Python", "React", "TensorFlow", "AWS"],
    teamMembers: [
      { id: "tm6", name: "Alex Rodriguez", role: "ML Engineer" },
      { id: "tm7", name: "Emily Davis", role: "Data Scientist" }
    ],
    roadmap: [
      {
        id: "research",
        title: "Research",
        description: "AI/ML research and proof of concept",
        status: "in-progress",
        category: "research",
        color: "#8B5CF6",
        position: { x: 200, y: 150 },
        priority: "high",
        duration: "4 weeks",
        radius: 40,
        dependencies: [],
        tasks: [
          { id: "task13", title: "Algorithm Research", completed: false },
          { id: "task14", title: "Data Analysis", completed: false }
        ]
      },
      {
        id: "data-pipeline",
        title: "Data Pipeline",
        description: "Data collection and processing infrastructure",
        status: "planning",
        category: "infrastructure",
        color: "#6B7280",
        position: { x: 400, y: 150 },
        priority: "high",
        duration: "6 weeks",
        radius: 40,
        dependencies: ["research"],
        tasks: [
          { id: "task15", title: "Data Ingestion", completed: false },
          { id: "task16", title: "ETL Pipeline", completed: false }
        ]
      }
    ]
  }
];

async function addSampleClientProjects() {
  try {
    const clientProjectsRef = ref(database, 'clientProjects');
    await set(clientProjectsRef, sampleClientProjects);
    console.log('Sample client projects added successfully!');
    console.log('Added projects:', sampleClientProjects.map(p => p.name));
  } catch (error) {
    console.error('Error adding sample projects:', error);
  }
  process.exit(0);
}

addSampleClientProjects();