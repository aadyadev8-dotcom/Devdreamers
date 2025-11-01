"use client";

import React from 'react';
import { Home, Camera, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-app-background">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-10 bg-gradient-to-r from-nav-gradient-start to-nav-gradient-end shadow-nav-elevation">
        <div className="max-w-md mx-auto flex items-center justify-between p-4 w-full"> {/* This div constrains the content */}
          <h1 className="text-xl font-bold text-gray-800">Urban Eye</h1>
          <div className="flex space-x-4">
            <Home
              className="h-6 w-6 text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
              onClick={() => navigate('/')}
            />
            <Camera
              className="h-6 w-6 text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
              onClick={() => console.log("Take Photo clicked")} // Placeholder for camera/upload
            />
            <Settings
              className="h-6 w-6 text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
              onClick={() => console.log("Settings clicked")} // Placeholder for settings
            />
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 pt-20"> {/* pt-20 to account for fixed header */}
        <div className="bg-urban-card-background p-8 md:p-12 rounded-card-lg shadow-card-soft max-w-md w-full text-center">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;