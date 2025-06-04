
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePresencaEquipe } from '@/hooks/usePresencaEquipe';
import { useEquipe } from '@/hooks/useEquipe';
import { useToast } from '@/hooks/use-toast';
import { 
  Clock, 
  Calendar as CalendarIcon, 
  User, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Play,
  Square
} from 'lucide-react';

export const ControlePonto = () => {
  const { registros, marcarPresenca, loading } = usePresencaEquipe();
  const { funcionarios } = useEquipe();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedFuncionario, setSelectedFuncionario] = useState<string>('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'presente': return 'bg-green-100 text-green-800';
      case 'ausente': return 'bg-red-100 text-red-800';
      case 'atrasado': return 'bg-yellow-100 text-yellow-800';
      case 'falta_justificada': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'presente': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'ausente': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'atrasado': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'falta_justificada': return <Clock className="w-4 h-4 text-blue-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleMarcarPonto = async (funcionarioId: string, tipo: 'entrada' | 'saida') => {
    try {
      await marcarPresenca(funcionarioId, tipo);
      toast({
        title: "Sucesso",
        description: `${tipo === 'entrada' ? 'Entrada' : 'Saída'} registrada com sucesso`
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao registrar ponto",
        variant: "destructive"
      });
    }
  };

  const calcularHorasTrabalhadas = () => {
    return registros.reduce((total, registro) => {
      return total + (registro.horas_trabalhadas || 0);
    }, 0);
  };

  const registrosHoje = registros.filter(registro => 
    new Date(registro.data).toDateString() === new Date().toDateString()
  );

  const registrosData = registros.filter(registro => 
    new Date(registro.data).toDateString() === selectedDate.toDateString()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Controle de Ponto</h2>
          <p className="text-gray-600">Gerencie a presença da equipe</p>
        </div>
      </div>

      {/* Métricas Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Presentes Hoje</p>
                <p className="text-xl font-bold">
                  {registrosHoje.filter(r => r.status === 'presente').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Ausentes</p>
                <p className="text-xl font-bold">
                  {registrosHoje.filter(r => r.status === 'ausente').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Horas Trabalhadas</p>
                <p className="text-xl font-bold">{Math.round(calcularHorasTrabalhadas())}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Funcionários</p>
                <p className="text-xl font-bold">{funcionarios.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="hoje" className="space-y-4">
        <TabsList>
          <TabsTrigger value="hoje">Hoje</TabsTrigger>
          <TabsTrigger value="calendario">Calendário</TabsTrigger>
          <TabsTrigger value="marcar">Marcar Ponto</TabsTrigger>
          <TabsTrigger value="relatorio">Relatório</TabsTrigger>
        </TabsList>

        <TabsContent value="hoje" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Presença de Hoje</CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {funcionarios.map((funcionario) => {
                  const registro = registrosHoje.find(r => r.funcionario_id === funcionario.id);
                  return (
                    <div key={funcionario.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <User className="w-8 h-8 p-1.5 bg-gray-100 rounded-full" />
                        <div>
                          <h3 className="font-semibold">{funcionario.nome}</h3>
                          <p className="text-sm text-gray-600">{funcionario.cargo}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {registro ? (
                          <>
                            <div className="text-right text-sm">
                              <p>Entrada: {registro.entrada ? new Date(registro.entrada).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '-'}</p>
                              <p>Saída: {registro.saida ? new Date(registro.saida).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '-'}</p>
                              {registro.horas_trabalhadas && (
                                <p>Horas: {registro.horas_trabalhadas}h</p>
                              )}
                            </div>
                            <Badge className={getStatusColor(registro.status)}>
                              {getStatusIcon(registro.status)}
                              {registro.status}
                            </Badge>
                          </>
                        ) : (
                          <Badge className={getStatusColor('ausente')}>
                            {getStatusIcon('ausente')}
                            Não registrado
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendario" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Selecionar Data</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>
                  Registros - {selectedDate.toLocaleDateString('pt-BR')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {registrosData.length > 0 ? (
                    registrosData.map((registro) => (
                      <div key={registro.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(registro.status)}
                          <div>
                            <h3 className="font-semibold">{registro.funcionario?.nome}</h3>
                            <p className="text-sm text-gray-600">{registro.funcionario?.cargo}</p>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <p>Entrada: {registro.entrada ? new Date(registro.entrada).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '-'}</p>
                          <p>Saída: {registro.saida ? new Date(registro.saida).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '-'}</p>
                          {registro.horas_trabalhadas && (
                            <p>Horas: {registro.horas_trabalhadas}h</p>
                          )}
                          <Badge className={getStatusColor(registro.status)}>
                            {registro.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      Nenhum registro encontrado para esta data
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="marcar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Marcar Ponto</CardTitle>
              <CardDescription>Registre entrada ou saída de funcionários</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Select value={selectedFuncionario} onValueChange={setSelectedFuncionario}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um funcionário" />
                    </SelectTrigger>
                    <SelectContent>
                      {funcionarios.map((func) => (
                        <SelectItem key={func.id} value={func.id}>
                          {func.nome} - {func.cargo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedFuncionario && (
                  <div className="flex gap-4">
                    <Button 
                      onClick={() => handleMarcarPonto(selectedFuncionario, 'entrada')}
                      className="flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Marcar Entrada
                    </Button>
                    <Button 
                      onClick={() => handleMarcarPonto(selectedFuncionario, 'saida')}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Square className="w-4 h-4" />
                      Marcar Saída
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relatorio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatório de Presença</CardTitle>
              <CardDescription>Resumo mensal da presença da equipe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {funcionarios.map((funcionario) => {
                  const registrosFuncionario = registros.filter(r => r.funcionario_id === funcionario.id);
                  const diasPresente = registrosFuncionario.filter(r => r.status === 'presente').length;
                  const horasTotais = registrosFuncionario.reduce((total, r) => total + (r.horas_trabalhadas || 0), 0);
                  
                  return (
                    <div key={funcionario.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{funcionario.nome}</h3>
                          <p className="text-sm text-gray-600">{funcionario.cargo}</p>
                        </div>
                        <div className="text-right text-sm">
                          <p><strong>Dias presente:</strong> {diasPresente}</p>
                          <p><strong>Horas totais:</strong> {Math.round(horasTotais)}h</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-center text-sm">
                        <div>
                          <p className="font-semibold text-green-600">
                            {registrosFuncionario.filter(r => r.status === 'presente').length}
                          </p>
                          <p className="text-gray-600">Presente</p>
                        </div>
                        <div>
                          <p className="font-semibold text-red-600">
                            {registrosFuncionario.filter(r => r.status === 'ausente').length}
                          </p>
                          <p className="text-gray-600">Ausente</p>
                        </div>
                        <div>
                          <p className="font-semibold text-yellow-600">
                            {registrosFuncionario.filter(r => r.status === 'atrasado').length}
                          </p>
                          <p className="text-gray-600">Atrasado</p>
                        </div>
                        <div>
                          <p className="font-semibold text-blue-600">
                            {registrosFuncionario.filter(r => r.status === 'falta_justificada').length}
                          </p>
                          <p className="text-gray-600">Justificado</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
