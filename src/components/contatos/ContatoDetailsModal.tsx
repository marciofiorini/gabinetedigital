
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Calendar, FileText, Tags, Star } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Contato {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  zona?: string;
  observacoes?: string;
  tags?: string[];
  data_nascimento?: string;
  created_at: string;
  updated_at?: string;
}

interface ContatoDetailsModalProps {
  contato: Contato | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ContatoDetailsModal = ({ contato, isOpen, onClose }: ContatoDetailsModalProps) => {
  if (!contato) return null;

  const calcularLeadScore = (contato: Contato): number => {
    let score = 0;
    if (contato.email) score += 30;
    if (contato.telefone) score += 25;
    if (contato.endereco) score += 15;
    if (contato.tags && contato.tags.length > 0) score += 20;
    if (contato.observacoes) score += 10;
    return Math.min(score, 100);
  };

  const leadScore = calcularLeadScore(contato);
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>{contato.nome}</span>
            <div className={`flex items-center gap-1 ${getScoreColor(leadScore)}`}>
              <Star className="w-5 h-5" />
              <span className="font-bold">{leadScore}</span>
              <span className="text-sm text-gray-500">Lead Score</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações de Contato */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Informações de Contato</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contato.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{contato.email}</span>
                </div>
              )}
              {contato.telefone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{contato.telefone}</span>
                </div>
              )}
              {contato.zona && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{contato.zona}</span>
                </div>
              )}
              {contato.data_nascimento && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{format(new Date(contato.data_nascimento), "dd/MM/yyyy", { locale: ptBR })}</span>
                </div>
              )}
            </div>
          </div>

          {contato.endereco && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-lg mb-3">Endereço</h3>
                <p className="text-gray-700">{contato.endereco}</p>
              </div>
            </>
          )}

          {contato.tags && contato.tags.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Tags className="w-4 h-4" />
                  Tags
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {contato.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {contato.observacoes && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Observações
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap">{contato.observacoes}</p>
              </div>
            </>
          )}

          <Separator />
          <div className="text-sm text-gray-500">
            <p>Criado em: {format(new Date(contato.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
            {contato.updated_at && (
              <p>Atualizado em: {format(new Date(contato.updated_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
