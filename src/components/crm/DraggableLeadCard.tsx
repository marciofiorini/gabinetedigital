
import React from "react";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { LeadCard } from "./LeadCard";

interface Lead {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  status: string;
  interesse?: string;
  created_at: string;
  updated_at: string;
}

interface DraggableLeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
}

export const DraggableLeadCard = ({ lead, onEdit }: DraggableLeadCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
    >
      <LeadCard lead={lead} onEdit={onEdit} />
    </div>
  );
};
