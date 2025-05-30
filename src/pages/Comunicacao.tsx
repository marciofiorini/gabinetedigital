
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageCircle, 
  Mail, 
  Bell, 
  Phone,
  Send,
  Users,
  BarChart3,
  Settings,
  Zap
} from 'lucide-react';
import { MessagingSystem } from '@/components/MessagingSystem';
import { NotificationSystem } from '@/components/NotificationSystem';
import { NotificationBell } from '@/components/NotificationBell';
import { useRealTimeNotifications } from '@/hooks/useRealTimeNotifications';

const Comunicacao = () => {
  const { unreadCount } = useRealTimeNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  const communicationStats = [
    { 
      label: 'Mensagens Não Lidas', 
      valor: '12', 
      cor: 'from-blue-500 to-blue-600', 
      icon: MessageCircle,
      trend: '+3 hoje'
    },
    { 
      label: 'Notificações Ativas', 
      valor: unreadCount.toString(), 
      cor: 'from-orange-500 to-orange-600', 
      icon: Bell,
      trend: '+5 hoje'
    },
    { 
      label: 'Campanhas Email', 
      valor: '8', 
      cor: 'from-green-500 to-green-600', 
      icon: Mail,
      trend: '2 enviadas'
    },
    { 
      label: 'WhatsApp Enviados', 
      valor: '156', 
      cor: 'from-purple-500 to-purple-600', 
      icon: Phone,
      trend: '+45 hoje'
    }
  ];

  const quickActions = [
    {
      title: 'Nova Mensagem',
      description: 'Enviar mensagem para usuário',
      icon: Send,
      color: 'bg-blue-500',
      action: () => console.log('Nova mensagem')
    },
    {
      title: 'Broadcast Email',
      description: 'Enviar email para lista',
      icon: Mail,
      color: 'bg-green-500',
      action: () => console.log('Broadcast email')
    },
    {
      title: 'Push Notification',
      description: 'Enviar notificação push',
      icon: Bell,
      color: 'bg-orange-500',
      action: () => setShowNotifications(true)
    },
    {
      title: 'WhatsApp Blast',
      description: 'Campanha WhatsApp',
      icon: Phone,
      color: 'bg-purple-500',
      action: () => console.log('WhatsApp blast')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Centro de Comunicação
          </h1>
          <p className="text-gray-600">
            Gerencie todas as suas comunicações em um só lugar
          </p>
        </div>
        <div className="flex items-center gap-3">
          <NotificationBell />
          <Button variant="outline" className="hover:bg-blue-50">
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {communicationStats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.cor} flex items-center justify-center mr-4`}>
                    <stat.icon className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.valor}</p>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <Badge variant="secondary" className="text-xs">
                  {stat.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Ações Rápidas
          </CardTitle>
          <CardDescription>
            Acesso rápido às principais funcionalidades de comunicação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                onClick={action.action}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{action.title}</h4>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Communication Tabs */}
      <Tabs defaultValue="mensagens" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="mensagens" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Mensagens
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            WhatsApp
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mensagens" className="space-y-6">
          <MessagingSystem />
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Email Marketing
              </CardTitle>
              <CardDescription>
                Gerencie campanhas de email e newsletters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Mail className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">Sistema de email marketing em desenvolvimento</p>
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  Configurar Email Marketing
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Integração WhatsApp
              </CardTitle>
              <CardDescription>
                Envie notificações e campanhas via WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Phone className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">Integração WhatsApp em desenvolvimento</p>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Configurar WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Analytics de Comunicação
              </CardTitle>
              <CardDescription>
                Métricas e performance das suas comunicações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">Taxa de Abertura Email</h4>
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-3xl font-bold text-blue-800 dark:text-blue-200">68%</p>
                  <p className="text-sm text-blue-600 dark:text-blue-300 mt-2">+5% vs. mês anterior</p>
                </div>

                <div className="p-6 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-green-900 dark:text-green-100">Mensagens Respondidas</h4>
                    <MessageCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-green-800 dark:text-green-200">92%</p>
                  <p className="text-sm text-green-600 dark:text-green-300 mt-2">+8% vs. mês anterior</p>
                </div>

                <div className="p-6 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100">WhatsApp Entregues</h4>
                    <Phone className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-3xl font-bold text-purple-800 dark:text-purple-200">98%</p>
                  <p className="text-sm text-purple-600 dark:text-purple-300 mt-2">+2% vs. mês anterior</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Notification System Modal */}
      {showNotifications && (
        <NotificationSystem />
      )}
    </div>
  );
};

export default Comunicacao;
