import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NovoLiderModal } from "@/components/NovoLiderModal";
import { UploadCSVLideres } from "@/components/UploadCSVLideres";
import { LeadDetailsModal } from "@/components/LeadDetailsModal";
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
  Phone, 
  Mail, 
  MapPin, 
  Users, 
  Crown, 
  Star,
  Award,
  TrendingUp,
  Upload,
  Eye
} from "lucide-react";

const Lideres = () => {
  const [isNovoLiderModalOpen, setIsNovoLiderModalOpen] = useState(false);
  const [selectedLider, setSelectedLider] = useState(null);
  const [isLiderModalOpen, setIsLiderModalOpen] = useState(false);

  const lideres = [
    {
      id: 1,
      nome: "Carlos Eduardo Silva",
      cargo: "Presidente Associação",
      organizacao: "Associação de Moradores Zona Sul",
      email: "carlos@associacao.com",
      telefone: "(21) 99999-1111",
      regiao: "Zona Sul",
      influencia: "Alta",
      seguidores: 2500,
      categoria: "Líder Comunitário",
      ultimoContato: "2024-05-27",
      leadScore: 85,
      engajamento: "Alto",
      ultimaInteracao: "2024-05-27",
      origem: "Evento",
      interesse: "Mobilidade Urbana",
      interacoes: 15,
      tags: ["Líder", "Associação"],
      followUps: [],
      tipo: "Líder"
    },
    {
      id: 2,
      nome: "Maria Santos Oliveira",
      cargo: "Diretora",
      organizacao: "Sindicato dos Professores",
      email: "maria@sindicato.com",
      telefone: "(21) 99999-2222",
      regiao: "Centro",
      influencia: "Muito Alta",
      seguidores: 4200,
      categoria: "Líder Sindical",
      ultimoContato: "2024-05-26",
      leadScore: 92,
      engajamento: "Muito Alto",
      ultimaInteracao: "2024-05-26",
      origem: "Reunião",
      interesse: "Educação",
      interacoes: 28,
      tags: ["VIP", "Educação"],
      followUps: [],
      tipo: "Líder"
    },
    {
      id: 3,
      nome: "João Pedro Costa",
      cargo: "Coordenador",
      organizacao: "ONG Meio Ambiente Verde",
      email: "joao@ongverde.org",
      telefone: "(21) 99999-3333",
      regiao: "Zona Norte",
      influencia: "Alta",
      seguidores: 1800,
      categoria: "Líder ONGs",
      ultimoContato: "2024-05-25",
      leadScore: 78,
      engajamento: "Alto",
      ultimaInteracao: "2024-05-25",
      origem: "Instagram",
      interesse: "Meio Ambiente",
      interacoes: 22,
      tags: ["ONG", "Sustentabilidade"],
      followUps: [],
      tipo: "Líder"
    },
    {
      id: 4,
      nome: "Ana Paula Ribeiro",
      cargo: "Empresária",
      organizacao: "Câmara de Comércio",
      email: "ana@camara.com",
      telefone: "(21) 99999-4444",
      regiao: "Zona Oeste",
      influencia: "Média",
      seguidores: 1200,
      categoria: "Líder Empresarial",
      ultimoContato: "2024-05-24",
      leadScore: 72,
      engajamento: "Médio",
      ultimaInteracao: "2024-05-24",
      origem: "Website",
      interesse: "Economia",
      interacoes: 18,
      tags: ["Empresário"],
      followUps: [],
      tipo: "Líder"
    }
  ];

  const getInfluenciaColor = (influencia: string) => {
    switch (influencia) {
      case "Muito Alta": return "bg-red-100 text-red-800 border-red-200";
      case "Alta": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Média": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Baixa": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case "Líder Comunitário": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Líder Sindical": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Líder ONGs": return "bg-green-100 text-green-800 border-green-200";
      case "Líder Empresarial": return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getInfluenciaIcon = (influencia: string) => {
    switch (influencia) {
      case "Muito Alta": return <Award className="w-4 h-4 text-red-500" />;
      case "Alta": return <Star className="w-4 h-4 text-orange-500" />;
      case "Média": return <TrendingUp className="w-4 h-4 text-yellow-500" />;
      default: return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleVerLider = (lider) => {
    setSelectedLider(lider);
    setIsLiderModalOpen(true);
  };

  const handleAddFollowUp = (liderId: string, followUp: any) => {
    console.log('Adicionando follow up para líder:', liderId, followUp);
  };

  const handleUpdateFollowUp = (liderId: string, followUpId: string, followUp: any) => {
    console.log('Atualizando follow up:', liderId, followUpId, followUp);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Líderes
          </h1>
          <p className="text-gray-600">
            Gerencie relacionamentos com líderes comunitários e influenciadores
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
                  />
                </div>
                <Button variant="outline" className="hover:bg-indigo-50 hover:border-indigo-300 transition-colors">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Total Líderes", valor: "89", cor: "from-indigo-500 to-indigo-600", icon: Crown },
              { label: "Influência Alta", valor: "24", cor: "from-orange-500 to-orange-600", icon: Star },
              { label: "Organizações", valor: "45", cor: "from-purple-500 to-purple-600", icon: Users },
              { label: "Seguidores Total", valor: "12.8k", cor: "from-pink-500 to-pink-600", icon: TrendingUp }
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
                Lista de Líderes
              </CardTitle>
              <CardDescription>
                Ordenado por nível de influência
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Líder</TableHead>
                    <TableHead>Organização</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Influência</TableHead>
                    <TableHead>Região</TableHead>
                    <TableHead>Seguidores</TableHead>
                    <TableHead>Último Contato</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lideres.map((lider) => (
                    <TableRow key={lider.id} className="hover:bg-indigo-50/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {lider.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{lider.nome}</p>
                            <p className="text-sm text-gray-600">{lider.cargo}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="w-3 h-3" />
                              {lider.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-gray-900">{lider.organizacao}</p>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="w-3 h-3" />
                          {lider.telefone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getCategoriaColor(lider.categoria)} border`}>
                          {lider.categoria}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getInfluenciaIcon(lider.influencia)}
                          <Badge className={`${getInfluenciaColor(lider.influencia)} border`}>
                            {lider.influencia}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          {lider.regiao}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <span className="font-semibold text-indigo-600">{lider.seguidores}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{lider.ultimoContato}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="hover:bg-indigo-50"
                            onClick={() => handleVerLider(lider)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Ver
                          </Button>
                          <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                            Contatar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <UploadCSVLideres />
        </TabsContent>
      </Tabs>

      {/* Modal Novo Líder */}
      <NovoLiderModal 
        isOpen={isNovoLiderModalOpen}
        onClose={() => setIsNovoLiderModalOpen(false)}
      />

      {/* Modal Detalhes do Líder com Follow Up */}
      <LeadDetailsModal 
        lead={selectedLider}
        isOpen={isLiderModalOpen}
        onClose={() => {
          setIsLiderModalOpen(false);
          setSelectedLider(null);
        }}
        onAddFollowUp={handleAddFollowUp}
        onUpdateFollowUp={handleUpdateFollowUp}
      />
    </div>
  );
};

export default Lideres;
