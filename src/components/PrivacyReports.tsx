
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLGPDCompliance } from '@/hooks/useLGPDCompliance';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FileBarChart, 
  Shield, 
  Clock, 
  Users, 
  Database,
  Download,
  Eye,
  Lock
} from 'lucide-react';

export const PrivacyReports = () => {
  const { user, profile } = useAuth();
  const { getConsentHistory } = useLGPDCompliance();
  const [consentData, setConsentData] = useState<any[]>([]);
  const [privacyScore, setPrivacyScore] = useState(0);

  useEffect(() => {
    loadPrivacyData();
  }, []);

  const loadPrivacyData = async () => {
    const consents = await getConsentHistory();
    setConsentData(consents);
    calculatePrivacyScore(consents);
  };

  const calculatePrivacyScore = (consents: any[]) => {
    let score = 0;
    const maxScore = 100;

    // Pontuação base por ter perfil completo
    if (profile?.name) score += 20;
    if (profile?.email) score += 20;
    if (profile?.phone) score += 10;

    // Pontuação por consentimentos ativos
    const activeConsents = consents.filter(c => c.granted && !c.revoked_at);
    score += Math.min(activeConsents.length * 10, 30);

    // Pontuação por ter configurações de privacidade
    score += 20;

    setPrivacyScore(Math.min(score, maxScore));
  };

  const getDataRetentionInfo = () => {
    return [
      {
        category: 'Dados de Perfil',
        retention: 'Enquanto a conta estiver ativa',
        purpose: 'Identificação e funcionalidades básicas',
        legal_basis: 'Execução de contrato'
      },
      {
        category: 'Contatos e Leads',
        retention: '5 anos após inatividade',
        purpose: 'Gestão de relacionamento',
        legal_basis: 'Legítimo interesse'
      },
      {
        category: 'Logs de Acesso',
        retention: '12 meses',
        purpose: 'Segurança e auditoria',
        legal_basis: 'Cumprimento de obrigação legal'
      },
      {
        category: 'Dados de Uso',
        retention: '24 meses',
        purpose: 'Melhoria do serviço',
        legal_basis: 'Legítimo interesse'
      }
    ];
  };

  const getDataSharingInfo = () => {
    return [
      {
        recipient: 'Supabase (Infraestrutura)',
        purpose: 'Hospedagem e banco de dados',
        location: 'Estados Unidos',
        safeguards: 'Cláusulas contratuais padrão'
      },
      {
        recipient: 'Vercel (Hospedagem)',
        purpose: 'Hospedagem da aplicação',
        location: 'Estados Unidos',
        safeguards: 'Adequação reconhecida'
      }
    ];
  };

  const generatePrivacyReport = () => {
    const reportData = {
      user_info: {
        id: user?.id,
        email: user?.email,
        created_at: profile?.created_at
      },
      privacy_score: privacyScore,
      consent_summary: consentData.reduce((acc, consent) => {
        acc[consent.consent_type] = consent.granted && !consent.revoked_at;
        return acc;
      }, {}),
      data_retention: getDataRetentionInfo(),
      data_sharing: getDataSharingInfo(),
      report_date: new Date().toISOString()
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio_privacidade_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getPrivacyScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPrivacyScoreLabel = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bom';
    if (score >= 40) return 'Regular';
    return 'Precisa melhorar';
  };

  return (
    <div className="space-y-6">
      {/* Privacy Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Pontuação de Privacidade
          </CardTitle>
          <CardDescription>
            Avaliação do seu nível de proteção de dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{privacyScore}/100</span>
              <Badge className={getPrivacyScoreColor(privacyScore)}>
                {getPrivacyScoreLabel(privacyScore)}
              </Badge>
            </div>
            <Progress value={privacyScore} className="w-full" />
            <p className="text-sm text-muted-foreground">
              Sua pontuação é baseada na completude do perfil, consentimentos ativos e configurações de privacidade.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Relatórios Detalhados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileBarChart className="w-5 h-5" />
            Relatórios de Privacidade
          </CardTitle>
          <CardDescription>
            Informações detalhadas sobre como seus dados são tratados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="retention" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="retention" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Retenção
              </TabsTrigger>
              <TabsTrigger value="sharing" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Compartilhamento
              </TabsTrigger>
              <TabsTrigger value="processing" className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Processamento
              </TabsTrigger>
            </TabsList>

            <TabsContent value="retention" className="space-y-4">
              <h3 className="font-semibold">Política de Retenção de Dados</h3>
              <div className="space-y-3">
                {getDataRetentionInfo().map((item, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{item.category}</h4>
                      <Badge variant="outline">{item.retention}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      <strong>Finalidade:</strong> {item.purpose}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Base Legal:</strong> {item.legal_basis}
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="sharing" className="space-y-4">
              <h3 className="font-semibold">Compartilhamento de Dados</h3>
              <div className="space-y-3">
                {getDataSharingInfo().map((item, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{item.recipient}</h4>
                      <Badge variant="outline">{item.location}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      <strong>Finalidade:</strong> {item.purpose}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Salvaguardas:</strong> {item.safeguards}
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="processing" className="space-y-4">
              <h3 className="font-semibold">Atividades de Processamento</h3>
              <div className="space-y-3">
                <div className="border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4" />
                    <h4 className="font-medium">Coleta de Dados</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Coletamos apenas os dados necessários para o funcionamento da plataforma.
                  </p>
                </div>
                
                <div className="border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4" />
                    <h4 className="font-medium">Segurança</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Aplicamos medidas técnicas e organizacionais para proteger seus dados.
                  </p>
                </div>
                
                <div className="border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-4 h-4" />
                    <h4 className="font-medium">Armazenamento</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Dados armazenados em infraestrutura segura com backup regular.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <Button onClick={generatePrivacyReport} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Gerar Relatório Completo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
