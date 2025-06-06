
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCampanhasAutomatizadas } from '@/hooks/useCampanhasAutomatizadas';
import { useSegmentosContatos } from '@/hooks/useSegmentosContatos';
import { 
  Send, 
  MessageCircle, 
  Mail, 
  Calendar, 
  Users, 
  BarChart3, 
  Zap,
  CheckCircle,
  Clock,
  Play
} from "lucide-react";

export const CampanhasIntegradas = () => {
  const { campanhas, loading, carregarCampanhas, criarCampanhaEmail, criarCampanhaWhatsApp, obterEstatisticas } = useCampanhasAutomatizadas();
  const { segmentos } = useSegmentosContatos();
  
  const [novaCampanha, setNovaCampanha] = useState({
    tipo: 'email',
    nome: '',
    assunto: '',
    mensagem: '',
    segmento: '',
    agendamento: ''
  });

  useEffect(() => {
    carregarCampanhas();
  }, []);

  const estatisticas = obterEstatisticas();

  const criarCampanha = async () => {
    const destinatarios = ['exemplo@email.com']; // Aqui você pegaria do segmento selecionado
    
    if (novaCampanha.tipo === 'email') {
      await criarCampanhaEmail({
        nome: novaCampanha.nome,
        assunto: novaCampanha.assunto,
        conteudo: novaCampanha.mensagem,
        destinatarios,
        agendamento: novaCampanha.agendamento ? new Date(novaCampanha.agendamento) : undefined
      });
    } else {
      await criarCampanhaWhatsApp({
        nome: novaCampanha.nome,
        mensagem: novaCampanha.mensagem,
        destinatarios,
        agendamento: novaCampanha.agendamento ? new Date(novaCampanha.agendamento) : undefined
      });
    }

    setNovaCampanha({
      tipo: 'email',
      nome: '',
      assunto: '',
      mensagem: '',
      segmento: '',
      agendamento: ''
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ativa': return <Play className="w-4 h-4 text-green-600" />;
      case 'pausada': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'finalizada': return <CheckCircle className="w-4 h-4 text-gray-600" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-green-100 text-green-800 border-green-200';
      case 'pausada': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'finalizada': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'whatsapp': return <MessageCircle className="w-4 h-4" />;
      default: return <Send className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-green-200 bg-green-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <Zap className="w-6 h-6" />
            Campanhas Automatizadas
          </CardTitle>
          <p className="text-green-700">
            Sistema integrado de email marketing e WhatsApp com APIs reais
          </p>
        </CardHeader>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center mr-4">
                <Play className="text-white w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Campanhas Ativas</p>
                <p className="text-2xl font-bold text-gray-900">{estatisticas.campanhasAtivas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center mr-4">
                <Send className="text-white w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Enviados</p>
                <p className="text-2xl font-bold text-gray-900">{estatisticas.totalEnviados}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center mr-4">
                <BarChart3 className="text-white w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Taxa Abertura</p>
                <p className="text-2xl font-bold text-gray-900">{estatisticas.taxaAberturaMedia}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center mr-4">
                <Users className="text-white w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Abertos</p>
                <p className="text-2xl font-bold text-gray-900">{estatisticas.totalAbertos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campanhas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campanhas">Campanhas Ativas</TabsTrigger>
          <TabsTrigger value="nova">Nova Campanha</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="campanhas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campanhas Automatizadas</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {campanhas.map((campanha) => (
                    <Card key={campanha.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                              {getTipoIcon(campanha.tipo)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{campanha.nome}</h4>
                              <p className="text-sm text-gray-600">
                                Trigger: {campanha.trigger_evento || 'Manual'} • Frequência: {campanha.frequencia}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                <span>Enviados: {campanha.total_enviados}</span>
                                <span>Abertos: {campanha.total_abertos}</span>
                                <span>Taxa: {campanha.taxa_conversao || 0}%</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${getStatusColor(campanha.status)} border flex items-center gap-1`}>
                              {getStatusIcon(campanha.status)}
                              {campanha.status}
                            </Badge>
                            <Button size="sm" variant="outline">Editar</Button>
                          </div>
                        </div>
                        {campanha.proxima_execucao && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-500">
                              Próxima execução: {new Date(campanha.proxima_execucao).toLocaleString('pt-BR')}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  {campanhas.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Nenhuma campanha encontrada</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nova" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Criar Nova Campanha</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Tipo de Campanha</label>
                  <Select value={novaCampanha.tipo} onValueChange={(value) => setNovaCampanha({...novaCampanha, tipo: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email
                        </div>
                      </SelectItem>
                      <SelectItem value="whatsapp">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4" />
                          WhatsApp
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Segmento</label>
                  <Select value={novaCampanha.segmento} onValueChange={(value) => setNovaCampanha({...novaCampanha, segmento: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um segmento" />
                    </SelectTrigger>
                    <SelectContent>
                      {segmentos.map(segmento => (
                        <SelectItem key={segmento.id} value={segmento.id}>
                          {segmento.nome} ({segmento.total_contatos} contatos)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Nome da Campanha</label>
                <Input
                  value={novaCampanha.nome}
                  onChange={(e) => setNovaCampanha({...novaCampanha, nome: e.target.value})}
                  placeholder="Ex: Newsletter Semanal"
                />
              </div>

              {novaCampanha.tipo === 'email' && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Assunto</label>
                  <Input
                    value={novaCampanha.assunto}
                    onChange={(e) => setNovaCampanha({...novaCampanha, assunto: e.target.value})}
                    placeholder="Assunto do email"
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Mensagem</label>
                <Textarea
                  value={novaCampanha.mensagem}
                  onChange={(e) => setNovaCampanha({...novaCampanha, mensagem: e.target.value})}
                  placeholder="Conteúdo da mensagem..."
                  className="min-h-[120px]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Agendamento (opcional)</label>
                <Input
                  type="datetime-local"
                  value={novaCampanha.agendamento}
                  onChange={(e) => setNovaCampanha({...novaCampanha, agendamento: e.target.value})}
                />
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={criarCampanha}
                  disabled={!novaCampanha.nome || !novaCampanha.mensagem}
                  className="flex-1"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {novaCampanha.agendamento ? 'Agendar Campanha' : 'Enviar Agora'}
                </Button>
                <Button variant="outline" className="flex-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  Salvar Rascunho
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Templates em Desenvolvimento
                </h3>
                <p className="text-gray-600">
                  Sistema de templates personalizáveis será implementado em breve
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
