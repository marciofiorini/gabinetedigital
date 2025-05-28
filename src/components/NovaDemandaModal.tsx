
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Mic, MapPin, Upload, X, Save } from "lucide-react";

interface NovaDemandaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NovaDemandaModal = ({ isOpen, onClose }: NovaDemandaModalProps) => {
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    categoria: "",
    prioridade: "",
    endereco: "",
    cep: "",
    bairro: "",
    cidade: "",
    cidadao: "",
    telefone: "",
    email: "",
    observacoes: ""
  });

  const [anexos, setAnexos] = useState<{
    fotos: File[];
    audios: File[];
    documentos: File[];
  }>({
    fotos: [],
    audios: [],
    documentos: []
  });

  const [localizacao, setLocalizacao] = useState<{
    latitude?: number;
    longitude?: number;
  }>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (type: 'fotos' | 'audios' | 'documentos', files: FileList) => {
    setAnexos(prev => ({
      ...prev,
      [type]: [...prev[type], ...Array.from(files)]
    }));
  };

  const removeFile = (type: 'fotos' | 'audios' | 'documentos', index: number) => {
    setAnexos(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const obterLocalizacao = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocalizacao({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error("Erro ao obter localização:", error);
        }
      );
    }
  };

  const handleSubmit = () => {
    // Aqui implementaria a lógica de salvamento
    console.log("Dados da demanda:", formData);
    console.log("Anexos:", anexos);
    console.log("Localização:", localizacao);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Nova Demanda Popular
          </DialogTitle>
          <DialogDescription>
            Registre uma nova demanda da sua base eleitoral
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações Básicas */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Informações da Demanda</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="titulo">Título da Demanda *</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => handleInputChange('titulo', e.target.value)}
                    placeholder="Ex: Iluminação pública na Rua das Flores"
                  />
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição Detalhada *</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => handleInputChange('descricao', e.target.value)}
                    placeholder="Descreva detalhadamente a demanda..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="categoria">Categoria *</Label>
                    <Select value={formData.categoria} onValueChange={(value) => handleInputChange('categoria', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="infraestrutura">Infraestrutura</SelectItem>
                        <SelectItem value="saude">Saúde</SelectItem>
                        <SelectItem value="educacao">Educação</SelectItem>
                        <SelectItem value="seguranca">Segurança</SelectItem>
                        <SelectItem value="transporte">Transporte</SelectItem>
                        <SelectItem value="meio-ambiente">Meio Ambiente</SelectItem>
                        <SelectItem value="social">Assistência Social</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="prioridade">Prioridade *</Label>
                    <Select value={formData.prioridade} onValueChange={(value) => handleInputChange('prioridade', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critica">Crítica</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="baixa">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="observacoes">Observações Adicionais</Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => handleInputChange('observacoes', e.target.value)}
                    placeholder="Informações adicionais sobre a demanda..."
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Localização e Cidadão */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Localização e Contato</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="endereco">Endereço Completo *</Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => handleInputChange('endereco', e.target.value)}
                    placeholder="Rua, número, complemento..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      value={formData.cep}
                      onChange={(e) => handleInputChange('cep', e.target.value)}
                      placeholder="00000-000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bairro">Bairro</Label>
                    <Input
                      id="bairro"
                      value={formData.bairro}
                      onChange={(e) => handleInputChange('bairro', e.target.value)}
                      placeholder="Nome do bairro"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) => handleInputChange('cidade', e.target.value)}
                    placeholder="Nome da cidade"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={obterLocalizacao}
                    className="flex-1"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Obter Localização GPS
                  </Button>
                  {localizacao.latitude && (
                    <Badge variant="outline" className="px-3 py-1">
                      GPS Obtido
                    </Badge>
                  )}
                </div>

                <hr className="my-4" />

                <h4 className="font-medium">Dados do Cidadão</h4>
                
                <div>
                  <Label htmlFor="cidadao">Nome do Solicitante *</Label>
                  <Input
                    id="cidadao"
                    value={formData.cidadao}
                    onChange={(e) => handleInputChange('cidadao', e.target.value)}
                    placeholder="Nome completo"
                  />
                </div>

                <div>
                  <Label htmlFor="telefone">Telefone/WhatsApp</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Anexos */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">Anexos e Evidências</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Upload de Fotos */}
              <div>
                <Label>Fotos</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handleFileUpload('fotos', e.target.files)}
                    className="hidden"
                    id="fotos-upload"
                  />
                  <label htmlFor="fotos-upload" className="cursor-pointer">
                    <span className="text-sm text-gray-600">Clique para adicionar fotos</span>
                  </label>
                </div>
                
                {anexos.fotos.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {anexos.fotos.map((file, index) => (
                      <div key={index} className="flex items-center justify-between text-xs bg-gray-100 p-2 rounded">
                        <span className="truncate">{file.name}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFile('fotos', index)}
                          className="h-4 w-4 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upload de Áudios */}
              <div>
                <Label>Áudios</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Mic className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <input
                    type="file"
                    multiple
                    accept="audio/*"
                    onChange={(e) => e.target.files && handleFileUpload('audios', e.target.files)}
                    className="hidden"
                    id="audios-upload"
                  />
                  <label htmlFor="audios-upload" className="cursor-pointer">
                    <span className="text-sm text-gray-600">Clique para adicionar áudios</span>
                  </label>
                </div>
                
                {anexos.audios.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {anexos.audios.map((file, index) => (
                      <div key={index} className="flex items-center justify-between text-xs bg-gray-100 p-2 rounded">
                        <span className="truncate">{file.name}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFile('audios', index)}
                          className="h-4 w-4 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upload de Documentos */}
              <div>
                <Label>Documentos</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => e.target.files && handleFileUpload('documentos', e.target.files)}
                    className="hidden"
                    id="documentos-upload"
                  />
                  <label htmlFor="documentos-upload" className="cursor-pointer">
                    <span className="text-sm text-gray-600">Clique para adicionar documentos</span>
                  </label>
                </div>
                
                {anexos.documentos.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {anexos.documentos.map((file, index) => (
                      <div key={index} className="flex items-center justify-between text-xs bg-gray-100 p-2 rounded">
                        <span className="truncate">{file.name}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFile('documentos', index)}
                          className="h-4 w-4 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Save className="w-4 h-4 mr-2" />
            Salvar Demanda
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
