
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Instagram, Youtube, Users, TrendingUp } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardRedesSociaisProps {
  detalhado?: boolean;
}

export const DashboardRedesSociais = ({ detalhado = false }: DashboardRedesSociaisProps) => {
  const [dadosRedes, setDadosRedes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSeguidores: 0,
    melhorEngajamento: 0,
    totalPublicacoes: 0,
    redesMonitoradas: 0
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchDadosRedes();
  }, [user]);

  const fetchDadosRedes = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('dados_redes_sociais')
        .select('*')
        .eq('user_id', user.id)
        .order('data_coleta', { ascending: false });

      if (error) throw error;

      setDadosRedes(data || []);
      
      // Calcular estatísticas
      if (data && data.length > 0) {
        const totalSeguidores = data.reduce((sum, item) => sum + (item.seguidores || 0), 0);
        const melhorEngajamento = Math.max(...data.map(item => item.engajamento_medio || 0));
        const totalPublicacoes = data.reduce((sum, item) => sum + (item.publicacoes || 0), 0);
        const redesMonitoradas = new Set(data.map(item => item.rede_social)).size;

        setStats({
          totalSeguidores,
          melhorEngajamento,
          totalPublicacoes,
          redesMonitoradas
        });
      }
    } catch (error) {
      console.error('Erro ao buscar dados de redes sociais:', error);
    } finally {
      setLoading(false);
    }
  };

  const dadosPorRede = dadosRedes.reduce((acc, item) => {
    const existing = acc.find(x => x.rede === item.rede_social);
    if (existing) {
      existing.seguidores += item.seguidores || 0;
      existing.engajamento = Math.max(existing.engajamento, item.engajamento_medio || 0);
    } else {
      acc.push({
        rede: item.rede_social,
        seguidores: item.seguidores || 0,
        engajamento: item.engajamento_medio || 0
      });
    }
    return acc;
  }, [] as any[]);

  const evolucaoTemporal = dadosRedes
    .reduce((acc, item) => {
      const existing = acc.find(x => x.data === item.data_coleta);
      if (existing) {
        existing.seguidores += item.seguidores || 0;
      } else {
        acc.push({
          data: item.data_coleta,
          seguidores: item.seguidores || 0
        });
      }
      return acc;
    }, [] as any[])
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
    .slice(-30); // Últimos 30 registros

  const getRedeIcon = (rede: string) => {
    switch (rede.toLowerCase()) {
      case 'instagram': return <Instagram className="w-4 h-4" />;
      case 'youtube': return <Youtube className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

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
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Seguidores</p>
                <p className="text-xl font-bold">{stats.totalSeguidores.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Melhor Engajamento</p>
                <p className="text-xl font-bold">{stats.melhorEngajamento.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Instagram className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Publicações</p>
                <p className="text-xl font-bold">{stats.totalPublicacoes.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Youtube className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Redes Monitoradas</p>
                <p className="text-xl font-bold">{stats.redesMonitoradas}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Seguidores por Rede Social</CardTitle>
            <CardDescription>Distribuição de seguidores</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosPorRede}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rede" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="seguidores" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evolução de Seguidores</CardTitle>
            <CardDescription>Crescimento ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={evolucaoTemporal}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="seguidores" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {detalhado && (
        <Card>
          <CardHeader>
            <CardTitle>Todos os Registros</CardTitle>
            <CardDescription>Dados detalhados de redes sociais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-2 text-left">Candidato</th>
                    <th className="border border-gray-300 p-2 text-left">Rede</th>
                    <th className="border border-gray-300 p-2 text-left">Handle</th>
                    <th className="border border-gray-300 p-2 text-left">Seguidores</th>
                    <th className="border border-gray-300 p-2 text-left">Engajamento</th>
                    <th className="border border-gray-300 p-2 text-left">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {dadosRedes.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">
                        {item.candidato_nome}
                        {item.is_candidato_proprio && (
                          <Badge className="ml-2" variant="default">Próprio</Badge>
                        )}
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="flex items-center gap-2">
                          {getRedeIcon(item.rede_social)}
                          {item.rede_social}
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">{item.handle_usuario}</td>
                      <td className="border border-gray-300 p-2">{item.seguidores?.toLocaleString()}</td>
                      <td className="border border-gray-300 p-2">{item.engajamento_medio?.toFixed(2)}%</td>
                      <td className="border border-gray-300 p-2">{new Date(item.data_coleta).toLocaleDateString()}</td>
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
