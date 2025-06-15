
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLGPDCompliance } from '@/hooks/useLGPDCompliance';
import { Trash2, AlertTriangle, FileText, Clock } from 'lucide-react';

export const DeletionWorkflow = () => {
  const { createDeletionWorkflow, loading } = useLGPDCompliance();
  const [reason, setReason] = useState('');
  const [reasonType, setReasonType] = useState('');
  const [ticketNumber, setTicketNumber] = useState('');

  const reasonOptions = [
    { value: 'no_longer_needed', label: 'Dados não são mais necessários' },
    { value: 'consent_withdrawn', label: 'Retirada do consentimento' },
    { value: 'unlawful_processing', label: 'Tratamento ilícito' },
    { value: 'legal_obligation', label: 'Cumprimento de obrigação legal' },
    { value: 'other', label: 'Outro motivo' }
  ];

  const handleSubmitRequest = async () => {
    if (!reasonType || !reason.trim()) {
      return;
    }

    const fullReason = `${reasonOptions.find(opt => opt.value === reasonType)?.label}: ${reason}`;
    const ticket = await createDeletionWorkflow(fullReason);
    
    if (ticket) {
      setTicketNumber(ticket);
      setReason('');
      setReasonType('');
    }
  };

  if (ticketNumber) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <FileText className="w-5 h-5" />
            Solicitação Criada
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-800 mb-2">Solicitação de Remoção Registrada</h3>
            <p className="text-green-700 mb-2">
              Número do ticket: <strong>{ticketNumber}</strong>
            </p>
            <p className="text-sm text-green-600">
              Sua solicitação foi registrada e será processada conforme os prazos da LGPD. 
              Você receberá atualizações por email.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Próximos Passos:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Análise da solicitação (até 15 dias)</li>
              <li>Verificação de impedimentos legais</li>
              <li>Execução da remoção/anonimização</li>
              <li>Confirmação por email</li>
            </ul>
          </div>

          <Button
            variant="outline"
            onClick={() => setTicketNumber('')}
            className="w-full"
          >
            Nova Solicitação
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trash2 className="w-5 h-5" />
          Solicitação de Remoção de Dados
        </CardTitle>
        <CardDescription>
          Solicite a remoção ou anonimização dos seus dados pessoais conforme LGPD
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Atenção:</strong> A remoção de dados é irreversível e pode afetar 
            sua capacidade de usar alguns recursos da plataforma. Analise cuidadosamente 
            antes de prosseguir.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Motivo da Solicitação</Label>
            <Select value={reasonType} onValueChange={setReasonType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o motivo..." />
              </SelectTrigger>
              <SelectContent>
                {reasonOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Detalhes Adicionais</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Descreva detalhadamente o motivo da solicitação de remoção..."
              className="min-h-[100px]"
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">Processo de Aprovação</h4>
              <p className="text-sm text-blue-700 mt-1">
                Sua solicitação passará por um workflow de aprovação que inclui:
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside ml-4">
                <li>Verificação de identidade</li>
                <li>Análise de impedimentos legais</li>
                <li>Avaliação de impacto</li>
                <li>Aprovação final</li>
              </ul>
            </div>
          </div>
        </div>

        <Button
          onClick={handleSubmitRequest}
          disabled={loading || !reasonType || !reason.trim()}
          className="w-full"
        >
          {loading ? 'Criando Solicitação...' : 'Enviar Solicitação de Remoção'}
        </Button>
      </CardContent>
    </Card>
  );
};
