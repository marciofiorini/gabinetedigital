
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const MonitoramentoConfig = () => {
  const [configuracoes, setConfiguracoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    candidato_nome: '',
    tipo_monitoramento: '',
    frequencia_atualizacao: 'semanal',
    ativo: true
  });

  useEffect(() => {
    fetchConfiguracoes();
  }, [user]);

  const fetchConfiguracoes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('configuracoes_monitoramento')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConfiguracoes(data || []);
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.candidato_nome || !formData.tipo_monitoramento) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('configuracoes_monitoramento')
        .insert([{
          ...formData,
          user_id: user.id
        }]);

      if (error) throw error;

      toast({
        title: "Configuração salva!",
        description: "Monitoramento configurado com sucesso.",
      });

      setFormData({
        candidato_nome: '',
        tipo_monitoramento: '',
        frequencia_atualizacao: 'semanal',
        ativo: true
      });

      fetchConfiguracoes();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar configuração",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleConfig = async (id: string, ativo: boolean) => {
    try {
      const { error } = await supabase
        .from('configuracoes_monitoramento')
        .update({ ativo })
        .eq('id', id);

      if (error) throw error;

      setConfiguracoes(configs => 
        configs.map(config => 
          config.id === id ? { ...config, ativo } : config
        )
      );

      toast({
        title: ativo ? "Monitoramento ativado" : "Monitoramento desativado",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar configuração",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteConfig = async (id: string) => {
    try {
      const { error } = await supabase
        .from('configuracoes_monitoramento')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setConfiguracoes(configs => configs.filter(config => config.id !== id));

      toast({
        title: "Configuração removida",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao remover configuração",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Formulário para nova configuração */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Nova Configuração de Monitoramento
          </CardTitle>
          <CardDescription>
            Configure o monitoramento automático de dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="candidato_nome">Nome do Candidato</Label>
                <Input
                  id="candidato_nome"
                  value={formData.candidato_nome}
                  onChange={(e) => setFormData({...formData, candidato_nome: e.target.value})}
                  placeholder="Nome do candidato a monitorar"
                  required
                />
              </div>

              <div>
                <Label htmlFor="tipo_monitoramento">Tipo de Monitoramento</Label>
                <Select value={formData.tipo_monitoramento} onValueChange={(value) => setFormData({...formData, tipo_monitoramento: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eleitoral">Dados Eleitorais</SelectItem>
                    <SelectItem value="redes_sociais">Redes Sociais</SelectItem>
                    <SelectItem value="ambos">Ambos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="frequencia">Frequência de Atualização</Label>
                <Select value={formData.frequencia_atualizacao} onValueChange={(value) => setFormData({...formData, frequencia_atualizacao: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diario">Diário</SelectItem>
                    <SelectItem value="semanal">Semanal</SelectItem>
                    <SelectItem value="mensal">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="ativo"
                  checked={formData.ativo}
                  onCheckedChange={(checked) => setFormData({...formData, ativo: checked})}
                />
                <Label htmlFor="ativo">Monitoramento ativo</Label>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Salvando..." : "Salvar Configuração"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de configurações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configurações Ativas
          </CardTitle>
          <CardDescription>
            Gerencie suas configurações de monitoramento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {configuracoes.map((config) => (
              <div key={config.id} className="border rounded-lg p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-semibold">{config.candidato_nome}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {config.tipo_monitoramento.replace('_', ' ')}
                    </Badge>
                    <Badge variant="secondary">
                      {config.frequencia_atualizacao}
                    </Badge>
                    <Badge variant={config.ativo ? "default" : "destructive"}>
                      {config.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  {config.ultima_atualizacao && (
                    <p className="text-sm text-gray-600">
                      Última atualização: {new Date(config.ultima_atualizacao).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={config.ativo}
                    onCheckedChange={(checked) => toggleConfig(config.id, checked)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteConfig(config.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {configuracoes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhuma configuração de monitoramento criada
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
