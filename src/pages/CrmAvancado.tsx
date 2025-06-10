
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SegmentacaoAvancada } from "@/components/segmentacao/SegmentacaoAvancada";
import { CentralAtendimento } from "@/components/tickets/CentralAtendimento";
import { AuditoriaAvancada } from "@/components/admin/AuditoriaAvancada";
import { CampanhasIntegradas } from "@/components/campanhas/CampanhasIntegradas";
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
            <CampanhasIntegradas />
          </TabsContent>

          <TabsContent value="atendimento">
            <CentralAtendimento />
          </TabsContent>

          <TabsContent value="auditoria">
            <AuditoriaAvancada />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CrmAvancado;
