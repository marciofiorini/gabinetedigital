
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

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  const { profile } = useAuth();
  const { stats, loading } = useDashboardStats();

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
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center h-16 border-b">
        <span className="text-lg font-bold text-indigo-700">
          Painel Político
        </span>
      </div>
      
      <nav className="flex-1 mt-6">
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

      {/* Informações do sistema na parte inferior */}
      <div className="p-4 space-y-3 border-t">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-blue-900">Resumo Hoje</h4>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            {loading ? (
              <div className="text-xs text-blue-800">Carregando...</div>
            ) : (
              <div className="space-y-1 text-xs text-blue-800">
                <div className="flex justify-between">
                  <span>Demandas pendentes:</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {stats.demandas_pendentes}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Eventos hoje:</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {stats.eventos_hoje}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Novos contatos:</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {stats.novos_contatos_hoje}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Leads novos:</span>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    {stats.leads_novos}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <h4 className="text-sm font-semibold text-green-900">Status do Sistema</h4>
            </div>
            <p className="text-xs text-green-800">Todos os serviços funcionando normalmente</p>
          </CardContent>
        </Card>

        <div className="text-xs text-gray-500 text-center">
          <p>Usuário: {profile?.name || 'Não identificado'}</p>
          <p>Versão 1.0.0</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar para telas maiores */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 bg-white border-r border-gray-200 transition-transform transform-none",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "hidden lg:block"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Sheet (Sidebar) para telas menores */}
      <Sheet>
        <SheetTrigger className="lg:hidden">
          <Button variant="outline" size="icon">
            <Menu className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-sm p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
};
