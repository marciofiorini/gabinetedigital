
import { useState } from "react";
import { useLocation, Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  Zap
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useDashboardStats } from '@/hooks/useDashboardStats';

interface SidebarProps {
  isOpen: boolean;
}

interface MenuItem {
  name: string;
  icon: any;
  path: string;
  requiredRole?: 'admin' | 'moderator' | 'user';
  requiredPlan?: 'basic' | 'premium' | 'enterprise';
}

interface MenuGroup {
  name: string;
  icon: any;
  items: MenuItem[];
}

export const SidebarGrouped = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  const { profile } = useAuth();
  const { hasRole, isAdmin } = useUserRoles();
  const { stats, loading } = useDashboardStats();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['principal', 'comunicacao']);

  const menuGroups: MenuGroup[] = [
    {
      name: 'Principal',
      icon: LayoutDashboard,
      items: [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { name: 'Agenda', icon: Calendar, path: '/agenda' },
        { name: 'CRM', icon: Target, path: '/crm' },
        { name: 'Contatos', icon: Users, path: '/contatos' },
        { name: 'Líderes', icon: Crown, path: '/lideres' },
        { name: 'Demandas', icon: FileText, path: '/demandas' }
      ]
    },
    {
      name: 'Comunicação',
      icon: MessageCircle,
      items: [
        { name: 'WhatsApp', icon: MessageCircle, path: '/whatsapp' },
        { name: 'Instagram', icon: Instagram, path: '/instagram' },
        { name: 'E-mail', icon: Mail, path: '/email' },
        { name: 'Comunicação Integrada', icon: Zap, path: '/comunicacao' }
      ]
    },
    {
      name: 'Analytics & Mídia',
      icon: BarChart3,
      items: [
        { name: 'Analytics', icon: BarChart3, path: '/analytics' },
        { name: 'Monitor Redes', icon: TrendingUp, path: '/monitor-redes' },
        { name: 'Banco Mídia', icon: FileText, path: '/banco-midia' },
        { name: 'Pesquisas', icon: PieChart, path: '/pesquisas', requiredPlan: 'premium' }
      ]
    },
    {
      name: 'Governança',
      icon: Scale,
      items: [
        { name: 'Portal Cidadão', icon: Globe, path: '/portal-cidadao', requiredPlan: 'premium' },
        { name: 'Projetos de Lei', icon: Scale, path: '/projetos-lei', requiredRole: 'moderator' }
      ]
    },
    {
      name: 'Sistema',
      icon: Settings,
      items: [
        { name: 'Planos', icon: BookOpen, path: '/planos' },
        { name: 'Configurações', icon: Settings, path: '/configuracoes' }
      ]
    }
  ];

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  const canAccessItem = (item: MenuItem): boolean => {
    // Check role requirement
    if (item.requiredRole) {
      if (item.requiredRole === 'admin' && !isAdmin()) return false;
      if (item.requiredRole === 'moderator' && !hasRole('moderator') && !isAdmin()) return false;
    }

    // Check plan requirement (placeholder - implement with real plan system)
    if (item.requiredPlan) {
      // For now, assume all users have basic access
      const userPlan = 'basic'; // This should come from user profile/subscription
      if (item.requiredPlan === 'premium' && userPlan === 'basic') return false;
      if (item.requiredPlan === 'enterprise' && userPlan !== 'enterprise') return false;
    }

    return true;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center h-16 border-b bg-gradient-to-r from-indigo-600 to-purple-600">
        <span className="text-lg font-bold text-white">
          Painel Político
        </span>
      </div>
      
      <nav className="flex-1 mt-4 px-2 space-y-1 overflow-y-auto">
        {menuGroups.map((group) => {
          const accessibleItems = group.items.filter(canAccessItem);
          if (accessibleItems.length === 0) return null;

          const isExpanded = expandedGroups.includes(group.name.toLowerCase());

          return (
            <Collapsible 
              key={group.name}
              open={isExpanded}
              onOpenChange={() => toggleGroup(group.name.toLowerCase())}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between text-left font-medium text-gray-700 hover:bg-gray-100 p-3"
                >
                  <div className="flex items-center">
                    <group.icon className="w-5 h-5 mr-3" />
                    <span>{group.name}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 ml-4">
                {accessibleItems.map((item) => (
                  <Link
                    to={item.path}
                    key={item.name}
                    className={cn(
                      "flex items-center px-4 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-100 transition-colors",
                      location.pathname === item.path ? "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-500" : ""
                    )}
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    <span>{item.name}</span>
                    {item.requiredPlan && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.requiredPlan}
                      </Badge>
                    )}
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </nav>

      {/* Status Cards */}
      <div className="p-4 space-y-3 border-t bg-gray-50">
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
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <h4 className="text-sm font-semibold text-green-900">Sistema</h4>
            </div>
            <p className="text-xs text-green-800">Funcionando normalmente</p>
          </CardContent>
        </Card>

        <div className="text-xs text-gray-500 text-center">
          <p>Usuário: {profile?.name || 'Não identificado'}</p>
          <p>Papel: {isAdmin() ? 'Administrador' : 'Usuário'}</p>
          <p>Versão 1.0.1</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar para telas maiores */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 bg-white border-r border-gray-200 shadow-lg transition-transform transform-none",
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
