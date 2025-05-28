
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FileText, Download, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const RelatoriosPDF = () => {
  const [loading, setLoading] = useState(false);
  const [tipoRelatorio, setTipoRelatorio] = useState('');
  const [dataInicio, setDataInicio] = useState<Date>();
  const [dataFim, setDataFim] = useState<Date>();
  const { user } = useAuth();
  const { toast } = useToast();

  const gerarRelatorio = async () => {
    if (!user || !tipoRelatorio || !dataInicio || !dataFim) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      let dados: any[] = [];
      let titulo = '';

      if (tipoRelatorio === 'eleitoral') {
        const { data, error } = await supabase
          .from('dados_eleitorais')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', format(dataInicio, 'yyyy-MM-dd'))
          .lte('created_at', format(dataFim, 'yyyy-MM-dd'))
          .order('total_votos', { ascending: false });

        if (error) throw error;
        dados = data || [];
        titulo = 'Relatório de Dados Eleitorais';
      } else if (tipoRelatorio === 'redes_sociais') {
        const { data, error } = await supabase
          .from('dados_redes_sociais')
          .select('*')
          .eq('user_id', user.id)
          .gte('data_coleta', format(dataInicio, 'yyyy-MM-dd'))
          .lte('data_coleta', format(dataFim, 'yyyy-MM-dd'))
          .order('seguidores', { ascending: false });

        if (error) throw error;
        dados = data || [];
        titulo = 'Relatório de Redes Sociais';
      }

      // Gerar HTML para PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>${titulo}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #2563eb; text-align: center; margin-bottom: 30px; }
              .header { text-align: center; margin-bottom: 20px; color: #666; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; font-weight: bold; }
              .stats { display: flex; justify-content: space-around; margin: 20px 0; }
              .stat-item { text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px; }
              .stat-value { font-size: 24px; font-weight: bold; color: #2563eb; }
              .stat-label { color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <h1>${titulo}</h1>
            <div class="header">
              <p>Período: ${format(dataInicio, 'dd/MM/yyyy')} - ${format(dataFim, 'dd/MM/yyyy')}</p>
              <p>Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
            </div>
            
            ${tipoRelatorio === 'eleitoral' ? `
              <div class="stats">
                <div class="stat-item">
                  <div class="stat-value">${dados.reduce((sum, item) => sum + (item.total_votos || 0), 0).toLocaleString()}</div>
                  <div class="stat-label">Total de Votos</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">${new Set(dados.map(item => item.municipio)).size}</div>
                  <div class="stat-label">Municípios</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">${new Set(dados.map(item => item.candidato_nome)).size}</div>
                  <div class="stat-label">Candidatos</div>
                </div>
              </div>
              
              <table>
                <thead>
                  <tr>
                    <th>Candidato</th>
                    <th>Cargo</th>
                    <th>Município</th>
                    <th>Total de Votos</th>
                    <th>Posição</th>
                    <th>Situação</th>
                  </tr>
                </thead>
                <tbody>
                  ${dados.map(item => `
                    <tr>
                      <td>${item.candidato_nome}${item.is_candidato_proprio ? ' (Próprio)' : ''}</td>
                      <td>${item.cargo}</td>
                      <td>${item.municipio}</td>
                      <td>${(item.total_votos || 0).toLocaleString()}</td>
                      <td>${item.posicao_ranking || 'N/A'}</td>
                      <td>${item.situacao || 'N/A'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : `
              <div class="stats">
                <div class="stat-item">
                  <div class="stat-value">${dados.reduce((sum, item) => sum + (item.seguidores || 0), 0).toLocaleString()}</div>
                  <div class="stat-label">Total de Seguidores</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">${new Set(dados.map(item => item.rede_social)).size}</div>
                  <div class="stat-label">Redes Sociais</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">${dados.reduce((sum, item) => sum + (item.publicacoes || 0), 0).toLocaleString()}</div>
                  <div class="stat-label">Total de Publicações</div>
                </div>
              </div>
              
              <table>
                <thead>
                  <tr>
                    <th>Candidato</th>
                    <th>Rede Social</th>
                    <th>Handle</th>
                    <th>Seguidores</th>
                    <th>Engajamento (%)</th>
                    <th>Data Coleta</th>
                  </tr>
                </thead>
                <tbody>
                  ${dados.map(item => `
                    <tr>
                      <td>${item.candidato_nome}${item.is_candidato_proprio ? ' (Próprio)' : ''}</td>
                      <td>${item.rede_social}</td>
                      <td>${item.handle_usuario || 'N/A'}</td>
                      <td>${(item.seguidores || 0).toLocaleString()}</td>
                      <td>${(item.engajamento_medio || 0).toFixed(2)}%</td>
                      <td>${new Date(item.data_coleta).toLocaleDateString()}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `}
          </body>
        </html>
      `;

      // Criar e baixar PDF
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${titulo.toLowerCase().replace(/\s+/g, '_')}_${format(new Date(), 'yyyy_MM_dd')}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Relatório gerado!",
        description: "O arquivo HTML foi baixado. Você pode convertê-lo para PDF em seu navegador.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao gerar relatório",
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
          <FileText className="w-5 h-5" />
          Geração de Relatórios
        </CardTitle>
        <CardDescription>
          Gere relatórios em PDF dos seus dados políticos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Tipo de Relatório</label>
          <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de relatório" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eleitoral">Dados Eleitorais</SelectItem>
              <SelectItem value="redes_sociais">Redes Sociais</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Data Início</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dataInicio && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dataInicio ? format(dataInicio, "dd/MM/yyyy") : <span>Selecione</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dataInicio}
                  onSelect={setDataInicio}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="text-sm font-medium">Data Fim</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dataFim && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dataFim ? format(dataFim, "dd/MM/yyyy") : <span>Selecione</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dataFim}
                  onSelect={setDataFim}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Button onClick={gerarRelatorio} disabled={loading} className="w-full">
          <Download className="w-4 h-4 mr-2" />
          {loading ? "Gerando..." : "Gerar Relatório"}
        </Button>
      </CardContent>
    </Card>
  );
};
