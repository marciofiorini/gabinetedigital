
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePrevisoes } from '@/hooks/usePrevisoes';
import { TrendingUp, BarChart3, Users, Calendar, Brain, Zap } from "lucide-react";

export const AnalisePredicativa = () => {
  const { previsoes, loading, criarPrevisao } = usePrevisoes();
  const [tipoSelecionado, setTipoSelecionado] = useState('');
  const [periodoSelecionado, setPeriodoSelecionado] = useState('');
  const [criandoPrevisao, setCriandoPrevisao] = useState(false);

  const tiposPrevisao = [
    { value: 'eleitoral', label: 'Previsão Eleitoral', icon: <BarChart3 className="w-4 h-4" /> },
    { value: 'engajamento', label: 'Engajamento Social', icon: <Users className="w-4 h-4" /> },
    { value: 'crescimento', label: 'Crescimento Base', icon: <TrendingUp className="w-4 h-4" /> }
  ];

  const periodosAnalise = [
    { value: '30d', label: '30 dias' },
    { value: '90d', label: '90 dias' },
    { value: '6m', label: '6 meses' },
    { value: '1y', label: '1 ano' }
  ];

  const criarNovaPrevisao = async () => {
    if (!tipoSelecionado || !periodoSelecionado) return;

    setCriandoPrevisao(true);
    try {
      const dadosEntrada = {
        data_analise: new Date().toISOString(),
        parametros_config: {
          incluir_sazonalidade: true,
          ajustar_tendencias: true,
          considerar_eventos: true
        }
      };

      await criarPrevisao(tipoSelecionado, periodoSelecionado, dadosEntrada);
      setTipoSelecionado('');
      setPeriodoSelecionado('');
    } catch (error) {
      console.error('Erro ao criar previsão:', error);
    } finally {
      setCriandoPrevisao(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluido': return 'bg-green-100 text-green-800';
      case 'processando': return 'bg-blue-100 text-blue-800';
      case 'erro': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfiancaColor = (confianca: number) => {
    if (confianca >= 0.8) return 'text-green-600';
    if (confianca >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatarResultado = (previsao: any, tipo: string) => {
    switch (tipo) {
      case 'eleitoral':
        return (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Votos Estimados:</span>
              <span className="font-bold">{previsao.votos_estimados?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Percentual:</span>
              <span className="font-bold">{previsao.percentual_estimado}%</span>
            </div>
            <div className="flex justify-between">
              <span>Tendência:</span>
              <Badge className={previsao.tendencia === 'crescimento' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {previsao.tendencia}
              </Badge>
            </div>
          </div>
        );
      case 'engajamento':
        return (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Novos Seguidores:</span>
              <span className="font-bold">+{previsao.crescimento_seguidores}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxa Engajamento:</span>
              <span className="font-bold">{previsao.taxa_engajamento}</span>
            </div>
            <div className="flex justify-between">
              <span>Alcance Estimado:</span>
              <span className="font-bold">{previsao.alcance_estimado?.toLocaleString()}</span>
            </div>
          </div>
        );
      case 'crescimento':
        return (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Novos Contatos:</span>
              <span className="font-bold">+{previsao.novos_contatos}</span>
            </div>
            <div className="flex justify-between">
              <span>Conversão Leads:</span>
              <span className="font-bold">{previsao.conversao_leads}</span>
            </div>
            <div className="flex justify-between">
              <span>Eventos Sugeridos:</span>
              <span className="font-bold">{previsao.eventos_sugeridos}</span>
            </div>
          </div>
        );
      default:
        return <span>Dados não disponíveis</span>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-purple-200 bg-purple-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <Brain className="w-6 h-6" />
            Análise Preditiva com IA
          </CardTitle>
          <p className="text-purple-700">
            Modelos de Machine Learning para previsões estratégicas e tomada de decisões
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Nova Previsão
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo de Análise</label>
              <Select value={tipoSelecionado} onValueChange={setTipoSelecionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposPrevisao.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      <div className="flex items-center gap-2">
                        {tipo.icon}
                        {tipo.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Período de Análise</label>
              <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  {periodosAnalise.map((periodo) => (
                    <SelectItem key={periodo.value} value={periodo.value}>
                      {periodo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={criarNovaPrevisao}
              disabled={!tipoSelecionado || !periodoSelecionado || criandoPrevisao}
              className="w-full"
            >
              {criandoPrevisao ? 'Processando...' : 'Gerar Previsão'}
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Previsões Recentes</CardTitle>
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
              ) : previsoes.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma previsão ainda
                  </h3>
                  <p className="text-gray-600">
                    Crie sua primeira análise preditiva para começar
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {previsoes.map((previsao) => (
                    <Card key={previsao.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium capitalize">
                              {previsao.tipo_previsao.replace('_', ' ')}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Período: {previsao.periodo_analise} • {previsao.metodologia}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(previsao.status)}>
                              {previsao.status}
                            </Badge>
                            <span className={`text-sm font-medium ${getConfiancaColor(previsao.confianca_previsao)}`}>
                              {(previsao.confianca_previsao * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        
                        {formatarResultado(previsao.previsao_resultado, previsao.tipo_previsao)}
                        
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500">
                            Criado em {new Date(previsao.created_at).toLocaleDateString('pt-BR')}
                            {previsao.valida_ate && (
                              <> • Válido até {new Date(previsao.valida_ate).toLocaleDateString('pt-BR')}</>
                            )}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
