
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Target,
  Tag,
  Edit
} from "lucide-react";

interface Lead {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  status: string;
  interesse?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

interface LeadCardProps {
  lead: Lead;
  onEdit?: (lead: Lead) => void;
}

export const LeadCard = ({ lead, onEdit }: LeadCardProps) => {
  const getScoreColor = (status: string) => {
    switch (status) {
      case 'fechado': return "text-green-600";
      case 'proposta': return "text-yellow-600";
      case 'interesse': return "text-orange-600";
      default: return "text-red-600";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'novo': return 'bg-blue-100 text-blue-800';
      case 'contatado': return 'bg-yellow-100 text-yellow-800';
      case 'interesse': return 'bg-orange-100 text-orange-800';
      case 'proposta': return 'bg-purple-100 text-purple-800';
      case 'fechado': return 'bg-green-100 text-green-800';
      case 'perdido': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card 
      className="border-0 shadow-md hover:shadow-lg transition-all duration-200 bg-white cursor-pointer"
      onClick={() => onEdit?.(lead)}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Nome, Status e Editar */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-sm">{lead.nome}</h4>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusBadgeColor(lead.status)}>
                {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(lead);
                }}
              >
                <Edit className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Tags */}
          {lead.tags && lead.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {lead.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  <Tag className="w-2 h-2 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Interesse */}
          {lead.interesse && (
            <Badge variant="outline" className="text-xs">
              <Target className="w-2 h-2 mr-1" />
              {lead.interesse}
            </Badge>
          )}

          {/* Contato */}
          <div className="space-y-1">
            {lead.email && (
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Mail className="w-3 h-3" />
                <span className="truncate">{lead.email}</span>
              </div>
            )}
            {lead.telefone && (
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Phone className="w-3 h-3" />
                <span>{lead.telefone}</span>
              </div>
            )}
          </div>

          {/* Data de criação */}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{new Date(lead.created_at).toLocaleDateString('pt-BR')}</span>
          </div>

          {/* Ações */}
          <div className="flex gap-1 pt-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs h-7"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-3 h-3 mr-1" />
              Ligar
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs h-7"
              onClick={(e) => e.stopPropagation()}
            >
              <Mail className="w-3 h-3 mr-1" />
              Email
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
