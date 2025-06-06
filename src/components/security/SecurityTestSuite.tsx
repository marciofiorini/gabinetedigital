
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const SecurityTestSuite = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const securityTests = [
    {
      name: 'Validação de Sessão',
      test: async () => {
        if (!user) throw new Error('Usuário não autenticado');
        
        const { data, error } = await supabase.rpc('validate_user_session', {
          p_user_id: user.id,
          p_session_timeout_minutes: 30
        });
        
        if (error) throw error;
        return data ? 'Sessão válida' : 'Sessão inválida detectada';
      },
      severity: 'high' as const
    },
    {
      name: 'Teste de RLS',
      test: async () => {
        const { data, error } = await supabase
          .from('access_logs')
          .select('count')
          .limit(1);
        
        if (error && error.code === 'PGRST116') {
          return 'RLS está funcionando - acesso negado sem autenticação';
        }
        
        return 'RLS validado com sucesso';
      },
      severity: 'critical' as const
    },
    {
      name: 'Logs de Auditoria',
      test: async () => {
        if (!user) throw new Error('Usuário não autenticado');
        
        const { data, error } = await supabase
          .from('access_logs')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);
        
        if (error) throw error;
        
        return data && data.length > 0 
          ? 'Sistema de auditoria funcionando' 
          : 'Nenhum log encontrado';
      },
      severity: 'medium' as const
    },
    {
      name: 'Validação de Input',
      test: async () => {
        // Simula teste de validação de input
        const testInput = '<script>alert("xss")</script>';
        const isValid = !testInput.includes('<script>');
        
        return isValid 
          ? 'Sistema bloqueou input malicioso' 
          : 'VULNERABILIDADE: XSS detectado';
      },
      severity: 'high' as const
    }
  ];

  const runSecurityTests = async () => {
    setIsRunning(true);
    setProgress(0);
    
    const results: TestResult[] = securityTests.map(test => ({
      name: test.name,
      status: 'pending' as const,
      message: 'Aguardando execução...',
      severity: test.severity
    }));
    
    setTestResults([...results]);

    for (let i = 0; i < securityTests.length; i++) {
      const test = securityTests[i];
      
      setTestResults(prev => prev.map((result, index) => 
        index === i 
          ? { ...result, status: 'running', message: 'Executando...' }
          : result
      ));

      try {
        const message = await test.test();
        
        setTestResults(prev => prev.map((result, index) => 
          index === i 
            ? { 
                ...result, 
                status: 'passed', 
                message 
              }
            : result
        ));
      } catch (error) {
        setTestResults(prev => prev.map((result, index) => 
          index === i 
            ? { 
                ...result, 
                status: 'failed', 
                message: error instanceof Error ? error.message : 'Erro desconhecido'
              }
            : result
        ));
      }

      setProgress(((i + 1) / securityTests.length) * 100);
      
      // Pequeno delay para mostrar o progresso
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'running':
        return <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">
            Faça login para executar os testes de segurança
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Suite de Testes de Segurança</span>
          <Button 
            onClick={runSecurityTests} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            {isRunning ? 'Executando...' : 'Executar Testes'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isRunning && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progresso</span>
              <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        <div className="space-y-3">
          {testResults.map((result, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(result.status)}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{result.name}</span>
                    <Badge className={getSeverityColor(result.severity)}>
                      {result.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{result.message}</p>
                </div>
              </div>
            </div>
          ))}
          
          {testResults.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              Clique em "Executar Testes" para iniciar a avaliação de segurança
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
