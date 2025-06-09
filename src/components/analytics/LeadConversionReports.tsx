
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Target, Download, Calendar } from 'lucide-react';
import { useLeads } from '@/hooks/useLeads';

interface ConversionMetrics {
  totalLeads: number;
  converted: number;
  conversionRate: number;
  byStatus: Record<string, number>;
  bySource: Record<string, number>;
  byTimeframe: Array<{ period: string; leads: number; converted: number; rate: number }>;
}

export const LeadConversionReports = () => {
  const { leads } = useLeads();
  const [timeRange, setTimeRange] = useState('30d');
  const [metrics, setMetrics] = useState<ConversionMetrics>({
    totalLeads: 0,
    converted: 0,
    conversionRate: 0,
    byStatus: {},
    bySource: {},
    byTimeframe: []
  });

  useEffect(() => {
    calculateMetrics();
  }, [leads, timeRange]);

  const calculateMetrics = () => {
    if (!leads.length) return;

    const now = new Date();
    const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

    const filteredLeads = leads.filter(lead => 
      new Date(lead.created_at) >= startDate
    );

    const converted = filteredLeads.filter(lead => 
      lead.status === 'fechado'
    ).length;

    const conversionRate = filteredLeads.length > 0 
      ? (converted / filteredLeads.length) * 100 
      : 0;

    // Group by status
    const byStatus = filteredLeads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group by source
    const bySource = filteredLeads.reduce((acc, lead) => {
      const source = lead.fonte || 'Não informado';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Timeline data
    const timeframe = [];
    const periodsBack = daysBack === 7 ? 7 : daysBack === 30 ? 6 : 12;
    const periodLength = daysBack === 7 ? 1 : daysBack === 30 ? 5 : 7;

    for (let i = periodsBack - 1; i >= 0; i--) {
      const periodEnd = new Date(now.getTime() - i * periodLength * 24 * 60 * 60 * 1000);
      const periodStart = new Date(periodEnd.getTime() - periodLength * 24 * 60 * 60 * 1000);
      
      const periodLeads = leads.filter(lead => {
        const leadDate = new Date(lead.created_at);
        return leadDate >= periodStart && leadDate < periodEnd;
      });

      const periodConverted = periodLeads.filter(lead => lead.status === 'fechado').length;
      const periodRate = periodLeads.length > 0 ? (periodConverted / periodLeads.length) * 100 : 0;

      timeframe.push({
        period: daysBack === 7 
          ? periodEnd.toLocaleDateString('pt-BR', { weekday: 'short' })
          : daysBack === 30
          ? `Sem ${periodsBack - i}`
          : periodEnd.toLocaleDateString('pt-BR', { month: 'short' }),
        leads: periodLeads.length,
        converted: periodConverted,
        rate: Math.round(periodRate * 10) / 10
      });
    }

    setMetrics({
      totalLeads: filteredLeads.length,
      converted,
      conversionRate: Math.round(conversionRate * 10) / 10,
      byStatus,
      bySource,
      byTimeframe: timeframe
    });
  };

  const statusData = Object.entries(metrics.byStatus).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    percentage: Math.round((count / metrics.totalLeads) * 100)
  }));

  const sourceData = Object.entries(metrics.bySource).map(([source, count]) => ({
    name: source,
    value: count,
    percentage: Math.round((count / metrics.totalLeads) * 100)
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const exportReport = () => {
    const reportData = {
      periodo: timeRange,
      geradoEm: new Date().toISOString(),
      metricas: metrics,
      leads: leads
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-conversao-leads-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Relatórios de Conversão de Leads</h2>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{metrics.totalLeads}</p>
                <p className="text-sm text-gray-600">Total de Leads</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Target className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{metrics.converted}</p>
                <p className="text-sm text-gray-600">Convertidos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{metrics.conversionRate}%</p>
                <p className="text-sm text-gray-600">Taxa de Conversão</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{metrics.totalLeads - metrics.converted}</p>
                <p className="text-sm text-gray-600">Em Andamento</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução da Conversão</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics.byTimeframe}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="leads" fill="#3B82F6" name="Leads" />
              <Bar yAxisId="left" dataKey="converted" fill="#10B981" name="Convertidos" />
              <Line yAxisId="right" type="monotone" dataKey="rate" stroke="#F59E0B" strokeWidth={2} name="Taxa %" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Source Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Leads por Fonte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sourceData.map((source, index) => (
                <div key={source.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm">{source.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={source.percentage} className="w-20 h-2" />
                    <Badge variant="outline">{source.value}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Funil de Conversão</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(metrics.byStatus).map(([status, count]) => {
              const percentage = (count / metrics.totalLeads) * 100;
              return (
                <div key={status} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="capitalize">{status}</span>
                    <span>{count} leads ({Math.round(percentage)}%)</span>
                  </div>
                  <Progress value={percentage} />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
