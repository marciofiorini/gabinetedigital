
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface DadosGeograficos {
  regiao: string;
  votos: number;
  percentual: number;
  posicao: number;
  tipo: 'excelente' | 'bom' | 'regular' | 'ruim';
}

export const HeatmapGeografico = () => {
  const [dadosGeograficos, setDadosGeograficos] = useState<DadosGeograficos[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState('municipio');
  const [candidatoSelecionado, setCandidatoSelecionado] = useState('');
  const [candidatos, setCandidatos] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCandidatos();
    }
  }, [user]);

  useEffect(() => {
    if (candidatoSelecionado) {
      fetchDadosGeograficos();
    }
  }, [candidatoSelecionado, filtroTipo]);

  const fetchCandidatos = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('dados_eleitorais')
        .select('candidato_nome')
        .eq('user_id', user.id)
        .eq('is_candidato_proprio', true);

      if (error) throw error;

      const listaCandidatos = [...new Set(data?.map(item => item.candidato_nome) || [])];
      setCandidatos(listaCandidatos);
      if (listaCandidatos.length > 0 && !candidatoSelecionado) {
        setCandidatoSelecionado(listaCandidatos[0]);
      }
    } catch (error) {
      console.error('Erro ao buscar candidatos:', error);
    }
  };

  const fetchDadosGeograficos = async () => {
    if (!user || !candidatoSelecionado) return;

    setLoading(true);
    try {
      const campoAgrupamento = filtroTipo === 'municipio' ? 'municipio' : 
                             filtroTipo === 'zona' ? 'zona_eleitoral' : 'bairro';

      const { data, error } = await supabase
        .from('dados_eleitorais')
        .select('*')
        .eq('user_id', user.id)
        .eq('candidato_nome', candidatoSelecionado);

      if (error) throw error;

      // Agrupar dados por região
      const dadosAgrupados = (data || []).reduce((acc, item) => {
        const regiao = item[campoAgrupamento] || 'Não informado';
        if (!acc[regiao]) {
          acc[regiao] = { votos: 0, count: 0 };
        }
        acc[regiao].votos += item.total_votos || 0;
        acc[regiao].count += 1;
        return acc;
      }, {} as Record<string, { votos: number; count: number }>);

      const totalVotos = Object.values(dadosAgrupados).reduce((sum, item) => sum + item.votos, 0);

      // Calcular dados geográficos
      const dadosFormatados: DadosGeograficos[] = Object.entries(dadosAgrupados)
        .map(([regiao, dados], index) => {
          const percentual = totalVotos > 0 ? (dados.votos / totalVotos) * 100 : 0;
          let tipo: 'excelente' | 'bom' | 'regular' | 'ruim' = 'ruim';
          
          if (percentual >= 15) tipo = 'excelente';
          else if (percentual >= 10) tipo = 'bom';
          else if (percentual >= 5) tipo = 'regular';

          return {
            regiao,
            votos: dados.votos,
            percentual,
            posicao: index + 1,
            tipo
          };
        })
        .sort((a, b) => b.votos - a.votos)
        .map((item, index) => ({ ...item, posicao: index + 1 }));

      setDadosGeograficos(dadosFormatados);
    } catch (error) {
      console.error('Erro ao buscar dados geográficos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'excelente': return 'bg-green-500';
      case 'bom': return 'bg-blue-500';
      case 'regular': return 'bg-yellow-500';
      case 'ruim': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTipoBadgeColor = (tipo: string) => {
    switch (tipo) {
      case 'excelente': return 'bg-green-100 text-green-800 border-green-200';
      case 'bom': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'regular': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ruim': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const maxVotos = Math.max(...dadosGeograficos.map(d => d.votos), 1);

  if (loading) {
    return <div className="flex items-center justify-center p-8">Carregando mapa...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Candidato</label>
              <Select value={candidatoSelecionado} onValueChange={setCandidatoSelecionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um candidato" />
                </SelectTrigger>
                <SelectContent>
                  {candidatos.map(candidato => (
                    <SelectItem key={candidato} value={candidato}>
                      {candidato}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Agrupar por</label>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="municipio">Município</SelectItem>
                  <SelectItem value="zona">Zona Eleitoral</SelectItem>
                  <SelectItem value="bairro">Bairro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legenda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Legenda de Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm">Excelente (≥15%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm">Bom (10-15%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm">Regular (5-10%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm">Baixo (&lt;5%)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Mapa de Calor - Distribuição de Votos
          </CardTitle>
          <CardDescription>
            Visualização da performance eleitoral por {filtroTipo}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dadosGeograficos.map((dado, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-bold text-gray-600">#{dado.posicao}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{dado.regiao}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`${getTipoBadgeColor(dado.tipo)} border`}>
                          {dado.tipo}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {dado.percentual.toFixed(2)}% dos votos
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {dado.votos.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">votos</div>
                  </div>
                </div>

                {/* Barra de progresso */}
                <div className="relative bg-gray-200 rounded-full h-3 mt-3">
                  <div
                    className={`${getTipoColor(dado.tipo)} h-3 rounded-full transition-all duration-500`}
                    style={{
                      width: `${(dado.votos / maxVotos) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}

            {dadosGeograficos.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum dado encontrado para o candidato selecionado</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
