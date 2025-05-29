import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadDetailsModal } from "@/components/LeadDetailsModal";
import { NovoLeadModal } from "@/components/NovoLeadModal";
import { EditLeadModal } from "@/components/EditLeadModal";
import { UploadCSVContatos } from "@/components/UploadCSVContatos";
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Plus, 
  Search, 
  Filter,
  TrendingUp, 
  Star, 
  Award,
  Users,
  Target,
  Activity,
  MessageCircle,
  Instagram,
  Calendar,
  Upload,
  Edit,
  Tag,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MapPin
} from "lucide-react";

type SortField = 'nome' | 'leadScore' | 'engajamento' | 'regiao' | 'interacoes';
type SortDirection = 'asc' | 'desc' | null;

const Contatos = () => {
  const [selectedLead, setSelectedLead] = useState(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isNovoLeadModalOpen, setIsNovoLeadModalOpen] = useState(false);
  const [isEditLeadModalOpen, setIsEditLeadModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [sortField, setSortField] = useState<SortField>('leadScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const itemsPerPage = 20;

  const contatos = [
    {
      id: 1,
      nome: "Ana Paula Ribeiro",
      tipo: "Lead",
      email: "ana@email.com",
      telefone: "(21) 99999-1111",
      whatsapp: "(21) 99999-1111",
      regiao: "Zona Sul",
      leadScore: 95,
      engajamento: "Muito Alto",
      ultimaInteracao: "2024-05-27",
      origem: "Instagram",
      interesse: "Saúde Pública",
      interacoes: 24,
      tags: ["VIP", "Saúde"],
      followUps: []
    },
    {
      id: 2,
      nome: "José da Silva",
      tipo: "Líder",
      email: "jose@email.com",
      telefone: "(21) 99999-2222",
      whatsapp: "(21) 99999-2222",
      regiao: "Centro",
      leadScore: 88,
      engajamento: "Alto",
      ultimaInteracao: "2024-05-26",
      origem: "Evento",
      interesse: "Infraestrutura",
      interacoes: 31,
      tags: ["Líder", "Infraestrutura"],
      followUps: []
    },
    {
      id: 3,
      nome: "Maria Santos",
      tipo: "Lead",
      email: "maria@email.com",
      telefone: "(21) 99999-3333",
      whatsapp: "(21) 99999-3333",
      regiao: "Zona Norte",
      leadScore: 76,
      engajamento: "Alto",
      ultimaInteracao: "2024-05-25",
      origem: "WhatsApp",
      interesse: "Educação",
      interacoes: 18,
      tags: ["Educação"]
    },
    // Vou adicionar mais contatos para demonstrar a paginação
    ...Array.from({ length: 50 }, (_, i) => ({
      id: i + 4,
      nome: `Contato ${i + 4}`,
      tipo: i % 2 === 0 ? "Lead" : "Líder",
      email: `contato${i + 4}@email.com`,
      telefone: `(21) 99999-${String(i + 1000).slice(-4)}`,
      whatsapp: `(21) 99999-${String(i + 1000).slice(-4)}`,
      regiao: ["Zona Sul", "Centro", "Zona Norte", "Zona Oeste", "Barra"][i % 5],
      leadScore: Math.floor(Math.random() * 40) + 60,
      engajamento: ["Alto", "Médio", "Baixo"][i % 3],
      ultimaInteracao: "2024-05-20",
      origem: ["Instagram", "WhatsApp", "Evento", "Website"][i % 4],
      interesse: ["Saúde", "Educação", "Infraestrutura", "Economia"][i % 4],
      interacoes: Math.floor(Math.random() * 20) + 5,
      tags: [["Novo"], ["Ativo"], ["VIP"], ["Seguidor"]][i % 4],
      followUps: []
    }))
  ];

  // Filtrar e ordenar contatos
  const filteredContatos = contatos
    .filter(contato => {
      const matchesSearch = contato.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contato.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = selectedTag === "" || contato.tags?.includes(selectedTag);
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      if (!sortDirection) return b.leadScore - a.leadScore; // padrão por leadScore desc
      
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];
      
      // Tratamento especial para diferentes tipos de campos
      if (sortField === 'nome') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      } else if (sortField === 'engajamento') {
        const engajamentoOrder = { "Muito Alto": 4, "Alto": 3, "Médio": 2, "Baixo": 1 };
        aValue = engajamentoOrder[aValue] || 0;
        bValue = engajamentoOrder[bValue] || 0;
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

  // Paginação
  const totalPages = Math.ceil(filteredContatos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentContatos = filteredContatos.slice(startIndex, endIndex);

  // Obter todas as tags únicas
  const allTags = [...new Set(contatos.flatMap(contato => contato.tags || []))];

  const getEngajamentoColor = (engajamento: string) => {
    switch (engajamento) {
      case "Muito Alto": return "bg-red-100 text-red-800 border-red-200";
      case "Alto": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Médio": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Baixo": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTipoColor = (tipo: string) => {
    return tipo === "Lead" 
      ? "bg-blue-100 text-blue-800 border-blue-200"
      : "bg-purple-100 text-purple-800 border-purple-200";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <Award className="w-4 h-4 text-gold-500" />;
    if (score >= 75) return <Star className="w-4 h-4 text-orange-500" />;
    if (score >= 60) return <TrendingUp className="w-4 h-4 text-blue-500" />;
    return <Target className="w-4 h-4 text-gray-500" />;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'desc') {
        setSortDirection('asc');
      } else if (sortDirection === 'asc') {
        setSortDirection(null);
        setSortField('leadScore'); // volta para o padrão
      } else {
        setSortDirection('desc');
      }
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    if (sortDirection === 'desc') {
      return <ArrowDown className="w-4 h-4 text-indigo-600" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="w-4 h-4 text-indigo-600" />;
    }
    return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
  };

  const handleVerLead = (lead) => {
    setSelectedLead(lead);
    setIsLeadModalOpen(true);
  };

  const handleEditLead = (lead) => {
    setEditingLead(lead);
    setIsEditLeadModalOpen(true);
  };

  const handleAddFollowUp = (leadId: string, followUp: any) => {
    console.log('Adicionando follow up para lead:', leadId, followUp);
    // Aqui integraria com o backend
  };

  const handleUpdateFollowUp = (leadId: string, followUpId: string, followUp: any) => {
    console.log('Atualizando follow up:', leadId, followUpId, followUp);
    // Aqui integraria com o backend
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Contatos
          </h1>
          <p className="text-gray-600">
            Gerencie todos seus contatos com ranking de engajamento
          </p>
        </div>
        <Button 
          onClick={() => setIsNovoLeadModalOpen(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Contato
        </Button>
      </div>

      <Tabs defaultValue="lista" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lista">Lista de Contatos</TabsTrigger>
          <TabsTrigger value="upload">
            <Upload className="w-4 h-4 mr-2" />
            Upload CSV
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-6">
          {/* Filtros */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar contatos..."
                    className="pl-10 border-gray-200 focus:border-indigo-500 transition-colors"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-md focus:border-indigo-500 transition-colors"
                  >
                    <option value="">Todas as tags</option>
                    {allTags.map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                  <Button variant="outline" className="hover:bg-indigo-50 hover:border-indigo-300 transition-colors">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Total Contatos", valor: filteredContatos.length.toString(), cor: "from-indigo-500 to-indigo-600", icon: Users },
              { label: "Leads Ativos", valor: filteredContatos.filter(c => c.tipo === "Lead").length.toString(), cor: "from-blue-500 to-blue-600", icon: Target },
              { label: "Líderes", valor: filteredContatos.filter(c => c.tipo === "Líder").length.toString(), cor: "from-purple-500 to-purple-600", icon: Award },
              { label: "Score Médio", valor: Math.round(filteredContatos.reduce((acc, c) => acc + c.leadScore, 0) / filteredContatos.length || 0).toString(), cor: "from-pink-500 to-pink-600", icon: Activity }
            ].map((stat, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.cor} flex items-center justify-center mr-4`}>
                      <stat.icon className="text-white w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.valor}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabela de Contatos */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Ranking de Contatos
              </CardTitle>
              <CardDescription>
                Mostrando {currentContatos.length} de {filteredContatos.length} contatos (Página {currentPage} de {totalPages})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead 
                      className="cursor-pointer select-none hover:bg-gray-50 transition-colors min-w-[200px]"
                      onClick={() => handleSort('nome')}
                    >
                      <div className="flex items-center gap-2">
                        Contato
                        {getSortIcon('nome')}
                      </div>
                    </TableHead>
                    <TableHead className="w-32">WhatsApp</TableHead>
                    <TableHead className="w-20">Tipo</TableHead>
                    <TableHead 
                      className="cursor-pointer select-none hover:bg-gray-50 transition-colors w-20"
                      onClick={() => handleSort('leadScore')}
                    >
                      <div className="flex items-center gap-2">
                        Score
                        {getSortIcon('leadScore')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none hover:bg-gray-50 transition-colors w-28"
                      onClick={() => handleSort('engajamento')}
                    >
                      <div className="flex items-center gap-2">
                        Engajamento
                        {getSortIcon('engajamento')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none hover:bg-gray-50 transition-colors w-28"
                      onClick={() => handleSort('regiao')}
                    >
                      <div className="flex items-center gap-2">
                        Região
                        {getSortIcon('regiao')}
                      </div>
                    </TableHead>
                    <TableHead className="w-28">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentContatos.map((contato, index) => {
                    const globalIndex = startIndex + index;
                    return (
                      <TableRow key={contato.id} className="hover:bg-indigo-50/50">
                        <TableCell className="p-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-gray-600">#{globalIndex + 1}</span>
                            {globalIndex < 3 && (
                              <div className={`w-2 h-2 rounded-full ${
                                globalIndex === 0 ? 'bg-yellow-500' : 
                                globalIndex === 1 ? 'bg-gray-400' : 'bg-orange-600'
                              }`} />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="p-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-xs">
                                {contato.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </span>
                            </div>
                            <div>
                              <p 
                                className="font-semibold text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors text-sm"
                                onClick={() => handleVerLead(contato)}
                              >
                                {contato.nome}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                {contato.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="p-2">
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <MessageCircle className="w-3 h-3 text-green-500" />
                            {contato.whatsapp}
                          </div>
                        </TableCell>
                        <TableCell className="p-2">
                          <Badge className={`${getTipoColor(contato.tipo)} border text-xs`}>
                            {contato.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell className="p-2">
                          <div className="flex items-center gap-2">
                            {getScoreIcon(contato.leadScore)}
                            <span className="font-bold text-sm">{contato.leadScore}</span>
                          </div>
                        </TableCell>
                        <TableCell className="p-2">
                          <Badge className={`${getEngajamentoColor(contato.engajamento)} border text-xs`}>
                            {contato.engajamento}
                          </Badge>
                        </TableCell>
                        <TableCell className="p-2">
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <MapPin className="w-3 h-3" />
                            {contato.regiao}
                          </div>
                        </TableCell>
                        <TableCell className="p-2">
                          <div className="flex gap-1">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="hover:bg-indigo-50 text-xs h-7 px-2"
                              onClick={() => handleVerLead(contato)}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Ver
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="hover:bg-yellow-50 h-7 w-7 p-0"
                              onClick={() => handleEditLead(contato)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = currentPage - 2 + i;
                        }
                        
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink 
                              onClick={() => setCurrentPage(pageNumber)}
                              isActive={currentPage === pageNumber}
                              className="cursor-pointer"
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <UploadCSVContatos />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <LeadDetailsModal 
        lead={selectedLead}
        isOpen={isLeadModalOpen}
        onClose={() => {
          setIsLeadModalOpen(false);
          setSelectedLead(null);
        }}
        onEdit={handleEditLead}
        onAddFollowUp={handleAddFollowUp}
        onUpdateFollowUp={handleUpdateFollowUp}
      />
      
      <NovoLeadModal 
        isOpen={isNovoLeadModalOpen}
        onClose={() => setIsNovoLeadModalOpen(false)}
      />

      <EditLeadModal 
        lead={editingLead}
        isOpen={isEditLeadModalOpen}
        onClose={() => {
          setIsEditLeadModalOpen(false);
          setEditingLead(null);
        }}
      />
    </div>
  );
};

export default Contatos;
