
import { useState } from "react";
import { SidebarNew } from "@/components/SidebarNew";
import { Header } from "@/components/Header";

interface LayoutMainProps {
  children: React.ReactNode;
}

export const LayoutMain = ({ children }: LayoutMainProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SidebarNew isOpen={sidebarOpen} />
      
      <div className="flex-1 flex flex-col">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
