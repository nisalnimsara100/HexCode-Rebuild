'use client';

import { useState } from 'react';
import { FirebaseDataManager } from '@/lib/firebase-data-manager';

export default function FirebaseSetupPage() {
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string>('');
  const [isCreatingDemo, setIsCreatingDemo] = useState(false);
  
  const handleImportData = async () => {
    setIsImporting(true);
    setImportStatus('Starting import...');
    
    try {
      const result = await FirebaseDataManager.importAllData();
      if (result.success) {
        setImportStatus('✅ All data imported successfully!');
      } else {
        setImportStatus(`❌ Import failed: ${result.error}`);
      }
    } catch (error: any) {
      setImportStatus(`❌ Import failed: ${error.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleCreateDemoClient = async () => {
    setIsCreatingDemo(true);
    setImportStatus('Creating demo client...');
    
    try {
      const result = await FirebaseDataManager.createDemoClient(
        'demo@example.com',
        'Demo User',
        'Demo Company Inc'
      );
      
      if (result.success) {
        setImportStatus(`✅ Demo client created with ID: ${result.clientId}`);
      } else {
        setImportStatus(`❌ Demo creation failed: ${result.error}`);
      }
    } catch (error: any) {
      setImportStatus(`❌ Demo creation failed: ${error.message}`);
    } finally {
      setIsCreatingDemo(false);
    }
  };

  const handleCleanupDemo = async () => {
    setImportStatus('Cleaning up demo data...');
    
    try {
      const result = await FirebaseDataManager.cleanupDemoData();
      if (result.success) {
        setImportStatus('✅ Demo data cleaned up successfully!');
      } else {
        setImportStatus(`❌ Cleanup failed: ${result.error}`);
      }
    } catch (error: any) {
      setImportStatus(`❌ Cleanup failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Firebase Database Setup
          </h1>
          <p className="text-slate-400 text-lg">
            Import sample data and manage Firebase Realtime Database
          </p>
        </div>

        {/* Status Display */}
        {importStatus && (
          <div className="mb-8 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-600/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Status</h3>
            <div className="bg-slate-700/30 rounded-lg p-4 font-mono text-sm text-slate-300">
              {importStatus}
            </div>
          </div>
        )}

        {/* Import Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Full Data Import */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-600/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
              <h3 className="text-xl font-semibold text-white">Full Data Import</h3>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Import the complete sample database including clients, projects, team members, 
              milestones, tasks, and all project details.
            </p>
            <div className="space-y-3">
              <div className="text-sm text-slate-300">Includes:</div>
              <ul className="text-sm text-slate-400 space-y-1 ml-4">
                <li>• 2 Sample clients with complete profiles</li>
                <li>• 3 Detailed projects with milestones</li>
                <li>• Team members and assignments</li>
                <li>• Tasks, communications, and finances</li>
                <li>• Company info and settings</li>
              </ul>
            </div>
            <button
              onClick={handleImportData}
              disabled={isImporting}
              className={`w-full mt-6 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                isImporting 
                  ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20 shadow-lg hover:shadow-emerald-500/30'
              }`}
            >
              {isImporting ? 'Importing...' : 'Import Full Database'}
            </button>
          </div>

          {/* Demo Client Creation */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-600/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <h3 className="text-xl font-semibold text-white">Demo Client</h3>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Create a single demo client account with a sample project for testing 
              the client dashboard functionality.
            </p>
            <div className="space-y-3">
              <div className="text-sm text-slate-300">Demo includes:</div>
              <ul className="text-sm text-slate-400 space-y-1 ml-4">
                <li>• Demo client profile</li>
                <li>• Sample website redesign project</li>
                <li>• Project tasks and timeline</li>
                <li>• Progress tracking</li>
              </ul>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateDemoClient}
                disabled={isCreatingDemo}
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isCreatingDemo 
                    ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20 shadow-lg hover:shadow-blue-500/30'
                }`}
              >
                {isCreatingDemo ? 'Creating...' : 'Create Demo'}
              </button>
              <button
                onClick={handleCleanupDemo}
                className="px-4 py-3 rounded-xl font-medium bg-slate-600 hover:bg-slate-700 text-white transition-all duration-200"
              >
                Cleanup
              </button>
            </div>
          </div>
        </div>

        {/* Database Structure Info */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-600/50 p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Database Structure Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h4 className="font-medium text-emerald-400 mb-2">Clients</h4>
              <p className="text-sm text-slate-400">
                Client profiles with company info, contact details, and project associations
              </p>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h4 className="font-medium text-blue-400 mb-2">Projects</h4>
              <p className="text-sm text-slate-400">
                Detailed project info including timelines, budgets, teams, and deliverables
              </p>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h4 className="font-medium text-purple-400 mb-2">Tasks & Milestones</h4>
              <p className="text-sm text-slate-400">
                Task management with dependencies, assignments, and progress tracking
              </p>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h4 className="font-medium text-amber-400 mb-2">Team Members</h4>
              <p className="text-sm text-slate-400">
                Developer profiles with skills, availability, and project assignments
              </p>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h4 className="font-medium text-rose-400 mb-2">Communications</h4>
              <p className="text-sm text-slate-400">
                Project communications, meetings, emails, and status updates
              </p>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h4 className="font-medium text-teal-400 mb-2">Company Data</h4>
              <p className="text-sm text-slate-400">
                Company information, services, certifications, and global settings
              </p>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-indigo-500/20 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Next Steps</h3>
          <div className="space-y-3 text-slate-300">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center font-bold text-sm">1</div>
              <div>
                <strong>Import Data:</strong> Use the "Import Full Database" button to populate Firebase with all sample data.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center font-bold text-sm">2</div>
              <div>
                <strong>Test Authentication:</strong> Use the sample client credentials to test login functionality.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center font-bold text-sm">3</div>
              <div>
                <strong>Explore Features:</strong> Navigate to <code className="bg-slate-700/50 px-2 py-1 rounded text-sm">/client/dashboard</code> to see the project management interface.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}