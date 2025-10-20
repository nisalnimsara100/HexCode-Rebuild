'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ProjectGraph, GraphNode, createProjectGraph } from '@/lib/advanced-graph';
import { fetchClientProjectsByEmail, fetchProjectNodes } from '../../lib/firebase';
import { getAuth } from "firebase/auth";

// Define types for nodes and projects
interface Node {
  id: string;
  title: string;
  description: string;
  type: "phase";
  status: string;
  completion: number;
  estimatedHours: number;
  actualHours: number;
  startDate: Date;
  endDate: Date;
  tasks: any[];
  dependencies: any[];
  priority: string;
  position: { x: number; y: number };
  radius?: number;
  color?: string;
}

interface Project {
  id: string;
  name: string;
}

interface RoadmapPhase {
  id: string;
  title: string;
  description: string;
  status: string;
  tasks: any[];
  dependencies: string[];
  duration: string;
  priority: string;
  category: string;
  position: { x: number; y: number };
  color: string;
  radius: number;
}

interface CleanGraphRoadmapProps {
  className?: string;
  roadmapData?: RoadmapPhase[];
}

export default function CleanGraphRoadmap({ className = '', roadmapData }: CleanGraphRoadmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [firebaseNodes, setFirebaseNodes] = useState<Node[]>([]);
  const [hoveredNodeIndex, setHoveredNodeIndex] = useState<number | null>(null);
  const [clickedNodeIndex, setClickedNodeIndex] = useState<number | null>(null);
  

  
  // Remove swipe functionality - not needed for graph structure

  // Fetch Firebase data for the logged-in user
  useEffect(() => {
    async function loadFirebaseData() {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user && user.email) {
          const projects: Project[] = await fetchClientProjectsByEmail(user.email);
          if (projects && projects.length > 0) {
            const firstProject = projects[0];
            const projectNodes = await fetchProjectNodes(firstProject.id);
            const formattedNodes: Node[] = projectNodes.map((node: any) => ({
              id: node.id,
              title: node.title,
              description: node.description,
              type: "phase",
              status: node.status,
              completion: node.progress || 0,
              estimatedHours: node.estimatedHours || 0,
              actualHours: node.actualHours || 0,
              startDate: new Date(node.startDate),
              endDate: new Date(node.endDate),
              tasks: node.tasks || [],
              dependencies: node.dependencies || [],
              priority: node.priority || "low",
              position: node.position || { x: 0, y: 0 },
              radius: node.radius || 50,
              color: node.color || "#6b7280",
            }));
            setFirebaseNodes(formattedNodes);
          } else {
            console.warn('No projects found for the logged-in user. Using fallback data.');
            setFirebaseNodes([]);
          }
        } else {
          console.warn('No logged-in user found. Using fallback data.');
          setFirebaseNodes([]);
        }
      } catch (error) {
        console.error('Error fetching Firebase data:', error);
        setFirebaseNodes([]);
      }
    }
    loadFirebaseData();
  }, []);

  // Initialize project data with roadmap data, Firebase data, or fallback
  useEffect(() => {
    const graph = createProjectGraph({});
    
    if (roadmapData && roadmapData.length > 0) {
      // Use passed roadmap data (highest priority)
      const allNodes = roadmapData.map((phase, index) => {
        // Ensure tasks are properly structured with all required properties
        const safeTasks = (phase.tasks || []).map(task => ({
          id: task.id || `task-${index}-${Math.random()}`,
          title: task.title || 'Untitled Task',
          description: task.description || 'No description provided',
          completed: Boolean(task.completed),
          priority: task.priority || 'medium',
          estimatedHours: task.estimatedHours || 0,
          tags: Array.isArray(task.tags) ? task.tags : []
        }));

        return {
          id: phase.id || `phase-${index}`,
          title: phase.title || 'Untitled Phase',
          description: phase.description || 'No description provided',
          type: 'phase' as const,
          status: phase.status as any || 'upcoming',
          completion: phase.status === 'completed' ? 100 : phase.status === 'in-progress' ? 50 : 0,
          estimatedHours: 80,
          actualHours: phase.status === 'completed' ? 80 : phase.status === 'in-progress' ? 40 : 0,
          startDate: new Date(),
          endDate: new Date(),
          tasks: safeTasks,
          dependencies: Array.isArray(phase.dependencies) ? phase.dependencies : [],
          priority: phase.priority as any || 'medium',
          position: phase.position || { x: 200 + (index * 180), y: 200 },
          radius: phase.radius || 50,
          color: phase.color || (phase.status === 'completed' ? '#10b981' : 
                                 phase.status === 'in-progress' ? '#f59e0b' : '#6366f1'),
          zIndex: 1,
          isSelected: false,
          isHovered: false,
          isAnimating: false
        };
      });
      setNodes(allNodes);
      
      // Set the current active node (in-progress or first node)
      const activeNodeIndex = allNodes.findIndex((node: any) => node.status === 'in-progress');
      if (activeNodeIndex >= 0) {
        setCurrentIndex(activeNodeIndex);
        setSelectedNode(allNodes[activeNodeIndex]);
      } else if (allNodes.length > 0) {
        setCurrentIndex(0);
        setSelectedNode(allNodes[0]);
      }
    } else if (firebaseNodes.length > 0) {
      // Use Firebase data and limit to 2 items
      const limitedFirebaseNodes = firebaseNodes.slice(0, 2);
      const allNodes = limitedFirebaseNodes.map(node => ({
        id: node.id,
        title: node.title,
        description: node.description,
        type: 'phase' as const,
        status: node.status as any,
        completion: node.status === 'completed' ? 100 : node.status === 'in-progress' ? 50 : 0,
        estimatedHours: 80,
        actualHours: node.status === 'completed' ? 80 : 0,
        startDate: new Date(),
        endDate: new Date(),
        tasks: node.tasks || [],
        dependencies: node.dependencies || [],
        priority: node.priority as any || 'medium',
        position: node.position || { x: 200 + (limitedFirebaseNodes.indexOf(node) * 150), y: 200 },
        radius: node.radius || 50,
        color: node.color || '#6b7280',
        zIndex: 1,
        isSelected: false,
        isHovered: false,
        isAnimating: false
      }));
      setNodes(allNodes);
      
      // Set the current active node (in-progress) for Firebase data
      const activeNodeIndex = allNodes.findIndex((node: any) => node.status === 'in-progress');
      if (activeNodeIndex >= 0) {
        setCurrentIndex(activeNodeIndex);
        setSelectedNode(allNodes[activeNodeIndex]);
      }
    } else {
      // Fallback to sample data when no Firebase data is available
      const sampleNodes = graph.getNodes();
      
      // Add more nodes to show complete roadmap including upcoming phases
      const additionalNodes = [
        {
          id: 'testing',
          title: 'Testing & QA',
          description: 'Comprehensive testing and quality assurance',
          type: 'phase' as const,
          status: 'upcoming' as const,
          completion: 0,
          estimatedHours: 120,
          actualHours: 0,
          startDate: new Date('2024-04-15'),
          endDate: new Date('2024-05-15'),
          tasks: [
            { id: 't12', title: 'Unit Testing', description: 'Write comprehensive unit tests', completed: false, priority: 'high' as const, estimatedHours: 40, tags: ['testing'] },
            { id: 't13', title: 'Integration Testing', description: 'Test system integration points', completed: false, priority: 'high' as const, estimatedHours: 50, tags: ['testing'] },
            { id: 't14', title: 'User Acceptance Testing', description: 'Conduct UAT with stakeholders', completed: false, priority: 'medium' as const, estimatedHours: 30, tags: ['uat'] }
          ],
          dependencies: ['frontend'],
          priority: 'high' as const,
          position: { x: 500, y: 300 },
          radius: 50,
          color: '#6b7280',
          zIndex: 1,
          isSelected: false,
          isHovered: false,
          isAnimating: false
        },
        {
          id: 'deployment',
          title: 'Deployment',
          description: 'Production deployment and go-live',
          type: 'phase' as const,
          status: 'upcoming' as const,
          completion: 0,
          estimatedHours: 80,
          actualHours: 0,
          startDate: new Date('2024-05-15'),
          endDate: new Date('2024-06-01'),
          tasks: [
            { id: 't15', title: 'Production Setup', description: 'Configure production environment', completed: false, priority: 'critical' as const, estimatedHours: 30, tags: ['devops'] },
            { id: 't16', title: 'Go-Live', description: 'Deploy to production and monitor', completed: false, priority: 'critical' as const, estimatedHours: 20, tags: ['deployment'] },
            { id: 't17', title: 'Post-Launch Monitoring', description: 'Monitor system stability', completed: false, priority: 'high' as const, estimatedHours: 30, tags: ['monitoring'] }
          ],
          dependencies: ['testing'],
          priority: 'critical' as const,
          position: { x: 650, y: 200 },
          radius: 50,
          color: '#6b7280',
          zIndex: 1,
          isSelected: false,
          isHovered: false,
          isAnimating: false
        }
      ];
      
      const completeNodes = [...sampleNodes, ...additionalNodes];
      setNodes(completeNodes);
      
      // Set the current active node (in-progress) for sample data
      const activeNodeIndex = completeNodes.findIndex((node: any) => node.status === 'in-progress');
      if (activeNodeIndex >= 0) {
        setCurrentIndex(activeNodeIndex);
        setSelectedNode(completeNodes[activeNodeIndex]);
      }
    }
  }, [roadmapData, firebaseNodes]);

  // Canvas drawing
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const { width, height } = canvas.getBoundingClientRect();
    
    // Clear canvas with dark gradient background
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height));
    gradient.addColorStop(0, '#1f2937');
    gradient.addColorStop(0.7, '#111827');
    gradient.addColorStop(1, '#000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add subtle grid pattern
    ctx.strokeStyle = 'rgba(75, 85, 99, 0.1)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (nodes.length === 0) return;

    const centerX = width / 2;
    const centerY = height / 2;
    
    // Create a more sophisticated graph layout - horizontal timeline for roadmap
    const nodePositions = nodes.map((node, index) => {
      // Use original position from Firebase data if available
      if (node.position && node.position.x && node.position.y) {
        // Scale the position to fit canvas
        const scaledX = (node.position.x / 1000) * width * 0.8 + width * 0.1;
        const scaledY = (node.position.y / 500) * height * 0.6 + height * 0.2;
        return { x: scaledX, y: scaledY, node, index };
      }
      
      // Fallback: horizontal timeline layout
      const spacing = Math.min(width / (nodes.length + 1), 200);
      const x = spacing * (index + 1);
      const y = centerY;
      
      return { x, y, node, index };
    });

    // Draw connections between dependent nodes with improved styling
    nodePositions.forEach(({ node, x, y }) => {
      if (node.dependencies && node.dependencies.length > 0) {
        node.dependencies.forEach(depId => {
          const depPosition = nodePositions.find(pos => pos.node.id === depId);
          if (depPosition) {
            // Calculate connection points on circle edges instead of centers
            const dx = x - depPosition.x;
            const dy = y - depPosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const nodeRadius = 28;
            
            // Start point (edge of source node)
            const startX = depPosition.x + (dx / distance) * nodeRadius;
            const startY = depPosition.y + (dy / distance) * nodeRadius;
            
            // End point (edge of target node)
            const endX = x - (dx / distance) * nodeRadius;
            const endY = y - (dy / distance) * nodeRadius;
            
            // Draw connection with enhanced styling
            ctx.shadowColor = '#3b82f6';
            ctx.shadowBlur = 6;
            
            // Draw main line with gradient
            const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
            gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
            gradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.6)');
            gradient.addColorStop(1, 'rgba(139, 92, 246, 0.8)');
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            
            // Draw arrow head with better styling
            const angle = Math.atan2(dy, dx);
            const arrowLength = 12;
            const arrowWidth = 6;
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(endX, endY);
            ctx.lineTo(
              endX - arrowLength * Math.cos(angle - arrowWidth / 2),
              endY - arrowLength * Math.sin(angle - arrowWidth / 2)
            );
            ctx.lineTo(
              endX - arrowLength * Math.cos(angle + arrowWidth / 2),
              endY - arrowLength * Math.sin(angle + arrowWidth / 2)
            );
            ctx.closePath();
            ctx.fill();
            
            // Add connection label for better understanding
            const midX = (startX + endX) / 2;
            const midY = (startY + endY) / 2;
            
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.font = '10px system-ui';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Add small background for text readability
            const textWidth = ctx.measureText('→').width;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.fillRect(midX - textWidth/2 - 2, midY - 6, textWidth + 4, 12);
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fillText('→', midX, midY);
          }
        });
      }
    });
    
    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw nodes with enhanced animations
    nodePositions.forEach(({ node, x, y, index }) => {

      const isSelected = index === currentIndex;
      const isHovered = index === hoveredNodeIndex;
      const isClicked = index === clickedNodeIndex;
      const isCompleted = node.status === 'completed';
      
      // Dynamic radius based on state
      let nodeRadius = 16; // base radius
      if (isSelected) nodeRadius = 28;
      else if (isClicked) nodeRadius = 32; // Larger when clicked
      else if (isHovered) nodeRadius = 22;
      
      // Animated pulse for selected node, gentle pulse for hover
      const time = Date.now() * 0.003;
      const pulse = isSelected ? 1 + Math.sin(time) * 0.1 : 
                   isHovered ? 1 + Math.sin(time * 2) * 0.05 : 1;
      const finalRadius = nodeRadius * pulse;
      
      // Node shadow/glow for selected and hovered states
      if (isSelected || isHovered) {
        ctx.shadowColor = isCompleted ? '#10b981' : 
                          node.status === 'in-progress' ? '#f59e0b' : '#6366f1';
        ctx.shadowBlur = isSelected ? 20 : 10;
      }
      
      // Outer glow ring for selected nodes
      if (isSelected) {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 50);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 50, 0, 2 * Math.PI);
        ctx.fill();
      }
      
      // Subtle hover glow for hovered nodes
      if (isHovered && !isSelected) {
        const hoverGradient = ctx.createRadialGradient(x, y, 0, x, y, 35);
        hoverGradient.addColorStop(0, 'rgba(99, 102, 241, 0.2)');
        hoverGradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
        ctx.fillStyle = hoverGradient;
        ctx.beginPath();
        ctx.arc(x, y, 35, 0, 2 * Math.PI);
        ctx.fill();
      }
      
      // Node circle with gradient
      const nodeGradient = ctx.createRadialGradient(x-5, y-5, 0, x, y, finalRadius);
      if (isCompleted) {
        nodeGradient.addColorStop(0, '#34d399');
        nodeGradient.addColorStop(1, '#059669');
      } else if (node.status === 'in-progress') {
        nodeGradient.addColorStop(0, '#fbbf24');
        nodeGradient.addColorStop(1, '#d97706');
      } else {
        nodeGradient.addColorStop(0, '#6366f1');
        nodeGradient.addColorStop(1, '#4338ca');
      }
      
      ctx.fillStyle = nodeGradient;
      ctx.beginPath();
      ctx.arc(x, y, finalRadius, 0, 2 * Math.PI);
      ctx.fill();
      
      // Inner border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Reset shadow
      ctx.shadowBlur = 0;
      
      // Selection ring animation
      if (isSelected) {
        const ringRadius = 40 + Math.sin(time * 2) * 3;
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.6)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, ringRadius, 0, 2 * Math.PI);
        ctx.stroke();
      }

      // Completion indicator
      if (isCompleted) {
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('✓', x, y);
      }

      // Node label (only for selected) with better positioning
      if (isSelected) {
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 16px system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        // Add text shadow for better readability
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 2;
        
        ctx.fillText(node.title, x, y + 55);
        
        // Reset shadow
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
      }
    });

    // Progress indicator with better styling and positioning
    const completedCount = nodes.filter(n => n.status === 'completed').length;
    const progress = (completedCount / nodes.length) * 100;
    
    // Progress text with glow effect
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 20px system-ui';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(99, 102, 241, 0.8)';
    ctx.shadowBlur = 10;
    ctx.fillText(`${Math.round(progress)}% Complete`, centerX, 50);
    
    // Reset shadow
    ctx.shadowBlur = 0;

  }, [nodes, currentIndex, hoveredNodeIndex, clickedNodeIndex]);

  // Handle canvas click - using same positioning logic as drawing
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
    // Use the same positioning logic as the drawing function
    const { width, height } = rect;
    const centerX = width / 2;
    const centerY = height / 2;
    
    const nodePositions = nodes.map((node, index) => {
      // Use original position from Firebase data if available
      if (node.position && node.position.x && node.position.y) {
        // Scale the position to fit canvas (same as drawing)
        const scaledX = (node.position.x / 1000) * width * 0.8 + width * 0.1;
        const scaledY = (node.position.y / 500) * height * 0.6 + height * 0.2;
        return { x: scaledX, y: scaledY, node, index };
      }
      
      // Fallback: horizontal timeline layout (same as drawing)
      const spacing = Math.min(width / (nodes.length + 1), 200);
      const x = spacing * (index + 1);
      const y = centerY;
      
      return { x, y, node, index };
    });

    nodePositions.forEach(({ x, y, node, index }) => {
      const distance = Math.sqrt((clickX - x) ** 2 + (clickY - y) ** 2);
      
      // Use a larger click radius for better usability
      if (distance <= 50) {
        
        // Set click effect
        setClickedNodeIndex(index);
        setTimeout(() => setClickedNodeIndex(null), 200); // Clear after 200ms
        
        setCurrentIndex(index);
        setSelectedNode(node);
        return; // Exit early once we find a clicked node
      }
    });
  };

  // Handle mouse move for hover effects
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    const { width, height } = rect;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Use same positioning logic as click and draw
    const nodePositions = nodes.map((node, index) => {
      if (node.position && node.position.x && node.position.y) {
        const scaledX = (node.position.x / 1000) * width * 0.8 + width * 0.1;
        const scaledY = (node.position.y / 500) * height * 0.6 + height * 0.2;
        return { x: scaledX, y: scaledY, node, index };
      }
      
      const spacing = Math.min(width / (nodes.length + 1), 200);
      const x = spacing * (index + 1);
      const y = centerY;
      
      return { x, y, node, index };
    });

    let foundHover = false;
    nodePositions.forEach(({ x, y, node, index }) => {
      const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
      if (distance <= 50) {
        setHoveredNodeIndex(index);
        foundHover = true;
        canvas.style.cursor = 'pointer';
      }
    });

    if (!foundHover) {
      setHoveredNodeIndex(null);
      canvas.style.cursor = 'default';
    }
  };

  // Handle mouse leave to reset hover state
  const handleMouseLeave = () => {
    setHoveredNodeIndex(null);
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'default';
    }
  };

  // Removed swipe and keyboard navigation - using click-only interaction for graph structure

  useEffect(() => {
    const animate = () => {
      drawCanvas();
      requestAnimationFrame(animate);
    };
    animate();
  }, [drawCanvas]);

  useEffect(() => {
    if (nodes.length > 0) {
      setSelectedNode(nodes[0]);
    }
  }, [nodes]);

  return (
    <div className={`w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-lg overflow-hidden ${className}`}>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-96 cursor-pointer transition-all duration-300 hover:opacity-95"
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />

      {/* Node Details Panel */}
      {selectedNode && (
        <div className="p-6 bg-gray-800/95 backdrop-blur-xl border-t border-gray-600/50 shadow-2xl transform transition-all duration-300 ease-out">
          <div className="max-w-2xl mx-auto">
            {/* Header with enhanced styling */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-gray-700/50 rounded-xl backdrop-blur-sm">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                selectedNode.status === 'completed' ? 'bg-green-500 shadow-green-500/50' :
                selectedNode.status === 'in-progress' ? 'bg-yellow-500 shadow-yellow-500/50' : 'bg-indigo-500 shadow-indigo-500/50'
              } shadow-lg`}>
                {selectedNode.status === 'completed' && <span className="text-white text-xs">✓</span>}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {selectedNode.title}
                </h3>
                <span className="text-sm text-indigo-300 bg-indigo-900/50 px-3 py-1 rounded-full border border-indigo-500/30 mt-2 inline-block">
                  {selectedNode.type}
                </span>
              </div>
            </div>

            {/* Description with better styling */}
            <div className="mb-6 p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
              <p className="text-gray-300 leading-relaxed">{selectedNode.description}</p>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl border border-gray-600/30 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-1">
                  {selectedNode.estimatedHours}
                </div>
                <div className="text-sm text-gray-400 font-medium">Hours</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-800/30 to-green-900/30 rounded-xl border border-green-600/30 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                <div className="text-2xl md:text-3xl font-bold text-green-400 mb-1">
                  {selectedNode.completion}%
                </div>
                <div className="text-sm text-gray-400 font-medium">Complete</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl border border-gray-600/30 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                <div className={`text-xl md:text-2xl font-bold mb-1 ${
                  selectedNode.priority === 'critical' ? 'text-red-400' :
                  selectedNode.priority === 'high' ? 'text-orange-400' :
                  selectedNode.priority === 'medium' ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {selectedNode.priority.toUpperCase()}
                </div>
                <div className="text-sm text-gray-400 font-medium">Priority</div>
              </div>
            </div>

            {/* Modern Tasks Section */}
            {selectedNode.tasks && selectedNode.tasks.length > 0 && (
              <div className="bg-gray-900/60 rounded-2xl border border-gray-600/40 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-semibold text-white flex items-center gap-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
                    Tasks & Deliverables
                  </h4>
                  <div className="text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
                    {selectedNode.tasks.filter(t => t.completed).length} of {selectedNode.tasks.length} completed
                  </div>
                </div>
                
                <div className="grid gap-3">
                  {selectedNode.tasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="group relative p-4 bg-gradient-to-r from-gray-800/40 to-gray-800/60 rounded-xl border border-gray-700/40 hover:border-indigo-500/40 transition-all duration-200"
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            task.completed 
                              ? 'bg-green-500 border-green-500 shadow-green-500/30 shadow-lg' 
                              : 'border-gray-500 hover:border-indigo-400'
                          }`}>
                            {task.completed && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h5 className={`font-medium leading-tight ${
                              task.completed ? 'text-gray-400 line-through' : 'text-white'
                            }`}>
                              {task.title || 'Untitled Task'}
                            </h5>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className={`px-2 py-1 rounded-md text-xs font-medium border ${
                                (task.priority || 'medium') === 'critical' ? 'bg-red-900/30 text-red-300 border-red-700/50' :
                                (task.priority || 'medium') === 'high' ? 'bg-orange-900/30 text-orange-300 border-orange-700/50' :
                                (task.priority || 'medium') === 'medium' ? 'bg-yellow-900/30 text-yellow-300 border-yellow-700/50' : 
                                'bg-green-900/30 text-green-300 border-green-700/50'
                              }`}>
                                {task.priority || 'medium'}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-400 mb-3">{task.description || 'No description provided'}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{task.estimatedHours || 0}h</span>
                              </div>
                              <div className="flex items-center gap-1">
                                {task.tags && Array.isArray(task.tags) && task.tags.map((tag, index) => (
                                  <span key={index} className="px-2 py-0.5 bg-indigo-900/40 text-indigo-300 text-xs rounded-md border border-indigo-700/30">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Graph Status */}
      <div className="absolute bottom-6 left-6 flex items-center gap-3 text-xs text-gray-300 bg-gray-800/80 backdrop-blur-md px-4 py-2 rounded-full border border-gray-600/50 shadow-lg">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
          <span>Upcoming</span>
        </div>
      </div>

      {/* Enhanced Graph Status & Analytics */}
      <div className="absolute bottom-6 left-6 flex items-center gap-4 text-sm text-gray-200 bg-gray-800/90 backdrop-blur-xl px-6 py-3 rounded-2xl border border-gray-600/40 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-emerald-500/30 shadow-lg"></div>
            <span className="font-medium">Completed</span>
            <span className="text-gray-400">({nodes.filter((n: GraphNode) => n.status === 'completed').length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full shadow-amber-500/30 shadow-lg"></div>
            <span className="font-medium">In Progress</span>
            <span className="text-gray-400">({nodes.filter((n: GraphNode) => n.status === 'in-progress').length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-indigo-500 rounded-full shadow-indigo-500/30 shadow-lg"></div>
            <span className="font-medium">Upcoming</span>
            <span className="text-gray-400">({nodes.filter((n: GraphNode) => ['planned', 'upcoming'].includes(n.status)).length})</span>
          </div>
        </div>
        <div className="w-px h-5 bg-gray-600/50"></div>
        
      </div>
    </div>
  );
}