
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, AlertCircle, Shield } from "lucide-react";
import { useSecureCSVUpload } from "@/hooks/useSecureCSVUpload";

export const SecureUploadCSVContatos = () => {
  const [file, setFile] = useState<File | null>(null);
  const { uploadContatos, loading } = useSecureCSVUpload();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      await uploadContatos(file);
      setFile(null);
      const input = document.getElementById('csv-contatos-secure') as HTMLInputElement;
      if (input) input.value = '';
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-600" />
          Upload Seguro CSV de Contatos
        </CardTitle>
        <CardDescription>
          Importe contatos com validação e sanitização automática
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <div>
            <Label htmlFor="csv-contatos-secure" className="cursor-pointer">
              <Input
                id="csv-contatos-secure"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button variant="outline" className="mb-2">
                Selecionar arquivo CSV (máx. 10MB)
              </Button>
            </Label>
            {file && (
              <div className="mt-2 space-y-1">
                <p className="text-sm text-green-600">
                  Arquivo: {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  Tamanho: {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-start gap-2">
            <Shield className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-900">Upload Seguro</h4>
              <ul className="text-sm text-green-700 mt-1 space-y-1">
                <li>• Validação automática de dados</li>
                <li>• Proteção contra CSV injection</li>
                <li>• Sanitização de conteúdo</li>
                <li>• Limite de 1000 registros por arquivo</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900">Formato do CSV</h4>
              <p className="text-sm text-blue-700 mt-1">
                Colunas: nome, email, telefone, endereco, zona, observacoes, tags
              </p>
              <p className="text-sm text-blue-700">
                Separe múltiplas tags com ponto e vírgula (;)
              </p>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleUpload} 
          disabled={!file || loading}
          className="w-full"
        >
          {loading ? "Importando com segurança..." : "Importar Contatos"}
        </Button>
      </CardContent>
    </Card>
  );
};
