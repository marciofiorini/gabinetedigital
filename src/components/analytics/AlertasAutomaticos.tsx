
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Bell, TrendingUp, TrendingDown, AlertTriangle, Settings } from "lucide-react";
import { useKpisPersonalizados } from '@/hooks/useKpisPersonalizados';

export const AlertasAutomaticos = () => {
  const { kpis } = useKpisPersonalizados();
  const [novoAlerta, setNovoAlerta] = useState({
    nome: '',
    tipo: 'kpi',
    metrica: '',
    condicao: 'maior_que',
    valor_limite: 0,
    ativo: true
  });

  const [alertasAtivos] = useState([
    {
      id: '1',
      nome: 'Meta de Contatos Atingida',
      metrica: 'Total de Contatos',
      condicao: 'maior_que',
      valor_limite: 1000,
      status: 'ativo',
      ultima_verificacao: '2024-01-15 14:30',
      disparos_hoje: 2
    },
    {
      id: '2', 
      nome: 'Queda no Engajamento',
      metrica: 'Taxa de Engajamento',
      condicao: 'menor_que',
      valor_limite: 5,
      status: 'alerta',
      ultima_verificacao: '2024-01-15 15:45',
      disparos_hoje: 1
    }
  ]);

  const tiposAlerta = [
    { value: 'kpi', label: 'KPI Personalizado' },
    { value: 'engajamento', label: 'Engajamento' },
    { value: 'crescimento', label: 'Crescimento' },
    { value: 'financeiro', label: 'Financeiro' }
  ];

  const condicoes = [
    { value: 'maior_que', label: 'Maior que' },
    { value: 'menor_que', label: 'Menor que' },
    { value: 'igual_a', label: 'Igual a' },
    { value: 'mudanca_percentual', label: 'Mudança percentual' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'alerta': return 'bg-red-100 text-red-800';
      case 'pausado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ativo': return <TrendingUp className="w-4 h-4" />;
      case 'alerta': return <AlertTriangle className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Alertas Automáticos</h2>
          <p className="text-gray-600">Configure alertas inteligentes para suas métricas</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Alerta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Novo Alerta</DialogTitle>
              <DialogDescription>
                Configure um alerta automático para monitorar suas métricas
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="nome">Nome do Alerta</Label>
                <Input
                  id="nome"
                  value={novoAlerta.nome}
                  onChange={(e) => setNovoAlerta(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: Meta de leads atingida"
                />
              </div>
              
              <div>
                <Label htmlFor="tipo">Tipo</Label>
                <Select value={novoAlerta.tipo} onValueChange={(value) => setNovoAlerta(prev => ({ ...prev, tipo: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposAlerta.map(tipo => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="condicao">Condição</Label>
                <Select value={novoAlerta.condicao} onValueChange={(value) => setNovoAlerta(prev => ({ ...prev, condicao: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {condicoes.map(condicao => (
                      <SelectItem key={condicao.value} value={condicao.value}>
                        {condicao.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="valor">Valor Limite</Label>
                <Input
                  id="valor"
                  type="number"
                  value={novoAlerta.valor_limite}
                  onChange={(e) => setNovoAlerta(prev => ({ ...prev, valor_limite: Number(e.target.value) }))}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="ativo"
                  checked={novoAlerta.ativo}
                  onCheckedChange={(checked) => setNovoAlerta(prev => ({ ...prev, ativo: checked }))}
                />
                <Label htmlFor="ativo">Ativar alerta</Label>
              </div>
              
              <Button className="w-full">Criar Alerta</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="ativos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ativos">Alertas Ativos</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="ativos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alertasAtivos.map((alerta) => (
              <Card key={alerta.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{alerta.nome}</CardTitle>
                    <Badge className={getStatusColor(alerta.status)}>
                      {getStatusIcon(alerta.status)}
                      <span className="ml-1 capitalize">{alerta.status}</span>
                    </Badge>
                  </div>
                  <CardDescription>
                    {alerta.metrica} {alerta.condicao.replace('_', ' ')} {alerta.valor_limite}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Última verificação:</span>
                      <span>{alerta.ultima_verificacao}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Disparos hoje:</span>
                      <span className="font-semibold">{alerta.disparos_hoje}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    <Settings className="w-3 h-3 mr-2" />
                    Configurar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="historico" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Alertas</CardTitle>
              <CardDescription>
                Visualize todos os alertas disparados nos últimos 30 dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Meta de contatos atingida</p>
                        <p className="text-sm text-gray-600">15 Jan 2024, 14:30</p>
                      </div>
                    </div>
                    <Badge variant="outline">Disparado</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuracoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Globais</CardTitle>
              <CardDescription>
                Configure as preferências gerais dos alertas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificações por email</p>
                  <p className="text-sm text-gray-600">Receber alertas por email</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificações push</p>
                  <p className="text-sm text-gray-600">Receber alertas no navegador</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Agrupar alertas similares</p>
                  <p className="text-sm text-gray-600">Evitar spam de notificações</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div>
                <Label htmlFor="frequencia">Frequência de verificação</Label>
                <Select defaultValue="15min">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5min">A cada 5 minutos</SelectItem>
                    <SelectItem value="15min">A cada 15 minutos</SelectItem>
                    <SelectItem value="30min">A cada 30 minutos</SelectItem>
                    <SelectItem value="1h">A cada hora</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
