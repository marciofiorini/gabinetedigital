import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TagManager } from "@/components/TagManager";
import { useTagSync } from "@/hooks/useTagSync";
import { 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  User,
  Target,
  Tag,
  Edit
} from "lucide-react";

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

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            CRM - Pipeline
          </h1>
          <p className="text-gray-600">
            Acompanhe o funil de conversão dos seus leads
          </p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
          <Plus className="w-4 h-4 mr-2" />
          Novo Lead
        </Button>
      </div>

      {/* Filtros */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-indigo-500 transition-colors"
              />
            </div>
            <Button variant="outline" className="hover:bg-indigo-50 hover:border-indigo-300 transition-colors">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {colunas.map((coluna) => (
          <div key={coluna.id} className="space-y-4">
            {/* Header da Coluna */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${coluna.cor}`} />
                    <CardTitle className="text-sm font-medium">{coluna.titulo}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {coluna.count}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Cards dos Leads */}
            <div className="space-y-3">
              {leads[coluna.id]?.map((lead) => (
                <Card key={lead.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-200 bg-white cursor-pointer">
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
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CrmKanban;
