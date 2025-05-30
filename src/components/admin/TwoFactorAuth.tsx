
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToastEnhanced } from '@/hooks/useToastEnhanced';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Smartphone, Key, QrCode, CheckCircle } from 'lucide-react';

export const TwoFactorAuth = () => {
  const { showSuccess, showError } = useToastEnhanced();
  const { user } = useAuth();
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generateQRCode = async () => {
    setLoading(true);
    try {
      // Simulação - em produção seria uma chamada real para gerar QR code
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowQRCode(true);
      showSuccess('QR Code gerado com sucesso!');
    } catch (error) {
      showError('Erro ao gerar QR Code');
    } finally {
      setLoading(false);
    }
  };

  const verifyAndEnable2FA = async () => {
    if (verificationCode.length !== 6) {
      showError('Código deve ter 6 dígitos');
      return;
    }

    setLoading(true);
    try {
      // Simulação de verificação
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (verificationCode === '123456') { // Simulação
        setIs2FAEnabled(true);
        setBackupCodes([
          'ABCD-1234-EFGH-5678',
          'IJKL-9012-MNOP-3456',
          'QRST-7890-UVWX-1234',
          'YZAB-5678-CDEF-9012',
          'GHIJ-3456-KLMN-7890'
        ]);
        setShowQRCode(false);
        setVerificationCode('');
        showSuccess('2FA ativado com sucesso!');
      } else {
        showError('Código inválido. Tente novamente.');
      }
    } catch (error) {
      showError('Erro ao verificar código');
    } finally {
      setLoading(false);
    }
  };

  const disable2FA = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIs2FAEnabled(false);
      setBackupCodes([]);
      showSuccess('2FA desativado');
    } catch (error) {
      showError('Erro ao desativar 2FA');
    } finally {
      setLoading(false);
    }
  };

  const downloadBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '2fa-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Autenticação de Dois Fatores (2FA)
          </CardTitle>
          <CardDescription>
            Adicione uma camada extra de segurança à sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status do 2FA */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {is2FAEnabled ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <Shield className="w-6 h-6 text-gray-400" />
              )}
              <div>
                <p className="font-medium">
                  {is2FAEnabled ? '2FA Ativado' : '2FA Desativado'}
                </p>
                <p className="text-sm text-gray-600">
                  {is2FAEnabled 
                    ? 'Sua conta está protegida com autenticação de dois fatores'
                    : 'Ative o 2FA para maior segurança'
                  }
                </p>
              </div>
            </div>
            <Badge variant={is2FAEnabled ? 'default' : 'secondary'}>
              {is2FAEnabled ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>

          {!is2FAEnabled ? (
            <div className="space-y-4">
              {!showQRCode ? (
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto">
                    <Smartphone className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Configure seu aplicativo autenticador</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Use aplicativos como Google Authenticator, Authy ou Microsoft Authenticator
                    </p>
                  </div>
                  <Button onClick={generateQRCode} disabled={loading}>
                    <QrCode className="w-4 h-4 mr-2" />
                    {loading ? 'Gerando...' : 'Gerar QR Code'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center space-y-4">
                    {/* Simulação de QR Code */}
                    <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg mx-auto flex items-center justify-center">
                      <div className="text-center">
                        <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">QR Code do 2FA</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Escaneie este código com seu aplicativo autenticador
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Digite o código de 6 dígitos do seu aplicativo:</Label>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={verificationCode}
                        onChange={setVerificationCode}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={verifyAndEnable2FA} 
                      disabled={loading || verificationCode.length !== 6}
                      className="flex-1"
                    >
                      {loading ? 'Verificando...' : 'Ativar 2FA'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowQRCode(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Códigos de Backup */}
              {backupCodes.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      Códigos de Backup
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Guarde estes códigos em local seguro. Use-os se perder acesso ao seu dispositivo.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 gap-2 font-mono text-sm bg-gray-50 p-3 rounded">
                      {backupCodes.map((code, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span>{code}</span>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" onClick={downloadBackupCodes} className="w-full">
                      Baixar Códigos de Backup
                    </Button>
                  </CardContent>
                </Card>
              )}
              
              <Button variant="destructive" onClick={disable2FA} disabled={loading}>
                {loading ? 'Desativando...' : 'Desativar 2FA'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
