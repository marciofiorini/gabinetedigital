
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BackupData {
  timestamp: string;
  user_id: string;
  contatos: any[];
  leads: any[];
  demandas: any[];
  eventos: any[];
  lideres: any[];
  profile: any;
  settings: any;
}

export const useBackupSystem = () => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const { user, profile, settings } = useAuth();

  const createBackup = async (): Promise<void> => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    try {
      setIsBackingUp(true);
      console.log('Iniciando backup para usuário:', user.id);

      // Buscar todos os dados do usuário
      const [contatos, leads, demandas, eventos, lideres] = await Promise.all([
        supabase.from('contatos').select('*').eq('user_id', user.id),
        supabase.from('leads').select('*').eq('user_id', user.id),
        supabase.from('demandas').select('*').eq('user_id', user.id),
        supabase.from('eventos').select('*').eq('user_id', user.id),
        supabase.from('lideres').select('*').eq('user_id', user.id)
      ]);

      const backupData: BackupData = {
        timestamp: new Date().toISOString(),
        user_id: user.id,
        contatos: contatos.data || [],
        leads: leads.data || [],
        demandas: demandas.data || [],
        eventos: eventos.data || [],
        lideres: lideres.data || [],
        profile: profile,
        settings: settings
      };

      // Salvar no localStorage
      const backupKey = `backup_${user.id}_${Date.now()}`;
      localStorage.setItem(backupKey, JSON.stringify(backupData));

      // Manter apenas os últimos 5 backups
      const allBackups = Object.keys(localStorage)
        .filter(key => key.startsWith(`backup_${user.id}_`))
        .sort()
        .reverse();

      if (allBackups.length > 5) {
        allBackups.slice(5).forEach(key => localStorage.removeItem(key));
      }

      // Também fazer download do arquivo
      downloadBackup(backupData);

      toast.success('Backup criado com sucesso!');
      console.log('Backup criado:', backupKey);

    } catch (error) {
      console.error('Erro ao criar backup:', error);
      toast.error('Erro ao criar backup');
    } finally {
      setIsBackingUp(false);
    }
  };

  const downloadBackup = (backupData: BackupData): void => {
    const dataStr = JSON.stringify(backupData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const restoreFromFile = async (file: File): Promise<void> => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    try {
      setIsRestoring(true);
      console.log('Iniciando restauração do arquivo:', file.name);

      const fileContent = await file.text();
      const backupData: BackupData = JSON.parse(fileContent);

      // Validar se o backup é do usuário atual
      if (backupData.user_id !== user.id) {
        toast.error('Este backup não pertence ao usuário atual');
        return;
      }

      await restoreData(backupData);
      toast.success('Dados restaurados com sucesso!');

    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      toast.error('Erro ao restaurar backup');
    } finally {
      setIsRestoring(false);
    }
  };

  const restoreFromLocal = async (backupKey: string): Promise<void> => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    try {
      setIsRestoring(true);
      console.log('Restaurando backup local:', backupKey);

      const backupStr = localStorage.getItem(backupKey);
      if (!backupStr) {
        toast.error('Backup não encontrado');
        return;
      }

      const backupData: BackupData = JSON.parse(backupStr);
      await restoreData(backupData);
      toast.success('Dados restaurados com sucesso!');

    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      toast.error('Erro ao restaurar backup');
    } finally {
      setIsRestoring(false);
    }
  };

  const restoreData = async (backupData: BackupData): Promise<void> => {
    // Limpar dados existentes (opcional - pode fazer merge ao invés)
    // await Promise.all([
    //   supabase.from('contatos').delete().eq('user_id', user.id),
    //   supabase.from('leads').delete().eq('user_id', user.id),
    //   supabase.from('demandas').delete().eq('user_id', user.id),
    //   supabase.from('eventos').delete().eq('user_id', user.id),
    //   supabase.from('lideres').delete().eq('user_id', user.id)
    // ]);

    // Restaurar dados
    const restorePromises = [];

    if (backupData.contatos.length > 0) {
      restorePromises.push(
        supabase.from('contatos').upsert(backupData.contatos)
      );
    }

    if (backupData.leads.length > 0) {
      restorePromises.push(
        supabase.from('leads').upsert(backupData.leads)
      );
    }

    if (backupData.demandas.length > 0) {
      restorePromises.push(
        supabase.from('demandas').upsert(backupData.demandas)
      );
    }

    if (backupData.eventos.length > 0) {
      restorePromises.push(
        supabase.from('eventos').upsert(backupData.eventos)
      );
    }

    if (backupData.lideres.length > 0) {
      restorePromises.push(
        supabase.from('lideres').upsert(backupData.lideres)
      );
    }

    await Promise.all(restorePromises);
    console.log('Todos os dados foram restaurados');
  };

  const getLocalBackups = (): Array<{ key: string; timestamp: string; size: string }> => {
    if (!user) return [];

    return Object.keys(localStorage)
      .filter(key => key.startsWith(`backup_${user.id}_`))
      .map(key => {
        const backupStr = localStorage.getItem(key) || '';
        const backup = JSON.parse(backupStr);
        return {
          key,
          timestamp: backup.timestamp,
          size: `${Math.round(backupStr.length / 1024)} KB`
        };
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const deleteLocalBackup = (backupKey: string): void => {
    localStorage.removeItem(backupKey);
    toast.success('Backup excluído');
  };

  return {
    createBackup,
    restoreFromFile,
    restoreFromLocal,
    deleteLocalBackup,
    getLocalBackups,
    isBackingUp,
    isRestoring
  };
};
