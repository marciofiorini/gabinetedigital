import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertasAutomaticos } from '@/components/analytics/AlertasAutomaticos';
import { GestaoEleitoralAvancada } from '@/components/analytics/GestaoEleitoralAvancada';
import { RelatoriosPDF } from '@/components/analytics/RelatoriosPDF';
import { DashboardRedesSociais } from '@/components/analytics/DashboardRedesSociais';
import { MonitoramentoConfig } from '@/components/analytics/MonitoramentoConfig';
import { HeatmapGeografico } from '@/components/analytics/HeatmapGeografico';
import { ComparativosPage } from '@/components/analytics/ComparativosPage';
import { DadosEleitoraisUpload } from '@/components/analytics/DadosEleitoraisUpload';
import { DadosRedesSociaisUpload } from '@/components/analytics/DadosRedesSociaisUpload';
import { GestaoFinanceiraCompleta } from '@/components/analytics/GestaoFinanceiraCompleta';
import { SecureUploadCSVLideres } from '@/components/SecureUploadCSVLideres';
import { SecureUploadCSVContatos } from '@/components/SecureUploadCSVContatos';
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
  Download,
  Upload,
  Database,
  Brain, 
  FileText, 
  Bell,
  Vote,
  Share2,
  Settings,
  Map,
  GitCompare,
  DollarSign
} from "lucide-react";

const AnalyticsAvancado = () => {
  // Métricas principais consolidadas
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Analytics Completo
          </h1>
          <p className="text-gray-600 mt-2">
            Centro completo de análise e relatórios inteligentes
          </p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
          <Download className="w-4 h-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {/* Tabs de Navegação */}
      <Tabs defaultValue="visao-geral" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-11">
          <TabsTrigger value="visao-geral" className="flex items-center gap-1">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Geral</span>
          </TabsTrigger>
          <TabsTrigger value="canais" className="flex items-center gap-1">
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Canais</span>
          </TabsTrigger>
          <TabsTrigger value="kpis" className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">KPIs</span>
          </TabsTrigger>
          <TabsTrigger value="eleitoral" className="flex items-center gap-1">
            <Vote className="w-4 h-4" />
            <span className="hidden sm:inline">Eleitoral</span>
          </TabsTrigger>
          <TabsTrigger value="financeiro" className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            <span className="hidden sm:inline">Financeiro</span>
          </TabsTrigger>
          <TabsTrigger value="relatorios" className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Relatórios</span>
          </TabsTrigger>
          <TabsTrigger value="alertas" className="flex items-center gap-1">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Alertas</span>
          </TabsTrigger>
          <TabsTrigger value="mapa" className="flex items-center gap-1">
            <Map className="w-4 h-4" />
            <span className="hidden sm:inline">Mapa</span>
          </TabsTrigger>
          <TabsTrigger value="comparativo" className="flex items-center gap-1">
            <GitCompare className="w-4 h-4" />
            <span className="hidden sm:inline">Comparativo</span>
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-1">
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Upload</span>
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center gap-1">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Config</span>
          </TabsTrigger>
        </TabsList>

        {/* Visão Geral - Métricas Consolidadas */}
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

        {/* Canais - Dashboard de Redes Sociais */}
        <TabsContent value="canais" className="space-y-6">
          <DashboardRedesSociais />
        </TabsContent>

        {/* KPIs Personalizáveis */}
        <TabsContent value="kpis" className="space-y-6">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-6 h-6 text-blue-600" />
                KPIs Personalizáveis
              </CardTitle>
              <CardDescription>
                Crie e monitore métricas customizadas para seu negócio político
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Dashboard de KPIs Personalizados</h3>
                <p className="text-gray-500 mb-4">Configure métricas específicas e acompanhe o desempenho em tempo real</p>
                <div className="text-sm text-gray-400">
                  Funcionalidade em desenvolvimento - Em breve você poderá criar KPIs customizados
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestão Eleitoral Avançada */}
        <TabsContent value="eleitoral" className="space-y-6">
          <GestaoEleitoralAvancada />
        </TabsContent>

        {/* Gestão Financeira Completa - NOVA ABA */}
        <TabsContent value="financeiro" className="space-y-6">
          <GestaoFinanceiraCompleta />
        </TabsContent>

        {/* Relatórios PDF */}
        <TabsContent value="relatorios" className="space-y-6">
          <RelatoriosPDF />
        </TabsContent>

        {/* Alertas Automáticos */}
        <TabsContent value="alertas" className="space-y-6">
          <AlertasAutomaticos />
        </TabsContent>

        {/* Heatmap Geográfico */}
        <TabsContent value="mapa" className="space-y-6">
          <HeatmapGeografico />
        </TabsContent>

        {/* Comparativos Temporais */}
        <TabsContent value="comparativo" className="space-y-6">
          <ComparativosPage />
        </TabsContent>

        {/* Upload de Dados - UPDATED TO USE SECURE COMPONENTS */}
        <TabsContent value="upload" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SecureUploadCSVLideres />
            <SecureUploadCSVContatos />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DadosEleitoraisUpload />
            <DadosRedesSociaisUpload />
          </div>
        </TabsContent>

        {/* Configurações de Monitoramento */}
        <TabsContent value="config" className="space-y-6">
          <MonitoramentoConfig />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsAvancado;
