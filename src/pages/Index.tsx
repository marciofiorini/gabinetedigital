import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, MessageSquare, Calendar, MessageCircle, TrendingUp, AlertCircle, Crown } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";

const Index = () => {
  const { stats, loading } = useDashboardStats();

  const statsCards = [
    {
      title: "Demandas Pendentes",
      value: loading ? "..." : stats.demandas_pendentes.toString(),
      change: "+12%",
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Leads Novos",
      value: loading ? "..." : stats.leads_novos.toString(),
      change: "+8%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Novos Contatos Hoje",
      value: loading ? "..." : stats.novos_contatos_hoje.toString(),
      change: "+2",
      icon: MessageCircle,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Novos Líderes",
      value: loading ? "..." : stats.novos_lideres.toString(),
      change: "+3",
      icon: Crown,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "demanda",
      title: "Nova demanda: Iluminação Pública",
      description: "Rua das Flores, Centro",
      time: "2 horas atrás",
      status: "pendente"
    },
    {
      id: 2,
      type: "evento",
      title: "Reunião com lideranças",
      description: "Sala de reuniões - 14:00",
      time: "Hoje",
      status: "agendado"
    },
    {
      id: 3,
      type: "whatsapp",
      title: "Mensagem enviada: Grupo Zona Norte",
      description: "Relatório semanal das atividades",
      time: "1 dia atrás",
      status: "enviado"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Dashboard - Gabinete Digital
        </h1>
        <p className="text-gray-600 text-sm">
          Gestão estratégica e integrada do seu mandato
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <Badge variant="secondary" className="mt-2">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Métricas de Engajamento */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5" />
              Métricas de Engajamento
            </CardTitle>
            <CardDescription>
              Performance das suas redes sociais e WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">WhatsApp</span>
                  <span className="text-sm text-gray-600">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Instagram</span>
                  <span className="text-sm text-gray-600">72%</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">E-mail</span>
                  <span className="text-sm text-gray-600">68%</span>
                </div>
                <Progress value={68} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Próximos Eventos */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5" />
              Próximos Eventos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Audiência Pública</p>
                  <p className="text-xs text-gray-600">Hoje, 14:00</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Reunião com Prefeitos</p>
                  <p className="text-xs text-gray-600">Amanhã, 09:00</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Live Instagram</p>
                  <p className="text-xs text-gray-600">Sexta, 18:00</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Atividades Recentes */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Atividades Recentes</CardTitle>
          <CardDescription>
            Últimas ações e atualizações do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0">
                  {activity.type === 'demanda' && <AlertCircle className="w-5 h-5 text-orange-600" />}
                  {activity.type === 'evento' && <Calendar className="w-5 h-5 text-blue-600" />}
                  {activity.type === 'whatsapp' && <MessageSquare className="w-5 h-5 text-green-600" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">{activity.title}</h4>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{activity.time}</p>
                  <Badge 
                    variant={activity.status === 'enviado' ? 'default' : 'secondary'}
                    className="mt-1"
                  >
                    {activity.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
