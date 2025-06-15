
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useBackupSystem } from '@/hooks/useBackupSystem';
import { 
  Download, 
  Upload, 
  HardDrive, 
  Trash2, 
  AlertCircle,
  Database
} from 'lucide-react';

export const BackupManager = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const {
    createBackup,
    restoreFromFile,
    restoreFromLocal,
    deleteLocalBackup,
    getLocalBackups,
    isBackingUp,
    isRestoring
  } = useBackupSystem();

  const localBackups = getLocalBackups();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRestoreFromFile = async () => {
    if (selectedFile) {
      await restoreFromFile(selectedFile);
      setSelectedFile(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Criar Backup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Criar Backup
          </CardTitle>
          <CardDescription>
            Faça backup de todos os seus dados para download e armazenamento local
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              O backup incluirá: contatos, leads, demandas, eventos, líderes, perfil e configurações.
            </AlertDescription>
          </Alert>
          
          <Button 
            onClick={createBackup} 
            disabled={isBackingUp}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {isBackingUp ? 'Criando Backup...' : 'Criar Backup'}
          </Button>
        </CardContent>
      </Card>

      {/* Restaurar de Arquivo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Restaurar de Arquivo
          </CardTitle>
          <CardDescription>
            Carregue um arquivo de backup para restaurar seus dados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="backup-file">Selecionar arquivo de backup</Label>
            <Input
              id="backup-file"
              type="file"
              accept=".json"
              onChange={handleFileChange}
            />
          </div>
          
          {selectedFile && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm">
                <strong>Arquivo selecionado:</strong> {selectedFile.name}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Tamanho:</strong> {Math.round(selectedFile.size / 1024)} KB
              </p>
            </div>
          )}

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              A restauração substituirá os dados existentes. Considere fazer um backup antes.
            </AlertDescription>
          </Alert>
          
          <Button 
            onClick={handleRestoreFromFile}
            disabled={!selectedFile || isRestoring}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {isRestoring ? 'Restaurando...' : 'Restaurar Dados'}
          </Button>
        </CardContent>
      </Card>

      {/* Backups Locais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            Backups Locais ({localBackups.length})
          </CardTitle>
          <CardDescription>
            Backups armazenados localmente no seu navegador
          </CardDescription>
        </CardHeader>
        <CardContent>
          {localBackups.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Nenhum backup local encontrado
            </p>
          ) : (
            <div className="space-y-3">
              {localBackups.map((backup) => (
                <div
                  key={backup.key}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {formatDate(backup.timestamp)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Tamanho: {backup.size}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => restoreFromLocal(backup.key)}
                      disabled={isRestoring}
                      size="sm"
                      variant="outline"
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Restaurar
                    </Button>
                    <Button
                      onClick={() => deleteLocalBackup(backup.key)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
