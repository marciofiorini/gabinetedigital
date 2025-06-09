
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  Gift,
  Plus,
  ArrowRight,
  Phone,
  Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardMobile = () => {
  const { user, profile } = useAuth();
  const { stats, loading } = useDashboardStats();

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const quickStats = [
    {
      title: 'Demandas Pendentes',
      value: stats?.demandas_pendentes || 0,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      path: '/demandas'
    },
    {
      title: 'Eventos Hoje',
      value: stats?.eventos_hoje || 0,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      path: '/agenda'
    },
    {
      title: 'Novos Contatos',
      value: stats?.novos_contatos_hoje || 0,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      path: '/contatos'
    },
    {
      title: 'Leads Novos',
      value: stats?.leads_novos || 0,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      path: '/leads'
    },
    {
      title: 'Aniversariantes',
      value: stats?.aniversariantes_hoje || 0,
      icon: Gift,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      path: '/aniversariantes'
    }
  ];

  const quickActions = [
    {
      title: 'Novo Contato',
      description: 'Adicionar pessoa à base',
      icon: Users,
      path: '/contatos',
      color: 'bg-blue-600'
    },
    {
      title: 'Novo Lead',
      description: 'Cadastrar prospect',
      icon: TrendingUp,
      path: '/leads',
      color: 'bg-green-600'
    },
    {
      title: 'Nova Demanda',
      description: 'Registrar solicitação',
      icon: AlertCircle,
      path: '/demandas',
      color: 'bg-orange-600'
    },
    {
      title: 'Novo Evento',
      description: 'Agendar compromisso',
      icon: Calendar,
      path: '/agenda',
      color: 'bg-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Olá, {profile?.name?.split(' ')[0] || 'Usuário'}! 👋
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link key={index} to={stat.path}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                        <Icon className={`w-4 h-4 ${stat.color}`} />
                      </div>
                      <ArrowRight className="w-3 h-3 text-gray-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                        {stat.title}
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
            <CardDescription>
              Acesse rapidamente as funcionalidades mais usadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} to={action.path}>
                  <div className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className={`p-2 rounded-lg ${action.color} mr-3`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {action.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {action.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        {/* Próximos Eventos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Próximos Eventos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Nenhum evento próximo
              </p>
              <Link to="/agenda">
                <Button size="sm" className="mt-2">
                  Ver Agenda
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Contatos em Destaque */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5" />
              Contatos Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Nenhum contato recente
              </p>
              <Link to="/contatos">
                <Button size="sm" className="mt-2">
                  Ver Contatos
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Links Rápidos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Links Úteis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <a href="https://wa.me/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="w-full">
                  <Phone className="w-3 h-3 mr-1" />
                  WhatsApp
                </Button>
              </a>
              <a href="mailto:" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="w-full">
                  <Mail className="w-3 h-3 mr-1" />
                  E-mail
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
