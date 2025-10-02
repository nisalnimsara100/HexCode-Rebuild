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
  Sparkles
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

  // Calculate node positions using force-directed layout
  const nodePositions = useMemo(() => {
    const positions: { [key: string]: { x: number; y: number } } = {};
    const levels: { [key: string]: number } = {};
    
    // Assign levels based on topological order
    topologicalSort.forEach((nodeId, index) => {
      levels[nodeId] = Math.floor(index / 2);
    });
    
    // Position nodes in a curved flow
    Object.keys(levels).forEach(nodeId => {
      const level = levels[nodeId];
      const nodesAtLevel = Object.keys(levels).filter(id => levels[id] === level);
      const indexAtLevel = nodesAtLevel.indexOf(nodeId);
      
      const centerX = 400;
      const levelHeight = 200;
      const nodeSpacing = 300;
      
      // Create curved flow
      const curveFactor = Math.sin(level * 0.5) * 100;
      
      positions[nodeId] = {
        x: centerX + (indexAtLevel - (nodesAtLevel.length - 1) / 2) * nodeSpacing + curveFactor,
        y: level * levelHeight + 100
      };
    });
    
    return positions;
  }, [topologicalSort]);

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
    <div className="relative w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -right-8 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 text-center py-12">
        <div className="flex items-center justify-center mb-6">
          <GitBranch className="w-8 h-8 text-emerald-400 mr-3" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Project Roadmap Graph
          </h1>
          <Sparkles className="w-8 h-8 text-purple-400 ml-3 animate-spin" />
        </div>
        <p className="text-xl text-gray-300 mb-4">Interactive dependency visualization with real-time progress tracking</p>
        <div className="w-32 h-1 bg-gradient-to-r from-emerald-400 to-purple-400 mx-auto rounded-full"></div>
      </div>

      {/* Graph visualization */}
      <div className="relative z-20 px-8">
        <svg 
          width="100%" 
          height="800" 
          viewBox="0 0 800 800" 
          className="absolute top-0 left-0 pointer-events-none"
        >
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Render connections */}
          {connections.map((conn, index) => {
            const fromPos = nodePositions[conn.from];
            const toPos = nodePositions[conn.to];
            
            if (!fromPos || !toPos) return null;
            
            const isAnimated = animatedConnections.has(`${conn.from}-${conn.to}`);
            const midX = (fromPos.x + toPos.x) / 2;
            const midY = (fromPos.y + toPos.y) / 2 - 50; // Curve upward
            
            return (
              <g key={`${conn.from}-${conn.to}`}>
                <path
                  d={`M ${fromPos.x} ${fromPos.y + 30} Q ${midX} ${midY} ${toPos.x} ${toPos.y - 30}`}
                  stroke="url(#connectionGradient)"
                  strokeWidth={isAnimated ? "3" : "2"}
                  fill="none"
                  filter={isAnimated ? "url(#glow)" : "none"}
                  className={`transition-all duration-500 ${isAnimated ? 'animate-pulse' : ''}`}
                />
                
                {/* Animated particles */}
                {isAnimated && (
                  <circle r="4" fill="#10b981" className="animate-ping">
                    <animateMotion
                      dur="3s"
                      repeatCount="indefinite"
                      path={`M ${fromPos.x} ${fromPos.y + 30} Q ${midX} ${midY} ${toPos.x} ${toPos.y - 30}`}
                    />
                  </circle>
                )}
                
                {/* Arrow head */}
                <polygon
                  points={`${toPos.x-5},${toPos.y-35} ${toPos.x+5},${toPos.y-35} ${toPos.x},${toPos.y-25}`}
                  fill="#10b981"
                  className={isAnimated ? 'animate-pulse' : ''}
                />
              </g>
            );
          })}
        </svg>

        {/* Render nodes */}
        <div className="relative">
          {graphNodes.map((node) => {
            const position = nodePositions[node.id];
            const actualStatus = getNodeStatus(node);
            const progress = getProgress(node.tasks);
            const isSelected = selectedNode === node.id;
            const isHovered = hoveredNode === node.id;
            
            if (!position) return null;
            
            return (
              <div
                key={node.id}
                className={`absolute transition-all duration-500 ${
                  isSelected ? 'scale-110 z-50' : isHovered ? 'scale-105 z-40' : 'z-30'
                }`}
                style={{
                  left: position.x - 80,
                  top: position.y - 40,
                  transform: `translateZ(${isSelected ? '50px' : '0px'})`,
                }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <Card 
                  className={`w-40 h-20 cursor-pointer transition-all duration-300 backdrop-blur-sm ${
                    actualStatus === 'completed' ? 'bg-emerald-500/20 border-emerald-500/50 shadow-emerald-500/25' :
                    actualStatus === 'in-progress' ? 'bg-yellow-500/20 border-yellow-500/50 shadow-yellow-500/25' :
                    actualStatus === 'blocked' ? 'bg-red-500/20 border-red-500/50 shadow-red-500/25' :
                    'bg-gray-800/40 border-gray-600/50'
                  } ${isSelected ? 'shadow-2xl shadow-emerald-500/30' : 'shadow-lg'} 
                  hover:shadow-xl hover:shadow-emerald-500/20`}
                  onClick={() => handleNodeClick(node.id)}
                >
                  <div className="p-3 h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${node.color} flex items-center justify-center shadow-lg`}>
                        <div className="text-white text-xs">{node.icon}</div>
                      </div>
                      {getStatusIcon(actualStatus)}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white truncate mb-1">{node.title}</h3>
                      <div className="w-full bg-gray-700 rounded-full h-1">
                        <div 
                          className={`h-1 rounded-full transition-all duration-1000 ${
                            actualStatus === 'completed' ? 'bg-emerald-500' :
                            actualStatus === 'in-progress' ? 'bg-yellow-500' :
                            'bg-gray-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Selected node details */}
        {selectedNode && (
          <div className="fixed bottom-8 left-8 right-8 z-50">
            {(() => {
              const node = graphNodes.find(n => n.id === selectedNode);
              if (!node) return null;
              
              const actualStatus = getNodeStatus(node);
              const progress = getProgress(node.tasks);
              
              return (
                <Card className="bg-gray-800/95 backdrop-blur-xl border-gray-600/50 shadow-2xl">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${node.color} flex items-center justify-center shadow-lg`}>
                          <div className="text-white">{node.icon}</div>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">{node.title}</h2>
                          <p className="text-gray-300">{node.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge className={`${
                              actualStatus === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                              actualStatus === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' :
                              actualStatus === 'blocked' ? 'bg-red-500/20 text-red-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {actualStatus.replace('-', ' ').toUpperCase()}
                            </Badge>
                            <span className="text-sm text-gray-400">{node.duration}</span>
                            <Badge variant="outline">{node.priority} priority</Badge>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedNode(null)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Tasks ({progress}% complete)</h3>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {node.tasks.map((task) => (
                            <div key={task.id} className="flex items-center space-x-3">
                              <div className={`w-4 h-4 rounded-full ${task.completed ? 'bg-emerald-500' : 'bg-gray-600'}`} />
                              <span className={`text-sm ${task.completed ? 'text-emerald-300 line-through' : 'text-white'}`}>
                                {task.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Dependencies</h3>
                        {node.dependencies.length > 0 ? (
                          <div className="space-y-2">
                            {node.dependencies.map(depId => {
                              const depNode = graphNodes.find(n => n.id === depId);
                              return depNode ? (
                                <div key={depId} className="flex items-center space-x-2">
                                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                                  <span className="text-sm text-gray-300">{depNode.title}</span>
                                  {depNode.status === 'completed' ? (
                                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                                  ) : (
                                    <Clock className="w-4 h-4 text-yellow-400" />
                                  )}
                                </div>
                              ) : null;
                            })}
                          </div>
                        ) : (
                          <p className="text-gray-400 text-sm">No dependencies</p>
                        )}
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
