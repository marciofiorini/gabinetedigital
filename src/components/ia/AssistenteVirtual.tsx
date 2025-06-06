
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, MessageSquare, Brain, TrendingUp } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

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

  const sugestoesPredefinidas = [
    'Análise do engajamento nas redes sociais',
    'Estratégias para próximos eventos',
    'Tendências de crescimento de contatos',
    'Análise de demandas por região'
  ];

  const enviarMensagem = async () => {
    if (!novaMensagem.trim()) return;

    const mensagemUsuario: Mensagem = {
      id: Date.now().toString(),
      tipo: 'usuario',
      conteudo: novaMensagem,
      timestamp: new Date()
    };

    setMensagens(prev => [...prev, mensagemUsuario]);
    setNovaMensagem('');
    setCarregando(true);

    // Simular resposta do assistente (em produção seria chamada para OpenAI)
    setTimeout(() => {
      const respostaAssistente = gerarRespostaSimulada(novaMensagem);
      const mensagemAssistente: Mensagem = {
        id: (Date.now() + 1).toString(),
        tipo: 'assistente',
        conteudo: respostaAssistente.conteudo,
        timestamp: new Date(),
        categoria: respostaAssistente.categoria
      };

      setMensagens(prev => [...prev, mensagemAssistente]);
      setCarregando(false);
    }, 2000);
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
    
    if (perguntaLower.includes('demandas') || perguntaLower.includes('região')) {
      return {
        conteudo: 'Análise regional mostra: 45% das demandas são de infraestrutura, concentradas na Zona Norte. Recomendo priorizar iluminação pública e saneamento. ROI estimado: 78% de satisfação.',
        categoria: 'analise'
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
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
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
                      <p className="text-sm">{mensagem.conteudo}</p>
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
                        <Bot className="w-4 h-4 animate-pulse" />
                        <span className="text-sm">Analisando...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Input
                  value={novaMensagem}
                  onChange={(e) => setNovaMensagem(e.target.value)}
                  placeholder="Digite sua pergunta..."
                  onKeyPress={(e) => e.key === 'Enter' && enviarMensagem()}
                  disabled={carregando}
                />
                <Button 
                  onClick={enviarMensagem} 
                  disabled={carregando || !novaMensagem.trim()}
                  size="icon"
                >
                  <Send className="w-4 h-4" />
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
                  className="w-full text-left justify-start h-auto p-3"
                  onClick={() => usarSugestao(sugestao)}
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
                  <span className="text-sm font-medium">Precisão</span>
                  <span className="text-sm">87%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Consultas Hoje</span>
                  <span className="text-sm">23</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
