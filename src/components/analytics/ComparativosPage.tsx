
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const ComparativosPage = () => {
  const [comparativos, setComparativos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [candidatos, setCandidatos] = useState<string[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    candidato_nome: '',
    tipo_dado: '',
    metrica: '',
    periodo_inicial: new Date(),
    periodo_final: new Date(),
    observacoes: ''
  });

  useEffect(() => {
    fetchComparativos();
    fetchCandidatos();
  }, [user]);

  const fetchComparativos = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('comparativos_temporais')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComparativos(data || []);
    } catch (error) {
      console.error('Erro ao buscar comparativos:', error);
    }
  };

  const fetchCandidatos = async () => {
    if (!user) return;

    try {
      // Buscar candidatos únicos de ambas as tabelas
      const [eleitorais, redes] = await Promise.all([
        supabase
          .from('dados_eleitorais')
          .select('candidato_nome')
          .eq('user_id', user.id),
        supabase
          .from('dados_redes_sociais')
          .select('candidato_nome')
          .eq('user_id', user.id)
      ]);

      const nomes = new Set([
        ...(eleitorais.data?.map(item => item.candidato_nome) || []),
        ...(redes.data?.map(item => item.candidato_nome) || [])
      ]);

      setCandidatos(Array.from(nomes));
    } catch (error) {
      console.error('Erro ao buscar candidatos:', error);
    }
  };

  const calcularComparativo = async () => {
    if (!user || !formData.candidato_nome || !formData.tipo_dado || !formData.metrica) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Chamar função do banco para calcular comparativo
      const { data, error } = await supabase.rpc('calcular_comparativo_temporal', {
        target_user_id: user.id,
        candidato: formData.candidato_nome,
        tipo: formData.tipo_dado,
        metrica_nome: formData.metrica,
        data_inicio: format(formData.periodo_inicial, 'yyyy-MM-dd'),
        data_fim: format(formData.periodo_final, 'yyyy-MM-dd')
      });

      if (error) throw error;

      if (data && data.length > 0) {
        const resultado = data[0];
        
        // Salvar resultado na tabela de comparativos
        const { error: insertError } = await supabase
          .from('comparativos_temporais')
          .insert([{
            user_id: user.id,
            candidato_nome: formData.candidato_nome,
            tipo_dado: formData.tipo_dado,
            periodo_inicial: format(formData.periodo_inicial, 'yyyy-MM-dd'),
            periodo_final: format(formData.periodo_final, 'yyyy-MM-dd'),
            metrica: formData.metrica,
            valor_inicial: resultado.valor_inicial,
            valor_final: resultado.valor_final,
            variacao_absoluta: resultado.variacao_absoluta,
            variacao_percentual: resultado.variacao_percentual,
            observacoes: formData.observacoes
          }]);

        if (insertError) throw insertError;

        toast({
          title: "Comparativo calculado!",
          description: `Variação: ${resultado.variacao_percentual?.toFixed(2)}%`,
        });

        fetchComparativos();
      }
    } catch (error: any) {
      toast({
        title: "Erro ao calcular comparativo",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getVariacaoIcon = (variacao: number) => {
    if (variacao > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (variacao < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getVariacaoColor = (variacao: number) => {
    if (variacao > 0) return "text-green-600";
    if (variacao < 0) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="space-y-6">
      {/* Formulário para novo comparativo */}
      <Card>
        <CardHeader>
          <CardTitle>Gerar Novo Comparativo</CardTitle>
          <CardDescription>
            Compare dados entre períodos diferentes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="candidato">Candidato</Label>
              <Select value={formData.candidato_nome} onValueChange={(value) => setFormData({...formData, candidato_nome: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o candidato" />
                </SelectTrigger>
                <SelectContent>
                  {candidatos.map(candidato => (
                    <SelectItem key={candidato} value={candidato}>{candidato}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tipo_dado">Tipo de Dado</Label>
              <Select value={formData.tipo_dado} onValueChange={(value) => setFormData({...formData, tipo_dado: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eleitoral">Dados Eleitorais</SelectItem>
                  <SelectItem value="redes_sociais">Redes Sociais</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="metrica">Métrica</Label>
              <Select value={formData.metrica} onValueChange={(value) => setFormData({...formData, metrica: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a métrica" />
                </SelectTrigger>
                <SelectContent>
                  {formData.tipo_dado === 'eleitoral' && (
                    <>
                      <SelectItem value="votos">Votos</SelectItem>
                      <SelectItem value="percentual">Percentual</SelectItem>
                    </>
                  )}
                  {formData.tipo_dado === 'redes_sociais' && (
                    <>
                      <SelectItem value="seguidores">Seguidores</SelectItem>
                      <SelectItem value="engajamento">Engajamento</SelectItem>
                      <SelectItem value="publicacoes">Publicações</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Período Inicial</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.periodo_inicial && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.periodo_inicial ? format(formData.periodo_inicial, "dd/MM/yyyy") : <span>Data inicial</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.periodo_inicial}
                    onSelect={(date) => date && setFormData({...formData, periodo_inicial: date})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Período Final</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.periodo_final && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.periodo_final ? format(formData.periodo_final, "dd/MM/yyyy") : <span>Data final</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.periodo_final}
                    onSelect={(date) => date && setFormData({...formData, periodo_final: date})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Input
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
              placeholder="Observações sobre este comparativo..."
            />
          </div>

          <Button onClick={calcularComparativo} disabled={loading} className="w-full">
            {loading ? "Calculando..." : "Gerar Comparativo"}
          </Button>
        </CardContent>
      </Card>

      {/* Lista de comparativos */}
      <Card>
        <CardHeader>
          <CardTitle>Comparativos Realizados</CardTitle>
          <CardDescription>
            Histórico de análises comparativas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {comparativos.map((comp, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{comp.candidato_nome}</h4>
                    <p className="text-sm text-gray-600">
                      {comp.metrica} - {comp.tipo_dado.replace('_', ' ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center gap-2 ${getVariacaoColor(comp.variacao_percentual)}`}>
                      {getVariacaoIcon(comp.variacao_percentual)}
                      <span className="font-bold">
                        {comp.variacao_percentual?.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Valor Inicial:</span>
                    <p className="font-medium">{comp.valor_inicial?.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Valor Final:</span>
                    <p className="font-medium">{comp.valor_final?.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Variação Absoluta:</span>
                    <p className="font-medium">{comp.variacao_absoluta?.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Período:</span>
                    <p className="font-medium">
                      {new Date(comp.periodo_inicial).toLocaleDateString()} - {new Date(comp.periodo_final).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {comp.observacoes && (
                  <p className="text-sm text-gray-600 italic">{comp.observacoes}</p>
                )}
              </div>
            ))}

            {comparativos.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum comparativo realizado ainda
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
