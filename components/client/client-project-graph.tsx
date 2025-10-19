'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createClientProjectGraph, GraphNode, GraphEdge } from '@/lib/advanced-graph';

interface ClientProjectGraphProps {
  className?: string;
  onProjectSelect?: (project: GraphNode) => void;
}

export default function ClientProjectGraph({ className = '', onProjectSelect }: ClientProjectGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedProject, setSelectedProject] = useState<GraphNode | null>(null);
  const [projects, setProjects] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);

  // Initialize client project data
  useEffect(() => {
    const graph = createClientProjectGraph();
    const allProjects = graph.getNodes();
    const allEdges = graph.getEdges();
    
    setProjects(allProjects);
    setEdges(allEdges);
    
    // Set first active project as selected
    const activeProject = allProjects.find(p => p.status === 'in-progress');
    if (activeProject) {
      setSelectedProject(activeProject);
      onProjectSelect?.(activeProject);
    }
  }, [onProjectSelect]);

  // Canvas drawing with professional styling
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high DPI
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const { width, height } = canvas.getBoundingClientRect();
    
    // Professional gradient background
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(0.4, '#1e293b');
    gradient.addColorStop(1, '#020617');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Subtle grid pattern for tech aesthetic
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
    ctx.lineWidth = 1;
    const gridSize = 60;
    
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

    // Calculate project positions with professional spacing
    const projectPositions = projects.map((project, index) => {
      // Use graph-based positioning with better distribution
      const angle = (index / projects.length) * 2 * Math.PI - Math.PI/2;
      const radiusVariation = 200 + (project.projectValue || 0) / 10000; // Vary by project value
      const x = width/2 + Math.cos(angle) * radiusVariation;
      const y = height/2 + Math.sin(angle) * (radiusVariation * 0.8);
      
      return { project, x, y, index };
    });

    // Draw dependency edges with professional styling
    edges.forEach(edge => {
      const fromPos = projectPositions.find(pos => pos.project.id === edge.fromNodeId);
      const toPos = projectPositions.find(pos => pos.project.id === edge.toNodeId);
      
      if (fromPos && toPos) {
        const isPlanned = edge.type === 'future';
        const time = Date.now() * 0.002;
        
        // Enhanced edge styling
        ctx.save();
        
        if (isPlanned) {
          // Dashed lines for future implementations
          ctx.setLineDash([10, 8]);
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
          ctx.lineWidth = 2;
        } else {
          // Solid lines for active dependencies
          ctx.setLineDash([]);
          ctx.strokeStyle = edge.animated ? 
            `rgba(59, 130, 246, ${0.6 + Math.sin(time) * 0.3})` : 
            'rgba(59, 130, 246, 0.5)';
          ctx.lineWidth = 3;
          ctx.shadowColor = '#3b82f6';
          ctx.shadowBlur = edge.animated ? 8 : 4;
        }
        
        // Draw curved connection
        const midX = (fromPos.x + toPos.x) / 2;
        const midY = (fromPos.y + toPos.y) / 2 - 30; // Curve upward
        
        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.quadraticCurveTo(midX, midY, toPos.x, toPos.y);
        ctx.stroke();
        
        // Draw directional arrow
        const angle = Math.atan2(toPos.y - midY, toPos.x - midX);
        const arrowSize = 12;
        
        ctx.beginPath();
        ctx.moveTo(toPos.x - arrowSize * Math.cos(angle - Math.PI/6), 
                   toPos.y - arrowSize * Math.sin(angle - Math.PI/6));
        ctx.lineTo(toPos.x, toPos.y);
        ctx.lineTo(toPos.x - arrowSize * Math.cos(angle + Math.PI/6), 
                   toPos.y - arrowSize * Math.sin(angle + Math.PI/6));
        ctx.stroke();
        
        // Add edge label for future implementations
        if (isPlanned && edge.label) {
          ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
          ctx.font = '12px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(edge.label, midX, midY - 10);
        }
        
        ctx.restore();
      }
    });
    
    ctx.shadowBlur = 0;

    // Draw project nodes with enhanced visuals
    projectPositions.forEach(({ project, x, y }) => {
      const isSelected = selectedProject?.id === project.id;
      const isHovered = hoveredProject === project.id;
      const isActive = project.status === 'in-progress';
      
      // Dynamic sizing based on project value and interaction
      const baseRadius = project.radius || 50;
      const sizeMultiplier = isSelected ? 1.3 : isHovered ? 1.15 : 1;
      const finalRadius = baseRadius * sizeMultiplier;
      
      // Animated pulse for active projects
      const time = Date.now() * 0.003;
      const pulse = isActive ? 1 + Math.sin(time * 2) * 0.1 : 1;
      const animatedRadius = finalRadius * pulse;
      
      // Professional node styling based on status
      let nodeGradient;
      let borderColor;
      let shadowColor;
      
      switch (project.status) {
        case 'completed':
          nodeGradient = ctx.createRadialGradient(x, y, 0, x, y, animatedRadius);
          nodeGradient.addColorStop(0, '#10b981');
          nodeGradient.addColorStop(0.7, '#059669');
          nodeGradient.addColorStop(1, '#047857');
          borderColor = '#34d399';
          shadowColor = 'rgba(16, 185, 129, 0.5)';
          break;
        case 'in-progress':
          nodeGradient = ctx.createRadialGradient(x, y, 0, x, y, animatedRadius);
          nodeGradient.addColorStop(0, '#f59e0b');
          nodeGradient.addColorStop(0.7, '#d97706');
          nodeGradient.addColorStop(1, '#b45309');
          borderColor = '#fbbf24';
          shadowColor = 'rgba(245, 158, 11, 0.6)';
          break;
        case 'planned':
          nodeGradient = ctx.createRadialGradient(x, y, 0, x, y, animatedRadius);
          nodeGradient.addColorStop(0, '#6366f1');
          nodeGradient.addColorStop(0.7, '#4f46e5');
          nodeGradient.addColorStop(1, '#4338ca');
          borderColor = '#8b5cf6';
          shadowColor = 'rgba(99, 102, 241, 0.4)';
          break;
        default:
          nodeGradient = ctx.createRadialGradient(x, y, 0, x, y, animatedRadius);
          nodeGradient.addColorStop(0, '#64748b');
          nodeGradient.addColorStop(0.7, '#475569');
          nodeGradient.addColorStop(1, '#334155');
          borderColor = '#94a3b8';
          shadowColor = 'rgba(100, 116, 139, 0.3)';
      }
      
      // Enhanced shadow and glow effects
      ctx.save();
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = isSelected ? 25 : isHovered ? 15 : isActive ? 20 : 10;
      
      // Main node circle
      ctx.beginPath();
      ctx.arc(x, y, animatedRadius, 0, 2 * Math.PI);
      ctx.fillStyle = nodeGradient;
      ctx.fill();
      
      // Professional border
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = isSelected ? 4 : isHovered ? 3 : 2;
      ctx.stroke();
      
      ctx.restore();
      
      // Status indicator icon
      const iconSize = animatedRadius * 0.4;
      ctx.fillStyle = 'white';
      ctx.font = `${iconSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      let statusIcon = '';
      switch (project.status) {
        case 'completed':
          statusIcon = '✓';
          break;
        case 'in-progress':
          statusIcon = '⟳';
          break;
        case 'planned':
          statusIcon = '◦';
          break;
        default:
          statusIcon = '?';
      }
      
      ctx.fillText(statusIcon, x, y);
      
      // Project title below node
      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(project.title, x, y + animatedRadius + 20);
      
      // Client name
      if (project.clientName) {
        ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
        ctx.font = '12px Inter, sans-serif';
        ctx.fillText(project.clientName, x, y + animatedRadius + 38);
      }
      
      // Project value indicator
      if (project.projectValue && isSelected) {
        ctx.fillStyle = 'rgba(34, 197, 94, 0.9)';
        ctx.font = '11px Inter, sans-serif';
        const valueText = `$${(project.projectValue / 1000).toFixed(0)}K`;
        ctx.fillText(valueText, x, y + animatedRadius + 54);
      }
      
      // Completion percentage for in-progress projects
      if (project.status === 'in-progress') {
        const progressRadius = animatedRadius + 8;
        const progressAngle = (project.completion / 100) * 2 * Math.PI - Math.PI/2;
        
        // Progress ring background
        ctx.strokeStyle = 'rgba(75, 85, 99, 0.3)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, progressRadius, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Progress ring foreground
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, progressRadius, -Math.PI/2, progressAngle);
        ctx.stroke();
        
        // Percentage text
        ctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${project.completion}%`, x, y - animatedRadius - 15);
      }
    });

  }, [projects, edges, selectedProject, hoveredProject, isAnimating]);

  // Handle canvas interactions
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if click is on any project node
    const { width, height } = rect;
    
    projects.forEach((project, index) => {
      const angle = (index / projects.length) * 2 * Math.PI - Math.PI/2;
      const radiusVariation = 200 + (project.projectValue || 0) / 10000;
      const nodeX = width/2 + Math.cos(angle) * radiusVariation;
      const nodeY = height/2 + Math.sin(angle) * (radiusVariation * 0.8);
      
      const distance = Math.sqrt((x - nodeX) ** 2 + (y - nodeY) ** 2);
      const nodeRadius = project.radius || 50;
      
      if (distance <= nodeRadius * 1.3) { // Slightly larger click area
        setSelectedProject(project);
        onProjectSelect?.(project);
      }
    });
  }, [projects, onProjectSelect]);

  const handleCanvasMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const { width, height } = rect;

    let hoveredId = null;

    projects.forEach((project, index) => {
      const angle = (index / projects.length) * 2 * Math.PI - Math.PI/2;
      const radiusVariation = 200 + (project.projectValue || 0) / 10000;
      const nodeX = width/2 + Math.cos(angle) * radiusVariation;
      const nodeY = height/2 + Math.sin(angle) * (radiusVariation * 0.8);
      
      const distance = Math.sqrt((x - nodeX) ** 2 + (y - nodeY) ** 2);
      const nodeRadius = project.radius || 50;
      
      if (distance <= nodeRadius * 1.3) {
        hoveredId = project.id;
      }
    });

    setHoveredProject(hoveredId);
    canvas.style.cursor = hoveredId ? 'pointer' : 'default';
  }, [projects]);

  // Animation loop
  useEffect(() => {
    if (!isAnimating) return;

    const animate = () => {
      drawCanvas();
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [drawCanvas, isAnimating]);

  // Initial draw
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  return (
    <div className={`relative w-full h-full min-h-[600px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-700/50 ${className}`}>
      {/* Header */}
      <div className="absolute top-6 left-6 right-6 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Client Project Portfolio</h2>
            <p className="text-slate-400">Interactive project dependency visualization</p>
          </div>
          <div className="flex items-center gap-4 bg-slate-800/80 backdrop-blur-xl px-6 py-3 rounded-xl border border-slate-600/50">
            <div className="text-sm text-slate-300">
              Total Value: <span className="text-emerald-400 font-semibold">
                ${(projects.reduce((sum, p) => sum + (p.projectValue || 0), 0) / 1000000).toFixed(1)}M
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
      />

      {/* Project Details Panel */}
      {selectedProject && (
        <div className="absolute top-24 right-6 w-80 bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-slate-600/50 p-6 shadow-2xl">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{selectedProject.title}</h3>
              <p className="text-slate-400 text-sm">{selectedProject.clientName}</p>
            </div>
            <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
              selectedProject.status === 'completed' ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40' :
              selectedProject.status === 'in-progress' ? 'bg-amber-500/20 text-amber-200 border-amber-400/40' :
              'bg-indigo-500/20 text-indigo-200 border-indigo-400/40'
            }`}>
              {selectedProject.status.replace('-', ' ').toUpperCase()}
            </div>
          </div>

          <p className="text-slate-300 text-sm mb-4 leading-relaxed">
            {selectedProject.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">Project Value</div>
              <div className="text-lg font-bold text-emerald-400">
                ${selectedProject.projectValue ? (selectedProject.projectValue / 1000).toFixed(0) + 'K' : 'N/A'}
              </div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">Completion</div>
              <div className="text-lg font-bold text-white">
                {selectedProject.completion}%
              </div>
            </div>
          </div>

          {selectedProject.team && selectedProject.team.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-medium text-slate-300 mb-2">Team Members</div>
              <div className="space-y-2">
                {selectedProject.team.slice(0, 3).map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm text-white font-medium">{member.name}</div>
                      <div className="text-xs text-slate-400">{member.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedProject.milestones && selectedProject.milestones.length > 0 && (
            <div>
              <div className="text-sm font-medium text-slate-300 mb-2">Recent Milestones</div>
              <div className="space-y-2">
                {selectedProject.milestones.slice(0, 2).map((milestone) => (
                  <div key={milestone.id} className="bg-slate-700/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${
                        milestone.status === 'completed' ? 'bg-emerald-400' :
                        milestone.status === 'in-progress' ? 'bg-amber-400' : 'bg-slate-400'
                      }`} />
                      <div className="text-sm font-medium text-white">{milestone.title}</div>
                    </div>
                    <div className="text-xs text-slate-400">{milestone.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-6 left-6 flex items-center gap-6 text-sm text-slate-200 bg-slate-800/90 backdrop-blur-xl px-6 py-3 rounded-xl border border-slate-600/50 shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-emerald-500/30 shadow-lg" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-amber-500 rounded-full shadow-amber-500/30 shadow-lg" />
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-indigo-500 rounded-full shadow-indigo-500/30 shadow-lg" />
          <span>Planned</span>
        </div>
        <div className="w-px h-5 bg-slate-600/50" />
        <div className="text-xs text-slate-400">
          Click nodes to explore • Hover for details
        </div>
      </div>
    </div>
  );
}