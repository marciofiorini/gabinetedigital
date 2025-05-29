
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Eye, MessageSquare } from "lucide-react";

interface MessagePreviewProps {
  assunto: string;
  conteudo: string;
  variaveis: string[];
  variaveisValues: Record<string, string>;
}

export const MessagePreview = ({ assunto, conteudo, variaveis, variaveisValues }: MessagePreviewProps) => {
  const substituirVariaveis = (texto: string) => {
    let textoFinal = texto;
    Object.entries(variaveisValues).forEach(([variavel, valor]) => {
      const regex = new RegExp(`\\{${variavel}\\}`, 'g');
      textoFinal = textoFinal.replace(regex, valor || `{${variavel}}`);
    });
    return textoFinal;
  };

  return (
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
                {substituirVariaveis(assunto)}
              </div>
            </div>
            
            <div>
              <Label className="text-xs font-medium text-gray-600">Mensagem:</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded border text-sm whitespace-pre-wrap">
                {substituirVariaveis(conteudo)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Variáveis não preenchidas */}
      {variaveis.some(v => !variaveisValues[v]) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-yellow-800 text-sm">
              <MessageSquare className="w-4 h-4" />
              <span className="font-medium">Variáveis pendentes:</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {variaveis
                .filter(v => !variaveisValues[v])
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
  );
};
