'use client';

import React, { useState } from 'react';
import ClientProjectGraph from '@/components/client/client-project-graph';
import { GraphNode } from '@/lib/advanced-graph';

export default function ProjectPortfolioPage() {
  const [selectedProject, setSelectedProject] = useState<GraphNode | null>(null);

  const handleProjectSelect = (project: GraphNode) => {
    setSelectedProject(project);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100/[0.02] bg-[size:60px_60px]" />
        <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 text-sm font-medium px-4 py-2 rounded-full border border-indigo-500/20 mb-6">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
              Project Portfolio Dashboard
            </div>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Interactive Project Graph
            </h1>
            <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              Visualize client projects, dependencies, and implementation roadmaps using advanced graph data structures. 
              Built for modern software companies to track project progress and planning.
            </p>
            
            {/* Key Features */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                <span className="text-slate-300 text-sm">Real-time Status Tracking</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50">
                <div className="w-2 h-2 bg-amber-400 rounded-full" />
                <span className="text-slate-300 text-sm">Dependency Visualization</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50">
                <div className="w-2 h-2 bg-indigo-400 rounded-full" />
                <span className="text-slate-300 text-sm">Future Planning</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                <span className="text-slate-300 text-sm">Interactive Interface</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Graph Visualization */}
      <div className="mx-auto max-w-7xl px-6 pb-16">
        <div className="bg-slate-800/30 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 shadow-2xl">
          <ClientProjectGraph 
            className="w-full h-[800px]"
            onProjectSelect={handleProjectSelect}
          />
        </div>

        {/* Additional Project Information */}
        {selectedProject && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Project Overview */}
            <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Project Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <div className="text-sm text-slate-400 mb-1">Timeline</div>
                  <div className="text-white font-semibold">
                    {selectedProject.startDate.toLocaleDateString()} - {selectedProject.endDate.toLocaleDateString()}
                  </div>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <div className="text-sm text-slate-400 mb-1">Estimated Hours</div>
                  <div className="text-white font-semibold">{selectedProject.estimatedHours}h</div>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <div className="text-sm text-slate-400 mb-1">Priority</div>
                  <div className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
                    selectedProject.priority === 'critical' ? 'bg-red-500/20 text-red-300' :
                    selectedProject.priority === 'high' ? 'bg-amber-500/20 text-amber-300' :
                    selectedProject.priority === 'medium' ? 'bg-blue-500/20 text-blue-300' :
                    'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {selectedProject.priority.toUpperCase()}
                  </div>
                </div>
              </div>
              
              {selectedProject.tasks && selectedProject.tasks.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-white mb-3">Key Tasks</h4>
                  <div className="space-y-3">
                    {selectedProject.tasks.slice(0, 4).map((task) => (
                      <div key={task.id} className="flex items-start gap-3 bg-slate-700/20 rounded-lg p-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                          task.completed 
                            ? 'bg-emerald-500 border-emerald-500' 
                            : 'border-slate-400'
                        }`}>
                          {task.completed && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className={`font-medium ${task.completed ? 'text-slate-400 line-through' : 'text-white'}`}>
                            {task.title}
                          </div>
                          <div className="text-sm text-slate-400 mt-1">{task.description}</div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              task.priority === 'critical' ? 'bg-red-500/20 text-red-300' :
                              task.priority === 'high' ? 'bg-amber-500/20 text-amber-300' :
                              task.priority === 'medium' ? 'bg-blue-500/20 text-blue-300' :
                              'bg-emerald-500/20 text-emerald-300'
                            }`}>
                              {task.priority}
                            </span>
                            <span className="text-xs text-slate-500">{task.estimatedHours}h</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Technical Specifications */}
            <div className="space-y-6">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Technical Features</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                    <span className="text-slate-300">Graph Data Structure Implementation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <span className="text-slate-300">TypeScript with Advanced Types</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    <span className="text-slate-300">Canvas-based Rendering</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-amber-400 rounded-full" />
                    <span className="text-slate-300">Real-time Animations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-rose-400 rounded-full" />
                    <span className="text-slate-300">Dependency Analysis Algorithms</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Graph Algorithms</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="text-white font-medium mb-1">Topological Sorting</div>
                    <div className="text-slate-400">Determines optimal project execution order</div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="text-white font-medium mb-1">Critical Path Analysis</div>
                    <div className="text-slate-400">Identifies project bottlenecks and dependencies</div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <div className="text-white font-medium mb-1">Future Planning</div>
                    <div className="text-slate-400">Generates roadmaps for upcoming implementations</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Usage Instructions */}
        <div className="mt-8 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-indigo-500/20 p-6">
          <h3 className="text-xl font-bold text-white mb-4">How to Use</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center font-bold">1</div>
              <div>
                <div className="text-white font-medium mb-1">Explore Projects</div>
                <div className="text-slate-400">Click on any project node to view detailed information, milestones, and team members.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center font-bold">2</div>
              <div>
                <div className="text-white font-medium mb-1">Track Dependencies</div>
                <div className="text-slate-400">Follow the connecting arrows to understand project relationships and implementation sequence.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center font-bold">3</div>
              <div>
                <div className="text-white font-medium mb-1">Monitor Progress</div>
                <div className="text-slate-400">Visual status indicators and completion percentages provide real-time project insights.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}