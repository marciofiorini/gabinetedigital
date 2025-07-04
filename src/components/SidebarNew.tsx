
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
  Zap,
  Settings,
  CreditCard,
  DollarSign,
  Receipt,
  PieChart,
  HelpCircle
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  isOpen: boolean;
}

type UserPlan = 'basic' | 'premium' | 'enterprise';

export const SidebarNew = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  const { profile } = useAuth();
  const { stats, loading } = useDashboardStats();
  const { isAdmin } = useUserRoles();
  const isMobile = useIsMobile();
  const [openGroups, setOpenGroups] = useState<string[]>(['comunicacao', 'painel', 'gestao']);

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

  // Grupo Painel
  const painelGroup = {
    id: 'painel',
    label: 'Painel',
    icon: BarChart3,
    items: [
      { name: 'Analytics Completo', icon: BarChart3, path: '/analytics-avancado', minPlan: 'premium' as UserPlan },
      { name: 'Monitor de Redes', icon: Monitor, path: '/monitor-redes', minPlan: 'premium' as UserPlan },
      { name: 'Pesquisas', icon: Search, path: '/pesquisas', minPlan: 'basic' as UserPlan },
      { name: 'Portal do Cidadão', icon: DoorOpen, path: '/portal-cidadao', minPlan: 'basic' as UserPlan },
      { name: 'Mapa de Influência', icon: Map, path: '/mapa-influencia', minPlan: 'premium' as UserPlan },
      { name: 'Sistema de Votações', icon: Vote, path: '/sistema-votacoes', minPlan: 'basic' as UserPlan },
    ]
  };

  // Grupo de comunicação - Canais
  const comunicacaoGroup = {
    id: 'comunicacao',
    label: 'Canais',
    icon: MessageCircle,
    items: [
      { name: 'Comunicação', icon: Zap, path: '/comunicacao', minPlan: 'premium' as UserPlan },
      { name: 'WhatsApp', icon: MessageCircle, path: '/whatsapp', minPlan: 'premium' as UserPlan },
      { name: 'Instagram', icon: Instagram, path: '/instagram', minPlan: 'premium' as UserPlan },
      { name: 'E-mail', icon: Mail, path: '/email', minPlan: 'basic' as UserPlan },
    ]
  };

  // Grupo Gestão - COM Galeria de Fotos ADICIONADA
  const gestaoGroup = {
    id: 'gestao',
    label: 'Gestão',
    icon: Settings,
    items: [
      { name: 'Equipe', icon: Users, path: '/equipe', minPlan: 'premium' as UserPlan },
      { name: 'Orçamento Público', icon: DollarSign, path: '/orcamento-publico', minPlan: 'premium' as UserPlan },
      { name: 'Prestação de Contas', icon: Receipt, path: '/prestacao-contas', minPlan: 'premium' as UserPlan },
      { name: 'Gestão Financeira', icon: CreditCard, path: '/gestao-financeira', minPlan: 'premium' as UserPlan },
      { name: 'Projetos c/ Impacto Financeiro', icon: PieChart, path: '/projetos-financeiro', minPlan: 'premium' as UserPlan },
      { name: 'Galeria de Fotos', icon: FileText, path: '/galeria-fotos', minPlan: 'basic' as UserPlan },
      { name: 'Configurações', icon: Settings, path: '/configuracoes', minPlan: 'basic' as UserPlan },
    ]
  };

  // Link solto no final
  const finalLink = { name: 'Planos', icon: CreditCard, path: '/planos', minPlan: 'basic' as UserPlan };

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

        {/* Grupo de Canais */}
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

        {/* Grupo Gestão */}
        <Collapsible open={openGroups.includes('gestao')} onOpenChange={() => toggleGroup('gestao')}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-3 h-auto font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="flex items-center gap-2">
                <gestaoGroup.icon className="w-4 h-4" />
                <span className="text-sm">{gestaoGroup.label}</span>
              </div>
              {openGroups.includes('gestao') ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 ml-4 mt-1">
            {gestaoGroup.items.map((item) => {
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

        {/* Link final solto - Planos */}
        <div className="pt-2">
          <Link
            to={finalLink.path}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
              location.pathname === finalLink.path 
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-2 border-blue-600" 
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
            )}
          >
            <finalLink.icon className="w-4 h-4" />
            <span>{finalLink.name}</span>
          </Link>
        </div>
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

        {/* Ícone de Ajuda no Rodapé */}
        <div className="mt-3 flex justify-center">
          <Link
            to="/ajuda"
            className="flex items-center gap-2 px-3 py-2 text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Precisa de ajuda?</span>
          </Link>
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
