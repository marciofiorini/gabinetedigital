
import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LeadCard } from "./LeadCard";

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

interface Column {
  id: string;
  titulo: string;
  cor: string;
  count: number;
}

interface KanbanColumnProps {
  column: Column;
  leads: Lead[];
}

export const KanbanColumn = ({ column, leads }: KanbanColumnProps) => {
  return (
    <div className="space-y-4">
      {/* Header da Coluna */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${column.cor}`} />
              <CardTitle className="text-sm font-medium">{column.titulo}</CardTitle>
            </div>
            <Badge variant="secondary" className="text-xs">
              {column.count}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Cards dos Leads */}
      <div className="space-y-3">
        {leads?.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  );
};
