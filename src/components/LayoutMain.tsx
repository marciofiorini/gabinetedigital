
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { SidebarNew } from "@/components/SidebarNew";
import { Header } from "@/components/Header";

interface LayoutMainProps {
  children: React.ReactNode;
}

export const LayoutMain = ({ children }: LayoutMainProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  
  console.log('LayoutMain - Renderizando:', { 
    sidebarOpen, 
    path: location.pathname,
    hasChildren: !!children 
  });
  
  // Páginas que devem usar toda a largura
  const fullWidthPages = ['/contatos'];
  const isFullWidth = fullWidthPages.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex w-full">
      <SidebarNew isOpen={sidebarOpen} />
      
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
        }`}
      >
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <div className={isFullWidth ? 'w-full' : 'max-w-6xl mx-auto'}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
