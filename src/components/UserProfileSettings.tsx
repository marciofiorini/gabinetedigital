
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Camera, User, Save, Lock, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export const UserProfileSettings = () => {
  const { user, profile, updateProfile, updatePassword, checkUsernameAvailability, uploadAvatar, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    bio: '',
    phone: '',
    location: ''
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const [usernameStatus, setUsernameStatus] = useState<'available' | 'taken' | 'checking' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [usernameCheckTimeout, setUsernameCheckTimeout] = useState<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log('Profile data changed:', profile);
    console.log('User data:', user);
    
    if (profile && user) {
      const data = {
        name: profile.name || '',
        username: profile.username || '',
        email: user.email || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
        location: profile.location || ''
      };
      console.log('Setting form data:', data);
      setFormData(data);
    }
  }, [profile, user]);

  const checkUsername = async (username: string) => {
    if (!username || username === profile?.username) {
      setUsernameStatus(null);
      return;
    }

    setUsernameStatus('checking');
    try {
      const isAvailable = await checkUsernameAvailability(username);
      setUsernameStatus(isAvailable ? 'available' : 'taken');
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameStatus(null);
    }
  };

  const handleUsernameChange = (value: string) => {
    setFormData({ ...formData, username: value });
    
    if (usernameCheckTimeout) {
      clearTimeout(usernameCheckTimeout);
    }
    
    setUsernameStatus(null);
    
    const timeoutId = setTimeout(() => {
      checkUsername(value);
    }, 500);
    
    setUsernameCheckTimeout(timeoutId);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    if (usernameStatus === 'taken') {
      toast.error('Nome de usuário não está disponível');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Submitting profile update:', formData);
      
      const updateData = {
        name: formData.name.trim(),
        username: formData.username.trim(),
        phone: formData.phone.trim(),
        location: formData.location.trim(),
        bio: formData.bio.trim()
      };

      console.log('Update data prepared:', updateData);

      const success = await updateProfile(updateData);

      if (success) {
        setUsernameStatus(null);
        console.log('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      await updatePassword(passwordData.newPassword);
      setPasswordData({
        newPassword: '',
        confirmPassword: ''
      });
      toast.success('Senha alterada com sucesso!');
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      await uploadAvatar(file);
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getAvatarUrl = () => {
    if (profile?.avatar_url && user) {
      const avatars = JSON.parse(localStorage.getItem('user_avatars') || '{}');
      return avatars[user.id] || null;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Informações do Perfil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Informações do Perfil
          </CardTitle>
          <CardDescription>
            Gerencie suas informações pessoais e dados do perfil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={getAvatarUrl()} />
                <AvatarFallback className="text-lg">
                  {formData.name.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={handleAvatarClick}
                  disabled={isUploadingAvatar}
                >
                  <Camera className="w-4 h-4" />
                  {isUploadingAvatar ? 'Enviando...' : 'Alterar Foto'}
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  JPG, PNG ou GIF. Máximo 5MB.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Seu nome completo"
                  required
                />
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Nome de Usuário</Label>
                <div className="relative">
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    placeholder="seu_usuario"
                    className="pr-10"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {usernameStatus === 'checking' && (
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    )}
                    {usernameStatus === 'available' && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    {usernameStatus === 'taken' && (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
                {usernameStatus === 'available' && (
                  <p className="text-xs text-green-600">Nome de usuário disponível</p>
                )}
                {usernameStatus === 'taken' && (
                  <p className="text-xs text-red-600">Nome de usuário já está em uso</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Use apenas letras, números e sublinhados. Deixe em branco se não quiser um nome de usuário.
                </p>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  O email não pode ser alterado. Entre em contato com o suporte se necessário.
                </p>
              </div>

              {/* Telefone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>

              {/* Localização */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Cidade, Estado"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Biografia</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Conte um pouco sobre você..."
                rows={4}
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading || usernameStatus === 'taken' || isSubmitting} 
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Alterar Senha */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Alterar Senha
          </CardTitle>
          <CardDescription>
            Mantenha sua conta segura com uma senha forte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Digite a nova senha (mínimo 6 caracteres)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Confirme a nova senha"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading || !passwordData.newPassword || !passwordData.confirmPassword}
              className="flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              {loading ? 'Alterando...' : 'Alterar Senha'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Informações da Conta */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da Conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">ID do Usuário</Label>
              <p className="text-sm text-muted-foreground font-mono">{user?.id}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Conta criada em</Label>
              <p className="text-sm text-muted-foreground">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : 'N/A'}
              </p>
            </div>
            {profile?.username && (
              <div>
                <Label className="text-sm font-medium">Nome de usuário</Label>
                <p className="text-sm text-muted-foreground">@{profile.username}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
