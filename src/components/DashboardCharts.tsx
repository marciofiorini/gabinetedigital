
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export const DashboardCharts = () => {
  const contatosData = [
    { mes: 'Jan', novos: 45, total: 120 },
    { mes: 'Fev', novos: 52, total: 172 },
    { mes: 'Mar', novos: 38, total: 210 },
    { mes: 'Abr', novos: 61, total: 271 },
    { mes: 'Mai', novos: 55, total: 326 },
    { mes: 'Jun', novos: 67, total: 393 }
  ];

  const demandasData = [
    { categoria: 'Infraestrutura', quantidade: 45 },
    { categoria: 'Saúde', quantidade: 32 },
    { categoria: 'Educação', quantidade: 28 },
    { categoria: 'Segurança', quantidade: 22 },
    { categoria: 'Outros', quantidade: 18 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
      {/* Gráfico de Contatos */}
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Crescimento de Contatos</CardTitle>
          <CardDescription>
            Evolução mensal da base de contatos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={contatosData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="novos" fill="#3b82f6" name="Novos Contatos" />
              <Bar dataKey="total" fill="#10b981" name="Total Acumulado" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Demandas */}
      <Card>
        <CardHeader>
          <CardTitle>Demandas por Categoria</CardTitle>
          <CardDescription>
            Distribuição das demandas recebidas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={demandasData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="quantidade"
              >
                {demandasData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
