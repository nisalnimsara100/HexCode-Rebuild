/**
 * Advanced Graph Data Structures for Project Roadmap Visualization
 * Implements comprehensive graph algorithms with TypeScript
 */

// Core Graph Node Interface
export interface GraphNode {
  id: string;
  title: string;
  description: string;
  type: 'milestone' | 'task' | 'phase' | 'deliverable' | 'client-project';
  status: 'completed' | 'in-progress' | 'upcoming' | 'blocked' | 'delayed' | 'planned';
  priority: 'critical' | 'high' | 'medium' | 'low';
  
  // Client Project Properties
  clientName?: string;
  clientLogo?: string;
  projectValue?: number;
  milestones?: Milestone[];
  team?: TeamMember[];
  
  // Visual Properties
  position: { x: number; y: number };
  radius: number;
  color: string;
  zIndex: number;
  
  // Task Management
  tasks: Task[];
  completion: number; // 0-100 percentage
  estimatedHours: number;
  actualHours?: number;
  
  // Timeline
  startDate: Date;
  endDate: Date;
  dependencies: string[];
  
  // Future Planning
  futurePhases?: FuturePhase[];
  risks?: Risk[];
  
  // Interaction State
  isSelected: boolean;
  isHovered: boolean;
  isAnimating: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  assignee?: string;
  dueDate?: Date;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedHours: number;
  actualHours?: number;
  tags: string[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  completedDate?: Date;
  status: 'completed' | 'in-progress' | 'upcoming' | 'overdue';
  deliverables: string[];
  stakeholders: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  email?: string;
  skills: string[];
  availability: number; // 0-100 percentage
}

export interface FuturePhase {
  id: string;
  title: string;
  description: string;
  plannedStartDate: Date;
  estimatedDuration: number; // in days
  dependencies: string[];
  requirements: string[];
  risks: string[];
  estimatedCost?: number;
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
}

export interface GraphEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  type: 'dependency' | 'flow' | 'milestone' | 'future';
  weight: number;
  label?: string;
  animated: boolean;
}

// Advanced Graph Class with Algorithms
export class ProjectGraph {
  private nodes: Map<string, GraphNode> = new Map();
  private edges: Map<string, GraphEdge> = new Map();
  private adjacencyList: Map<string, string[]> = new Map();
  
  constructor() {}
  
  // Node Management
  addNode(node: GraphNode): void {
    this.nodes.set(node.id, node);
    this.adjacencyList.set(node.id, []);
  }
  
  addEdge(edge: GraphEdge): void {
    this.edges.set(edge.id, edge);
    
    // Update adjacency list
    const fromConnections = this.adjacencyList.get(edge.fromNodeId) || [];
    fromConnections.push(edge.toNodeId);
    this.adjacencyList.set(edge.fromNodeId, fromConnections);
  }
  
