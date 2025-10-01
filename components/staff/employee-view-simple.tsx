"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { database } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { useAuth } from "@/components/auth/auth-context";
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  User,
  Zap,
  Activity,
  AlertCircle,
  XCircle,
  Wifi,
  WifiOff,
} from "lucide-react";

interface TicketItem {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'review' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  timeSpent: number;
  tags: string[];
  project: string;
  department: string;
  adminNotes?: string;
  extraTimeReason?: string;
  extraTimeAdded?: number;
  ruralSituations?: {
    type: string;
    description: string;
    timeExtension: number;
    timestamp: string;
  }[];
}

export default function EmployeeView() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch tickets assigned to current user
  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const ticketsRef = ref(database, 'tickets');
    const unsubscribe = onValue(ticketsRef, (snapshot) => {
      if (snapshot.exists()) {
        const ticketsData = snapshot.val();
        const ticketsList = Object.entries(ticketsData)
          .map(([id, data]: [string, any]) => ({
            id,
            ...data
          }))
          .filter((ticket: TicketItem) => {
            // Check if ticket has assignedTo and assignedTo has id
            return ticket.assignedTo && 
                   ticket.assignedTo.id && 
                   ticket.assignedTo.id === user.uid;
          })
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        
        setTickets(ticketsList);
      } else {
        // Add sample data when Firebase is empty
        const sampleTickets: TicketItem[] = [
          {
            id: '1',
            title: 'Website Bug Fix',
            description: 'Fix responsive design issues on mobile devices',
            status: 'in-progress',
            priority: 'high',
            assignedTo: {
              id: user.uid,
              name: user.displayName || 'Employee',
              email: user.email || '',
              avatar: ''
            },
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
            estimatedHours: 8,
            actualHours: 0,
            timeSpent: 3,
            tags: ['frontend', 'css', 'responsive'],
            project: 'Company Website',
            department: 'Development'
          },
          {
            id: '2',
            title: 'Database Optimization',
            description: 'Optimize database queries for better performance',
            status: 'open',
            priority: 'medium',
            assignedTo: {
              id: user.uid,
              name: user.displayName || 'Employee',
              email: user.email || '',
              avatar: ''
            },
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
            estimatedHours: 12,
            actualHours: 0,
            timeSpent: 0,
            tags: ['backend', 'database', 'performance'],
            project: 'Internal Tools',
            department: 'Development'
          }
        ];
        setTickets(sampleTickets);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4 text-orange-400" />;
      case 'in-progress':
        return <Activity className="h-4 w-4 text-blue-400" />;
      case 'review':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'closed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return "bg-orange-900 text-orange-300 border-orange-600";
      case 'in-progress':
        return "bg-blue-900 text-blue-300 border-blue-600";
      case 'review':
        return "bg-yellow-900 text-yellow-300 border-yellow-600";
      case 'closed':
        return "bg-green-900 text-green-300 border-green-600";
      default:
        return "bg-gray-900 text-gray-300 border-gray-600";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Zap className="h-3 w-3" />;
      case 'high':
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return "bg-red-900 text-red-300 border-red-600";
      case 'high':
        return "bg-orange-900 text-orange-300 border-orange-600";
      case 'medium':
        return "bg-yellow-900 text-yellow-300 border-yellow-600";
      case 'low':
        return "bg-green-900 text-green-300 border-green-600";
      default:
        return "bg-gray-900 text-gray-300 border-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-gray-400">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.photoURL || ''} />
              <AvatarFallback className="bg-blue-600 text-white font-bold">
                {user?.displayName?.split(' ').map((n: string) => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Welcome, {user?.displayName || 'Employee'}!
              </h1>
              <p className="text-gray-400">Your assigned tasks and deadlines</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{currentTime.toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Section Separator */}
        <div className="border-t border-orange-500/20"></div>

        {/* Tasks Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="bg-gray-900/50 border-orange-700/50 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-300">
                {tickets.filter(t => t.status === 'open').length}
              </div>
              <div className="text-sm text-orange-400">Open Tasks</div>
            </div>
          </Card>
          <Card className="bg-gray-900/50 border-red-700/50 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-300">
                {tickets.filter(t => t.status === 'in-progress').length}
              </div>
              <div className="text-sm text-red-400">In Progress</div>
            </div>
          </Card>
          <Card className="bg-gray-900/50 border-yellow-700/50 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-300">
                {tickets.filter(t => t.status === 'review').length}
              </div>
              <div className="text-sm text-yellow-400">In Review</div>
            </div>
          </Card>
          <Card className="bg-gray-900/50 border-green-700/50 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-300">
                {tickets.filter(t => t.status === 'closed').length}
              </div>
              <div className="text-sm text-green-400">Completed</div>
            </div>
          </Card>
        </div>

        {/* Section Separator */}
        <div className="border-t border-orange-500/20"></div>

        {/* Task Cards */}
        <div className="space-y-4">
          {tickets.length === 0 ? (
            <Card className="bg-gray-900 border-gray-700 p-8 text-center">
              <div className="text-gray-400 space-y-2">
                <CheckCircle className="h-12 w-12 mx-auto text-orange-400" />
                <h3 className="text-lg font-medium text-white">No tasks assigned</h3>
                <p>You don't have any tasks assigned at the moment.</p>
              </div>
            </Card>
          ) : (
            tickets.map((ticket) => (
              <Card key={ticket.id} className="bg-gray-900 border-gray-700 hover:bg-gray-800 transition-all duration-200">
                <div className="p-4 sm:p-6">
                  <div className="space-y-4">
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <div className="flex items-center space-x-2 min-w-0 flex-1">
                            {getStatusIcon(ticket.status)}
                            <h3 className="text-lg font-semibold text-white truncate">
                              {ticket.title}
                            </h3>
                          </div>
                          <div className="flex flex-wrap gap-2 shrink-0">
                            <Badge className={getStatusColor(ticket.status)}>
                              {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).replace('-', ' ')}
                            </Badge>
                            <Badge className={getPriorityColor(ticket.priority)}>
                              <div className="flex items-center space-x-1">
                                {getPriorityIcon(ticket.priority)}
                                <span>{ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}</span>
                              </div>
                            </Badge>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm sm:text-base mb-3 line-clamp-2">
                          {ticket.description}
                        </p>
                      </div>
                    </div>

                    {/* Countdown Timer - Prominent Display */}
                    <div className="mb-4">
                      <CountdownTimer 
                        dueDate={ticket.dueDate}
                        priority={ticket.priority}
                        size="lg"
                        className="w-full"
                      />
                    </div>

                    {/* Admin Notes & Rural Situations */}
                    {(ticket.adminNotes || ticket.extraTimeReason || ticket.ruralSituations?.length) && (
                      <Card className="bg-gray-900/50 border-gray-600 p-3">
                        <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          Admin Notes
                        </h4>
                        
                        {ticket.adminNotes && (
                          <div className="text-sm text-gray-400 mb-2">
                            <strong>Note:</strong> {ticket.adminNotes}
                          </div>
                        )}
                        
                        {ticket.extraTimeReason && (
                          <div className="text-sm text-green-400 mb-2">
                            <strong>Extra Time Added:</strong> {ticket.extraTimeAdded} hours - {ticket.extraTimeReason}
                          </div>
                        )}
                        
                        {ticket.ruralSituations?.map((situation, index) => (
                          <div key={index} className="text-sm text-yellow-400 mb-1 flex items-center">
                            {situation.type === 'electricity' ? <WifiOff className="h-3 w-3 mr-2" /> : <Wifi className="h-3 w-3 mr-2" />}
                            <strong>{situation.type}:</strong> {situation.description} 
                            <span className="text-gray-400 ml-2">
                              (+{situation.timeExtension}h on {new Date(situation.timestamp).toLocaleDateString()})
                            </span>
                          </div>
                        ))}
                      </Card>
                    )}

                    {/* Task Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center text-gray-400">
                        <Calendar className="h-4 w-4 mr-2 shrink-0" />
                        <span>Due: {new Date(ticket.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <Clock className="h-4 w-4 mr-2 shrink-0" />
                        <span>Est: {ticket.estimatedHours}h</span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <Activity className="h-4 w-4 mr-2 shrink-0" />
                        <span>Project: {ticket.project}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {ticket.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {ticket.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs border-gray-600 text-gray-300"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

      </div>
    </div>
  );
}