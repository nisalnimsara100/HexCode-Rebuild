"use client";

import { useState, useEffect } from 'react';
import { getDatabase, ref, get } from "firebase/database";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Firebase fetch function
async function fetchClientProjectsByEmail(userEmail: string) {
  try {
    const database = getDatabase();
    const clientProjectsRef = ref(database, 'clientProjects');
    const snapshot = await get(clientProjectsRef);
    
    if (snapshot.exists()) {
      const projects = snapshot.val();
      console.log('All Firebase projects:', projects);
      
      // Filter projects by user email
      const userProjects = projects.filter((project: any) => project.email === userEmail);
      console.log(`Filtered projects for ${userEmail}:`, userProjects);
      return userProjects;
    } else {
      console.log("No client projects found");
      return [];
    }
  } catch (error) {
    console.error("Error fetching client projects:", error);
    return [];
  }
}

export default function FirebaseDebugPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  
  const testEmail = "nisalnimsara100@gmail.com";

  const handleFetchProjects = async () => {
    setLoading(true);
    setError("");
    
    try {
      const fetchedProjects = await fetchClientProjectsByEmail(testEmail);
      setProjects(fetchedProjects);
    } catch (err) {
      setError(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on component mount
  useEffect(() => {
    handleFetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Firebase Debug - Client Projects</h1>
        
        <Card className="bg-gray-800 border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Test Email: {testEmail}</h2>
              <p className="text-gray-400">Firebase URL: https://hexcode-website-897f4-default-rtdb.firebaseio.com/</p>
            </div>
            <Button onClick={handleFetchProjects} disabled={loading}>
              {loading ? 'Loading...' : 'Fetch Projects'}
            </Button>
          </div>
          
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Projects Found: {projects.length}
            </h3>
            
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <Card key={index} className="bg-gray-700 border-gray-600 p-4">
                  <h4 className="font-semibold text-emerald-400 mb-2">{project.name}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">ID:</span> {project.id}
                    </div>
                    <div>
                      <span className="text-gray-400">Email:</span> {project.email}
                    </div>
                    <div>
                      <span className="text-gray-400">Progress:</span> {project.progress}%
                    </div>
                    <div>
                      <span className="text-gray-400">Budget:</span> ${(project.budget / 1000).toFixed(0)}K
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-400">Description:</span> {project.description}
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-400">Technologies:</span> {project.technologies.join(', ')}
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-400">Team Members:</span> {project.teamMembers.length} members
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-400">Roadmap Phases:</span> {project.roadmap.length} phases
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              !loading && (
                <div className="text-gray-400 text-center py-8">
                  No projects found for this email address.
                </div>
              )
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}