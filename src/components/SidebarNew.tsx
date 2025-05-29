
import { useState } from "react";
import { useLocation, Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sheet, 
  SheetContent, 
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
  CheckCircle,
  BarChart3,
  Globe,
  Scale,
  PieChart,
  ChevronDown,
  ChevronRight,
  Settings,
  Zap,
  Building
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useUserRoles } from '@/hooks/useUserRoles';

interface SidebarProps {
  isOpen: boolean;
}

export const SidebarNew = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  const { profile } = useAuth();
  const { stats, loading } = useDashboardStats();
  const { isAdmin, isModerator } = useUserRoles();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['main']);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const menuGroups = [
    {
      id: 'main',
      name: 'Principal',
      icon: LayoutDashboard,
      items: [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { name: 'Agenda', icon: Calendar, path: '/agenda' },
        { name: 'Configurações', icon: Settings, path: '/configuracoes' },
      ]
    },
    {
      id: 'crm',
      name: 'CRM & Relacionamento',
      icon: Target,
      items: [
        { name: 'CRM Kanban', icon: Target, path: '/crm' },
        { name: 'Contatos', icon: Users, path: '/contatos' },
        { name: 'Líderes', icon: Crown, path: '/lideres' },
        { name: 'Demandas', icon: FileText, path: '/demandas' },
      ]
    },
    {
      id: 'communication',
      name: 'Comunicação',
      icon: MessageCircle,
      items: [
        { name: 'WhatsApp', icon: MessageCircle, path: '/whatsapp' },
        { name: 'Instagram', icon: Instagram, path: '/instagram' },
        { name: 'E-mail', icon: Mail, path: '/email' },
        { name: 'Comunicação Integrada', icon: Zap, path: '/comunicacao' },
      ]
    },
    {
      id: 'analytics',
      name: 'Analytics & Monitoramento',
      icon: BarChart3,
      items: [
        { name: 'Analytics', icon: BarChart3, path: '/analytics' },
        { name: 'Monitor Redes', icon: TrendingUp, path: '/monitor-redes' },
        { name: 'Pesquisas', icon: PieChart, path: '/pesquisas' },
      ]
    },
    {
      id: 'institutional',
      name: 'Institucional',
      icon: Building,
      items: [
        { name: 'Portal Cidadão', icon: Globe, path: '/portal-cidadao' },
        { name: 'Projetos de Lei', icon: Scale, path: '/projetos-lei' },
        { name: 'Banco Mídia', icon: FileText, path: '/banco-midia' },
      ]
    }
  ];

  // Adicionar planos apenas para administradores
  if (isAdmin()) {
    menuGroups.push({
      id: 'admin',
      name: 'Administração',
      icon: Crown,
      items: [
        { name: 'Planos', icon: BookOpen, path: '/planos' },
      ]
    });
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white border-r border-slate-200/60">
      {/* Header */}
      <div className="flex items-center justify-center h-16 border-b border-slate-200/60 bg-gradient-to-r from-blue-600 to-indigo-600">
        <span className="text-lg font-bold text-white">
          Painel Político
        </span>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 mt-4 px-3 space-y-2 overflow-y-auto">
        {menuGroups.map((group) => {
          const isExpanded = expandedGroups.includes(group.id);
          const GroupIcon = group.icon;
          
          return (
            <div key={group.id} className="space-y-1">
              <button
                onClick={() => toggleGroup(group.id)}
                className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center">
                  <GroupIcon className="w-4 h-4 mr-3 text-slate-500" />
                  <span>{group.name}</span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </button>
              
              {isExpanded && (
                <div className="ml-4 space-y-1">
                  {group.items.map((item) => (
                    <Link
                      to={item.path}
                      key={item.name}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm text-slate-600 rounded-md hover:bg-slate-100 transition-colors",
                        location.pathname === item.path ? "bg-blue-50 text-blue-700 font-medium border-r-2 border-blue-600" : ""
                      )}
                    >
                      <item.icon className="w-4 h-4 mr-3" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Stats Card */}
      <div className="p-4 space-y-3 border-t border-slate-200/60">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/50 shadow-sm">
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
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                    {stats.demandas_pendentes}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Eventos hoje:</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                    {stats.eventos_hoje}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Novos contatos:</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                    {stats.novos_contatos_hoje}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Card */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200/50 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <h4 className="text-sm font-semibold text-green-900">Sistema</h4>
            </div>
            <p className="text-xs text-green-800">Operando normalmente</p>
          </CardContent>
        </Card>

        {/* User Info */}
        <div className="text-xs text-slate-500 text-center space-y-1">
          <p className="font-medium">{profile?.name || 'Usuário'}</p>
          <p className="text-slate-400">Versão 2.0.0</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 transition-transform transform-none",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "hidden lg:block"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
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
