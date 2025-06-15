
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';
import { useSecurityValidation } from '@/hooks/useSecurityValidation';

interface SecureInputProps {
  id: string;
  label: string;
  type: 'email' | 'text' | 'password';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  className?: string;
}

export const SecureInput: React.FC<SecureInputProps> = ({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
  className
}) => {
  const [validation, setValidation] = useState({ isValid: true, errors: [], warnings: [] });
  const { validateInput, sanitizeInput } = useSecurityValidation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const sanitizedValue = sanitizeInput(rawValue);
    const validationResult = validateInput(sanitizedValue, type);
    
    setValidation(validationResult);
    onChange(sanitizedValue);
  };

  useEffect(() => {
    if (value) {
      const validationResult = validateInput(value, type);
      setValidation(validationResult);
    }
  }, [value, type, validateInput]);

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-green-600" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      
      <Input
        id={id}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className={`${className} ${!validation.isValid ? 'border-red-500' : ''}`}
      />
      
      {validation.errors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside">
              {validation.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      {validation.warnings.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside">
              {validation.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

interface SecureFormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

export const SecureForm: React.FC<SecureFormProps> = ({
  children,
  onSubmit,
  className
}) => {
  const { logSecurityEvent } = useSecurityValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await logSecurityEvent('form_submission', { 
      form_type: 'secure_form',
      timestamp: new Date().toISOString()
    });
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
};
