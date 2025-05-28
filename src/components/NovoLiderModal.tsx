
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Save, Calendar as CalendarIcon, Plus, X, Crown, Users, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface NovoLiderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NovoLiderModal = ({ isOpen, onClose }: NovoLiderModalProps) => {
  const [formData, setFormData] = useState({
    // Dados Pessoais
    nome: "",
    sobrenome: "",
    apelido: "",
    cpf: "",
    rg: "",
    dataNascimento: undefined as Date | undefined,
    estadoCivil: "",
    profissao: "",
    
    // Contato
    telefone: "",
    whatsapp: "",
    email: "",
    instagram: "",
    facebook: "",
    
    // Endereço
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    
    // Informações Políticas
    categoria: "",
    cargo: "",
    organizacao: "",
    nivelInfluencia: "",
    areaAtuacao: "",
    tempoAtuacao: "",
    
    // Rede e Alcance
    seguidores: "",
    gruposWhatsapp: "",
    gruposLiderados: "",
    eventosOrganizados: "",
    
    // Configurações
    ativo: true,
    receberMensagens: true,
    aniversario: true,
    
    // Observações
    observacoes: "",
    interesses: [] as string[],
    habilidades: [] as string[]
  });

  const [novoInteresse, setNovoInteresse] = useState("");
  const [novaHabilidade, setNovaHabilidade] = useState("");

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const adicionarInteresse = () => {
    if (novoInteresse.trim()) {
      setFormData(prev => ({
        ...prev,
        interesses: [...prev.interesses, novoInteresse.trim()]
      }));
      setNovoInteresse("");
    }
  };

  const removerInteresse = (index: number) => {
    setFormData(prev => ({
      ...prev,
      interesses: prev.interesses.filter((_, i) => i !== index)
    }));
  };

  const adicionarHabilidade = () => {
    if (novaHabilidade.trim()) {
      setFormData(prev => ({
        ...prev,
        habilidades: [...prev.habilidades, novaHabilidade.trim()]
      }));
      setNovaHabilidade("");
    }
  };

  const removerHabilidade = (index: number) => {
    setFormData(prev => ({
      ...prev,
      habilidades: prev.habilidades.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    console.log("Dados do líder:", formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            <Crown className="w-6 h-6 text-green-600" />
            Novo Líder da Base Eleitoral
          </DialogTitle>
          <DialogDescription>
            Cadastre um novo líder com informações completas para fortalecer sua rede política
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dados Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Dados Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    placeholder="Nome"
                  />
                </div>
                <div>
                  <Label htmlFor="sobrenome">Sobrenome *</Label>
                  <Input
                    id="sobrenome"
                    value={formData.sobrenome}
                    onChange={(e) => handleInputChange('sobrenome', e.target.value)}
                    placeholder="Sobrenome"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="apelido">Como é conhecido(a)</Label>
                <Input
                  id="apelido"
                  value={formData.apelido}
                  onChange={(e) => handleInputChange('apelido', e.target.value)}
                  placeholder="Apelido ou nome popular"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange('cpf', e.target.value)}
                    placeholder="000.000.000-00"
                  />
                </div>
                <div>
                  <Label htmlFor="rg">RG</Label>
                  <Input
                    id="rg"
                    value={formData.rg}
                    onChange={(e) => handleInputChange('rg', e.target.value)}
                    placeholder="00.000.000-0"
                  />
                </div>
              </div>

              <div>
                <Label>Data de Nascimento</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.dataNascimento && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dataNascimento ? format(formData.dataNascimento, "dd/MM/yyyy") : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.dataNascimento}
                      onSelect={(date) => handleInputChange('dataNascimento', date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="estadoCivil">Estado Civil</Label>
                <Select value={formData.estadoCivil} onValueChange={(value) => handleInputChange('estadoCivil', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                    <SelectItem value="casado">Casado(a)</SelectItem>
                    <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                    <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                    <SelectItem value="uniao-estavel">União Estável</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="profissao">Profissão</Label>
                <Input
                  id="profissao"
                  value={formData.profissao}
                  onChange={(e) => handleInputChange('profissao', e.target.value)}
                  placeholder="Profissão principal"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contato e Endereço */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                Contato e Endereço
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formData.instagram}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                    placeholder="@usuario"
                  />
                </div>
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={formData.facebook}
                    onChange={(e) => handleInputChange('facebook', e.target.value)}
                    placeholder="Facebook"
                  />
                </div>
              </div>

              <hr className="my-4" />

              <div>
                <Label htmlFor="endereco">Endereço *</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => handleInputChange('endereco', e.target.value)}
                  placeholder="Nome da rua"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="numero">Número</Label>
                  <Input
                    id="numero"
                    value={formData.numero}
                    onChange={(e) => handleInputChange('numero', e.target.value)}
                    placeholder="123"
                  />
                </div>
                <div>
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input
                    id="complemento"
                    value={formData.complemento}
                    onChange={(e) => handleInputChange('complemento', e.target.value)}
                    placeholder="Apto 45"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bairro">Bairro *</Label>
                <Input
                  id="bairro"
                  value={formData.bairro}
                  onChange={(e) => handleInputChange('bairro', e.target.value)}
                  placeholder="Nome do bairro"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="cidade">Cidade *</Label>
                  <Input
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) => handleInputChange('cidade', e.target.value)}
                    placeholder="Nome da cidade"
                  />
                </div>
                <div>
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    value={formData.cep}
                    onChange={(e) => handleInputChange('cep', e.target.value)}
                    placeholder="00000-000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações Políticas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Crown className="w-5 h-5 text-purple-600" />
                Perfil Político
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="categoria">Categoria *</Label>
                <Select value={formData.categoria} onValueChange={(value) => handleInputChange('categoria', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lider-comunitario">Líder Comunitário</SelectItem>
                    <SelectItem value="presidente-associacao">Presidente de Associação</SelectItem>
                    <SelectItem value="sindicalista">Sindicalista</SelectItem>
                    <SelectItem value="religioso">Líder Religioso</SelectItem>
                    <SelectItem value="empresario">Empresário Local</SelectItem>
                    <SelectItem value="educador">Educador/Professor</SelectItem>
                    <SelectItem value="influenciador">Influenciador Digital</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="cargo">Cargo/Função</Label>
                <Input
                  id="cargo"
                  value={formData.cargo}
                  onChange={(e) => handleInputChange('cargo', e.target.value)}
                  placeholder="Ex: Presidente da Associação"
                />
              </div>

              <div>
                <Label htmlFor="organizacao">Organização</Label>
                <Input
                  id="organizacao"
                  value={formData.organizacao}
                  onChange={(e) => handleInputChange('organizacao', e.target.value)}
                  placeholder="Nome da organização"
                />
              </div>

              <div>
                <Label htmlFor="nivelInfluencia">Nível de Influência</Label>
                <Select value={formData.nivelInfluencia} onValueChange={(value) => handleInputChange('nivelInfluencia', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="muito-alta">Muito Alta</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="baixa">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="areaAtuacao">Área de Atuação</Label>
                <Input
                  id="areaAtuacao"
                  value={formData.areaAtuacao}
                  onChange={(e) => handleInputChange('areaAtuacao', e.target.value)}
                  placeholder="Ex: Zona Sul, Centro"
                />
              </div>

              <div>
                <Label htmlFor="tempoAtuacao">Tempo de Atuação</Label>
                <Select value={formData.tempoAtuacao} onValueChange={(value) => handleInputChange('tempoAtuacao', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="menos-1-ano">Menos de 1 ano</SelectItem>
                    <SelectItem value="1-3-anos">1 a 3 anos</SelectItem>
                    <SelectItem value="3-5-anos">3 a 5 anos</SelectItem>
                    <SelectItem value="5-10-anos">5 a 10 anos</SelectItem>
                    <SelectItem value="mais-10-anos">Mais de 10 anos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <hr className="my-4" />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="seguidores">Seguidores</Label>
                  <Input
                    id="seguidores"
                    type="number"
                    value={formData.seguidores}
                    onChange={(e) => handleInputChange('seguidores', e.target.value)}
                    placeholder="1000"
                  />
                </div>
                <div>
                  <Label htmlFor="gruposWhatsapp">Grupos WhatsApp</Label>
                  <Input
                    id="gruposWhatsapp"
                    type="number"
                    value={formData.gruposWhatsapp}
                    onChange={(e) => handleInputChange('gruposWhatsapp', e.target.value)}
                    placeholder="5"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="ativo">Líder Ativo</Label>
                  <Switch
                    id="ativo"
                    checked={formData.ativo}
                    onCheckedChange={(checked) => handleInputChange('ativo', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="receberMensagens">Receber Mensagens</Label>
                  <Switch
                    id="receberMensagens"
                    checked={formData.receberMensagens}
                    onCheckedChange={(checked) => handleInputChange('receberMensagens', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="aniversario">Mensagem de Aniversário</Label>
                  <Switch
                    id="aniversario"
                    checked={formData.aniversario}
                    onCheckedChange={(checked) => handleInputChange('aniversario', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interesses e Habilidades */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Interesses Políticos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-3">
                <Input
                  value={novoInteresse}
                  onChange={(e) => setNovoInteresse(e.target.value)}
                  placeholder="Ex: Saúde Pública"
                  onKeyPress={(e) => e.key === 'Enter' && adicionarInteresse()}
                />
                <Button onClick={adicionarInteresse} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.interesses.map((interesse, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {interesse}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removerInteresse(index)}
                      className="h-4 w-4 p-0 hover:bg-red-100"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Habilidades e Especialidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-3">
                <Input
                  value={novaHabilidade}
                  onChange={(e) => setNovaHabilidade(e.target.value)}
                  placeholder="Ex: Organização de Eventos"
                  onKeyPress={(e) => e.key === 'Enter' && adicionarHabilidade()}
                />
                <Button onClick={adicionarHabilidade} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.habilidades.map((habilidade, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {habilidade}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removerHabilidade(index)}
                      className="h-4 w-4 p-0 hover:bg-red-100"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Observações */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Observações Adicionais</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.observacoes}
              onChange={(e) => handleInputChange('observacoes', e.target.value)}
              placeholder="Informações adicionais sobre o líder, histórico de relacionamento, preferências, etc."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Cadastrar Líder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
