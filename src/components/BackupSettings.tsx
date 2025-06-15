
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BackupManager } from '@/components/BackupManager';
import { Database } from 'lucide-react';

export const BackupSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Sistema de Backup
        </CardTitle>
        <CardDescription>
          Gerencie backups locais dos seus dados para segurança adicional
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BackupManager />
      </CardContent>
    </Card>
  );
};
