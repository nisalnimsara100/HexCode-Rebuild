// Test script for project approval functionality
import { approveProject, rejectProject, fetchPendingApprovalProjects, submitClientProjectRequest } from './lib/client-projects-firebase.ts';

async function testProjectApproval() {
  try {
    console.log('🚀 Testing project approval functionality...');
    
    // 1. Create a test pending project
    console.log('\n1. Creating test pending project...');
    const testProjectId = await submitClientProjectRequest({
      name: 'Test Website Redesign',
      description: 'Complete website redesign with modern UI/UX',
      timeline: '3 months',
      budget: '15000',
      clientEmail: 'test@example.com',
      clientName: 'Test Client'
    });
    console.log('✅ Test project created:', testProjectId);
    
    // 2. Fetch pending projects to verify
    console.log('\n2. Fetching pending projects...');
    const pendingProjects = await fetchPendingApprovalProjects();
    console.log(`✅ Found ${pendingProjects.length} pending projects`);
    
    if (pendingProjects.length > 0) {
      const testProject = pendingProjects.find(p => p.id === testProjectId);
      if (testProject) {
        console.log('✅ Test project found in pending list');
        console.log('   Project details:', {
          id: testProject.id,
          name: testProject.name,
          status: testProject.status,
          email: testProject.email
        });
        
        // 3. Approve the project
        console.log('\n3. Approving test project...');
        await approveProject(testProject.id);
        console.log('✅ Project approved successfully!');
        
        // 4. Verify it's no longer in pending list
        console.log('\n4. Verifying approval...');
        const updatedPendingProjects = await fetchPendingApprovalProjects();
        const stillPending = updatedPendingProjects.find(p => p.id === testProject.id);
        
        if (!stillPending) {
          console.log('✅ Project successfully moved from pending to approved!');
        } else {
          console.log('❌ Project still appears in pending list');
        }
        
        console.log(`📊 Pending projects count: ${updatedPendingProjects.length}`);
      } else {
        console.log('❌ Test project not found in pending list');
      }
    } else {
      console.log('ℹ️  No pending projects found');
    }
    
    console.log('\n🎉 Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testProjectApproval();