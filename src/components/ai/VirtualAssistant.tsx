
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Bot, MessageSquare, Lightbulb, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AssistantSuggestion {
  id: string;
  tipo: 'lead_analysis' | 'campaign_suggestion' | 'automation' | 'insight';
  titulo: string;
  descricao: string;
  dados_suporte: any;
  confianca: number;
  criado_em: string;
}

export const VirtualAssistant = () => {
  const [mensagem, setMensagem] = useState('');
  const [conversas, setConversas] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<AssistantSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      generateSuggestions();
    }
  }, [user]);

  const generateSuggestions = async () => {
    if (!user) return;

    try {
      // Buscar dados para gerar sugestões
      const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id);

      const { data: contatos } = await supabase
        .from('contatos')
        .select('*')
        .eq('user_id', user.id);

      // Gerar sugestões baseadas nos dados
      const newSuggestions: AssistantSuggestion[] = [];

      // Análise de leads
      if (leads && leads.length > 0) {
        const leadsNovos = leads.filter(l => l.status === 'novo').length;
        if (leadsNovos > 5) {
          newSuggestions.push({
            id: 'lead-analysis-1',
            tipo: 'lead_analysis',
            titulo: 'Muitos leads novos detectados',
            descricao: `Você tem ${leadsNovos} leads novos. Recomendo criar uma campanha de follow-up automatizada.`,
            dados_suporte: { count: leadsNovos },
            confianca: 85,
            criado_em: new Date().toISOString()
          });
        }
      }

      // Sugestão de campanha
      if (contatos && contatos.length > 10) {
        newSuggestions.push({
          id: 'campaign-1',
          tipo: 'campaign_suggestion',
          titulo: 'Oportunidade de engajamento',
          descricao: `Com ${contatos.length} contatos, você pode criar uma campanha segmentada para aumentar o engajamento.`,
          dados_suporte: { total_contatos: contatos.length },
          confianca: 90,
          criado_em: new Date().toISOString()
        });
      }

      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Erro ao gerar sugestões:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!mensagem.trim() || !user) return;

    setLoading(true);
    const novaMensagem = {
      id: Date.now().toString(),
      tipo: 'user',
      conteudo: mensagem,
      timestamp: new Date().toISOString()
    };

    setConversas(prev => [...prev, novaMensagem]);

    try {
      // Simular resposta da IA
      const resposta = await generateAIResponse(mensagem);
      
      const respostaIA = {
        id: Date.now().toString() + '_ai',
        tipo: 'assistant',
        conteudo: resposta,
        timestamp: new Date().toISOString()
      };

      setConversas(prev => [...prev, respostaIA]);
      setMensagem('');
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      toast.error('Erro ao processar sua mensagem');
    } finally {
      setLoading(false);
    }
  };

  const generateAIResponse = async (mensagem: string): Promise<string> => {
    // Simulação de resposta da IA baseada na mensagem
    const lowerMessage = mensagem.toLowerCase();
    
    if (lowerMessage.includes('lead') || lowerMessage.includes('leads')) {
      return 'Com base nos seus dados, vejo que você tem leads ativos. Recomendo focar nos leads com score alto e criar follow-ups personalizados.';
    }
    
    if (lowerMessage.includes('campanha')) {
      return 'Para suas campanhas, sugiro segmentar por zona e interesse. Isso pode aumentar a taxa de engajamento em até 40%.';
    }
    
    if (lowerMessage.includes('contato') || lowerMessage.includes('contatos')) {
      return 'Seus contatos podem ser organizados melhor com tags e segmentação. Isso facilitará campanhas direcionadas no futuro.';
    }

    return 'Entendi sua pergunta. Com base nos dados do seu gabinete, posso ajudar com análises de leads, sugestões de campanhas e automações. O que gostaria de saber especificamente?';
  };

  const applySuggestion = async (suggestion: AssistantSuggestion) => {
    try {
      // Aqui implementaríamos a aplicação da sugestão
      toast.success(`Aplicando sugestão: ${suggestion.titulo}`);
      
      // Remover a sugestão aplicada
      setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    } catch (error) {
      console.error('Erro ao aplicar sugestão:', error);
      toast.error('Erro ao aplicar sugestão');
    }
  };

  const getSuggestionIcon = (tipo: string) => {
    switch (tipo) {
      case 'lead_analysis': return <Users className="w-4 h-4" />;
      case 'campaign_suggestion': return <TrendingUp className="w-4 h-4" />;
      case 'automation': return <Bot className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Principal */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Assistente Virtual IA
            </CardTitle>
            <CardDescription>
              Seu assistente inteligente para gestão política
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Área de conversas */}
            <div className="h-64 border rounded-lg p-4 mb-4 overflow-y-auto space-y-3">
              {conversas.length === 0 ? (
                <div className="text-center text-muted-foreground">
                  <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Olá! Sou seu assistente IA. Como posso ajudar hoje?</p>
                </div>
              ) : (
                conversas.map((conversa) => (
                  <div
                    key={conversa.id}
                    className={`flex ${conversa.tipo === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg ${
                        conversa.tipo === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{conversa.conteudo}</p>
                      <span className="text-xs opacity-70">
                        {new Date(conversa.timestamp).toLocaleTimeString('pt-BR')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input de mensagem */}
            <div className="flex gap-2">
              <Input
                placeholder="Digite sua pergunta..."
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={loading}
              />
              <Button onClick={handleSendMessage} disabled={loading || !mensagem.trim()}>
                <MessageSquare className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sugestões IA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Sugestões IA
            </CardTitle>
            <CardDescription>
              Insights automáticos baseados nos seus dados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getSuggestionIcon(suggestion.tipo)}
                      <span className="font-medium text-sm">{suggestion.titulo}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {suggestion.confianca}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {suggestion.descricao}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => applySuggestion(suggestion)}
                    className="w-full"
                  >
                    Aplicar Sugestão
                  </Button>
                </div>
              ))}

              {suggestions.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhuma sugestão no momento</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
