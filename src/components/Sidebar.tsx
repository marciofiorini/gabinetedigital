
import { useState } from "react";
import { useLocation, Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Menu,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Globe,
  Scale,
  PieChart
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  const { profile } = useAuth();
  const { stats, loading } = useDashboardStats();
  const isMobile = useIsMobile();

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
    { name: 'Analytics', icon: BarChart3, path: '/analytics' },
    { name: 'Dashboard Comparativo', icon: PieChart, path: '/dashboard-comparativo' },
    { name: 'Monitor Redes', icon: TrendingUp, path: '/monitor-redes' },
    { name: 'Comunicação', icon: MessageCircle, path: '/comunicacao' },
    { name: 'Banco Mídia', icon: FileText, path: '/banco-midia' },
    { name: 'Portal Cidadão', icon: Globe, path: '/portal-cidadao' },
    { name: 'Projetos de Lei', icon: Scale, path: '/projetos-lei' },
    { name: 'Pesquisas', icon: PieChart, path: '/pesquisas' },
    { name: 'Planos', icon: BookOpen, path: '/planos' },
    { name: 'Galeria Fotos', icon: FileText, path: '/galeria-fotos' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center h-14 lg:h-16 border-b px-4">
        <span className="text-lg font-bold text-indigo-700 truncate">
          Painel Político
        </span>
      </div>
      
      <nav className="flex-1 mt-4 lg:mt-6 px-2 lg:px-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link
              to={item.path}
              key={item.name}
              className={cn(
                "flex items-center px-3 py-2.5 lg:py-2 text-sm lg:text-base text-gray-700 rounded-md hover:bg-gray-100 transition-colors w-full",
                location.pathname === item.path ? "bg-gray-100 font-semibold" : ""
              )}
            >
              <item.icon className="w-4 h-4 lg:w-5 lg:h-5 mr-3 shrink-0" />
              <span className="truncate">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Informações do sistema na parte inferior */}
      <div className="p-3 lg:p-4 space-y-2 lg:space-y-3 border-t mt-auto">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-2 lg:p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs lg:text-sm font-semibold text-blue-900">Resumo Hoje</h4>
              <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4 text-blue-600" />
            </div>
            {loading ? (
              <div className="text-xs text-blue-800">Carregando...</div>
            ) : (
              <div className="space-y-1 text-xs text-blue-800">
                <div className="flex justify-between items-center">
                  <span className="truncate mr-1">Demandas pendentes:</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs px-1">
                    {stats.demandas_pendentes}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="truncate mr-1">Eventos hoje:</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs px-1">
                    {stats.eventos_hoje}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="truncate mr-1">Novos contatos:</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs px-1">
                    {stats.novos_contatos_hoje}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="truncate mr-1">Leads novos:</span>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs px-1">
                    {stats.leads_novos}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-2 lg:p-3">
            <div className="flex items-center gap-2 mb-1 lg:mb-2">
              <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 text-green-600 shrink-0" />
              <h4 className="text-xs lg:text-sm font-semibold text-green-900">Status</h4>
            </div>
            <p className="text-xs text-green-800">Todos os serviços OK</p>
          </CardContent>
        </Card>

        <div className="text-xs text-gray-500 text-center space-y-1">
          <p className="truncate">Usuário: {profile?.name || 'Não identificado'}</p>
          <p>Versão 1.0.0</p>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={() => {}}>
        <SheetContent side="left" className="w-72 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 h-full w-64 bg-white border-r border-gray-200 transition-transform",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <SidebarContent />
    </aside>
  );
};
