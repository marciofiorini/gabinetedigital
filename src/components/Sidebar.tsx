
import { useState } from "react";
import { useLocation, Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { 
  LayoutDashboard, 
  Calendar, 
  Target, 
  Users, 
  Crown, 
  MessageCircle, 
  Instagram, 
  Mail, 
  FileText, 
  BookOpen,
  Menu
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Agenda', icon: Calendar, path: '/agenda' },
    { name: 'CRM', icon: Target, path: '/crm' },
    { name: 'Contatos', icon: Users, path: '/contatos' },
    { name: 'Líderes', icon: Crown, path: '/lideres' },
    { name: 'WhatsApp', icon: MessageCircle, path: '/whatsapp' },
    { name: 'Instagram', icon: Instagram, path: '/instagram' },
    { name: 'E-mail', icon: Mail, path: '/email' },
    { name: 'Demandas', icon: FileText, path: '/demandas' },
    { name: 'Planos', icon: BookOpen, path: '/planos' },
  ];

  return (
    <>
      {/* Sidebar para telas maiores */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 bg-white border-r border-gray-200 px-6 py-4 transition-transform transform-none",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "hidden lg:block"
        )}
      >
        <div className="flex items-center justify-center h-16">
          <span className="text-lg font-bold text-indigo-700">
            Painel Político
          </span>
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              to={item.path}
              key={item.name}
              className={cn(
                "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors",
                location.pathname === item.path ? "bg-gray-100 font-semibold" : ""
              )}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Sheet (Sidebar) para telas menores */}
      <Sheet>
        <SheetTrigger className="lg:hidden">
          <Button variant="outline" size="icon">
            <Menu className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>Painel Político</SheetTitle>
            <SheetDescription>
              Navegue pelas opções do sistema.
            </SheetDescription>
          </SheetHeader>
          <nav className="mt-6">
            {menuItems.map((item) => (
              <Link
                to={item.path}
                key={item.name}
                className={cn(
                  "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors",
                  location.pathname === item.path ? "bg-gray-100 font-semibold" : ""
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
};
