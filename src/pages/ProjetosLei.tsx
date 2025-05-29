
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Calendar, 
  Users, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  Plus,
  Search,
  Vote,
  Scale,
  BookOpen
} from "lucide-react";

const ProjetosLei = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const projetos = [
    {
      id: 1,
      numero: "PL-2024-015",
      titulo: "Lei de Incentivo ao Esporte Juvenil",
      tipo: "Projeto de Lei",
      autor: "Vereador João Silva",
      dataApresentacao: "2024-05-15",
      status: "tramitacao",
      comissao: "Educação e Esporte",
      prazoVotacao: "2024-06-30",
      situacao: "Aguardando parecer da comissão"
    },
    {
      id: 2,
      numero: "IND-2024-032",
      titulo: "Indicação para melhoria da iluminação pública",
      tipo: "Indicação",
      autor: "Vereadora Maria Santos", 
      dataApresentacao: "2024-05-20",
      status: "aprovado",
      comissao: "Obras e Serviços",
      prazoVotacao: "2024-05-28",
      situacao: "Aprovado e encaminhado ao executivo"
    },
    {
      id: 3,
      numero: "REQ-2024-089",
      titulo: "Requerimento de informações sobre licitações",
      tipo: "Requerimento",
      autor: "Vereador Carlos Lima",
      dataApresentacao: "2024-05-25",
      status: "pendente",
      comissao: "Fiscalização",
      prazoVotacao: "2024-06-15",
      situacao: "Aguardando resposta do executivo"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente": return "bg-yellow-100 text-yellow-800";
      case "tramitacao": return "bg-blue-100 text-blue-800";
      case "aprovado": return "bg-green-100 text-green-800";
      case "rejeitado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pendente": return <Clock className="w-4 h-4" />;
      case "tramitacao": return <AlertTriangle className="w-4 h-4" />;
      case "aprovado": return <CheckCircle className="w-4 h-4" />;
      case "rejeitado": return <AlertTriangle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Projetos de Lei e Indicações
        </h1>
        <p className="text-gray-600">
          Controle de tramitação legislativa, prazos e votações
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Projetos Ativos", valor: "23", icone: FileText, cor: "from-blue-500 to-blue-600" },
          { label: "Em Tramitação", valor: "12", icone: Clock, cor: "from-yellow-500 to-yellow-600" },
          { label: "Aprovados", valor: "8", icone: CheckCircle, cor: "from-green-500 to-green-600" },
          { label: "Pendentes", valor: "3", icone: AlertTriangle, cor: "from-red-500 to-red-600" }
        ].map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.cor} flex items-center justify-center mr-4`}>
                    <stat.icone className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.valor}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="projetos" className="space-y-6">
        <TabsList>
          <TabsTrigger value="projetos">Projetos Ativos</TabsTrigger>
          <TabsTrigger value="novo">Novo Projeto</TabsTrigger>
          <TabsTrigger value="votacoes">Agenda de Votações</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="projetos" className="space-y-6">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="search"
                placeholder="Buscar projetos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Projeto
            </Button>
          </div>

          <div className="space-y-4">
            {projetos.map((projeto) => (
              <Card key={projeto.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{projeto.numero}</Badge>
                      <Badge className={getStatusColor(projeto.status)}>
                        {getStatusIcon(projeto.status)}
                        <span className="ml-1">{projeto.status}</span>
                      </Badge>
                      <Badge variant="secondary">{projeto.tipo}</Badge>
                    </div>
                    <span className="text-sm text-gray-500">{projeto.dataApresentacao}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{projeto.titulo}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>Autor: {projeto.autor}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Scale className="w-4 h-4" />
                      <span>Comissão: {projeto.comissao}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Prazo: {projeto.prazoVotacao}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>{projeto.situacao}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Ver Tramitação</Button>
                    <Button variant="outline" size="sm">Anexar Documentos</Button>
                    <Button size="sm">Atualizar Status</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="novo" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Novo Projeto Legislativo</CardTitle>
              <CardDescription>
                Registre um novo projeto de lei, indicação ou requerimento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tipo de Projeto</label>
                  <Input placeholder="Projeto de Lei, Indicação, Requerimento..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Número/Protocolo</label>
                  <Input placeholder="Ex: PL-2024-016" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Título do Projeto</label>
                <Input placeholder="Título completo do projeto" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Ementa/Descrição</label>
                <Textarea placeholder="Descreva o objetivo e conteúdo do projeto..." rows={4} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Autor Principal</label>
                  <Input placeholder="Nome do autor" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Comissão Responsável</label>
                  <Input placeholder="Ex: Educação, Saúde, Obras..." />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Data de Apresentação</label>
                  <Input type="date" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Prazo para Votação</label>
                  <Input type="date" />
                </div>
              </div>
              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Projeto
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="votacoes" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Agenda de Votações</CardTitle>
              <CardDescription>
                Cronograma de votações e sessões legislativas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { data: "2024-06-05", sessao: "Sessão Ordinária", projetos: ["PL-2024-015", "IND-2024-032"] },
                  { data: "2024-06-12", sessao: "Sessão Extraordinária", projetos: ["REQ-2024-089"] },
                  { data: "2024-06-19", sessao: "Sessão Ordinária", projetos: ["PL-2024-018", "PL-2024-019"] }
                ].map((agenda, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-blue-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-blue-900">{agenda.sessao}</h4>
                      <Badge className="bg-blue-100 text-blue-800">
                        <Calendar className="w-3 h-3 mr-1" />
                        {agenda.data}
                      </Badge>
                    </div>
                    <div className="text-sm text-blue-800">
                      <strong>Projetos em pauta:</strong>
                      <div className="flex gap-2 mt-1">
                        {agenda.projetos.map((projeto, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {projeto}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historico" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Histórico de Projetos</CardTitle>
              <CardDescription>
                Registro completo de projetos aprovados e rejeitados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Histórico de projetos será exibido aqui</p>
                <p className="text-sm text-gray-400 mt-2">
                  Inclui projetos aprovados, rejeitados e arquivados
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjetosLei;
