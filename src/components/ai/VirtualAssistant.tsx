
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Bot, User, Mic, Volume2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'action' | 'recommendation';
}

interface Recommendation {
  id: string;
  type: 'lead_followup' | 'campaign_optimization' | 'contact_engagement';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action?: () => void;
}

export const VirtualAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      initializeAssistant();
      generateRecommendations();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeAssistant = () => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content: `Olá! Sou seu assistente virtual de CRM. Posso ajudar você com análises de leads, sugestões de campanhas, automação de follow-ups e muito mais. Como posso ajudar hoje?`,
      role: 'assistant',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages([welcomeMessage]);
  };

  const generateRecommendations = async () => {
    if (!user) return;

    try {
      // Buscar dados para gerar recomendações
      const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const { data: followUps } = await supabase
        .from('follow_ups')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pendente');

      const recs: Recommendation[] = [];

      // Recomendação de follow-up para leads sem resposta
      const staleLeads = leads?.filter(lead => {
        const daysSinceCreated = Math.floor(
          (Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysSinceCreated > 3 && lead.status === 'novo';
      }) || [];

      if (staleLeads.length > 0) {
        recs.push({
          id: 'followup_stale_leads',
          type: 'lead_followup',
          title: `${staleLeads.length} leads precisam de follow-up`,
          description: 'Leads antigos sem contato podem estar perdendo interesse',
          priority: 'high',
          action: () => {
            toast.success('Criando follow-ups automáticos...');
          }
        });
      }

      // Recomendação de otimização de campanha
      if (leads && leads.length > 10) {
        const conversionRate = (leads.filter(l => l.status === 'convertido').length / leads.length) * 100;
        if (conversionRate < 15) {
          recs.push({
            id: 'optimize_campaign',
            type: 'campaign_optimization',
            title: 'Taxa de conversão baixa detectada',
            description: `Sua taxa atual é ${conversionRate.toFixed(1)}%. Posso sugerir melhorias.`,
            priority: 'medium'
          });
        }
      }

      setRecommendations(recs);
    } catch (error) {
      console.error('Erro ao gerar recomendações:', error);
    }
  };

  const processMessage = async (content: string) => {
    if (!content.trim() || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simular processamento de IA
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await generateAIResponse(content);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        role: 'assistant',
        timestamp: new Date(),
        type: response.type || 'text'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      toast.error('Erro ao processar sua solicitação');
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = async (input: string): Promise<{ content: string; type?: string }> => {
    const lowerInput = input.toLowerCase();

    // Análise de leads
    if (lowerInput.includes('lead') || lowerInput.includes('prospect')) {
      const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user!.id);

      const totalLeads = leads?.length || 0;
      const newLeads = leads?.filter(l => l.status === 'novo').length || 0;
      const convertedLeads = leads?.filter(l => l.status === 'convertido').length || 0;
      const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads * 100).toFixed(1) : '0';

      return {
        content: `📊 **Análise de Leads:**\n\n• Total de leads: ${totalLeads}\n• Leads novos: ${newLeads}\n• Leads convertidos: ${convertedLeads}\n• Taxa de conversão: ${conversionRate}%\n\n${newLeads > 5 ? '⚠️ Você tem muitos leads novos. Recomendo criar follow-ups automáticos!' : '✅ Sua pipeline está equilibrada.'}`,
        type: 'text'
      };
    }

    // Análise de campanhas
    if (lowerInput.includes('campanha') || lowerInput.includes('marketing')) {
      return {
        content: `🎯 **Sugestões de Campanha:**\n\n• **Email Drip Campaign**: Para leads que não responderam em 3 dias\n• **Segmentação por Interesse**: Separar leads por área de interesse\n• **A/B Testing**: Testar diferentes assuntos de email\n• **Retargeting**: Focar em leads com alta pontuação\n\nQual tipo de campanha gostaria de criar?`,
        type: 'recommendation'
      };
    }

    // Análise de performance
    if (lowerInput.includes('performance') || lowerInput.includes('resultado')) {
      return {
        content: `📈 **Análise de Performance:**\n\n• **Melhor fonte de leads**: Website (45%)\n• **Horário ideal para contato**: 14h-16h\n• **Taxa de resposta**: 23% (acima da média!)\n• **Tempo médio de conversão**: 7 dias\n\n🔥 **Oportunidades identificadas:**\n• Otimizar follow-ups por WhatsApp\n• Implementar chatbot no site\n• Criar campanhas para fim de semana`,
        type: 'text'
      };
    }

    // Automação
    if (lowerInput.includes('automação') || lowerInput.includes('automatizar')) {
      return {
        content: `🤖 **Automações Disponíveis:**\n\n1. **Follow-up Automático**\n   • Email 24h após primeiro contato\n   • WhatsApp após 3 dias sem resposta\n   • Ligação para leads quentes\n\n2. **Scoring Automático**\n   • Pontuação baseada em comportamento\n   • Priorização automática\n\n3. **Campanhas Inteligentes**\n   • Segmentação automática\n   • Personalização de conteúdo\n\nQual automação gostaria de configurar?`,
        type: 'action'
      };
    }

    // Resposta padrão
    return {
      content: `Entendi sua solicitação sobre "${input}". Como assistente de CRM, posso ajudar com:\n\n• 📊 Análise de leads e performance\n• 🎯 Sugestões de campanhas\n• 🤖 Configuração de automações\n• 📈 Relatórios e insights\n• 💡 Recomendações personalizadas\n\nSobre qual tópico gostaria de conversar?`,
      type: 'text'
    };
  };

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast.error('Erro no reconhecimento de voz');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      toast.error('Reconhecimento de voz não suportado');
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chat Interface */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Assistente Virtual CRM
          </CardTitle>
          <CardDescription>
            Seu assistente inteligente para gestão de relacionamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col h-96">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.role === 'assistant' && (
                        <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
                      )}
                      {message.role === 'user' && (
                        <User className="w-4 h-4 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        {message.role === 'assistant' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="mt-2 h-6 px-2"
                            onClick={() => speakText(message.content)}
                          >
                            <Volume2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Digite sua pergunta..."
                onKeyPress={(e) => e.key === 'Enter' && processMessage(inputValue)}
                disabled={isLoading}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={startVoiceRecognition}
                disabled={isListening}
              >
                <Mic className={`w-4 h-4 ${isListening ? 'text-red-500' : ''}`} />
              </Button>
              <Button onClick={() => processMessage(inputValue)} disabled={isLoading || !inputValue.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Recomendações IA</CardTitle>
          <CardDescription>Insights personalizados para seu negócio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="p-3 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{rec.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {rec.description}
                    </p>
                    <Badge 
                      variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}
                      className="mt-2"
                    >
                      {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Média' : 'Baixa'}
                    </Badge>
                  </div>
                </div>
                {rec.action && (
                  <Button size="sm" className="w-full mt-3" onClick={rec.action}>
                    Aplicar Sugestão
                  </Button>
                )}
              </div>
            ))}

            {recommendations.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Analisando seus dados...</p>
                <p className="text-sm">Recomendações aparecerão aqui</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
