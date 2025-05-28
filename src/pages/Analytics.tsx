
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users, MapPin, Upload, Calendar, Eye, Settings } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { DadosEleitoraisUpload } from "@/components/analytics/DadosEleitoraisUpload";
import { DadosRedesSociaisUpload } from "@/components/analytics/DadosRedesSociaisUpload";
import { DashboardEleitoral } from "@/components/analytics/DashboardEleitoral";
import { DashboardRedesSociais } from "@/components/analytics/DashboardRedesSociais";
import { ComparativosPage } from "@/components/analytics/ComparativosPage";
import { MonitoramentoConfig } from "@/components/analytics/MonitoramentoConfig";

const Analytics = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Analytics Político - BI
            </h1>
            <p className="text-gray-600">
              Análise completa de dados eleitorais e redes sociais
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="eleitoral" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Dados Eleitorais
              </TabsTrigger>
              <TabsTrigger value="redes" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Redes Sociais
              </TabsTrigger>
              <TabsTrigger value="comparativos" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Comparativos
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Dados
              </TabsTrigger>
              <TabsTrigger value="config" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configurações
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DashboardEleitoral />
                <DashboardRedesSociais />
              </div>
            </TabsContent>

            <TabsContent value="eleitoral">
              <DashboardEleitoral detalhado />
            </TabsContent>

            <TabsContent value="redes">
              <DashboardRedesSociais detalhado />
            </TabsContent>

            <TabsContent value="comparativos">
              <ComparativosPage />
            </TabsContent>

            <TabsContent value="upload" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DadosEleitoraisUpload />
                <DadosRedesSociaisUpload />
              </div>
            </TabsContent>

            <TabsContent value="config">
              <MonitoramentoConfig />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Analytics;
