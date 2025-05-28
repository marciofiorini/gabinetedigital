
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Plus, Phone, Mail, Calendar, User, Star } from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Lead {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  origem: string;
  interesse: string;
  prioridade: string;
  dataContato: string;
  status: string;
}

const CrmKanban = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  const [leads, setLeads] = useState<Record<string, Lead[]>>({
    leads: [
      {
        id: 1,
        nome: "Ana Paula Ribeiro",
        email: "ana@email.com",
        telefone: "(11) 99999-1111",
        origem: "Instagram",
        interesse: "Saúde Pública",
        prioridade: "Alta",
        dataContato: "2024-05-27",
        status: "leads"
      },
      {
        id: 2,
        nome: "Roberto Silva",
        email: "roberto@email.com",
        telefone: "(11) 99999-2222",
        origem: "WhatsApp",
        interesse: "Infraestrutura",
        prioridade: "Média",
        dataContato: "2024-05-26",
        status: "leads"
      }
    ],
    contato: [
      {
        id: 3,
        nome: "Carla Santos",
        email: "carla@email.com",
        telefone: "(11) 99999-3333",
        origem: "Evento",
        interesse: "Educação",
        prioridade: "Alta",
        dataContato: "2024-05-25",
        status: "contato"
      }
    ],
    interesse: [
      {
        id: 4,
        nome: "Fernando Costa",
        email: "fernando@email.com",
        telefone: "(11) 99999-4444",
        origem: "Indicação",
        interesse: "Economia",
        prioridade: "Baixa",
        dataContato: "2024-05-24",
        status: "interesse"
      }
    ],
    convertido: [
      {
        id: 5,
        nome: "Lucia Oliveira",
        email: "lucia@email.com",
        telefone: "(11) 99999-5555",
        origem: "Website",
        interesse: "Meio Ambiente",
        prioridade: "Alta",
        dataContato: "2024-05-23",
        status: "convertido"
      }
    ]
  });

  const colunas = [
    { id: "leads", titulo: "Novos Leads", cor: "from-blue-500 to-blue-600" },
    { id: "contato", titulo: "Primeiro Contato", cor: "from-yellow-500 to-orange-500" },
    { id: "interesse", titulo: "Demonstrou Interesse", cor: "from-purple-500 to-purple-600" },
    { id: "convertido", titulo: "Convertido", cor: "from-green-500 to-green-600" }
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the lead being dragged
    let sourceLead: Lead | null = null;
    let sourceColumn = '';
    
    for (const [columnId, columnLeads] of Object.entries(leads)) {
      const foundLead = columnLeads.find(lead => lead.id.toString() === activeId);
      if (foundLead) {
        sourceLead = foundLead;
        sourceColumn = columnId;
        break;
      }
    }

    if (!sourceLead) return;

    // If dropped on a column header or in a column
    const targetColumn = overId.includes('-') ? overId.split('-')[0] : overId;
    
    if (sourceColumn !== targetColumn && colunas.find(col => col.id === targetColumn)) {
      setLeads(prevLeads => {
        const newLeads = { ...prevLeads };
        
        // Remove from source
        newLeads[sourceColumn] = newLeads[sourceColumn].filter(lead => lead.id !== sourceLead!.id);
        
        // Add to target
        const updatedLead = { ...sourceLead!, status: targetColumn };
        newLeads[targetColumn] = [...newLeads[targetColumn], updatedLead];
        
        return newLeads;
      });
    }

    setActiveId(null);
  }

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "Alta": return "bg-red-100 text-red-800 border-red-200";
      case "Média": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Baixa": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getOrigemColor = (origem: string) => {
    switch (origem) {
      case "Instagram": return "bg-pink-100 text-pink-800 border-pink-200";
      case "WhatsApp": return "bg-green-100 text-green-800 border-green-200";
      case "Website": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Evento": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Indicação": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-100 flex">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  CRM Kanban
                </h1>
                <p className="text-gray-600">
                  Arraste os leads entre as colunas para gerenciar o funil
                </p>
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="w-4 h-4 mr-2" />
                Novo Lead
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {colunas.map((coluna, index) => (
              <Card key={coluna.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${coluna.cor} flex items-center justify-center mr-4`}>
                      <span className="text-white font-bold text-lg">
                        {leads[coluna.id]?.length || 0}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{coluna.titulo}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {leads[coluna.id]?.length || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Kanban Board */}
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              {colunas.map((coluna) => (
                <KanbanColumn
                  key={coluna.id}
                  coluna={coluna}
                  leads={leads[coluna.id] || []}
                  getPrioridadeColor={getPrioridadeColor}
                  getOrigemColor={getOrigemColor}
                />
              ))}
            </div>
          </DndContext>
        </main>
      </div>
    </div>
  );
};

// Componente da coluna do Kanban
function KanbanColumn({ coluna, leads, getPrioridadeColor, getOrigemColor }: {
  coluna: any;
  leads: Lead[];
  getPrioridadeColor: (prioridade: string) => string;
  getOrigemColor: (origem: string) => string;
}) {
  const {
    setNodeRef,
    isOver,
  } = useSortable({
    id: coluna.id,
  });

  return (
    <div 
      ref={setNodeRef}
      className={`space-y-4 ${isOver ? 'bg-gray-100/50 rounded-lg p-2' : ''}`}
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className={`text-lg bg-gradient-to-r ${coluna.cor} bg-clip-text text-transparent`}>
            {coluna.titulo}
          </CardTitle>
          <Badge variant="outline" className="w-fit">
            {leads.length} leads
          </Badge>
        </CardHeader>
      </Card>

      <SortableContext items={leads.map(lead => lead.id.toString())} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {leads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              coluna={coluna}
              getPrioridadeColor={getPrioridadeColor}
              getOrigemColor={getOrigemColor}
            />
          ))}
          {leads.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhum lead nesta etapa</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

// Componente do card do lead
function LeadCard({ lead, coluna, getPrioridadeColor, getOrigemColor }: {
  lead: Lead;
  coluna: any;
  getPrioridadeColor: (prioridade: string) => string;
  getOrigemColor: (origem: string) => string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border-0 shadow-md hover:shadow-lg transition-all duration-200 bg-white/90 backdrop-blur-sm cursor-grab hover:bg-white active:cursor-grabbing"
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${coluna.cor} flex items-center justify-center mr-3`}>
              <span className="text-white font-semibold text-sm">
                {lead.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">{lead.nome}</h4>
              <p className="text-xs text-gray-600">{lead.interesse}</p>
            </div>
          </div>
          <Star className="w-4 h-4 text-yellow-500" />
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center text-xs text-gray-600">
            <Phone className="w-3 h-3 mr-2" />
            {lead.telefone}
          </div>
          <div className="flex items-center text-xs text-gray-600">
            <Mail className="w-3 h-3 mr-2" />
            {lead.email}
          </div>
          <div className="flex items-center text-xs text-gray-600">
            <Calendar className="w-3 h-3 mr-2" />
            {lead.dataContato}
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          <Badge className={`${getPrioridadeColor(lead.prioridade)} border text-xs`}>
            {lead.prioridade}
          </Badge>
          <Badge className={`${getOrigemColor(lead.origem)} border text-xs`}>
            {lead.origem}
          </Badge>
        </div>

        <div className="flex gap-1">
          <Button variant="outline" size="sm" className="flex-1 text-xs h-8">
            Ver
          </Button>
          <Button size="sm" className={`flex-1 text-xs h-8 bg-gradient-to-r ${coluna.cor} hover:opacity-90`}>
            Chat
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default CrmKanban;
