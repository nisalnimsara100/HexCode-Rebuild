"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function TestLoginPage() {
  const [email] = useState('nisalnimsara100@gmail.com');
  const router = useRouter();

  const handleLogin = () => {
    // Simulate client profile
    const clientProfile = {
      email: email,
      name: 'Nisal Nimsara',
      id: 'client-001'
    };
    
    localStorage.setItem('clientProfile', JSON.stringify(clientProfile));
    console.log('Test login - Profile set:', clientProfile);
    
    // Redirect to dashboard
    router.push('/client/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <Card className="bg-gray-800 border-gray-700 p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Test Login</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input 
              type="email" 
              value={email} 
              readOnly
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
          </div>
          
          <Button 
            onClick={handleLogin}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            Login & Test Dashboard
          </Button>
          
          <div className="text-sm text-gray-400">
            This will set localStorage and redirect to dashboard
          </div>
        </div>
      </Card>
    </div>
  );
}