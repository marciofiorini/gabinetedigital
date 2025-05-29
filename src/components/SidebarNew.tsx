
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
  ChevronDown,
  ChevronRight,
  Scale,
  Vote,
  Monitor,
  Search,
  DoorOpen,
  Map,
  AlertCircle,
  Cake,
  Settings
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useUserRoles } from '@/hooks/useUserRoles';

interface SidebarProps {
  isOpen: boolean;
}

type UserPlan = 'basic' | 'premium' | 'enterprise';

export const SidebarNew = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  const { profile } = useAuth();
  const { stats, loading } = useDashboardStats();
  const { isAdmin } = useUserRoles();
  const [openGroups, setOpenGroups] = useState<string[]>(['comunicacao', 'painel']);

  console.log('SidebarNew - Renderizando:', { 
    isOpen, 
    location: location.pathname, 
    stats,
    loading 
  });

  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const userPlan: UserPlan = 'premium';

  // Links principais soltos
  const mainLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/', minPlan: 'basic' as UserPlan },
    { name: 'Contatos', icon: Users, path: '/contatos', minPlan: 'basic' as UserPlan },
    { name: 'Líderes', icon: Crown, path: '/lideres', minPlan: 'premium' as UserPlan },
    { name: 'CRM', icon: Target, path: '/crm', minPlan: 'premium' as UserPlan },
    { name: 'Demandas', icon: FileText, path: '/demandas', minPlan: 'basic' as UserPlan },
    { name: 'Projetos de Lei', icon: Scale, path: '/projetos-lei', minPlan: 'basic' as UserPlan },
  ];

  // Grupo de comunicação
  const comunicacaoGroup = {
    id: 'comunicacao',
    label: 'Comunicação',
    icon: MessageCircle,
    items: [
      { name: 'WhatsApp', icon: MessageCircle, path: '/whatsapp', minPlan: 'premium' as UserPlan },
      { name: 'Instagram', icon: Instagram, path: '/instagram', minPlan: 'premium' as UserPlan },
      { name: 'E-mail', icon: Mail, path: '/email', minPlan: 'basic' as UserPlan },
    ]
  };

  // Grupo Painel
  const painelGroup = {
    id: 'painel',
    label: 'Painel',
    icon: BarChart3,
    items: [
      { name: 'Analytics', icon: BarChart3, path: '/analytics', minPlan: 'premium' as UserPlan },
      { name: 'Monitor de Redes', icon: Monitor, path: '/monitor-redes', minPlan: 'premium' as UserPlan },
      { name: 'Pesquisas', icon: Search, path: '/pesquisas', minPlan: 'basic' as UserPlan },
      { name: 'Portal do Cidadão', icon: DoorOpen, path: '/portal-cidadao', minPlan: 'basic' as UserPlan },
      { name: 'Mapa de Influência', icon: Map, path: '/mapa-influencia', minPlan: 'premium' as UserPlan },
      { name: 'Sistema de Votações', icon: Vote, path: '/sistema-votacoes', minPlan: 'basic' as UserPlan },
    ]
  };

  const hasAccessToPlan = (minPlan: UserPlan) => {
    const planLevels: Record<UserPlan, number> = { basic: 1, premium: 2, enterprise: 3 };
    const userLevel = planLevels[userPlan];
    const requiredLevel = planLevels[minPlan];
    return userLevel >= requiredLevel;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-center h-14 border-b border-gray-200 dark:border-gray-700 px-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">PP</span>
          </div>
          <span className="text-lg font-bold text-gray-800 dark:text-white">
            Painel Político
          </span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {/* Links principais soltos */}
        {mainLinks.map((item) => {
          const hasAccess = hasAccessToPlan(item.minPlan) || isAdmin();
          if (!hasAccess) return null;

          return (
            <Link
              to={item.path}
              key={item.name}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                location.pathname === item.path 
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-2 border-blue-600" 
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
              {!hasAccessToPlan(item.minPlan) && isAdmin() && (
                <Badge variant="outline" className="ml-auto text-xs">Admin</Badge>
              )}
            </Link>
          );
        })}

        {/* Grupo de Comunicação */}
        <Collapsible open={openGroups.includes('comunicacao')} onOpenChange={() => toggleGroup('comunicacao')}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-3 h-auto font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="flex items-center gap-2">
                <comunicacaoGroup.icon className="w-4 h-4" />
                <span className="text-sm">{comunicacaoGroup.label}</span>
              </div>
              {openGroups.includes('comunicacao') ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 ml-4 mt-1">
            {comunicacaoGroup.items.map((item) => {
              const hasAccess = hasAccessToPlan(item.minPlan) || isAdmin();
              if (!hasAccess) return null;

              return (
                <Link
                  to={item.path}
                  key={item.name}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                    location.pathname === item.path 
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-2 border-blue-600" 
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  {!hasAccessToPlan(item.minPlan) && isAdmin() && (
                    <Badge variant="outline" className="ml-auto text-xs">Admin</Badge>
                  )}
                </Link>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        {/* Grupo Painel */}
        <Collapsible open={openGroups.includes('painel')} onOpenChange={() => toggleGroup('painel')}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-3 h-auto font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="flex items-center gap-2">
                <painelGroup.icon className="w-4 h-4" />
                <span className="text-sm">{painelGroup.label}</span>
              </div>
              {openGroups.includes('painel') ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 ml-4 mt-1">
            {painelGroup.items.map((item) => {
              const hasAccess = hasAccessToPlan(item.minPlan) || isAdmin();
              if (!hasAccess) return null;

              return (
                <Link
                  to={item.path}
                  key={item.name}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                    location.pathname === item.path 
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-2 border-blue-600" 
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  {!hasAccessToPlan(item.minPlan) && isAdmin() && (
                    <Badge variant="outline" className="ml-auto text-xs">Admin</Badge>
                  )}
                </Link>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        {/* Links soltos no final */}
        <Link
          to="/configuracoes"
          className={cn(
            "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
            location.pathname === "/configuracoes" 
              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-2 border-blue-600" 
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
          )}
        >
          <Settings className="w-4 h-4" />
          <span>Configurações</span>
        </Link>

        <Link
          to="/planos"
          className={cn(
            "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
            location.pathname === "/planos" 
              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-2 border-blue-600" 
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
          )}
        >
          <BookOpen className="w-4 h-4" />
          <span>Planos</span>
        </Link>
      </nav>

      {/* Bottom Stats Card - Resumo de Hoje */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-blue-900 dark:text-blue-100">Resumo de Hoje</h4>
              <TrendingUp className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            </div>
            {loading ? (
              <div className="text-xs text-blue-800 dark:text-blue-200">Carregando...</div>
            ) : (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 dark:text-blue-300">Demandas pendentes:</span>
                  <Badge variant="secondary" className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 text-xs h-5">
                    {stats?.demandas_pendentes || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 dark:text-blue-300">Novos contatos:</span>
                  <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs h-5">
                    {stats?.novos_contatos_hoje || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 dark:text-blue-300">Aniversariantes do dia:</span>
                  <Badge variant="secondary" className="bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200 text-xs h-5 flex items-center gap-1">
                    <Cake className="w-3 h-3" />
                    {stats?.aniversariantes_hoje || 0}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Online</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p>{profile?.name || 'Usuário'} • {userPlan}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 flex-shrink-0 hidden lg:block",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="outline" size="icon">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
};
