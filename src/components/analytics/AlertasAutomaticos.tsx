
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Bell, Plus, Trash2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Alerta {
  id: string;
  nome: string;
  tipo: string;
  metrica: string;
  condicao: string;
  valor_limite: number;
  ativo: boolean;
  created_at: string;
}

export const AlertasAutomaticos = () => {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [novoAlerta, setNovoAlerta] = useState({
    nome: '',
    tipo: '',
    metrica: '',
    condicao: '',
    valor_limite: 0,
    ativo: true
  });

  const criarAlerta = async () => {
    if (!novoAlerta.nome || !novoAlerta.tipo || !novoAlerta.metrica) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Simular criação do alerta por agora
      const novoId = Math.random().toString(36).substr(2, 9);
      const alertaCriado: Alerta = {
        id: novoId,
        ...novoAlerta,
        created_at: new Date().toISOString()
      };

      setAlertas(prev => [...prev, alertaCriado]);

      toast({
        title: "Alerta criado!",
        description: "O alerta automático foi configurado com sucesso.",
      });

      setNovoAlerta({
        nome: '',
        tipo: '',
        metrica: '',
        condicao: '',
        valor_limite: 0,
        ativo: true
      });
    } catch (error: any) {
      toast({
        title: "Erro ao criar alerta",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAlerta = async (id: string, ativo: boolean) => {
    try {
      setAlertas(prev => prev.map(alerta => 
        alerta.id === id ? { ...alerta, ativo } : alerta
      ));

      toast({
        title: ativo ? "Alerta ativado" : "Alerta desativado",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar alerta",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deletarAlerta = async (id: string) => {
    try {
      setAlertas(prev => prev.filter(alerta => alerta.id !== id));

      toast({
        title: "Alerta removido",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao remover alerta",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Criar novo alerta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Criar Novo Alerta
          </CardTitle>
          <CardDescription>
            Configure alertas automáticos para monitorar mudanças significativas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome_alerta">Nome do Alerta</Label>
              <Input
                id="nome_alerta"
                value={novoAlerta.nome}
                onChange={(e) => setNovoAlerta({...novoAlerta, nome: e.target.value})}
                placeholder="Ex: Crescimento de seguidores"
              />
            </div>

            <div>
              <Label htmlFor="tipo_alerta">Tipo de Dados</Label>
              <Select value={novoAlerta.tipo} onValueChange={(value) => setNovoAlerta({...novoAlerta, tipo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eleitoral">Dados Eleitorais</SelectItem>
                  <SelectItem value="redes_sociais">Redes Sociais</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="metrica_alerta">Métrica</Label>
              <Select value={novoAlerta.metrica} onValueChange={(value) => setNovoAlerta({...novoAlerta, metrica: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a métrica" />
                </SelectTrigger>
                <SelectContent>
                  {novoAlerta.tipo === 'eleitoral' ? (
                    <SelectItem value="votos">Votos</SelectItem>
                  ) : (
                    <>
                      <SelectItem value="seguidores">Seguidores</SelectItem>
                      <SelectItem value="engajamento">Engajamento</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="condicao_alerta">Condição</Label>
              <Select value={novoAlerta.condicao} onValueChange={(value) => setNovoAlerta({...novoAlerta, condicao: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a condição" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maior">Maior que</SelectItem>
                  <SelectItem value="menor">Menor que</SelectItem>
                  <SelectItem value="igual">Igual a</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="valor_limite">Valor Limite</Label>
              <Input
                id="valor_limite"
                type="number"
                value={novoAlerta.valor_limite}
                onChange={(e) => setNovoAlerta({...novoAlerta, valor_limite: parseFloat(e.target.value) || 0})}
                placeholder="0"
              />
            </div>
          </div>

          <Button onClick={criarAlerta} disabled={loading} className="w-full">
            {loading ? "Criando..." : "Criar Alerta"}
          </Button>
        </CardContent>
      </Card>

      {/* Lista de alertas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Alertas Configurados
          </CardTitle>
          <CardDescription>
            Gerencie seus alertas automáticos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alertas.map((alerta) => (
              <div key={alerta.id} className="border rounded-lg p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{alerta.nome}</h4>
                    <Badge variant={alerta.ativo ? "default" : "secondary"}>
                      {alerta.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {alerta.tipo === 'eleitoral' ? 'Dados Eleitorais' : 'Redes Sociais'} - 
                    {alerta.metrica} {alerta.condicao} {alerta.valor_limite}
                  </p>
                  <p className="text-xs text-gray-500">
                    Criado em: {new Date(alerta.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={alerta.ativo}
                    onCheckedChange={(checked) => toggleAlerta(alerta.id, checked)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deletarAlerta(alerta.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {alertas.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum alerta configurado</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
