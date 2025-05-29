
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  Edit, 
  Trash2, 
  MessageSquare, 
  Phone, 
  Calendar, 
  Gift,
  Copy,
  Eye
} from "lucide-react";

interface MessageTemplate {
  id: string;
  nome: string;
  tipo: 'ligacao' | 'mensagem' | 'reuniao' | 'aniversario';
  assunto: string;
  conteudo: string;
  variaveis: string[];
  ativo: boolean;
}

interface MessageTemplatesProps {
  onSelectTemplate: (template: MessageTemplate) => void;
}

export const MessageTemplates = ({ onSelectTemplate }: MessageTemplatesProps) => {
  const [templates, setTemplates] = useState<MessageTemplate[]>([
    {
      id: '1',
      nome: 'Ligação de Follow Up',
      tipo: 'ligacao',
      assunto: 'Retorno sobre {ASSUNTO}',
      conteudo: 'Olá {NOME}, entrando em contato para dar seguimento sobre {ASSUNTO}. Gostaria de agendar uma conversa para discutirmos melhor. Quando seria um bom horário para você?',
      variaveis: ['NOME', 'ASSUNTO'],
      ativo: true
    },
    {
      id: '2',
      nome: 'Mensagem WhatsApp',
      tipo: 'mensagem',
      assunto: 'Acompanhamento - {TEMA}',
      conteudo: 'Oi {NOME}! 😊\n\nEspero que esteja tudo bem. Estou fazendo um acompanhamento sobre {TEMA}.\n\nSe tiver alguma dúvida ou precisar de algo, estarei aqui para ajudar!\n\nAbraços!',
      variaveis: ['NOME', 'TEMA'],
      ativo: true
    },
    {
      id: '3',
      nome: 'Convite para Reunião',
      tipo: 'reuniao',
      assunto: 'Convite: Reunião sobre {PAUTA}',
      conteudo: 'Prezado(a) {NOME},\n\nGostaria de convidá-lo(a) para uma reunião sobre {PAUTA}.\n\nData: {DATA}\nHorário: {HORARIO}\nLocal: {LOCAL}\n\nConfirme sua presença, por favor.\n\nAtenciosamente,',
      variaveis: ['NOME', 'PAUTA', 'DATA', 'HORARIO', 'LOCAL'],
      ativo: true
    },
    {
      id: '4',
      nome: 'Parabéns Aniversário',
      tipo: 'aniversario',
      assunto: 'Parabéns pelo seu aniversário! 🎉',
      conteudo: 'Querido(a) {NOME},\n\n🎉 PARABÉNS pelo seu aniversário! 🎂\n\nDesejo que este novo ano de vida seja repleto de alegrias, conquistas e realizações.\n\nQue Deus abençoe sempre sua vida e sua família!\n\nUm grande abraço!',
      variaveis: ['NOME'],
      ativo: true
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<MessageTemplate>({
    id: '',
    nome: '',
    tipo: 'mensagem',
    assunto: '',
    conteudo: '',
    variaveis: [],
    ativo: true
  });

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'ligacao': return <Phone className="w-4 h-4" />;
      case 'mensagem': return <MessageSquare className="w-4 h-4" />;
      case 'reuniao': return <Calendar className="w-4 h-4" />;
      case 'aniversario': return <Gift className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'ligacao': return 'bg-blue-100 text-blue-800';
      case 'mensagem': return 'bg-green-100 text-green-800';
      case 'reuniao': return 'bg-purple-100 text-purple-800';
      case 'aniversario': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleNewTemplate = () => {
    setCurrentTemplate({
      id: '',
      nome: '',
      tipo: 'mensagem',
      assunto: '',
      conteudo: '',
      variaveis: [],
      ativo: true
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEditTemplate = (template: MessageTemplate) => {
    setCurrentTemplate(template);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleSaveTemplate = () => {
    // Extrair variáveis do conteúdo (texto entre {})
    const variaveis = Array.from(
      new Set(
        [...currentTemplate.conteudo.matchAll(/\{([^}]+)\}/g)]
          .map(match => match[1])
          .concat([...currentTemplate.assunto.matchAll(/\{([^}]+)\}/g)]
            .map(match => match[1]))
      )
    );

    const templateToSave = {
      ...currentTemplate,
      id: currentTemplate.id || Date.now().toString(),
      variaveis
    };

    if (isEditing) {
      setTemplates(prev => prev.map(t => t.id === templateToSave.id ? templateToSave : t));
    } else {
      setTemplates(prev => [...prev, templateToSave]);
    }

    setIsDialogOpen(false);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const handleUseTemplate = (template: MessageTemplate) => {
    onSelectTemplate(template);
  };

  const extractVariables = (text: string) => {
    return Array.from(new Set([...text.matchAll(/\{([^}]+)\}/g)].map(match => match[1])));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Templates de Mensagens
            </CardTitle>
            <CardDescription>
              Modelos pré-definidos para follow ups
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNewTemplate} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Novo Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? 'Editar Template' : 'Novo Template'}
                </DialogTitle>
                <DialogDescription>
                  Crie ou edite um template de mensagem para follow ups
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome do Template</Label>
                    <Input
                      id="nome"
                      value={currentTemplate.nome}
                      onChange={(e) => setCurrentTemplate({...currentTemplate, nome: e.target.value})}
                      placeholder="Ex: Ligação de Follow Up"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tipo">Tipo</Label>
                    <Select 
                      value={currentTemplate.tipo} 
                      onValueChange={(value: any) => setCurrentTemplate({...currentTemplate, tipo: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ligacao">Ligação</SelectItem>
                        <SelectItem value="mensagem">Mensagem</SelectItem>
                        <SelectItem value="reuniao">Reunião</SelectItem>
                        <SelectItem value="aniversario">Aniversário</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="assunto">Assunto</Label>
                  <Input
                    id="assunto"
                    value={currentTemplate.assunto}
                    onChange={(e) => setCurrentTemplate({...currentTemplate, assunto: e.target.value})}
                    placeholder="Ex: Retorno sobre {ASSUNTO}"
                  />
                </div>

                <div>
                  <Label htmlFor="conteudo">Conteúdo da Mensagem</Label>
                  <Textarea
                    id="conteudo"
                    value={currentTemplate.conteudo}
                    onChange={(e) => setCurrentTemplate({...currentTemplate, conteudo: e.target.value})}
                    placeholder="Use {VARIAVEL} para campos personalizáveis. Ex: Olá {NOME}, ..."
                    className="min-h-[120px]"
                  />
                </div>

                <div>
                  <Label>Variáveis Detectadas</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {extractVariables(currentTemplate.conteudo + ' ' + currentTemplate.assunto).map((variavel) => (
                      <Badge key={variavel} variant="outline" className="text-xs">
                        {`{${variavel}}`}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Use chaves para criar variáveis: {`{NOME}, {ASSUNTO}, {DATA}, etc.`}
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveTemplate} disabled={!currentTemplate.nome || !currentTemplate.conteudo}>
                  {isEditing ? 'Salvar Alterações' : 'Criar Template'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {templates.map((template) => (
            <div key={template.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1 rounded ${getTipoColor(template.tipo)}`}>
                      {getTipoIcon(template.tipo)}
                    </div>
                    <h4 className="font-semibold text-gray-900">{template.nome}</h4>
                    <Badge className={getTipoColor(template.tipo)}>
                      {template.tipo}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Assunto:</p>
                      <p className="text-sm text-gray-600">{template.assunto}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700">Conteúdo:</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{template.conteudo}</p>
                    </div>
                    
                    {template.variaveis.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Variáveis:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {template.variaveis.map((variavel) => (
                            <Badge key={variavel} variant="outline" className="text-xs">
                              {`{${variavel}}`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-1 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUseTemplate(template)}
                    className="hover:bg-green-50"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Usar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditTemplate(template)}
                    className="hover:bg-blue-50"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="hover:bg-red-50 hover:border-red-300"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
