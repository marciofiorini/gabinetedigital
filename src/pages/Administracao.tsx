
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArquivoDigitalManager } from '@/components/arquivos/ArquivoDigitalManager';
import { RelacionamentoInstitucionalManager } from '@/components/institucional/RelacionamentoInstitucionalManager';

const Administracao = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Administração</h1>
        <p className="text-gray-600">Gestão administrativa e relacionamentos institucionais</p>
      </div>

      <Tabs defaultValue="arquivo" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="arquivo">Arquivo Digital</TabsTrigger>
          <TabsTrigger value="relacionamentos">Relacionamentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="arquivo">
          <ArquivoDigitalManager />
        </TabsContent>
        
        <TabsContent value="relacionamentos">
          <RelacionamentoInstitucionalManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Administracao;
