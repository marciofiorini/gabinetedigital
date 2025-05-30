
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, MessageSquare, Calendar, MessageCircle, TrendingUp, AlertCircle, Cake } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { DashboardCharts } from "@/components/DashboardCharts";
import { AniversariantesSection } from "@/components/AniversariantesSection";

const Index = () => {
  const { stats, loading } = useDashboardStats();

  console.log('Index - Renderizando:', { stats, loading });

  const statsCards = [
    {
      title: "Demandas Pendentes",
      value: loading ? "..." : (stats?.demandas_pendentes?.toString() || "0"),
      change: "+12%",
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20"
    },
    {
      title: "Leads Novos",
      value: loading ? "..." : (stats?.leads_novos?.toString() || "0"),
      change: "+8%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      title: "Novos Contatos Hoje",
      value: loading ? "..." : (stats?.novos_contatos_hoje?.toString() || "0"),
      change: "+2",
      icon: MessageCircle,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20"
    },
    {
      title: "Aniversariantes Hoje",
      value: loading ? "..." : (stats?.aniversariantes_hoje?.toString() || "0"),
      change: "+3",
      icon: Cake,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20"
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="space-y-6 p-4 lg:p-6">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            Dashboard - Gabinete Digital
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Gestão estratégica e integrada do seu mandato
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {stat.value}
                      </p>
                      <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
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

        {/* Charts Section */}
        <DashboardCharts />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Métricas de Engajamento */}
          <Card className="lg:col-span-2 border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-gray-100">
                <TrendingUp className="w-5 h-5" />
                Métricas de Engajamento
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Performance das suas redes sociais e WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium dark:text-gray-300">WhatsApp</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium dark:text-gray-300">Instagram</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">72%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium dark:text-gray-300">E-mail</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Próximos Eventos */}
          <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-gray-100">
                <Calendar className="w-5 h-5" />
                Próximos Eventos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-sm dark:text-gray-200">Audiência Pública</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Hoje, 14:00</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-sm dark:text-gray-200">Reunião com Prefeitos</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Amanhã, 09:00</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-sm dark:text-gray-200">Live Instagram</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Sexta, 18:00</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Aniversariantes Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <AniversariantesSection />
          
          {/* Card placeholder para manter o layout balanceado */}
          <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-gray-100">
                <TrendingUp className="w-5 h-5" />
                Resumo Semanal
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Principais métricas da semana
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Demandas resolvidas</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">+15</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Novos leads</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">+23</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Eventos realizados</span>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">8</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Atividades Recentes */}
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Atividades Recentes</CardTitle>
            <CardDescription className="dark:text-gray-400">
              Últimas ações e atualizações do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex-shrink-0">
                    {activity.type === 'demanda' && <AlertCircle className="w-5 h-5 text-orange-600" />}
                    {activity.type === 'evento' && <Calendar className="w-5 h-5 text-blue-600" />}
                    {activity.type === 'whatsapp' && <MessageSquare className="w-5 h-5 text-green-600" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">{activity.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{activity.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
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
    </div>
  );
};

export default Index;
