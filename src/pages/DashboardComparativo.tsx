
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target, 
  Eye,
  ThumbsUp,
  MessageCircle,
  Share2,
  Download,
  Filter
} from "lucide-react";

const DashboardComparativo = () => {
  const [candidatoSelecionado1, setCandidatoSelecionado1] = useState("Ana Silva");
  const [candidatoSelecionado2, setCandidatoSelecionado2] = useState("João Santos");
  const [periodoSelecionado, setPeriodoSelecionado] = useState("30dias");

  const candidatos = [
    "Ana Silva", 
    "João Santos", 
    "Maria Oliveira", 
    "Carlos Lima", 
    "Lucia Costa"
  ];

  const dadosComparativos = {
    "Ana Silva": {
      seguidores: 12500,
      crescimentoSeguidores: 15.2,
      engajamento: 8.5,
      alcance: 45000,
      publicacoes: 28,
      curtidas: 3200,
      comentarios: 450,
      compartilhamentos: 180,
      votos2020: 8500,
      intencaoVoto: 35.2,
      cor: "#3B82F6"
    },
    "João Santos": {
      seguidores: 9800,
      crescimentoSeguidores: 8.7,
      engajamento: 6.2,
      alcance: 32000,
      publicacoes: 22,
      curtidas: 2100,
      comentarios: 320,
      compartilhamentos: 95,
      votos2020: 6200,
      intencaoVoto: 28.8,
      cor: "#10B981"
    },
    "Maria Oliveira": {
      seguidores: 15200,
      crescimentoSeguidores: 22.1,
      engajamento: 9.8,
      alcance: 58000,
      publicacoes: 35,
      curtidas: 4800,
      comentarios: 680,
      compartilhamentos: 290,
      votos2020: 11200,
      intencaoVoto: 42.1,
      cor: "#F59E0B"
    },
    "Carlos Lima": {
      seguidores: 7400,
      crescimentoSeguidores: 5.3,
      engajamento: 5.1,
      alcance: 28000,
      publicacoes: 18,
      curtidas: 1600,
      comentarios: 240,
      compartilhamentos: 65,
      votos2020: 4800,
      intencaoVoto: 18.9,
      cor: "#EF4444"
    },
    "Lucia Costa": {
      seguidores: 11800,
      crescimentoSeguidores: 12.8,
      engajamento: 7.9,
      alcance: 42000,
      publicacoes: 31,
      curtidas: 2900,
      comentarios: 520,
      compartilhamentos: 210,
      votos2020: 9100,
      intencaoVoto: 31.5,
      cor: "#8B5CF6"
    }
  };

  const dadosCandidato1 = dadosComparativos[candidatoSelecionado1];
  const dadosCandidato2 = dadosComparativos[candidatoSelecionado2];

  const dadosGraficoBarras = [
    {
      metrica: "Seguidores",
      [candidatoSelecionado1]: dadosCandidato1.seguidores,
      [candidatoSelecionado2]: dadosCandidato2.seguidores
    },
    {
      metrica: "Engajamento %",
      [candidatoSelecionado1]: dadosCandidato1.engajamento,
      [candidatoSelecionado2]: dadosCandidato2.engajamento
    },
    {
      metrica: "Alcance",
      [candidatoSelecionado1]: dadosCandidato1.alcance / 1000,
      [candidatoSelecionado2]: dadosCandidato2.alcance / 1000
    },
    {
      metrica: "Intenção Voto %",
      [candidatoSelecionado1]: dadosCandidato1.intencaoVoto,
      [candidatoSelecionado2]: dadosCandidato2.intencaoVoto
    }
  ];

  const dadosEvolucaoTempo = [
    { mes: "Jan", [candidatoSelecionado1]: dadosCandidato1.seguidores * 0.7, [candidatoSelecionado2]: dadosCandidato2.seguidores * 0.8 },
    { mes: "Fev", [candidatoSelecionado1]: dadosCandidato1.seguidores * 0.8, [candidatoSelecionado2]: dadosCandidato2.seguidores * 0.85 },
    { mes: "Mar", [candidatoSelecionado1]: dadosCandidato1.seguidores * 0.9, [candidatoSelecionado2]: dadosCandidato2.seguidores * 0.9 },
    { mes: "Abr", [candidatoSelecionado1]: dadosCandidato1.seguidores * 0.95, [candidatoSelecionado2]: dadosCandidato2.seguidores * 0.95 },
    { mes: "Mai", [candidatoSelecionado1]: dadosCandidato1.seguidores, [candidatoSelecionado2]: dadosCandidato2.seguidores }
  ];

  const dadosIntencaoVoto = Object.entries(dadosComparativos).map(([nome, dados]) => ({
    name: nome,
    value: dados.intencaoVoto,
    fill: dados.cor
  }));

  const chartConfig = {
    [candidatoSelecionado1]: {
      label: candidatoSelecionado1,
      color: dadosCandidato1.cor,
    },
    [candidatoSelecionado2]: {
      label: candidatoSelecionado2,
      color: dadosCandidato2.cor,
    },
  };

  const MetricaComparativa = ({ titulo, valor1, valor2, icone: Icon, formato = "numero" }) => {
    const formatarValor = (valor) => {
      if (formato === "percentual") return `${valor}%`;
      if (formato === "numero") return valor.toLocaleString();
      return valor;
    };

    const diferenca = valor1 - valor2;
    const ehMelhor = diferenca > 0;

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Icon className="w-5 h-5 text-gray-600" />
              <h4 className="font-semibold text-gray-900">{titulo}</h4>
            </div>
            {ehMelhor ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{candidatoSelecionado1}</span>
              <span className="font-bold text-lg" style={{ color: dadosCandidato1.cor }}>
                {formatarValor(valor1)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{candidatoSelecionado2}</span>
              <span className="font-bold text-lg" style={{ color: dadosCandidato2.cor }}>
                {formatarValor(valor2)}
              </span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Diferença</span>
                <Badge variant={ehMelhor ? "default" : "destructive"} className="text-xs">
                  {ehMelhor ? "+" : ""}{formatarValor(diferenca)}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Dashboard Comparativo
          </h1>
          <p className="text-gray-600">
            Compare métricas entre candidatos e analise performance
          </p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
          <Download className="w-4 h-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {/* Filtros */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Candidato 1</label>
              <Select value={candidatoSelecionado1} onValueChange={setCandidatoSelecionado1}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {candidatos.map((candidato) => (
                    <SelectItem key={candidato} value={candidato}>
                      {candidato}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Candidato 2</label>
              <Select value={candidatoSelecionado2} onValueChange={setCandidatoSelecionado2}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {candidatos.map((candidato) => (
                    <SelectItem key={candidato} value={candidato}>
                      {candidato}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Período</label>
              <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                  <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                  <SelectItem value="90dias">Últimos 3 meses</SelectItem>
                  <SelectItem value="6meses">Últimos 6 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Comparativas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricaComparativa
          titulo="Seguidores"
          valor1={dadosCandidato1.seguidores}
          valor2={dadosCandidato2.seguidores}
          icone={Users}
          formato="numero"
        />
        <MetricaComparativa
          titulo="Engajamento"
          valor1={dadosCandidato1.engajamento}
          valor2={dadosCandidato2.engajamento}
          icone={ThumbsUp}
          formato="percentual"
        />
        <MetricaComparativa
          titulo="Alcance"
          valor1={dadosCandidato1.alcance}
          valor2={dadosCandidato2.alcance}
          icone={Eye}
          formato="numero"
        />
        <MetricaComparativa
          titulo="Intenção de Voto"
          valor1={dadosCandidato1.intencaoVoto}
          valor2={dadosCandidato2.intencaoVoto}
          icone={Target}
          formato="percentual"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comparativo Direto */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Comparativo Direto
            </CardTitle>
            <CardDescription>
              Métricas principais lado a lado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosGraficoBarras}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metrica" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey={candidatoSelecionado1} fill={dadosCandidato1.cor} radius={4} />
                  <Bar dataKey={candidatoSelecionado2} fill={dadosCandidato2.cor} radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Evolução Temporal */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Evolução de Seguidores
            </CardTitle>
            <CardDescription>
              Crescimento ao longo do tempo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dadosEvolucaoTempo}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey={candidatoSelecionado1} 
                    stroke={dadosCandidato1.cor} 
                    strokeWidth={3}
                    dot={{ fill: dadosCandidato1.cor, strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={candidatoSelecionado2} 
                    stroke={dadosCandidato2.cor} 
                    strokeWidth={3}
                    dot={{ fill: dadosCandidato2.cor, strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Panorama Geral */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Panorama Geral - Intenção de Voto
          </CardTitle>
          <CardDescription>
            Distribuição de intenção de voto entre todos os candidatos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dadosIntencaoVoto}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                    >
                      {dadosIntencaoVoto.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Ranking de Candidatos</h4>
              {Object.entries(dadosComparativos)
                .sort(([, a], [, b]) => b.intencaoVoto - a.intencaoVoto)
                .map(([nome, dados], index) => (
                  <div key={nome} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-white" style={{ backgroundColor: dados.cor }}>
                        {index + 1}
                      </div>
                      <span className="font-medium">{nome}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{dados.intencaoVoto}%</div>
                      <div className="text-sm text-gray-600">{dados.seguidores.toLocaleString()} seguidores</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalhes de Engajamento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: dadosCandidato1.cor }}></div>
              {candidatoSelecionado1}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Curtidas</span>
                <span className="font-semibold">{dadosCandidato1.curtidas.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Comentários</span>
                <span className="font-semibold">{dadosCandidato1.comentarios.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Compartilhamentos</span>
                <span className="font-semibold">{dadosCandidato1.compartilhamentos.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Publicações</span>
                <span className="font-semibold">{dadosCandidato1.publicacoes}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">Votos 2020</span>
                <span className="font-semibold">{dadosCandidato1.votos2020.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: dadosCandidato2.cor }}></div>
              {candidatoSelecionado2}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Curtidas</span>
                <span className="font-semibold">{dadosCandidato2.curtidas.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Comentários</span>
                <span className="font-semibold">{dadosCandidato2.comentarios.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Compartilhamentos</span>
                <span className="font-semibold">{dadosCandidato2.compartilhamentos.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Publicações</span>
                <span className="font-semibold">{dadosCandidato2.publicacoes}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">Votos 2020</span>
                <span className="font-semibold">{dadosCandidato2.votos2020.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardComparativo;
