"use client";

import React from 'react';
import { FirebaseClientProjectsTiles } from './firebase-client-projects-tiles';

interface ClientProject {
  email: string;
  id: string;
  name: string;
  description: string;
  startDate: string;
  dueDate: string;
  budget: number;
  nextMilestone: string;
  progress: number;
  teamMembers: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  technologies: string[];
  roadmap: any[];
  status?: string;
  priority?: string;
  currency?: string;
}

interface FirebaseClientProjectsExampleProps {
  userEmail: string;
}

export function FirebaseClientProjectsExample({ userEmail }: FirebaseClientProjectsExampleProps) {
  const handleProjectSelect = (project: ClientProject) => {
    console.log('Selected project:', project);
    // You can navigate to a detailed project view or open a modal here
    // For example: router.push(`/client/projects/${project.id}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          My Projects
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View and manage your active projects
        </p>
      </div>
      
      <FirebaseClientProjectsTiles
        userEmail={userEmail}
        onProjectSelect={handleProjectSelect}
        showRoadmap={true}
      />
    </div>
  );
}