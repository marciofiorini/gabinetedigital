
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TemplateEditorProps {
  assunto: string;
  conteudo: string;
  onAssuntoChange: (value: string) => void;
  onConteudoChange: (value: string) => void;
}

export const TemplateEditor = ({ 
  assunto, 
  conteudo, 
  onAssuntoChange, 
  onConteudoChange 
}: TemplateEditorProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Assunto</Label>
        <Textarea
          value={assunto}
          onChange={(e) => onAssuntoChange(e.target.value)}
          className="min-h-[60px]"
        />
      </div>

      <div>
        <Label>Conteúdo</Label>
        <Textarea
          value={conteudo}
          onChange={(e) => onConteudoChange(e.target.value)}
          className="min-h-[150px]"
        />
      </div>
    </div>
  );
};
