import { database } from './firebase';
import { ref, get, set, push, remove, update, onValue, off } from 'firebase/database';

// Interface for client projects in Firebase (matching the screenshot structure)
export interface FirebaseClientProject {
  id: string;
  email: string;
  name: string;
  description: string;
  budget: number;
  dueDate: string;
  nextMilestone: string;
  progress: number;
  technologies?: string[];
  teamMembers?: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  roadmap?: Array<{
    id: string;
    title: string;
    description: string;
    status: string;
    category: string;
    color: string;
    position: { x: number; y: number };
    priority: string;
    duration: string;
    radius: number;
    dependencies: string[];
    tasks: any[];
  }>;
  startDate?: string;
  status?: string;
}

// Interface for the enhanced Firebase structure (projects collection)
export interface EnhancedFirebaseProject {
  id: string;
  clientId: string;
  name: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  budget: {
    total: number;
    spent: number;
    remaining: number;
    currency: string;
  };
  timeline: {
    startDate: string;
    expectedEndDate: string;
    actualEndDate?: string;
    estimatedHours: number;
    spentHours: number;
  };
  team: {
    projectManager: string;
    leadDeveloper: string;
    members: string[];
  };
  technologies: string[];
  roadmap: {
    phases: Array<{
      id: string;
      name: string;
      description: string;
      status: string;
      startDate: string;
      endDate: string;
      progress?: number;
      deliverables: string[];
      milestones: Array<{
        id: string;
        name: string;
        description: string;
        dueDate: string;
        status: string;
        completedDate?: string;
        progress?: number;
      }>;
    }>;
    dependencies: Array<{
      from: string;
      to: string;
      type: string;
    }>;
  };
}

/**
 * Fetch client projects specifically for the client dashboard
 * This will try both data structures and transform them accordingly
 */
export async function fetchClientProjectsForDashboard(userEmail: string): Promise<FirebaseClientProject[]> {
  try {
    // First, try to get from clientProjects collection (direct email-based structure)
    const clientProjectsRef = ref(database, 'clientProjects');
    const clientProjectsSnapshot = await get(clientProjectsRef);
    
    if (clientProjectsSnapshot.exists()) {
      const clientProjects = clientProjectsSnapshot.val();
      
      // Filter projects by user email and return as array
      if (Array.isArray(clientProjects)) {
        const userProjects = clientProjects
          .filter((project: any) => project && project.email === userEmail)
          .map((project: any, index: number) => ({
            id: project.id || `project-${index}`,
            email: project.email,
            name: project.name,
            description: project.description,
            budget: project.budget || 0,
            dueDate: project.dueDate,
            nextMilestone: project.nextMilestone,
            progress: project.progress || 0,
            technologies: project.technologies || [],
            teamMembers: project.teamMembers || [],
            roadmap: project.roadmap || [],
            startDate: project.startDate,
            status: project.status || getStatusFromProgress(project.progress || 0)
          }));
        
        if (userProjects.length > 0) {
          return userProjects;
        }
      }
      
      // Try object structure with email-based keys
      if (clientProjects[userEmail]) {
        const emailProjects = Array.isArray(clientProjects[userEmail]) 
          ? clientProjects[userEmail] 
          : [clientProjects[userEmail]];
          
        return emailProjects.map((project: any, index: number) => ({
          id: project.id || `project-${index}`,
          email: userEmail,
          name: project.name,
          description: project.description,
          budget: project.budget || 0,
          dueDate: project.dueDate,
          nextMilestone: project.nextMilestone,
          progress: project.progress || 0,
          technologies: project.technologies || [],
          teamMembers: project.teamMembers || [],
          roadmap: project.roadmap || [],
          startDate: project.startDate,
          status: project.status || getStatusFromProgress(project.progress || 0)
        }));
      }
    }

    // If clientProjects doesn't exist or is empty, try to fetch from projects collection
    const projectsRef = ref(database, 'projects');
    const projectsSnapshot = await get(projectsRef);
    
    if (projectsSnapshot.exists()) {
      const projects = projectsSnapshot.val();
      
      // Get client info to match email
      const clientsRef = ref(database, 'clients');
      const clientsSnapshot = await get(clientsRef);
      let clientId: string | null = null;
      
      if (clientsSnapshot.exists()) {
        const clients = clientsSnapshot.val();
        // Find client by email
        for (const [id, client] of Object.entries(clients as Record<string, any>)) {
          if (client.email === userEmail) {
            clientId = id;
            break;
          }
        }
      }

      if (clientId) {
        // Transform enhanced projects to client dashboard format
        const clientProjects: FirebaseClientProject[] = [];
        
        for (const [projectId, project] of Object.entries(projects as Record<string, EnhancedFirebaseProject>)) {
          if (project.clientId === clientId) {
            const transformedProject: FirebaseClientProject = {
              id: projectId,
              email: userEmail,
              name: project.name,
              description: project.description,
              budget: project.budget?.total || 0,
              dueDate: project.timeline?.expectedEndDate || new Date().toISOString().split('T')[0],
              nextMilestone: getNextMilestone(project),
              progress: calculateProjectProgress(project),
              technologies: project.technologies || [],
              teamMembers: [], // Will be populated from staff data if needed
              roadmap: transformRoadmap(project.roadmap),
              startDate: project.timeline?.startDate,
              status: project.status
            };
            clientProjects.push(transformedProject);
          }
        }
        
        return clientProjects;
      }
    }

    return [];
  } catch (error) {
    console.error('Error fetching client projects:', error);
    throw error;
  }
}

