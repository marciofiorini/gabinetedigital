
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target, 
  Activity,
  Eye,
  MessageCircle,
  Mail,
  Instagram,
  Download
} from "lucide-react";

const Analytics = () => {
  const metricas = [
    {
      titulo: "Alcance Total",
      valor: "24.8k",
      mudanca: "+12%",
      tipo: "up",
      icone: Eye,
      cor: "from-blue-500 to-blue-600"
    },
    {
      titulo: "Engajamento",
      valor: "8.2%",
      mudanca: "+2.1%",
      tipo: "up",
      icone: Activity,
      cor: "from-green-500 to-green-600"
    },
    {
      titulo: "Novos Seguidores",
      valor: "1.2k",
      mudanca: "-5%",
      tipo: "down",
      icone: Users,
      cor: "from-purple-500 to-purple-600"
    },
    {
      titulo: "Taxa Conversão",
      valor: "3.8%",
      mudanca: "+0.8%",
      tipo: "up",
      icone: Target,
      cor: "from-orange-500 to-orange-600"
    }
  ];

  const canais = [
    {
      nome: "Instagram",
      alcance: "12.5k",
      engajamento: "9.2%",
      crescimento: "+15%",
      icone: Instagram,
      cor: "text-pink-600"
    },
    {
      nome: "WhatsApp",
      alcance: "8.3k",
      engajamento: "7.8%",
      crescimento: "+8%",
      icone: MessageCircle,
      cor: "text-green-600"
    },
    {
      nome: "E-mail",
      alcance: "4.0k",
      engajamento: "6.5%",
      crescimento: "+12%",
      icone: Mail,
      cor: "text-blue-600"
    }
  ];

  const topPosts = [
    {
      id: 1,
      titulo: "Audiência Pública - Mobilidade Urbana",
      canal: "Instagram",
      alcance: "5.2k",
      engajamento: "12.8%",
      data: "2024-05-27"
    },
    {
      id: 2,
      titulo: "Visita ao Hospital Municipal",
      canal: "WhatsApp",
      alcance: "3.8k",
      engajamento: "9.1%",
      data: "2024-05-26"
    },
    {
      id: 3,
      titulo: "Proposta: Mais Áreas Verdes",
      canal: "Instagram",
      alcance: "3.2k",
      engajamento: "11.5%",
      data: "2024-05-25"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Analytics
          </h1>
          <p className="text-gray-600">
            Acompanhe o desempenho de suas campanhas e comunicação
          </p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
          <Download className="w-4 h-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      <Tabs defaultValue="visao-geral" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="canais">Por Canal</TabsTrigger>
          <TabsTrigger value="conteudo">Conteúdo</TabsTrigger>
          <TabsTrigger value="comparativo">Comparativo</TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="space-y-6">
          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {metricas.map((metrica, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${metrica.cor} flex items-center justify-center`}>
                      <metrica.icone className="text-white w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-1">
                      {metrica.tipo === "up" ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <span className={`text-sm font-semibold ${
                        metrica.tipo === "up" ? "text-green-600" : "text-red-600"
                      }`}>
                        {metrica.mudanca}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{metrica.titulo}</p>
                    <p className="text-2xl font-bold text-gray-900">{metrica.valor}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Gráfico Principal */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Evolução do Alcance - Últimos 30 dias
              </CardTitle>
              <CardDescription>
                Acompanhe o crescimento do seu alcance ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Gráfico de evolução será implementado aqui</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Posts */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Top Posts da Semana
              </CardTitle>
              <CardDescription>
                Seus conteúdos com melhor desempenho
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPosts.map((post, index) => (
                  <div key={post.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-indigo-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{post.titulo}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <Badge variant="outline">{post.canal}</Badge>
                          <span>{post.data}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Alcance</p>
                          <p className="font-semibold text-gray-900">{post.alcance}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Engajamento</p>
                          <p className="font-semibold text-green-600">{post.engajamento}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="canais" className="space-y-6">
          {/* Performance por Canal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {canais.map((canal, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <canal.icone className={`w-8 h-8 ${canal.cor}`} />
                      <h3 className="font-semibold text-gray-900">{canal.nome}</h3>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {canal.crescimento}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Alcance</span>
                      <span className="font-semibold">{canal.alcance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Engajamento</span>
                      <span className="font-semibold text-green-600">{canal.engajamento}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Gráfico Comparativo */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Comparativo de Canais
              </CardTitle>
              <CardDescription>
                Performance de cada canal ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Gráfico comparativo será implementado aqui</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conteudo" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Análise de conteúdo será implementada aqui</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparativo" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Relatórios comparativos serão implementados aqui</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
