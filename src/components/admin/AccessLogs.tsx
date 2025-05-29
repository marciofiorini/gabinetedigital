
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, History, Filter, Download } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AccessLog {
  id: string;
  user_id: string;
  changed_by: string | null;
  action: string;
  role_changed: string | null;
  old_value: string | null;
  new_value: string | null;
  created_at: string;
  user_name?: string;
  changed_by_name?: string;
}

export const AccessLogs = () => {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const { toast } = useToast();

  const fetchLogs = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('access_logs')
        .select(`
          *,
          user:profiles!access_logs_user_id_fkey(name),
          changed_by_profile:profiles!access_logs_changed_by_fkey(name)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const logsWithNames = (data || []).map(log => ({
        ...log,
        user_name: log.user?.name,
        changed_by_name: log.changed_by_profile?.name
      }));

      setLogs(logsWithNames);
      setFilteredLogs(logsWithNames);
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os logs de acesso.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFilters(term, actionFilter);
  };

  const handleActionFilter = (action: string) => {
    setActionFilter(action);
    applyFilters(searchTerm, action);
  };

  const applyFilters = (search: string, action: string) => {
    let filtered = logs;

    if (search) {
      filtered = filtered.filter(log => 
        log.user_name?.toLowerCase().includes(search.toLowerCase()) ||
        log.changed_by_name?.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.role_changed?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (action !== 'all') {
      filtered = filtered.filter(log => log.action === action);
    }

    setFilteredLogs(filtered);
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'granted': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'revoked': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'created': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'updated': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'granted': return 'Papel Concedido';
      case 'revoked': return 'Papel Removido';
      case 'created': return 'Usuário Criado';
      case 'updated': return 'Usuário Atualizado';
      default: return action;
    }
  };

  const exportLogs = () => {
    const csvContent = [
      ['Data/Hora', 'Usuário', 'Ação', 'Papel', 'Alterado Por', 'Valor Anterior', 'Novo Valor'],
      ...filteredLogs.map(log => [
        new Date(log.created_at).toLocaleString('pt-BR'),
        log.user_name || 'N/A',
        getActionLabel(log.action),
        log.role_changed || 'N/A',
        log.changed_by_name || 'Sistema',
        log.old_value || 'N/A',
        log.new_value || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `logs-acesso-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Logs de Acesso
          </CardTitle>
          <CardDescription>
            Histórico de mudanças de papéis e permissões no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar logs..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={actionFilter} onValueChange={handleActionFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar por ação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as ações</SelectItem>
                <SelectItem value="granted">Papéis concedidos</SelectItem>
                <SelectItem value="revoked">Papéis removidos</SelectItem>
                <SelectItem value="created">Usuários criados</SelectItem>
                <SelectItem value="updated">Usuários atualizados</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportLogs} variant="outline" className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
            <Button onClick={fetchLogs} variant="outline" className="w-full sm:w-auto">
              Atualizar
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Carregando logs...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-8">
              <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Nenhum log encontrado</h3>
              <p className="text-gray-600">
                {searchTerm || actionFilter !== 'all' 
                  ? 'Tente ajustar os filtros de busca.'
                  : 'Ainda não há logs de acesso no sistema.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getActionColor(log.action)}>
                          {getActionLabel(log.action)}
                        </Badge>
                        {log.role_changed && (
                          <Badge variant="outline">
                            {log.role_changed === 'admin' ? 'Administrador' :
                             log.role_changed === 'moderator' ? 'Moderador' : 'Usuário'}
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1 text-sm">
                        <p>
                          <strong>Usuário:</strong> {log.user_name || 'N/A'}
                        </p>
                        {log.changed_by_name && (
                          <p>
                            <strong>Alterado por:</strong> {log.changed_by_name}
                          </p>
                        )}
                        {log.old_value && log.new_value && (
                          <p>
                            <strong>Mudança:</strong> {log.old_value} → {log.new_value}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      <p>{new Date(log.created_at).toLocaleDateString('pt-BR')}</p>
                      <p>{new Date(log.created_at).toLocaleTimeString('pt-BR')}</p>
                      <p className="mt-1">
                        {formatDistanceToNow(new Date(log.created_at), { 
                          addSuffix: true, 
                          locale: ptBR 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
