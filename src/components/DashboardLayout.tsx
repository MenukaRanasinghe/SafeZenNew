'use client';

import { ReactNode, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>('Overview');

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        onTabChange={handleTabChange}
      />

      <div className="flex flex-col flex-1">
        <Header
          toggleSidebar={toggleSidebar}
          selectedTab={selectedTab}
        />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