  // Graph Algorithms
  getTopologicalSort(): string[] {
    const visited = new Set<string>();
    const stack: string[] = [];
    
    const dfs = (nodeId: string) => {
      visited.add(nodeId);
      const neighbors = this.adjacencyList.get(nodeId) || [];
      
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor);
        }
      }
      
      stack.push(nodeId);
    };
    
    for (const nodeId of this.nodes.keys()) {
      if (!visited.has(nodeId)) {
        dfs(nodeId);
      }
    }
    
    return stack.reverse();
  }
  
  getCriticalPath(): string[] {
    const sortedNodes = this.getTopologicalSort();
    
    // Return empty array if no nodes
    if (sortedNodes.length === 0) {
      return [];
    }
    
    const distances = new Map<string, number>();
    const predecessors = new Map<string, string | null>();
    
    // Initialize distances
    for (const nodeId of sortedNodes) {
      distances.set(nodeId, 0);
      predecessors.set(nodeId, null);
    }
    
    // Calculate longest path (critical path)
    for (const nodeId of sortedNodes) {
      const currentDistance = distances.get(nodeId) || 0;
      const neighbors = this.adjacencyList.get(nodeId) || [];
      
      for (const neighborId of neighbors) {
        const node = this.nodes.get(nodeId);
        const edgeWeight = node?.estimatedHours || 1;
        const newDistance = currentDistance + edgeWeight;
        
        if (newDistance > (distances.get(neighborId) || 0)) {
          distances.set(neighborId, newDistance);
          predecessors.set(neighborId, nodeId);
        }
      }
    }
    
    // Reconstruct path
    const path: string[] = [];
    const distanceEntries = Array.from(distances.entries());
    
    // Return empty array if no distances calculated
    if (distanceEntries.length === 0) {
      return [];
    }
    
    let current: string | null = distanceEntries.reduce((max, current) => 
      current[1] > max[1] ? current : max
    )[0];
    
    while (current) {
      path.unshift(current);
      const next = predecessors.get(current);
      current = next === undefined ? null : next;
    }
    
    return path;
  }
  
  getCompletionStats(): {
    totalTasks: number;
    completedTasks: number;
    completionPercentage: number;
    estimatedHours: number;
    actualHours: number;
    onTrackPercentage: number;
  } {
    let totalTasks = 0;
    let completedTasks = 0;
    let estimatedHours = 0;
    let actualHours = 0;
    let onTrackCount = 0;
    
    for (const node of this.nodes.values()) {
      totalTasks += node.tasks.length;
      completedTasks += node.tasks.filter(t => t.completed).length;
      estimatedHours += node.estimatedHours;
      actualHours += node.actualHours || 0;
      
      if (node.status === 'completed' || node.status === 'in-progress') {
        onTrackCount++;
      }
    }
    
    return {
      totalTasks,
      completedTasks,
      completionPercentage: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
      estimatedHours,
      actualHours,
      onTrackPercentage: this.nodes.size > 0 ? (onTrackCount / this.nodes.size) * 100 : 0
    };
  }
  
  // Future Planning Methods
  generateFutureRoadmap(fromNodeId: string, timelineMonths: number = 12): FuturePhase[] {
    const node = this.nodes.get(fromNodeId);
    if (!node) return [];
    
    const baseDate = node.endDate;
    const futurePhases: FuturePhase[] = [];
    
    // Generate phases based on project type and completion status
    if (node.status === 'completed') {
      // Post-launch phases
      futurePhases.push(
        {
          id: `${fromNodeId}-maintenance`,
          title: 'Maintenance & Support',
          description: 'Ongoing maintenance, bug fixes, and user support',
          plannedStartDate: new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week after
          estimatedDuration: 90, // 3 months
          dependencies: [fromNodeId],
          requirements: ['Support team', 'Monitoring tools'],
          risks: ['Technical debt accumulation']
        },
        {
          id: `${fromNodeId}-enhancements`,
          title: 'Feature Enhancements',
          description: 'New features based on user feedback and analytics',
          plannedStartDate: new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000), // 1 month after
          estimatedDuration: 120, // 4 months
          dependencies: [`${fromNodeId}-maintenance`],
          requirements: ['User feedback analysis', 'Development resources'],
          risks: ['Scope creep', 'Resource allocation']
        },
        {
          id: `${fromNodeId}-scaling`,
          title: 'Performance Optimization',
          description: 'Scaling infrastructure and optimizing performance',
          plannedStartDate: new Date(baseDate.getTime() + 120 * 24 * 60 * 60 * 1000), // 4 months after
          estimatedDuration: 60, // 2 months
          dependencies: [`${fromNodeId}-enhancements`],
          requirements: ['Performance metrics', 'Infrastructure scaling'],
          risks: ['Downtime during migration']
        }
      );
    }
    
    return futurePhases;
  }
  
  // Getters
  getNodes(): GraphNode[] {
    return Array.from(this.nodes.values());
  }
  
  getEdges(): GraphEdge[] {
    return Array.from(this.edges.values());
  }
  
  getNode(id: string): GraphNode | undefined {
    return this.nodes.get(id);
  }
  
  updateNodeStatus(nodeId: string, status: GraphNode['status']): void {
    const node = this.nodes.get(nodeId);
    if (node) {
      node.status = status;
      node.isAnimating = true;
    }
  }
  
  updateNodeCompletion(nodeId: string, completion: number): void {
    const node = this.nodes.get(nodeId);
    if (node) {
      node.completion = Math.max(0, Math.min(100, completion));
      
      // Auto-update status based on completion
      if (completion === 100) {
        node.status = 'completed';
      } else if (completion > 0) {
        node.status = 'in-progress';
      }
    }
  }
}

