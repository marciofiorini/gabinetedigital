
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuditLogsEnhanced } from '@/hooks/useAuditLogsEnhanced';
import { Search, Filter, Download, Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react";

export const AuditoriaAvancada = () => {
  const { logs, loading, filtros, setFiltros, getModulosDisponiveis, getEstatisticas } = useAuditLogsEnhanced();
  const [buscaTexto, setBuscaTexto] = useState('');

  const estatisticas = getEstatisticas();
  const modulosDisponiveis = getModulosDisponiveis();

  const getActionIcon = (action: string) => {
    if (action.includes('create') || action.includes('insert')) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (action.includes('update') || action.includes('edit')) return <Clock className="w-4 h-4 text-blue-600" />;
    if (action.includes('delete') || action.includes('remove')) return <AlertTriangle className="w-4 h-4 text-red-600" />;
    return <Shield className="w-4 h-4 text-gray-600" />;
  };

  const getRiskLevel = (action: string) => {
    if (action.includes('delete') || action.includes('role')) return 'alto';
    if (action.includes('update') || action.includes('edit')) return 'medio';
    return 'baixo';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'alto': return 'bg-red-100 text-red-800 border-red-200';
      case 'medio': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baixo': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const exportarLogs = () => {
    const csvContent = [
      'Data,Usuário,Ação,Módulo,Detalhes,Risco',
      ...logs.map(log => [
        new Date(log.created_at).toLocaleString('pt-BR'),
        log.changed_by || 'Sistema',
        log.action,
        log.module || 'N/A',
        log.new_value || log.old_value || 'N/A',
        getRiskLevel(log.action)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditoria_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const logsFiltrados = logs.filter(log => {
    if (buscaTexto && !log.action.toLowerCase().includes(buscaTexto.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <Card className="border-2 border-orange-200 bg-orange-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-900">
            <Shield className="w-6 h-6" />
            Auditoria e Segurança Avançada
          </CardTitle>
          <p className="text-orange-700">
            Monitoramento completo de ações do sistema e análise de segurança
          </p>
        </CardHeader>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center mr-4">
                <Shield className="text-white w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de Logs</p>
                <p className="text-2xl font-bold text-gray-900">{estatisticas.totalLogs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center mr-4">
                <CheckCircle className="text-white w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Logs Hoje</p>
                <p className="text-2xl font-bold text-gray-900">{estatisticas.logsHoje}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center mr-4">
                <AlertTriangle className="text-white w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Módulo Mais Ativo</p>
                <p className="text-lg font-bold text-gray-900">{estatisticas.moduloMaisAtivo}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center mr-4">
                <Clock className="text-white w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ações de Risco</p>
                <p className="text-2xl font-bold text-gray-900">
                  {logs.filter(log => getRiskLevel(log.action) === 'alto').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por ação..."
                value={buscaTexto}
                onChange={(e) => setBuscaTexto(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filtros.modulo} onValueChange={(value) => setFiltros({...filtros, modulo: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Módulo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os módulos</SelectItem>
                {modulosDisponiveis.map(modulo => (
                  <SelectItem key={modulo} value={modulo}>{modulo}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="date"
              placeholder="Data início"
              value={filtros.dataInicio}
              onChange={(e) => setFiltros({...filtros, dataInicio: e.target.value})}
            />

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
              <Button onClick={exportarLogs} className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Log de Atividades</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Módulo</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Risco</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logsFiltrados.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">
                      {new Date(log.created_at).toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.action)}
                        <span className="font-medium">{log.action}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.module || 'Sistema'}</Badge>
                    </TableCell>
                    <TableCell>{log.changed_by || 'Sistema'}</TableCell>
                    <TableCell>
                      <Badge className={getRiskColor(getRiskLevel(log.action))}>
                        {getRiskLevel(log.action)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {log.changes ? JSON.stringify(log.changes) : 
                       log.new_value || log.old_value || 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
