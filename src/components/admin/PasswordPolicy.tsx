
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToastEnhanced } from '@/hooks/useToastEnhanced';
import { Shield, Key, Clock, AlertTriangle } from 'lucide-react';

interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSymbols: boolean;
  preventReuse: boolean;
  reuseLimit: number;
  expirationDays: number;
  warningDays: number;
}

export const PasswordPolicy = () => {
  const { showSuccess, showError } = useToastEnhanced();
  const [policy, setPolicy] = useState<PasswordPolicy>({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: false,
    preventReuse: true,
    reuseLimit: 5,
    expirationDays: 90,
    warningDays: 7
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulação de salvamento - aqui seria uma chamada real para o backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess('Política de senhas atualizada com sucesso!');
    } catch (error) {
      showError('Erro ao salvar política de senhas');
    } finally {
      setLoading(false);
    }
  };

  const testPassword = (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < policy.minLength) {
      errors.push(`Mínimo de ${policy.minLength} caracteres`);
    }
    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Pelo menos uma letra maiúscula');
    }
    if (policy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Pelo menos uma letra minúscula');
    }
    if (policy.requireNumbers && !/\d/.test(password)) {
      errors.push('Pelo menos um número');
    }
    if (policy.requireSymbols && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Pelo menos um símbolo especial');
    }

    return { valid: errors.length === 0, errors };
  };

  const [testPasswordValue, setTestPasswordValue] = useState('');
  const testResult = testPassword(testPasswordValue);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Política de Senhas
          </CardTitle>
          <CardDescription>
            Configure as regras de complexidade e segurança para senhas dos usuários
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Requisitos de Complexidade */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Requisitos de Complexidade</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minLength">Comprimento mínimo</Label>
                <Input
                  id="minLength"
                  type="number"
                  min="4"
                  max="50"
                  value={policy.minLength}
                  onChange={(e) => setPolicy(prev => ({ ...prev, minLength: parseInt(e.target.value) }))}
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="uppercase">Letras maiúsculas obrigatórias</Label>
                  <Switch
                    id="uppercase"
                    checked={policy.requireUppercase}
                    onCheckedChange={(checked) => setPolicy(prev => ({ ...prev, requireUppercase: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="lowercase">Letras minúsculas obrigatórias</Label>
                  <Switch
                    id="lowercase"
                    checked={policy.requireLowercase}
                    onCheckedChange={(checked) => setPolicy(prev => ({ ...prev, requireLowercase: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="numbers">Números obrigatórios</Label>
                  <Switch
                    id="numbers"
                    checked={policy.requireNumbers}
                    onCheckedChange={(checked) => setPolicy(prev => ({ ...prev, requireNumbers: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="symbols">Símbolos especiais obrigatórios</Label>
                  <Switch
                    id="symbols"
                    checked={policy.requireSymbols}
                    onCheckedChange={(checked) => setPolicy(prev => ({ ...prev, requireSymbols: checked }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Política de Reutilização */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Reutilização de Senhas</h3>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="preventReuse">Prevenir reutilização de senhas</Label>
              <Switch
                id="preventReuse"
                checked={policy.preventReuse}
                onCheckedChange={(checked) => setPolicy(prev => ({ ...prev, preventReuse: checked }))}
              />
            </div>
            
            {policy.preventReuse && (
              <div className="space-y-2">
                <Label htmlFor="reuseLimit">Número de senhas anteriores bloqueadas</Label>
                <Input
                  id="reuseLimit"
                  type="number"
                  min="1"
                  max="20"
                  value={policy.reuseLimit}
                  onChange={(e) => setPolicy(prev => ({ ...prev, reuseLimit: parseInt(e.target.value) }))}
                />
              </div>
            )}
          </div>

          {/* Expiração */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Expiração de Senhas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiration">Dias para expiração</Label>
                <Input
                  id="expiration"
                  type="number"
                  min="1"
                  max="365"
                  value={policy.expirationDays}
                  onChange={(e) => setPolicy(prev => ({ ...prev, expirationDays: parseInt(e.target.value) }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="warning">Dias de aviso antes da expiração</Label>
                <Input
                  id="warning"
                  type="number"
                  min="1"
                  max="30"
                  value={policy.warningDays}
                  onChange={(e) => setPolicy(prev => ({ ...prev, warningDays: parseInt(e.target.value) }))}
                />
              </div>
            </div>
          </div>

          <Button onClick={handleSave} disabled={loading} className="w-full">
            {loading ? 'Salvando...' : 'Salvar Política de Senhas'}
          </Button>
        </CardContent>
      </Card>

      {/* Testador de Senha */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Testador de Senha
          </CardTitle>
          <CardDescription>
            Teste se uma senha atende aos critérios definidos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="testPassword">Digite uma senha para testar</Label>
            <Input
              id="testPassword"
              type="password"
              placeholder="Digite uma senha..."
              value={testPasswordValue}
              onChange={(e) => setTestPasswordValue(e.target.value)}
            />
          </div>
          
          {testPasswordValue && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {testResult.valid ? (
                  <Badge className="bg-green-100 text-green-800">
                    ✓ Senha válida
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800">
                    ✗ Senha inválida
                  </Badge>
                )}
              </div>
              
              {testResult.errors.length > 0 && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-red-600">Problemas encontrados:</p>
                  <ul className="text-sm text-red-600 space-y-1">
                    {testResult.errors.map((error, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3" />
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
