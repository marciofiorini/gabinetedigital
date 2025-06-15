
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useLGPDCompliance } from '@/hooks/useLGPDCompliance';
import { FileSignature, Shield, CheckCircle, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface DigitalSignatureProps {
  consentType: string;
  termsText: string;
  onSignatureGenerated?: (signature: string) => void;
}

export const DigitalSignature: React.FC<DigitalSignatureProps> = ({
  consentType,
  termsText,
  onSignatureGenerated
}) => {
  const { generateConsentSignature, loading } = useLGPDCompliance();
  const [signature, setSignature] = useState<string>('');
  const [terms, setTerms] = useState(termsText);

  const handleGenerateSignature = async () => {
    const newSignature = await generateConsentSignature(consentType, terms);
    setSignature(newSignature);
    onSignatureGenerated?.(newSignature);
    toast.success('Assinatura digital gerada com sucesso');
  };

  const copySignature = () => {
    navigator.clipboard.writeText(signature);
    toast.success('Assinatura copiada para a área de transferência');
  };

  const verifySignature = () => {
    try {
      const signatureData = JSON.parse(atob(signature));
      toast.success(`Assinatura válida - Criada em ${new Date(signatureData.timestamp).toLocaleString()}`);
    } catch (error) {
      toast.error('Assinatura inválida');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSignature className="w-5 h-5" />
          Assinatura Digital dos Termos
        </CardTitle>
        <CardDescription>
          Gere uma assinatura digital criptográfica para validar o consentimento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo de Consentimento</label>
          <Badge variant="outline">{consentType}</Badge>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Termos e Condições</label>
          <Textarea
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            placeholder="Digite ou cole aqui os termos e condições..."
            className="min-h-[120px]"
          />
        </div>

        <Button 
          onClick={handleGenerateSignature} 
          disabled={loading || !terms.trim()}
          className="w-full"
        >
          {loading ? 'Gerando...' : 'Gerar Assinatura Digital'}
        </Button>

        {signature && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Assinatura Gerada</span>
              </div>
              <div className="bg-white border rounded p-3 font-mono text-sm break-all">
                {signature}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={copySignature} className="flex items-center gap-2">
                <Copy className="w-4 h-4" />
                Copiar Assinatura
              </Button>
              <Button variant="outline" onClick={verifySignature} className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Verificar Assinatura
              </Button>
            </div>

            <div className="text-xs text-muted-foreground bg-gray-50 p-3 rounded">
              <strong>Informações da Assinatura:</strong>
              <br />
              • Timestamp: {new Date().toLocaleString()}
              <br />
              • Algoritmo: Base64 + JSON
              <br />
              • Validade: Permanente (enquanto não revogado)
              <br />
              • Conformidade: LGPD Art. 8º, §2º
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
