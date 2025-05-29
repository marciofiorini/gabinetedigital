
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageSquare, Wand2, Eye, Send } from "lucide-react";

interface MessageTemplate {
  id: string;
  nome: string;
  tipo: 'ligacao' | 'mensagem' | 'reuniao' | 'aniversario';
  assunto: string;
  conteudo: string;
  variaveis: string[];
  ativo: boolean;
}

interface TemplateCustomizerProps {
  template: MessageTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (customizedMessage: { assunto: string; conteudo: string; variaveis: Record<string, string> }) => void;
  leadData?: {
    nome?: string;
    email?: string;
    telefone?: string;
    zona?: string;
  };
}

export const TemplateCustomizer = ({ 
  template, 
  isOpen, 
  onClose, 
  onSave,
  leadData 
}: TemplateCustomizerProps) => {
  const [variaveis, setVariaveis] = useState<Record<string, string>>({});
  const [assuntoCustomizado, setAssuntoCustomizado] = useState('');
  const [conteudoCustomizado, setConteudoCustomizado] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (template) {
      // Pré-preencher variáveis com dados do lead, se disponível
      const initialVars: Record<string, string> = {};
      
      template.variaveis.forEach(variavel => {
        switch (variavel) {
          case 'NOME':
            initialVars[variavel] = leadData?.nome || '';
            break;
          case 'EMAIL':
            initialVars[variavel] = leadData?.email || '';
            break;
          case 'TELEFONE':
            initialVars[variavel] = leadData?.telefone || '';
            break;
          case 'ZONA':
            initialVars[variavel] = leadData?.zona || '';
            break;
          case 'DATA':
            initialVars[variavel] = new Date().toLocaleDateString('pt-BR');
            break;
          case 'HORARIO':
            initialVars[variavel] = new Date().toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            });
            break;
          default:
            initialVars[variavel] = '';
        }
      });

      setVariaveis(initialVars);
      setAssuntoCustomizado(template.assunto);
      setConteudoCustomizado(template.conteudo);
    }
  }, [template, leadData]);

  const substituirVariaveis = (texto: string) => {
    let textoFinal = texto;
    Object.entries(variaveis).forEach(([variavel, valor]) => {
      const regex = new RegExp(`\\{${variavel}\\}`, 'g');
      textoFinal = textoFinal.replace(regex, valor || `{${variavel}}`);
    });
    return textoFinal;
  };

  const handleSave = () => {
    onSave({
      assunto: substituirVariaveis(assuntoCustomizado),
      conteudo: substituirVariaveis(conteudoCustomizado),
      variaveis
    });
    onClose();
  };

  const getVariavelSuggestions = (variavel: string) => {
    switch (variavel) {
      case 'ASSUNTO':
        return ['Reunião comunitária', 'Projeto de lei', 'Demanda local', 'Evento público'];
      case 'TEMA':
        return ['Saúde', 'Educação', 'Segurança', 'Infraestrutura', 'Transporte'];
      case 'PAUTA':
        return ['Orçamento participativo', 'Obra pública', 'Política social', 'Meio ambiente'];
      case 'LOCAL':
        return ['Câmara Municipal', 'Centro comunitário', 'Gabinete', 'Via videoconferência'];
      default:
        return [];
    }
  };

  if (!template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            Personalizar Template: {template.nome}
          </DialogTitle>
          <DialogDescription>
            Customize as variáveis e visualize a mensagem final
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lado esquerdo - Personalização */}
          <div className="space-y-4">
            <div>
              <Label>Assunto</Label>
              <Textarea
                value={assuntoCustomizado}
                onChange={(e) => setAssuntoCustomizado(e.target.value)}
                className="min-h-[60px]"
              />
            </div>

            <div>
              <Label>Conteúdo</Label>
              <Textarea
                value={conteudoCustomizado}
                onChange={(e) => setConteudoCustomizado(e.target.value)}
                className="min-h-[150px]"
              />
            </div>

            {template.variaveis.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Variáveis</CardTitle>
                  <CardDescription className="text-xs">
                    Personalize os valores das variáveis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {template.variaveis.map((variavel) => (
                    <div key={variavel}>
                      <Label className="text-xs font-medium text-gray-700">
                        {`{${variavel}}`}
                      </Label>
                      <div className="mt-1">
                        <Input
                          value={variaveis[variavel] || ''}
                          onChange={(e) => setVariaveis(prev => ({
                            ...prev,
                            [variavel]: e.target.value
                          }))}
                          placeholder={`Digite o valor para ${variavel}`}
                          className="text-sm"
                        />
                        {getVariavelSuggestions(variavel).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {getVariavelSuggestions(variavel).map((sugestao) => (
                              <Badge
                                key={sugestao}
                                variant="outline"
                                className="text-xs cursor-pointer hover:bg-gray-100"
                                onClick={() => setVariaveis(prev => ({
                                  ...prev,
                                  [variavel]: sugestao
                                }))}
                              >
                                {sugestao}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Lado direito - Preview */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Preview da Mensagem
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs font-medium text-gray-600">Assunto:</Label>
                    <div className="mt-1 p-3 bg-gray-50 rounded border text-sm">
                      {substituirVariaveis(assuntoCustomizado)}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs font-medium text-gray-600">Mensagem:</Label>
                    <div className="mt-1 p-3 bg-gray-50 rounded border text-sm whitespace-pre-wrap">
                      {substituirVariaveis(conteudoCustomizado)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Variáveis não preenchidas */}
            {template.variaveis.some(v => !variaveis[v]) && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-yellow-800 text-sm">
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-medium">Variáveis pendentes:</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {template.variaveis
                      .filter(v => !variaveis[v])
                      .map(variavel => (
                        <Badge key={variavel} variant="outline" className="text-yellow-700 border-yellow-300">
                          {`{${variavel}}`}
                        </Badge>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Send className="w-4 h-4 mr-2" />
            Usar Mensagem Personalizada
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
