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
  const animationRef = useRef<number>();
  
  // State management
  const [graph, setGraph] = useState<ProjectGraph>(new ProjectGraph());
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [showFuturePlanning, setShowFuturePlanning] = useState(false);
  const [viewMode, setViewMode] = useState<'standard' | 'timeline' | 'completion'>('standard');
  const [particleSystem, setParticleSystem] = useState<Particle[]>([]);
  
  // Animation and interaction state
  const [time, setTime] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // Particle system for visual effects
  interface Particle {
    id: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    color: string;
    size: number;
  }

  // Initialize graph data
  useEffect(() => {
    const newGraph = createProjectGraph(projectData);
    setGraph(newGraph);
  }, [projectData]);

  // Particle system for completed tasks
  const createCompletionParticles = useCallback((x: number, y: number) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        id: `particle-${Date.now()}-${i}`,
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 60,
        maxLife: 60,
        color: '#10B981',
        size: Math.random() * 3 + 1
      });
    }
    setParticleSystem(prev => [...prev, ...newParticles]);
  }, []);

  // Advanced canvas rendering with multiple visual modes
  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with animated background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0F172A');
    gradient.addColorStop(0.5, '#1E293B');
    gradient.addColorStop(1, '#0F172A');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw animated grid
    ctx.strokeStyle = `rgba(30, 41, 59, ${0.3 + Math.sin(time * 0.01) * 0.1})`;
    ctx.lineWidth = 1;
    const gridSize = 50;
    const offsetX = (time * 0.5) % gridSize;
    const offsetY = (time * 0.3) % gridSize;
    
    for (let x = -offsetX; x <= canvas.width + gridSize; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = -offsetY; y <= canvas.height + gridSize; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw nodes and edges
    const nodes = graph.getNodes();
    const edges = graph.getEdges();

    // Draw connections with flow animation
    edges.forEach(edge => {
      const fromNode = graph.getNode(edge.fromNodeId);
      const toNode = graph.getNode(edge.toNodeId);
      
      if (!fromNode || !toNode) return;

      const isActive = fromNode.status === 'completed';
      const isSelected = selectedNode === fromNode.id || selectedNode === toNode.id;
      
      // Animated connection line
      ctx.beginPath();
      ctx.moveTo(fromNode.position.x, fromNode.position.y);
      ctx.lineTo(toNode.position.x, toNode.position.y);
      
      if (edge.animated && isActive) {
        const flowOffset = (time * 2) % 40;
        ctx.setLineDash([20, 20]);
        ctx.lineDashOffset = flowOffset;
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 3;
      } else {
        ctx.setLineDash([]);
        ctx.strokeStyle = isSelected ? '#8B5CF6' : '#374151';
        ctx.lineWidth = isSelected ? 3 : 2;
      }
      
      ctx.globalAlpha = 0.8;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.setLineDash([]);

      // Animated arrow with glow
      const angle = Math.atan2(toNode.position.y - fromNode.position.y, toNode.position.x - fromNode.position.x);
      const arrowX = toNode.position.x - Math.cos(angle) * (toNode.radius + 15);
      const arrowY = toNode.position.y - Math.sin(angle) * (toNode.radius + 15);
      
      ctx.save();
      ctx.translate(arrowX, arrowY);
      ctx.rotate(angle);
      
      // Arrow glow
      if (isActive) {
        ctx.shadowColor = '#10B981';
        ctx.shadowBlur = 10;
      }
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-20, -8);
      ctx.lineTo(-20, 8);
      ctx.closePath();
      ctx.fillStyle = isActive ? '#10B981' : '#374151';
      ctx.fill();
      
      ctx.shadowBlur = 0;
      ctx.restore();
    });

    // Draw nodes with advanced visual effects
    nodes.forEach(node => {
      const isSelected = selectedNode === node.id;
      const isHovered = hoveredNode === node.id;
      const baseRadius = node.radius;
      const pulseRadius = baseRadius + Math.sin(time * 0.05 + node.position.x * 0.01) * 3;
      const radius = isSelected ? pulseRadius + 12 : isHovered ? pulseRadius + 6 : pulseRadius;

      // Node shadow and glow based on status
      ctx.shadowColor = node.color;
      ctx.shadowBlur = isSelected ? 25 : isHovered ? 20 : 15;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Completion ring animation
      if (node.completion > 0 && node.completion < 100) {
        const progressRadius = radius + 20;
        const progressAngle = (node.completion / 100) * 2 * Math.PI - Math.PI / 2;
        
        // Background ring
        ctx.beginPath();
        ctx.arc(node.position.x, node.position.y, progressRadius, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(107, 114, 128, 0.3)';
        ctx.lineWidth = 6;
        ctx.stroke();
        
        // Progress ring with animation
        ctx.beginPath();
        ctx.arc(node.position.x, node.position.y, progressRadius, -Math.PI / 2, progressAngle);
        const progressGradient = ctx.createLinearGradient(
          node.position.x - progressRadius, node.position.y,
          node.position.x + progressRadius, node.position.y
        );
        progressGradient.addColorStop(0, '#10B981');
        progressGradient.addColorStop(1, '#059669');
        ctx.strokeStyle = progressGradient;
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        // Completion percentage text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${Math.round(node.completion)}%`, node.position.x, node.position.y + radius + 35);
      }

      // Main node circle with gradient
      ctx.beginPath();
      ctx.arc(node.position.x, node.position.y, radius, 0, 2 * Math.PI);
      
      const gradient = ctx.createRadialGradient(
        node.position.x - radius * 0.3, node.position.y - radius * 0.3, 0,
        node.position.x, node.position.y, radius
      );
      
      switch (node.status) {
        case 'completed':
          gradient.addColorStop(0, '#34D399');
          gradient.addColorStop(1, '#059669');
          break;
        case 'in-progress':
          gradient.addColorStop(0, '#FBBF24');
          gradient.addColorStop(1, '#D97706');
          break;
        case 'blocked':
          gradient.addColorStop(0, '#F87171');
          gradient.addColorStop(1, '#DC2626');
          break;
        case 'delayed':
          gradient.addColorStop(0, '#FB923C');
          gradient.addColorStop(1, '#EA580C');
          break;
        default:
          gradient.addColorStop(0, '#9CA3AF');
          gradient.addColorStop(1, '#4B5563');
      }
      
      ctx.fillStyle = gradient;
      ctx.fill();

      // Node border with pulse effect
      const borderWidth = isSelected ? 5 : isHovered ? 4 : 3;
      ctx.strokeStyle = isSelected ? '#FFFFFF' : isHovered ? '#E5E7EB' : 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = borderWidth;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Priority indicator
      if (node.priority === 'critical') {
        const indicatorX = node.position.x + radius - 12;
        const indicatorY = node.position.y - radius + 12;
        
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(indicatorX, indicatorY, 8, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('!', indicatorX, indicatorY);
      }

      // Task count indicator
      const taskCount = node.tasks.length;
      const completedTasks = node.tasks.filter(t => t.completed).length;
      
      if (taskCount > 0) {
        const taskIndicatorX = node.position.x - radius + 12;
        const taskIndicatorY = node.position.y - radius + 12;
        
        ctx.fillStyle = completedTasks === taskCount ? '#10B981' : '#F59E0B';
        ctx.beginPath();
        ctx.arc(taskIndicatorX, taskIndicatorY, 10, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${completedTasks}/${taskCount}`, taskIndicatorX, taskIndicatorY);
      }

      // Node title
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${isSelected ? '16px' : '14px'} Inter`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const words = node.title.split(' ');
      if (words.length > 1) {
        ctx.fillText(words[0], node.position.x, node.position.y - 8);
        ctx.fillText(words.slice(1).join(' '), node.position.x, node.position.y + 8);
      } else {
        ctx.fillText(node.title, node.position.x, node.position.y);
      }

      // Future phases indicator
      if (node.futurePhases && node.futurePhases.length > 0) {
        const futureX = node.position.x + radius + 30;
        const futureY = node.position.y;
        
        // Dashed line to future phases
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(node.position.x + radius, node.position.y);
        ctx.lineTo(futureX - 15, futureY);
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Future phase ghost node
        ctx.beginPath();
        ctx.arc(futureX, futureY, 25, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(139, 92, 246, 0.2)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(139, 92, 246, 0.8)';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Future', futureX, futureY);
      }
    });

    // Draw particles for completion effects
    particleSystem.forEach(particle => {
      ctx.globalAlpha = particle.life / particle.maxLife;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Update particles
    setParticleSystem(prev => 
      prev.map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        life: p.life - 1
      })).filter(p => p.life > 0)
    );

  }, [graph, selectedNode, hoveredNode, time, particleSystem]);

  // Animation loop
  useEffect(() => {
    if (!isAnimating) return;
    
    const animate = () => {
      setTime(prev => prev + 1);
      drawGraph();
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [drawGraph, isAnimating]);

  // Mouse interaction handlers
  const getNodeAtPosition = useCallback((x: number, y: number): string | null => {
    const nodes = graph.getNodes();
    for (const node of nodes) {
      const dx = x - node.position.x;
      const dy = y - node.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= node.radius + 10) {
        return node.id;
      }
    }
    return null;
  }, [graph]);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const nodeId = getNodeAtPosition(x, y);
    
    if (nodeId) {
      setSelectedNode(nodeId === selectedNode ? null : nodeId);
      
      // Create completion particles if clicking on completed node
      const node = graph.getNode(nodeId);
      if (node && node.status === 'completed') {
        createCompletionParticles(node.position.x, node.position.y);
      }
    } else {
      setSelectedNode(null);
    }
  }, [getNodeAtPosition, selectedNode, graph, createCompletionParticles]);

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

  // Get selected node data and stats
  const selectedNodeData = selectedNode ? graph.getNode(selectedNode) : null;
  const stats = graph.getCompletionStats();
  const criticalPath = graph.getCriticalPath();

  return (
    <div className={`relative w-full ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-900' : 'h-[700px] bg-slate-900 rounded-xl border border-slate-700'} overflow-hidden`}>
      {/* Enhanced Header with Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border border-slate-600">
          <h3 className="text-white font-semibold flex items-center">
            <GitBranch className="w-5 h-5 text-emerald-400 mr-2" />
            Advanced Project Graph
          </h3>
          <p className="text-gray-400 text-xs mt-1">
            Real-time task tracking with future planning
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* View Mode Selector */}
          <div className="bg-slate-800/90 border border-slate-600 rounded-lg p-1 flex">
            {(['standard', 'timeline', 'completion'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  viewMode === mode 
                    ? 'bg-emerald-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Control Buttons */}
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className="bg-slate-800/90 border border-slate-600 rounded-lg p-2 text-white hover:bg-slate-700"
          >
            {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => setShowFuturePlanning(!showFuturePlanning)}
            className={`bg-slate-800/90 border border-slate-600 rounded-lg p-2 text-white hover:bg-slate-700 ${
              showFuturePlanning ? 'bg-purple-600/50' : ''
            }`}
          >
            <Calendar className="w-4 h-4" />
          </button>
          
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
        width={isFullscreen ? window.innerWidth : 1400}
        height={isFullscreen ? window.innerHeight : 700}
        className="w-full h-full cursor-default"
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
        onMouseLeave={() => setHoveredNode(null)}
      />

      {/* Enhanced Statistics Panel */}
      <div className="absolute bottom-4 left-4 bg-slate-800/95 backdrop-blur-sm rounded-lg border border-slate-600 p-4 min-w-[280px]">
        <h4 className="text-white font-semibold mb-3 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2 text-emerald-400" />
          Project Analytics
        </h4>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Progress</span>
              <span className="text-emerald-400 font-semibold">
                {Math.round(stats.completionPercentage)}%
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Tasks</span>
              <span className="text-white">
                {stats.completedTasks}/{stats.totalTasks}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">On Track</span>
              <span className="text-blue-400 font-semibold">
                {Math.round(stats.onTrackPercentage)}%
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Est. Hours</span>
              <span className="text-white">{stats.estimatedHours}h</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Actual Hours</span>
              <span className="text-white">{stats.actualHours}h</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Efficiency</span>
              <span className={`font-semibold ${
                stats.actualHours <= stats.estimatedHours ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {stats.estimatedHours > 0 ? Math.round((stats.estimatedHours / stats.actualHours) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
        
        {/* Critical Path Indicator */}
        {criticalPath.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-600">
            <div className="flex items-center mb-2">
              <Zap className="w-4 h-4 mr-2 text-yellow-400" />
              <span className="text-white text-sm font-medium">Critical Path</span>
            </div>
            <div className="text-xs text-gray-400">
              {criticalPath.length} phases • Path optimization active
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Node Details Panel */}
      {selectedNodeData && (
        <div className="absolute top-20 right-4 w-96 bg-slate-800/95 backdrop-blur-sm rounded-lg border border-slate-600 shadow-2xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-3`} style={{ backgroundColor: selectedNodeData.color }}></div>
                <h4 className="text-white font-semibold">{selectedNodeData.title}</h4>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-gray-300 text-sm mb-4">{selectedNodeData.description}</p>
            
            {/* Progress Visualization */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Completion</span>
                <span>{Math.round(selectedNodeData.completion)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full transition-all duration-500 relative overflow-hidden"
                  style={{ width: `${selectedNodeData.completion}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>
            
            {/* Task Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Status</span>
                <Badge className={`${
                  selectedNodeData.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                  selectedNodeData.status === 'in-progress' ? 'bg-amber-500/20 text-amber-400' :
                  selectedNodeData.status === 'blocked' ? 'bg-red-500/20 text-red-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {selectedNodeData.status.replace('-', ' ').toUpperCase()}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Priority</span>
                <Badge className={`${
                  selectedNodeData.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                  selectedNodeData.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                  selectedNodeData.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {selectedNodeData.priority.toUpperCase()}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Duration</span>
                <span className="text-gray-300 text-sm">
                  {selectedNodeData.estimatedHours}h est.
                  {selectedNodeData.actualHours && ` / ${selectedNodeData.actualHours}h actual`}
                </span>
              </div>
            </div>

            {/* Task List */}
            <div className="mt-4">
              <span className="text-gray-400 text-sm block mb-3">Tasks ({selectedNodeData.tasks.filter(t => t.completed).length}/{selectedNodeData.tasks.length})</span>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {selectedNodeData.tasks.map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                    <div className="flex items-center space-x-2">
                      {task.completed ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-500" />
                      )}
                      <span className={`text-sm ${task.completed ? 'text-gray-300 line-through' : 'text-gray-300'}`}>
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${
                        task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                        task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {task.priority}
                      </Badge>
                      <span className="text-xs text-gray-400">{task.estimatedHours}h</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Future Planning */}
            {selectedNodeData.futurePhases && selectedNodeData.futurePhases.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-600">
                <div className="flex items-center mb-3">
                  <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                  <span className="text-white text-sm font-medium">Future Phases</span>
                </div>
                <div className="space-y-2">
                  {selectedNodeData.futurePhases.map((phase, index) => (
                    <div key={index} className="p-3 bg-purple-500/10 border border-purple-500/20 rounded">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-purple-300 font-medium text-sm">{phase.title}</span>
                        <span className="text-purple-400 text-xs">{phase.estimatedDuration} days</span>
                      </div>
                      <p className="text-gray-400 text-xs">{phase.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-4 border border-slate-600">
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
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-gray-300 text-sm">Blocked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
            <span className="text-gray-300 text-sm">Upcoming</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-500 rounded-full opacity-50"></div>
            <span className="text-gray-300 text-sm">Future Phase</span>
          </div>
        </div>
      </div>
    </div>
  );
}