/**
 * Get next milestone from enhanced project structure
 */
function getNextMilestone(project: EnhancedFirebaseProject): string {
  if (!project.roadmap?.phases) return 'Project Completed';
  
  // Find the first incomplete milestone
  for (const phase of project.roadmap.phases) {
    if (phase.status !== 'completed') {
      if (phase.milestones && phase.milestones.length > 0) {
        const nextMilestone = phase.milestones.find(m => m.status !== 'completed');
        if (nextMilestone) {
          return nextMilestone.name;
        }
      }
      return phase.name;
    }
  }
  
  return 'Project Completed';
}

/**
 * Calculate overall project progress from phases
 */
function calculateProjectProgress(project: EnhancedFirebaseProject): number {
  if (!project.roadmap?.phases || project.roadmap.phases.length === 0) return 0;
  
  let totalProgress = 0;
  let phaseCount = 0;
  
  for (const phase of project.roadmap.phases) {
    if (phase.status === 'completed') {
      totalProgress += 100;
    } else if (phase.status === 'in-progress' && phase.progress) {
      totalProgress += phase.progress;
    }
    phaseCount++;
  }
  
  return phaseCount > 0 ? Math.round(totalProgress / phaseCount) : 0;
}

/**
 * Transform enhanced roadmap to simple roadmap format for client dashboard
 */
function transformRoadmap(roadmap: EnhancedFirebaseProject['roadmap']): FirebaseClientProject['roadmap'] {
  if (!roadmap?.phases) return [];
  
  return roadmap.phases.map((phase, index) => ({
    id: phase.id,
    title: phase.name,
    description: phase.description,
    status: phase.status,
    category: 'development', // Default category
    color: getPhaseColor(phase.status, index),
    position: { x: 200 + (index * 200), y: 150 }, // Simple positioning
    priority: 'high', // Default priority
    duration: calculatePhaseDuration(phase.startDate, phase.endDate),
    radius: 40,
    dependencies: [], // Default empty dependencies
    tasks: phase.milestones?.map((milestone, mIndex) => ({
      id: milestone.id,
      title: milestone.name,
      completed: milestone.status === 'completed'
    })) || []
  }));
}

/**
 * Get color for phase based on status
 */
