
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, MessageSquare, Target } from "lucide-react";

const demandasData = [
  { month: 'Jan', pendentes: 15, concluidas: 25 },
  { month: 'Fev', pendentes: 12, concluidas: 28 },
  { month: 'Mar', pendentes: 18, concluidas: 22 },
  { month: 'Abr', pendentes: 8, concluidas: 35 },
  { month: 'Mai', pendentes: 14, concluidas: 30 },
];

const contatosData = [
  { name: 'Zona Norte', value: 400, color: '#3B82F6' },
  { name: 'Zona Sul', value: 300, color: '#10B981' },
  { name: 'Centro', value: 300, color: '#F59E0B' },
  { name: 'Zona Leste', value: 200, color: '#EF4444' },
];

const engajamentoData = [
  { date: '01/05', whatsapp: 85, instagram: 72, email: 68 },
  { date: '02/05', whatsapp: 88, instagram: 75, email: 70 },
  { date: '03/05', whatsapp: 82, instagram: 78, email: 65 },
  { date: '04/05', whatsapp: 90, instagram: 80, email: 72 },
  { date: '05/05', whatsapp: 87, instagram: 82, email: 74 },
];

const chartConfig = {
  pendentes: {
    label: "Pendentes",
    color: "#F59E0B",
  },
  concluidas: {
    label: "Concluídas",
    color: "#10B981",
  },
  whatsapp: {
    label: "WhatsApp",
    color: "#25D366",
  },
  instagram: {
    label: "Instagram",
    color: "#E4405F",
  },
  email: {
    label: "E-mail",
    color: "#3B82F6",
  },
};

export const DashboardCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Demandas Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Demandas por Mês
          </CardTitle>
          <CardDescription>
            Comparativo entre demandas pendentes e concluídas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demandasData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="pendentes" fill="var(--color-pendentes)" radius={4} />
                <Bar dataKey="concluidas" fill="var(--color-concluidas)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Contatos por Zona */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Contatos por Zona
          </CardTitle>
          <CardDescription>
            Distribuição geográfica dos contatos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={contatosData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {contatosData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Engajamento */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Engajamento das Redes Sociais
          </CardTitle>
          <CardDescription>
            Performance dos últimos 5 dias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engajamentoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="whatsapp" 
                  stroke="var(--color-whatsapp)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-whatsapp)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="instagram" 
                  stroke="var(--color-instagram)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-instagram)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="email" 
                  stroke="var(--color-email)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-email)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
