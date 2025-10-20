// Test script to verify Firebase data fetching
import { getDatabase, ref, get } from "firebase/database";
import { initializeApp } from "firebase/app";

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

async function testFirebaseConnection() {
  try {
    const database = getDatabase(app);
    const clientProjectsRef = ref(database, 'clientProjects');
    const snapshot = await get(clientProjectsRef);
    
    if (snapshot.exists()) {
      const projects = snapshot.val();
      console.log('Firebase data fetched successfully:');
      console.log(JSON.stringify(projects, null, 2));
      
      // Test filtering by email
      const userEmail = "nisalnimsara100@gmail.com";
      const userProjects = projects.filter(project => project.email === userEmail);
      console.log(`\nProjects for user ${userEmail}:`, userProjects.length);
      
      return userProjects;
    } else {
      console.log("No client projects found in Firebase");
      return [];
    }
  } catch (error) {
    console.error("Error fetching Firebase data:", error);
    return [];
  }
}

// Run the test
testFirebaseConnection().then(projects => {
  console.log(`Successfully fetched ${projects.length} projects for the user`);
}).catch(error => {
  console.error("Test failed:", error);
});