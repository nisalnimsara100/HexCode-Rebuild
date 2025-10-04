"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  ChevronDown,
  Target,
  Palette,
  Database,
  Code,
  Server,
  Zap,
  Shield,
  Rocket,
  GitBranch,
  ArrowRight,
  Play,
  Pause,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Users
} from "lucide-react";

interface GraphNode {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "upcoming" | "blocked";
  icon: React.ReactNode;
  dependencies: string[];
  tasks: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
  duration: string;
  priority: "high" | "medium" | "low";
  category: "design" | "development" | "testing" | "deployment";
  position?: { x: number; y: number };
  color: string;
}

interface Connection {
  from: string;
  to: string;
  type: "dependency" | "parallel" | "conditional";
}

export function ProjectRoadmap() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [animatedConnections, setAnimatedConnections] = useState<Set<string>>(new Set());

  // Graph data structure with proper dependencies
  const graphNodes: GraphNode[] = [
    {
      id: "discovery",
      title: "Discovery & Planning",
      description: "Project requirements gathering and strategic planning",
      status: "completed",
      icon: <Target className="w-6 h-6" />,
      dependencies: [],
      duration: "2 weeks",
      priority: "high",
      category: "design",
      color: "from-purple-500 to-indigo-600",
      tasks: [
        { id: "1", title: "Requirements analysis", completed: true },
        { id: "2", title: "Stakeholder interviews", completed: true },
        { id: "3", title: "Technical feasibility", completed: true },
        { id: "4", title: "Project charter", completed: true }
      ]
    },
    {
      id: "design",
      title: "UI/UX Design",
      description: "User experience design and visual identity creation",
      status: "completed",
      icon: <Palette className="w-6 h-6" />,
      dependencies: ["discovery"],
      duration: "3 weeks",
      priority: "high",
      category: "design",
      color: "from-pink-500 to-rose-600",
      tasks: [
        { id: "1", title: "User research", completed: true },
        { id: "2", title: "Wireframes", completed: true },
        { id: "3", title: "Design system", completed: true },
        { id: "4", title: "Prototypes", completed: true }
      ]
    },
    {
      id: "database",
      title: "Database Architecture",
      description: "Data modeling and database schema design",
      status: "completed",
      icon: <Database className="w-6 h-6" />,
      dependencies: ["discovery"],
      duration: "2 weeks",
      priority: "high",
      category: "development",
      color: "from-blue-500 to-cyan-600",
      tasks: [
        { id: "1", title: "Entity modeling", completed: true },
        { id: "2", title: "Schema design", completed: true },
        { id: "3", title: "Migration scripts", completed: true },
        { id: "4", title: "Indexing strategy", completed: true }
      ]
    },
    {
      id: "frontend",
      title: "Frontend Development",
      description: "Interactive user interface implementation",
      status: "in-progress",
      icon: <Code className="w-6 h-6" />,
      dependencies: ["design"],
      duration: "5 weeks",
      priority: "high",
      category: "development",
      color: "from-emerald-500 to-teal-600",
      tasks: [
        { id: "1", title: "Component library", completed: true },
        { id: "2", title: "Page layouts", completed: true },
        { id: "3", title: "State management", completed: false },
        { id: "4", title: "API integration", completed: false },
        { id: "5", title: "Responsive design", completed: false }
      ]
    },
    {
      id: "backend",
      title: "Backend Development",
      description: "Server-side logic and API development",
      status: "upcoming",
      icon: <Server className="w-6 h-6" />,
      dependencies: ["database"],
      duration: "4 weeks",
      priority: "high",
      category: "development",
      color: "from-orange-500 to-red-600",
      tasks: [
        { id: "1", title: "API endpoints", completed: false },
        { id: "2", title: "Authentication", completed: false },
        { id: "3", title: "Business logic", completed: false },
        { id: "4", title: "Data validation", completed: false }
      ]
    },
    {
      id: "integration",
      title: "System Integration",
      description: "Connecting frontend and backend systems",
      status: "upcoming",
      icon: <Zap className="w-6 h-6" />,
      dependencies: ["frontend", "backend"],
      duration: "2 weeks",
      priority: "medium",
      category: "development",
      color: "from-yellow-500 to-amber-600",
      tasks: [
        { id: "1", title: "API integration", completed: false },
        { id: "2", title: "Error handling", completed: false },
        { id: "3", title: "Performance optimization", completed: false }
      ]
    },
    {
      id: "testing",
      title: "Quality Assurance",
      description: "Comprehensive testing and bug fixes",
      status: "upcoming",
      icon: <Shield className="w-6 h-6" />,
      dependencies: ["integration"],
      duration: "3 weeks",
      priority: "high",
      category: "testing",
      color: "from-violet-500 to-purple-600",
      tasks: [
        { id: "1", title: "Unit testing", completed: false },
        { id: "2", title: "Integration testing", completed: false },
        { id: "3", title: "User acceptance testing", completed: false },
        { id: "4", title: "Performance testing", completed: false }
      ]
    },
    {
      id: "deployment",
      title: "Production Deployment",
      description: "Launch and go-live operations",
      status: "upcoming",
      icon: <Rocket className="w-6 h-6" />,
      dependencies: ["testing"],
      duration: "1 week",
      priority: "high",
      category: "deployment",
      color: "from-indigo-500 to-blue-600",
      tasks: [
        { id: "1", title: "Environment setup", completed: false },
        { id: "2", title: "Deployment pipeline", completed: false },
        { id: "3", title: "Monitoring setup", completed: false },
        { id: "4", title: "Go-live checklist", completed: false }
      ]
    }
  ];

  // Graph algorithms
  const topologicalSort = useMemo(() => {
    const inDegree: { [key: string]: number } = {};
    const adjList: { [key: string]: string[] } = {};
    
    // Initialize
    graphNodes.forEach(node => {
      inDegree[node.id] = 0;
      adjList[node.id] = [];
    });
    
    // Build adjacency list and calculate in-degrees
    graphNodes.forEach(node => {
      node.dependencies.forEach(dep => {
        adjList[dep].push(node.id);
        inDegree[node.id]++;
      });
    });
    
    // Topological sort using Kahn's algorithm
    const queue: string[] = [];
    const result: string[] = [];
    
    Object.keys(inDegree).forEach(node => {
      if (inDegree[node] === 0) queue.push(node);
    });
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);
      
      adjList[current].forEach(neighbor => {
        inDegree[neighbor]--;
        if (inDegree[neighbor] === 0) queue.push(neighbor);
      });
    }
    
    return result;
  }, [graphNodes]);

    // Calculate node positions for better graph layout
  const nodePositions = useMemo(() => {
    const positions: { [key: string]: { x: number; y: number } } = {};
    
    // Define specific positions for a clean connected flow
    const nodeLayout = {
      discovery: { x: 200, y: 100 },
      design: { x: 500, y: 100 },
      database: { x: 200, y: 300 },
      frontend: { x: 600, y: 300 },
      backend: { x: 300, y: 500 },
      integration: { x: 600, y: 500 },
      testing: { x: 450, y: 700 },
      deployment: { x: 450, y: 900 }
    };
    
    // Apply the predefined layout
    graphNodes.forEach(node => {
      if (nodeLayout[node.id as keyof typeof nodeLayout]) {
        positions[node.id] = nodeLayout[node.id as keyof typeof nodeLayout];
      }
    });
    
    return positions;
  }, [graphNodes]);

  // Generate connections
  const connections: Connection[] = useMemo(() => {
    const conns: Connection[] = [];
    graphNodes.forEach(node => {
      node.dependencies.forEach(dep => {
        conns.push({
          from: dep,
          to: node.id,
          type: "dependency"
        });
      });
    });
    return conns;
  }, [graphNodes]);

  // Status checking
  const getNodeStatus = (node: GraphNode): GraphNode["status"] => {
    const blockedByDeps = node.dependencies.some(depId => {
      const depNode = graphNodes.find(n => n.id === depId);
      return depNode && depNode.status !== "completed";
    });
    
    if (blockedByDeps && node.status === "upcoming") return "blocked";
    return node.status;
  };

  const getProgress = (tasks: GraphNode["tasks"]) => {
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const getStatusIcon = (status: GraphNode["status"]) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case "in-progress": return <Play className="w-5 h-5 text-yellow-400" />;
      case "blocked": return <AlertCircle className="w-5 h-5 text-red-400" />;
      default: return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  // Animation effects
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedConnections(prev => {
        const newSet = new Set(prev);
        connections.forEach(conn => {
          if (Math.random() > 0.8) {
            newSet.add(`${conn.from}-${conn.to}`);
          } else {
            newSet.delete(`${conn.from}-${conn.to}`);
          }
        });
        return newSet;
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, [connections]);

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
  };

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      {/* Modern grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      {/* Dynamic floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
        <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-pink-400 rounded-full animate-ping delay-2000"></div>
      </div>

      {/* Modern glass header */}
      <div className="relative z-10 text-center py-4 sm:py-8">
        <div className="inline-flex items-center justify-center mb-4 sm:mb-6 px-4 sm:px-6 py-2 sm:py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
          <GitBranch className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 mr-2 sm:mr-3" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Development Roadmap
          </h1>
          <div className="ml-3 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
        </div>
        <p className="text-gray-400 mb-6">Interactive project timeline with dependency tracking</p>
      </div>

      {/* Modern timeline layout */}
      <div className="relative z-20 max-w-7xl lg:max-w-[90rem] mx-auto px-2 sm:px-4">
        {/* Enhanced central timeline spine with creative progress fill */}
        <div className="absolute left-1/2 top-0 bottom-0 transform -translate-x-1">
          {/* Background spine with subtle glow */}
          <div className="w-1 h-full bg-gray-700/40 rounded-full shadow-inner"></div>
          
          {/* Creative progress-filled spine with animations */}
          <div className="absolute top-0 left-0 w-1 rounded-full overflow-hidden shadow-lg"
               style={{ height: `${(() => {
                 let totalTasks = 0;
                 let completedTasks = 0;
                 graphNodes.forEach(node => {
                   totalTasks += node.tasks.length;
                   completedTasks += node.tasks.filter(t => t.completed).length;
                 });
                 return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
               })()}%` }}>
            {/* Multi-layer gradient background */}
            <div className="w-full h-full bg-gradient-to-b from-emerald-300 via-emerald-400 to-emerald-600 relative">
              {/* Animated flowing overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-emerald-200/20 to-transparent animate-pulse"></div>
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-transparent animate-ping opacity-60"></div>
              {/* Progress glow */}
              <div className="absolute -inset-0.5 bg-emerald-400/50 blur-sm rounded-full"></div>
            </div>
          </div>
          
          {/* Dynamic progress indicator - stable and consistent */}
          <div className="absolute w-3 h-3 bg-emerald-500 rounded-full shadow-lg border-2 border-white" 
               style={{ 
                 top: `${(() => {
                   let totalTasks = 0;
                   let completedTasks = 0;
                   graphNodes.forEach(node => {
                     totalTasks += node.tasks.length;
                     completedTasks += node.tasks.filter(t => t.completed).length;
                   });
                   return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
                 })()}%`, 
                 left: '-4px',
                 transform: 'translateY(-50%)'
               }}>
            {/* Subtle glow effect instead of aggressive animation */}
            <div className="absolute -inset-1 bg-emerald-400/30 rounded-full blur-sm"></div>
          </div>
        </div>

        {/* Dependency indicators */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-700/30"></div>
        <div className="absolute right-4 top-0 bottom-0 w-px bg-gray-700/30"></div>

        {/* Modern node cards */}
        <div className="relative space-y-6 sm:space-y-8 py-4 sm:py-8">
          {graphNodes.map((node, index) => {
            const actualStatus = getNodeStatus(node);
            const progress = getProgress(node.tasks);
            const isSelected = selectedNode === node.id;
            const isHovered = hoveredNode === node.id;
            const isLeft = index % 2 === 0;
            
            return (
              <div
                key={node.id}
                className={`relative flex ${isLeft ? 'justify-start' : 'justify-end'} items-center group`}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Clear phase connector with number - aligned with progress line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center" style={{ top: '1.75rem' }}>
                  {/* Phase number circle */}
                  <div className={`relative w-10 h-10 sm:w-8 sm:h-8 rounded-full border-4 sm:border-3 border-white transition-all duration-300 flex items-center justify-center ${
                    actualStatus === 'completed' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' :
                    actualStatus === 'in-progress' ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50 animate-pulse' :
                    actualStatus === 'blocked' ? 'bg-red-500 shadow-lg shadow-red-500/50' :
                    'bg-gray-600 shadow-lg shadow-gray-600/30'
                  } ${isHovered ? 'scale-110 shadow-2xl' : ''}`}>
                    
                    {/* Phase number or status icon */}
                    {actualStatus === 'completed' ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : actualStatus === 'in-progress' ? (
                      <Play className="w-3 h-3 text-white ml-0.5" />
                    ) : actualStatus === 'blocked' ? (
                      <Pause className="w-3 h-3 text-white" />
                    ) : (
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    )}
                    
                    {/* Status ring animation */}
                    {actualStatus === 'in-progress' && (
                      <div className="absolute inset-0 rounded-full border-2 border-yellow-300 animate-ping"></div>
                    )}
                  </div>
                  
                  {/* Phase status label */}
                  <div className={`mt-1 px-2 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm ${
                    actualStatus === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    actualStatus === 'in-progress' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                    actualStatus === 'blocked' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                    'bg-gray-600/20 text-gray-400 border border-gray-600/30'
                  }`}>
                    {actualStatus === 'completed' ? 'Done' :
                     actualStatus === 'in-progress' ? 'Active' :
                     actualStatus === 'blocked' ? 'Blocked' : 'Pending'}
                  </div>
                </div>

                {/* Enhanced horizontal connector with duration badge - with proper spacing */}
                <div className={`absolute flex items-center`} style={{ 
                  top: '1.9rem',
                  left: isLeft ? 'calc(50% + 24px)' : '4px',
                  right: isLeft ? '4px' : 'calc(50% + 24px)'
                }}>
                  {/* Duration badge for left side - positioned at left end with spacing */}
                  {isLeft && (
                    <div className={`mr-4 px-2 py-1 rounded-md text-xs backdrop-blur-sm whitespace-nowrap ${
                      actualStatus === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      actualStatus === 'in-progress' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                      actualStatus === 'blocked' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                      'bg-gray-600/20 text-gray-400 border border-gray-600/30'
                    }`}>
                      {node.duration}
                    </div>
                  )}
                  
                  <div className={`flex-1 h-0.5 ${
                    actualStatus === 'completed' ? 'bg-gradient-to-r from-emerald-400/80 to-emerald-400/20' :
                    actualStatus === 'in-progress' ? 'bg-gradient-to-r from-yellow-400/80 to-yellow-400/20' :
                    actualStatus === 'blocked' ? 'bg-gradient-to-r from-red-400/80 to-red-400/20' :
                    'bg-gradient-to-r from-gray-600/60 to-gray-600/20'
                  } transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-70'} relative`}>
                    
                    {/* Connection flow animation */}
                    {actualStatus !== 'blocked' && (
                      <div className={`absolute inset-0 ${
                        isLeft ? 'bg-gradient-to-r from-transparent via-white/20 to-transparent' :
                        'bg-gradient-to-l from-transparent via-white/20 to-transparent'
                      } animate-pulse`}></div>
                    )}
                  </div>
                  
                  {/* Duration badge for right side - positioned at right end with spacing */}
                  {!isLeft && (
                    <div className={`ml-4 px-2 py-1 rounded-md text-xs backdrop-blur-sm whitespace-nowrap ${
                      actualStatus === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      actualStatus === 'in-progress' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                      actualStatus === 'blocked' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                      'bg-gray-600/20 text-gray-400 border border-gray-600/30'
                    }`}>
                      {node.duration}
                    </div>
                  )}
                </div>

                {/* Modern glassmorphism card - mobile optimized */}
                <div className={`w-full sm:w-[28rem] lg:w-[32rem] xl:w-[35rem] max-w-lg sm:max-w-xl lg:max-w-2xl ${isLeft ? 'mr-1 sm:mr-4' : 'ml-1 sm:ml-4'} transition-all duration-500 ${
                  isSelected ? 'scale-105 z-50' : isHovered ? 'scale-102 z-40' : 'z-30'
                }`}>
                  <Card 
                    className={`cursor-pointer transition-all duration-500 backdrop-blur-xl border-0 ${
                      actualStatus === 'completed' ? 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 shadow-2xl shadow-emerald-500/20' :
                      actualStatus === 'in-progress' ? 'bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 shadow-2xl shadow-yellow-500/20' :
                      actualStatus === 'blocked' ? 'bg-gradient-to-br from-red-500/10 to-red-600/5 shadow-2xl shadow-red-500/20' :
                      'bg-gradient-to-br from-gray-800/40 to-gray-900/30 shadow-xl shadow-gray-500/10'
                    } ${isSelected ? 'shadow-3xl' : ''} 
                    hover:shadow-2xl group-hover:shadow-emerald-500/20 rounded-3xl overflow-hidden`}
                    onClick={() => handleNodeClick(node.id)}
                  >
                    {/* Card header with status indicator */}
                    <div className={`h-1 w-full ${
                      actualStatus === 'completed' ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' :
                      actualStatus === 'in-progress' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                      actualStatus === 'blocked' ? 'bg-gradient-to-r from-red-400 to-red-600' :
                      'bg-gradient-to-r from-gray-400 to-gray-600'
                    }`}></div>

                    <div className="p-5 sm:p-6">
                      {/* Icon and status */}
                      <div className="flex items-start justify-between mb-4 sm:mb-4">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className={`w-14 h-14 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br ${node.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <div className="text-white">{node.icon}</div>
                          </div>
                          <div>
                            <h3 className="text-lg sm:text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors leading-tight">
                              {node.title}
                            </h3>
                            <p className="text-gray-300 text-sm sm:text-sm leading-relaxed font-medium">{node.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-1 sm:space-y-2">
                          {getStatusIcon(actualStatus)}
                          <Badge className={`text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 ${
                            actualStatus === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                            actualStatus === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                            actualStatus === 'blocked' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                            'bg-gray-500/20 text-gray-400 border-gray-500/30'
                          }`}>
                            {actualStatus.replace('-', ' ')}
                          </Badge>
                        </div>
                      </div>

                      {/* Progress section */}
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-white font-medium">{progress}%</span>
                        </div>
                        
                        {/* Modern progress bar */}
                        <div className="relative h-2 bg-gray-800/50 rounded-full overflow-hidden">
                          <div 
                            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${
                              actualStatus === 'completed' ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' :
                              actualStatus === 'in-progress' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                              actualStatus === 'blocked' ? 'bg-gradient-to-r from-red-400 to-red-600' :
                              'bg-gradient-to-r from-gray-400 to-gray-600'
                            }`}
                            style={{ width: `${progress}%` }}
                          >
                            {actualStatus === 'in-progress' && (
                              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
                            )}
                          </div>
                        </div>

                        {/* Current task indicator */}
                        {actualStatus === 'in-progress' && (
                          <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                            <div className="flex items-center space-x-2 mb-1">
                              <Play className="w-3 h-3 text-yellow-400" />
                              <span className="text-xs font-medium text-yellow-300">Current Task</span>
                            </div>
                            <div className="text-xs text-yellow-200">
                              {node.tasks.find(t => !t.completed)?.title || 'All tasks completed'}
                            </div>
                          </div>
                        )}

                        {/* Meta info */}
                        <div className="flex flex-wrap items-center justify-between gap-1 text-xs text-gray-500 pt-2">
                          <span className="text-xs">{node.duration}</span>
                          <span className="capitalize text-xs">{node.category}</span>
                          <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-700/30 rounded-full capitalize text-xs">{node.priority}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced selected node details */}
        {selectedNode && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 lg:p-8">
            {(() => {
              const node = graphNodes.find(n => n.id === selectedNode);
              if (!node) return null;
              
              const actualStatus = getNodeStatus(node);
              const progress = getProgress(node.tasks);
              
              return (
                <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-gray-900/95 backdrop-blur-2xl border border-gray-700/50 shadow-3xl rounded-2xl sm:rounded-3xl">
                  {/* Header gradient */}
                  <div className={`h-2 w-full ${
                    actualStatus === 'completed' ? 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600' :
                    actualStatus === 'in-progress' ? 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600' :
                    actualStatus === 'blocked' ? 'bg-gradient-to-r from-red-400 via-red-500 to-red-600' :
                    'bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600'
                  }`}></div>

                  <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 sm:mb-8 gap-4">
                      <div className="flex items-center space-x-4 sm:space-x-6">
                        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${node.color} flex items-center justify-center shadow-2xl`}>
                          <div className="text-white text-xl sm:text-2xl">{node.icon}</div>
                        </div>
                        <div className="flex-1">
                          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">{node.title}</h2>
                          <p className="text-gray-300 text-sm sm:text-base lg:text-lg mb-4">{node.description}</p>
                          <div className="flex items-center space-x-4">
                            <Badge className={`px-4 py-2 text-sm font-medium ${
                              actualStatus === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                              actualStatus === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                              actualStatus === 'blocked' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                              'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                            } rounded-full`}>
                              {actualStatus.replace('-', ' ').toUpperCase()}
                            </Badge>
                            <div className="flex items-center space-x-2 text-gray-400">
                              <Clock className="w-4 h-4" />
                              <span>{node.duration}</span>
                            </div>
                            <Badge variant="outline" className="px-3 py-1 rounded-full capitalize">
                              {node.priority} priority
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedNode(null)}
                        className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700/50 rounded-full"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                      {/* Progress section */}
                      <div className="lg:col-span-1">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                          Progress Overview
                        </h3>
                        <div className="space-y-4 p-6 bg-gray-800/30 rounded-2xl">
                          <div className="text-center">
                            <div className="text-4xl font-bold text-white mb-2">{progress}%</div>
                            <div className="text-gray-400">Complete</div>
                          </div>
                          <div className="relative h-3 bg-gray-700/50 rounded-full overflow-hidden">
                            <div 
                              className={`absolute top-0 left-0 h-full rounded-full ${
                                actualStatus === 'completed' ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' :
                                actualStatus === 'in-progress' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                                actualStatus === 'blocked' ? 'bg-gradient-to-r from-red-400 to-red-600' :
                                'bg-gradient-to-r from-gray-400 to-gray-600'
                              } transition-all duration-1000`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="text-center">
                              <div className="text-emerald-400 font-semibold">{node.tasks.filter(t => t.completed).length}</div>
                              <div className="text-gray-500">Completed</div>
                            </div>
                            <div className="text-center">
                              <div className="text-gray-400 font-semibold">{node.tasks.filter(t => !t.completed).length}</div>
                              <div className="text-gray-500">Remaining</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tasks section */}
                      <div className="lg:col-span-1">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <CheckCircle2 className="w-5 h-5 text-blue-400 mr-3" />
                          Task List
                        </h3>
                        <div className="space-y-3 p-6 bg-gray-800/30 rounded-2xl max-h-80 overflow-y-auto">
                          {node.tasks.map((task, index) => (
                            <div key={task.id} className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
                              task.completed ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-gray-700/30 hover:bg-gray-700/50'
                            }`}>
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                task.completed ? 'bg-emerald-500' : 'bg-gray-600'
                              }`}>
                                {task.completed ? (
                                  <CheckCircle className="w-3 h-3 text-white" />
                                ) : (
                                  <span className="text-xs text-white">{index + 1}</span>
                                )}
                              </div>
                              <span className={`flex-1 text-sm ${
                                task.completed ? 'text-emerald-300 line-through' : 'text-white'
                              }`}>
                                {task.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Dependencies section */}
                      <div className="lg:col-span-1">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <GitBranch className="w-5 h-5 text-purple-400 mr-3" />
                          Dependencies
                        </h3>
                        <div className="p-6 bg-gray-800/30 rounded-2xl">
                          {node.dependencies.length > 0 ? (
                            <div className="space-y-3">
                              {node.dependencies.map(depId => {
                                const depNode = graphNodes.find(n => n.id === depId);
                                return depNode ? (
                                  <div key={depId} className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-xl">
                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${depNode.color} flex items-center justify-center`}>
                                      <div className="text-white text-xs">{depNode.icon}</div>
                                    </div>
                                    <div className="flex-1">
                                      <div className="text-sm text-gray-300 font-medium">{depNode.title}</div>
                                      <div className="text-xs text-gray-500">{depNode.status}</div>
                                    </div>
                                    {depNode.status === 'completed' ? (
                                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                                    ) : (
                                      <Clock className="w-5 h-5 text-yellow-400" />
                                    )}
                                  </div>
                                ) : null;
                              })}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <div className="w-16 h-16 bg-gray-700/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Sparkles className="w-8 h-8 text-gray-500" />
                              </div>
                              <p className="text-gray-400">No dependencies required</p>
                              <p className="text-gray-500 text-sm">This phase can start independently</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
