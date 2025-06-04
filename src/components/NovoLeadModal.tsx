
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { HelpTooltip } from '@/components/HelpTooltip';

interface NovoLeadModalProps {
  onLeadAdded?: (lead: any) => void;
}

export const NovoLeadModal = ({ onLeadAdded }: NovoLeadModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    regiao: '',
    interesse: '',
    observacoes: '',
    score: 50
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aqui você adicionaria a lógica para salvar o lead
    console.log('Dados do novo lead:', formData);
    
    if (onLeadAdded) {
      onLeadAdded({
        ...formData,
        id: Date.now(),
        ultimoContato: new Date().toISOString().split('T')[0],
        tags: []
      });
    }

    toast({
      title: "Lead adicionado",
      description: "O novo lead foi adicionado com sucesso.",
    });

    setFormData({
      nome: '',
      email: '',
      telefone: '',
      regiao: '',
      interesse: '',
      observacoes: '',
      score: 50
    });
    setOpen(false);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Novo Lead
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Lead</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo lead. Todos os campos marcados com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="nome">Nome *</Label>
                <HelpTooltip content="Nome completo da pessoa que demonstrou interesse" />
              </div>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                placeholder="Digite o nome completo"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="telefone">Telefone</Label>
                <HelpTooltip content="Número do WhatsApp ou telefone principal para contato" />
              </div>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="email">E-mail</Label>
              <HelpTooltip content="E-mail principal para envio de comunicações e materiais" />
            </div>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="email@exemplo.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="regiao">Região</Label>
                <HelpTooltip content="Bairro ou região onde a pessoa mora/trabalha" />
              </div>
              <Select value={formData.regiao} onValueChange={(value) => handleInputChange('regiao', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a região" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="centro">Centro</SelectItem>
                  <SelectItem value="zona-norte">Zona Norte</SelectItem>
                  <SelectItem value="zona-sul">Zona Sul</SelectItem>
                  <SelectItem value="zona-leste">Zona Leste</SelectItem>
                  <SelectItem value="zona-oeste">Zona Oeste</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="interesse">Área de Interesse</Label>
                <HelpTooltip content="Principal área de interesse político ou tema que chamou atenção" />
              </div>
              <Select value={formData.interesse} onValueChange={(value) => handleInputChange('interesse', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o interesse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saude">Saúde</SelectItem>
                  <SelectItem value="educacao">Educação</SelectItem>
                  <SelectItem value="seguranca">Segurança</SelectItem>
                  <SelectItem value="infraestrutura">Infraestrutura</SelectItem>
                  <SelectItem value="meio-ambiente">Meio Ambiente</SelectItem>
                  <SelectItem value="economia">Economia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="score">Score de Interesse ({formData.score}%)</Label>
              <HelpTooltip content="Avalie de 0 a 100 o nível de interesse/engajamento demonstrado pela pessoa" />
            </div>
            <input
              type="range"
              id="score"
              min="0"
              max="100"
              value={formData.score}
              onChange={(e) => handleInputChange('score', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Baixo</span>
              <span>Médio</span>
              <span>Alto</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="observacoes">Observações</Label>
              <HelpTooltip content="Informações adicionais sobre o contato, contexto do interesse, etc." />
            </div>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => handleInputChange('observacoes', e.target.value)}
              placeholder="Informações adicionais sobre o lead..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Adicionar Lead
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
