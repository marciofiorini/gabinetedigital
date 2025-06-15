
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLGPDCompliance } from '@/hooks/useLGPDCompliance';
import { 
  Shield, 
  Download, 
  Trash2, 
  Clock, 
  CheckCircle, 
  XCircle,
  FileText,
  Eye,
  Settings
} from 'lucide-react';

export const LGPDCompliance = () => {
  const {
    loading,
    requestConsent,
    revokeConsent,
    getConsentHistory,
    exportUserData,
    requestDataDeletion
  } = useLGPDCompliance();

  const [consents, setConsents] = useState<any[]>([]);
  const [currentConsents, setCurrentConsents] = useState({
    data_processing: false,
    marketing: false,
    analytics: false,
    cookies: false
  });

  useEffect(() => {
    loadConsentHistory();
  }, []);

  const loadConsentHistory = async () => {
    const history = await getConsentHistory();
    setConsents(history);

    // Determinar estado atual dos consentimentos
    const current = {
      data_processing: false,
      marketing: false,
      analytics: false,
      cookies: false
    };

    history.forEach(consent => {
      if (consent.granted && !consent.revoked_at) {
        current[consent.consent_type as keyof typeof current] = true;
      }
    });

    setCurrentConsents(current);
  };

  const handleConsentChange = async (consentType: string, granted: boolean) => {
    if (granted) {
      const purposes = {
        data_processing: 'Processamento de dados para funcionalidades do sistema',
        marketing: 'Envio de comunicações promocionais e newsletters',
        analytics: 'Análise de uso da plataforma para melhorias',
        cookies: 'Uso de cookies para melhor experiência de navegação'
      };

      await requestConsent(consentType, purposes[consentType as keyof typeof purposes]);
    } else {
      await revokeConsent(consentType);
    }
    
    await loadConsentHistory();
  };

  const handleDataExport = async () => {
    await exportUserData();
  };

  const handleDataDeletion = async () => {
    if (confirm('Tem certeza que deseja solicitar a remoção dos seus dados? Esta ação não pode ser desfeita.')) {
      await requestDataDeletion();
    }
  };

  return (
    <div className="space-y-6">
      {/* Informações LGPD */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Lei Geral de Proteção de Dados (LGPD)
          </CardTitle>
          <CardDescription>
            Gerencie seus direitos e consentimentos conforme a LGPD
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Seus dados são processados de acordo com a Lei Geral de Proteção de Dados (LGPD). 
              Você tem direito ao acesso, correção, portabilidade e eliminação dos seus dados pessoais.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Gerenciamento de Consentimentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Gerenciamento de Consentimentos
          </CardTitle>
          <CardDescription>
            Controle como seus dados são utilizados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="data_processing">Processamento de Dados</Label>
                <p className="text-sm text-muted-foreground">
                  Necessário para o funcionamento básico da plataforma
                </p>
              </div>
              <Switch
                id="data_processing"
                checked={currentConsents.data_processing}
                onCheckedChange={(checked) => handleConsentChange('data_processing', checked)}
                disabled={loading}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="marketing">Marketing e Comunicações</Label>
                <p className="text-sm text-muted-foreground">
                  Receber newsletters e comunicações promocionais
                </p>
              </div>
              <Switch
                id="marketing"
                checked={currentConsents.marketing}
                onCheckedChange={(checked) => handleConsentChange('marketing', checked)}
                disabled={loading}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="analytics">Análise e Estatísticas</Label>
                <p className="text-sm text-muted-foreground">
                  Análise de uso para melhorar a plataforma
                </p>
              </div>
              <Switch
                id="analytics"
                checked={currentConsents.analytics}
                onCheckedChange={(checked) => handleConsentChange('analytics', checked)}
                disabled={loading}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="cookies">Cookies e Tecnologias Similares</Label>
                <p className="text-sm text-muted-foreground">
                  Melhorar experiência de navegação
                </p>
              </div>
              <Switch
                id="cookies"
                checked={currentConsents.cookies}
                onCheckedChange={(checked) => handleConsentChange('cookies', checked)}
                disabled={loading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Consentimentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Histórico de Consentimentos
          </CardTitle>
          <CardDescription>
            Histórico de todas as alterações nos seus consentimentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {consents.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Nenhum histórico de consentimento encontrado
            </p>
          ) : (
            <div className="space-y-3">
              {consents.map((consent) => (
                <div
                  key={consent.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {consent.granted && !consent.revoked_at ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium">{consent.consent_type}</p>
                      <p className="text-sm text-muted-foreground">
                        {consent.purpose}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={consent.granted && !consent.revoked_at ? 'default' : 'secondary'}>
                      {consent.granted && !consent.revoked_at ? 'Ativo' : 'Revogado'}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(consent.granted_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Direitos do Titular */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Seus Direitos
          </CardTitle>
          <CardDescription>
            Exercer seus direitos como titular de dados pessoais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handleDataExport}
              disabled={loading}
              variant="outline"
              className="flex items-center gap-2 h-auto p-4"
            >
              <Download className="w-5 h-5" />
              <div className="text-left">
                <p className="font-medium">Exportar Dados</p>
                <p className="text-sm text-muted-foreground">
                  Baixar todos os seus dados
                </p>
              </div>
            </Button>

            <Button
              onClick={handleDataDeletion}
              disabled={loading}
              variant="destructive"
              className="flex items-center gap-2 h-auto p-4"
            >
              <Trash2 className="w-5 h-5" />
              <div className="text-left">
                <p className="font-medium">Solicitar Remoção</p>
                <p className="text-sm text-muted-foreground">
                  Remover seus dados pessoais
                </p>
              </div>
            </Button>
          </div>

          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              <strong>Seus direitos incluem:</strong> Acesso aos dados, correção de informações incorretas, 
              portabilidade dos dados, eliminação quando não mais necessários, e oposição ao tratamento 
              em determinadas situações.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};
