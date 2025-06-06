
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, MessageSquare, Brain, TrendingUp, Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Mensagem {
  id: string;
  tipo: 'usuario' | 'assistente';
  conteudo: string;
  timestamp: Date;
  categoria?: string;
}

export const AssistenteVirtual = () => {
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      id: '1',
      tipo: 'assistente',
      conteudo: 'Olá! Sou seu assistente virtual para decisões políticas. Posso ajudar com análises de dados, sugestões estratégicas e insights sobre sua campanha. Como posso ajudar?',
      timestamp: new Date(),
      categoria: 'boas-vindas'
    }
  ]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sugestoesPredefinidas = [
    'Análise do engajamento nas redes sociais',
    'Estratégias para próximos eventos',
    'Tendências de crescimento de contatos',
    'Análise de demandas por região'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const enviarMensagem = async () => {
    if (!novaMensagem.trim() || carregando) return;

    const mensagemUsuario: Mensagem = {
      id: Date.now().toString(),
      tipo: 'usuario',
      conteudo: novaMensagem,
      timestamp: new Date()
    };

    setMensagens(prev => [...prev, mensagemUsuario]);
    const mensagemEnviada = novaMensagem;
    setNovaMensagem('');
    setCarregando(true);

    try {
      // Chamar a edge function do assistente virtual
      const { data, error } = await supabase.functions.invoke('assistente-virtual', {
        body: {
          mensagem: mensagemEnviada,
          contexto: {
            usuario_logado: true,
            pagina_atual: 'whatsapp',
            timestamp: new Date().toISOString()
          }
        }
      });

      if (error) throw error;

      const mensagemAssistente: Mensagem = {
        id: (Date.now() + 1).toString(),
        tipo: 'assistente',
        conteudo: data.resposta || 'Desculpe, não consegui processar sua solicitação.',
        timestamp: new Date(),
        categoria: data.categoria || 'geral'
      };

      setMensagens(prev => [...prev, mensagemAssistente]);

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
      // Fallback para resposta simulada
      const respostaFallback = gerarRespostaSimulada(mensagemEnviada);
      const mensagemAssistente: Mensagem = {
        id: (Date.now() + 1).toString(),
        tipo: 'assistente',
        conteudo: respostaFallback.conteudo,
        timestamp: new Date(),
        categoria: respostaFallback.categoria
      };

      setMensagens(prev => [...prev, mensagemAssistente]);
      
      toast({
        title: "Aviso",
        description: "Usando modo offline. Configure a API da OpenAI para funcionalidade completa.",
        variant: "default"
      });
    } finally {
      setCarregando(false);
    }
  };

  const gerarRespostaSimulada = (pergunta: string) => {
    const perguntaLower = pergunta.toLowerCase();
    
    if (perguntaLower.includes('engajamento') || perguntaLower.includes('redes sociais')) {
      return {
        conteudo: 'Com base nos dados atuais, seu engajamento no Instagram está 15% acima da média. Recomendo focar em conteúdo visual entre 18h-20h para maximizar alcance. Posts sobre políticas públicas têm 23% mais interações.',
        categoria: 'analise'
      };
    }
    
    if (perguntaLower.includes('eventos') || perguntaLower.includes('agenda')) {
      return {
        conteudo: 'Analisando seu histórico, eventos presenciais têm 40% mais conversão que virtuais. Sugiro agendar reuniões comunitárias nas zonas Norte e Centro, onde há maior concentração de demandas pendentes.',
        categoria: 'estrategia'
      };
    }
    
    if (perguntaLower.includes('contatos') || perguntaLower.includes('crescimento')) {
      return {
        conteudo: 'Tendência positiva: +12% de novos contatos este mês. Zona Sul mostra potencial não explorado (apenas 8% dos contatos). Recomendo campanha direcionada com foco em mobilidade urbana.',
        categoria: 'crescimento'
      };
    }
    
    if (perguntaLower.includes('whatsapp')) {
      return {
        conteudo: 'Para WhatsApp, recomendo: 1) Segmentar mensagens por região, 2) Usar templates aprovados pelo WhatsApp Business, 3) Horários ideais: 9h-11h e 19h-21h, 4) Taxa de resposta média: 65%. Evite spam enviando no máximo 1 mensagem por semana por contato.',
        categoria: 'estrategia'
      };
    }
    
    return {
      conteudo: 'Entendi sua pergunta. Com base nos dados disponíveis, posso sugerir algumas estratégias. Gostaria que eu analise algum aspecto específico da sua gestão política?',
      categoria: 'geral'
    };
  };

  const usarSugestao = (sugestao: string) => {
    setNovaMensagem(sugestao);
  };

  const getCategoriaColor = (categoria?: string) => {
    switch (categoria) {
      case 'analise': return 'bg-blue-100 text-blue-800';
      case 'estrategia': return 'bg-green-100 text-green-800';
      case 'crescimento': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoriaIcon = (categoria?: string) => {
    switch (categoria) {
      case 'analise': return <Brain className="w-4 h-4" />;
      case 'estrategia': return <TrendingUp className="w-4 h-4" />;
      case 'crescimento': return <MessageSquare className="w-4 h-4" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Bot className="w-6 h-6" />
            Assistente Virtual IA
          </CardTitle>
          <p className="text-blue-700">
            Seu consultor político inteligente - Análises em tempo real e sugestões estratégicas
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">Chat com Assistente</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-2">
                {mensagens.map((mensagem) => (
                  <div
                    key={mensagem.id}
                    className={`flex ${mensagem.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        mensagem.tipo === 'usuario'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {mensagem.tipo === 'assistente' && mensagem.categoria && (
                        <div className="flex items-center gap-1 mb-2">
                          <Badge className={getCategoriaColor(mensagem.categoria)}>
                            {getCategoriaIcon(mensagem.categoria)}
                            <span className="ml-1 capitalize">{mensagem.categoria}</span>
                          </Badge>
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{mensagem.conteudo}</p>
                      <p className={`text-xs mt-1 ${
                        mensagem.tipo === 'usuario' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {mensagem.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {carregando && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Analisando...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="flex gap-2">
                <Input
                  value={novaMensagem}
                  onChange={(e) => setNovaMensagem(e.target.value)}
                  placeholder="Digite sua pergunta..."
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && enviarMensagem()}
                  disabled={carregando}
                  className="flex-1"
                />
                <Button 
                  onClick={enviarMensagem} 
                  disabled={carregando || !novaMensagem.trim()}
                  size="icon"
                >
                  {carregando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sugestões Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {sugestoesPredefinidas.map((sugestao, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left justify-start h-auto p-3 hover:bg-gray-50"
                  onClick={() => usarSugestao(sugestao)}
                  disabled={carregando}
                >
                  <MessageSquare className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm">{sugestao}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status da IA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Modelo Ativo</span>
                  <Badge className="bg-green-100 text-green-800">GPT-4</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge className="bg-blue-100 text-blue-800">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Consultas Hoje</span>
                  <span className="text-sm">{mensagens.filter(m => m.tipo === 'usuario').length}</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  💡 Configure sua chave da OpenAI nas configurações para funcionalidade completa
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
