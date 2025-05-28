
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const UploadCSVContatos = () => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    } else {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione um arquivo CSV.",
        variant: "destructive"
      });
    }
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',');
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index]?.trim() || '';
        });
        data.push(row);
      }
    }
    return data;
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    setLoading(true);
    try {
      const text = await file.text();
      const csvData = parseCSV(text);
      
      const contatos = csvData.map((row: any) => ({
        user_id: user.id,
        nome: row.nome || row.name || '',
        email: row.email || '',
        telefone: row.telefone || row.phone || row.whatsapp || '',
        endereco: row.endereco || row.address || '',
        zona: row.zona || row.regiao || row.region || '',
        observacoes: row.observacoes || row.notes || '',
        tags: row.tags ? row.tags.split(';').filter(Boolean) : []
      })).filter(contato => contato.nome);

      const { error } = await supabase
        .from('contatos')
        .insert(contatos);

      if (error) throw error;

      toast({
        title: "Upload realizado com sucesso!",
        description: `${contatos.length} contatos foram importados.`,
      });

      setFile(null);
      const input = document.getElementById('csv-contatos') as HTMLInputElement;
      if (input) input.value = '';
    } catch (error: any) {
      toast({
        title: "Erro no upload",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload CSV de Contatos
        </CardTitle>
        <CardDescription>
          Importe contatos em massa através de arquivo CSV
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <div>
            <Label htmlFor="csv-contatos" className="cursor-pointer">
              <Input
                id="csv-contatos"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button variant="outline" className="mb-2">
                Selecionar arquivo CSV
              </Button>
            </Label>
            {file && (
              <p className="text-sm text-green-600 mt-2">
                Arquivo selecionado: {file.name}
              </p>
            )}
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900">Formato do CSV</h4>
              <p className="text-sm text-blue-700 mt-1">
                O arquivo deve conter as colunas: nome, email, telefone, endereco, zona, observacoes, tags
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
          {loading ? "Importando..." : "Importar Contatos"}
        </Button>
      </CardContent>
    </Card>
  );
};
