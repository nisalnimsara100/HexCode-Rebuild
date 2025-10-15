// Sample data to add to Firebase Realtime Database
// Navigate to https://console.firebase.google.com/project/hexcode-website-897f4/database/hexcode-website-897f4-default-rtdb/data
// and add this data to the "allProjects" node

const sampleProjects = {
  "project1": {
    title: "FinTech Mobile App",
    description: "A comprehensive mobile banking application with real-time transactions, budget tracking, and investment portfolio management.",
    image: "fintech-mobile.jpg", // Just the filename, will be normalized to /projects/fintech-mobile.jpg
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
    title: "EcoCommerce Platform", 
    description: "Modern e-commerce platform with advanced inventory management, payment processing, and analytics dashboard.",
    image: "ecommerce-platform.jpg",
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
    title: "HealthTech Dashboard",
    description: "Interactive healthcare dashboard with patient management, appointment scheduling, and medical records system.",
    image: "healthtech-dashboard.jpg",
    technologies: ["React", "Python", "Django", "AWS"],
    category: "Web App",
    url: "https://demo-healthtech.com", 
    githubUrl: "https://github.com/example/healthtech-dashboard",
    isActive: true,
    order: 2,
    client: "MedCare Inc",
    completedDate: "2024-07-30",
    createdAt: "2024-07-01T10:00:00.000Z"
  },
  "project4": {
    title: "EdTech Platform",
    description: "Comprehensive learning management system with video courses, quizzes, and progress tracking.",
    image: "edtech-platform.jpg", 
    technologies: ["Vue.js", "Laravel", "MySQL", "Redis"],
    category: "Educational",
    url: "https://demo-edtech.com",
    githubUrl: "https://github.com/example/edtech-platform", 
    isActive: false,
    order: 3,
    client: "EduFuture Ltd",
    completedDate: "2024-06-15",
    createdAt: "2024-06-01T10:00:00.000Z"
  },
  "project5": {
    title: "IoT Dashboard",
    description: "Real-time IoT device monitoring and control system with data analytics and alerts.",
    image: "iot-dashboard.jpg",
    technologies: ["Angular", "Spring Boot", "MongoDB", "MQTT"],
    category: "IoT",
    url: "https://demo-iot.com",
    githubUrl: "https://github.com/example/iot-dashboard",
    isActive: true,
    order: 4,
    client: "SmartTech Solutions", 
    completedDate: "2024-05-10",
    createdAt: "2024-05-01T10:00:00.000Z"
  },
  "project6": {
    title: "Social Analytics Platform",
    description: "Advanced social media analytics platform with sentiment analysis and engagement tracking.",
    image: "social-analytics.jpg",
    technologies: ["React", "Node.js", "PostgreSQL", "D3.js"],
    category: "Analytics",
    url: "https://demo-social-analytics.com",
    githubUrl: "https://github.com/example/social-analytics",
    isActive: true, 
    order: 5,
    client: "Digital Marketing Pro",
    completedDate: "2024-04-25",
    createdAt: "2024-04-01T10:00:00.000Z"
  }
};

console.log('Copy this JSON to Firebase Console:');
console.log(JSON.stringify(sampleProjects, null, 2));

// To add manually to Firebase Console:
// 1. Go to https://console.firebase.google.com/project/hexcode-website-897f4/database/hexcode-website-897f4-default-rtdb/data
// 2. Click on the root (+) to add a child
// 3. Name it "allProjects"  
// 4. Paste the JSON above as the value
// 5. Save