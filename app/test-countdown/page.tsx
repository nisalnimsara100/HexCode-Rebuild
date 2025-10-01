"use client";

import { CountdownTimer } from "@/components/ui/countdown-timer";
import { Card } from "@/components/ui/card";

export default function TestCountdownPage() {
  // Test different scenarios
  const now = new Date();
  
  const testCases = [
    {
      title: "Critical - 2 hours left",
      dueDate: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      priority: "critical" as const,
      size: "lg" as const
    },
    {
      title: "High Priority - 1 day left", 
      dueDate: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      priority: "high" as const,
      size: "md" as const
    },
    {
      title: "Medium Priority - 3 days left",
      dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      priority: "medium" as const,
      size: "md" as const
    },
    {
      title: "Low Priority - 1 week left",
      dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      priority: "low" as const,
      size: "sm" as const
    },
    {
      title: "Overdue - Past deadline",
      dueDate: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      priority: "high" as const,
      size: "lg" as const
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            ⏰ Enhanced Countdown Timer Demo
          </h1>
          <p className="text-gray-400 text-lg">
            Showcasing visual urgency indicators and mobile responsiveness
          </p>
        </div>

        {/* Test Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {testCases.map((testCase, index) => (
            <Card key={index} className="bg-gray-900/80 border-orange-500/30 p-4 sm:p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    {testCase.title}
                  </h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    testCase.priority === 'critical' ? 'bg-red-900 text-red-300' :
                    testCase.priority === 'high' ? 'bg-orange-900 text-orange-300' :
                    testCase.priority === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-green-900 text-green-300'
                  }`}>
                    {testCase.priority.toUpperCase()}
                  </span>
                </div>
                
                <CountdownTimer 
                  dueDate={testCase.dueDate}
                  priority={testCase.priority}
                  size={testCase.size}
                  className="w-full"
                />
                
                <div className="text-xs text-gray-500">
                  Due: {new Date(testCase.dueDate).toLocaleString()}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Features List */}
        <Card className="bg-gray-900/80 border-orange-500/30 p-4 sm:p-6">
          <h2 className="text-xl font-bold text-white mb-4">✨ Enhanced Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <h3 className="font-semibold text-emerald-400">Visual Urgency</h3>
              <ul className="text-gray-400 space-y-1">
                <li>• Color-coded urgency levels</li>
                <li>• Animated pulse effects</li>
                <li>• Progress visualization</li>
                <li>• Priority-based styling</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-blue-400">Mobile Responsive</h3>
              <ul className="text-gray-400 space-y-1">
                <li>• Flexible sizing (sm/md/lg)</li>
                <li>• Touch-friendly layout</li>
                <li>• Responsive typography</li>
                <li>• Optimized spacing</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-purple-400">Real-time Updates</h3>
              <ul className="text-gray-400 space-y-1">
                <li>• Live countdown updates</li>
                <li>• Automatic urgency detection</li>
                <li>• Overdue handling</li>
                <li>• Performance optimized</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-700/50">
          <div className="p-4 sm:p-6 text-center">
            <h2 className="text-xl font-bold text-white mb-2">
              🎯 Testing Instructions
            </h2>
            <p className="text-gray-300 mb-4">
              Resize your browser window or use mobile device to test responsive behavior. 
              Watch as countdown timers update in real-time with visual urgency indicators!
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1 bg-green-900/50 text-green-300 rounded-full text-sm">Safe (Green)</span>
              <span className="px-3 py-1 bg-yellow-900/50 text-yellow-300 rounded-full text-sm">Warning (Yellow)</span>
              <span className="px-3 py-1 bg-orange-900/50 text-orange-300 rounded-full text-sm">Urgent (Orange)</span>
              <span className="px-3 py-1 bg-red-900/50 text-red-300 rounded-full text-sm">Critical (Red)</span>
              <span className="px-3 py-1 bg-gray-900/50 text-gray-300 rounded-full text-sm">Overdue (Gray)</span>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}