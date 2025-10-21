import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';

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

async function testFirebaseData() {
  try {
    console.log('🔍 Testing Firebase data structure...\n');
    
    // Check clientProjects collection
    console.log('📋 Checking clientProjects collection:');
    const clientProjectsRef = ref(database, 'clientProjects');
    const clientProjectsSnapshot = await get(clientProjectsRef);
    
    if (clientProjectsSnapshot.exists()) {
      const clientProjects = clientProjectsSnapshot.val();
      console.log('✅ clientProjects exists');
      console.log('📊 Type:', typeof clientProjects);
      console.log('📊 Is Array:', Array.isArray(clientProjects));
      console.log('📊 Length/Keys:', Array.isArray(clientProjects) ? clientProjects.length : Object.keys(clientProjects).length);
      console.log('📊 First project:', Array.isArray(clientProjects) ? clientProjects[0] : Object.values(clientProjects)[0]);
    } else {
      console.log('❌ clientProjects does not exist');
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Check projects collection (enhanced structure)
    console.log('📋 Checking projects collection (enhanced):');
    const projectsRef = ref(database, 'projects');
    const projectsSnapshot = await get(projectsRef);
    
    if (projectsSnapshot.exists()) {
      const projects = projectsSnapshot.val();
      console.log('✅ projects exists');
      console.log('📊 Type:', typeof projects);
      console.log('📊 Keys:', Object.keys(projects));
      console.log('📊 First project:', Object.values(projects)[0]);
    } else {
      console.log('❌ projects does not exist');
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Check clients collection
    console.log('📋 Checking clients collection:');
    const clientsRef = ref(database, 'clients');
    const clientsSnapshot = await get(clientsRef);
    
    if (clientsSnapshot.exists()) {
      const clients = clientsSnapshot.val();
      console.log('✅ clients exists');
      console.log('📊 Keys:', Object.keys(clients));
      console.log('📊 First client:', Object.values(clients)[0]);
    } else {
      console.log('❌ clients does not exist');
    }
    
  } catch (error) {
    console.error('❌ Error testing Firebase data:', error);
  }
  
  process.exit(0);
}

testFirebaseData();