// Factory function for client project graphs
export function createClientProjectGraph(): ProjectGraph {
  const graph = new ProjectGraph();
  
  const clientProjects: Partial<GraphNode>[] = [
    {
      id: 'fintech-app',
      title: 'FinTech Mobile App',
      description: 'Revolutionary digital banking platform with AI-powered insights',
      type: 'client-project',
      status: 'completed',
      completion: 100,
      clientName: 'SecureBank Corp',
      clientLogo: '/images/clients/securebank-logo.png',
      projectValue: 850000,
      estimatedHours: 2400,
      actualHours: 2280,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-08-30'),
      priority: 'critical',
      milestones: [
        {
          id: 'ft-m1',
          title: 'MVP Launch',
          description: 'Core banking features deployed',
          targetDate: new Date('2024-04-15'),
          completedDate: new Date('2024-04-12'),
          status: 'completed',
          deliverables: ['Account management', 'Transfers', 'Security'],
          stakeholders: ['CTO', 'Product Manager']
        }
      ],
      team: [
        { id: 'dev1', name: 'Sarah Chen', role: 'Lead Developer', skills: ['React Native', 'Node.js'], availability: 100 },
        { id: 'des1', name: 'Marcus Johnson', role: 'UX Designer', skills: ['Figma', 'User Research'], availability: 80 }
      ],
      tasks: [
        { id: 'ft1', title: 'Security Implementation', description: 'Implement biometric authentication', completed: true, priority: 'critical', estimatedHours: 120, tags: ['security'] },
        { id: 'ft2', title: 'AI Integration', description: 'Add spending insights AI', completed: true, priority: 'high', estimatedHours: 200, tags: ['ai', 'analytics'] }
      ],
      dependencies: []
    },
    {
      id: 'ecommerce-platform',
      title: 'E-Commerce Platform',
      description: 'Multi-vendor marketplace with advanced analytics',
      type: 'client-project',
      status: 'in-progress',
      completion: 75,
      clientName: 'ShopFlow Inc',
      clientLogo: '/images/clients/shopflow-logo.png',
      projectValue: 650000,
      estimatedHours: 1800,
      actualHours: 1350,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-10-15'),
      priority: 'high',
      milestones: [
        {
          id: 'ec-m1',
          title: 'Vendor Portal',
          description: 'Complete vendor onboarding system',
          targetDate: new Date('2024-06-30'),
          completedDate: new Date('2024-06-28'),
          status: 'completed',
          deliverables: ['Registration', 'Product management', 'Analytics'],
          stakeholders: ['CEO', 'Business Development']
        },
        {
          id: 'ec-m2',
          title: 'Payment Gateway',
          description: 'Integrate multi-payment processing',
          targetDate: new Date('2024-09-15'),
          status: 'in-progress',
          deliverables: ['Payment processing', 'Fraud detection', 'Refunds'],
          stakeholders: ['CTO', 'Finance Team']
        }
      ],
      team: [
        { id: 'dev2', name: 'Alex Rivera', role: 'Full Stack Developer', skills: ['Next.js', 'PostgreSQL'], availability: 100 },
        { id: 'dev3', name: 'Emily Watson', role: 'Backend Developer', skills: ['Node.js', 'AWS'], availability: 90 }
      ],
      tasks: [
        { id: 'ec1', title: 'Multi-vendor Architecture', description: 'Design scalable vendor system', completed: true, priority: 'critical', estimatedHours: 180, tags: ['architecture'] },
        { id: 'ec2', title: 'Real-time Analytics', description: 'Build live sales dashboard', completed: false, priority: 'high', estimatedHours: 100, tags: ['analytics'] }
      ],
      dependencies: ['fintech-app']
    },
    {
      id: 'healthcare-portal',
      title: 'Healthcare Portal',
      description: 'Patient management system with telemedicine capabilities',
      type: 'client-project',
      status: 'planned',
      completion: 0,
      clientName: 'MedTech Solutions',
      clientLogo: '/images/clients/medtech-logo.png',
      projectValue: 1200000,
      estimatedHours: 3200,
      actualHours: 0,
      startDate: new Date('2024-11-01'),
      endDate: new Date('2025-08-30'),
      priority: 'critical',
      milestones: [
        {
          id: 'hc-m1',
          title: 'HIPAA Compliance Review',
          description: 'Complete security and compliance audit',
          targetDate: new Date('2024-12-15'),
          status: 'upcoming',
          deliverables: ['Security audit', 'Compliance documentation'],
          stakeholders: ['Legal Team', 'CTO']
        }
      ],
      team: [
        { id: 'dev4', name: 'Dr. James Park', role: 'Technical Lead', skills: ['Healthcare IT', 'Security'], availability: 100 }
      ],
      tasks: [
        { id: 'hc1', title: 'HIPAA Architecture', description: 'Design compliant system architecture', completed: false, priority: 'critical', estimatedHours: 200, tags: ['hipaa', 'security'] },
        { id: 'hc2', title: 'Telemedicine Integration', description: 'Video consultation platform', completed: false, priority: 'high', estimatedHours: 300, tags: ['telemedicine'] }
      ],
      dependencies: ['ecommerce-platform']
    },
    {
      id: 'ai-analytics-suite',
      title: 'AI Analytics Suite',
      description: 'Enterprise-grade business intelligence platform',
      type: 'client-project',
      status: 'planned',
      completion: 0,
      clientName: 'DataCorp Analytics',
      clientLogo: '/images/clients/datacorp-logo.png',
      projectValue: 950000,
      estimatedHours: 2800,
      actualHours: 0,
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-10-30'),
      priority: 'high',
      milestones: [],
      team: [],
      tasks: [
        { id: 'ai1', title: 'ML Pipeline Architecture', description: 'Design machine learning infrastructure', completed: false, priority: 'critical', estimatedHours: 250, tags: ['ml', 'infrastructure'] }
      ],
      dependencies: ['healthcare-portal']
    }
  ];
  
  // Add nodes with professional positioning
  clientProjects.forEach((project, index) => {
    const angle = (index / clientProjects.length) * 2 * Math.PI;
    const radius = 300;
    const centerX = 600;
    const centerY = 400;
    
    const node: GraphNode = {
      ...project,
      position: { 
        x: centerX + Math.cos(angle) * radius, 
        y: centerY + Math.sin(angle) * radius 
      },
      radius: getProjectRadius(project.projectValue || 0),
      color: getStatusColor(project.status || 'planned'),
      zIndex: project.status === 'in-progress' ? 3 : project.status === 'completed' ? 2 : 1,
      isSelected: false,
      isHovered: false,
      isAnimating: project.status === 'in-progress'
    } as GraphNode;
    
    graph.addNode(node);
  });
  
  // Add dependency edges
  clientProjects.forEach(project => {
    project.dependencies?.forEach(depId => {
      const edge: GraphEdge = {
        id: `${depId}-${project.id}`,
        fromNodeId: depId,
        toNodeId: project.id!,
        type: project.status === 'planned' ? 'future' : 'dependency',
        weight: 1,
        animated: project.status === 'in-progress',
        label: project.status === 'planned' ? 'Future Implementation' : undefined
      };
      graph.addEdge(edge);
    });
  });
  
  return graph;
}

