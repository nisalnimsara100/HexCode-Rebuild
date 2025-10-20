// Simple test file to simulate login and test Firebase integration
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function TestFirebaseAuth() {
  const [email, setEmail] = useState('nisalnimsara100@gmail.com');

  const handleLogin = () => {
    // Simulate login by storing email in localStorage
    localStorage.setItem('clientProfile', JSON.stringify({
      email: email,
      name: 'Test User',
      isLoggedIn: true
    }));
    
    // Redirect to dashboard
    window.location.href = '/client/dashboard';
  };

  const testEmails = [
    'nisalnimsara100@gmail.com',
    'john.doe@techstartup.com', 
    'sarah.johnson@shopflow.com'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white flex items-center justify-center p-4">
      <Card className="bg-gray-800/50 border-gray-700/50 p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Test Firebase Auth</h1>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Client Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter client email"
              className="bg-gray-700/50 border-gray-600/50 text-white"
            />
          </div>
        </div>

        <Button 
          onClick={handleLogin}
          className="w-full bg-emerald-600 hover:bg-emerald-700 mb-4"
        >
          Login & Test Dashboard
        </Button>

        <div className="space-y-2">
          <p className="text-sm text-gray-400 mb-2">Quick test emails:</p>
          {testEmails.map((testEmail) => (
            <Button
              key={testEmail}
              variant="outline"
              size="sm"
              onClick={() => setEmail(testEmail)}
              className="w-full text-left justify-start text-xs border-gray-600/50 text-gray-300 hover:bg-gray-700/50"
            >
              {testEmail}
            </Button>
          ))}
        </div>

        <div className="mt-6 p-3 bg-blue-500/20 rounded-lg">
          <p className="text-blue-300 text-xs">
            📝 This test page simulates authentication by storing the email in localStorage. 
            The dashboard will then fetch Firebase data based on this email.
          </p>
        </div>
      </Card>
    </div>
  );
}