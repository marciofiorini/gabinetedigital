
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, AlertTriangle, Clock, Users, Activity, Eye, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const EnhancedSecurityDashboard = () => {
  const { user } = useAuth();
  const { 
    securityEvents, 
    loading, 
    fetchSecurityEvents, 
    checkSessionValidity,
    getFailedLoginAttempts,
    getRecentLogins,
    logSecurityAction
  } = useSecurityMonitoring();
  
  const [sessionValid, setSessionValid] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      const isValid = await checkSessionValidity();
      setSessionValid(isValid);
    };
    
    if (user) {
      validateSession();
      // Check session validity every 5 minutes
      const interval = setInterval(validateSession, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const failedAttempts = getFailedLoginAttempts();
  const recentLogins = getRecentLogins();
  const recentFailedAttempts = failedAttempts.filter(event => 
    new Date(event.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  );

  const getSeverityColor = (action: string) => {
    switch (action) {
      case 'failed_login_attempt': return 'bg-red-100 text-red-800';
      case 'role_changed': return 'bg-yellow-100 text-yellow-800';
      case 'password_updated': return 'bg-green-100 text-green-800';
      case 'login': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'failed_login_attempt': return <AlertTriangle className="w-4 h-4" />;
      case 'login': return <Shield className="w-4 h-4" />;
      case 'logout': return <Shield className="w-4 h-4" />;
      case 'password_updated': return <Activity className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      'failed_login_attempt': 'Tentativa de login falhada',
      'login': 'Login realizado',
      'logout': 'Logout realizado',
      'password_updated': 'Senha atualizada',
      'role_changed': 'Papel alterado',
      'session_restored': 'Sessão restaurada'
    };
    return labels[action] || action;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard de Segurança</h2>
          <p className="text-gray-600">Monitoramento de atividades e eventos de segurança</p>
        </div>
        <Button onClick={fetchSecurityEvents} disabled={loading} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Session Status Alert */}
      {!sessionValid && (
        <Alert className="border-orange-200 bg-orange-50">
          <Clock className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Aviso:</strong> Sua sessão pode estar próxima do tempo limite. 
            Salve seu trabalho e faça login novamente se necessário.
          </AlertDescription>
        </Alert>
      )}

      {/* Security Alerts */}
      {recentFailedAttempts.length > 3 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Atenção:</strong> {recentFailedAttempts.length} tentativas de login falharam nas últimas 24 horas.
          </AlertDescription>
        </Alert>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Eventos</p>
                <p className="text-2xl font-bold">{securityEvents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tentativas Falhadas (24h)</p>
                <p className="text-2xl font-bold text-red-600">{recentFailedAttempts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Logins Recentes</p>
                <p className="text-2xl font-bold">{recentLogins.slice(0, 10).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Status da Sessão</p>
                <p className={`text-2xl font-bold ${sessionValid ? 'text-green-600' : 'text-orange-600'}`}>
                  {sessionValid ? 'Válida' : 'Atenção'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Eventos de Segurança Recentes
          </CardTitle>
          <CardDescription>
            Histórico de atividades relacionadas à segurança
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loading ? (
              <p className="text-center py-4">Carregando eventos...</p>
            ) : securityEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhum evento registrado</p>
            ) : (
              securityEvents.slice(0, 20).map((event) => (
                <div
                  key={event.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-gray-600 mt-1">
                      {getActionIcon(event.action)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{getActionLabel(event.action)}</h4>
                        <Badge className={getSeverityColor(event.action)}>
                          {event.module || 'SISTEMA'}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        {event.old_value && (
                          <div>Detalhes: {event.old_value}</div>
                        )}
                        {event.ip_address && (
                          <div>IP: {event.ip_address}</div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(event.created_at), { 
                            addSuffix: true, 
                            locale: ptBR 
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recomendações de Segurança</CardTitle>
          <CardDescription>
            Ações para melhorar a segurança da sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Monitoramento ativo</p>
                <p className="text-sm text-blue-700">
                  Sistema de segurança monitorando atividades em tempo real
                </p>
              </div>
            </div>
            
            {recentFailedAttempts.length > 0 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-900">Revisar tentativas de acesso</p>
                  <p className="text-sm text-yellow-700">
                    Foram detectadas tentativas de login falhadas. Verifique se foram suas.
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <Activity className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Sessão segura</p>
                <p className="text-sm text-green-700">
                  Sua sessão está protegida com timeout automático
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