function getProjectRadius(value: number): number {
  // Scale project node size based on project value
  const minRadius = 40;
  const maxRadius = 80;
  const minValue = 500000;
  const maxValue = 1500000;
  
  if (value <= minValue) return minRadius;
  if (value >= maxValue) return maxRadius;
  
  const ratio = (value - minValue) / (maxValue - minValue);
  return minRadius + (maxRadius - minRadius) * ratio;
}

// Factory function to create project-specific graphs
export function createProjectGraph(projectData: any): ProjectGraph {
  const graph = new ProjectGraph();
  
  // Sample implementation for e-commerce project
  const phases: Partial<GraphNode>[] = [
    {
      id: 'discovery',
      title: 'Discovery & Planning',
      type: 'phase',
      status: 'completed',
      completion: 100,
      estimatedHours: 80,
      actualHours: 75,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-02-01'),
      tasks: [
        { id: 't1', title: 'Requirements gathering', description: 'Analyze and document project requirements', completed: true, priority: 'high', estimatedHours: 20, tags: ['analysis'] },
        { id: 't2', title: 'User research', description: 'Conduct user interviews and surveys', completed: true, priority: 'high', estimatedHours: 30, tags: ['ux'] },
        { id: 't3', title: 'Technical architecture', description: 'Design system architecture and technology stack', completed: true, priority: 'critical', estimatedHours: 25, tags: ['architecture'] },
        { id: 't4', title: 'Project planning', description: 'Create project timeline and resource allocation', completed: true, priority: 'medium', estimatedHours: 5, tags: ['planning'] }
      ],
      dependencies: [],
      priority: 'critical'
    },
    {
      id: 'design',
      title: 'UI/UX Design',
      type: 'phase',
      status: 'completed',
      completion: 100,
      estimatedHours: 120,
      actualHours: 140,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-02-28'),
      tasks: [
        { id: 't5', title: 'Wireframes', description: 'Create low-fidelity wireframes for all pages', completed: true, priority: 'high', estimatedHours: 40, tags: ['wireframe'] },
        { id: 't6', title: 'UI Design', description: 'Design high-fidelity user interface mockups', completed: true, priority: 'high', estimatedHours: 50, tags: ['ui'] },
        { id: 't7', title: 'Prototyping', description: 'Build interactive prototypes for user testing', completed: true, priority: 'medium', estimatedHours: 30, tags: ['prototype'] }
      ],
      dependencies: ['discovery'],
      priority: 'high'
    },
    {
      id: 'frontend',
      title: 'Frontend Development',
      type: 'phase',
      status: 'in-progress',
      completion: 75,
      estimatedHours: 200,
      actualHours: 180,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-04-15'),
      tasks: [
        { id: 't8', title: 'Component library', description: 'Build reusable UI components for the application', completed: true, priority: 'critical', estimatedHours: 60, tags: ['components'] },
        { id: 't9', title: 'Product pages', description: 'Implement product listing and detail pages', completed: true, priority: 'high', estimatedHours: 80, tags: ['pages'] },
        { id: 't10', title: 'Shopping cart', description: 'Develop shopping cart functionality', completed: false, priority: 'critical', estimatedHours: 40, tags: ['cart'] },
        { id: 't11', title: 'Checkout flow', description: 'Implement secure checkout and payment processing', completed: false, priority: 'critical', estimatedHours: 20, tags: ['checkout'] }
      ],
      dependencies: ['design'],
      priority: 'critical'
    }
  ];
  
  // Add nodes to graph
  phases.forEach((phase, index) => {
    const node: GraphNode = {
      ...phase,
      position: { x: 200 + index * 300, y: 200 + Math.sin(index) * 100 },
      radius: 50,
      color: getStatusColor(phase.status || 'upcoming'),
      zIndex: 1,
      isSelected: false,
      isHovered: false,
      isAnimating: false
    } as GraphNode;
    
    graph.addNode(node);
  });
  
  // Add edges based on dependencies
  phases.forEach(phase => {
    phase.dependencies?.forEach(depId => {
      const edge: GraphEdge = {
        id: `${depId}-${phase.id}`,
        fromNodeId: depId,
        toNodeId: phase.id!,
        type: 'dependency',
        weight: 1,
        animated: true
      };
      graph.addEdge(edge);
    });
  });
  
  return graph;
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'completed': return '#10B981';
    case 'in-progress': return '#F59E0B';
    case 'blocked': return '#EF4444';
    case 'delayed': return '#F97316';
    default: return '#6B7280';
  }
}