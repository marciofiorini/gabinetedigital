
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

// CSV validation schemas
const lideresCSVSchema = z.object({
  nome: z.string().min(2).max(100),
  email: z.string().email().optional().or(z.literal('')),
  telefone: z.string().max(20).optional().or(z.literal('')),
  zona: z.string().max(50).optional().or(z.literal('')),
  influencia: z.number().min(1).max(5).optional(),
  status: z.enum(['ativo', 'inativo']).optional(),
  observacoes: z.string().max(500).optional().or(z.literal(''))
});

const contatosCSVSchema = z.object({
  nome: z.string().min(2).max(100),
  email: z.string().email().optional().or(z.literal('')),
  telefone: z.string().max(20).optional().or(z.literal('')),
  endereco: z.string().max(200).optional().or(z.literal('')),
  zona: z.string().max(50).optional().or(z.literal('')),
  observacoes: z.string().max(500).optional().or(z.literal('')),
  tags: z.string().max(200).optional().or(z.literal(''))
});

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ['text/csv', 'application/csv'];

export const useSecureCSVUpload = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    if (!file) {
      toast({
        title: "Erro de validação",
        description: "Nenhum arquivo selecionado.",
        variant: "destructive"
      });
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 10MB.",
        variant: "destructive"
      });
      return false;
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      toast({
        title: "Formato inválido",
        description: "Apenas arquivos CSV são permitidos.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const sanitizeString = (str: string): string => {
    if (!str) return '';
    
    // Remove potential CSV injection patterns
    const cleanStr = str
      .replace(/^[=@+\-]/, '') // Remove formula starters
      .replace(/[\r\n\t]/g, ' ') // Replace line breaks with spaces
      .trim()
      .substring(0, 500); // Limit length
    
    return cleanStr;
  };

  const parseSecureCSV = (text: string): any[] => {
    const lines = text.split('\n').slice(0, 1000); // Limit to 1000 rows
    const headers = lines[0]?.split(',').map(h => h.trim().toLowerCase()) || [];
    const data = [];

    // Validate headers
    if (headers.length === 0) {
      throw new Error('Arquivo CSV vazio ou inválido');
    }

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',');
        const row: any = {};
        
        headers.forEach((header, index) => {
          const value = values[index]?.trim() || '';
          row[header] = sanitizeString(value);
        });
        
        data.push(row);
      }
    }

    return data;
  };

  const uploadLideres = async (file: File) => {
    if (!validateFile(file) || !user) return;

    setLoading(true);
    try {
      const text = await file.text();
      const csvData = parseSecureCSV(text);
      
      const validatedData = csvData.map(row => {
        try {
          const validated = lideresCSVSchema.parse({
            nome: row.nome || row.name || '',
            email: row.email || '',
            telefone: row.telefone || row.phone || row.whatsapp || '',
            zona: row.zona || row.regiao || row.region || '',
            influencia: parseInt(row.influencia || row.influence || '1') || 1,
            status: row.status || 'ativo',
            observacoes: row.observacoes || row.notes || ''
          });
          
          return {
            nome: validated.nome,
            email: validated.email || '',
            telefone: validated.telefone || '',
            zona: validated.zona || '',
            influencia: validated.influencia || 1,
            status: validated.status || 'ativo',
            observacoes: validated.observacoes || '',
            user_id: user.id
          };
        } catch (error) {
          console.warn('Linha inválida ignorada:', row, error);
          return null;
        }
      }).filter(Boolean);

      if (validatedData.length === 0) {
        throw new Error('Nenhum registro válido encontrado no arquivo');
      }

      const { error } = await supabase
        .from('lideres')
        .insert(validatedData);

      if (error) throw error;

      toast({
        title: "Upload realizado com sucesso!",
        description: `${validatedData.length} líderes foram importados.`,
      });

      return validatedData.length;
    } catch (error: any) {
      console.error('Erro no upload seguro:', error);
      toast({
        title: "Erro no upload",
        description: error.message || 'Erro desconhecido',
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const uploadContatos = async (file: File) => {
    if (!validateFile(file) || !user) return;

    setLoading(true);
    try {
      const text = await file.text();
      const csvData = parseSecureCSV(text);
      
      const validatedData = csvData.map(row => {
        try {
          const validated = contatosCSVSchema.parse({
            nome: row.nome || row.name || '',
            email: row.email || '',
            telefone: row.telefone || row.phone || row.whatsapp || '',
            endereco: row.endereco || row.address || '',
            zona: row.zona || row.regiao || row.region || '',
            observacoes: row.observacoes || row.notes || '',
            tags: row.tags || ''
          });
          
          return {
            nome: validated.nome,
            email: validated.email || '',
            telefone: validated.telefone || '',
            endereco: validated.endereco || '',
            zona: validated.zona || '',
            observacoes: validated.observacoes || '',
            tags: validated.tags ? validated.tags.split(';').filter(Boolean) : [],
            user_id: user.id
          };
        } catch (error) {
          console.warn('Linha inválida ignorada:', row, error);
          return null;
        }
      }).filter(Boolean);

      if (validatedData.length === 0) {
        throw new Error('Nenhum registro válido encontrado no arquivo');
      }

      const { error } = await supabase
        .from('contatos')
        .insert(validatedData);

      if (error) throw error;

      toast({
        title: "Upload realizado com sucesso!",
        description: `${validatedData.length} contatos foram importados.`,
      });

      return validatedData.length;
    } catch (error: any) {
      console.error('Erro no upload seguro:', error);
      toast({
        title: "Erro no upload",
        description: error.message || 'Erro desconhecido',
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadLideres,
    uploadContatos,
    loading
  };
};
