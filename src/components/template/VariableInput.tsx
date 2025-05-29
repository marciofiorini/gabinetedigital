
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface VariableInputProps {
  variavel: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
}

export const VariableInput = ({ variavel, value, onChange, suggestions }: VariableInputProps) => {
  return (
    <div>
      <Label className="text-xs font-medium text-gray-700">
        {`{${variavel}}`}
      </Label>
      <div className="mt-1">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Digite o valor para ${variavel}`}
          className="text-sm"
        />
        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {suggestions.map((sugestao) => (
              <Badge
                key={sugestao}
                variant="outline"
                className="text-xs cursor-pointer hover:bg-gray-100"
                onClick={() => onChange(sugestao)}
              >
                {sugestao}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
