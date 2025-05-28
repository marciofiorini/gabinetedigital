
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NovoLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NovoLeadModal = ({ isOpen, onClose }: NovoLeadModalProps) => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    whatsapp: "",
    instagram: "",
    endereco: "",
    regiao: "",
    profissao: "",
    empresa: "",
    renda: "",
    escolaridade: "",
    estadoCivil: "",
    filhos: "",
    interesse: "",
    origem: "",
    observacoes: "",
    tipo: "Lead"
  });
  
  const [dataAniversario, setDataAniversario] = useState<Date>();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.nome || !formData.email || !formData.telefone) {
      toast({
        title: "Erro",
        description: "Preencha pelo menos nome, email e telefone",
        variant: "destructive",
      });
      return;
    }

    // Aqui integraria com o backend
    toast({
      title: "Lead cadastrado!",
      description: `${formData.nome} foi adicionado com sucesso`,
    });
    
    // Reset form
    setFormData({
      nome: "",
      email: "",
      telefone: "",
      whatsapp: "",
      instagram: "",
      endereco: "",
      regiao: "",
      profissao: "",
      empresa: "",
      renda: "",
      escolaridade: "",
      estadoCivil: "",
      filhos: "",
      interesse: "",
      origem: "",
      observacoes: "",
      tipo: "Lead"
    });
    setDataAniversario(undefined);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Lead/Líder</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Informações Básicas</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <Label htmlFor="tipo">Tipo *</Label>
                <Select value={formData.tipo} onValueChange={(value) => handleInputChange("tipo", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lead">Lead</SelectItem>
                    <SelectItem value="Líder">Líder</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange("telefone", e.target.value)}
                  placeholder="(21) 99999-9999"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                  placeholder="(21) 99999-9999"
                />
              </div>
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => handleInputChange("instagram", e.target.value)}
                  placeholder="@usuario"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="endereco">Endereço Completo</Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) => handleInputChange("endereco", e.target.value)}
                placeholder="Rua, número, bairro, cidade"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="regiao">Região/Zona</Label>
                <Select value={formData.regiao} onValueChange={(value) => handleInputChange("regiao", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Centro">Centro</SelectItem>
                    <SelectItem value="Zona Norte">Zona Norte</SelectItem>
                    <SelectItem value="Zona Sul">Zona Sul</SelectItem>
                    <SelectItem value="Zona Oeste">Zona Oeste</SelectItem>
                    <SelectItem value="Barra">Barra</SelectItem>
                    <SelectItem value="Baixada">Baixada</SelectItem>
                    <SelectItem value="Interior">Interior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Data de Aniversário</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {dataAniversario ? format(dataAniversario, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dataAniversario}
                      onSelect={setDataAniversario}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Informações Profissionais e Demográficas */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Informações Profissionais</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="profissao">Profissão</Label>
                <Input
                  id="profissao"
                  value={formData.profissao}
                  onChange={(e) => handleInputChange("profissao", e.target.value)}
                  placeholder="Ex: Enfermeira"
                />
              </div>
              <div>
                <Label htmlFor="empresa">Empresa/Local de Trabalho</Label>
                <Input
                  id="empresa"
                  value={formData.empresa}
                  onChange={(e) => handleInputChange("empresa", e.target.value)}
                  placeholder="Ex: Hospital Municipal"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="renda">Faixa de Renda</Label>
                <Select value={formData.renda} onValueChange={(value) => handleInputChange("renda", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Até 1 SM">Até 1 Salário Mínimo</SelectItem>
                    <SelectItem value="1-3 SM">1 a 3 Salários Mínimos</SelectItem>
                    <SelectItem value="3-5 SM">3 a 5 Salários Mínimos</SelectItem>
                    <SelectItem value="5-10 SM">5 a 10 Salários Mínimos</SelectItem>
                    <SelectItem value="10+ SM">Mais de 10 Salários Mínimos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="escolaridade">Escolaridade</Label>
                <Select value={formData.escolaridade} onValueChange={(value) => handleInputChange("escolaridade", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fundamental">Ensino Fundamental</SelectItem>
                    <SelectItem value="Médio">Ensino Médio</SelectItem>
                    <SelectItem value="Superior">Ensino Superior</SelectItem>
                    <SelectItem value="Pós">Pós-graduação</SelectItem>
                    <SelectItem value="Mestrado">Mestrado</SelectItem>
                    <SelectItem value="Doutorado">Doutorado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="estadoCivil">Estado Civil</Label>
                <Select value={formData.estadoCivil} onValueChange={(value) => handleInputChange("estadoCivil", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Solteiro">Solteiro(a)</SelectItem>
                    <SelectItem value="Casado">Casado(a)</SelectItem>
                    <SelectItem value="União Estável">União Estável</SelectItem>
                    <SelectItem value="Divorciado">Divorciado(a)</SelectItem>
                    <SelectItem value="Viúvo">Viúvo(a)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="filhos">Número de Filhos</Label>
                <Select value={formData.filhos} onValueChange={(value) => handleInputChange("filhos", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Nenhum</SelectItem>
                    <SelectItem value="1">1 filho</SelectItem>
                    <SelectItem value="2">2 filhos</SelectItem>
                    <SelectItem value="3">3 filhos</SelectItem>
                    <SelectItem value="4+">4 ou mais</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <h3 className="font-semibold text-lg border-b pb-2 mt-6">Informações Políticas</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="interesse">Interesse Principal</Label>
                <Select value={formData.interesse} onValueChange={(value) => handleInputChange("interesse", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Saúde Pública">Saúde Pública</SelectItem>
                    <SelectItem value="Educação">Educação</SelectItem>
                    <SelectItem value="Infraestrutura">Infraestrutura</SelectItem>
                    <SelectItem value="Segurança">Segurança</SelectItem>
                    <SelectItem value="Meio Ambiente">Meio Ambiente</SelectItem>
                    <SelectItem value="Economia">Economia</SelectItem>
                    <SelectItem value="Assistência Social">Assistência Social</SelectItem>
                    <SelectItem value="Cultura">Cultura</SelectItem>
                    <SelectItem value="Esporte">Esporte</SelectItem>
                    <SelectItem value="Mobilidade">Mobilidade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="origem">Origem do Lead</Label>
                <Select value={formData.origem} onValueChange={(value) => handleInputChange("origem", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Evento">Evento</SelectItem>
                    <SelectItem value="Indicação">Indicação</SelectItem>
                    <SelectItem value="Abordagem Direta">Abordagem Direta</SelectItem>
                    <SelectItem value="Mídia">Mídia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => handleInputChange("observacoes", e.target.value)}
                placeholder="Anotações importantes sobre o lead..."
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
            <Save className="w-4 h-4 mr-2" />
            Salvar Lead
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
