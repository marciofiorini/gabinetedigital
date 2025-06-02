
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Send, Check, AlertCircle } from 'lucide-react';

interface WebhookTesterProps {
  title: string;
  description: string;
  defaultUrl?: string;
  defaultPayload?: object;
}

export const WebhookTester: React.FC<WebhookTesterProps> = ({
  title,
  description,
  defaultUrl = '',
  defaultPayload = {}
}) => {
  const [webhookUrl, setWebhookUrl] = useState(defaultUrl);
  const [payload, setPayload] = useState(JSON.stringify(defaultPayload, null, 2));
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const { toast } = useToast();

  const testWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: "Erro",
        description: "Por favor, insira a URL do webhook",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setLastResponse(null);

    try {
      let parsedPayload;
      try {
        parsedPayload = JSON.parse(payload);
      } catch (e) {
        throw new Error("Payload JSON inválido");
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          ...parsedPayload,
          timestamp: new Date().toISOString(),
          test: true
        })
      });

      setLastResponse('Webhook enviado com sucesso (modo no-cors)');
      toast({
        title: "Webhook Enviado",
        description: "A requisição foi enviada. Verifique os logs do seu webhook para confirmar o recebimento.",
      });
    } catch (error: any) {
      console.error("Erro ao testar webhook:", error);
      setLastResponse(`Erro: ${error.message}`);
      toast({
        title: "Erro",
        description: error.message || "Falha ao enviar webhook",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="w-5 h-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="webhook-url">URL do Webhook</Label>
          <Input
            id="webhook-url"
            placeholder="https://hooks.zapier.com/hooks/catch/..."
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="payload">Payload (JSON)</Label>
          <Textarea
            id="payload"
            rows={6}
            placeholder='{"message": "Teste do webhook"}'
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
          />
        </div>

        {lastResponse && (
          <div className={`p-3 rounded-lg flex items-center gap-2 ${
            lastResponse.includes('Erro') 
              ? 'bg-red-50 text-red-800 border border-red-200' 
              : 'bg-green-50 text-green-800 border border-green-200'
          }`}>
            {lastResponse.includes('Erro') ? (
              <AlertCircle className="w-4 h-4" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            <span className="text-sm">{lastResponse}</span>
          </div>
        )}

        <Button 
          onClick={testWebhook} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Enviando...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Testar Webhook
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
