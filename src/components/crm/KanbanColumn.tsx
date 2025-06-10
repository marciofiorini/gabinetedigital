
import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DraggableLeadCard } from "./DraggableLeadCard";

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

interface Column {
  id: string;
  titulo: string;
  cor: string;
  count: number;
}

interface KanbanColumnProps {
  column: Column;
  leads: Lead[];
  onEditLead: (lead: Lead) => void;
}

export const KanbanColumn = ({ column, leads, onEditLead }: KanbanColumnProps) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

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
              {leads.length}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Cards dos Leads */}
      <div ref={setNodeRef} className="space-y-3 min-h-[200px]">
        <SortableContext items={leads.map(lead => lead.id)} strategy={verticalListSortingStrategy}>
          {leads.map((lead) => (
            <DraggableLeadCard 
              key={lead.id} 
              lead={lead} 
              onEdit={onEditLead}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};
