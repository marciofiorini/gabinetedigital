
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssistenteVirtual } from "@/components/ia/AssistenteVirtual";
import { AnalisePredicativa } from "@/components/ia/AnalisePredicativa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Brain, TrendingUp, Zap } from "lucide-react";

const AssistenteIA = () => {
  const [activeTab, setActiveTab] = useState("assistente");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Assistente Inteligente</h1>
          <p className="text-gray-600 mt-2">
            Inteligência artificial para decisões políticas estratégicas
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="assistente" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              Chat IA
            </TabsTrigger>
            <TabsTrigger value="predicoes" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Análise Preditiva
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assistente">
            <AssistenteVirtual />
          </TabsContent>

          <TabsContent value="predicoes">
            <AnalisePredicativa />
          </TabsContent>

          <TabsContent value="insights">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Insights Automáticos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Em desenvolvimento: Sistema de insights automáticos baseado em IA
                  </p>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-medium text-orange-900 mb-2">Funcionalidades Planejadas:</h4>
                    <ul className="text-sm text-orange-800 space-y-1">
                      <li>• Análise automática de padrões nos dados</li>
                      <li>• Recomendações estratégicas personalizadas</li>
                      <li>• Alertas de oportunidades e riscos</li>
                      <li>• Benchmarking com outras campanhas</li>
                      <li>• Otimização automática de estratégias</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AssistenteIA;
