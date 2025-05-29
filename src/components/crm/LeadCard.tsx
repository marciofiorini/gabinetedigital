
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
  id: number;
  nome: string;
  email: string;
  telefone: string;
  regiao: string;
  interesse: string;
  score: number;
  ultimoContato: string;
  tags: string[];
}

interface LeadCardProps {
  lead: Lead;
}

export const LeadCard = ({ lead }: LeadCardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200 bg-white cursor-pointer">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Nome, Score e Editar */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-sm">{lead.nome}</h4>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Target className="w-3 h-3 text-gray-400" />
                <span className={`text-xs font-semibold ${getScoreColor(lead.score)}`}>
                  {lead.score}
                </span>
              </div>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
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
          <Badge variant="outline" className="text-xs">
            {lead.interesse}
          </Badge>

          {/* Contato */}
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Mail className="w-3 h-3" />
              <span className="truncate">{lead.email}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Phone className="w-3 h-3" />
              <span>{lead.telefone}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <MapPin className="w-3 h-3" />
              <span>{lead.regiao}</span>
            </div>
          </div>

          {/* Último Contato */}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{lead.ultimoContato}</span>
          </div>

          {/* Ações */}
          <div className="flex gap-1 pt-2">
            <Button size="sm" variant="outline" className="text-xs h-7">
              <Phone className="w-3 h-3 mr-1" />
              Ligar
            </Button>
            <Button size="sm" variant="outline" className="text-xs h-7">
              <Mail className="w-3 h-3 mr-1" />
              Email
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
