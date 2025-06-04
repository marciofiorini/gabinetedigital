
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Map, 
  Database, 
  Calculator, 
  Users, 
  Plus, 
  Search, 
  Filter,
  TrendingUp,
  MapPin,
  BarChart3,
  Settings,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2
} from "lucide-react";

export const GestaoEleitoralAvancada = () => {
  const [tabAtiva, setTabAtiva] = useState("mapeamento");
  const [novoCabo, setNovoCabo] = useState({
    nome: '',
    telefone: '',
    zona: '',
    secao: '',
    lideranca: '',
    observacoes: ''
  });

  // Dados simulados de mapeamento eleitoral
  const dadosMapeamento = [
    { zona: "001", secao: "0001", bairro: "Centro", votos2020: 1250, votos2024: 1380, crescimento: 10.4 },
    { zona: "001", secao: "0002", bairro: "Centro", votos2020: 980, votos2024: 1120, crescimento: 14.3 },
    { zona: "002", secao: "0001", bairro: "Zona Norte", votos2020: 850, votos2024: 920, crescimento: 8.2 },
    { zona: "002", secao: "0002", bairro: "Zona Norte", votos2020: 1100, votos2024: 1050, crescimento: -4.5 },
  ];

  // Dados simulados de cabos eleitorais
  const cabosEleitorais = [
    { id: 1, nome: "Maria Silva", telefone: "(11) 99999-0001", zona: "001", secao: "0001", lideranca: "Alta", status: "Ativo" },
    { id: 2, nome: "João Santos", telefone: "(11) 99999-0002", zona: "001", secao: "0002", lideranca: "Média", status: "Ativo" },
    { id: 3, nome: "Ana Costa", telefone: "(11) 99999-0003", zona: "002", secao: "0001", lideranca: "Alta", status: "Inativo" },
    { id: 4, nome: "Pedro Lima", telefone: "(11) 99999-0004", zona: "002", secao: "0002", lideranca: "Baixa", status: "Ativo" },
  ];

  // Dados simulados do simulador
  const cenarios = [
    { nome: "Cenário Otimista", projecao: 25000, percentual: 22.5, probabilidade: 30 },
    { nome: "Cenário Realista", projecao: 20000, percentual: 18.0, probabilidade: 50 },
    { nome: "Cenário Pessimista", projecao: 15000, percentual: 13.5, probabilidade: 20 },
  ];

  const getLiderancaColor = (lideranca: string) => {
    switch (lideranca) {
      case 'Alta': return 'bg-green-100 text-green-800';
      case 'Média': return 'bg-yellow-100 text-yellow-800';
      case 'Baixa': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Ativo' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão Eleitoral Avançada</h2>
          <p className="text-gray-600">Mapeamento, análise e gestão completa da estratégia eleitoral</p>
        </div>
        
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Download className="w-4 h-4 mr-2" />
          Exportar Dados
        </Button>
      </div>

      <Tabs value={tabAtiva} onValueChange={setTabAtiva} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="mapeamento" className="flex items-center gap-2">
            <Map className="w-4 h-4" />
            Mapeamento
          </TabsTrigger>
          <TabsTrigger value="base-dados" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Base de Dados
          </TabsTrigger>
          <TabsTrigger value="simulador" className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Simulador
          </TabsTrigger>
          <TabsTrigger value="cabos" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Cabos Eleitorais
          </TabsTrigger>
        </TabsList>

        {/* Mapeamento Eleitoral */}
        <TabsContent value="mapeamento" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Visualização Geográfica
                </CardTitle>
                <CardDescription>
                  Mapa interativo com dados eleitorais por zona/seção
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-80 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-300">
                  <div className="text-center">
                    <Map className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-blue-600 mb-2">Mapa Interativo</h3>
                    <p className="text-blue-500 text-sm">Visualização geográfica dos dados eleitorais</p>
                    <p className="text-blue-400 text-xs mt-1">Integração com dados do TSE em desenvolvimento</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Filtros de Visualização</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Zona Eleitoral</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as zonas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as zonas</SelectItem>
                      <SelectItem value="001">Zona 001</SelectItem>
                      <SelectItem value="002">Zona 002</SelectItem>
                      <SelectItem value="003">Zona 003</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Ano de Referência</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="2024" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2020">2020</SelectItem>
                      <SelectItem value="2016">2016</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tipo de Visualização</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Heatmap de votos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="heatmap">Heatmap de votos</SelectItem>
                      <SelectItem value="crescimento">Crescimento eleitoral</SelectItem>
                      <SelectItem value="concentracao">Concentração por bairro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">
                  <Filter className="w-4 h-4 mr-2" />
                  Aplicar Filtros
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Dados por Seção */}
          <Card>
            <CardHeader>
              <CardTitle>Dados por Zona/Seção</CardTitle>
              <CardDescription>
                Performance eleitoral detalhada por localização
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dadosMapeamento.map((dado, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm font-semibold">Zona {dado.zona}</p>
                        <p className="text-xs text-gray-600">Seção {dado.secao}</p>
                      </div>
                      <div>
                        <p className="font-medium">{dado.bairro}</p>
                        <p className="text-sm text-gray-600">
                          {dado.votos2020} → {dado.votos2024} votos
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`${dado.crescimento > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {dado.crescimento > 0 ? '+' : ''}{dado.crescimento}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Base de Dados Eleitorais */}
        <TabsContent value="base-dados" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Importar Dados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full">
                    Dados do TSE
                  </Button>
                  <Button variant="outline" className="w-full">
                    Arquivo CSV
                  </Button>
                  <Button variant="outline" className="w-full">
                    Planilha Excel
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Histórico de Eleições</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Eleições 2024</span>
                    <Badge>Em andamento</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Eleições 2020</span>
                    <Badge variant="outline">Completo</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Eleições 2016</span>
                    <Badge variant="outline">Completo</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Análise Comparativa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">+15.2%</p>
                    <p className="text-sm text-gray-600">Crescimento vs 2020</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">23.5k</p>
                    <p className="text-sm text-gray-600">Total de votos projetados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tendências Eleitorais</CardTitle>
              <CardDescription>
                Análise histórica e projeções baseadas em dados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Gráfico de Tendências</h3>
                  <p className="text-gray-500 text-sm">Visualização dos dados históricos e projeções</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Simulador de Cenários */}
        <TabsContent value="simulador" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configurar Simulação
                </CardTitle>
                <CardDescription>
                  Defina as variáveis para projeção eleitoral
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Taxa de Crescimento (%)</Label>
                  <Input type="number" placeholder="Ex: 15" />
                </div>
                
                <div>
                  <Label>Investimento em Campanha (R$)</Label>
                  <Input type="number" placeholder="Ex: 100000" />
                </div>
                
                <div>
                  <Label>Tempo de Campanha (meses)</Label>
                  <Input type="number" placeholder="Ex: 6" />
                </div>
                
                <div>
                  <Label>Fatores Externos</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione fatores" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economia">Situação Econômica</SelectItem>
                      <SelectItem value="obras">Obras Públicas</SelectItem>
                      <SelectItem value="saude">Sistema de Saúde</SelectItem>
                      <SelectItem value="educacao">Educação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">
                  <Calculator className="w-4 h-4 mr-2" />
                  Executar Simulação
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resultados da Simulação</CardTitle>
                <CardDescription>
                  Projeções baseadas nas variáveis configuradas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cenarios.map((cenario, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{cenario.nome}</h4>
                        <Badge variant="outline">{cenario.probabilidade}%</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Votos Projetados</p>
                          <p className="font-semibold text-lg">{cenario.projecao.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Percentual</p>
                          <p className="font-semibold text-lg">{cenario.percentual}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Análise de Sensibilidade</CardTitle>
              <CardDescription>
                Como diferentes fatores impactam o resultado eleitoral
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg flex items-center justify-center border-2 border-dashed border-purple-300">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-purple-600 mb-2">Gráfico de Sensibilidade</h3>
                  <p className="text-purple-500 text-sm">Impacto de cada variável no resultado final</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestão de Cabos Eleitorais */}
        <TabsContent value="cabos" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Cabos Eleitorais</h3>
              <p className="text-sm text-gray-600">Gerencie sua equipe de campanha</p>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Cabo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cadastrar Cabo Eleitoral</DialogTitle>
                  <DialogDescription>
                    Adicione um novo membro à sua equipe de campanha
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 pt-4">
                  <div>
                    <Label>Nome Completo</Label>
                    <Input 
                      value={novoCabo.nome}
                      onChange={(e) => setNovoCabo(prev => ({ ...prev, nome: e.target.value }))}
                      placeholder="Ex: Maria Silva"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Telefone</Label>
                      <Input 
                        value={novoCabo.telefone}
                        onChange={(e) => setNovoCabo(prev => ({ ...prev, telefone: e.target.value }))}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    
                    <div>
                      <Label>Nível de Liderança</Label>
                      <Select value={novoCabo.lideranca} onValueChange={(value) => setNovoCabo(prev => ({ ...prev, lideranca: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Alta">Alta</SelectItem>
                          <SelectItem value="Média">Média</SelectItem>
                          <SelectItem value="Baixa">Baixa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Zona Eleitoral</Label>
                      <Input 
                        value={novoCabo.zona}
                        onChange={(e) => setNovoCabo(prev => ({ ...prev, zona: e.target.value }))}
                        placeholder="Ex: 001"
                      />
                    </div>
                    
                    <div>
                      <Label>Seção</Label>
                      <Input 
                        value={novoCabo.secao}
                        onChange={(e) => setNovoCabo(prev => ({ ...prev, secao: e.target.value }))}
                        placeholder="Ex: 0001"
                      />
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    Cadastrar Cabo
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Lista de Cabos</span>
                <div className="flex items-center gap-2">
                  <Input 
                    placeholder="Buscar cabo..." 
                    className="w-64"
                  />
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cabosEleitorais.map((cabo) => (
                  <div key={cabo.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{cabo.nome}</p>
                        <p className="text-sm text-gray-600">{cabo.telefone}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-600">Zona {cabo.zona} - Seção {cabo.secao}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getLiderancaColor(cabo.lideranca)}>
                        {cabo.lideranca}
                      </Badge>
                      <Badge className={getStatusColor(cabo.status)}>
                        {cabo.status}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas dos Cabos */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">12</p>
                  <p className="text-sm text-gray-600">Total de Cabos</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">10</p>
                  <p className="text-sm text-gray-600">Cabos Ativos</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">5</p>
                  <p className="text-sm text-gray-600">Liderança Alta</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">8</p>
                  <p className="text-sm text-gray-600">Zonas Cobertas</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
