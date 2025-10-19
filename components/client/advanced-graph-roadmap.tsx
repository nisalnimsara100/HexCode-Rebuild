"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  Target,
  Palette,
  Database,
  Code,
  Server,
  Zap,
  Shield,
  Rocket,
  GitBranch,
  Play,
  Pause,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Users,
  DollarSign,
  Settings,
  Maximize2,
  Minimize2,
  RotateCcw,
  Search,
  Filter,
  X,
  Plus
} from "lucide-react";

// Graph Data Structure Implementation
class GraphNode {
  id: string;
  x: number;
  y: number;
  vx: number = 0;
  vy: number = 0;
  fx?: number;
  fy?: number;
  data: NodeData;

  constructor(id: string, x: number, y: number, data: NodeData) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.data = data;
  }
}

class GraphEdge {
  source: GraphNode;
  target: GraphNode;
  weight: number;
  type: EdgeType;

  constructor(source: GraphNode, target: GraphNode, weight: number = 1, type: EdgeType = 'dependency') {
    this.source = source;
    this.target = target;
    this.weight = weight;
    this.type = type;
  }
}

class ForceDirectedGraph {
  nodes: Map<string, GraphNode> = new Map();
  edges: GraphEdge[] = [];
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  addNode(id: string, data: NodeData, x?: number, y?: number): GraphNode {
    const node = new GraphNode(
      id,
      x ?? Math.random() * this.width,
      y ?? Math.random() * this.height,
      data
    );
    this.nodes.set(id, node);
    return node;
  }

  addEdge(sourceId: string, targetId: string, weight: number = 1, type: EdgeType = 'dependency'): GraphEdge | null {
    const source = this.nodes.get(sourceId);
    const target = this.nodes.get(targetId);
    
    if (!source || !target) return null;
    
    const edge = new GraphEdge(source, target, weight, type);
    this.edges.push(edge);
    return edge;
  }

  // Force-directed layout algorithm
  simulate(iterations: number = 100) {
    const alpha = 0.1;
    const alphaDecay = 1 - Math.pow(0.001, 1 / iterations);
    
    for (let i = 0; i < iterations; i++) {
      const currentAlpha = alpha * Math.pow(1 - alphaDecay, i);
      
      // Reset forces
      this.nodes.forEach(node => {
        node.vx = 0;
        node.vy = 0;
      });

      // Repulsion force (nodes push away from each other)
      this.nodes.forEach(nodeA => {
        this.nodes.forEach(nodeB => {
          if (nodeA === nodeB) return;
          
          const dx = nodeB.x - nodeA.x;
          const dy = nodeB.y - nodeA.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const repulsion = -100 / distance;
          
          nodeA.vx += (dx / distance) * repulsion * currentAlpha;
          nodeA.vy += (dy / distance) * repulsion * currentAlpha;
        });
      });

      // Attraction force (connected nodes pull towards each other)
      this.edges.forEach(edge => {
        const dx = edge.target.x - edge.source.x;
        const dy = edge.target.y - edge.source.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        const attraction = distance * 0.01 * edge.weight;
        
        edge.source.vx += (dx / distance) * attraction * currentAlpha;
        edge.source.vy += (dy / distance) * attraction * currentAlpha;
        edge.target.vx -= (dx / distance) * attraction * currentAlpha;
        edge.target.vy -= (dy / distance) * attraction * currentAlpha;
      });

      // Update positions
      this.nodes.forEach(node => {
        if (node.fx === undefined) node.x += node.vx;
        if (node.fy === undefined) node.y += node.vy;
        
        // Keep nodes within bounds
        node.x = Math.max(50, Math.min(this.width - 50, node.x));
        node.y = Math.max(50, Math.min(this.height - 50, node.y));
      });
    }
  }

  // Get shortest path between nodes
  getShortestPath(startId: string, endId: string): GraphNode[] {
    const distances = new Map<string, number>();
    const previous = new Map<string, string | null>();
    const unvisited = new Set<string>();

    // Initialize distances
    this.nodes.forEach((_, id) => {
      distances.set(id, id === startId ? 0 : Infinity);
      previous.set(id, null);
      unvisited.add(id);
    });

    while (unvisited.size > 0) {
      // Find unvisited node with smallest distance
      let current = '';
      let minDistance = Infinity;
      unvisited.forEach(nodeId => {
        const dist = distances.get(nodeId) || Infinity;
        if (dist < minDistance) {
          minDistance = dist;
          current = nodeId;
        }
      });

      if (current === '' || minDistance === Infinity) break;
      
      unvisited.delete(current);
      
      if (current === endId) break;

      // Update distances to neighbors
      this.edges.forEach(edge => {
        let neighbor = '';
        if (edge.source.id === current) neighbor = edge.target.id;
        if (edge.target.id === current) neighbor = edge.source.id;
        
        if (neighbor && unvisited.has(neighbor)) {
          const alt = (distances.get(current) || 0) + edge.weight;
          if (alt < (distances.get(neighbor) || Infinity)) {
            distances.set(neighbor, alt);
            previous.set(neighbor, current);
          }
        }
      });
    }

    // Reconstruct path
    const path: GraphNode[] = [];
    let current: string | null = endId;
    while (current !== null) {
      const node = this.nodes.get(current);
      if (node) path.unshift(node);
      current = previous.get(current) || null;
    }

    return path.length > 1 ? path : [];
  }
}

