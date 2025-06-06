
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Shield, Check, X, AlertTriangle } from 'lucide-react';

interface ValidationRule {
  name: string;
  test: (value: string) => boolean;
  message: string;
  severity: 'error' | 'warning' | 'success';
}

interface AdvancedInputValidatorProps {
  type: 'password' | 'email' | 'file';
  value: string;
  onChange: (value: string) => void;
  label: string;
  file?: File;
}

export const AdvancedInputValidator = ({ 
  type, 
  value, 
  onChange, 
  label,
  file 
}: AdvancedInputValidatorProps) => {
  const [validationResults, setValidationResults] = useState<{ rule: ValidationRule; passed: boolean }[]>([]);

  const passwordRules: ValidationRule[] = [
    {
      name: 'Comprimento',
      test: (val) => val.length >= 12,
      message: 'Pelo menos 12 caracteres',
      severity: 'error'
    },
    {
      name: 'Maiúscula',
      test: (val) => /[A-Z]/.test(val),
      message: 'Pelo menos uma letra maiúscula',
      severity: 'error'
    },
    {
      name: 'Minúscula',
      test: (val) => /[a-z]/.test(val),
      message: 'Pelo menos uma letra minúscula',
      severity: 'error'
    },
    {
      name: 'Número',
      test: (val) => /\d/.test(val),
      message: 'Pelo menos um número',
      severity: 'error'
    },
    {
      name: 'Caractere Especial',
      test: (val) => /[!@#$%^&*(),.?":{}|<>]/.test(val),
      message: 'Pelo menos um caractere especial',
      severity: 'error'
    },
    {
      name: 'Não Comum',
      test: (val) => !['password', '123456', 'admin', 'user'].includes(val.toLowerCase()),
      message: 'Não deve ser uma senha comum',
      severity: 'warning'
    },
    {
      name: 'Sem Sequências',
      test: (val) => !/123|abc|qwe/.test(val.toLowerCase()),
      message: 'Evite sequências óbvias',
      severity: 'warning'
    }
  ];

  const emailRules: ValidationRule[] = [
    {
      name: 'Formato Válido',
      test: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      message: 'Formato de email válido',
      severity: 'error'
    },
    {
      name: 'Domínio Seguro',
      test: (val) => !val.includes('temp') && !val.includes('10minutemail'),
      message: 'Evite emails temporários',
      severity: 'warning'
    }
  ];

  const validateFile = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    const results = [
      {
        rule: {
          name: 'Tipo Permitido',
          test: () => allowedTypes.includes(file.type),
          message: 'Tipo de arquivo permitido',
          severity: 'error' as const
        },
        passed: allowedTypes.includes(file.type)
      },
      {
        rule: {
          name: 'Tamanho',
          test: () => file.size <= maxSize,
          message: 'Arquivo menor que 10MB',
          severity: 'error' as const
        },
        passed: file.size <= maxSize
      },
      {
        rule: {
          name: 'Nome Seguro',
          test: () => !/[<>:"/\\|?*]/.test(file.name),
          message: 'Nome sem caracteres perigosos',
          severity: 'warning' as const
        },
        passed: !/[<>:"/\\|?*]/.test(file.name)
      }
    ];
    
    setValidationResults(results);
  };

  const validateInput = (inputValue: string) => {
    const rules = type === 'password' ? passwordRules : emailRules;
    const results = rules.map(rule => ({
      rule,
      passed: rule.test(inputValue)
    }));
    setValidationResults(results);
  };

  const handleChange = (newValue: string) => {
    onChange(newValue);
    if (type !== 'file') {
      validateInput(newValue);
    }
  };

  const calculateStrength = () => {
    if (type !== 'password') return 0;
    const passed = validationResults.filter(r => r.passed).length;
    return (passed / passwordRules.length) * 100;
  };

  const getStrengthColor = (strength: number) => {
    if (strength < 50) return 'bg-red-500';
    if (strength < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Handle file validation
  if (file && type === 'file') {
    validateFile(file);
  }

  return (
    <div className="space-y-3">
      <Label htmlFor={type}>{label}</Label>
      
      {type !== 'file' && (
        <Input
          id={type}
          type={type}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full"
        />
      )}

      {type === 'password' && value && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Força da Senha</span>
          </div>
          <Progress 
            value={calculateStrength()} 
            className={`h-2 ${getStrengthColor(calculateStrength())}`}
          />
        </div>
      )}

      {validationResults.length > 0 && (
        <div className="space-y-2">
          {validationResults.map((result, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              {result.passed ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : result.rule.severity === 'error' ? (
                <X className="w-4 h-4 text-red-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
              )}
              <span className={
                result.passed 
                  ? 'text-green-700' 
                  : result.rule.severity === 'error' 
                    ? 'text-red-700' 
                    : 'text-yellow-700'
              }>
                {result.rule.message}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
