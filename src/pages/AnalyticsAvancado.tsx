
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertasAutomaticos } from '@/components/analytics/AlertasAutomaticos';
import { DashboardEleitoral } from '@/components/analytics/DashboardEleitoral';
import { RelatoriosPDF } from '@/components/analytics/RelatoriosPDF';
import { DashboardRedesSociais } from '@/components/analytics/DashboardRedesSociais';
import { MonitoramentoConfig } from '@/components/analytics/MonitoramentoConfig';
import { HeatmapGeografico } from '@/components/analytics/HeatmapGeografico';
import { ComparativosPage } from '@/components/analytics/ComparativosPage';
import { 
  BarChart3, 
  TrendingUp, 
  Brain, 
  FileText, 
  Bell,
  Vote,
  Share2,
  Settings,
  Map,
  GitCompare
} from "lucide-react";

const AnalyticsAvancado = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Analytics Avançado
          </h1>
          <p className="text-gray-600 mt-2">
            Análise inteligente e relatórios automatizados
          </p>
        </div>
      </div>

      {/* Tabs de Navegação */}
      <Tabs defaultValue="kpis" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="kpis" className="flex items-center gap-1">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">KPIs</span>
          </TabsTrigger>
          <TabsTrigger value="eleitoral" className="flex items-center gap-1">
            <Vote className="w-4 h-4" />
            <span className="hidden sm:inline">Eleitoral</span>
          </TabsTrigger>
          <TabsTrigger value="redes" className="flex items-center gap-1">
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Redes</span>
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
          <TabsTrigger value="config" className="flex items-center gap-1">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Config</span>
          </TabsTrigger>
        </TabsList>

        {/* KPIs Personalizáveis */}
        <TabsContent value="kpis" className="space-y-6">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
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

        {/* Dashboard Eleitoral */}
        <TabsContent value="eleitoral" className="space-y-6">
          <DashboardEleitoral />
        </TabsContent>

        {/* Dashboard Redes Sociais */}
        <TabsContent value="redes" className="space-y-6">
          <DashboardRedesSociais />
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

        {/* Configurações de Monitoramento */}
        <TabsContent value="config" className="space-y-6">
          <MonitoramentoConfig />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsAvancado;