interface NodeData {
  title: string;
  description: string;
  status: "completed" | "in-progress" | "upcoming" | "blocked";
  icon: React.ReactNode;
  tasks: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
  duration: string;
  priority: "high" | "medium" | "low";
  category: "design" | "development" | "testing" | "deployment";
  color: string;
  technologies?: string[];
  progress?: number;
}

type EdgeType = 'dependency' | 'parallel' | 'conditional';

interface ProjectData {
  id: string;
  name: string;
  status: string;
  progress: number;
  startDate: string;
  estimatedCompletion: string;
  budget: number;
  spent: number;
  team: string[];
  description: string;
  technologies: string[];
  priority: string;
  lastUpdate: string;
}

interface AdvancedGraphRoadmapProps {
  projectData?: ProjectData;
}

export function AdvancedGraphRoadmap({ projectData }: AdvancedGraphRoadmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 800 });

  // Generate dynamic roadmap data based on project
  const generateRoadmapData = useCallback((projectData?: ProjectData): NodeData[] => {
    const baseNodes: NodeData[] = [
      {
        title: "Discovery",
        description: projectData ? `Requirements for ${projectData.name}` : "Project planning",
        status: "completed",
        icon: <Target className="w-6 h-6" />,
        duration: "2 weeks",
        priority: "high",
        category: "design",
        color: "#8B5CF6",
        technologies: ["Planning", "Analysis"],
        progress: 100,
        tasks: [
          { id: "1", title: "Requirements analysis", completed: true },
          { id: "2", title: "Stakeholder interviews", completed: true },
          { id: "3", title: "Technical feasibility", completed: true }
        ]
      },
      {
        title: "UI/UX Design",
        description: "User interface design",
        status: "completed",
        icon: <Palette className="w-6 h-6" />,
        duration: "3 weeks",
        priority: "high",
        category: "design",
        color: "#EC4899",
        technologies: ["Figma", "Adobe XD"],
        progress: 100,
        tasks: [
          { id: "1", title: "Wireframes", completed: true },
          { id: "2", title: "Design system", completed: true },
          { id: "3", title: "Prototypes", completed: true }
        ]
      }
    ];

    // Add technology-specific nodes based on project
    if (projectData?.technologies) {
      // Database node
      if (projectData.technologies.some(tech => ['MongoDB', 'PostgreSQL', 'Firebase'].includes(tech))) {
        const dbTech = projectData.technologies.find(tech => ['MongoDB', 'PostgreSQL', 'Firebase'].includes(tech));
        baseNodes.push({
          title: "Database",
          description: `${dbTech} architecture`,
          status: "completed",
          icon: <Database className="w-6 h-6" />,
          duration: "2 weeks",
          priority: "high",
          category: "development",
          color: "#3B82F6",
          technologies: [dbTech!],
          progress: 100,
          tasks: [
            { id: "1", title: "Schema design", completed: true },
            { id: "2", title: "Migration setup", completed: true }
          ]
        });
      }

      // Frontend node
      if (projectData.technologies.some(tech => ['React', 'Next.js', 'Vue', 'Angular'].includes(tech))) {
        const frontendTech = projectData.technologies.find(tech => ['React', 'Next.js', 'Vue', 'Angular'].includes(tech));
        baseNodes.push({
          title: frontendTech || "Frontend",
          description: `${frontendTech} development`,
          status: projectData.status === "completed" ? "completed" : projectData.status === "in-progress" ? "in-progress" : "upcoming",
          icon: <Code className="w-6 h-6" />,
          duration: "5 weeks",
          priority: "high",
          category: "development",
          color: "#10B981",
          technologies: [frontendTech!],
          progress: projectData.progress,
          tasks: [
            { id: "1", title: "Component library", completed: projectData.progress > 20 },
            { id: "2", title: "Page layouts", completed: projectData.progress > 40 },
            { id: "3", title: "State management", completed: projectData.progress > 60 },
            { id: "4", title: "API integration", completed: projectData.progress > 80 }
          ]
        });
      }

      // Backend node
      if (projectData.technologies.some(tech => ['Node.js', 'Express', 'NestJS', 'Django'].includes(tech))) {
        const backendTech = projectData.technologies.find(tech => ['Node.js', 'Express', 'NestJS', 'Django'].includes(tech));
        baseNodes.push({
          title: backendTech || "Backend",
          description: `${backendTech} API development`,
          status: projectData.progress > 40 ? (projectData.status === "completed" ? "completed" : "in-progress") : "upcoming",
          icon: <Server className="w-6 h-6" />,
          duration: "4 weeks",
          priority: "high",
          category: "development",
          color: "#F59E0B",
          technologies: [backendTech!],
          progress: Math.max(0, projectData.progress - 20),
          tasks: [
            { id: "1", title: "API endpoints", completed: projectData.progress > 50 },
            { id: "2", title: "Authentication", completed: projectData.progress > 70 },
            { id: "3", title: "Business logic", completed: projectData.progress > 90 }
          ]
        });
      }

      // Payment integration for e-commerce
      if (projectData.technologies.includes("Stripe") || projectData.name.toLowerCase().includes("e-commerce")) {
        baseNodes.push({
          title: "Payment",
          description: "Stripe integration",
          status: projectData.progress > 60 ? (projectData.status === "completed" ? "completed" : "in-progress") : "upcoming",
          icon: <DollarSign className="w-6 h-6" />,
          duration: "2 weeks",
          priority: "high",
          category: "development",
          color: "#8B5CF6",
          technologies: ["Stripe"],
          progress: Math.max(0, projectData.progress - 40),
          tasks: [
            { id: "1", title: "Payment forms", completed: projectData.progress > 70 },
            { id: "2", title: "Webhook handling", completed: projectData.progress > 85 }
          ]
        });
      }
    }

    // Testing node
    baseNodes.push({
      title: "Testing",
      description: "Quality assurance",
      status: projectData ? (projectData.progress > 85 ? "in-progress" : "upcoming") : "upcoming",
      icon: <Shield className="w-6 h-6" />,
      duration: "3 weeks",
      priority: "high",
      category: "testing",
      color: "#8B5CF6",
      technologies: ["Jest", "Cypress"],
      progress: projectData ? Math.max(0, projectData.progress - 70) : 0,
      tasks: [
        { id: "1", title: "Unit tests", completed: projectData ? projectData.progress > 90 : false },
        { id: "2", title: "Integration tests", completed: projectData ? projectData.progress > 95 : false }
      ]
    });

    // Deployment node
    baseNodes.push({
      title: "Deployment",
      description: "Production launch",
      status: projectData ? (projectData.status === "completed" ? "completed" : "upcoming") : "upcoming",
      icon: <Rocket className="w-6 h-6" />,
      duration: "1 week",
      priority: "high",
      category: "deployment",
      color: "#6366F1",
      technologies: ["AWS", "Vercel"],
      progress: projectData ? (projectData.status === "completed" ? 100 : 0) : 0,
      tasks: [
        { id: "1", title: "Environment setup", completed: projectData?.status === "completed" },
        { id: "2", title: "Go-live", completed: projectData?.status === "completed" }
      ]
    });

    return baseNodes;
  }, []);

  // Initialize graph
  const graph = useMemo(() => {
    const g = new ForceDirectedGraph(canvasSize.width, canvasSize.height);
    const nodeData = generateRoadmapData(projectData);
    
    // Add nodes with strategic positioning
    nodeData.forEach((data, index) => {
      const angle = (index / nodeData.length) * 2 * Math.PI;
      const radius = Math.min(canvasSize.width, canvasSize.height) * 0.3;
      const x = canvasSize.width / 2 + Math.cos(angle) * radius;
      const y = canvasSize.height / 2 + Math.sin(angle) * radius;
      
      g.addNode(data.title.toLowerCase().replace(/\s+/g, '-'), data, x, y);
    });

    // Add dependency edges
    const nodeIds = Array.from(g.nodes.keys());
    const dependencies = [
      ['discovery', 'ui-ux-design'],
      ['discovery', 'database'],
      ['ui-ux-design', 'react'],
      ['ui-ux-design', 'frontend'],
      ['database', 'backend'],
      ['database', 'node.js'],
      ['react', 'testing'],
      ['frontend', 'testing'],
      ['backend', 'payment'],
      ['node.js', 'payment'],
      ['payment', 'testing'],
      ['testing', 'deployment']
    ];

    dependencies.forEach(([source, target]) => {
      if (g.nodes.has(source) && g.nodes.has(target)) {
        g.addEdge(source, target, 1, 'dependency');
      }
    });

    // Run force simulation
    g.simulate(150);
    
    return g;
  }, [canvasSize, generateRoadmapData, projectData]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      draw();
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [graph, selectedNode, hoveredNode]);

  // Drawing function
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with dark background
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid pattern
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

    // Draw edges
    graph.edges.forEach(edge => {
      const sourceNode = edge.source;
      const targetNode = edge.target;
      
      // Skip filtered nodes
      if (filterCategory !== "all") {
        if (sourceNode.data.category !== filterCategory && targetNode.data.category !== filterCategory) {
          return;
        }
      }

      ctx.beginPath();
      ctx.moveTo(sourceNode.x, sourceNode.y);
      ctx.lineTo(targetNode.x, targetNode.y);
      
      // Style based on edge type and status
      const isActive = sourceNode.data.status === 'completed' && targetNode.data.status !== 'blocked';
      ctx.strokeStyle = isActive ? '#10B981' : '#374151';
      ctx.lineWidth = isActive ? 3 : 2;
      ctx.globalAlpha = 0.6;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Draw arrow
      const angle = Math.atan2(targetNode.y - sourceNode.y, targetNode.x - sourceNode.x);
      const arrowLength = 15;
      const arrowWidth = 8;
      
      // Position arrow near target node
      const arrowX = targetNode.x - Math.cos(angle) * 40;
      const arrowY = targetNode.y - Math.sin(angle) * 40;
      
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(
        arrowX - arrowLength * Math.cos(angle - arrowWidth),
        arrowY - arrowLength * Math.sin(angle - arrowWidth)
      );
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(
        arrowX - arrowLength * Math.cos(angle + arrowWidth),
        arrowY - arrowLength * Math.sin(angle + arrowWidth)
      );
      ctx.strokeStyle = isActive ? '#10B981' : '#374151';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw nodes
    graph.nodes.forEach((node, nodeId) => {
      // Skip filtered nodes
      if (filterCategory !== "all" && node.data.category !== filterCategory) {
        return;
      }

      // Skip search filtered nodes
      if (searchTerm && !node.data.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return;
      }

      const isSelected = selectedNode === nodeId;
      const isHovered = hoveredNode === nodeId;
      const radius = isSelected ? 45 : isHovered ? 40 : 35;

      // Node shadow
      ctx.shadowColor = node.data.color;
      ctx.shadowBlur = isSelected ? 20 : isHovered ? 15 : 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Node background
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      
      // Gradient based on status
      const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius);
      switch (node.data.status) {
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
      
      // Reset shadow
      ctx.shadowBlur = 0;

      // Progress ring
      if (node.data.progress !== undefined && node.data.progress > 0) {
        const progressRadius = radius + 8;
        const progressAngle = (node.data.progress / 100) * 2 * Math.PI - Math.PI / 2;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, progressRadius, -Math.PI / 2, progressAngle);
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 4;
        ctx.stroke();
      }

      // Node label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${isSelected ? '14px' : '12px'} Inter, system-ui`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Split long titles
      const words = node.data.title.split(' ');
      if (words.length > 1) {
        ctx.fillText(words[0], node.x, node.y - 6);
        ctx.fillText(words.slice(1).join(' '), node.x, node.y + 8);
      } else {
        ctx.fillText(node.data.title, node.x, node.y);
      }

      // Status indicator
      const statusX = node.x + radius - 8;
      const statusY = node.y - radius + 8;
      ctx.beginPath();
      ctx.arc(statusX, statusY, 6, 0, 2 * Math.PI);
      
      switch (node.data.status) {
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
  }, [graph, selectedNode, hoveredNode, filterCategory, searchTerm]);

  // Mouse event handlers
  const getNodeAtPosition = useCallback((x: number, y: number): string | null => {
    for (const [nodeId, node] of graph.nodes) {
      const dx = x - node.x;
      const dy = y - node.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= 35) {
        return nodeId;
      }
    }
    return null;
  }, [graph]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePos({ x, y });

    if (isDragging && draggedNode) {
      const node = graph.nodes.get(draggedNode);
      if (node) {
        node.x = x;
        node.y = y;
        node.fx = x;
        node.fy = y;
      }
    } else {
      const nodeId = getNodeAtPosition(x, y);
      setHoveredNode(nodeId);
      canvas.style.cursor = nodeId ? 'pointer' : 'default';
    }
  }, [isDragging, draggedNode, graph, getNodeAtPosition]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const nodeId = getNodeAtPosition(x, y);
    
    if (nodeId) {
      setDraggedNode(nodeId);
      setIsDragging(true);
      setSelectedNode(nodeId);
      
      const node = graph.nodes.get(nodeId);
      if (node) {
        node.fx = node.x;
        node.fy = node.y;
      }
    } else {
      setSelectedNode(null);
    }
  }, [graph, getNodeAtPosition]);

  const handleMouseUp = useCallback(() => {
    if (draggedNode) {
      const node = graph.nodes.get(draggedNode);
      if (node) {
        node.fx = undefined;
        node.fy = undefined;
      }
    }
    
    setIsDragging(false);
    setDraggedNode(null);
  }, [draggedNode, graph]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setCanvasSize({ 
          width: isFullscreen ? window.innerWidth : Math.max(clientWidth, 1200), 
          height: isFullscreen ? window.innerHeight : Math.max(clientHeight, 800) 
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isFullscreen]);

  // Get selected node data
  const selectedNodeData = selectedNode ? graph.nodes.get(selectedNode)?.data : null;

  return (
    <div 
      ref={containerRef}
      className={`relative w-full ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-900' : 'h-[800px] bg-slate-900 rounded-xl border border-slate-700'} overflow-hidden`}
    >
      {/* Header Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border border-slate-600">
            <h3 className="text-white font-semibold flex items-center">
              <GitBranch className="w-5 h-5 text-emerald-400 mr-2" />
              {projectData ? `${projectData.name} Roadmap` : 'Project Roadmap'}
            </h3>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-800/90 border border-slate-600 rounded-lg text-white text-sm w-48 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-800/90 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Categories</option>
            <option value="design">Design</option>
            <option value="development">Development</option>
            <option value="testing">Testing</option>
            <option value="deployment">Deployment</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="bg-slate-800/90 border border-slate-600 text-white hover:bg-slate-700"
          >
            {showDetails ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              graph.simulate(100);
            }}
            className="bg-slate-800/90 border border-slate-600 text-white hover:bg-slate-700"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="bg-slate-800/90 border border-slate-600 text-white hover:bg-slate-700"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          
          {isFullscreen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(false)}
              className="bg-slate-800/90 border border-slate-600 text-white hover:bg-slate-700"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Main Canvas */}
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="w-full h-full"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-4 border border-slate-600">
        <h4 className="text-white font-medium mb-3">Status Legend</h4>
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
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-gray-300 text-sm">Blocked</span>
          </div>
        </div>
      </div>

      {/* Node Details Panel */}
      {selectedNodeData && showDetails && (
        <div className="absolute top-20 right-4 w-80 bg-slate-800/95 backdrop-blur-sm rounded-lg border border-slate-600 p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-semibold">{selectedNodeData.title}</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedNode(null)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-gray-300 text-sm mb-4">{selectedNodeData.description}</p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Status</span>
              <Badge className={`${
                selectedNodeData.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                selectedNodeData.status === 'in-progress' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                selectedNodeData.status === 'blocked' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                'bg-gray-500/20 text-gray-400 border-gray-500/30'
              }`}>
                {selectedNodeData.status.replace('-', ' ')}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Duration</span>
              <span className="text-gray-300 text-sm">{selectedNodeData.duration}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Priority</span>
              <Badge className={`${
                selectedNodeData.priority === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                selectedNodeData.priority === 'medium' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                'bg-green-500/20 text-green-400 border-green-500/30'
              }`}>
                {selectedNodeData.priority}
              </Badge>
            </div>

            {selectedNodeData.progress !== undefined && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Progress</span>
                  <span className="text-white text-sm font-medium">{selectedNodeData.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${selectedNodeData.progress}%` }}
                  />
                </div>
              </div>
            )}

            <div>
              <span className="text-gray-400 text-sm block mb-2">Technologies</span>
              <div className="flex flex-wrap gap-1">
                {selectedNodeData.technologies?.map((tech, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-slate-500 text-slate-300">
                    {tech}
                  </Badge>
                ))}
              </div>
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
        <h4 className="text-white font-medium mb-3">Graph Stats</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Nodes</span>
            <span className="text-white">{graph.nodes.size}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Connections</span>
            <span className="text-white">{graph.edges.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Completed</span>
            <span className="text-emerald-400">
              {Array.from(graph.nodes.values()).filter(n => n.data.status === 'completed').length}
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