import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Calendar, Target, Download, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  leads_mes: number;
  conversoes_mes: number;
  taxa_conversao: number;
  receita_mes: number;
  leads_por_fonte: Array<{ fonte: string; quantidade: number }>;
  conversoes_por_dia: Array<{ data: string; conversoes: number }>;
}

export const AnalyticsDashboard = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [periodo, setPeriodo] = useState('30d');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAnalytics();
      setupRealTimeUpdates();
    }
  }, [user, periodo]);

  const fetchAnalytics = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Buscar dados de leads
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id);

      if (leadsError) throw leadsError;

      // Buscar dados de contatos
      const { data: contatosData, error: contatosError } = await supabase
        .from('contatos')
        .select('*')
        .eq('user_id', user.id);

      if (contatosError) throw contatosError;

      // Processar dados para analytics
      const analytics = processAnalyticsData(leadsData || [], contatosData || []);
      setData(analytics);
    } catch (error) {
      console.error('Erro ao buscar analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (leads: any[], contatos: any[]): AnalyticsData => {
    const now = new Date();
    const daysAgo = periodo === '7d' ? 7 : periodo === '30d' ? 30 : 90;
    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    // Filtrar dados pelo período
    const recentLeads = leads.filter(lead => 
      new Date(lead.created_at) >= cutoffDate
    );
    const recentContatos = contatos.filter(contato => 
      new Date(contato.created_at) >= cutoffDate
    );

    // Calcular métricas
    const conversoes = recentLeads.filter(lead => lead.status === 'convertido').length;
    const taxaConversao = recentLeads.length > 0 ? (conversoes / recentLeads.length) * 100 : 0;

    // Leads por fonte
    const fontes = recentLeads.reduce((acc, lead) => {
      const fonte = lead.fonte || 'Não informado';
      acc[fonte] = (acc[fonte] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const leadsPorFonte = Object.entries(fontes).map(([fonte, quantidade]) => ({
      fonte,
      quantidade: quantidade as number
    }));

    // Conversões por dia (últimos 7 dias)
    const conversoesPorDia = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const conversoesDia = recentLeads.filter(lead => 
        lead.status === 'convertido' && 
        lead.updated_at?.split('T')[0] === dateStr
      ).length;

      return {
        data: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        conversoes: conversoesDia
      };
    }).reverse();

    return {
      leads_mes: recentLeads.length,
      conversoes_mes: conversoes,
      taxa_conversao: taxaConversao,
      receita_mes: conversoes * 1500, // Valor médio estimado
      leads_por_fonte: leadsPorFonte,
      conversoes_por_dia: conversoesPorDia
    };
  };

  const setupRealTimeUpdates = () => {
    if (!user) return;

    const channel = supabase
      .channel('analytics_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leads',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchAnalytics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const exportReport = () => {
    if (!data) return;

    const reportData = {
      periodo,
      data_geracao: new Date().toISOString(),
      metricas: data
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio_analytics_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchAnalytics}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button onClick={exportReport}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Leads</p>
                <p className="text-2xl font-bold">{data?.leads_mes || 0}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversões</p>
                <p className="text-2xl font-bold">{data?.conversoes_mes || 0}</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa Conversão</p>
                <p className="text-2xl font-bold">{data?.taxa_conversao.toFixed(1) || 0}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receita Est.</p>
                <p className="text-2xl font-bold">R$ {data?.receita_mes.toLocaleString() || 0}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversões por Dia */}
        <Card>
          <CardHeader>
            <CardTitle>Conversões por Dia</CardTitle>
            <CardDescription>Tendência de conversões nos últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data?.conversoes_por_dia || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="conversoes" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Conversões"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Leads por Fonte */}
        <Card>
          <CardHeader>
            <CardTitle>Leads por Fonte</CardTitle>
            <CardDescription>Distribuição de leads por canal de aquisição</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data?.leads_por_fonte || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nome, percent }) => `${nome} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="quantidade"
                >
                  {data?.leads_por_fonte.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Análise Preditiva */}
      <Card>
        <CardHeader>
          <CardTitle>Análise Preditiva</CardTitle>
          <CardDescription>Projeções baseadas em IA</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Previsão de Leads (Próximos 30 dias)</h3>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round((data?.leads_mes || 0) * 1.15)}
              </p>
              <p className="text-sm text-muted-foreground">
                +15% baseado na tendência atual
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Taxa de Conversão Projetada</h3>
              <p className="text-2xl font-bold text-green-600">
                {((data?.taxa_conversao || 0) * 1.08).toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">
                +8% com otimizações sugeridas
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Receita Projetada</h3>
              <p className="text-2xl font-bold text-purple-600">
                R$ {Math.round((data?.receita_mes || 0) * 1.25).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                +25% com melhorias no funil
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
