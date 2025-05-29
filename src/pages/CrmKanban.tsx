
import React, { useState } from "react";
import { useTagSync } from "@/hooks/useTagSync";
import { CrmHeader } from "@/components/crm/CrmHeader";
import { CrmFilters } from "@/components/crm/CrmFilters";
import { KanbanColumn } from "@/components/crm/KanbanColumn";

const CrmKanban = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { syncTagsFromLead } = useTagSync();

  const colunas = [
    { id: "lead", titulo: "Novos Leads", cor: "bg-blue-500", count: 8 },
    { id: "qualificado", titulo: "Qualificados", cor: "bg-yellow-500", count: 5 },
    { id: "proposta", titulo: "Proposta Enviada", cor: "bg-orange-500", count: 3 },
    { id: "fechado", titulo: "Fechados", cor: "bg-green-500", count: 12 }
  ];

  const leads = {
    lead: [
      {
        id: 1,
        nome: "Ana Silva",
        email: "ana@email.com",
        telefone: "(21) 99999-1111",
        regiao: "Zona Sul",
        interesse: "Saúde",
        score: 85,
        ultimoContato: "2024-05-27",
        tags: ["VIP", "Interessado"]
      },
      {
        id: 2,
        nome: "João Santos",
        email: "joao@email.com",
        telefone: "(21) 99999-2222",
        regiao: "Centro",
        interesse: "Educação",
        score: 72,
        ultimoContato: "2024-05-26",
        tags: ["Follow Up"]
      }
    ],
    qualificado: [
      {
        id: 3,
        nome: "Maria Oliveira",
        email: "maria@email.com",
        telefone: "(21) 99999-3333",
        regiao: "Zona Norte",
        interesse: "Infraestrutura",
        score: 91,
        ultimoContato: "2024-05-25",
        tags: ["Prioridade Alta", "Reunião Agendada"]
      }
    ],
    proposta: [
      {
        id: 4,
        nome: "Carlos Lima",
        email: "carlos@email.com",
        telefone: "(21) 99999-4444",
        regiao: "Zona Oeste",
        interesse: "Economia",
        score: 88,
        ultimoContato: "2024-05-24",
        tags: ["Proposta Enviada", "VIP"]
      }
    ],
    fechado: [
      {
        id: 5,
        nome: "Lucia Costa",
        email: "lucia@email.com",
        telefone: "(21) 99999-5555",
        regiao: "Barra",
        interesse: "Meio Ambiente",
        score: 95,
        ultimoContato: "2024-05-23",
        tags: ["VIP"]
      }
    ]
  };

  // Sincronizar tags existentes
  React.useEffect(() => {
    Object.values(leads).flat().forEach(lead => {
      if (lead.tags) {
        syncTagsFromLead(lead.tags);
      }
    });
  }, [syncTagsFromLead]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <CrmHeader />

      {/* Filtros */}
      <CrmFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {colunas.map((coluna) => (
          <KanbanColumn 
            key={coluna.id} 
            column={coluna} 
            leads={leads[coluna.id as keyof typeof leads] || []}
          />
        ))}
      </div>
    </div>
  );
};

export default CrmKanban;
