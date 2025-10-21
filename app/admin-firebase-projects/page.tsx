"use client";

import { FirebaseAdminProjects } from '@/components/admin/firebase-admin-projects';

export default function AdminFirebaseProjectsPage() {
  const handleProjectSelect = (project: any) => {
    console.log('Admin selected project:', project);
    // Handle project selection - could navigate to detailed view
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto p-6">
        <FirebaseAdminProjects onProjectSelect={handleProjectSelect} />
      </div>
    </div>
  );
}