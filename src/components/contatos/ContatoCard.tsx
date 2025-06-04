
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Mail, Phone, MapPin, Eye, Edit, Trash2, Star } from "lucide-react";

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

interface ContatoCardProps {
  contato: Contato;
  onView: (contato: Contato) => void;
  onEdit: (contato: Contato) => void;
  onDelete: (id: string) => void;
}

export const ContatoCard = ({ contato, onView, onEdit, onDelete }: ContatoCardProps) => {
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
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <Users className="w-6 h-6 text-blue-600" />
        </div>
        
        <div className="flex-1">
          <button
            onClick={() => onView(contato)}
            className="text-left w-full"
          >
            <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
              {contato.nome}
            </h3>
          </button>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
            {contato.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {contato.email}
              </span>
            )}
            {contato.telefone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {contato.telefone}
              </span>
            )}
            {contato.zona && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {contato.zona}
              </span>
            )}
          </div>
          
          {contato.tags && contato.tags.length > 0 && (
            <div className="flex gap-1 mt-2">
              {contato.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {contato.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{contato.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-center">
            <div className={`flex items-center gap-1 ${getScoreColor(leadScore)}`}>
              <Star className="w-4 h-4" />
              <span className="font-semibold">{leadScore}</span>
            </div>
            <span className="text-xs text-gray-500">Lead Score</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onView(contato)}>
          <Eye className="w-3 h-3" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => onEdit(contato)}>
          <Edit className="w-3 h-3" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-red-600 hover:text-red-700"
          onClick={() => onDelete(contato.id)}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};
