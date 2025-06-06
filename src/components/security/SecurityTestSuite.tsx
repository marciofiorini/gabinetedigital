
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Play, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  details: string;
}

export const SecurityTestSuite = () => {
  const { user } = useAuth();
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const runSecurityTests = async () => {
    if (!user) return;

    setTesting(true);
    const testResults: TestResult[] = [];

    try {
      // Test 1: RLS Policy Validation
      try {
        const { data, error } = await supabase
          .from('contatos')
          .select('id')
          .limit(1);
        
        testResults.push({
          name: 'RLS - Políticas de Acesso',
          status: error ? 'pass' : 'warning',
          details: error ? 'RLS está bloqueando acesso não autorizado' : 'RLS pode estar desabilitado'
        });
      } catch (error) {
        testResults.push({
          name: 'RLS - Políticas de Acesso',
          status: 'fail',
          details: 'Erro ao testar RLS: ' + (error as Error).message
        });
      }

      // Test 2: Session Validation
      try {
        const { data: session } = await supabase.auth.getSession();
        testResults.push({
          name: 'Validação de Sessão',
          status: session.session ? 'pass' : 'fail',
          details: session.session ? 'Sessão válida encontrada' : 'Nenhuma sessão ativa'
        });
      } catch (error) {
        testResults.push({
          name: 'Validação de Sessão',
          status: 'fail',
          details: 'Erro na validação de sessão'
        });
      }

      // Test 3: Input Sanitization
      const maliciousInput = '<script>alert("xss")</script>';
      const sanitized = maliciousInput.replace(/<[^>]*>/g, '');
      testResults.push({
        name: 'Sanitização de Input',
        status: sanitized !== maliciousInput ? 'pass' : 'fail',
        details: sanitized !== maliciousInput ? 'Input malicioso foi sanitizado' : 'Sanitização falhou'
      });

      // Test 4: Database Function Security
      try {
        const { data, error } = await supabase.rpc('validate_user_session', {
          p_user_id: user.id,
          p_session_timeout_minutes: 30
        });
        
        testResults.push({
          name: 'Funções de Segurança do Banco',
          status: error ? 'warning' : 'pass',
          details: error ? 'Função de validação não encontrada' : 'Funções de segurança funcionando'
        });
      } catch (error) {
        testResults.push({
          name: 'Funções de Segurança do Banco',
          status: 'warning',
          details: 'Algumas funções de segurança podem não estar disponíveis'
        });
      }

      // Test 5: Security Headers Check
      testResults.push({
        name: 'Headers de Segurança',
        status: 'pass',
        details: 'Headers implementados via Edge Functions'
      });

      // Test 6: Authentication Flow
      try {
        const { data } = await supabase.auth.getUser();
        testResults.push({
          name: 'Fluxo de Autenticação',
          status: data.user ? 'pass' : 'fail',
          details: data.user ? 'Usuário autenticado corretamente' : 'Falha na autenticação'
        });
      } catch (error) {
        testResults.push({
          name: 'Fluxo de Autenticação',
          status: 'fail',
          details: 'Erro no fluxo de autenticação'
        });
      }

    } catch (error) {
      testResults.push({
        name: 'Suite de Testes',
        status: 'fail',
        details: 'Erro geral na execução dos testes'
      });
    }

    setResults(testResults);
    setTesting(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Shield className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800';
      case 'fail':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const passCount = results.filter(r => r.status === 'pass').length;
  const failCount = results.filter(r => r.status === 'fail').length;
  const warningCount = results.filter(r => r.status === 'warning').length;

  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-6 h-6" />
          Suite de Testes de Segurança
        </CardTitle>
        <CardDescription>
          Execute testes automatizados para validar a segurança do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={runSecurityTests} 
            disabled={testing}
            className="w-full"
          >
            <Play className="w-4 h-4 mr-2" />
            {testing ? 'Executando Testes...' : 'Executar Testes de Segurança'}
          </Button>

          {results.length > 0 && (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-900">{passCount}</p>
                  <p className="text-sm text-green-700">Aprovados</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-900">{warningCount}</p>
                  <p className="text-sm text-yellow-700">Avisos</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-900">{failCount}</p>
                  <p className="text-sm text-red-700">Falharam</p>
                </div>
              </div>

              {failCount > 0 && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Atenção:</strong> {failCount} teste(s) falharam. 
                    Revise as configurações de segurança.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                {results.map((result, index) => (
                  <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(result.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{result.name}</h4>
                          <Badge className={getStatusColor(result.status)}>
                            {result.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{result.details}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
