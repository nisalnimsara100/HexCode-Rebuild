// Test credentials for HexCode Staff Portal
// Run this in your Firebase console or use Firebase CLI to add these users

const testUsers = {
  admin: {
    email: "admin@hexcode.com",
    password: "admin123",
    profile: {
      name: "System Administrator",
      role: "admin",
      employeeId: "ADM001",
      department: "IT Administration"
    }
  },
  employee: {
    email: "john.doe@hexcode.com", 
    password: "employee123",
    profile: {
      name: "John Doe",
      role: "employee", 
      employeeId: "EMP001",
      department: "Software Development"
    }
  }
};

// Firebase Admin SDK code to create these users:
/*
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK with your service account
const serviceAccount = require('./path-to-your-service-account-key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-project-id-default-rtdb.firebaseio.com'
});

async function createTestUsers() {
  const auth = admin.auth();
  const db = admin.database();

  // Create Admin User
  try {
    const adminUser = await auth.createUser({
      email: testUsers.admin.email,
      password: testUsers.admin.password,
    });
    
    await db.ref(`users/${adminUser.uid}`).set({
      uid: adminUser.uid,
      email: testUsers.admin.email,
      ...testUsers.admin.profile
    });
    
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }

  // Create Employee User
  try {
    const employeeUser = await auth.createUser({
      email: testUsers.employee.email,
      password: testUsers.employee.password,
    });
    
    await db.ref(`users/${employeeUser.uid}`).set({
      uid: employeeUser.uid,
      email: testUsers.employee.email,
      ...testUsers.employee.profile
    });
    
    console.log('Employee user created successfully');
  } catch (error) {
    console.error('Error creating employee user:', error);
  }
}

createTestUsers();
*/

export { testUsers };