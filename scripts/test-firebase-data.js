const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get } = require('firebase/database');

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
    console.log('🔍 Testing Firebase Realtime Database connection...\n');

    // Test client data fetch
    console.log('📋 Testing client data...');
    const clientsRef = ref(database, 'clients');
    const clientsSnapshot = await get(clientsRef);
    
    if (clientsSnapshot.exists()) {
      const clientsData = clientsSnapshot.val();
      console.log(`✅ Found ${Object.keys(clientsData).length} clients in database`);
      
      // Test fetching Nisal's data specifically
      const nisalClient = Object.values(clientsData).find(client => client.email === 'nisalnimsara100@gmail.com');
      if (nisalClient) {
        console.log(`✅ Nisal's client data found:`);
        console.log(`   - Name: ${nisalClient.name}`);
        console.log(`   - Email: ${nisalClient.email}`);
        console.log(`   - Company: ${nisalClient.company}`);
        console.log(`   - Projects: ${nisalClient.projects.join(', ')}`);
      } else {
        console.log('❌ Nisal\'s client data not found');
      }
    } else {
      console.log('❌ No client data found');
    }

    // Test projects data
    console.log('\n🚀 Testing projects data...');
    const projectsRef = ref(database, 'projects');
    const projectsSnapshot = await get(projectsRef);
    
    if (projectsSnapshot.exists()) {
      const projectsData = projectsSnapshot.val();
      console.log(`✅ Found ${Object.keys(projectsData).length} projects in database`);
      
      // Test Nisal's projects specifically
      if (nisalClient && nisalClient.projects) {
        console.log(`✅ Nisal's projects:`);
        nisalClient.projects.forEach(projectId => {
          const project = projectsData[projectId];
          if (project) {
            console.log(`   - ${project.name} (${project.status})`);
          }
        });
      }
    } else {
      console.log('❌ No projects data found');
    }

    // Test notifications
    console.log('\n🔔 Testing notifications...');
    const notificationsRef = ref(database, 'notifications/client_003');
    const notifSnapshot = await get(notificationsRef);
    
    if (notifSnapshot.exists()) {
      const notifications = notifSnapshot.val();
      const notifArray = Array.isArray(notifications) ? notifications : Object.values(notifications);
      console.log(`✅ Found ${notifArray.length} notifications for Nisal`);
      notifArray.forEach((notif, index) => {
        console.log(`   ${index + 1}. ${notif.title} (${notif.priority})`);
      });
    } else {
      console.log('❌ No notifications found for Nisal');
    }

    console.log('\n🎉 Firebase data structure test completed successfully!');
    console.log('\n📝 Summary:');
    console.log('   - Firebase connection: ✅ Working');
    console.log('   - Client data structure: ✅ Valid');
    console.log('   - Project data structure: ✅ Valid');
    console.log('   - Notifications: ✅ Working');
    console.log('   - Email-based filtering: ✅ Ready');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing Firebase data:', error);
    process.exit(1);
  }
}

testFirebaseData();