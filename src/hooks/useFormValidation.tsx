
import { useState } from 'react';
import { z } from 'zod';

// Schemas de validação
export const contatoSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos').optional().or(z.literal('')),
  endereco: z.string().optional(),
  zona: z.string().optional(),
  data_nascimento: z.string().optional(),
  observacoes: z.string().optional()
});

export const leadSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos').optional().or(z.literal('')),
  status: z.enum(['novo', 'contatado', 'interesse', 'proposta', 'fechado', 'perdido']),
  fonte: z.string().optional(),
  interesse: z.string().optional(),
  observacoes: z.string().optional()
});

export const demandaSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  descricao: z.string().optional(),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  prioridade: z.enum(['baixa', 'media', 'alta', 'urgente']),
  status: z.enum(['pendente', 'em_andamento', 'concluida', 'cancelada']),
  solicitante: z.string().optional(),
  zona: z.string().optional(),
  data_limite: z.string().optional()
});

export const eventoSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  descricao: z.string().optional(),
  data_hora: z.string().min(1, 'Data e hora são obrigatórias'),
  tipo: z.enum(['reuniao', 'visita', 'audiencia', 'evento'])
});

export const useFormValidation = <T extends Record<string, any>>(schema: z.ZodSchema<T>) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (data: T): boolean => {
    try {
      schema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMap: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errorMap[err.path[0] as string] = err.message;
          }
        });
        setErrors(errorMap);
      }
      return false;
    }
  };

  const getFieldError = (field: string): string | undefined => {
    return errors[field];
  };

  const clearErrors = () => {
    setErrors({});
  };

  return {
    validate,
    errors,
    getFieldError,
    clearErrors
  };
};
