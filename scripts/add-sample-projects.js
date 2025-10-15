const admin = require('firebase-admin');

// Initialize Firebase Admin (you'll need to set up service account key)
// For now, we'll just create sample data structure

const sampleProjects = {
  "project1": {
    title: "FinTech Mobile App",
    description: "A comprehensive mobile banking application with real-time transactions, budget tracking, and investment portfolio management.",
    image: "/projects/fintech-mobile.jpg",
    technologies: ["React Native", "Node.js", "MongoDB", "Firebase"],
    category: "Mobile App",
    url: "https://demo-fintech-app.com",
    githubUrl: "https://github.com/example/fintech-app",
    isActive: true,
    order: 0,
    client: "SecureBank Ltd",
    completedDate: "2024-09-15",
    createdAt: "2024-09-01T10:00:00.000Z"
  },
  "project2": {
    title: "E-Commerce Platform",
    description: "Modern e-commerce platform with advanced inventory management, payment processing, and analytics dashboard.",
    image: "/projects/ecommerce-platform.jpg",
    technologies: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
    category: "Web App",
    url: "https://demo-ecommerce.com",
    githubUrl: "https://github.com/example/ecommerce-platform",
    isActive: true,
    order: 1,
    client: "RetailCorp",
    completedDate: "2024-08-20",
    createdAt: "2024-08-01T10:00:00.000Z"
  },
  "project3": {
    title: "EdTech Learning Platform",
    description: "Interactive online learning platform with video courses, quizzes, progress tracking, and certification system.",
    image: "/projects/edtech-platform.jpg",
    technologies: ["React", "Python", "Django", "AWS"],
    category: "Web App",
    url: "https://demo-edtech.com",
    githubUrl: "https://github.com/example/edtech-platform",
    isActive: true,
    order: 2,
    client: "EduFuture Inc",
    completedDate: "2024-07-30",
    createdAt: "2024-07-01T10:00:00.000Z"
  }
};

console.log('Sample project data structure:');
console.log(JSON.stringify(sampleProjects, null, 2));

// To add this to Firebase, you would use:
// const db = admin.database();
// const ref = db.ref('allProjects');
// ref.set(sampleProjects);