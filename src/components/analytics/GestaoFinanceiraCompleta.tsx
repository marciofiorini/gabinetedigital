
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  DollarSign, 
  CreditCard, 
  Building2, 
  Shield, 
  Plus, 
  Search, 
  Filter,
  TrendingUp,
  AlertTriangle,
  FileText,
  Download,
  Upload,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { useToastEnhanced } from '@/hooks/useToastEnhanced';

export const GestaoFinanceiraCompleta = () => {
  const [tabAtiva, setTabAtiva] = useState("doacoes");
  const { showSuccess, showError } = useToastEnhanced();
  
  const [novaDoacao, setNovaDoacao] = useState({
    doador: '',
    valor: '',
    tipo: '',
    data: '',
    observacoes: ''
  });

  const [novoOrcamento, setNovoOrcamento] = useState({
    categoria: '',
    valor_planejado: '',
    periodo: '',
    descricao: ''
  });

  // Dados simulados de doações
  const doacoes = [
    { id: 1, doador: "João Silva", valor: 5000, tipo: "PIX", data: "2024-05-27", status: "Confirmada", comprovante: true },
    { id: 2, doador: "Maria Santos", valor: 2500, tipo: "Transferência", data: "2024-05-26", status: "Pendente", comprovante: false },
    { id: 3, doador: "Pedro Costa", valor: 1000, tipo: "Dinheiro", data: "2024-05-25", status: "Confirmada", comprovante: true },
    { id: 4, doador: "Ana Lima", valor: 3000, tipo: "PIX", data: "2024-05-24", status: "Confirmada", comprovante: true },
  ];

  // Dados simulados de orçamento
  const orcamento = [
    { categoria: "Material Gráfico", planejado: 15000, executado: 12500, disponivel: 2500, periodo: "Mai/2024" },
    { categoria: "Eventos", planejado: 25000, executado: 18000, disponivel: 7000, periodo: "Mai/2024" },
    { categoria: "Marketing Digital", planejado: 10000, executado: 8500, disponivel: 1500, periodo: "Mai/2024" },
    { categoria: "Transporte", planejado: 8000, executado: 6200, disponivel: 1800, periodo: "Mai/2024" },
  ];

  // Dados simulados de transações bancárias
  const transacoesBancarias = [
    { id: 1, data: "2024-05-27", descricao: "Doação João Silva", valor: 5000, tipo: "Entrada", conciliado: true, categoria: "Doação" },
    { id: 2, data: "2024-05-27", descricao: "Pagamento Gráfica", valor: -2500, tipo: "Saída", conciliado: true, categoria: "Material Gráfico" },
    { id: 3, data: "2024-05-26", descricao: "Doação Maria Santos", valor: 2500, tipo: "Entrada", conciliado: false, categoria: "Doação" },
    { id: 4, data: "2024-05-25", descricao: "Aluguel Som", valor: -800, tipo: "Saída", conciliado: true, categoria: "Eventos" },
  ];

  // Dados simulados de auditoria
  const alertasAuditoria = [
    { tipo: "warning", titulo: "Doação não comprovada", descricao: "Maria Santos - R$ 2.500 sem comprovante", prioridade: "Alta" },
    { tipo: "info", titulo: "Limite de categoria", descricao: "Marketing Digital próximo do limite (85%)", prioridade: "Média" },
    { tipo: "success", titulo: "Conformidade OK", descricao: "Todas as doações do período declaradas", prioridade: "Baixa" },
    { tipo: "error", titulo: "Transação não conciliada", descricao: "Entrada de R$ 2.500 pendente de conciliação", prioridade: "Alta" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmada': return 'bg-green-100 text-green-800';
      case 'Pendente': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoColor = (tipo: string) => {
    return tipo === 'Entrada' 
      ? 'text-green-600' 
      : 'text-red-600';
  };

  const getAlertColor = (tipo: string) => {
    switch (tipo) {
      case 'success': return 'border-green-200 bg-green-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'error': return 'border-red-200 bg-red-50';
      case 'info': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const handleNovaDoacao = () => {
    showSuccess("Doação cadastrada", "Nova doação registrada com sucesso");
    setNovaDoacao({ doador: '', valor: '', tipo: '', data: '', observacoes: '' });
  };

  const handleNovoOrcamento = () => {
    showSuccess("Orçamento atualizado", "Nova categoria de orçamento adicionada");
    setNovoOrcamento({ categoria: '', valor_planejado: '', periodo: '', descricao: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão Financeira Completa</h2>
          <p className="text-gray-600">Controle total das finanças da campanha e prestação de contas</p>
        </div>
        
        <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
          <Download className="w-4 h-4 mr-2" />
          Relatório Financeiro
        </Button>
      </div>

      <Tabs value={tabAtiva} onValueChange={setTabAtiva} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="doacoes" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Doações
          </TabsTrigger>
          <TabsTrigger value="orcamento" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Orçamento
          </TabsTrigger>
          <TabsTrigger value="bancario" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Integração Bancária
          </TabsTrigger>
          <TabsTrigger value="auditoria" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Auditoria
          </TabsTrigger>
        </TabsList>

        {/* Controle de Doações */}
        <TabsContent value="doacoes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">R$ 11.500</p>
                  <p className="text-sm text-gray-600">Total Arrecadado</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">4</p>
                  <p className="text-sm text-gray-600">Doações Este Mês</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">R$ 2.500</p>
                  <p className="text-sm text-gray-600">Pendente Comprovação</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">R$ 2.875</p>
                  <p className="text-sm text-gray-600">Ticket Médio</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Registro de Doações</h3>
              <p className="text-sm text-gray-600">Gestão transparente de todas as doações recebidas</p>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Doação
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Registrar Nova Doação</DialogTitle>
                  <DialogDescription>
                    Adicione uma nova doação ao sistema
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 pt-4">
                  <div>
                    <Label>Nome do Doador</Label>
                    <Input 
                      value={novaDoacao.doador}
                      onChange={(e) => setNovaDoacao(prev => ({ ...prev, doador: e.target.value }))}
                      placeholder="Ex: João Silva"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Valor (R$)</Label>
                      <Input 
                        type="number"
                        value={novaDoacao.valor}
                        onChange={(e) => setNovaDoacao(prev => ({ ...prev, valor: e.target.value }))}
                        placeholder="0,00"
                      />
                    </div>
                    
                    <div>
                      <Label>Tipo de Doação</Label>
                      <Select value={novaDoacao.tipo} onValueChange={(value) => setNovaDoacao(prev => ({ ...prev, tipo: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PIX">PIX</SelectItem>
                          <SelectItem value="Transferência">Transferência</SelectItem>
                          <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                          <SelectItem value="Cheque">Cheque</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Data da Doação</Label>
                    <Input 
                      type="date"
                      value={novaDoacao.data}
                      onChange={(e) => setNovaDoacao(prev => ({ ...prev, data: e.target.value }))}
                    />
                  </div>
                  
                  <Button onClick={handleNovaDoacao} className="w-full">
                    Registrar Doação
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Lista de Doações</span>
                <div className="flex items-center gap-2">
                  <Input 
                    placeholder="Buscar doador..." 
                    className="w-64"
                  />
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {doacoes.map((doacao) => (
                  <div key={doacao.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{doacao.doador}</p>
                        <p className="text-sm text-gray-600">{doacao.tipo} - {doacao.data}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-semibold text-green-600">R$ {doacao.valor.toLocaleString()}</p>
                      </div>
                      <Badge className={getStatusColor(doacao.status)}>
                        {doacao.status}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {doacao.comprovante ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <Button variant="outline" size="sm">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orçamento de Campanhas */}
        <TabsContent value="orcamento" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Orçamento de Campanha</h3>
              <p className="text-sm text-gray-600">Planejamento e controle financeiro detalhado</p>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Categoria
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Categoria de Orçamento</DialogTitle>
                  <DialogDescription>
                    Crie uma nova categoria para organizar os gastos
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 pt-4">
                  <div>
                    <Label>Nome da Categoria</Label>
                    <Input 
                      value={novoOrcamento.categoria}
                      onChange={(e) => setNovoOrcamento(prev => ({ ...prev, categoria: e.target.value }))}
                      placeholder="Ex: Material de Divulgação"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Valor Planejado (R$)</Label>
                      <Input 
                        type="number"
                        value={novoOrcamento.valor_planejado}
                        onChange={(e) => setNovoOrcamento(prev => ({ ...prev, valor_planejado: e.target.value }))}
                        placeholder="0,00"
                      />
                    </div>
                    
                    <div>
                      <Label>Período</Label>
                      <Select value={novoOrcamento.periodo} onValueChange={(value) => setNovoOrcamento(prev => ({ ...prev, periodo: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mai/2024">Mai/2024</SelectItem>
                          <SelectItem value="Jun/2024">Jun/2024</SelectItem>
                          <SelectItem value="Jul/2024">Jul/2024</SelectItem>
                          <SelectItem value="Ago/2024">Ago/2024</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button onClick={handleNovoOrcamento} className="w-full">
                    Adicionar Categoria
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">R$ 58.000</p>
                  <p className="text-sm text-gray-600">Orçamento Total</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">R$ 45.200</p>
                  <p className="text-sm text-gray-600">Executado</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">R$ 12.800</p>
                  <p className="text-sm text-gray-600">Disponível</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">77.9%</p>
                  <p className="text-sm text-gray-600">Execução</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Controle por Categoria</CardTitle>
              <CardDescription>
                Acompanhe o desempenho de cada categoria de gasto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orcamento.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{item.categoria}</h4>
                      <Badge variant="outline">{item.periodo}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Planejado</p>
                        <p className="font-semibold">R$ {item.planejado.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Executado</p>
                        <p className="font-semibold text-blue-600">R$ {item.executado.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Disponível</p>
                        <p className="font-semibold text-green-600">R$ {item.disponivel.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(item.executado / item.planejado) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {((item.executado / item.planejado) * 100).toFixed(1)}% executado
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integração Bancária */}
        <TabsContent value="bancario" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Integração Bancária</h3>
              <p className="text-sm text-gray-600">Conciliação automática de transações</p>
            </div>
            
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Importar Extrato
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">24</p>
                  <p className="text-sm text-gray-600">Transações Total</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">22</p>
                  <p className="text-sm text-gray-600">Conciliadas</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">2</p>
                  <p className="text-sm text-gray-600">Pendentes</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">91.7%</p>
                  <p className="text-sm text-gray-600">Taxa Conciliação</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Transações Bancárias</CardTitle>
              <CardDescription>
                Movimentações financeiras da conta da campanha
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transacoesBancarias.map((transacao) => (
                  <div key={transacao.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transacao.tipo === 'Entrada' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <Building2 className={`w-5 h-5 ${
                          transacao.tipo === 'Entrada' ? 'text-green-600' : 'text-red-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">{transacao.descricao}</p>
                        <p className="text-sm text-gray-600">{transacao.data} - {transacao.categoria}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className={`font-semibold ${getTipoColor(transacao.tipo)}`}>
                          {transacao.tipo === 'Entrada' ? '+' : ''}R$ {Math.abs(transacao.valor).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {transacao.conciliado ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-yellow-600" />
                        )}
                        <Button variant="outline" size="sm">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Auditoria Automática */}
        <TabsContent value="auditoria" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Auditoria Automática</h3>
              <p className="text-sm text-gray-600">Verificação de conformidade legal e alertas</p>
            </div>
            
            <Button>
              <FileText className="w-4 h-4 mr-2" />
              Gerar Relatório de Auditoria
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">4</p>
                  <p className="text-sm text-gray-600">Verificações OK</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">2</p>
                  <p className="text-sm text-gray-600">Alertas</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">1</p>
                  <p className="text-sm text-gray-600">Pendências</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">85.7%</p>
                  <p className="text-sm text-gray-600">Conformidade</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Alertas de Auditoria</CardTitle>
              <CardDescription>
                Verificações automáticas de conformidade e pendências
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alertasAuditoria.map((alerta, index) => (
                  <div key={index} className={`p-4 border rounded-lg ${getAlertColor(alerta.tipo)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                          {alerta.tipo === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
                          {alerta.tipo === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-600" />}
                          {alerta.tipo === 'error' && <XCircle className="w-5 h-5 text-red-600" />}
                          {alerta.tipo === 'info' && <Eye className="w-5 h-5 text-blue-600" />}
                        </div>
                        <div>
                          <p className="font-semibold">{alerta.titulo}</p>
                          <p className="text-sm text-gray-600">{alerta.descricao}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{alerta.prioridade}</Badge>
                        <Button variant="outline" size="sm">
                          Resolver
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Relatórios de Conformidade</CardTitle>
              <CardDescription>
                Documentos automáticos para prestação de contas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto p-4 justify-start">
                  <div className="text-left">
                    <p className="font-semibold">Relatório de Doações</p>
                    <p className="text-sm text-gray-600">Todas as doações recebidas no período</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 justify-start">
                  <div className="text-left">
                    <p className="font-semibold">Demonstrativo de Gastos</p>
                    <p className="text-sm text-gray-600">Categorização detalhada dos gastos</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 justify-start">
                  <div className="text-left">
                    <p className="font-semibold">Balancete Patrimonial</p>
                    <p className="text-sm text-gray-600">Situação financeira atual da campanha</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 justify-start">
                  <div className="text-left">
                    <p className="font-semibold">Auditoria Completa</p>
                    <p className="text-sm text-gray-600">Relatório consolidado para prestação de contas</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
