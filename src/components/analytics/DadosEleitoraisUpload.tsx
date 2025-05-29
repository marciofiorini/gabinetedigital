import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const DadosEleitoraisUpload = () => {
  const [loading, setLoading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'manual' | 'csv'>('manual');
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    ano_eleicao: new Date().getFullYear(),
    cargo: '',
    candidato_nome: '',
    candidato_numero: '',
    partido: '',
    estado: '',
    municipio: '',
    zona_eleitoral: '',
    secao_eleitoral: '',
    bairro: '',
    votos_nominais: 0,
    votos_legenda: 0,
    total_votos: 0,
    percentual_votos: 0,
    posicao_ranking: 0,
    situacao: '',
    is_candidato_proprio: false,
    mesmo_partido: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('dados_eleitorais')
        .insert([{
          ...formData,
          user_id: user.id
        }]);

      if (error) throw error;

      toast({
        title: "Dados inseridos com sucesso!",
        description: "Os dados eleitorais foram salvos.",
      });

      // Reset form
      setFormData({
        ano_eleicao: new Date().getFullYear(),
        cargo: '',
        candidato_nome: '',
        candidato_numero: '',
        partido: '',
        estado: '',
        municipio: '',
        zona_eleitoral: '',
        secao_eleitoral: '',
        bairro: '',
        votos_nominais: 0,
        votos_legenda: 0,
        total_votos: 0,
        percentual_votos: 0,
        posicao_ranking: 0,
        situacao: '',
        is_candidato_proprio: false,
        mesmo_partido: false
      });
    } catch (error: any) {
      toast({
        title: "Erro ao inserir dados",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCSVUpload = async (file: File) => {
    if (!user) return;

    setLoading(true);
    try {
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',');
      
      const data = lines.slice(1)
        .filter(line => line.trim())
        .map(line => {
          const values = line.split(',');
          const record: any = { user_id: user.id };
          
          headers.forEach((header, index) => {
            const cleanHeader = header.trim().replace(/"/g, '');
            const value = values[index]?.trim().replace(/"/g, '');
            
            if (cleanHeader && value) {
              if (['ano_eleicao', 'votos_nominais', 'votos_legenda', 'total_votos', 'posicao_ranking'].includes(cleanHeader)) {
                record[cleanHeader] = parseInt(value) || 0;
              } else if (cleanHeader === 'percentual_votos') {
                record[cleanHeader] = parseFloat(value) || 0;
              } else if (cleanHeader === 'is_candidato_proprio') {
                record[cleanHeader] = value.toLowerCase() === 'true';
              } else {
                record[cleanHeader] = value;
              }
            }
          });
          
          return record;
        });

      const { error } = await supabase
        .from('dados_eleitorais')
        .insert(data);

      if (error) throw error;

      toast({
        title: "CSV importado com sucesso!",
        description: `${data.length} registros inseridos.`,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao importar CSV",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Dados Eleitorais
        </CardTitle>
        <CardDescription>
          Importe dados do TSE ou insira manualmente candidatos concorrentes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4">
          <Button
            variant={uploadMethod === 'manual' ? 'default' : 'outline'}
            onClick={() => setUploadMethod('manual')}
          >
            Inserção Manual
          </Button>
          <Button
            variant={uploadMethod === 'csv' ? 'default' : 'outline'}
            onClick={() => setUploadMethod('csv')}
          >
            Upload CSV
          </Button>
        </div>

        {uploadMethod === 'csv' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <Label htmlFor="csv-upload" className="cursor-pointer">
                <span className="text-sm font-medium">Clique para selecionar arquivo CSV</span>
                <Input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleCSVUpload(file);
                  }}
                />
              </Label>
              <p className="text-xs text-gray-500 mt-2">
                Formato: ano_eleicao,cargo,candidato_nome,candidato_numero,partido,estado,municipio...
              </p>
            </div>
          </div>
        )}

        {uploadMethod === 'manual' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ano_eleicao">Ano da Eleição</Label>
                <Input
                  id="ano_eleicao"
                  type="number"
                  value={formData.ano_eleicao}
                  onChange={(e) => setFormData({...formData, ano_eleicao: parseInt(e.target.value)})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="cargo">Cargo</Label>
                <Select value={formData.cargo} onValueChange={(value) => setFormData({...formData, cargo: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prefeito">Prefeito</SelectItem>
                    <SelectItem value="vereador">Vereador</SelectItem>
                    <SelectItem value="deputado_estadual">Deputado Estadual</SelectItem>
                    <SelectItem value="deputado_federal">Deputado Federal</SelectItem>
                    <SelectItem value="senador">Senador</SelectItem>
                    <SelectItem value="governador">Governador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="candidato_nome">Nome do Candidato</Label>
                <Input
                  id="candidato_nome"
                  value={formData.candidato_nome}
                  onChange={(e) => setFormData({...formData, candidato_nome: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="candidato_numero">Número do Candidato</Label>
                <Input
                  id="candidato_numero"
                  value={formData.candidato_numero}
                  onChange={(e) => setFormData({...formData, candidato_numero: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="partido">Partido</Label>
                <Input
                  id="partido"
                  value={formData.partido}
                  onChange={(e) => setFormData({...formData, partido: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  value={formData.estado}
                  onChange={(e) => setFormData({...formData, estado: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="municipio">Município</Label>
                <Input
                  id="municipio"
                  value={formData.municipio}
                  onChange={(e) => setFormData({...formData, municipio: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="votos_nominais">Votos Nominais</Label>
                <Input
                  id="votos_nominais"
                  type="number"
                  value={formData.votos_nominais}
                  onChange={(e) => setFormData({...formData, votos_nominais: parseInt(e.target.value) || 0})}
                />
              </div>

              <div>
                <Label htmlFor="votos_legenda">Votos de Legenda</Label>
                <Input
                  id="votos_legenda"
                  type="number"
                  value={formData.votos_legenda}
                  onChange={(e) => setFormData({...formData, votos_legenda: parseInt(e.target.value) || 0})}
                />
              </div>

              <div>
                <Label htmlFor="total_votos">Total de Votos</Label>
                <Input
                  id="total_votos"
                  type="number"
                  value={formData.total_votos}
                  onChange={(e) => setFormData({...formData, total_votos: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_candidato_proprio"
                  checked={formData.is_candidato_proprio}
                  onCheckedChange={(checked) => setFormData({...formData, is_candidato_proprio: checked})}
                />
                <Label htmlFor="is_candidato_proprio">É o candidato próprio?</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="mesmo_partido"
                  checked={formData.mesmo_partido}
                  onCheckedChange={(checked) => setFormData({...formData, mesmo_partido: checked})}
                />
                <Label htmlFor="mesmo_partido">Mesmo partido que o meu?</Label>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Salvando..." : "Salvar Dados"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};
