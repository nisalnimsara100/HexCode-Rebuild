"use client";

import { useState, useEffect } from 'react';
import { getDatabase, ref, get } from "firebase/database";
import { Card } from "@/components/ui/card";

export default function FirebaseRoadmapDebug() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const database = getDatabase();
        const clientProjectsRef = ref(database, 'clientProjects');
        const snapshot = await get(clientProjectsRef);
        
        if (snapshot.exists()) {
          const projects = snapshot.val();
          console.log('Raw Firebase data:', projects);
          setData(projects);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Firebase Roadmap Data Debug</h1>
      
      {data && (
        <div className="space-y-6">
          {data.map((project: any, index: number) => (
            <Card key={index} className="bg-gray-800 border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4 text-emerald-400">{project.name}</h2>
              <div className="mb-4">
                <strong>Email:</strong> {project.email}
              </div>
              <div className="mb-4">
                <strong>Roadmap Phases ({project.roadmap?.length || 0}):</strong>
              </div>
              {project.roadmap && (
                <div className="space-y-4 ml-4">
                  {project.roadmap.map((phase: any, phaseIndex: number) => (
                    <div key={phaseIndex} className="bg-gray-700 p-4 rounded">
                      <h3 className="font-medium text-blue-400">{phase.title}</h3>
                      <p className="text-sm text-gray-300">{phase.description}</p>
                      <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                        <div><strong>Status:</strong> {phase.status}</div>
                        <div><strong>Priority:</strong> {phase.priority}</div>
                        <div><strong>Duration:</strong> {phase.duration}</div>
                        <div><strong>Category:</strong> {phase.category}</div>
                        <div className="col-span-2">
                          <strong>Dependencies:</strong> {phase.dependencies?.join(', ') || 'None'}
                        </div>
                        <div className="col-span-2">
                          <strong>Position:</strong> x: {phase.position?.x}, y: {phase.position?.y}
                        </div>
                        <div className="col-span-2">
                          <strong>Color:</strong> <span style={{color: phase.color}}>{phase.color}</span>
                        </div>
                        <div className="col-span-2">
                          <strong>Tasks ({phase.tasks?.length || 0}):</strong>
                          {phase.tasks && phase.tasks.length > 0 && (
                            <ul className="list-disc ml-4 mt-1">
                              {phase.tasks.map((task: any, taskIndex: number) => (
                                <li key={taskIndex} className="text-xs">
                                  {task.title} - {task.completed ? 'Completed' : 'Pending'}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}