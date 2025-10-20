"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Clock, 
  Target, 
  AlertCircle,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Code,
  X,
  MessageCircle,
  Download,
  FileText,
  GitBranch,
  BarChart3,
  Shield,
  Zap,
  Globe,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar as CalendarIcon,
  Clock as ClockIcon
} from "lucide-react";

interface Project {
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
  repository?: {
    url: string;
    branch: string;
    lastCommit: string;
  };
  roadmap?: {
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
      description?: string;
    }>;
    criticalPath?: string[];
    risks?: Array<{
      id: string;
      description: string;
      impact: string;
      probability: string;
      mitigation: string;
      owner: string;
    }>;
  };
  communications?: Array<{
    id: string;
    type: string;
    subject: string;
    date: string;
    participants?: string[];
    summary: string;
    actionItems?: Array<{
      item: string;
      assignee: string;
      dueDate: string;
      status: string;
    }>;
    from?: string;
    to?: string[];
    duration?: string;
    attachments?: string[];
  }>;
  documents?: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    version: string;
    uploadDate: string;
    uploadedBy: string;
  }>;
  metrics?: {
    codeQuality: {
      coverage: number;
      complexity: string;
      bugs: number;
      vulnerabilities: number;
    };
    performance: {
      responseTime: string;
      throughput: string;
      uptime: string;
    };
  };
}

interface ProjectDetailsModalProps {
  project: Project;
  onClose: () => void;
}

