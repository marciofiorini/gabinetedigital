
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SidebarNew } from "@/components/SidebarNew";
import { Header } from "@/components/Header";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useTheme } from "@/hooks/useTheme";

interface LayoutMainProps {
  children: React.ReactNode;
}

export const LayoutMain = ({ children }: LayoutMainProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const { isDarkMode } = useTheme();
  
  // Ativar atalhos de teclado
  useKeyboardShortcuts();
  
  console.log('LayoutMain - Renderizando:', { 
    sidebarOpen, 
    path: location.pathname,
    hasChildren: !!children,
    isDarkMode
  });

  // Fechar sidebar automaticamente em mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Garantir que o componente foi montado para evitar hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  // Páginas que devem usar toda a largura
  const fullWidthPages = ['/contatos'];
  const isFullWidth = fullWidthPages.includes(location.pathname);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse-soft">
          <div className="w-8 h-8 bg-primary rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex w-full transition-smooth">
      <SidebarNew isOpen={sidebarOpen} />
      
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
        }`}
      >
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <div className={`${isFullWidth ? 'w-full' : 'max-w-6xl mx-auto'} animate-fade-in`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
