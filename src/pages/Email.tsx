
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Send, 
  Plus, 
  Search, 
  Filter, 
  Mail, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Users,
  BarChart3,
  Eye
} from "lucide-react";

const Email = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const campanhas = [
    {
      id: 1,
      titulo: "Newsletter Semanal - Propostas da Semana",
      assunto: "Confira as principais propostas desta semana",
      status: "Enviada",
      destinatarios: 2340,
      enviadoEm: "2024-05-27 10:00",
      taxaAbertura: "68%",
      taxaClique: "12%"
    },
    {
      id: 2,
      titulo: "Convite - Audiência Pública Mobilidade",
      assunto: "Você está convidado para nossa audiência pública",
      status: "Agendada",
      destinatarios: 1580,
      enviadoEm: "2024-05-28 14:00",
      taxaAbertura: "-",
      taxaClique: "-"
    },
    {
      id: 3,
      titulo: "Relatório Mensal de Atividades",
      assunto: "Veja o que realizamos em maio",
      status: "Rascunho",
      destinatarios: 0,
      enviadoEm: "-",
      taxaAbertura: "-",
      taxaClique: "-"
    }
  ];

  const contatos = [
    {
      id: 1,
      nome: "Ana Silva",
      email: "ana@email.com",
      categoria: "Líderes Comunitários",
      status: "Ativo",
      inscricao: "2024-05-20"
    },
    {
      id: 2,
      nome: "João Santos",
      email: "joao@email.com",
      categoria: "Apoiadores",
      status: "Ativo",
      inscricao: "2024-05-18"
    },
    {
      id: 3,
      nome: "Maria Costa",
      email: "maria@email.com",
      categoria: "Imprensa",
      status: "Inativo",
      inscricao: "2024-05-15"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Enviada": return "bg-green-100 text-green-800 border-green-200";
      case "Agendada": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Rascunho": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Enviada": return <CheckCircle className="w-4 h-4" />;
      case "Agendada": return <Clock className="w-4 h-4" />;
      case "Rascunho": return <AlertCircle className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            E-mail Marketing
          </h1>
          <p className="text-gray-600">
            Gerencie campanhas de e-mail e comunicação com eleitores
          </p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
          <Plus className="w-4 h-4 mr-2" />
          Nova Campanha
        </Button>
      </div>

      <Tabs defaultValue="campanhas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campanhas">Campanhas</TabsTrigger>
          <TabsTrigger value="contatos">Contatos</TabsTrigger>
          <TabsTrigger value="nova-campanha">Nova Campanha</TabsTrigger>
        </TabsList>

        <TabsContent value="campanhas" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Total Campanhas", valor: "24", cor: "from-indigo-500 to-indigo-600", icon: Mail },
              { label: "Enviadas", valor: "18", cor: "from-green-500 to-green-600", icon: CheckCircle },
              { label: "Taxa Abertura", valor: "64%", cor: "from-blue-500 to-blue-600", icon: Eye },
              { label: "Total Contatos", valor: "3.2k", cor: "from-purple-500 to-purple-600", icon: Users }
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

          {/* Filtros */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar campanhas..."
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

          {/* Lista de Campanhas */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Campanhas de E-mail
              </CardTitle>
              <CardDescription>
                Acompanhe o desempenho das suas campanhas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campanha</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Destinatários</TableHead>
                    <TableHead>Taxa Abertura</TableHead>
                    <TableHead>Taxa Clique</TableHead>
                    <TableHead>Enviado em</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campanhas.map((campanha) => (
                    <TableRow key={campanha.id} className="hover:bg-indigo-50/50">
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-900">{campanha.titulo}</p>
                          <p className="text-sm text-gray-600">{campanha.assunto}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(campanha.status)} border flex items-center gap-1 w-fit`}>
                          {getStatusIcon(campanha.status)}
                          {campanha.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-indigo-600" />
                          <span className="font-semibold">{campanha.destinatarios}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-green-600">{campanha.taxaAbertura}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-blue-600">{campanha.taxaClique}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{campanha.enviadoEm}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="hover:bg-indigo-50">
                            <BarChart3 className="w-3 h-3 mr-1" />
                            Relatório
                          </Button>
                          <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                            Editar
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

        <TabsContent value="contatos" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Lista de Contatos
              </CardTitle>
              <CardDescription>
                Gerencie sua base de contatos para e-mail
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Inscrição</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contatos.map((contato) => (
                    <TableRow key={contato.id} className="hover:bg-indigo-50/50">
                      <TableCell className="font-semibold">{contato.nome}</TableCell>
                      <TableCell>{contato.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{contato.categoria}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={contato.status === "Ativo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {contato.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{contato.inscricao}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Editar</Button>
                          <Button size="sm" variant="destructive">Remover</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nova-campanha" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Nova Campanha de E-mail
              </CardTitle>
              <CardDescription>
                Crie uma nova campanha de e-mail marketing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Título da Campanha</label>
                <Input placeholder="Ex: Newsletter Semanal - Junho 2024" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Assunto do E-mail</label>
                <Input placeholder="Ex: Confira as principais propostas desta semana" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Conteúdo do E-mail</label>
                <Textarea 
                  placeholder="Digite o conteúdo do seu e-mail aqui..."
                  className="min-h-[200px]"
                />
              </div>
              <div className="flex gap-4">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Agora
                </Button>
                <Button variant="outline">
                  Salvar Rascunho
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Email;
