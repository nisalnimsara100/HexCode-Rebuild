"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Graph } from "@/lib/graph";
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
  Users,
  DollarSign,
  Maximize2,
  Minimize2,
  RotateCcw,
  X
} from "lucide-react";

// Enhanced Graph Node with Canvas Support
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
  position: { x: number; y: number };
  color: string;
  // Canvas-specific properties
  radius: number;
  isHovered: boolean;
  isSelected: boolean;
}

interface Connection {
  from: string;
  to: string;
  type: "dependency" | "parallel" | "conditional";
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

export function ProjectRoadmap({ projectData }: ProjectRoadmapProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [animationFrame, setAnimationFrame] = useState(0);

  // Generate dynamic nodes based on project data
  const generateNodes = useCallback((projectData?: ProjectData): GraphNode[] => {
    const nodes: GraphNode[] = [
      {
        id: "discovery",
        title: "Discovery",
        description: projectData ? `Planning for ${projectData.name}` : "Project planning",
        status: "completed",
        icon: <Target className="w-6 h-6" />,
        dependencies: [],
        duration: "2 weeks",
        priority: "high",
        category: "design",
        position: { x: 200, y: 150 },
        color: "#8B5CF6",
        radius: 40,
        isHovered: false,
        isSelected: false,
        tasks: [
          { id: "1", title: "Requirements", completed: true },
          { id: "2", title: "Analysis", completed: true }
        ]
      },
      {
        id: "design",
        title: "UI/UX Design",
        description: "User interface design",
        status: "completed",
        icon: <Palette className="w-6 h-6" />,
        dependencies: ["discovery"],
        duration: "3 weeks",
        priority: "high",
        category: "design",
        position: { x: 450, y: 100 },
        color: "#EC4899",
        radius: 40,
        isHovered: false,
        isSelected: false,
        tasks: [
          { id: "1", title: "Wireframes", completed: true },
          { id: "2", title: "Prototypes", completed: true }
        ]
      }
    ];

    // Add technology-specific nodes
    if (projectData?.technologies) {
      if (projectData.technologies.includes("React") || projectData.technologies.includes("Next.js")) {
        nodes.push({
          id: "frontend",
          title: "Frontend Dev",
          description: "React development",
          status: projectData.progress > 40 ? (projectData.status === "completed" ? "completed" : "in-progress") : "upcoming",
          icon: <Code className="w-6 h-6" />,
          dependencies: ["design"],
          duration: "5 weeks",
          priority: "high",
          category: "development",
          position: { x: 700, y: 200 },
          color: "#10B981",
          radius: 40,
          isHovered: false,
          isSelected: false,
          tasks: [
            { id: "1", title: "Components", completed: projectData.progress > 50 },
            { id: "2", title: "Pages", completed: projectData.progress > 70 }
          ]
        });
      }

      if (projectData.technologies.includes("Node.js") || projectData.technologies.includes("MongoDB")) {
        nodes.push({
          id: "backend",
          title: "Backend Dev",
          description: "API development",
          status: projectData.progress > 30 ? (projectData.status === "completed" ? "completed" : "in-progress") : "upcoming",
          icon: <Server className="w-6 h-6" />,
          dependencies: ["discovery"],
          duration: "4 weeks",
          priority: "high",
          category: "development",
          position: { x: 450, y: 300 },
          color: "#F59E0B",
          radius: 40,
          isHovered: false,
          isSelected: false,
          tasks: [
            { id: "1", title: "API", completed: projectData.progress > 40 },
            { id: "2", title: "Database", completed: projectData.progress > 60 }
          ]
        });
      }

      if (projectData.technologies.includes("Stripe")) {
        nodes.push({
          id: "payment",
          title: "Payment",
          description: "Stripe integration",
          status: projectData.progress > 60 ? "in-progress" : "upcoming",
          icon: <DollarSign className="w-6 h-6" />,
          dependencies: ["backend"],
          duration: "2 weeks",
          priority: "high",
          category: "development",
          position: { x: 200, y: 400 },
          color: "#8B5CF6",
          radius: 40,
          isHovered: false,
          isSelected: false,
          tasks: [
            { id: "1", title: "Integration", completed: projectData.progress > 70 }
          ]
        });
      }
    }

    // Always add testing and deployment
    nodes.push(
      {
        id: "testing",
        title: "Testing",
        description: "Quality assurance",
        status: projectData ? (projectData.progress > 80 ? "in-progress" : "upcoming") : "upcoming",
        icon: <Shield className="w-6 h-6" />,
        dependencies: nodes.find(n => n.id === "frontend") ? ["frontend"] : ["backend"],
        duration: "3 weeks",
        priority: "high",
        category: "testing",
        position: { x: 700, y: 400 },
        color: "#8B5CF6",
        radius: 40,
        isHovered: false,
        isSelected: false,
        tasks: [
          { id: "1", title: "Unit tests", completed: projectData ? projectData.progress > 85 : false }
        ]
      },
      {
        id: "deployment",
        title: "Deployment",
        description: "Production launch",
        status: projectData ? (projectData.status === "completed" ? "completed" : "upcoming") : "upcoming",
        icon: <Rocket className="w-6 h-6" />,
        dependencies: ["testing"],
        duration: "1 week",
        priority: "high",
        category: "deployment",
        position: { x: 950, y: 300 },
        color: "#6366F1",
        radius: 40,
        isHovered: false,
        isSelected: false,
        tasks: [
          { id: "1", title: "Go-live", completed: projectData?.status === "completed" }
        ]
      }
    );

    return nodes;
  }, []);

  const graphNodes = useMemo(() => generateNodes(projectData), [generateNodes, projectData]);

  // Generate connections based on dependencies
  const connections: Connection[] = useMemo(() => {
    const conn: Connection[] = [];
    graphNodes.forEach(node => {
      node.dependencies.forEach(depId => {
        conn.push({
          from: depId,
          to: node.id,
          type: "dependency"
        });
      });
    });
    return conn;
  }, [graphNodes]);

  // Canvas drawing function
  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with dark theme
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    const gridSize = 50;
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw connections
    connections.forEach(connection => {
      const fromNode = graphNodes.find(n => n.id === connection.from);
      const toNode = graphNodes.find(n => n.id === connection.to);
      
      if (!fromNode || !toNode) return;

      ctx.beginPath();
      ctx.moveTo(fromNode.position.x, fromNode.position.y);
      ctx.lineTo(toNode.position.x, toNode.position.y);
      
      const isActive = fromNode.status === 'completed';
      ctx.strokeStyle = isActive ? '#10B981' : '#374151';
      ctx.lineWidth = isActive ? 3 : 2;
      ctx.globalAlpha = 0.8;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Draw arrow
      const angle = Math.atan2(toNode.position.y - fromNode.position.y, toNode.position.x - fromNode.position.x);
      const arrowLength = 15;
      const arrowX = toNode.position.x - Math.cos(angle) * (toNode.radius + 10);
      const arrowY = toNode.position.y - Math.sin(angle) * (toNode.radius + 10);
      
      ctx.save();
      ctx.translate(arrowX, arrowY);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-arrowLength, -5);
      ctx.lineTo(-arrowLength, 5);
      ctx.closePath();
      ctx.fillStyle = isActive ? '#10B981' : '#374151';
      ctx.fill();
      ctx.restore();
    });

