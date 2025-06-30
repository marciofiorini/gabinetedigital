
import React, { useState } from 'react';
import { SecurityUtils } from '@/utils/security';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';

interface SecureFormProps {
  onSubmit: (data: any) => void;
  fields: Array<{
    name: string;
    type: 'text' | 'email' | 'password' | 'phone' | 'url';
    label: string;
    required?: boolean;
    placeholder?: string;
  }>;
  submitLabel?: string;
  className?: string;
}

export const SecureForm: React.FC<SecureFormProps> = ({
  onSubmit,
  fields,
  submitLabel = 'Enviar',
  className = ''
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [warnings, setWarnings] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const validateField = (name: string, value: string, type: string) => {
    const sanitizedValue = SecurityUtils.sanitizeInput(value);
    const validation = SecurityUtils.validateInput(sanitizedValue, type as any);
    
    setErrors(prev => ({
      ...prev,
      [name]: validation.errors
    }));
    
    setWarnings(prev => ({
      ...prev,
      [name]: validation.warnings
    }));
    
    return validation.isValid;
  };

  const handleChange = (name: string, value: string, type: string) => {
    const sanitizedValue = SecurityUtils.sanitizeInput(value);
    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    validateField(name, value, type);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate all fields
      let isValid = true;
      const newErrors: Record<string, string[]> = {};

      fields.forEach(field => {
        const value = formData[field.name] || '';
        
        if (field.required && !value.trim()) {
          newErrors[field.name] = ['Campo obrigatório'];
          isValid = false;
          return;
        }

        if (value.trim()) {
          const validation = SecurityUtils.validateInput(value, field.type);
          if (!validation.isValid) {
            newErrors[field.name] = validation.errors;
            isValid = false;
          }
        }
      });

      setErrors(newErrors);

      if (!isValid) {
        toast({
          title: 'Erro de Validação',
          description: 'Por favor, corrija os erros no formulário',
          variant: 'destructive',
        });
        return;
      }

      // Submit sanitized data
      const sanitizedData: Record<string, string> = {};
      Object.keys(formData).forEach(key => {
        sanitizedData[key] = SecurityUtils.sanitizeInput(formData[key]);
      });

      await onSubmit(sanitizedData);
      
      // Reset form on success
      setFormData({});
      setErrors({});
      setWarnings({});
      
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao enviar formulário. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-4 h-4 text-green-600" />
        <span className="text-sm text-gray-600">Formulário Seguro</span>
      </div>

      {fields.map(field => (
        <div key={field.name} className="space-y-2">
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          <Input
            id={field.name}
            type={field.type === 'password' ? 'password' : 'text'}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value, field.type)}
            placeholder={field.placeholder}
            className={errors[field.name]?.length ? 'border-red-500' : ''}
            disabled={isSubmitting}
          />
          
          {errors[field.name]?.length > 0 && (
            <Alert variant="destructive" className="py-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {errors[field.name].map((error, index) => (
                    <li key={index} className="text-sm">{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          
          {warnings[field.name]?.length > 0 && (
            <Alert className="py-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {warnings[field.name].map((warning, index) => (
                    <li key={index} className="text-sm text-yellow-700">{warning}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>
      ))}

      <Button 
        type="submit" 
        disabled={isSubmitting || Object.values(errors).some(err => err.length > 0)}
        className="w-full"
      >
        {isSubmitting ? 'Enviando...' : submitLabel}
      </Button>
    </form>
  );
};
