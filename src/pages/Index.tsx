
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Users, Calendar, TrendingUp, Phone, MessageSquare } from 'lucide-react';

const Index = () => {
  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 lg:mt-2 text-sm lg:text-base">
            Bem-vindo ao seu painel político
          </p>
        </div>
      </div>

      {/* Cards de estatísticas básicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contatos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +20% desde o mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demandas Ativas</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              +15 novas esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              3 hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engajamento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">
              +5% esta semana
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Seção de atividades recentes simplificada */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Últimas ações no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Novo contato adicionado</p>
                  <p className="text-xs text-muted-foreground">João Silva - 2 horas atrás</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <MessageSquare className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Demanda atualizada</p>
                  <p className="text-xs text-muted-foreground">Pavimentação Rua A - 4 horas atrás</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Calendar className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Evento agendado</p>
                  <p className="text-xs text-muted-foreground">Reunião pública - 1 dia atrás</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximos Eventos</CardTitle>
            <CardDescription>Agenda dos próximos compromissos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Reunião Pública</h4>
                  <Badge variant="outline">Hoje</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Centro Cívico - 14:00</p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Audiência Pública</h4>
                  <Badge variant="outline">Amanhã</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Câmara Municipal - 19:00</p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Visita Técnica</h4>
                  <Badge variant="outline">30/06</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Bairro Jardim - 09:00</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