function getPhaseColor(status: string, index: number): string {
  const colors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];
  
  switch (status) {
    case 'completed': return '#10B981';
    case 'in-progress': return '#06B6D4';
    case 'not-started': return '#6B7280';
    default: return colors[index % colors.length];
  }
}

/**
 * Calculate phase duration
 */
function calculatePhaseDuration(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 7) return `${diffDays} days`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks`;
  return `${Math.ceil(diffDays / 30)} months`;
}

/**
 * Get status from progress percentage
 */
function getStatusFromProgress(progress: number): string {
  if (progress === 100) return 'completed';
  if (progress > 0) return 'in-progress';
  return 'planning';
}

/**
 * Create email-based project structure for simpler queries
 */
export async function createEmailBasedProject(userEmail: string, projectData: Omit<FirebaseClientProject, 'id' | 'email'>): Promise<string> {
  try {
    const clientProjectsRef = ref(database, 'clientProjects');
    const snapshot = await get(clientProjectsRef);
    
    let currentProjects: any = {};
    if (snapshot.exists()) {
      currentProjects = snapshot.val();
    }
    
    const newProject: FirebaseClientProject = {
      ...projectData,
      id: `project-${Date.now()}`,
      email: userEmail,
      status: getStatusFromProgress(projectData.progress || 0),
      technologies: projectData.technologies || [],
      teamMembers: projectData.teamMembers || [],
      roadmap: projectData.roadmap || []
    };
    
    // Create email-based structure
    if (!currentProjects[userEmail]) {
      currentProjects[userEmail] = [];
    }
    
    if (Array.isArray(currentProjects[userEmail])) {
      currentProjects[userEmail].push(newProject);
    } else {
      currentProjects[userEmail] = [currentProjects[userEmail], newProject];
    }
    
    await set(clientProjectsRef, currentProjects);

    
    return newProject.id;
  } catch (error) {
    console.error('Error creating email-based project:', error);
    throw error;
  }
}

/**
 * Create a new client project in Firebase
 */
export async function createClientProject(projectData: Omit<FirebaseClientProject, 'id'>): Promise<string> {
  try {
    const clientProjectsRef = ref(database, 'clientProjects');
    const snapshot = await get(clientProjectsRef);
    
    let currentProjects: FirebaseClientProject[] = [];
    if (snapshot.exists()) {
      const data = snapshot.val();
      currentProjects = Array.isArray(data) ? data : [];
    }
    
    const newProject: FirebaseClientProject = {
      ...projectData,
      id: `project-${Date.now()}`,
      status: getStatusFromProgress(projectData.progress),
      technologies: projectData.technologies || [],
      teamMembers: projectData.teamMembers || [],
      roadmap: projectData.roadmap || []
    };
    
    currentProjects.push(newProject);
    await set(clientProjectsRef, currentProjects);
    
    return newProject.id;
  } catch (error) {
    console.error('Error creating client project:', error);
    throw error;
  }
}

/**
 * Submit a new project request from client (pending approval)
 */
export async function submitClientProjectRequest(projectData: {
  name: string;
  description: string;
  timeline?: string;
  budget?: string;
  requirements?: string;
  clientEmail: string;
  clientName?: string;
}): Promise<string> {
  try {
    const clientProjectsRef = ref(database, 'clientProjects');
    const snapshot = await get(clientProjectsRef);
    
    let currentProjects: FirebaseClientProject[] = [];
    if (snapshot.exists()) {
      const data = snapshot.val();
      currentProjects = Array.isArray(data) ? data : [];
    }
    
    const newProjectRequest: FirebaseClientProject = {
      id: `request-${Date.now()}`,
      email: projectData.clientEmail,
      name: projectData.name,
      description: projectData.description,
      budget: projectData.budget ? parseFloat(projectData.budget) || 0 : 0,
      dueDate: '', // Will be set when approved
      nextMilestone: 'Pending Admin Approval',
      progress: 0,
      status: 'pending-approval', // Special status for client requests
      technologies: [],
      teamMembers: [],
      roadmap: []
    };
    
    currentProjects.push(newProjectRequest);
    await set(clientProjectsRef, currentProjects);
    
    return newProjectRequest.id;
  } catch (error) {
    console.error('Error submitting client project request:', error);
    throw error;
  }
}

/**
 * Update client project
 */
export async function updateClientProject(projectId: string, updates: Partial<FirebaseClientProject>): Promise<void> {
  try {
    const clientProjectsRef = ref(database, 'clientProjects');
    const snapshot = await get(clientProjectsRef);
    
    if (snapshot.exists()) {
      const projects = snapshot.val();
      if (Array.isArray(projects)) {
        const projectIndex = projects.findIndex((p: FirebaseClientProject) => p.id === projectId);
        if (projectIndex !== -1) {
          projects[projectIndex] = { ...projects[projectIndex], ...updates };
          await set(clientProjectsRef, projects);
        }
      }
    }
  } catch (error) {
    console.error('Error updating client project:', error);
    throw error;
  }
}

/**
 * Delete client project
 */
export async function deleteClientProject(projectId: string): Promise<void> {
  try {
    const clientProjectsRef = ref(database, 'clientProjects');
    const snapshot = await get(clientProjectsRef);
    
    if (snapshot.exists()) {
      const projects = snapshot.val();
      if (Array.isArray(projects)) {
        const filteredProjects = projects.filter((p: FirebaseClientProject) => p.id !== projectId);
        await set(clientProjectsRef, filteredProjects);
      }
    }
  } catch (error) {
    console.error('Error deleting client project:', error);
    throw error;
  }
}

/**
 * Migrate client ID-based projects to email-based structure
 */
export async function migrateToEmailBasedStructure(): Promise<void> {
  try {

    
    // Get current projects and clients
    const projectsRef = ref(database, 'projects');
    const clientsRef = ref(database, 'clients');
    
    const [projectsSnapshot, clientsSnapshot] = await Promise.all([
      get(projectsRef),
      get(clientsRef)
    ]);
    
    if (!projectsSnapshot.exists() || !clientsSnapshot.exists()) {

      return;
    }
    
    const projects = projectsSnapshot.val();
    const clients = clientsSnapshot.val();
    
    // Create email-to-clientId mapping
    const emailToClientId: Record<string, string> = {};
    Object.entries(clients).forEach(([clientId, client]: [string, any]) => {
      emailToClientId[client.email] = clientId;
    });
    
    // Group projects by email
    const projectsByEmail: Record<string, FirebaseClientProject[]> = {};
    
    Object.entries(projects).forEach(([projectId, project]: [string, any]) => {
      const clientEntry = Object.entries(clients).find(([id, client]: [string, any]) => 
        id === project.clientId
      );
      const clientEmail = clientEntry ? (clientEntry[1] as any).email : null;
      
      if (clientEmail) {
        if (!projectsByEmail[clientEmail]) {
          projectsByEmail[clientEmail] = [];
        }
        
        const transformedProject: FirebaseClientProject = {
          id: projectId,
          email: clientEmail,
          name: project.name,
          description: project.description,
          budget: project.budget?.total || 0,
          dueDate: project.timeline?.expectedEndDate || new Date().toISOString().split('T')[0],
          nextMilestone: getNextMilestone(project),
          progress: calculateProjectProgress(project),
          technologies: project.technologies || [],
          teamMembers: [],
          roadmap: transformRoadmap(project.roadmap),
          startDate: project.timeline?.startDate,
          status: project.status
        };
        
        projectsByEmail[clientEmail].push(transformedProject);
      }
    });
    
    // Save email-based structure
    const clientProjectsRef = ref(database, 'clientProjects');
    await set(clientProjectsRef, projectsByEmail);
    

    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

/**
 * Fetch all pending approval projects for admin review
 */
export async function fetchPendingApprovalProjects(): Promise<FirebaseClientProject[]> {
  try {
    const clientProjectsRef = ref(database, 'clientProjects');
    const snapshot = await get(clientProjectsRef);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const data = snapshot.val();
    const allProjects: FirebaseClientProject[] = Array.isArray(data) ? data : [];
    
    // Filter only pending approval projects
    const pendingProjects = allProjects.filter(project => 
      project.status === 'pending-approval'
    );
    
    // Sort by submission date (most recent first)
    return pendingProjects.sort((a, b) => {
      const dateA = new Date(a.id.split('-')[1] || 0).getTime();
      const dateB = new Date(b.id.split('-')[1] || 0).getTime();
      return dateB - dateA;
    });
    
  } catch (error) {
    console.error('Error fetching pending approval projects:', error);
    throw error;
  }
}

/**
 * Approve a pending project and move it to active client projects
 */
export async function approveProject(projectId: string): Promise<void> {
  try {
    const clientProjectsRef = ref(database, 'clientProjects');
    const snapshot = await get(clientProjectsRef);
    
    if (!snapshot.exists()) {
      throw new Error('No projects found');
    }
    
    const data = snapshot.val();
    const allProjects: FirebaseClientProject[] = Array.isArray(data) ? data : [];
    
    // Find the project to approve
    const projectIndex = allProjects.findIndex(project => project.id === projectId);
    
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }
    
    // Update the project status and add necessary fields for approved project
    allProjects[projectIndex] = {
      ...allProjects[projectIndex],
      status: 'planning', // Set to planning status when approved
      startDate: new Date().toISOString().split('T')[0], // Set start date to today
      dueDate: allProjects[projectIndex].dueDate || calculateDefaultDueDate(), // Set due date if not already set
      nextMilestone: 'Project Planning & Setup', // Set initial milestone
      progress: 5, // Set initial progress
      id: `project-${Date.now()}`, // Generate new ID for approved project
      roadmap: createDefaultRoadmap() // Add proper roadmap structure with phases and dependencies
    };
    
    // Save the updated projects array
    await set(clientProjectsRef, allProjects);
    
    console.log(`Project ${projectId} approved successfully`);
    
  } catch (error) {
    console.error('Error approving project:', error);
    throw error;
  }
}

/**
 * Reject a pending project (removes it from the system)
 */
export async function rejectProject(projectId: string): Promise<void> {
  try {
    const clientProjectsRef = ref(database, 'clientProjects');
    const snapshot = await get(clientProjectsRef);
    
    if (!snapshot.exists()) {
      throw new Error('No projects found');
    }
    
    const data = snapshot.val();
    const allProjects: FirebaseClientProject[] = Array.isArray(data) ? data : [];
    
    // Remove the project from the array
    const filteredProjects = allProjects.filter(project => project.id !== projectId);
    
    // Save the updated projects array
    await set(clientProjectsRef, filteredProjects);
    
    console.log(`Project ${projectId} rejected and removed`);
    
  } catch (error) {
    console.error('Error rejecting project:', error);
    throw error;
  }
}

/**
 * Calculate a default due date (3 months from now)
 */
function calculateDefaultDueDate(): string {
  const date = new Date();
  date.setMonth(date.getMonth() + 3);
  return date.toISOString().split('T')[0];
}

/**
 * Create a default roadmap structure for newly approved projects
 */
function createDefaultRoadmap(): FirebaseClientProject['roadmap'] {
  return [
    {
      id: 'planning',
      title: 'Project Planning & Setup',
      description: 'Initial project setup, requirements gathering, and planning phase',
      status: 'in-progress',
      category: 'planning',
      color: '#f59e0b',
      position: { x: 150, y: 200 },
      priority: 'high',
      duration: '1-2 weeks',
      radius: 50,
      dependencies: [], // No dependencies for first phase
      tasks: [
        {
          id: 'task-1',
          title: 'Requirements Analysis',
          description: 'Gather and analyze project requirements',
          completed: false,
          priority: 'high',
          estimatedHours: 20,
          tags: ['planning', 'requirements']
        },
        {
          id: 'task-2',
          title: 'Project Scope Definition',
          description: 'Define clear project scope and deliverables',
          completed: false,
          priority: 'high',
          estimatedHours: 15,
          tags: ['planning', 'scope']
        }
      ]
    },
    {
      id: 'design',
      title: 'Design & Architecture',
      description: 'System design, UI/UX design, and technical architecture',
      status: 'upcoming',
      category: 'design',
      color: '#8b5cf6',
      position: { x: 350, y: 200 },
      priority: 'high',
      duration: '2-3 weeks',
      radius: 50,
      dependencies: ['planning'], // Depends on planning phase
      tasks: [
        {
          id: 'task-3',
          title: 'System Architecture',
          description: 'Design system architecture and data flow',
          completed: false,
          priority: 'high',
          estimatedHours: 25,
          tags: ['design', 'architecture']
        },
        {
          id: 'task-4',
          title: 'UI/UX Design',
          description: 'Create user interface and experience designs',
          completed: false,
          priority: 'medium',
          estimatedHours: 30,
          tags: ['design', 'ui', 'ux']
        }
      ]
    },
    {
      id: 'development',
      title: 'Development',
      description: 'Core development and implementation phase',
      status: 'upcoming',
      category: 'development',
      color: '#06b6d4',
      position: { x: 550, y: 200 },
      priority: 'high',
      duration: '4-6 weeks',
      radius: 50,
      dependencies: ['design'], // Depends on design phase
      tasks: [
        {
          id: 'task-5',
          title: 'Frontend Development',
          description: 'Develop user interface and client-side functionality',
          completed: false,
          priority: 'high',
          estimatedHours: 80,
          tags: ['development', 'frontend']
        },
        {
          id: 'task-6',
          title: 'Backend Development',
          description: 'Develop server-side logic and APIs',
          completed: false,
          priority: 'high',
          estimatedHours: 60,
          tags: ['development', 'backend']
        }
      ]
    },
    {
      id: 'testing',
      title: 'Testing & QA',
      description: 'Comprehensive testing and quality assurance',
      status: 'upcoming',
      category: 'testing',
      color: '#10b981',
      position: { x: 750, y: 200 },
      priority: 'high',
      duration: '1-2 weeks',
      radius: 50,
      dependencies: ['development'], // Depends on development phase
      tasks: [
        {
          id: 'task-7',
          title: 'Unit Testing',
          description: 'Write and execute unit tests',
          completed: false,
          priority: 'high',
          estimatedHours: 25,
          tags: ['testing', 'unit-tests']
        },
        {
          id: 'task-8',
          title: 'Integration Testing',
          description: 'Test system integration and workflows',
          completed: false,
          priority: 'medium',
          estimatedHours: 20,
          tags: ['testing', 'integration']
        }
      ]
    },
    {
      id: 'deployment',
      title: 'Deployment & Launch',
      description: 'Production deployment and go-live activities',
      status: 'upcoming',
      category: 'deployment',
      color: '#ef4444',
      position: { x: 950, y: 200 },
      priority: 'critical',
      duration: '1 week',
      radius: 50,
      dependencies: ['testing'], // Depends on testing phase
      tasks: [
        {
          id: 'task-9',
          title: 'Production Setup',
          description: 'Configure production environment',
          completed: false,
          priority: 'critical',
          estimatedHours: 15,
          tags: ['deployment', 'production']
        },
        {
          id: 'task-10',
          title: 'Go-Live',
          description: 'Deploy to production and monitor launch',
          completed: false,
          priority: 'critical',
          estimatedHours: 10,
          tags: ['deployment', 'launch']
        }
      ]
    }
  ];
}