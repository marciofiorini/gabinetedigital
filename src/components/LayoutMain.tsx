
import { useState } from "react";
import { SidebarNew } from "@/components/SidebarNew";
import { Header } from "@/components/Header";

interface LayoutMainProps {
  children: React.ReactNode;
}

export const LayoutMain = ({ children }: LayoutMainProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <SidebarNew isOpen={sidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
