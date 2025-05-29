
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
  Zap,
  Wrench
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
  const [openGroups, setOpenGroups] = useState<string[]>(['principal']);

  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  // Simulando planos
  const userPlan: UserPlan = 'premium';

  const menuGroups = [
    {
      id: 'principal',
      label: 'Principal',
      icon: LayoutDashboard,
      items: [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/', minPlan: 'basic' as UserPlan },
        { name: 'Agenda', icon: Calendar, path: '/agenda', minPlan: 'basic' as UserPlan },
        { name: 'CRM', icon: Target, path: '/crm', minPlan: 'premium' as UserPlan },
        { name: 'Contatos', icon: Users, path: '/contatos', minPlan: 'basic' as UserPlan },
        { name: 'Demandas', icon: FileText, path: '/demandas', minPlan: 'basic' as UserPlan },
      ]
    },
    {
      id: 'comunicacao',
      label: 'Comunicação',
      icon: MessageCircle,
      items: [
        { name: 'WhatsApp', icon: MessageCircle, path: '/whatsapp', minPlan: 'premium' as UserPlan },
        { name: 'Instagram', icon: Instagram, path: '/instagram', minPlan: 'premium' as UserPlan },
        { name: 'E-mail', icon: Mail, path: '/email', minPlan: 'basic' as UserPlan },
      ]
    },
    {
      id: 'ferramentas',
      label: 'Ferramentas',
      icon: Wrench,
      items: [
        { name: 'Analytics', icon: BarChart3, path: '/analytics', minPlan: 'premium' as UserPlan },
        { name: 'Monitor Redes', icon: TrendingUp, path: '/monitor-redes', minPlan: 'premium' as UserPlan },
        { name: 'Líderes', icon: Crown, path: '/lideres', minPlan: 'premium' as UserPlan },
        { name: 'Pesquisas', icon: PieChart, path: '/pesquisas', minPlan: 'enterprise' as UserPlan },
        { name: 'Projetos de Lei', icon: Scale, path: '/projetos-lei', minPlan: 'enterprise' as UserPlan },
      ]
    },
    {
      id: 'avancado',
      label: 'Avançado',
      icon: Zap,
      items: [
        { name: 'Comunicação Integrada', icon: MessageCircle, path: '/comunicacao', minPlan: 'enterprise' as UserPlan },
        { name: 'Banco Mídia', icon: FileText, path: '/banco-midia', minPlan: 'premium' as UserPlan },
        { name: 'Portal Cidadão', icon: Globe, path: '/portal-cidadao', minPlan: 'enterprise' as UserPlan },
        { name: 'Planos', icon: BookOpen, path: '/planos', minPlan: 'basic' as UserPlan },
      ]
    }
  ];

  const hasAccessToPlan = (minPlan: UserPlan) => {
    const planLevels: Record<UserPlan, number> = { basic: 1, premium: 2, enterprise: 3 };
    const userLevel = planLevels[userPlan];
    const requiredLevel = planLevels[minPlan];
    return userLevel >= requiredLevel;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-center h-14 border-b border-gray-100 px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">PP</span>
          </div>
          <span className="text-lg font-bold text-gray-800">
            Painel Político
          </span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuGroups.map((group) => {
          const hasAnyAccess = group.items.some(item => hasAccessToPlan(item.minPlan));
          if (!hasAnyAccess && !isAdmin()) return null;

          const isGroupOpen = openGroups.includes(group.id);
          
          return (
            <Collapsible key={group.id} open={isGroupOpen} onOpenChange={() => toggleGroup(group.id)}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-2 h-8 font-medium text-gray-700 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <group.icon className="w-4 h-4" />
                    <span className="text-sm">{group.label}</span>
                  </div>
                  {isGroupOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-0.5 ml-2 mt-1">
                {group.items.map((item) => {
                  const hasAccess = hasAccessToPlan(item.minPlan) || isAdmin();
                  if (!hasAccess) return null;

                  return (
                    <Link
                      to={item.path}
                      key={item.name}
                      className={cn(
                        "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors",
                        location.pathname === item.path 
                          ? "bg-blue-50 text-blue-700 border-l-2 border-blue-600" 
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="text-xs">{item.name}</span>
                      {!hasAccessToPlan(item.minPlan) && isAdmin() && (
                        <Badge variant="outline" className="ml-auto text-xs">Admin</Badge>
                      )}
                    </Link>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </nav>

      {/* Bottom Stats Card */}
      <div className="p-3 border-t border-gray-100">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-blue-900">Resumo Hoje</h4>
              <TrendingUp className="w-3 h-3 text-blue-600" />
            </div>
            {loading ? (
              <div className="text-xs text-blue-800">Carregando...</div>
            ) : (
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="flex flex-col">
                  <span className="text-blue-700 text-xs">Demandas</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs h-5">
                    {stats.demandas_pendentes}
                  </Badge>
                </div>
                <div className="flex flex-col">
                  <span className="text-blue-700 text-xs">Eventos</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs h-5">
                    {stats.eventos_hoje}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status */}
        <div className="mt-2 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <CheckCircle className="w-3 h-3 text-green-600" />
            <span className="text-xs text-gray-600">Online</span>
          </div>
          <div className="text-xs text-gray-500">
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
          "fixed left-0 top-0 z-50 h-full w-64 bg-white border-r border-gray-200 transition-transform duration-300",
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
