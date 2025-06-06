
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNativeFeatures } from '@/hooks/useNativeFeatures';
import { 
  Smartphone, 
  Share, 
  Vibrate, 
  Wifi, 
  WifiOff,
  Download,
  Bell
} from "lucide-react";

export const PWAFeatures = () => {
  const { isNative, networkStatus, shareContent, hapticFeedback } = useNativeFeatures();

  const handleShare = async () => {
    await shareContent(
      "Gabinete Digital",
      "Sistema completo para gestão de gabinetes políticos",
      window.location.origin
    );
  };

  const handleHaptic = async () => {
    await hapticFeedback();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Status do App Mobile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Modo Nativo:</span>
            <Badge variant={isNative ? "default" : "secondary"}>
              {isNative ? "Ativo" : "Web"}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {networkStatus.connected ? (
                <Wifi className="w-4 h-4 text-green-600" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-600" />
              )}
              Conexão:
            </span>
            <Badge variant={networkStatus.connected ? "default" : "destructive"}>
              {networkStatus.connected ? "Online" : "Offline"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Funcionalidades Nativas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={handleShare} variant="outline" className="flex items-center gap-2">
              <Share className="w-4 h-4" />
              Compartilhar App
            </Button>
            
            <Button onClick={handleHaptic} variant="outline" className="flex items-center gap-2">
              <Vibrate className="w-4 h-4" />
              Feedback Tátil
            </Button>
          </div>
          
          <div className="text-sm text-gray-600">
            <p className="mb-2 font-medium">Para ativar as funcionalidades completas:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Exporte o projeto para GitHub</li>
              <li>Execute: npm install</li>
              <li>Adicione plataforma: npx cap add ios/android</li>
              <li>Execute: npx cap run ios/android</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            PWA - Progressive Web App
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Este app pode ser instalado como PWA diretamente do navegador.
          </p>
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <span className="text-sm">Notificações push habilitadas</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
