
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, FileText, Download, Calendar, Mail, Settings, Trash2, Clock, Play, Eye } from "lucide-react";
import { useRelatoriosAutomatizados } from '@/hooks/useRelatoriosAutomatizados';

export const RelatoriosPDF = () => {
  const { relatorios, loading, createRelatorio, executarRelatorio } = useRelatoriosAutomatizados();
  const [novoRelatorio, setNovoRelatorio] = useState({
    nome: '',
    tipo_relatorio: 'dashboard',
    formato: 'pdf',
    frequencia: 'semanal',
    destinatarios: [''],
    configuracao: {},
    ativo: true,
    proxima_execucao: null,
    ultima_execucao: null
  });

  const tiposRelatorio = [
    { value: 'dashboard', label: 'Dashboard Geral' },
    { value: 'eleitoral', label: 'Relatório Eleitoral' },
    { value: 'engajamento', label: 'Engajamento' },
    { value: 'financeiro', label: 'Financeiro' }
  ];

  const frequencias = [
    { value: 'diario', label: 'Diário' },
    { value: 'semanal', label: 'Semanal' },
    { value: 'mensal', label: 'Mensal' },
    { value: 'trimestral', label: 'Trimestral' }
  ];

  const formatos = [
    { value: 'pdf', label: 'PDF' },
    { value: 'excel', label: 'Excel' },
    { value: 'csv', label: 'CSV' }
  ];

  const getFrequenciaColor = (freq: string) => {
    switch (freq) {
      case 'diario': return 'bg-green-100 text-green-800';
      case 'semanal': return 'bg-blue-100 text-blue-800';
      case 'mensal': return 'bg-purple-100 text-purple-800';
      case 'trimestral': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFormatoIcon = (formato: string) => {
    switch (formato) {
      case 'pdf': return <FileText className="w-4 h-4" />;
      case 'excel': return <FileText className="w-4 h-4 text-green-600" />;
      case 'csv': return <FileText className="w-4 h-4 text-blue-600" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const handleCreateRelatorio = async () => {
    try {
      await createRelatorio(novoRelatorio);
      setNovoRelatorio({
        nome: '',
        tipo_relatorio: 'dashboard',
        formato: 'pdf',
        frequencia: 'semanal',
        destinatarios: [''],
        configuracao: {},
        ativo: true,
        proxima_execucao: null,
        ultima_execucao: null
      });
    } catch (error) {
      console.error('Erro ao criar relatório:', error);
    }
  };

  const adicionarDestinatario = () => {
    setNovoRelatorio(prev => ({
      ...prev,
      destinatarios: [...prev.destinatarios, '']
    }));
  };

  const removerDestinatario = (index: number) => {
    setNovoRelatorio(prev => ({
      ...prev,
      destinatarios: prev.destinatarios.filter((_, i) => i !== index)
    }));
  };

  const atualizarDestinatario = (index: number, email: string) => {
    setNovoRelatorio(prev => ({
      ...prev,
      destinatarios: prev.destinatarios.map((dest, i) => i === index ? email : dest)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Relatórios Automatizados</h2>
          <p className="text-gray-600">Configure e agende relatórios em PDF/Excel</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Relatório
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Criar Relatório Automatizado</DialogTitle>
              <DialogDescription>
                Configure um relatório para ser gerado automaticamente
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="nome-rel">Nome do Relatório</Label>
                <Input
                  id="nome-rel"
                  value={novoRelatorio.nome}
                  onChange={(e) => setNovoRelatorio(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: Relatório Mensal de Performance"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tipo-rel">Tipo</Label>
                  <Select value={novoRelatorio.tipo_relatorio} onValueChange={(value) => setNovoRelatorio(prev => ({ ...prev, tipo_relatorio: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposRelatorio.map(tipo => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="formato-rel">Formato</Label>
                  <Select value={novoRelatorio.formato} onValueChange={(value) => setNovoRelatorio(prev => ({ ...prev, formato: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {formatos.map(formato => (
                        <SelectItem key={formato.value} value={formato.value}>
                          {formato.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="freq-rel">Frequência</Label>
                <Select value={novoRelatorio.frequencia} onValueChange={(value) => setNovoRelatorio(prev => ({ ...prev, frequencia: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencias.map(freq => (
                      <SelectItem key={freq.value} value={freq.value}>
                        {freq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Destinatários</Label>
                <div className="space-y-2 mt-2">
                  {novoRelatorio.destinatarios.map((email, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={email}
                        onChange={(e) => atualizarDestinatario(index, e.target.value)}
                        placeholder="email@exemplo.com"
                        type="email"
                      />
                      {novoRelatorio.destinatarios.length > 1 && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removerDestinatario(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={adicionarDestinatario}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Destinatário
                  </Button>
                </div>
              </div>
              
              <Button onClick={handleCreateRelatorio} className="w-full">
                Criar Relatório
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="ativos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ativos">Relatórios Ativos</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="ativos" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Carregando relatórios...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatorios.map((relatorio) => (
                <Card key={relatorio.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{relatorio.nome}</CardTitle>
                      <div className="flex items-center gap-2">
                        {getFormatoIcon(relatorio.formato)}
                        <Badge className={getFrequenciaColor(relatorio.frequencia)}>
                          {relatorio.frequencia}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>
                      {tiposRelatorio.find(t => t.value === relatorio.tipo_relatorio)?.label}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{relatorio.destinatarios?.length || 0} destinatário(s)</span>
                      </div>
                      
                      {relatorio.ultima_execucao && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>Último: {new Date(relatorio.ultima_execucao).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {relatorio.proxima_execucao && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Próximo: {new Date(relatorio.proxima_execucao).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => executarRelatorio(relatorio.id)}
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Executar
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {relatorios.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  Nenhum relatório configurado ainda.
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="historico" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Execuções</CardTitle>
              <CardDescription>
                Visualize todos os relatórios gerados nos últimos 30 dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Relatório Mensal de Performance</p>
                        <p className="text-sm text-gray-600">15 Jan 2024, 09:00</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">Enviado</Badge>
                      <Button variant="outline" size="sm">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tiposRelatorio.map((tipo) => (
              <Card key={tipo.value} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {tipo.label}
                  </CardTitle>
                  <CardDescription>
                    Template pré-configurado para {tipo.label.toLowerCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Visualizar Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
