import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

/**
 * Fetch all projects from Firebase Realtime Database
 * @returns {Promise<any>} - Returns a promise resolving to projects data
 */
export async function fetchClientProjects() {
  const projectsRef = ref(database, "projects");
  const snapshot = await get(projectsRef);
  if (snapshot.exists()) {
    const projectsData = snapshot.val();
    // Convert object to array for easier handling
    return Object.keys(projectsData).map(key => ({
      id: key,
      ...projectsData[key]
    }));
  } else {
    console.error("No projects data found.");
    return [];
  }
}

/**
 * Fetch project roadmap phases from Firebase Realtime Database
 * @param {string} projectId - The ID of the project
 * @returns {Promise<any>} - Returns a promise resolving to project roadmap phases
 */
export async function fetchProjectNodes(projectId: string) {
  const projectRoadmapRef = ref(database, `projects/${projectId}/roadmap/phases`);
  const snapshot = await get(projectRoadmapRef);
  if (snapshot.exists()) {
    const phasesData = snapshot.val();
    // Convert phases object to array and transform to match expected structure
    return Object.keys(phasesData).map(key => {
      const phase = phasesData[key];
      return {
        id: phase.id || key,
        title: phase.name,
        description: phase.description,
        status: phase.status,
        progress: phase.progress || 0,
        tasks: phase.deliverables ? phase.deliverables.map((deliverable: string, index: number) => ({
          id: `task_${key}_${index}`,
          title: deliverable,
          description: `Deliverable: ${deliverable}`,
          completed: phase.status === 'completed',
          priority: 'medium',
          estimatedHours: 40,
          tags: ['deliverable']
        })) : [],
        dependencies: [],
        priority: 'medium',
        position: { x: 200 + (Object.keys(phasesData).indexOf(key) * 150), y: 200 },
        radius: 50,
        color: phase.status === 'completed' ? '#10b981' : 
               phase.status === 'in-progress' ? '#f59e0b' : '#6366f1'
      };
    });
  } else {
    console.warn(`No roadmap phases found for project ID: ${projectId}. Ensure the project ID is correct and roadmap data exists in the database.`);
    return []; // Return an empty array instead of null
  }
}

/**
 * Fetch projects for the logged-in user from Firebase Realtime Database
 * @param {string} userEmail - The email of the logged-in user
 * @returns {Promise<any>} - Returns a promise resolving to projects data
 */
export async function fetchClientProjectsByEmail(userEmail: string) {
  const clientsRef = ref(database, "clients");
  const snapshot = await get(clientsRef);
  if (snapshot.exists()) {
    const clientsData = snapshot.val();
    const client = Object.values(clientsData as Record<string, { email: string; projects: string[] }>)
      .find((client) => client.email === userEmail);
    if (client && client.projects) {
      const projectsRef = ref(database, "projects");
      const projectsSnapshot = await get(projectsRef);
      if (projectsSnapshot.exists()) {
        const projectsData = projectsSnapshot.val();
        return client.projects.map((projectId: string) => ({
          id: projectId,
          ...projectsData[projectId]
        }));
      } else {
        console.error("No projects data found.");
        return [];
      }
    } else {
      console.warn(`No client found with email: ${userEmail} or no projects associated.`);
      return [];
    }
  } else {
    console.error("No clients data found.");
    return [];
  }
}

export { database, auth, firestore, storage };