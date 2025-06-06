
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SegmentacaoAvancada } from "@/components/segmentacao/SegmentacaoAvancada";
import { CentralAtendimento } from "@/components/tickets/CentralAtendimento";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, Mail, Shield } from "lucide-react";

const CrmAvancado = () => {
  const [activeTab, setActiveTab] = useState("segmentacao");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">CRM Avançado</h1>
          <p className="text-gray-600 mt-2">
            Ferramentas avançadas para gestão de relacionamento e automação
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="segmentacao" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Segmentação
            </TabsTrigger>
            <TabsTrigger value="campanhas" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Campanhas
            </TabsTrigger>
            <TabsTrigger value="atendimento" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Atendimento
            </TabsTrigger>
            <TabsTrigger value="auditoria" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Auditoria
            </TabsTrigger>
          </TabsList>

          <TabsContent value="segmentacao">
            <SegmentacaoAvancada />
          </TabsContent>

          <TabsContent value="campanhas">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Automação de Marketing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Em desenvolvimento: Campanhas automatizadas baseadas em comportamento
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Funcionalidades Planejadas:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Campanhas de email automatizadas</li>
                      <li>• Triggers baseados em ações dos contatos</li>
                      <li>• Templates personalizáveis</li>
                      <li>• Análise de performance em tempo real</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="atendimento">
            <CentralAtendimento />
          </TabsContent>

          <TabsContent value="auditoria">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Auditoria de Ações</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Em desenvolvimento: Log completo de todas as ações do sistema
                  </p>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Funcionalidades Planejadas:</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Rastreamento completo de ações dos usuários</li>
                      <li>• Filtros avançados por módulo e data</li>
                      <li>• Relatórios de segurança</li>
                      <li>• Alertas de atividades suspeitas</li>
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

export default CrmAvancado;
