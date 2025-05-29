
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Vote, Plus, Search, Filter, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";

const SistemaVotacoes = () => {
  const [novaVotacao, setNovaVotacao] = useState({
    projeto: "",
    tipo: "",
    posicionamento: "",
    justificativa: "",
    data: ""
  });

  const votacoes = [
    {
      id: 1,
      projeto: "PL 123/2024 - Iluminação LED",
      tipo: "Projeto de Lei",
      posicionamento: "Favorável",
      data: "2024-05-28",
      status: "Aprovado",
      justificativa: "Importante para economia de energia e sustentabilidade urbana."
    },
    {
      id: 2,
      projeto: "PL 089/2024 - Transporte Público",
      tipo: "Projeto de Lei",
      posicionamento: "Favorável",
      data: "2024-05-25",
      status: "Em tramitação",
      justificativa: "Melhoria necessária para mobilidade urbana."
    },
    {
      id: 3,
      projeto: "Requerimento 045/2024",
      tipo: "Requerimento",
      posicionamento: "Contrário",
      data: "2024-05-20",
      status: "Rejeitado",
      justificativa: "Não atende aos interesses da população."
    }
  ];

  const estatisticas = {
    totalVotacoes: 24,
    favoraveis: 18,
    contrarios: 4,
    abstencoes: 2
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Aprovado':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Rejeitado':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getPosicionamentoBadge = (posicionamento: string) => {
    const variant = posicionamento === 'Favorável' ? 'default' : 
                   posicionamento === 'Contrário' ? 'destructive' : 'secondary';
    return <Badge variant={variant}>{posicionamento}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Sistema de Votações
          </h1>
          <p className="text-gray-600 text-sm">
            Registre e acompanhe seus posicionamentos em plenário
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nova Votação
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Votações</p>
                <p className="text-2xl font-bold text-gray-900">{estatisticas.totalVotacoes}</p>
              </div>
              <Vote className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Favoráveis</p>
                <p className="text-2xl font-bold text-green-600">{estatisticas.favoraveis}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Contrários</p>
                <p className="text-2xl font-bold text-red-600">{estatisticas.contrarios}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Abstenções</p>
                <p className="text-2xl font-bold text-yellow-600">{estatisticas.abstencoes}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário Nova Votação */}
        <Card>
          <CardHeader>
            <CardTitle>Registrar Posicionamento</CardTitle>
            <CardDescription>
              Adicione um novo posicionamento de votação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="projeto">Projeto/Matéria</Label>
              <Input
                id="projeto"
                placeholder="Ex: PL 123/2024 - Descrição"
                value={novaVotacao.projeto}
                onChange={(e) => setNovaVotacao({...novaVotacao, projeto: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={novaVotacao.tipo} onValueChange={(value) => setNovaVotacao({...novaVotacao, tipo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="projeto-lei">Projeto de Lei</SelectItem>
                  <SelectItem value="requerimento">Requerimento</SelectItem>
                  <SelectItem value="emenda">Emenda</SelectItem>
                  <SelectItem value="indicacao">Indicação</SelectItem>
                  <SelectItem value="mocao">Moção</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="posicionamento">Posicionamento</Label>
              <Select value={novaVotacao.posicionamento} onValueChange={(value) => setNovaVotacao({...novaVotacao, posicionamento: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seu voto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="favoravel">Favorável</SelectItem>
                  <SelectItem value="contrario">Contrário</SelectItem>
                  <SelectItem value="abstencao">Abstenção</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="data">Data da Votação</Label>
              <Input
                id="data"
                type="date"
                value={novaVotacao.data}
                onChange={(e) => setNovaVotacao({...novaVotacao, data: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="justificativa">Justificativa</Label>
              <Textarea
                id="justificativa"
                placeholder="Explique os motivos do seu posicionamento..."
                value={novaVotacao.justificativa}
                onChange={(e) => setNovaVotacao({...novaVotacao, justificativa: e.target.value})}
                rows={3}
              />
            </div>

            <Button className="w-full">
              <Vote className="w-4 h-4 mr-2" />
              Registrar Posicionamento
            </Button>
          </CardContent>
        </Card>

        {/* Lista de Votações */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Histórico de Votações</CardTitle>
                <CardDescription>
                  Seus posicionamentos registrados
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {votacoes.map((votacao) => (
                <div key={votacao.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {votacao.projeto}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{votacao.tipo}</Badge>
                        {getPosicionamentoBadge(votacao.posicionamento)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {new Date(votacao.data).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 flex-1">
                      {votacao.justificativa}
                    </p>
                    <div className="flex items-center gap-2 ml-4">
                      {getStatusIcon(votacao.status)}
                      <span className="text-sm font-medium">{votacao.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Relatório de Coerência */}
      <Card>
        <CardHeader>
          <CardTitle>Análise de Coerência</CardTitle>
          <CardDescription>
            Análise dos seus posicionamentos por tema e período
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">🏙️ Infraestrutura</h4>
              <p className="text-sm text-blue-700 mb-1">75% de votos favoráveis</p>
              <p className="text-xs text-blue-600">Alinhado com programa de governo</p>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">🌱 Meio Ambiente</h4>
              <p className="text-sm text-green-700 mb-1">90% de votos favoráveis</p>
              <p className="text-xs text-green-600">Forte comprometimento ambiental</p>
            </div>
            
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">👥 Social</h4>
              <p className="text-sm text-purple-700 mb-1">85% de votos favoráveis</p>
              <p className="text-xs text-purple-600">Consistência nas pautas sociais</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SistemaVotacoes;