export function ProjectDetailsModal({ project, onClose }: ProjectDetailsModalProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'in-progress': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      case 'planning': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'not-started': return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'planning': return <Target className="w-4 h-4" />;
      case 'not-started': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (!project.roadmap?.phases || project.roadmap.phases.length === 0) {
      return 0;
    }

    const phases = project.roadmap.phases;
    const completedPhases = phases.filter(phase => phase.status === 'completed').length;
    const inProgressPhases = phases.filter(phase => phase.status === 'in-progress');
    
    let totalProgress = (completedPhases / phases.length) * 100;
    
    if (inProgressPhases.length > 0) {
      const inProgressContribution = inProgressPhases.reduce((acc, phase) => {
        return acc + (phase.progress || 0);
      }, 0) / phases.length;
      totalProgress += inProgressContribution;
    }

    return Math.min(Math.round(totalProgress), 100);
  };

  const overallProgress = calculateOverallProgress();
  const budgetSpentPercentage = (project.budget.spent / project.budget.total) * 100;
  const timeSpentPercentage = (project.timeline.spentHours / project.timeline.estimatedHours) * 100;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-3xl w-full max-w-7xl max-h-[95vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-white">{project.name}</h2>
                <Badge className={getStatusColor(project.status)}>
                  {getStatusIcon(project.status)}
                  <span className="ml-1 capitalize">{project.status.replace('-', ' ')}</span>
                </Badge>
                <Badge className={getPriorityColor(project.priority)}>
                  {project.priority} priority
                </Badge>
              </div>
              <p className="text-gray-400 text-lg max-w-3xl">{project.description}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Code className="w-4 h-4" />
                  <span>{project.type}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  <span>Project ID: {project.id}</span>
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Progress Overview */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Project Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Overall Progress */}
              <Card className="bg-gray-800/50 border-gray-700/50 p-4">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Overall Progress</span>
                  <span>{overallProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  {project.roadmap?.phases?.filter(p => p.status === 'completed').length || 0} of{' '}
                  {project.roadmap?.phases?.length || 0} phases complete
                </div>
              </Card>

              {/* Budget Progress */}
              <Card className="bg-gray-800/50 border-gray-700/50 p-4">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Budget Utilization</span>
                  <span>{budgetSpentPercentage.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(budgetSpentPercentage, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  {formatCurrency(project.budget.spent, project.budget.currency)} of{' '}
                  {formatCurrency(project.budget.total, project.budget.currency)} spent
                </div>
              </Card>

              {/* Time Progress */}
              <Card className="bg-gray-800/50 border-gray-700/50 p-4">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Time Utilization</span>
                  <span>{timeSpentPercentage.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(timeSpentPercentage, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  {project.timeline.spentHours}h of {project.timeline.estimatedHours}h spent
                </div>
              </Card>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Left Column - Project Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Timeline */}
              <Card className="bg-gray-800/50 border-gray-700/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <CalendarIcon className="w-5 h-5 text-blue-400 mr-2" />
                  Timeline & Milestones
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Start Date:</span>
                      <span className="text-white">{formatDate(project.timeline.startDate)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Expected End:</span>
                      <span className="text-white">{formatDate(project.timeline.expectedEndDate)}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Estimated Hours:</span>
                      <span className="text-white">{project.timeline.estimatedHours}h</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Spent Hours:</span>
                      <span className="text-white">{project.timeline.spentHours}h</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Project Phases */}
              {project.roadmap?.phases && project.roadmap.phases.length > 0 && (
                <Card className="bg-gray-800/50 border-gray-700/50 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <GitBranch className="w-5 h-5 text-emerald-400 mr-2" />
                    Project Phases
                  </h3>
                  <div className="space-y-4">
                    {project.roadmap.phases.map((phase, index) => (
                      <div key={phase.id} className="border-l-2 border-gray-600 pl-4 pb-4 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-white">{phase.name}</h4>
                            <p className="text-sm text-gray-400">{phase.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {phase.progress !== undefined && phase.status === 'in-progress' && (
                              <span className="text-xs text-gray-400">{phase.progress}%</span>
                            )}
                            <Badge className={getStatusColor(phase.status)} variant="outline">
                              {getStatusIcon(phase.status)}
                              <span className="ml-1 capitalize">{phase.status.replace('-', ' ')}</span>
                            </Badge>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
                        </div>
                        {phase.deliverables && phase.deliverables.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-400 mb-1">Deliverables:</p>
                            <ul className="text-xs text-gray-500 space-y-1">
                              {phase.deliverables.map((deliverable, idx) => (
                                <li key={idx} className="flex items-center gap-1">
                                  <div className="w-1 h-1 bg-gray-500 rounded-full" />
                                  {deliverable}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {phase.progress !== undefined && phase.status === 'in-progress' && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-700 rounded-full h-1">
                              <div 
                                className="bg-amber-500 h-1 rounded-full transition-all duration-500"
                                style={{ width: `${phase.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Communications */}
              {project.communications && project.communications.length > 0 && (
                <Card className="bg-gray-800/50 border-gray-700/50 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <MessageCircle className="w-5 h-5 text-blue-400 mr-2" />
                    Recent Communications
                  </h3>
                  <div className="space-y-4">
                    {project.communications.slice(0, 3).map((comm) => (
                      <div key={comm.id} className="border-b border-gray-700/50 pb-4 last:border-b-0 last:pb-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-white text-sm">{comm.subject}</h4>
                            <p className="text-xs text-gray-400 capitalize">{comm.type}</p>
                          </div>
                          <span className="text-xs text-gray-500">{formatDateTime(comm.date)}</span>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{comm.summary}</p>
                        {comm.actionItems && comm.actionItems.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-400 mb-1">Action Items:</p>
                            {comm.actionItems.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-xs">
                                <span className="text-gray-500">{item.item}</span>
                                <Badge 
                                  className={getStatusColor(item.status)} 
                                  variant="outline"
                                >
                                  {item.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Right Column - Stats & Info */}
            <div className="space-y-6">
              {/* Budget Breakdown */}
              <Card className="bg-gray-800/50 border-gray-700/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 text-green-400 mr-2" />
                  Budget Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Budget:</span>
                    <span className="text-white font-medium">{formatCurrency(project.budget.total, project.budget.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount Spent:</span>
                    <span className="text-red-400">{formatCurrency(project.budget.spent, project.budget.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Remaining:</span>
                    <span className="text-emerald-400">{formatCurrency(project.budget.remaining, project.budget.currency)}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-700/50">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Budget Utilization:</span>
                      <span className="text-white">{budgetSpentPercentage.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Team Members */}
              <Card className="bg-gray-800/50 border-gray-700/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Users className="w-5 h-5 text-purple-400 mr-2" />
                  Team
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-400">Project Manager</div>
                    <div className="text-white font-medium">{project.team.projectManager}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Lead Developer</div>
                    <div className="text-white font-medium">{project.team.leadDeveloper}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Team Size</div>
                    <div className="text-white font-medium">{project.team.members.length} members</div>
                  </div>
                </div>
              </Card>

              {/* Technologies */}
              <Card className="bg-gray-800/50 border-gray-700/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Code className="w-5 h-5 text-blue-400 mr-2" />
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <Badge key={index} className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Repository Info */}
              {project.repository && (
                <Card className="bg-gray-800/50 border-gray-700/50 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <GitBranch className="w-5 h-5 text-orange-400 mr-2" />
                    Repository
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-400">Repository</div>
                      <div className="text-blue-400 text-sm hover:underline cursor-pointer flex items-center gap-1">
                        {project.repository.url}
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Branch</div>
                      <div className="text-white">{project.repository.branch}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Last Commit</div>
                      <div className="text-white text-sm">{formatDateTime(project.repository.lastCommit)}</div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Code Quality Metrics */}
              {project.metrics && (
                <Card className="bg-gray-800/50 border-gray-700/50 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 text-emerald-400 mr-2" />
                    Metrics
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Code Quality</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-400">Coverage:</span>
                          <span className="text-white ml-1">{project.metrics.codeQuality.coverage}%</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Bugs:</span>
                          <span className="text-white ml-1">{project.metrics.codeQuality.bugs}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Complexity:</span>
                          <span className="text-white ml-1 capitalize">{project.metrics.codeQuality.complexity}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Vulnerabilities:</span>
                          <span className="text-white ml-1">{project.metrics.codeQuality.vulnerabilities}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Performance</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Response Time:</span>
                          <span className="text-white">{project.metrics.performance.responseTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Throughput:</span>
                          <span className="text-white">{project.metrics.performance.throughput}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Uptime:</span>
                          <span className="text-emerald-400">{project.metrics.performance.uptime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-700/50">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Team
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              <FileText className="w-4 h-4 mr-2" />
              View Documents
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 ml-auto"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}