    // Draw nodes
    graphNodes.forEach(node => {
      const isSelected = selectedNode === node.id;
      const isHovered = hoveredNode === node.id;
      const radius = isSelected ? node.radius + 8 : isHovered ? node.radius + 4 : node.radius;

      // Node shadow and glow
      ctx.shadowColor = node.color;
      ctx.shadowBlur = isSelected ? 20 : isHovered ? 15 : 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Node background
      ctx.beginPath();
      ctx.arc(node.position.x, node.position.y, radius, 0, 2 * Math.PI);
      
      const gradient = ctx.createRadialGradient(
        node.position.x, node.position.y, 0,
        node.position.x, node.position.y, radius
      );
      
      switch (node.status) {
        case 'completed':
          gradient.addColorStop(0, '#10B981');
          gradient.addColorStop(1, '#059669');
          break;
        case 'in-progress':
          gradient.addColorStop(0, '#F59E0B');
          gradient.addColorStop(1, '#D97706');
          break;
        case 'blocked':
          gradient.addColorStop(0, '#EF4444');
          gradient.addColorStop(1, '#DC2626');
          break;
        default:
          gradient.addColorStop(0, '#6B7280');
          gradient.addColorStop(1, '#4B5563');
      }
      
      ctx.fillStyle = gradient;
      ctx.fill();

      // Node border
      ctx.strokeStyle = isSelected ? '#FFFFFF' : '#E5E7EB';
      ctx.lineWidth = isSelected ? 4 : 2;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Progress ring
      if (projectData && node.status === 'in-progress') {
        const progressRadius = radius + 12;
        const progress = node.tasks.filter(t => t.completed).length / node.tasks.length;
        const progressAngle = progress * 2 * Math.PI - Math.PI / 2;
        
        ctx.beginPath();
        ctx.arc(node.position.x, node.position.y, progressRadius, -Math.PI / 2, progressAngle);
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 4;
        ctx.stroke();
      }

      // Node label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${isSelected ? '14px' : '12px'} Inter, system-ui`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const words = node.title.split(' ');
      if (words.length > 1) {
        ctx.fillText(words[0], node.position.x, node.position.y - 6);
        ctx.fillText(words.slice(1).join(' '), node.position.x, node.position.y + 8);
      } else {
        ctx.fillText(node.title, node.position.x, node.position.y);
      }

      // Status indicator
      const statusX = node.position.x + radius - 8;
      const statusY = node.position.y - radius + 8;
      ctx.beginPath();
      ctx.arc(statusX, statusY, 6, 0, 2 * Math.PI);
      
      switch (node.status) {
        case 'completed':
          ctx.fillStyle = '#10B981';
          break;
        case 'in-progress':
          ctx.fillStyle = '#F59E0B';
          break;
        case 'blocked':
          ctx.fillStyle = '#EF4444';
          break;
        default:
          ctx.fillStyle = '#6B7280';
      }
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }, [graphNodes, connections, selectedNode, hoveredNode, projectData]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      drawGraph();
      setAnimationFrame(prev => prev + 1);
      requestAnimationFrame(animate);
    };
    animate();
  }, [drawGraph]);

  // Mouse event handlers
  const getNodeAtPosition = useCallback((x: number, y: number): string | null => {
    for (const node of graphNodes) {
      const dx = x - node.position.x;
      const dy = y - node.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= node.radius) {
        return node.id;
      }
    }
    return null;
  }, [graphNodes]);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const nodeId = getNodeAtPosition(x, y);
    setSelectedNode(nodeId === selectedNode ? null : nodeId);
  }, [getNodeAtPosition, selectedNode]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const nodeId = getNodeAtPosition(x, y);
    setHoveredNode(nodeId);
    canvas.style.cursor = nodeId ? 'pointer' : 'default';
  }, [getNodeAtPosition]);

  const selectedNodeData = selectedNode ? graphNodes.find(n => n.id === selectedNode) : null;

  return (
    <div className={`relative w-full ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-900' : 'h-[600px] bg-slate-900 rounded-xl border border-slate-700'} overflow-hidden`}>
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border border-slate-600">
          <h3 className="text-white font-semibold flex items-center">
            <GitBranch className="w-5 h-5 text-emerald-400 mr-2" />
            {projectData ? `${projectData.name} Roadmap` : 'Project Roadmap'}
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="bg-slate-800/90 border border-slate-600 rounded-lg p-2 text-white hover:bg-slate-700"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          {isFullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="bg-slate-800/90 border border-slate-600 rounded-lg p-2 text-white hover:bg-slate-700"
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
        className="w-full h-full"
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
        onMouseLeave={() => setHoveredNode(null)}
      />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-4 border border-slate-600">
        <h4 className="text-white font-medium mb-3">Status</h4>
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

      {/* Node Details */}
      {selectedNodeData && (
        <div className="absolute top-20 right-4 w-80 bg-slate-800/95 backdrop-blur-sm rounded-lg border border-slate-600 p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-semibold">{selectedNodeData.title}</h4>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-gray-400 hover:text-white"
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

      {/* Stats */}
      <div className="absolute bottom-4 right-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-4 border border-slate-600">
        <h4 className="text-white font-medium mb-3">Graph Stats</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Nodes</span>
            <span className="text-white">{graphNodes.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Connections</span>
            <span className="text-white">{connections.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Completed</span>
            <span className="text-emerald-400">
              {graphNodes.filter(n => n.status === 'completed').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [animatedConnections, setAnimatedConnections] = useState<Set<string>>(new Set());
  const [projectGraph, setProjectGraph] = useState<Graph<string> | null>(null);
  const [graphStats, setGraphStats] = useState<any>(null);

  // Generate dynamic graph data based on project information
  const generateProjectRoadmap = (projectData?: ProjectData): GraphNode[] => {
    const baseNodes: GraphNode[] = [
      {
        id: "discovery",
        title: "Discovery & Planning",
        description: projectData ? `Requirements gathering for ${projectData.name}` : "Project requirements gathering and strategic planning",
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
        description: projectData ? `User experience design for ${projectData.name}` : "User experience design and visual identity creation",
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
      }
    ];

    // Add technology-specific nodes based on project technologies
    if (projectData?.technologies) {
      if (projectData.technologies.includes("MongoDB") || projectData.technologies.includes("Firebase")) {
        baseNodes.push({
          id: "database",
          title: "Database Architecture",
          description: `${projectData.technologies.find(t => t.includes("MongoDB") || t.includes("Firebase"))} schema design`,
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
            { id: "3", title: "Migration scripts", completed: projectData.status === "completed" },
            { id: "4", title: "Indexing strategy", completed: projectData.status === "completed" }
          ]
        });
      }

      // Frontend development node
      if (projectData.technologies.includes("React") || projectData.technologies.includes("Next.js") || projectData.technologies.includes("React Native")) {
        const frontendTech = projectData.technologies.find(t => t.includes("React") || t.includes("Next"));
        baseNodes.push({
          id: "frontend",
          title: `${frontendTech || "Frontend"} Development`,
          description: `Interactive user interface using ${frontendTech || "React"}`,
          status: projectData.status === "completed" ? "completed" : projectData.status === "in-progress" ? "in-progress" : "upcoming",
          icon: <Code className="w-6 h-6" />,
          dependencies: ["design"],
          duration: "5 weeks",
          priority: "high",
          category: "development",
          color: "from-emerald-500 to-teal-600",
          tasks: [
            { id: "1", title: "Component library", completed: true },
            { id: "2", title: "Page layouts", completed: true },
            { id: "3", title: "State management", completed: projectData.progress > 60 },
            { id: "4", title: "API integration", completed: projectData.progress > 80 },
            { id: "5", title: "Responsive design", completed: projectData.status === "completed" }
          ]
        });
      }

      // Backend development node
      if (projectData.technologies.includes("Node.js") || projectData.technologies.includes("Express")) {
        const backendTech = projectData.technologies.find(t => t.includes("Node") || t.includes("Express"));
        baseNodes.push({
          id: "backend",
          title: `${backendTech || "Backend"} Development`,
          description: `Server-side logic using ${backendTech || "Node.js"}`,
          status: projectData.progress > 40 ? (projectData.status === "completed" ? "completed" : "in-progress") : "upcoming",
          icon: <Server className="w-6 h-6" />,
          dependencies: baseNodes.find(n => n.id === "database") ? ["database"] : ["discovery"],
          duration: "4 weeks",
          priority: "high",
          category: "development",
          color: "from-orange-500 to-red-600",
          tasks: [
            { id: "1", title: "API endpoints", completed: projectData.progress > 50 },
            { id: "2", title: "Authentication", completed: projectData.progress > 60 },
            { id: "3", title: "Business logic", completed: projectData.progress > 70 },
            { id: "4", title: "Data validation", completed: projectData.status === "completed" }
          ]
        });
      }

      // Payment integration for e-commerce
      if (projectData.technologies.includes("Stripe") || projectData.name.toLowerCase().includes("e-commerce")) {
        baseNodes.push({
          id: "payment",
          title: "Payment Integration",
          description: "Secure payment processing with Stripe",
          status: projectData.progress > 60 ? (projectData.status === "completed" ? "completed" : "in-progress") : "upcoming",
          icon: <DollarSign className="w-6 h-6" />,
          dependencies: ["backend"],
          duration: "2 weeks",
          priority: "high",
          category: "development",
          color: "from-green-500 to-emerald-600",
          tasks: [
            { id: "1", title: "Stripe setup", completed: projectData.progress > 65 },
            { id: "2", title: "Payment forms", completed: projectData.progress > 75 },
            { id: "3", title: "Webhook handling", completed: projectData.progress > 85 },
            { id: "4", title: "Security testing", completed: projectData.status === "completed" }
          ]
        });
      }
    }

    // Add integration node
    const hasMultipleDevelopmentNodes = baseNodes.filter(n => n.category === "development").length > 1;
    if (hasMultipleDevelopmentNodes) {
      const developmentDeps = baseNodes.filter(n => n.category === "development" && n.id !== "integration").map(n => n.id);
      baseNodes.push({
        id: "integration",
        title: "System Integration",
        description: "Connecting all system components",
        status: projectData ? (projectData.progress > 80 ? (projectData.status === "completed" ? "completed" : "in-progress") : "upcoming") : "upcoming",
        icon: <Zap className="w-6 h-6" />,
        dependencies: developmentDeps,
        duration: "2 weeks",
        priority: "medium",
        category: "development",
        color: "from-yellow-500 to-amber-600",
        tasks: [
          { id: "1", title: "Component integration", completed: projectData ? projectData.progress > 85 : false },
          { id: "2", title: "Error handling", completed: projectData ? projectData.progress > 90 : false },
          { id: "3", title: "Performance optimization", completed: projectData ? projectData.status === "completed" : false }
        ]
      });
    }

    // Testing phase
    baseNodes.push({
      id: "testing",
      title: "Quality Assurance",
      description: "Comprehensive testing and bug fixes",
      status: projectData ? (projectData.progress > 90 ? (projectData.status === "completed" ? "completed" : "in-progress") : "upcoming") : "upcoming",
      icon: <Shield className="w-6 h-6" />,
      dependencies: hasMultipleDevelopmentNodes ? ["integration"] : ["frontend"],
      duration: "3 weeks",
      priority: "high",
      category: "testing",
      color: "from-violet-500 to-purple-600",
      tasks: [
        { id: "1", title: "Unit testing", completed: projectData ? projectData.progress > 92 : false },
        { id: "2", title: "Integration testing", completed: projectData ? projectData.progress > 95 : false },
        { id: "3", title: "User acceptance testing", completed: projectData ? projectData.progress > 98 : false },
        { id: "4", title: "Performance testing", completed: projectData ? projectData.status === "completed" : false }
      ]
    });

    // Deployment phase
    baseNodes.push({
      id: "deployment",
      title: "Production Deployment",
      description: "Launch and go-live operations",
      status: projectData ? (projectData.status === "completed" ? "completed" : "upcoming") : "upcoming",
      icon: <Rocket className="w-6 h-6" />,
      dependencies: ["testing"],
      duration: "1 week",
      priority: "high",
      category: "deployment",
      color: "from-indigo-500 to-blue-600",
      tasks: [
        { id: "1", title: "Environment setup", completed: projectData ? projectData.status === "completed" : false },
        { id: "2", title: "Deployment pipeline", completed: projectData ? projectData.status === "completed" : false },
        { id: "3", title: "Monitoring setup", completed: projectData ? projectData.status === "completed" : false },
        { id: "4", title: "Go-live checklist", completed: projectData ? projectData.status === "completed" : false }
      ]
    });

    return baseNodes;
  };

  // Graph data structure with proper dependencies
  const graphNodes: GraphNode[] = generateProjectRoadmap(projectData);

  // Initialize and manage the graph data structure
  useEffect(() => {
    const graph = new Graph<string>(true, true); // Directed and weighted graph
    
    // Add nodes to the graph with their data
    graphNodes.forEach(node => {
      graph.addNode(node.id, {
        title: node.title,
        description: node.description,
        status: node.status,
        icon: node.icon,
        duration: node.duration,
        priority: node.priority,
        category: node.category,
        color: node.color,
        tasks: node.tasks
      });
    });
    
    // Add edges (dependencies) to the graph with weights
    graphNodes.forEach(node => {
      node.dependencies.forEach(depId => {
        // Calculate weight based on task complexity and duration
        const weight = node.tasks.length * (node.priority === 'high' ? 3 : node.priority === 'medium' ? 2 : 1);
        graph.addEdge(depId, node.id, weight, 'dependency');
      });
    });
    
    setProjectGraph(graph);
    setGraphStats(graph.getStats());
  }, []);

  // Graph algorithms using the graph data structure
  const topologicalSort = useMemo(() => {
    if (!projectGraph) return [];
    
    const sorted = projectGraph.topologicalSort();
    return sorted || [];
  }, [projectGraph]);

  // Calculate node positions using graph algorithms
  const nodePositions = useMemo(() => {
    const positions: { [key: string]: { x: number; y: number } } = {};
    
    if (!projectGraph) return positions;
    
    // Use topological sort to determine optimal layout
    const sortedNodes = topologicalSort;
    const levels: { [key: string]: number } = {};
    
    // Calculate levels based on dependencies
    sortedNodes.forEach((nodeId, index) => {
      const node = projectGraph.getNode(nodeId);
      if (node) {
        // Find the maximum level of dependencies + 1
        const deps = graphNodes.find(n => n.id === nodeId)?.dependencies || [];
        const maxDepLevel = Math.max(-1, ...deps.map(depId => levels[depId] || 0));
        levels[nodeId] = maxDepLevel + 1;
      }
    });
    
    // Position nodes based on their levels and dependencies
    const levelWidth = 400;
    const levelHeight = 200;
    const nodesPerLevel: { [level: number]: string[] } = {};
    
    // Group nodes by level
    Object.entries(levels).forEach(([nodeId, level]) => {
      if (!nodesPerLevel[level]) nodesPerLevel[level] = [];
      nodesPerLevel[level].push(nodeId);
    });
    
    // Calculate positions
    Object.entries(nodesPerLevel).forEach(([level, nodeIds]) => {
      const levelNum = parseInt(level);
      const y = 100 + levelNum * levelHeight;
      
      nodeIds.forEach((nodeId, index) => {
        const totalNodes = nodeIds.length;
        const spacing = Math.min(300, 800 / (totalNodes + 1));
        const startX = 200 + (totalNodes > 1 ? 0 : 200);
        const x = startX + (index + 1) * spacing;
        
        positions[nodeId] = { x, y };
      });
    });
    
    return positions;
  }, [projectGraph, topologicalSort]);

  // Generate connections using graph data structure
  const connections: Connection[] = useMemo(() => {
    if (!projectGraph) return [];
    
    return projectGraph.getEdges().map(edge => ({
      from: edge.from,
      to: edge.to,
      type: edge.type as "dependency" | "parallel" | "conditional"
    }));
  }, [projectGraph]);

  // Enhanced status checking using graph algorithms
  const getNodeStatus = (node: GraphNode): GraphNode["status"] => {
    if (!projectGraph) return node.status;
    
    // Use graph traversal to check dependency status
    const dependencies = projectGraph.getNeighbors(node.id);
    const blockedByDeps = node.dependencies.some(depId => {
      const depNode = graphNodes.find(n => n.id === depId);
      return depNode && depNode.status !== "completed";
    });
    
    if (blockedByDeps && node.status === "upcoming") return "blocked";
    return node.status;
  };

  // Get critical path using graph algorithms
  const getCriticalPath = useMemo(() => {
    if (!projectGraph) return [];
    
    // Find the longest path (critical path) using DFS
    const findLongestPath = (startId: string): string[] => {
      const visited = new Set<string>();
      const path: string[] = [];
      const longestPath: string[] = [];
      
      const dfs = (nodeId: string, currentPath: string[]) => {
        visited.add(nodeId);
        currentPath.push(nodeId);
        
        const neighbors = projectGraph.getNeighbors(nodeId);
        if (neighbors.length === 0) {
          // Leaf node - check if this path is longer
          if (currentPath.length > longestPath.length) {
            longestPath.splice(0, longestPath.length, ...currentPath);
          }
        } else {
          neighbors.forEach(neighbor => {
            if (!visited.has(neighbor)) {
              dfs(neighbor, currentPath);
            }
          });
        }
        
        currentPath.pop();
        visited.delete(nodeId);
      };
      
      // Find root nodes (no incoming edges)
      const rootNodes = topologicalSort.filter(nodeId => 
        projectGraph.getInDegree(nodeId) === 0
      );
      
      rootNodes.forEach(rootId => {
        dfs(rootId, []);
      });
      
      return longestPath;
    };
    
    return findLongestPath('discovery');
  }, [projectGraph, topologicalSort]);

  // Calculate project completion percentage using graph analysis
  const getProjectProgress = useMemo(() => {
    if (!projectGraph) return 0;
    
    const allNodes = projectGraph.getNodes();
    let totalWeight = 0;
    let completedWeight = 0;
    
    allNodes.forEach(node => {
      const nodeData = graphNodes.find(n => n.id === node.id);
      if (nodeData) {
        const weight = nodeData.tasks.length * (nodeData.priority === 'high' ? 3 : nodeData.priority === 'medium' ? 2 : 1);
        totalWeight += weight;
        
        if (nodeData.status === 'completed') {
          completedWeight += weight;
        } else if (nodeData.status === 'in-progress') {
          const taskProgress = nodeData.tasks.filter(t => t.completed).length / nodeData.tasks.length;
          completedWeight += weight * taskProgress;
        }
      }
    });
    
    return totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
  }, [projectGraph, graphNodes]);

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

      {/* Modern glass header with graph stats */}
      <div className="relative z-10 text-center py-4 sm:py-8">
        <div className="inline-flex items-center justify-center mb-4 sm:mb-6 px-4 sm:px-6 py-2 sm:py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
          <GitBranch className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 mr-2 sm:mr-3" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            {projectData ? `${projectData.name} Roadmap` : "Development Roadmap"}
          </h1>
          <div className="ml-3 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
        </div>
        <p className="text-gray-400 mb-6">
          {projectData 
            ? `Interactive timeline for ${projectData.name} with ${projectData.technologies.join(", ")} technology stack`
            : "Interactive project timeline with advanced graph-based dependency tracking"
          }
        </p>
        
        {/* Graph Statistics */}
        {graphStats && (
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2">
              <div className="text-emerald-400 text-lg font-bold">{getProjectProgress}%</div>
              <div className="text-gray-400 text-xs">Overall Progress</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2">
              <div className="text-blue-400 text-lg font-bold">{graphStats.nodeCount}</div>
              <div className="text-gray-400 text-xs">Phases</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2">
              <div className="text-purple-400 text-lg font-bold">{graphStats.edgeCount}</div>
              <div className="text-gray-400 text-xs">Dependencies</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2">
              <div className="text-yellow-400 text-lg font-bold">{getCriticalPath.length}</div>
              <div className="text-gray-400 text-xs">Critical Path</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2">
              <div className={`text-lg font-bold ${graphStats.hasCycles ? 'text-red-400' : 'text-green-400'}`}>
                {graphStats.hasCycles ? 'HAS' : 'NO'}
              </div>
              <div className="text-gray-400 text-xs">Cycles</div>
            </div>
          </div>
        )}
      </div>

      {/* Modern timeline layout */}
      <div className="relative z-20 max-w-7xl lg:max-w-[90rem] mx-auto px-2 sm:px-4">
        {/* Enhanced central timeline spine with creative progress fill */}
        <div className="absolute left-1/2 top-0 bottom-0 transform -translate-x-1">
          {/* Background spine with subtle glow */}
          <div className="w-1 h-full bg-gray-700/40 rounded-full shadow-inner"></div>
          
          {/* Creative progress-filled spine with animations */}
          <div className="absolute top-0 left-0 w-1 rounded-full overflow-hidden shadow-lg"
               style={{ height: `${getProjectProgress}%` }}>
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
                 top: `${getProjectProgress}%`, 
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
                      
                      {/* Dependencies & Graph Info section */}
                      <div className="lg:col-span-1">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <GitBranch className="w-5 h-5 text-purple-400 mr-3" />
                          Graph Analysis
                        </h3>
                        <div className="p-6 bg-gray-800/30 rounded-2xl space-y-6">
                          {/* Graph Statistics for this node */}
                          {projectGraph && (
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="bg-gray-700/30 p-3 rounded-lg text-center">
                                <div className="text-blue-400 font-bold">{projectGraph.getInDegree(node.id)}</div>
                                <div className="text-gray-400 text-xs">Dependencies</div>
                              </div>
                              <div className="bg-gray-700/30 p-3 rounded-lg text-center">
                                <div className="text-green-400 font-bold">{projectGraph.getOutDegree(node.id)}</div>
                                <div className="text-gray-400 text-xs">Dependents</div>
                              </div>
                            </div>
                          )}
                          
                          {/* Critical Path Indicator */}
                          {getCriticalPath.includes(node.id) && (
                            <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg">
                              <div className="flex items-center space-x-2 mb-1">
                                <Target className="w-4 h-4 text-yellow-400" />
                                <span className="text-yellow-300 font-medium text-sm">Critical Path</span>
                              </div>
                              <div className="text-xs text-yellow-200">
                                This phase is on the critical path - delays will affect project completion
                              </div>
                            </div>
                          )}
                          
                          {/* Dependencies List */}
                          {node.dependencies.length > 0 ? (
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium text-gray-300">Direct Dependencies:</h4>
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
                            <div className="text-center py-4">
                              <div className="w-12 h-12 bg-gray-700/30 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Sparkles className="w-6 h-6 text-gray-500" />
                              </div>
                              <p className="text-gray-400 text-sm">No dependencies</p>
                              <p className="text-gray-500 text-xs">Can start independently</p>
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
