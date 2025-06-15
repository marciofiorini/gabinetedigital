
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConsentManager } from '@/components/ConsentManager';
import { ConsentNotificationManager } from '@/components/ConsentNotificationManager';
import { DigitalSignature } from '@/components/DigitalSignature';
import { DeletionWorkflow } from '@/components/DeletionWorkflow';
import { Shield, Bell, FileSignature, Trash2 } from 'lucide-react';

export const LGPDCompliance = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="consent" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="consent" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Consentimentos
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="signature" className="flex items-center gap-2">
            <FileSignature className="w-4 h-4" />
            Assinatura Digital
          </TabsTrigger>
          <TabsTrigger value="deletion" className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Remoção
          </TabsTrigger>
        </TabsList>

        <TabsContent value="consent">
          <ConsentManager />
        </TabsContent>

        <TabsContent value="notifications">
          <ConsentNotificationManager />
        </TabsContent>

        <TabsContent value="signature">
          <DigitalSignature 
            consentType="data_processing"
            termsText="Autorizo o processamento dos meus dados pessoais conforme descrito na política de privacidade, para as finalidades específicas mencionadas, pelo período determinado e com base no consentimento livre e informado."
          />
        </TabsContent>

        <TabsContent value="deletion">
          <DeletionWorkflow />
        </TabsContent>
      </Tabs>
    </div>
  );
};
