import React from 'react';
import GlassBackground from './GlassBackground';
import GlassSidebar from './GlassSidebar';
import GlassTopbar from './GlassTopbar';
import GlassShell from '../common/GlassShell';

export default function MainLayout({ activeTab, setActiveTab, onRefresh, onOpenProfile, children }) {
  return (
    <div className="relative min-h-screen w-full flex items-start justify-center p-2 sm:p-4 md:p-8 bg-transparent overflow-x-clip selection:bg-blue-500/20 selection:text-blue-900">
      {/* 1. Ambient Glass Refraction Background Blobs */}
      <GlassBackground />

      {/* 2. Master Outer Glass Shell (Holds entire dashboard exactly like reference screenshot) */}
      <GlassShell>
        <div className="dashboard-layout-row flex gap-4 md:gap-6 items-start">
          {/* Left: Ultra-narrow floating vertical glass pill sidebar (~56px wide) */}
          <GlassSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Right: Main Dashboard Area */}
          <div className="dashboard-main-content flex-1 w-full min-w-0">
            {/* Top Bar with Avatar, Search, and Action Pills */}
            <GlassTopbar onRefresh={onRefresh} onOpenProfile={onOpenProfile} />

            {/* View Content */}
            <main className="w-full">
              {children}
            </main>
          </div>
        </div>
      </GlassShell>
    </div>
  );
}
