
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAnaliseSegmento } from "@/hooks/useAnaliseSegmento";
import { Brain, Users, Target, TrendingUp, Zap, CheckCircle, BarChart3, Lightbulb } from "lucide-react";

export const SegmentacaoIA = () => {
  const { 
    analises, 
    segmentosIA, 
    loading,
    executarAnaliseDemografica,
    executarAnaliseComportamental,
    gerarSegmentosInteligentes,
    aplicarSegmentoIA
  } = useAnaliseSegmento();

  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null);

  const handleAnaliseClick = async (tipo: 'demografica' | 'comportamental') => {
    setActiveAnalysis(tipo);
    
    if (tipo === 'demografica') {
      await executarAnaliseDemografica({
        algoritmo: 'k-means',
        clusters: 4,
        features: ['idade', 'zona', 'frequencia_contato']
      });
    } else {
      await executarAnaliseComportamental({
        algoritmo: 'random_forest',
        features: ['engajamento', 'tipo_contato_preferido', 'horario_ativo']
      });
    }
    
    setActiveAnalysis(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="w-8 h-8 text-purple-600" />
        <div>
          <h2 className="text-2xl font-bold">IA para Segmentação</h2>
          <p className="text-gray-600">Algoritmos inteligentes para análise automática de contatos</p>
        </div>
      </div>

      <Tabs defaultValue="analises" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analises">Análises IA</TabsTrigger>
          <TabsTrigger value="segmentos">Segmentos Inteligentes</TabsTrigger>
          <TabsTrigger value="insights">Insights & Recomendações</TabsTrigger>
        </TabsList>

        <TabsContent value="analises" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-600" />
                  <div>
                    <CardTitle>Análise Demográfica</CardTitle>
                    <p className="text-sm text-gray-600">Segmentação por idade, localização e perfil</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Algoritmo: K-Means Clustering</span>
                    <Badge variant="outline">IA</Badge>
                  </div>
                  <Button 
                    onClick={() => handleAnaliseClick('demografica')}
                    disabled={loading}
                    className="w-full"
                  >
                    {activeAnalysis === 'demografica' ? (
                      <>
                        <Zap className="w-4 h-4 mr-2 animate-spin" />
                        Analisando...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Executar Análise
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-green-600" />
                  <div>
                    <CardTitle>Análise Comportamental</CardTitle>
                    <p className="text-sm text-gray-600">Padrões de engajamento e interação</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Algoritmo: Random Forest</span>
                    <Badge variant="outline">ML</Badge>
                  </div>
                  <Button 
                    onClick={() => handleAnaliseClick('comportamental')}
                    disabled={loading}
                    className="w-full"
                  >
                    {activeAnalysis === 'comportamental' ? (
                      <>
                        <Zap className="w-4 h-4 mr-2 animate-spin" />
                        Analisando...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Executar Análise
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {analises.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Resultados das Análises</h3>
              {analises.map((analise) => (
                <Card key={analise.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{analise.nome}</CardTitle>
                      <Badge className="bg-green-100 text-green-800">
                        {analise.resultado.confianca}% confiança
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">Distribuição dos Segmentos</h4>
                        <div className="space-y-2">
                          {Object.entries(analise.resultado.distribuicao).map(([segmento, percentual]) => (
                            <div key={segmento} className="flex items-center justify-between">
                              <span className="text-sm">{segmento}</span>
                              <div className="flex items-center gap-2">
                                <Progress value={percentual} className="w-20" />
                                <span className="text-sm font-medium">{percentual}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3">Insights da IA</h4>
                        <ul className="space-y-1">
                          {analise.resultado.insights.map((insight, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="segmentos" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Segmentos Gerados por IA</h3>
            <Button 
              onClick={() => gerarSegmentosInteligentes('completa')}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Brain className="w-4 h-4 mr-2" />
              Gerar Segmentos IA
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {segmentosIA.map((segmento) => (
              <Card key={segmento.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{segmento.nome}</CardTitle>
                    <Badge className="bg-purple-100 text-purple-800">
                      {segmento.score_confianca}% precisão
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{segmento.descricao}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Tamanho estimado:</span>
                      <span className="text-lg font-bold text-blue-600">{segmento.tamanho_estimado} contatos</span>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Personas Identificadas:</h4>
                      <div className="flex flex-wrap gap-1">
                        {segmento.personas.map((persona, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {persona}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Recomendações da IA:</h4>
                      <ul className="space-y-1">
                        {segmento.recomendacoes.slice(0, 2).map((rec, index) => (
                          <li key={index} className="text-xs text-gray-600 flex items-start gap-1">
                            <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      onClick={() => aplicarSegmentoIA(segmento.id)}
                      className="w-full"
                      size="sm"
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Aplicar Segmento
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Precisão dos Modelos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Segmentação Demográfica</span>
                    <span className="font-medium">87.5%</span>
                  </div>
                  <Progress value={87.5} />
                  <div className="flex justify-between">
                    <span className="text-sm">Análise Comportamental</span>
                    <span className="font-medium">92.3%</span>
                  </div>
                  <Progress value={92.3} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  Eficácia da Segmentação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">+47%</div>
                  <p className="text-sm text-gray-600">Aumento no engajamento com segmentação IA</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  Insights Principais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    Jovens preferem WhatsApp (89% taxa de abertura)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    Famílias respondem melhor a emails estruturados
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    Idosos valorizam contato presencial
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recomendações Estratégicas da IA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 text-green-600">Oportunidades Identificadas</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mt-0.5" />
                      Segmento "Jovens Tech-Savvy" tem potencial de crescimento de 23%
                    </li>
                    <li className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mt-0.5" />
                      Zona Sul subrepresentada - oportunidade de expansão
                    </li>
                    <li className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mt-0.5" />
                      Horário noturno (19h-22h) ideal para engajamento
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3 text-blue-600">Próximos Passos Sugeridos</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Brain className="w-4 h-4 text-blue-500 mt-0.5" />
                      Implementar campanha específica para jovens
                    </li>
                    <li className="flex items-start gap-2">
                      <Brain className="w-4 h-4 text-blue-500 mt-0.5" />
                      Criar conteúdo diferenciado por faixa etária
                    </li>
                    <li className="flex items-start gap-2">
                      <Brain className="w-4 h-4 text-blue-500 mt-0.5" />
                      Testar novos canais de comunicação
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
