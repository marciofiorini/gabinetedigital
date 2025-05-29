
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFollowUpNotifications } from "@/hooks/useFollowUpNotifications";
import { Bell, Clock, AlertTriangle, Calendar, Settings, ChevronRight } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const FollowUpNotifications = () => {
  const { 
    vencidos, 
    hoje, 
    proximosVencimentos, 
    settings, 
    updateSettings 
  } = useFollowUpNotifications();
  const [showSettings, setShowSettings] = useState(false);

  const totalAlertas = vencidos.length + proximosVencimentos.length;

  return (
    <div className="space-y-6">
      {/* Resumo dos Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-red-600 font-medium">Vencidos</p>
                <p className="text-2xl font-bold text-red-700">{vencidos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-orange-600 font-medium">Próximos</p>
                <p className="text-2xl font-bold text-orange-700">{proximosVencimentos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Hoje</p>
                <p className="text-2xl font-bold text-blue-700">{hoje.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Configurações */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              <div>
                <CardTitle>Notificações de Follow Up</CardTitle>
                <CardDescription>
                  Monitore follow ups vencidos e próximos do vencimento
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showSettings && (
            <Card className="mb-6 border-dashed">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Configurações de Alerta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="alertas">Ativar alertas automáticos</Label>
                  <Switch
                    id="alertas"
                    checked={settings.alertas_follow_up}
                    onCheckedChange={(checked) => updateSettings({ alertas_follow_up: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Alertar com antecedência de</Label>
                  <Select
                    value={settings.horas_antecedencia.toString()}
                    onValueChange={(value) => updateSettings({ horas_antecedencia: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hora</SelectItem>
                      <SelectItem value="2">2 horas</SelectItem>
                      <SelectItem value="6">6 horas</SelectItem>
                      <SelectItem value="12">12 horas</SelectItem>
                      <SelectItem value="24">24 horas</SelectItem>
                      <SelectItem value="48">48 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="push">Notificações push</Label>
                  <Switch
                    id="push"
                    checked={settings.enviar_push}
                    onCheckedChange={(checked) => updateSettings({ enviar_push: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="email">Notificações por email</Label>
                  <Switch
                    id="email"
                    checked={settings.enviar_email}
                    onCheckedChange={(checked) => updateSettings({ enviar_email: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="vencidos" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="vencidos" className="text-red-600">
                Vencidos ({vencidos.length})
              </TabsTrigger>
              <TabsTrigger value="proximos" className="text-orange-600">
                Próximos ({proximosVencimentos.length})
              </TabsTrigger>
              <TabsTrigger value="hoje" className="text-blue-600">
                Hoje ({hoje.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vencidos">
              <ScrollArea className="h-96">
                {vencidos.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Nenhum follow up vencido</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {vencidos.map((followUp) => (
                      <Card key={followUp.id} className="border-red-200 bg-red-50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="destructive" className="text-xs">
                                  {followUp.tipo}
                                </Badge>
                                <Badge variant="outline" className="text-xs text-red-600">
                                  Vencido há {formatDistanceToNow(followUp.data_agendada, { locale: ptBR })}
                                </Badge>
                              </div>
                              <p className="font-medium text-gray-900">{followUp.descricao}</p>
                              <p className="text-sm text-gray-600">
                                Lead: {followUp.lead_nome || 'Não identificado'}
                              </p>
                              <p className="text-xs text-red-600 mt-1">
                                Era para: {format(followUp.data_agendada, "dd/MM/yyyy 'às' HH:mm")}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="proximos">
              <ScrollArea className="h-96">
                {proximosVencimentos.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Nenhum follow up próximo do vencimento</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {proximosVencimentos.map((followUp) => (
                      <Card key={followUp.id} className="border-orange-200 bg-orange-50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className="text-xs bg-orange-100 text-orange-800">
                                  {followUp.tipo}
                                </Badge>
                                <Badge variant="outline" className="text-xs text-orange-600">
                                  Em {formatDistanceToNow(followUp.data_agendada, { locale: ptBR })}
                                </Badge>
                              </div>
                              <p className="font-medium text-gray-900">{followUp.descricao}</p>
                              <p className="text-sm text-gray-600">
                                Lead: {followUp.lead_nome || 'Não identificado'}
                              </p>
                              <p className="text-xs text-orange-600 mt-1">
                                Agendado para: {format(followUp.data_agendada, "dd/MM/yyyy 'às' HH:mm")}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="hoje">
              <ScrollArea className="h-96">
                {hoje.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Nenhum follow up agendado para hoje</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {hoje.map((followUp) => (
                      <Card key={followUp.id} className="border-blue-200 bg-blue-50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className="text-xs bg-blue-100 text-blue-800">
                                  {followUp.tipo}
                                </Badge>
                                <Badge variant="outline" className="text-xs text-blue-600">
                                  Hoje às {format(followUp.data_agendada, "HH:mm")}
                                </Badge>
                              </div>
                              <p className="font-medium text-gray-900">{followUp.descricao}</p>
                              <p className="text-sm text-gray-600">
                                Lead: {followUp.lead_nome || 'Não identificado'}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
