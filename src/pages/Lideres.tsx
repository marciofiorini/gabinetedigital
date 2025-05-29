
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadDetailsModal } from "@/components/LeadDetailsModal";
import { NovoLiderModal } from "@/components/NovoLiderModal";
import { EditLeadModal } from "@/components/EditLeadModal";
import { UploadCSVLideres } from "@/components/UploadCSVLideres";
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
  Crown,
  Star,
  Users,
  TrendingUp,
  Activity,
  Upload,
  Edit,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MapPin
} from "lucide-react";

type SortField = 'nome' | 'influencia' | 'zona' | 'status';
type SortDirection = 'asc' | 'desc' | null;

const Lideres = () => {
  const [selectedLider, setSelectedLider] = useState(null);
  const [isLiderModalOpen, setIsLiderModalOpen] = useState(false);
  const [isNovoLiderModalOpen, setIsNovoLiderModalOpen] = useState(false);
  const [isEditLiderModalOpen, setIsEditLiderModalOpen] = useState(false);
  const [editingLider, setEditingLider] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>('influencia');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const itemsPerPage = 20;

  const lideres = [
    {
      id: 1,
      nome: "Carlos Mendes",
      email: "carlos@email.com",
      telefone: "(21) 99999-1111",
      zona: "Zona Sul",
      influencia: 9,
      status: "Ativo",
      observacoes: "Líder comunitário muito engajado",
      tags: ["Líder", "Saúde"],
      followUps: []
    },
    {
      id: 2,
      nome: "Maria da Silva",
      email: "maria@email.com", 
      telefone: "(21) 99999-2222",
      zona: "Centro",
      influencia: 8,
      status: "Ativo",
      observacoes: "Coordenadora de associação de moradores",
      tags: ["Coordenadora"],
      followUps: []
    },
    {
      id: 3,
      nome: "João Santos",
      email: "joao@email.com",
      telefone: "(21) 99999-3333", 
      zona: "Zona Norte",
      influencia: 7,
      status: "Ativo",
      observacoes: "Presidente do sindicato local",
      tags: ["Presidente"],
      followUps: []
    },
    // Adicionar mais líderes para demonstrar a paginação
    ...Array.from({ length: 30 }, (_, i) => ({
      id: i + 4,
      nome: `Líder ${i + 4}`,
      email: `lider${i + 4}@email.com`,
      telefone: `(21) 99999-${String(i + 1000).slice(-4)}`,
      zona: ["Zona Sul", "Centro", "Zona Norte", "Zona Oeste", "Barra"][i % 5],
      influencia: Math.floor(Math.random() * 6) + 4, // Entre 4 e 9
      status: ["Ativo", "Inativo"][i % 10 === 0 ? 1 : 0], // 90% ativos
      observacoes: `Observações sobre o líder ${i + 4}`,
      tags: [["Líder"], ["Coordenador"], ["Presidente"]][i % 3],
      followUps: []
    }))
  ];

  // Filtrar e ordenar líderes
  const filteredLideres = lideres
    .filter(lider => {
      const matchesSearch = lider.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lider.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      if (!sortDirection) return b.influencia - a.influencia; // padrão por influência desc
      
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];
      
      // Tratamento especial para diferentes tipos de campos
      if (sortField === 'nome') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

  // Paginação
  const totalPages = Math.ceil(filteredLideres.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLideres = filteredLideres.slice(startIndex, endIndex);

  const getInfluenciaColor = (influencia: number) => {
    if (influencia >= 8) return "bg-red-100 text-red-800 border-red-200";
    if (influencia >= 6) return "bg-orange-100 text-orange-800 border-orange-200";
    if (influencia >= 4) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  const getStatusColor = (status: string) => {
    return status === "Ativo" 
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getInfluenciaIcon = (influencia: number) => {
    if (influencia >= 8) return <Crown className="w-4 h-4 text-yellow-500" />;
    if (influencia >= 6) return <Star className="w-4 h-4 text-orange-500" />;
    return <TrendingUp className="w-4 h-4 text-blue-500" />;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'desc') {
        setSortDirection('asc');
      } else if (sortDirection === 'asc') {
        setSortDirection(null);
        setSortField('influencia'); // volta para o padrão
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

  const handleVerLider = (lider) => {
    // Converter formato de líder para formato de lead para usar o mesmo modal
    const liderAsLead = {
      ...lider,
      tipo: "Líder",
      regiao: lider.zona,
      leadScore: lider.influencia * 10, // Converter influência para score
      engajamento: lider.influencia >= 8 ? "Muito Alto" : lider.influencia >= 6 ? "Alto" : "Médio",
      ultimaInteracao: "2024-05-20",
      origem: "Comunidade",
      interesse: "Liderança"
    };
    setSelectedLider(liderAsLead);
    setIsLiderModalOpen(true);
  };

  const handleEditLider = (lider) => {
    const liderAsLead = {
      ...lider,
      tipo: "Líder",
      regiao: lider.zona,
      leadScore: lider.influencia * 10
    };
    setEditingLider(liderAsLead);
    setIsEditLiderModalOpen(true);
  };

  const handleAddFollowUp = (liderId: string, followUp: any) => {
    console.log('Adicionando follow up para líder:', liderId, followUp);
    // Aqui integraria com o backend
  };

  const handleUpdateFollowUp = (liderId: string, followUpId: string, followUp: any) => {
    console.log('Atualizando follow up:', liderId, followUpId, followUp);
    // Aqui integraria com o backend
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Líderes
          </h1>
          <p className="text-gray-600">
            Gerencie sua rede de líderes comunitários por nível de influência
          </p>
        </div>
        <Button 
          onClick={() => setIsNovoLiderModalOpen(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Líder
        </Button>
      </div>

      <Tabs defaultValue="lista" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lista">Lista de Líderes</TabsTrigger>
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
                    placeholder="Buscar líderes..."
                    className="pl-10 border-gray-200 focus:border-indigo-500 transition-colors"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
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
              { label: "Total Líderes", valor: filteredLideres.length.toString(), cor: "from-indigo-500 to-indigo-600", icon: Users },
              { label: "Líderes Ativos", valor: filteredLideres.filter(l => l.status === "Ativo").length.toString(), cor: "from-green-500 to-green-600", icon: TrendingUp },
              { label: "Alta Influência", valor: filteredLideres.filter(l => l.influencia >= 8).length.toString(), cor: "from-yellow-500 to-yellow-600", icon: Crown },
              { label: "Influência Média", valor: Math.round(filteredLideres.reduce((acc, l) => acc + l.influencia, 0) / filteredLideres.length || 0).toString(), cor: "from-purple-500 to-purple-600", icon: Activity }
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

          {/* Tabela de Líderes */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Ranking de Líderes por Influência
              </CardTitle>
              <CardDescription>
                Mostrando {currentLideres.length} de {filteredLideres.length} líderes (Página {currentPage} de {totalPages})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">#</TableHead>
                    <TableHead 
                      className="cursor-pointer select-none hover:bg-gray-50 transition-colors min-w-[250px]"
                      onClick={() => handleSort('nome')}
                    >
                      <div className="flex items-center gap-2">
                        Líder
                        {getSortIcon('nome')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none hover:bg-gray-50 transition-colors w-32"
                      onClick={() => handleSort('influencia')}
                    >
                      <div className="flex items-center gap-2">
                        Influência
                        {getSortIcon('influencia')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none hover:bg-gray-50 transition-colors w-32"
                      onClick={() => handleSort('zona')}
                    >
                      <div className="flex items-center gap-2">
                        Zona
                        {getSortIcon('zona')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none hover:bg-gray-50 transition-colors w-24"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-2">
                        Status
                        {getSortIcon('status')}
                      </div>
                    </TableHead>
                    <TableHead className="w-32">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentLideres.map((lider, index) => {
                    const globalIndex = startIndex + index;
                    return (
                      <TableRow key={lider.id} className="hover:bg-indigo-50/50">
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
                                {lider.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </span>
                            </div>
                            <div>
                              <p 
                                className="font-semibold text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors text-sm"
                                onClick={() => handleVerLider(lider)}
                              >
                                {lider.nome}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                {lider.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="p-2">
                          <div className="flex items-center gap-2">
                            {getInfluenciaIcon(lider.influencia)}
                            <Badge className={`${getInfluenciaColor(lider.influencia)} border text-xs`}>
                              Nível {lider.influencia}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="p-2">
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <MapPin className="w-3 h-3" />
                            {lider.zona}
                          </div>
                        </TableCell>
                        <TableCell className="p-2">
                          <Badge className={`${getStatusColor(lider.status)} border text-xs`}>
                            {lider.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="p-2">
                          <div className="flex gap-1">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="hover:bg-indigo-50 text-xs h-7 px-2"
                              onClick={() => handleVerLider(lider)}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Ver
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="hover:bg-yellow-50 h-7 w-7 p-0"
                              onClick={() => handleEditLider(lider)}
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
          <UploadCSVLideres />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <LeadDetailsModal 
        lead={selectedLider}
        isOpen={isLiderModalOpen}
        onClose={() => {
          setIsLiderModalOpen(false);
          setSelectedLider(null);
        }}
        onEdit={handleEditLider}
        onAddFollowUp={handleAddFollowUp}
        onUpdateFollowUp={handleUpdateFollowUp}
      />
      
      <NovoLiderModal 
        isOpen={isNovoLiderModalOpen}
        onClose={() => setIsNovoLiderModalOpen(false)}
      />

      <EditLeadModal 
        lead={editingLider}
        isOpen={isEditLiderModalOpen}
        onClose={() => {
          setIsEditLiderModalOpen(false);
          setEditingLider(null);
        }}
      />
    </div>
  );
};

export default Lideres;
