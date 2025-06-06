
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTicketsAtendimento } from "@/hooks/useTicketsAtendimento";
import { Send, Clock, User, MessageSquare } from "lucide-react";

interface TicketDetailsModalProps {
  ticket: any;
  isOpen: boolean;
  onClose: () => void;
}

export const TicketDetailsModal = ({ ticket, isOpen, onClose }: TicketDetailsModalProps) => {
  const { atualizarTicket, buscarMensagensTicket, adicionarMensagemTicket } = useTicketsAtendimento();
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [novoStatus, setNovoStatus] = useState(ticket?.status || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ticket?.id) {
      carregarMensagens();
      setNovoStatus(ticket.status);
    }
  }, [ticket?.id]);

  const carregarMensagens = async () => {
    if (!ticket?.id) return;
    
    const mensagensData = await buscarMensagensTicket(ticket.id);
    setMensagens(mensagensData);
  };

  const enviarMensagem = async () => {
    if (!novaMensagem.trim()) return;

    setLoading(true);
    try {
      await adicionarMensagemTicket(ticket.id, novaMensagem);
      setNovaMensagem("");
      carregarMensagens();
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatus = async () => {
    if (novoStatus === ticket.status) return;

    setLoading(true);
    try {
      await atualizarTicket(ticket.id, { status: novoStatus });
      await adicionarMensagemTicket(
        ticket.id, 
        `Status alterado para: ${novoStatus.replace('_', ' ')}`, 
        'mudanca_status'
      );
      carregarMensagens();
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aberto': return "bg-blue-100 text-blue-800";
      case 'em_andamento': return "bg-yellow-100 text-yellow-800";
      case 'aguardando_resposta': return "bg-orange-100 text-orange-800";
      case 'resolvido': return "bg-green-100 text-green-800";
      case 'fechado': return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (!ticket) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Ticket #{ticket.numero_ticket}</DialogTitle>
            <Badge className={getStatusColor(ticket.status)}>
              {ticket.status.replace('_', ' ')}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-6">
          {/* Informações do Ticket */}
          <div className="col-span-1 space-y-4">
            <div>
              <h3 className="font-medium mb-2">Informações</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Assunto:</span>
                  <p className="font-medium">{ticket.assunto}</p>
                </div>
                <div>
                  <span className="text-gray-600">Categoria:</span>
                  <p>{ticket.categoria}</p>
                </div>
                <div>
                  <span className="text-gray-600">Prioridade:</span>
                  <p className="capitalize">{ticket.prioridade}</p>
                </div>
                <div>
                  <span className="text-gray-600">Canal:</span>
                  <p className="capitalize">{ticket.canal}</p>
                </div>
                <div>
                  <span className="text-gray-600">Criado em:</span>
                  <p>{new Date(ticket.created_at).toLocaleString('pt-BR')}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Descrição</h3>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                {ticket.descricao}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">Alterar Status</label>
              <div className="flex gap-2 mt-1">
                <Select value={novoStatus} onValueChange={setNovoStatus}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aberto">Aberto</SelectItem>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="aguardando_resposta">Aguardando Resposta</SelectItem>
                    <SelectItem value="resolvido">Resolvido</SelectItem>
                    <SelectItem value="fechado">Fechado</SelectItem>
                  </SelectContent>
                </Select>
                {novoStatus !== ticket.status && (
                  <Button onClick={atualizarStatus} size="sm" disabled={loading}>
                    Salvar
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Conversa */}
          <div className="col-span-2">
            <h3 className="font-medium mb-4">Conversa</h3>
            
            <div className="border rounded-lg">
              {/* Mensagens */}
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {mensagens.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2" />
                    <p>Nenhuma mensagem ainda</p>
                  </div>
                ) : (
                  mensagens.map((mensagem) => (
                    <div key={mensagem.id} className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <User className="w-3 h-3" />
                        <span>{mensagem.autor_tipo}</span>
                        <Clock className="w-3 h-3 ml-2" />
                        <span>{new Date(mensagem.created_at).toLocaleString('pt-BR')}</span>
                        {mensagem.tipo === 'mudanca_status' && (
                          <Badge variant="outline" className="text-xs">Status</Badge>
                        )}
                      </div>
                      <div className={`p-3 rounded-lg ${
                        mensagem.tipo === 'mudanca_status' 
                          ? 'bg-blue-50 border-l-4 border-blue-500' 
                          : 'bg-gray-50'
                      }`}>
                        <p className="text-sm">{mensagem.mensagem}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Nova Mensagem */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Textarea
                    value={novaMensagem}
                    onChange={(e) => setNovaMensagem(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    rows={2}
                    className="flex-1"
                  />
                  <Button 
                    onClick={enviarMensagem}
                    disabled={!novaMensagem.trim() || loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
