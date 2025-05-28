
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MapPin, TrendingUp, Trophy, Users } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardEleitoralProps {
  detalhado?: boolean;
}

export const DashboardEleitoral = ({ detalhado = false }: DashboardEleitoralProps) => {
  const [dadosEleitorais, setDadosEleitorais] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVotos: 0,
    totalCandidatos: 0,
    melhorPosicao: 0,
    municipios: 0
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchDadosEleitorais();
  }, [user]);

  const fetchDadosEleitorais = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('dados_eleitorais')
        .select('*')
        .eq('user_id', user.id)
        .order('total_votos', { ascending: false });

      if (error) throw error;

      setDadosEleitorais(data || []);
      
      // Calcular estatísticas
      if (data && data.length > 0) {
        const totalVotos = data.reduce((sum, item) => sum + (item.total_votos || 0), 0);
        const totalCandidatos = new Set(data.map(item => item.candidato_nome)).size;
        const melhorPosicao = Math.min(...data.filter(item => item.posicao_ranking > 0).map(item => item.posicao_ranking));
        const municipios = new Set(data.map(item => item.municipio)).size;

        setStats({
          totalVotos,
          totalCandidatos,
          melhorPosicao: melhorPosicao === Infinity ? 0 : melhorPosicao,
          municipios
        });
      }
    } catch (error) {
      console.error('Erro ao buscar dados eleitorais:', error);
    } finally {
      setLoading(false);
    }
  };

  const dadosPorMunicipio = dadosEleitorais.reduce((acc, item) => {
    const existing = acc.find(x => x.municipio === item.municipio);
    if (existing) {
      existing.votos += item.total_votos || 0;
    } else {
      acc.push({
        municipio: item.municipio,
        votos: item.total_votos || 0
      });
    }
    return acc;
  }, [] as any[]).slice(0, 10);

  const dadosPorCandidato = dadosEleitorais.reduce((acc, item) => {
    const existing = acc.find(x => x.candidato === item.candidato_nome);
    if (existing) {
      existing.votos += item.total_votos || 0;
    } else {
      acc.push({
        candidato: item.candidato_nome,
        votos: item.total_votos || 0,
        proprio: item.is_candidato_proprio
      });
    }
    return acc;
  }, [] as any[]).slice(0, 8);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

  if (loading) {
    return <div className="flex items-center justify-center p-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas Resumidas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Total de Votos</p>
                <p className="text-xl font-bold">{stats.totalVotos.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Candidatos</p>
                <p className="text-xl font-bold">{stats.totalCandidatos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Melhor Posição</p>
                <p className="text-xl font-bold">{stats.melhorPosicao || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Municípios</p>
                <p className="text-xl font-bold">{stats.municipios}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Votos por Município</CardTitle>
            <CardDescription>Top 10 municípios com mais votos</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosPorMunicipio}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="municipio" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="votos" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Candidato</CardTitle>
            <CardDescription>Comparativo de votos entre candidatos</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dadosPorCandidato}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ candidato, votos }) => `${candidato}: ${votos}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="votos"
                >
                  {dadosPorCandidato.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.proprio ? '#10B981' : COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {detalhado && (
        <Card>
          <CardHeader>
            <CardTitle>Todos os Registros</CardTitle>
            <CardDescription>Dados eleitorais detalhados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-2 text-left">Candidato</th>
                    <th className="border border-gray-300 p-2 text-left">Cargo</th>
                    <th className="border border-gray-300 p-2 text-left">Município</th>
                    <th className="border border-gray-300 p-2 text-left">Votos</th>
                    <th className="border border-gray-300 p-2 text-left">Posição</th>
                    <th className="border border-gray-300 p-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dadosEleitorais.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">
                        {item.candidato_nome}
                        {item.is_candidato_proprio && (
                          <Badge className="ml-2" variant="default">Próprio</Badge>
                        )}
                      </td>
                      <td className="border border-gray-300 p-2">{item.cargo}</td>
                      <td className="border border-gray-300 p-2">{item.municipio}</td>
                      <td className="border border-gray-300 p-2">{item.total_votos?.toLocaleString()}</td>
                      <td className="border border-gray-300 p-2">{item.posicao_ranking || 'N/A'}</td>
                      <td className="border border-gray-300 p-2">
                        <Badge variant={item.situacao === 'eleito' ? 'default' : 'secondary'}>
                          {item.situacao || 'N/A'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
