
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Upload, Users, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const DadosRedesSociaisUpload = () => {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    candidato_nome: '',
    rede_social: '',
    handle_usuario: '',
    url_perfil: '',
    seguidores: 0,
    seguindo: 0,
    publicacoes: 0,
    engajamento_medio: 0,
    curtidas_totais: 0,
    comentarios_totais: 0,
    compartilhamentos_totais: 0,
    is_candidato_proprio: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('dados_redes_sociais')
        .insert([{
          ...formData,
          user_id: user.id,
          data_coleta: format(date, 'yyyy-MM-dd')
        }]);

      if (error) throw error;

      toast({
        title: "Dados inseridos com sucesso!",
        description: "Os dados de redes sociais foram salvos.",
      });

      // Reset form
      setFormData({
        candidato_nome: '',
        rede_social: '',
        handle_usuario: '',
        url_perfil: '',
        seguidores: 0,
        seguindo: 0,
        publicacoes: 0,
        engajamento_medio: 0,
        curtidas_totais: 0,
        comentarios_totais: 0,
        compartilhamentos_totais: 0,
        is_candidato_proprio: false
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Upload Dados Redes Sociais
        </CardTitle>
        <CardDescription>
          Monitore métricas de Instagram, YouTube, TikTok e Facebook
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="rede_social">Rede Social</Label>
              <Select value={formData.rede_social} onValueChange={(value) => setFormData({...formData, rede_social: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a rede social" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="handle_usuario">Handle/Username</Label>
              <Input
                id="handle_usuario"
                placeholder="@usuario"
                value={formData.handle_usuario}
                onChange={(e) => setFormData({...formData, handle_usuario: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="url_perfil">URL do Perfil</Label>
              <Input
                id="url_perfil"
                type="url"
                value={formData.url_perfil}
                onChange={(e) => setFormData({...formData, url_perfil: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="seguidores">Seguidores</Label>
              <Input
                id="seguidores"
                type="number"
                value={formData.seguidores}
                onChange={(e) => setFormData({...formData, seguidores: parseInt(e.target.value) || 0})}
              />
            </div>

            <div>
              <Label htmlFor="seguindo">Seguindo</Label>
              <Input
                id="seguindo"
                type="number"
                value={formData.seguindo}
                onChange={(e) => setFormData({...formData, seguindo: parseInt(e.target.value) || 0})}
              />
            </div>

            <div>
              <Label htmlFor="publicacoes">Publicações</Label>
              <Input
                id="publicacoes"
                type="number"
                value={formData.publicacoes}
                onChange={(e) => setFormData({...formData, publicacoes: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="curtidas_totais">Curtidas Totais</Label>
              <Input
                id="curtidas_totais"
                type="number"
                value={formData.curtidas_totais}
                onChange={(e) => setFormData({...formData, curtidas_totais: parseInt(e.target.value) || 0})}
              />
            </div>

            <div>
              <Label htmlFor="comentarios_totais">Comentários Totais</Label>
              <Input
                id="comentarios_totais"
                type="number"
                value={formData.comentarios_totais}
                onChange={(e) => setFormData({...formData, comentarios_totais: parseInt(e.target.value) || 0})}
              />
            </div>

            <div>
              <Label htmlFor="engajamento_medio">Engajamento Médio (%)</Label>
              <Input
                id="engajamento_medio"
                type="number"
                step="0.01"
                value={formData.engajamento_medio}
                onChange={(e) => setFormData({...formData, engajamento_medio: parseFloat(e.target.value) || 0})}
              />
            </div>
          </div>

          <div>
            <Label>Data da Coleta</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd/MM/yyyy") : <span>Selecione a data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_candidato_proprio"
              checked={formData.is_candidato_proprio}
              onCheckedChange={(checked) => setFormData({...formData, is_candidato_proprio: checked})}
            />
            <Label htmlFor="is_candidato_proprio">É o candidato próprio?</Label>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Salvando..." : "Salvar Dados"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
