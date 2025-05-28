import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  MessageCircle, 
  Instagram, 
  BarChart3, 
  Settings, 
  Home,
  AlertCircle,
  Mail,
  Clock,
  Kanban
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar = ({ isOpen }: SidebarProps) => {
  const [activeItem, setActiveItem] = useState("dashboard");

  const menuItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: Home,
      path: "/"
    },
    {
      id: "demandas",
      title: "Demandas",
      icon: AlertCircle,
      path: "/demandas"
    },
    {
      id: "lideres",
      title: "Líderes",
      icon: Users,
      path: "/lideres"
    },
    {
      id: "crm",
      title: "CRM Kanban",
      icon: Kanban,
      path: "/crm"
    },
    {
      id: "whatsapp",
      title: "WhatsApp",
      icon: MessageCircle,
      path: "/whatsapp"
    },
    {
      id: "instagram",
      title: "Instagram",
      icon: Instagram,
      path: "/instagram"
    },
    {
      id: "email",
      title: "E-mail",
      icon: Mail,
      path: "/email"
    },
    {
      id: "agenda",
      title: "Agenda",
      icon: Calendar,
      path: "/agenda"
    },
    {
      id: "agendamentos",
      title: "Agendamentos",
      icon: Clock,
      path: "/agendamentos"
    },
    {
      id: "relatorios",
      title: "Relatórios",
      icon: BarChart3,
      path: "/relatorios"
    },
    {
      id: "configuracoes",
      title: "Configurações",
      icon: Settings,
      path: "/configuracoes"
    }
  ];

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-50 h-full bg-white border-r border-gray-200 transition-all duration-300",
        isOpen ? "w-64" : "w-16"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        {isOpen ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">Gabinete Digital</span>
          </div>
        ) : (
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-11",
                  isActive 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "text-gray-700 hover:bg-gray-100",
                  !isOpen && "justify-center px-2"
                )}
                onClick={() => setActiveItem(item.id)}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && <span className="font-medium">{item.title}</span>}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* User Info */}
      {isOpen && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">DE</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-900">Deputado</p>
              <p className="text-xs text-gray-600">Estadual</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
