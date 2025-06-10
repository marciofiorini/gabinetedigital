
import React, { useState } from "react";
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { useTagSync } from "@/hooks/useTagSync";
import { useLeads } from "@/hooks/useLeads";
import { CrmHeader } from "@/components/crm/CrmHeader";
import { CrmFilters } from "@/components/crm/CrmFilters";
import { KanbanColumn } from "@/components/crm/KanbanColumn";
import { EditLeadModal } from "@/components/crm/EditLeadModal";
import { HelpFloatingButton } from "@/components/HelpFloatingButton";
import { toast } from 'sonner';

const CrmKanban = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { syncTagsFromLead } = useTagSync();
  const { leads, updateLead } = useLeads();

  const colunas = [
    { id: "novo", titulo: "Novos Leads", cor: "bg-blue-500", count: 0 },
    { id: "contatado", titulo: "Contatados", cor: "bg-yellow-500", count: 0 },
    { id: "interesse", titulo: "Com Interesse", cor: "bg-orange-500", count: 0 },
    { id: "proposta", titulo: "Proposta Enviada", cor: "bg-purple-500", count: 0 },
    { id: "fechado", titulo: "Fechados", cor: "bg-green-500", count: 0 },
    { id: "perdido", titulo: "Perdidos", cor: "bg-red-500", count: 0 }
  ];

  // Filtrar leads por termo de busca
  const filteredLeads = leads.filter(lead => 
    lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.telefone?.includes(searchTerm) ||
    lead.interesse?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Agrupar leads por status
  const leadsGrouped = colunas.reduce((acc, coluna) => {
    acc[coluna.id] = filteredLeads.filter(lead => lead.status === coluna.id);
    return acc;
  }, {} as Record<string, typeof leads>);

  // Sincronizar tags existentes
  React.useEffect(() => {
    leads.forEach(lead => {
      if (lead.tags) {
        syncTagsFromLead(lead.tags);
      }
    });
  }, [leads, syncTagsFromLead]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    const leadId = active.id as string;
    const newStatus = over.id as string;
    
    // Verificar se é uma coluna válida
    if (!colunas.find(col => col.id === newStatus)) return;

    try {
      await updateLead(leadId, { status: newStatus as any });
      toast.success(`Lead movido para "${colunas.find(col => col.id === newStatus)?.titulo}"`);
    } catch (error) {
      toast.error('Erro ao atualizar status do lead');
    }
  };

  const handleEditLead = (lead: any) => {
    setSelectedLead(lead);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedLead(null);
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <CrmHeader />

      {/* Filtros */}
      <CrmFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {/* Kanban Board */}
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
          {colunas.map((coluna) => (
            <KanbanColumn 
              key={coluna.id} 
              column={{
                ...coluna,
                count: leadsGrouped[coluna.id]?.length || 0
              }}
              leads={leadsGrouped[coluna.id] || []}
              onEditLead={handleEditLead}
            />
          ))}
        </div>
      </DndContext>

      {/* Modal de Edição */}
      <EditLeadModal
        lead={selectedLead}
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
      />

      {/* Botão Flutuante de Ajuda */}
      <HelpFloatingButton helpSection="crm" />
    </div>
  );
};

export default CrmKanban;
