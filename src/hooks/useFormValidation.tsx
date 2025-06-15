
import { useState } from 'react';
import { z } from 'zod';

// Schemas de validação aprimorados
export const contatoSchema = z.object({
  nome: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),
  email: z.string()
    .email('Email inválido')
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || val.includes('@'), 'Email deve ser válido'),
  telefone: z.string()
    .min(10, 'Telefone deve ter pelo menos 10 dígitos')
    .max(15, 'Telefone deve ter no máximo 15 dígitos')
    .regex(/^[\d\s\(\)\-\+]+$/, 'Telefone deve conter apenas números e símbolos válidos')
    .optional()
    .or(z.literal('')),
  endereco: z.string()
    .max(200, 'Endereço deve ter no máximo 200 caracteres')
    .optional(),
  zona: z.string()
    .max(50, 'Zona deve ter no máximo 50 caracteres')
    .optional(),
  data_nascimento: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const date = new Date(val);
      const today = new Date();
      const minDate = new Date(today.getFullYear() - 120, 0, 1);
      return date <= today && date >= minDate;
    }, 'Data de nascimento inválida'),
  observacoes: z.string()
    .max(500, 'Observações devem ter no máximo 500 caracteres')
    .optional()
});

export const leadSchema = z.object({
  nome: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),
  email: z.string()
    .email('Email inválido')
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || val.includes('@'), 'Email deve ser válido'),
  telefone: z.string()
    .min(10, 'Telefone deve ter pelo menos 10 dígitos')
    .max(15, 'Telefone deve ter no máximo 15 dígitos')
    .regex(/^[\d\s\(\)\-\+]+$/, 'Telefone deve conter apenas números e símbolos válidos')
    .optional()
    .or(z.literal('')),
  status: z.enum(['novo', 'contatado', 'interesse', 'proposta', 'fechado', 'perdido']),
  fonte: z.string()
    .max(50, 'Fonte deve ter no máximo 50 caracteres')
    .optional(),
  interesse: z.string()
    .max(100, 'Interesse deve ter no máximo 100 caracteres')
    .optional(),
  observacoes: z.string()
    .max(500, 'Observações devem ter no máximo 500 caracteres')
    .optional()
});

export const demandaSchema = z.object({
  titulo: z.string()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  descricao: z.string()
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres')
    .optional(),
  categoria: z.string()
    .min(1, 'Categoria é obrigatória')
    .max(50, 'Categoria deve ter no máximo 50 caracteres'),
  prioridade: z.enum(['baixa', 'media', 'alta', 'urgente']),
  status: z.enum(['pendente', 'em_andamento', 'concluida', 'cancelada']),
  solicitante: z.string()
    .max(100, 'Solicitante deve ter no máximo 100 caracteres')
    .optional(),
  zona: z.string()
    .max(50, 'Zona deve ter no máximo 50 caracteres')
    .optional(),
  data_limite: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const date = new Date(val);
      const today = new Date();
      return date >= today;
    }, 'Data limite deve ser futura')
});

export const eventoSchema = z.object({
  titulo: z.string()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  descricao: z.string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .optional(),
  data_hora: z.string()
    .min(1, 'Data e hora são obrigatórias')
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, 'Data e hora inválidas'),
  tipo: z.enum(['reuniao', 'visita', 'audiencia', 'evento'])
});

export const profileSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),
  username: z.string()
    .min(3, 'Nome de usuário deve ter pelo menos 3 caracteres')
    .max(30, 'Nome de usuário deve ter no máximo 30 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Nome de usuário deve conter apenas letras, números e _')
    .optional()
    .or(z.literal('')),
  email: z.string()
    .email('Email inválido'),
  phone: z.string()
    .min(10, 'Telefone deve ter pelo menos 10 dígitos')
    .max(15, 'Telefone deve ter no máximo 15 dígitos')
    .regex(/^[\d\s\(\)\-\+]+$/, 'Telefone deve conter apenas números e símbolos válidos')
    .optional()
    .or(z.literal('')),
  location: z.string()
    .max(100, 'Localização deve ter no máximo 100 caracteres')
    .optional()
    .or(z.literal('')),
  bio: z.string()
    .max(300, 'Bio deve ter no máximo 300 caracteres')
    .optional()
    .or(z.literal(''))
});

export const passwordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Senha atual é obrigatória'),
  newPassword: z.string()
    .min(8, 'Nova senha deve ter pelo menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula e 1 número'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Confirmação de senha não confere',
  path: ['confirmPassword']
});

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  fieldErrors: Record<string, string[]>;
}

export const useFormValidation = <T extends Record<string, any>>(schema: z.ZodSchema<T>) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const validate = (data: T): ValidationResult => {
    try {
      schema.parse(data);
      setErrors({});
      setFieldErrors({});
      return {
        isValid: true,
        errors: {},
        fieldErrors: {}
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMap: Record<string, string> = {};
        const fieldErrorMap: Record<string, string[]> = {};
        
        error.errors.forEach((err) => {
          if (err.path[0]) {
            const field = err.path[0] as string;
            errorMap[field] = err.message;
            
            if (!fieldErrorMap[field]) {
              fieldErrorMap[field] = [];
            }
            fieldErrorMap[field].push(err.message);
          }
        });
        
        setErrors(errorMap);
        setFieldErrors(fieldErrorMap);
        
        return {
          isValid: false,
          errors: errorMap,
          fieldErrors: fieldErrorMap
        };
      }
      
      return {
        isValid: false,
        errors: { general: 'Erro de validação' },
        fieldErrors: {}
      };
    }
  };

  const validateField = (fieldName: string, value: any): string | undefined => {
    try {
      // Para schemas Zod, não podemos acessar .shape diretamente
      // Então vamos validar o objeto inteiro e pegar apenas o erro deste campo
      const testData = { [fieldName]: value } as Partial<T>;
      const result = schema.safeParse(testData);
      
      if (result.success) {
        // Remove error for this field if validation passes
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
        setFieldErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
        return undefined;
      } else {
        // Find error for this specific field
        const fieldError = result.error.errors.find(err => err.path[0] === fieldName);
        if (fieldError) {
          const message = fieldError.message;
          setErrors(prev => ({ ...prev, [fieldName]: message }));
          setFieldErrors(prev => ({ ...prev, [fieldName]: [message] }));
          return message;
        }
      }
    } catch (error) {
      const message = 'Campo inválido';
      setErrors(prev => ({ ...prev, [fieldName]: message }));
      setFieldErrors(prev => ({ ...prev, [fieldName]: [message] }));
      return message;
    }
    return undefined;
  };

  const getFieldError = (field: string): string | undefined => {
    return errors[field];
  };

  const getFieldErrors = (field: string): string[] => {
    return fieldErrors[field] || [];
  };

  const hasError = (field: string): boolean => {
    return !!errors[field];
  };

  const clearErrors = () => {
    setErrors({});
    setFieldErrors({});
  };

  const clearFieldError = (field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  return {
    validate,
    validateField,
    errors,
    fieldErrors,
    getFieldError,
    getFieldErrors,
    hasError,
    clearErrors,
    clearFieldError
  };
};
