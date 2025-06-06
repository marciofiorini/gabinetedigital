
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { ResetPasswordModal } from '@/components/ResetPasswordModal';
import { Mail, Lock, Chrome, User, Eye, EyeOff } from 'lucide-react';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signInWithEmail(email, password);
    } catch (error) {
      // Error handling is done in the context
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signUpWithEmail(email, password, name);
    } catch (error) {
      // Error handling is done in the context
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Gabinete Digital
            </CardTitle>
            <CardDescription>
              Acesse sua plataforma política
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 text-white"
            >
              <Chrome className="w-4 h-4 mr-2" />
              Continuar com Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  Ou continue com email
                </span>
              </div>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Cadastrar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowResetModal(true)}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Esqueci minha senha
                    </button>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleEmailSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nome</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Seu nome completo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {loading ? 'Criando conta...' : 'Criar conta'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <ResetPasswordModal 
        open={showResetModal} 
        onOpenChange={setShowResetModal} 
      />
    </>
  );
};
