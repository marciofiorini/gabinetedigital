
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutMainProps {
  children: React.ReactNode;
}

export const LayoutMain = ({ children }: LayoutMainProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <Sidebar isOpen={sidebarOpen} />
      
      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className={`transition-all duration-300 ${!isMobile && sidebarOpen ? 'lg:ml-64' : ''}`}>
        <Header onToggleSidebar={toggleSidebar} />
        
        <main className="p-4 lg:p-6 min-h-[calc(100vh-3.5rem)] overflow-x-hidden">
          <div className="max-w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
