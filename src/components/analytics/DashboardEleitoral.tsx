
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MapPin, 
  Calendar,
  Target,
  Award,
  Vote,
  Percent
} from "lucide-react";

export const DashboardEleitoral = () => {
  const [periodoSelecionado, setPeriodoSelecionado] = useState('2024');

  const dadosEleitorais = {
    resumo: {
      votos_totais: 45382,
      percentual_votos: 23.4,
      posicao_ranking: 2,
      comparacao_anterior: 12.5
    },
    por_zona: [
      { zona: 'Zona Norte', votos: 12500, percentual: 27.5, crescimento: 15.2 },
      { zona: 'Centro', votos: 10800, percentual: 23.8, crescimento: 8.7 },
      { zona: 'Zona Sul', votos: 9200, percentual: 20.3, crescimento: -2.1 },
      { zona: 'Zona Leste', votos: 8150, percentual: 18.0, crescimento: 22.3 },
      { zona: 'Zona Oeste', votos: 4732, percentual: 10.4, crescimento: 5.8 }
    ],
    tendencias: {
      crescimento_mensal: 8.5,
      projecao_final: 52000,
      confianca_projecao: 78
    },
    demograficos: {
      idade_16_24: 18.2,
      idade_25_34: 24.7,
      idade_35_49: 28.1,
      idade_50_64: 21.3,
      idade_65_mais: 7.7
    }
  };

  const getVariacaoColor = (valor: number) => {
    return valor >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getVariacaoIcon = (valor: number) => {
    return valor >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Eleitoral</h2>
          <p className="text-gray-600">Análise completa do desempenho eleitoral</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPeriodoSelecionado('2020')}>
            2020
          </Button>
          <Button 
            variant={periodoSelecionado === '2024' ? 'default' : 'outline'}
            onClick={() => setPeriodoSelecionado('2024')}
          >
            2024
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
                <Vote className="text-white w-6 h-6" />
              </div>
              <Badge className="bg-blue-100 text-blue-800">Total</Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Votos Totais</p>
              <p className="text-2xl font-bold text-gray-900">
                {dadosEleitorais.resumo.votos_totais.toLocaleString()}
              </p>
              <div className={`flex items-center gap-1 text-sm ${getVariacaoColor(dadosEleitorais.resumo.comparacao_anterior)}`}>
                {getVariacaoIcon(dadosEleitorais.resumo.comparacao_anterior)}
                <span>+{dadosEleitorais.resumo.comparacao_anterior}% vs anterior</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center">
                <Percent className="text-white w-6 h-6" />
              </div>
              <Badge className="bg-green-100 text-green-800">%</Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Percentual de Votos</p>
              <p className="text-2xl font-bold text-gray-900">
                {dadosEleitorais.resumo.percentual_votos}%
              </p>
              <p className="text-sm text-gray-600">do total de votos válidos</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center">
                <Award className="text-white w-6 h-6" />
              </div>
              <Badge className="bg-purple-100 text-purple-800">Ranking</Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Posição no Ranking</p>
              <p className="text-2xl font-bold text-gray-900">
                {dadosEleitorais.resumo.posicao_ranking}º lugar
              </p>
              <p className="text-sm text-gray-600">entre todos os candidatos</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-orange-600 flex items-center justify-center">
                <Target className="text-white w-6 h-6" />
              </div>
              <Badge className="bg-orange-100 text-orange-800">Meta</Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Projeção Final</p>
              <p className="text-2xl font-bold text-gray-900">
                {dadosEleitorais.tendencias.projecao_final.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                {dadosEleitorais.tendencias.confianca_projecao}% de confiança
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="zonas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="zonas">Por Zona</TabsTrigger>
          <TabsTrigger value="demograficos">Demográficos</TabsTrigger>
          <TabsTrigger value="tendencias">Tendências</TabsTrigger>
          <TabsTrigger value="comparativo">Comparativo</TabsTrigger>
        </TabsList>

        <TabsContent value="zonas" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Distribuição por Zona Eleitoral
              </CardTitle>
              <CardDescription>
                Desempenho detalhado em cada zona da cidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dadosEleitorais.por_zona.map((zona, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{zona.zona}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{zona.percentual}%</Badge>
                        <div className={`flex items-center gap-1 text-sm ${getVariacaoColor(zona.crescimento)}`}>
                          {getVariacaoIcon(zona.crescimento)}
                          <span>{zona.crescimento > 0 ? '+' : ''}{zona.crescimento}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        {zona.votos.toLocaleString()} votos
                      </span>
                      <span className="text-sm font-medium">
                        {((zona.votos / dadosEleitorais.resumo.votos_totais) * 100).toFixed(1)}% do total
                      </span>
                    </div>
                    <Progress value={(zona.votos / 15000) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demograficos" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Distribuição Demográfica
              </CardTitle>
              <CardDescription>
                Análise por faixa etária dos eleitores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(dadosEleitorais.demograficos).map(([faixa, percentual]) => (
                  <div key={faixa} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="font-medium">
                        {faixa.replace('idade_', '').replace('_', '-').replace('mais', '+').replace('-', ' a ') + ' anos'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={percentual} className="w-24 h-2" />
                      <span className="font-semibold w-12 text-right">{percentual}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tendencias" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Análise de Tendências
              </CardTitle>
              <CardDescription>
                Projeções e tendências baseadas em dados históricos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600">Crescimento Mensal</p>
                  <p className="text-2xl font-bold text-green-600">
                    +{dadosEleitorais.tendencias.crescimento_mensal}%
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">Projeção Final</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {dadosEleitorais.tendencias.projecao_final.toLocaleString()}
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-sm text-gray-600">Confiança</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {dadosEleitorais.tendencias.confianca_projecao}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparativo" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Comparativo Histórico
              </CardTitle>
              <CardDescription>
                Compare o desempenho entre diferentes eleições
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Gráfico comparativo será implementado aqui</p>
                  <p className="text-sm text-gray-400">Mostrando evolução entre 2020 e 2024</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
