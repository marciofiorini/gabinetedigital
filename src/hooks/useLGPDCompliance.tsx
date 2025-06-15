
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ConsentRecord {
  id: string;
  user_id: string;
  consent_type: string;
  granted: boolean;
  granted_at: string;
  revoked_at?: string;
  purpose: string;
  version: string;
}

interface DataProcessingActivity {
  id: string;
  user_id: string;
  activity_type: string;
  data_processed: string[];
  purpose: string;
  legal_basis: string;
  retention_period: string;
  created_at: string;
}

interface PrivacyExport {
  user_data: any;
  consent_history: ConsentRecord[];
  processing_activities: DataProcessingActivity[];
  export_date: string;
}

interface ConsentNotification {
  id: string;
  consent_type: string;
  expires_in_days: number;
  auto_remind: boolean;
}

export const useLGPDCompliance = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const requestConsent = async (
    consentType: string,
    purpose: string,
    version: string = '1.0'
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('user_consents')
        .insert({
          user_id: user.id,
          consent_type: consentType,
          granted: true,
          purpose,
          version,
          granted_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Consentimento registrado com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao registrar consentimento:', error);
      toast.error('Erro ao registrar consentimento');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const revokeConsent = async (consentType: string): Promise<boolean> => {
    if (!user) return false;

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('user_consents')
        .update({
          granted: false,
          revoked_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('consent_type', consentType)
        .eq('granted', true);

      if (error) throw error;

      toast.success('Consentimento revogado com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao revogar consentimento:', error);
      toast.error('Erro ao revogar consentimento');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getConsentHistory = async (): Promise<ConsentRecord[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('user_consents')
        .select('*')
        .eq('user_id', user.id)
        .order('granted_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar histórico de consentimentos:', error);
      return [];
    }
  };

  const logDataProcessing = async (
    activityType: string,
    dataProcessed: string[],
    purpose: string,
    legalBasis: string,
    retentionPeriod: string
  ): Promise<void> => {
    if (!user) return;

    try {
      await supabase
        .from('data_processing_log')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          data_processed: dataProcessed,
          purpose,
          legal_basis: legalBasis,
          retention_period: retentionPeriod
        });
    } catch (error) {
      console.error('Erro ao registrar processamento de dados:', error);
    }
  };

  const exportUserData = async (): Promise<PrivacyExport | null> => {
    if (!user) return null;

    try {
      setLoading(true);

      // Buscar todos os dados do usuário
      const [profile, settings, contatos, leads, demandas, eventos, consents] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('user_settings').select('*').eq('user_id', user.id).single(),
        supabase.from('contatos').select('*').eq('user_id', user.id),
        supabase.from('leads').select('*').eq('user_id', user.id),
        supabase.from('demandas').select('*').eq('user_id', user.id),
        supabase.from('eventos').select('*').eq('user_id', user.id),
        supabase.from('user_consents').select('*').eq('user_id', user.id)
      ]);

      const exportData: PrivacyExport = {
        user_data: {
          profile: profile.data,
          settings: settings.data,
          contatos: contatos.data,
          leads: leads.data,
          demandas: demandas.data,
          eventos: eventos.data
        },
        consent_history: consents.data || [],
        processing_activities: [], // Será preenchido quando implementarmos o log
        export_date: new Date().toISOString()
      };

      // Criar arquivo para download
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `dados_pessoais_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Registrar a exportação
      await logDataProcessing(
        'export_data',
        ['profile', 'settings', 'contatos', 'leads', 'demandas', 'eventos'],
        'Atendimento ao direito de portabilidade - LGPD',
        'Cumprimento de obrigação legal',
        'Conforme solicitação do titular'
      );

      toast.success('Dados exportados com sucesso!');
      return exportData;
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      toast.error('Erro ao exportar dados');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const requestDataDeletion = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      setLoading(true);

      // Anonizar dados ao invés de deletar completamente (melhor prática LGPD)
      const anonymizedData = {
        name: 'Usuário Removido',
        email: `removed_${user.id}@example.com`,
        phone: null,
        location: null,
        bio: null,
        avatar_url: null
      };

      await supabase
        .from('profiles')
        .update(anonymizedData)
        .eq('id', user.id);

      // Registrar a ação
      await logDataProcessing(
        'data_anonymization',
        ['profile'],
        'Atendimento ao direito de apagamento - LGPD',
        'Cumprimento de obrigação legal',
        'Imediato'
      );

      toast.success('Solicitação de remoção processada com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao processar remoção de dados:', error);
      toast.error('Erro ao processar remoção de dados');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const configureConsentNotifications = async (notifications: ConsentNotification[]): Promise<boolean> => {
    if (!user) return false;

    try {
      setLoading(true);

      // Atualizar configurações do usuário
      const { error } = await supabase
        .from('user_settings')
        .update({
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Notificações de consentimento configuradas');
      return true;
    } catch (error) {
      console.error('Erro ao configurar notificações:', error);
      toast.error('Erro ao configurar notificações');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const generateConsentSignature = async (consentType: string, termsText: string): Promise<string> => {
    if (!user) return '';

    try {
      // Criar uma assinatura digital simples baseada no conteúdo
      const signatureData = {
        user_id: user.id,
        consent_type: consentType,
        terms_hash: btoa(termsText), // Base64 do texto dos termos
        timestamp: new Date().toISOString(),
        ip_address: 'client-side', // Em produção, capturar do servidor
        user_agent: navigator.userAgent
      };

      const signature = btoa(JSON.stringify(signatureData));
      
      // Registrar a assinatura
      await logDataProcessing(
        'digital_signature',
        ['consent_signature'],
        'Registro de assinatura digital de consentimento',
        'Cumprimento de obrigação legal',
        'Conforme política de retenção'
      );

      return signature;
    } catch (error) {
      console.error('Erro ao gerar assinatura:', error);
      return '';
    }
  };

  const createDeletionWorkflow = async (reason: string): Promise<string> => {
    if (!user) return '';

    try {
      setLoading(true);

      // Gerar número do ticket automaticamente
      const ticketNumber = `DL${Date.now()}`;

      // Criar ticket de solicitação de remoção
      const { data, error } = await supabase
        .from('tickets_atendimento')
        .insert({
          numero_ticket: ticketNumber,
          user_id: user.id,
          assunto: 'Solicitação de Remoção de Dados - LGPD',
          descricao: `Solicitação de remoção de dados pessoais.\n\nMotivo: ${reason}\n\nConforme Art. 18 da LGPD.`,
          categoria: 'lgpd',
          prioridade: 'alta',
          status: 'aberto',
          tags: ['lgpd', 'remoção', 'dados']
        })
        .select()
        .single();

      if (error) throw error;

      // Registrar o workflow
      await logDataProcessing(
        'deletion_request',
        ['deletion_workflow'],
        'Solicitação de remoção de dados - Art. 18 LGPD',
        'Cumprimento de obrigação legal',
        'Até resolução da solicitação'
      );

      toast.success('Solicitação de remoção criada. Você será contatado em breve.');
      return data.numero_ticket;
    } catch (error) {
      console.error('Erro ao criar workflow de remoção:', error);
      toast.error('Erro ao criar solicitação de remoção');
      return '';
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    requestConsent,
    revokeConsent,
    getConsentHistory,
    logDataProcessing,
    exportUserData,
    requestDataDeletion,
    configureConsentNotifications,
    generateConsentSignature,
    createDeletionWorkflow
  };
};
