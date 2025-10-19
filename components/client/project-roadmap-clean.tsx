"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Circle, 
  GitBranch,
  Maximize2,
  Minimize2,
  X
} from "lucide-react";

interface GraphNode {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "upcoming" | "blocked";
  x: number;
  y: number;
  radius: number;
  color: string;
  tasks: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
  duration: string;
  category: string;
}

interface ProjectData {
  id: string;
  name: string;
  status: string;
  progress: number;
  technologies: string[];
}

interface ProjectRoadmapProps {
  projectData?: ProjectData;
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProjectGraph, GraphNode, createProjectGraph } from "@/lib/advanced-graph";
import { 
  CheckCircle, 
  Circle, 
  GitBranch,
  Maximize2,
  Minimize2,
  X,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Calendar,
  Clock,
  Users,
  Target,
  TrendingUp,
  AlertTriangle,
  Filter,
  Settings,
  Eye,
  EyeOff
} from "lucide-react";

interface ProjectData {
  id: string;
  name: string;
  status: string;
  progress: number;
  technologies: string[];
}

interface AdvancedRoadmapProps {
  projectData?: ProjectData;
}

export function AdvancedGraphRoadmap({ projectData }: AdvancedRoadmapProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Generate nodes based on project data
  const generateNodes = (): GraphNode[] => {
    const nodes: GraphNode[] = [
      {
        id: "discovery",
        title: "Discovery",
        description: projectData ? `Planning for ${projectData.name}` : "Project planning and requirements",
        status: "completed",
        x: 200,
        y: 150,
        radius: 40,
        color: "#8B5CF6",
        category: "design",
        duration: "2 weeks",
        tasks: [
          { id: "1", title: "Requirements analysis", completed: true },
          { id: "2", title: "Stakeholder interviews", completed: true }
        ]
      },
      {
        id: "design",
        title: "UI/UX Design",
        description: "User interface and experience design",
        status: "completed",
        x: 450,
        y: 100,
        radius: 40,
        color: "#EC4899",
        category: "design",
        duration: "3 weeks",
        tasks: [
          { id: "1", title: "Wireframes", completed: true },
          { id: "2", title: "Design system", completed: true }
        ]
      }
    ];

    // Add technology-specific nodes
    if (projectData?.technologies) {
      if (projectData.technologies.some(tech => tech.includes("React") || tech.includes("Next"))) {
        nodes.push({
          id: "frontend",
          title: "Frontend",
          description: "React/Next.js development",
          status: projectData.progress > 40 ? (projectData.status === "completed" ? "completed" : "in-progress") : "upcoming",
          x: 700,
          y: 200,
          radius: 40,
          color: "#10B981",
          category: "development",
          duration: "5 weeks",
          tasks: [
            { id: "1", title: "Components", completed: projectData.progress > 50 },
            { id: "2", title: "Pages", completed: projectData.progress > 70 }
          ]
        });
      }

      if (projectData.technologies.some(tech => tech.includes("Node") || tech.includes("MongoDB"))) {
        nodes.push({
          id: "backend",
          title: "Backend",
          description: "API and database development",
          status: projectData.progress > 30 ? (projectData.status === "completed" ? "completed" : "in-progress") : "upcoming",
          x: 450,
          y: 300,
          radius: 40,
          color: "#F59E0B",
          category: "development",
          duration: "4 weeks",
          tasks: [
            { id: "1", title: "API endpoints", completed: projectData.progress > 40 },
            { id: "2", title: "Database setup", completed: projectData.progress > 60 }
          ]
        });
      }

      if (projectData.technologies.includes("Stripe")) {
        nodes.push({
          id: "payment",
          title: "Payment",
          description: "Stripe payment integration",
          status: projectData.progress > 60 ? "in-progress" : "upcoming",
          x: 200,
          y: 400,
          radius: 40,
          color: "#8B5CF6",
          category: "development",
          duration: "2 weeks",
          tasks: [
            { id: "1", title: "Stripe setup", completed: projectData.progress > 70 }
          ]
        });
      }
    }

    // Always add testing and deployment
    nodes.push({
      id: "testing",
      title: "Testing",
      description: "Quality assurance and testing",
      status: projectData ? (projectData.progress > 80 ? "in-progress" : "upcoming") : "upcoming",
      x: 700,
      y: 400,
      radius: 40,
      color: "#8B5CF6",
      category: "testing",
      duration: "3 weeks",
      tasks: [
        { id: "1", title: "Unit tests", completed: projectData ? projectData.progress > 85 : false }
      ]
    });

    nodes.push({
      id: "deployment",
      title: "Deployment",
      description: "Production deployment and launch",
      status: projectData ? (projectData.status === "completed" ? "completed" : "upcoming") : "upcoming",
      x: 950,
      y: 300,
      radius: 40,
      color: "#6366F1",
      category: "deployment",
      duration: "1 week",
      tasks: [
        { id: "1", title: "Go-live", completed: projectData?.status === "completed" }
      ]
    });

    return nodes;
  };

  const nodes = generateNodes();

  // Define connections
  const connections = [
    { from: "discovery", to: "design" },
    { from: "design", to: "frontend" },
    { from: "discovery", to: "backend" },
    { from: "backend", to: "payment" },
    { from: "frontend", to: "testing" },
    { from: "payment", to: "testing" },
    { from: "testing", to: "deployment" }
  ].filter(conn => {
    const fromNode = nodes.find(n => n.id === conn.from);
    const toNode = nodes.find(n => n.id === conn.to);
    return fromNode && toNode;
  });

  // Canvas drawing
  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw connections
    connections.forEach(conn => {
      const fromNode = nodes.find(n => n.id === conn.from);
      const toNode = nodes.find(n => n.id === conn.to);
      
      if (!fromNode || !toNode) return;

      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      
      const isActive = fromNode.status === 'completed';
      ctx.strokeStyle = isActive ? '#10B981' : '#374151';
      ctx.lineWidth = isActive ? 3 : 2;
      ctx.globalAlpha = 0.8;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Arrow
      const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
      const arrowX = toNode.x - Math.cos(angle) * (toNode.radius + 10);
      const arrowY = toNode.y - Math.sin(angle) * (toNode.radius + 10);
      
      ctx.save();
      ctx.translate(arrowX, arrowY);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-15, -5);
      ctx.lineTo(-15, 5);
      ctx.closePath();
      ctx.fillStyle = isActive ? '#10B981' : '#374151';
      ctx.fill();
      ctx.restore();
    });

    // Draw nodes
    nodes.forEach(node => {
      const isSelected = selectedNode === node.id;
      const isHovered = hoveredNode === node.id;
      const radius = isSelected ? node.radius + 8 : isHovered ? node.radius + 4 : node.radius;

      // Shadow
      ctx.shadowColor = node.color;
      ctx.shadowBlur = isSelected ? 20 : isHovered ? 15 : 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      
      const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius);
      
      switch (node.status) {
        case 'completed':
          gradient.addColorStop(0, '#10B981');
          gradient.addColorStop(1, '#059669');
          break;
        case 'in-progress':
          gradient.addColorStop(0, '#F59E0B');
          gradient.addColorStop(1, '#D97706');
          break;
        default:
          gradient.addColorStop(0, '#6B7280');
          gradient.addColorStop(1, '#4B5563');
      }
      
      ctx.fillStyle = gradient;
      ctx.fill();

      // Border
      ctx.strokeStyle = isSelected ? '#FFFFFF' : '#E5E7EB';
      ctx.lineWidth = isSelected ? 4 : 2;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Progress ring for in-progress nodes
      if (node.status === 'in-progress' && projectData) {
        const progressRadius = radius + 12;
        const progress = node.tasks.filter(t => t.completed).length / node.tasks.length;
        const progressAngle = progress * 2 * Math.PI - Math.PI / 2;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, progressRadius, -Math.PI / 2, progressAngle);
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 4;
        ctx.stroke();
      }

      // Label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${isSelected ? '14px' : '12px'} Inter`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.title, node.x, node.y);

      // Status indicator
      const statusX = node.x + radius - 8;
      const statusY = node.y - radius + 8;
      ctx.beginPath();
      ctx.arc(statusX, statusY, 6, 0, 2 * Math.PI);
      
      switch (node.status) {
        case 'completed': ctx.fillStyle = '#10B981'; break;
        case 'in-progress': ctx.fillStyle = '#F59E0B'; break;
        default: ctx.fillStyle = '#6B7280';
      }
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }, [nodes, connections, selectedNode, hoveredNode, projectData]);

  // Animation
  useEffect(() => {
    const animate = () => {
      drawGraph();
      requestAnimationFrame(animate);
    };
    animate();
  }, [drawGraph]);

  // Mouse handlers
  const getNodeAtPosition = (x: number, y: number): string | null => {
    for (const node of nodes) {
      const dx = x - node.x;
      const dy = y - node.y;
      if (Math.sqrt(dx * dx + dy * dy) <= node.radius) {
        return node.id;
      }
    }
    return null;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const nodeId = getNodeAtPosition(x, y);
    setSelectedNode(nodeId === selectedNode ? null : nodeId);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const nodeId = getNodeAtPosition(x, y);
    setHoveredNode(nodeId);
    canvas.style.cursor = nodeId ? 'pointer' : 'default';
  };

  const selectedNodeData = selectedNode ? nodes.find(n => n.id === selectedNode) : null;

  return (
    <div className={`relative w-full ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-900' : 'h-[600px] bg-slate-900 rounded-xl border border-slate-700'} overflow-hidden`}>
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border border-slate-600">
          <h3 className="text-white font-semibold flex items-center">
            <GitBranch className="w-5 h-5 text-emerald-400 mr-2" />
            {projectData ? `${projectData.name} Roadmap` : 'Interactive Graph Roadmap'}
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="bg-slate-800/90 border border-slate-600 rounded-lg p-2 text-white hover:bg-slate-700 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          {isFullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="bg-slate-800/90 border border-slate-600 rounded-lg p-2 text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={isFullscreen ? window.innerWidth : 1200}
        height={isFullscreen ? window.innerHeight : 600}
        className="w-full h-full cursor-default"
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
        onMouseLeave={() => setHoveredNode(null)}
      />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-4 border border-slate-600">
        <h4 className="text-white font-medium mb-3">Node Status</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
            <span className="text-gray-300 text-sm">Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
            <span className="text-gray-300 text-sm">In Progress</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
            <span className="text-gray-300 text-sm">Upcoming</span>
          </div>
        </div>
      </div>

      {/* Node Details Panel */}
      {selectedNodeData && (
        <div className="absolute top-20 right-4 w-80 bg-slate-800/95 backdrop-blur-sm rounded-lg border border-slate-600 p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-semibold">{selectedNodeData.title}</h4>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <p className="text-gray-300 text-sm mb-4">{selectedNodeData.description}</p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Status</span>
              <Badge className={`${
                selectedNodeData.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                selectedNodeData.status === 'in-progress' ? 'bg-amber-500/20 text-amber-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {selectedNodeData.status.replace('-', ' ')}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Duration</span>
              <span className="text-gray-300 text-sm">{selectedNodeData.duration}</span>
            </div>

            <div>
              <span className="text-gray-400 text-sm block mb-2">Tasks</span>
              <div className="space-y-1">
                {selectedNodeData.tasks.map((task, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {task.completed ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-500" />
                    )}
                    <span className={`text-sm ${task.completed ? 'text-gray-300 line-through' : 'text-gray-300'}`}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Panel */}
      <div className="absolute bottom-4 right-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-4 border border-slate-600">
        <h4 className="text-white font-medium mb-3">Graph Statistics</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Nodes</span>
            <span className="text-white">{nodes.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Connections</span>
            <span className="text-white">{connections.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Completed</span>
            <span className="text-emerald-400">
              {nodes.filter(n => n.status === 'completed').length}
            </span>
          </div>
          {projectData && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Progress</span>
              <span className="text-emerald-400">{projectData.progress}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}