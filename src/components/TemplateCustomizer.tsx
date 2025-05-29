
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wand2, Send } from "lucide-react";
import { TemplateEditor } from "./template/TemplateEditor";
import { VariablesList } from "./template/VariablesList";
import { MessagePreview } from "./template/MessagePreview";

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

  const handleVariableChange = (variavel: string, value: string) => {
    setVariaveis(prev => ({
      ...prev,
      [variavel]: value
    }));
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
            <TemplateEditor
              assunto={assuntoCustomizado}
              conteudo={conteudoCustomizado}
              onAssuntoChange={setAssuntoCustomizado}
              onConteudoChange={setConteudoCustomizado}
            />

            <VariablesList
              variaveis={template.variaveis}
              variaveisValues={variaveis}
              onVariableChange={handleVariableChange}
            />
          </div>

          {/* Lado direito - Preview */}
          <MessagePreview
            assunto={assuntoCustomizado}
            conteudo={conteudoCustomizado}
            variaveis={template.variaveis}
            variaveisValues={variaveis}
          />
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
