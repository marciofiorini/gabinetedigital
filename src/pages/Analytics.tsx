
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DadosEleitoraisUpload } from "@/components/analytics/DadosEleitoraisUpload";
import { DadosRedesSociaisUpload } from "@/components/analytics/DadosRedesSociaisUpload";
import { DashboardEleitoral } from "@/components/analytics/DashboardEleitoral";
import { DashboardRedesSociais } from "@/components/analytics/DashboardRedesSociais";
import { ComparativosPage } from "@/components/analytics/ComparativosPage";
import { MonitoramentoConfig } from "@/components/analytics/MonitoramentoConfig";
import { RelatoriosPDF } from "@/components/analytics/RelatoriosPDF";
import { AlertasAutomaticos } from "@/components/analytics/AlertasAutomaticos";
import { HeatmapGeografico } from "@/components/analytics/HeatmapGeografico";
import { 
  BarChart3, 
  Upload, 
  GitCompare, 
  Settings, 
  FileText, 
  Bell, 
  MapPin,
  TrendingUp
} from "lucide-react";

const Analytics = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Business Intelligence Político
          </h1>
          <p className="text-gray-600">
            Análise completa de dados eleitorais e redes sociais
          </p>
        </div>
      </div>

      <Tabs defaultValue="dashboards" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="dashboards">
            <BarChart3 className="w-4 h-4 mr-2" />
            Dashboards
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="comparativos">
            <GitCompare className="w-4 h-4 mr-2" />
            Comparativos
          </TabsTrigger>
          <TabsTrigger value="heatmap">
            <MapPin className="w-4 h-4 mr-2" />
            Heatmap
          </TabsTrigger>
          <TabsTrigger value="relatorios">
            <FileText className="w-4 h-4 mr-2" />
            Relatórios
          </TabsTrigger>
          <TabsTrigger value="alertas">
            <Bell className="w-4 h-4 mr-2" />
            Alertas
          </TabsTrigger>
          <TabsTrigger value="config">
            <Settings className="w-4 h-4 mr-2" />
            Config
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboards" className="space-y-6">
          <Tabs defaultValue="eleitoral">
            <TabsList>
              <TabsTrigger value="eleitoral">Dados Eleitorais</TabsTrigger>
              <TabsTrigger value="redes">Redes Sociais</TabsTrigger>
            </TabsList>
            
            <TabsContent value="eleitoral">
              <DashboardEleitoral detalhado={true} />
            </TabsContent>
            
            <TabsContent value="redes">
              <DashboardRedesSociais detalhado={true} />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <DadosEleitoraisUpload />
            <DadosRedesSociaisUpload />
          </div>
        </TabsContent>

        <TabsContent value="comparativos">
          <ComparativosPage />
        </TabsContent>

        <TabsContent value="heatmap">
          <HeatmapGeografico />
        </TabsContent>

        <TabsContent value="relatorios">
          <RelatoriosPDF />
        </TabsContent>

        <TabsContent value="alertas">
          <AlertasAutomaticos />
        </TabsContent>

        <TabsContent value="config">
          <MonitoramentoConfig />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
