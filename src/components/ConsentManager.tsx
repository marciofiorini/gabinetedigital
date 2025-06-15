
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLGPDCompliance } from '@/hooks/useLGPDCompliance';
import { CheckCircle, Info, Shield, Cookie, Mail, BarChart } from 'lucide-react';

interface ConsentItem {
  id: string;
  type: string;
  title: string;
  description: string;
  required: boolean;
  icon: React.ReactNode;
  details: string;
}

export const ConsentManager = () => {
  const { requestConsent, revokeConsent, getConsentHistory, loading } = useLGPDCompliance();
  const [consents, setConsents] = useState<Record<string, boolean>>({});
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const consentItems: ConsentItem[] = [
    {
      id: 'data_processing',
      type: 'data_processing',
      title: 'Processamento de Dados Essenciais',
      description: 'Necessário para o funcionamento básico da plataforma',
      required: true,
      icon: <Shield className="w-5 h-5" />,
      details: 'Este consentimento permite que processemos seus dados pessoais básicos (nome, email, telefone) para fornecer os serviços da plataforma, incluindo criação de conta, autenticação e funcionalidades principais.'
    },
    {
      id: 'cookies',
      type: 'cookies',
      title: 'Cookies e Tecnologias Similares',
      description: 'Melhorar experiência de navegação e funcionalidade',
      required: false,
      icon: <Cookie className="w-5 h-5" />,
      details: 'Utilizamos cookies essenciais para o funcionamento do site e cookies opcionais para melhorar sua experiência, lembrar preferências e analisar o uso da plataforma.'
    },
    {
      id: 'marketing',
      type: 'marketing',
      title: 'Comunicações de Marketing',
      description: 'Receber newsletters e comunicações promocionais',
      required: false,
      icon: <Mail className="w-5 h-5" />,
      details: 'Com este consentimento, poderemos enviar newsletters, atualizações sobre novos recursos, ofertas especiais e outras comunicações relacionadas aos nossos serviços.'
    },
    {
      id: 'analytics',
      type: 'analytics',
      title: 'Análise e Estatísticas',
      description: 'Análise de uso para melhorar a plataforma',
      required: false,
      icon: <BarChart className="w-5 h-5" />,
      details: 'Coletamos dados sobre como você usa a plataforma para identificar padrões, melhorar recursos existentes e desenvolver novas funcionalidades que atendam melhor às suas necessidades.'
    }
  ];

  useEffect(() => {
    loadCurrentConsents();
  }, []);

  const loadCurrentConsents = async () => {
    const history = await getConsentHistory();
    const current: Record<string, boolean> = {};

    consentItems.forEach(item => {
      const latestConsent = history
        .filter(h => h.consent_type === item.type)
        .sort((a, b) => new Date(b.granted_at).getTime() - new Date(a.granted_at).getTime())[0];
      
      current[item.type] = latestConsent ? (latestConsent.granted && !latestConsent.revoked_at) : false;
    });

    setConsents(current);
  };

  const handleConsentChange = async (consentType: string, granted: boolean) => {
    const item = consentItems.find(i => i.type === consentType);
    if (!item) return;

    if (granted) {
      await requestConsent(consentType, item.description);
    } else {
      if (item.required) {
        alert('Este consentimento é obrigatório para o funcionamento da plataforma.');
        return;
      }
      await revokeConsent(consentType);
    }

    await loadCurrentConsents();
  };

  const getConsentStatus = (type: string) => {
    return consents[type] || false;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Gerenciamento de Consentimentos
        </CardTitle>
        <CardDescription>
          Controle como seus dados pessoais são utilizados de acordo com a LGPD
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Você pode alterar suas preferências de consentimento a qualquer momento. 
            Algumas funcionalidades podem ser limitadas se determinados consentimentos forem revogados.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          {consentItems.map((item) => (
            <div key={item.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">{item.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Label htmlFor={item.id} className="font-medium">
                        {item.title}
                      </Label>
                      {item.required && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          Obrigatório
                        </span>
                      )}
                      {getConsentStatus(item.type) && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.description}
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="link" className="h-auto p-0 text-xs">
                          Ver detalhes
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            {item.icon}
                            {item.title}
                          </DialogTitle>
                          <DialogDescription className="text-left">
                            {item.details}
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline">Fechar</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <Switch
                  id={item.id}
                  checked={getConsentStatus(item.type)}
                  onCheckedChange={(checked) => handleConsentChange(item.type, checked)}
                  disabled={loading || (item.required && getConsentStatus(item.type))}
                />
              </div>
            </div>
          ))}
        </div>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Seus direitos:</strong> Você pode solicitar acesso, correção, portabilidade 
            ou eliminação dos seus dados pessoais a qualquer momento através das configurações de privacidade.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
