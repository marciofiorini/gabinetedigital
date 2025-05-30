
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { Search, Download, Filter, FileText, Shield, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const EnhancedAccessLogs = () => {
  const { logs, loading } = useAuditLogs();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.new_value?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'granted': return <Shield className="w-4 h-4 text-green-600" />;
      case 'revoked': return <Shield className="w-4 h-4 text-red-600" />;
      case 'login': return <User className="w-4 h-4 text-blue-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'granted': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'revoked': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'login': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const exportLogs = () => {
    const csvContent = [
      ['Data', 'Ação', 'Usuário', 'Alterado Por', 'Detalhes'].join(','),
      ...filteredLogs.map(log => [
        new Date(log.created_at).toLocaleString('pt-BR'),
        log.action,
        log.user_id,
        log.changed_by,
        log.new_value || log.old_value || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Logs de Auditoria Avançados
        </CardTitle>
        <CardDescription>
          Monitoramento detalhado de todas as ações administrativas do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar em ações e detalhes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar ação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as ações</SelectItem>
                <SelectItem value="granted">Permissões concedidas</SelectItem>
                <SelectItem value="revoked">Permissões revogadas</SelectItem>
                <SelectItem value="login">Logins</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportLogs}>
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>

          {/* Lista de Logs */}
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Carregando logs...</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhum log encontrado com os filtros aplicados
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getActionIcon(log.action)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={getActionColor(log.action)}>
                              {log.action}
                            </Badge>
                            {log.role_changed && (
                              <Badge variant="outline">
                                {log.role_changed}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Usuário: <span className="font-mono">{log.user_id.slice(0, 8)}...</span>
                          </p>
                          {log.new_value && (
                            <p className="text-sm text-gray-800 dark:text-gray-200">
                              Detalhes: {log.new_value}
                            </p>
                          )}
                          {log.old_value && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Valor anterior: {log.old_value}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 ml-4 whitespace-nowrap">
                        {formatDistanceToNow(new Date(log.created_at), { 
                          addSuffix: true, 
                          locale: ptBR 
                        })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Estatísticas */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{logs.length}</p>
                <p className="text-sm text-gray-600">Total de logs</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {logs.filter(l => l.action === 'granted').length}
                </p>
                <p className="text-sm text-gray-600">Permissões concedidas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">
                  {logs.filter(l => l.action === 'revoked').length}
                </p>
                <p className="text-sm text-gray-600">Permissões revogadas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {new Set(logs.map(l => l.user_id)).size}
                </p>
                <p className="text-sm text-gray-600">Usuários únicos</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
