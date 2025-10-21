"use client";

import { FirebaseClientProjectsAdmin } from '@/components/admin/firebase-client-projects-admin';

export default function TestAdminFirebaseProjectsPage() {
  const handleProjectSelect = (project: any) => {
    console.log('Admin selected project:', project);
    alert(`Selected project: ${project.name}\nClient: ${project.email}\nProgress: ${project.progress}%`);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Firebase Client Projects Admin Test
          </h1>
          <p className="text-gray-400">
            Testing direct Firebase connection to clientProjects collection
          </p>
        </div>
        
        <FirebaseClientProjectsAdmin onProjectSelect={handleProjectSelect} />
      </div>
    </div>
  );
}