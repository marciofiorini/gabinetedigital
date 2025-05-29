
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadDetailsModal } from "@/components/LeadDetailsModal";
import { NovoLeadModal } from "@/components/NovoLeadModal";
import { UploadCSVContatos } from "@/components/UploadCSVContatos";
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
  TrendingUp, 
  Star, 
  Award,
  Users,
  Target,
  Activity,
  MessageCircle,
  Instagram,
  Calendar,
  Upload
} from "lucide-react";

const Contatos = () => {
  const [selectedLead, setSelectedLead] = useState(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isNovoLeadModalOpen, setIsNovoLeadModalOpen] = useState(false);

  const contatos = [
    {
      id: 1,
      nome: "Ana Paula Ribeiro",
      tipo: "Lead",
      email: "ana@email.com",
      telefone: "(21) 99999-1111",
      regiao: "Zona Sul",
      leadScore: 95,
      engajamento: "Muito Alto",
      ultimaInteracao: "2024-05-27",
      origem: "Instagram",
      interesse: "Saúde Pública",
      interacoes: 24
    },
    {
      id: 2,
      nome: "José da Silva",
      tipo: "Líder",
      email: "jose@email.com",
      telefone: "(21) 99999-2222",
      regiao: "Centro",
      leadScore: 88,
      engajamento: "Alto",
      ultimaInteracao: "2024-05-26",
      origem: "Evento",
      interesse: "Infraestrutura",
      interacoes: 31
    },
    {
      id: 3,
      nome: "Maria Santos",
      tipo: "Lead",
      email: "maria@email.com",
      telefone: "(21) 99999-3333",
      regiao: "Zona Norte",
      leadScore: 76,
      engajamento: "Alto",
      ultimaInteracao: "2024-05-25",
      origem: "WhatsApp",
      interesse: "Educação",
      interacoes: 18
    },
    {
      id: 4,
      nome: "Carlos Oliveira",
      tipo: "Líder",
      email: "carlos@email.com",
      telefone: "(21) 99999-4444",
      regiao: "Zona Oeste",
      leadScore: 72,
      engajamento: "Médio",
      ultimaInteracao: "2024-05-24",
      origem: "Indicação",
      interesse: "Economia",
      interacoes: 15
    },
    {
      id: 5,
      nome: "Lucia Fernandes",
      tipo: "Lead",
      email: "lucia@email.com",
      telefone: "(21) 99999-5555",
      regiao: "Barra",
      leadScore: 65,
      engajamento: "Médio",
      ultimaInteracao: "2024-05-23",
      origem: "Website",
      interesse: "Meio Ambiente",
      interacoes: 12
    }
  ];

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

  // Ordenar por lead score (maior para menor)
  const contatosOrdenados = [...contatos].sort((a, b) => b.leadScore - a.leadScore);

  const handleVerLead = (lead) => {
    setSelectedLead(lead);
    setIsLeadModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
              { label: "Total Contatos", valor: "156", cor: "from-indigo-500 to-indigo-600", icon: Users },
              { label: "Leads Ativos", valor: "89", cor: "from-blue-500 to-blue-600", icon: Target },
              { label: "Líderes", valor: "67", cor: "from-purple-500 to-purple-600", icon: Award },
              { label: "Score Médio", valor: "78", cor: "from-pink-500 to-pink-600", icon: Activity }
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
                Ordenado por Lead Score - Maior engajamento primeiro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Engajamento</TableHead>
                    <TableHead>Região</TableHead>
                    <TableHead>Interações</TableHead>
                    <TableHead>Última Interação</TableHead>
                    <TableHead>Canais</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contatosOrdenados.map((contato, index) => (
                    <TableRow key={contato.id} className="hover:bg-indigo-50/50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg text-gray-600">#{index + 1}</span>
                          {index < 3 && (
                            <div className={`w-2 h-2 rounded-full ${
                              index === 0 ? 'bg-yellow-500' : 
                              index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                            }`} />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {contato.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{contato.nome}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="w-3 h-3" />
                              {contato.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getTipoColor(contato.tipo)} border`}>
                          {contato.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getScoreIcon(contato.leadScore)}
                          <span className="font-bold text-lg">{contato.leadScore}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getEngajamentoColor(contato.engajamento)} border`}>
                          {contato.engajamento}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          {contato.regiao}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <span className="font-semibold text-indigo-600">{contato.interacoes}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{contato.ultimaInteracao}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="p-1 h-7 w-7">
                            <MessageCircle className="w-3 h-3 text-green-600" />
                          </Button>
                          <Button size="sm" variant="outline" className="p-1 h-7 w-7">
                            <Instagram className="w-3 h-3 text-pink-600" />
                          </Button>
                          <Button size="sm" variant="outline" className="p-1 h-7 w-7">
                            <Calendar className="w-3 h-3 text-blue-600" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="hover:bg-indigo-50"
                            onClick={() => handleVerLead(contato)}
                          >
                            Ver
                          </Button>
                          <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                            Chat
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
      />
      
      <NovoLeadModal 
        isOpen={isNovoLeadModalOpen}
        onClose={() => setIsNovoLeadModalOpen(false)}
      />
    </div>
  );
};

export default Contatos;
