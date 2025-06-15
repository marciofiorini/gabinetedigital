
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Loader2, Mail, Lock, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const LoginForm: React.FC = () => {
  console.log('LoginForm: Componente renderizado');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  const { signIn, signUp, resetPassword } = useAuth();

  const validateInputs = () => {
    const errors: string[] = [];
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.push('Email inválido');
    }
    
    if (!isResetPassword) {
      // Password validation for login/signup
      if (!password) {
        errors.push('Senha é obrigatória');
      } else if (isSignUp) {
        // Stronger validation for signup
        if (password.length < 8) {
          errors.push('Senha deve ter pelo menos 8 caracteres');
        }
        if (!/(?=.*[a-z])/.test(password)) {
          errors.push('Senha deve conter pelo menos uma letra minúscula');
        }
        if (!/(?=.*[A-Z])/.test(password)) {
          errors.push('Senha deve conter pelo menos uma letra maiúscula');
        }
        if (!/(?=.*\d)/.test(password)) {
          errors.push('Senha deve conter pelo menos um número');
        }
      }
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('LoginForm: Formulário submetido');
    
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    
    try {
      if (isResetPassword) {
        console.log('LoginForm: Solicitando reset de senha');
        const { error } = await resetPassword(email);
        if (!error) {
          setIsResetPassword(false);
          setEmail('');
        }
      } else if (isSignUp) {
        console.log('LoginForm: Tentando criar conta');
        const { error } = await signUp(email, password);
        if (!error) {
          setIsSignUp(false);
          setEmail('');
          setPassword('');
        }
      } else {
        console.log('LoginForm: Tentando fazer login');
        await signIn(email, password);
      }
    } catch (error) {
      console.error('LoginForm: Erro na autenticação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setValidationErrors([]);
    setIsSignUp(false);
    setIsResetPassword(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {isResetPassword ? 'Recuperar Senha' : isSignUp ? 'Criar Conta' : 'Entrar na plataforma'}
          </CardTitle>
          <CardDescription className="text-center">
            {isResetPassword 
              ? 'Digite seu email para receber instruções de recuperação'
              : isSignUp 
                ? 'Crie uma nova conta para acessar a plataforma'
                : 'Digite suas credenciais para acessar sua conta'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setValidationErrors([]);
                  }}
                  placeholder="seu@email.com"
                  className="pl-10"
                  required
                  autoComplete="email"
                />
              </div>
            </div>
            
            {!isResetPassword && (
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setValidationErrors([]);
                    }}
                    placeholder={isSignUp ? "Mínimo 8 caracteres" : "Sua senha"}
                    className="pl-10 pr-10"
                    required
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {isSignUp && (
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>A senha deve conter:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Pelo menos 8 caracteres</li>
                      <li>Uma letra maiúscula</li>
                      <li>Uma letra minúscula</li>
                      <li>Um número</li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isResetPassword ? 'Enviando...' : isSignUp ? 'Criando conta...' : 'Entrando...'}
                </>
              ) : (
                isResetPassword ? 'Enviar Email' : isSignUp ? 'Criar Conta' : 'Entrar'
              )}
            </Button>
          </form>

          <div className="space-y-2 text-center text-sm">
            {!isResetPassword && (
              <>
                <div>
                  {isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?'}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setValidationErrors([]);
                      setPassword('');
                    }}
                    className="ml-1 text-blue-600 hover:underline font-medium"
                  >
                    {isSignUp ? 'Fazer login' : 'Criar conta'}
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetPassword(true);
                      setValidationErrors([]);
                      setPassword('');
                    }}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Esqueceu sua senha?
                  </button>
                </div>
              </>
            )}
            
            {isResetPassword && (
              <button
                type="button"
                onClick={resetForm}
                className="text-blue-600 hover:underline font-medium"
              >
                Voltar ao login
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
