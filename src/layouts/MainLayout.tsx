import { useState } from 'react';

import Sidebar from './Sidebar';

import Header from './Header';

import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main Area */}
      <div
        className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${
          sidebarCollapsed
            ? 'ml-16'
            : 'ml-64'
        }`}
      >
        
        {/* Header */}
        <Header />

        {/* Workspace */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}