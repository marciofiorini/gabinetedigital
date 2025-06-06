
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Wifi, WifiOff, Share2, Smartphone } from 'lucide-react';
import { useNativeFeatures } from '@/hooks/useNativeFeatures';
import { useToast } from '@/hooks/use-toast';

export const PWAFeatures = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const { isNative, networkStatus, shareContent, hapticFeedback } = useNativeFeatures();
  const { toast } = useToast();

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsInstallable(false);
      toast({
        title: "App Instalado!",
        description: "O Gabinete Digital foi instalado com sucesso!"
      });
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [toast]);

  const installPWA = async () => {
    if (!deferredPrompt) return;

    await hapticFeedback();
    
    const result = await deferredPrompt.prompt();
    
    if (result.outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  const handleShare = async () => {
    await hapticFeedback();
    await shareContent(
      'Gabinete Digital',
      'Sistema completo para gestão de gabinetes políticos',
      window.location.origin
    );
  };

  if (isInstalled && isNative) {
    return null; // Don't show PWA features if already installed as native app
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Status do App
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Conexão de Rede</span>
            <Badge variant={networkStatus.connected ? "default" : "destructive"}>
              {networkStatus.connected ? (
                <><Wifi className="w-3 h-3 mr-1" /> Online</>
              ) : (
                <><WifiOff className="w-3 h-3 mr-1" /> Offline</>
              )}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span>Tipo de Conexão</span>
            <Badge variant="outline">
              {networkStatus.connectionType.toUpperCase()}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span>Plataforma</span>
            <Badge variant="outline">
              {isNative ? 'App Nativo' : 'Web App'}
            </Badge>
          </div>

          {isInstallable && !isInstalled && (
            <div className="pt-4 border-t">
              <Button onClick={installPWA} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Instalar App
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Instale para acesso offline e melhor experiência
              </p>
            </div>
          )}

          <Button variant="outline" onClick={handleShare} className="w-full">
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar App
          </Button>
        </CardContent>
      </Card>

      {!networkStatus.connected && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-orange-800">
              <WifiOff className="w-4 h-4" />
              <span className="font-medium">Modo Offline</span>
            </div>
            <p className="text-sm text-orange-700 mt-1">
              Algumas funcionalidades podem estar limitadas sem conexão à internet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
