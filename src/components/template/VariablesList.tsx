
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VariableInput } from "./VariableInput";

interface VariablesListProps {
  variaveis: string[];
  variaveisValues: Record<string, string>;
  onVariableChange: (variavel: string, value: string) => void;
}

export const VariablesList = ({ variaveis, variaveisValues, onVariableChange }: VariablesListProps) => {
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

  if (variaveis.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Variáveis</CardTitle>
        <CardDescription className="text-xs">
          Personalize os valores das variáveis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {variaveis.map((variavel) => (
          <VariableInput
            key={variavel}
            variavel={variavel}
            value={variaveisValues[variavel] || ''}
            onChange={(value) => onVariableChange(variavel, value)}
            suggestions={getVariavelSuggestions(variavel)}
          />
        ))}
      </CardContent>
    </Card>
  );
};
