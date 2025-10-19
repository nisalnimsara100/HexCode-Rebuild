"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FirebaseDataManager } from "@/lib/firebase-data-manager-enhanced";
import { 
  CheckCircle, 
  AlertCircle, 
  Database, 
  Users, 
  FolderOpen, 
  MessageSquare, 
  DollarSign,
  Calendar,
  BarChart3,
  Upload,
  Eye,
  Loader2
} from "lucide-react";

export default function FirebaseTestPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [clientData, setClientData] = useState<any>(null);
  const [selectedClientId, setSelectedClientId] = useState("client_001");

  const initializeDatabase = async () => {
    setLoading(true);
    setStatus({ type: 'info', message: 'Initializing Firebase database with enhanced structure...' });
    
    try {
      await FirebaseDataManager.initializeWithSampleData();
      setStatus({ type: 'success', message: 'Database initialized successfully with comprehensive project management data!' });
    } catch (error: any) {
      setStatus({ type: 'error', message: `Failed to initialize database: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const testFirebaseOperations = async () => {
    setLoading(true);
    setStatus({ type: 'info', message: 'Testing Firebase operations...' });
    const results: any[] = [];

    try {
      // Test 1: Get client profile
      const clientProfile = await FirebaseDataManager.getClientProfile(selectedClientId);
      results.push({
        test: 'Get Client Profile',
        status: clientProfile ? 'success' : 'error',
        data: clientProfile,
        message: clientProfile ? `Found client: ${clientProfile.name}` : 'Client not found'
      });

      // Test 2: Get client projects
      const projects = await FirebaseDataManager.getClientProjects(selectedClientId);
      results.push({
        test: 'Get Client Projects',
        status: projects.length > 0 ? 'success' : 'error',
        data: projects,
        message: `Found ${projects.length} projects`
      });

      // Test 3: Get project details with roadmap
      if (projects.length > 0) {
        const projectDetails = await FirebaseDataManager.getProjectDetails(projects[0].id);
        results.push({
          test: 'Get Project Details',
          status: projectDetails ? 'success' : 'error',
          data: projectDetails,
          message: projectDetails ? `Project: ${projectDetails.name}` : 'Project details not found'
        });

        // Test 4: Get project roadmap
        const roadmap = await FirebaseDataManager.getProjectRoadmap(projects[0].id);
        results.push({
          test: 'Get Project Roadmap',
          status: roadmap?.phases ? 'success' : 'error',
          data: roadmap,
          message: roadmap?.phases ? `Found ${roadmap.phases.length} phases` : 'No roadmap found'
        });

        // Test 5: Get project tasks
        const tasks = await FirebaseDataManager.getProjectTasks(projects[0].id);
        results.push({
          test: 'Get Project Tasks',
          status: 'success',
          data: tasks,
          message: `Found ${tasks.length} tasks`
        });

        // Test 6: Get project financials
        const financials = await FirebaseDataManager.getProjectFinancials(projects[0].id);
        results.push({
          test: 'Get Project Financials',
          status: financials ? 'success' : 'info',
          data: financials,
          message: financials ? `Budget: $${financials.budget.total.toLocaleString()}` : 'No financial data'
        });
      }

      // Test 7: Get client notifications
      const notifications = await FirebaseDataManager.getClientNotifications(selectedClientId);
      results.push({
        test: 'Get Client Notifications',
        status: 'success',
        data: notifications,
        message: `Found ${notifications?.length || 0} notifications`
      });

      // Test 8: Get complete dashboard data
      const dashboardData = await FirebaseDataManager.getClientDashboardData(selectedClientId);
      results.push({
        test: 'Get Complete Dashboard Data',
        status: dashboardData ? 'success' : 'error',
        data: dashboardData,
        message: dashboardData ? 'Dashboard data loaded successfully' : 'Failed to load dashboard data'
      });

      setTestResults(results);
      setClientData(dashboardData);
      setStatus({ type: 'success', message: 'All Firebase operations tested successfully!' });

    } catch (error: any) {
      setStatus({ type: 'error', message: `Firebase operations failed: ${error.message}` });
      results.push({
        test: 'Firebase Operations',
        status: 'error',
        data: null,
        message: error.message
      });
      setTestResults(results);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Firebase Enhanced Structure Test
          </h1>
          <p className="text-gray-400 text-lg">
            Test and validate the comprehensive Firebase database structure for client project management
          </p>
        </div>

        {/* Controls */}
        <Card className="bg-gray-800/50 border-gray-700 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Client ID</label>
              <Input
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                placeholder="client_001"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={initializeDatabase}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                Initialize Database
              </Button>
              <Button
                onClick={testFirebaseOperations}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Database className="w-4 h-4 mr-2" />}
                Test Operations
              </Button>
            </div>
          </div>
        </Card>

        {/* Status Alert */}
        {status && (
          <Alert className={`mb-6 ${
            status.type === 'success' ? 'bg-emerald-900/50 border-emerald-500' :
            status.type === 'error' ? 'bg-red-900/50 border-red-500' :
            'bg-blue-900/50 border-blue-500'
          }`}>
            {status.type === 'success' ? <CheckCircle className="h-4 w-4" /> :
             status.type === 'error' ? <AlertCircle className="h-4 w-4" /> :
             <Database className="h-4 w-4" />}
            <AlertDescription className="text-white">{status.message}</AlertDescription>
          </Alert>
        )}

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-gray-800/50 border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-emerald-400" />
                Test Results
              </h2>
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center">
                      {result.status === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 mr-2" />
                      ) : result.status === 'error' ? (
                        <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-blue-400 mr-2" />
                      )}
                      <div>
                        <p className="text-white font-medium">{result.test}</p>
                        <p className="text-gray-400 text-sm">{result.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Client Dashboard Summary */}
            {clientData && (
              <Card className="bg-gray-800/50 border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-400" />
                  Dashboard Summary
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700/50 p-3 rounded-lg">
                      <p className="text-gray-400 text-sm">Total Projects</p>
                      <p className="text-white text-2xl font-bold">{clientData.projects?.length || 0}</p>
                    </div>
                    <div className="bg-gray-700/50 p-3 rounded-lg">
                      <p className="text-gray-400 text-sm">Active Projects</p>
                      <p className="text-emerald-400 text-2xl font-bold">{clientData.activeProjects || 0}</p>
                    </div>
                    <div className="bg-gray-700/50 p-3 rounded-lg">
                      <p className="text-gray-400 text-sm">Total Budget</p>
                      <p className="text-blue-400 text-lg font-bold">${clientData.totalBudget?.toLocaleString() || '0'}</p>
                    </div>
                    <div className="bg-gray-700/50 p-3 rounded-lg">
                      <p className="text-gray-400 text-sm">Completed Milestones</p>
                      <p className="text-purple-400 text-2xl font-bold">{clientData.completedMilestones || 0}</p>
                    </div>
                  </div>
                  
                  {clientData.profile && (
                    <div className="bg-gray-700/50 p-3 rounded-lg">
                      <p className="text-gray-400 text-sm mb-1">Client Profile</p>
                      <p className="text-white font-medium">{clientData.profile.name}</p>
                      <p className="text-gray-300 text-sm">{clientData.profile.company}</p>
                      <p className="text-gray-400 text-sm">Joined: {clientData.profile.joinDate}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Detailed Project Data */}
        {clientData?.projects && (
          <Card className="bg-gray-800/50 border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <FolderOpen className="w-5 h-5 mr-2 text-orange-400" />
              Project Details
            </h2>
            <div className="space-y-4">
              {clientData.projects.map((project: any, index: number) => (
                <div key={index} className="bg-gray-700/30 p-4 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{project.name}</h3>
                      <p className="text-gray-400">{project.description}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'in-progress' ? 'bg-emerald-900 text-emerald-300' :
                        project.status === 'completed' ? 'bg-blue-900 text-blue-300' :
                        'bg-orange-900 text-orange-300'
                      }`}>
                        {project.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-gray-400 text-sm">Budget</p>
                      <p className="text-white">${project.budget?.total?.toLocaleString() || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Timeline</p>
                      <p className="text-white">{project.timeline?.startDate} - {project.timeline?.expectedEndDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Team Size</p>
                      <p className="text-white">{project.team?.members?.length || 0} members</p>
                    </div>
                  </div>

                  {project.roadmap?.phases && (
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Roadmap Phases</p>
                      <div className="flex flex-wrap gap-2">
                        {project.roadmap.phases.map((phase: any, phaseIndex: number) => (
                          <span key={phaseIndex} className={`px-2 py-1 rounded text-xs ${
                            phase.status === 'completed' ? 'bg-emerald-900 text-emerald-300' :
                            phase.status === 'in-progress' ? 'bg-blue-900 text-blue-300' :
                            'bg-gray-700 text-gray-300'
                          }`}>
                            {phase.name} ({phase.status})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-gray-400">
          <p>Firebase Enhanced Structure Testing Suite</p>
          <p className="text-sm">Test comprehensive project management data structure and operations</p>
        </div>
      </div>
    </div>
  );
}