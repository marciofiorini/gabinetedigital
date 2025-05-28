
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Plus, Send, Mail, Eye, Clock, Users, TrendingUp, FileText } from "lucide-react";

const Email = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const campanhas = [
    {
      id: 1,
      assunto: "Relatório Mensal das Atividades - Maio 2024",
      destinatarios: 1250,
      enviados: 1250,
      abertos: 987,
      cliques: 156,
      data: "2024-05-27",
      status: "Enviada",
      tipo: "Newsletter"
    },
    {
      id: 2,
      assunto: "Convite: Audiência Pública sobre Mobilidade Urbana",
      destinatarios: 456,
      enviados: 456,
      abertos: 378,
      cliques: 89,
      data: "2024-05-25",
      status: "Enviada",
      tipo: "Convite"
    },
    {
      id: 3,
      assunto: "Prestação de Contas - 1º Trimestre 2024",
      destinatarios: 2340,
      enviados: 0,
      abertos: 0,
      cliques: 0,
      data: "2024-05-30",
      status: "Agendada",
      tipo: "Relatório"
    }
  ];

  const listas = [
    { nome: "Líderes Comunitários", contatos: 234, ativo: true },
    { nome: "Empresários Locais", contatos: 156, ativo: true },
    { nome: "Profissionais da Saúde", contatos: 89, ativo: true },
    { nome: "Educadores", contatos: 67, ativo: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-100 flex">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                  Gestão de E-mail
                </h1>
                <p className="text-gray-600">
                  Campanhas, newsletters e comunicação direta
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="hover:bg-blue-50 hover:border-blue-300">
                  <FileText className="w-4 h-4 mr-2" />
                  Modelo
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Campanha
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Total de Contatos", valor: "3.2k", icone: Users, cor: "from-blue-500 to-blue-600", desc: "+120 este mês" },
              { label: "Taxa de Abertura", valor: "78.9%", icone: Eye, cor: "from-green-500 to-green-600", desc: "+5.2% vs anterior" },
              { label: "Taxa de Clique", valor: "12.4%", icone: TrendingUp, cor: "from-purple-500 to-purple-600", desc: "+2.1% vs anterior" },
              { label: "Campanhas Ativas", valor: "5", icone: Send, cor: "from-orange-500 to-orange-600", desc: "2 agendadas" }
            ].map((stat, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.cor} flex items-center justify-center mr-4`}>
                      <stat.icone className="text-white w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.valor}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{stat.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Campanhas */}
            <Card className="xl:col-span-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  Campanhas de E-mail
                </CardTitle>
                <CardDescription>
                  Gerencie suas campanhas e newsletters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campanhas.map((campanha) => (
                    <Card key={campanha.id} className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {campanha.tipo}
                              </Badge>
                              <Badge className={
                                campanha.status === 'Enviada' ? 'bg-green-100 text-green-800' :
                                'bg-yellow-100 text-yellow-800'
                              }>
                                {campanha.status}
                              </Badge>
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">{campanha.assunto}</h4>
                            <p className="text-xs text-gray-500">Enviado em: {campanha.data}</p>
                          </div>
                        </div>

                        {campanha.status === 'Enviada' && (
                          <>
                            <div className="grid grid-cols-4 gap-4 mb-4">
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <Send className="w-4 h-4 text-blue-500" />
                                  <span className="font-bold text-blue-600">{campanha.enviados}</span>
                                </div>
                                <p className="text-xs text-gray-500">Enviados</p>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <Eye className="w-4 h-4 text-green-500" />
                                  <span className="font-bold text-green-600">{campanha.abertos}</span>
                                </div>
                                <p className="text-xs text-gray-500">Abertos</p>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <TrendingUp className="w-4 h-4 text-purple-500" />
                                  <span className="font-bold text-purple-600">{campanha.cliques}</span>
                                </div>
                                <p className="text-xs text-gray-500">Cliques</p>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <Users className="w-4 h-4 text-orange-500" />
                                  <span className="font-bold text-orange-600">{campanha.destinatarios}</span>
                                </div>
                                <p className="text-xs text-gray-500">Contatos</p>
                              </div>
                            </div>

                            <div className="space-y-2 mb-3">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Taxa de Abertura</span>
                                  <span>{((campanha.abertos / campanha.enviados) * 100).toFixed(1)}%</span>
                                </div>
                                <Progress value={(campanha.abertos / campanha.enviados) * 100} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Taxa de Clique</span>
                                  <span>{((campanha.cliques / campanha.abertos) * 100).toFixed(1)}%</span>
                                </div>
                                <Progress value={(campanha.cliques / campanha.abertos) * 100} className="h-2" />
                              </div>
                            </div>
                          </>
                        )}

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            {campanha.status === 'Agendada' ? 'Editar' : 'Ver Relatório'}
                          </Button>
                          <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                            {campanha.status === 'Agendada' ? 'Enviar Agora' : 'Duplicar'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Listas e Automações */}
            <div className="space-y-6">
              {/* Listas de Contatos */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    Listas de Contatos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {listas.map((lista, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm text-gray-900">{lista.nome}</p>
                          <p className="text-xs text-gray-600">{lista.contatos} contatos</p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${lista.ativo ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 hover:bg-blue-50 hover:border-blue-300">
                    Nova Lista
                  </Button>
                </CardContent>
              </Card>

              {/* Automações */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    Automações Ativas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <p className="font-medium text-sm text-gray-900">Boas-vindas</p>
                      <p className="text-xs text-gray-600">Enviado para novos contatos</p>
                      <Badge className="mt-2 bg-green-100 text-green-800">Ativa</Badge>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <p className="font-medium text-sm text-gray-900">Newsletter Semanal</p>
                      <p className="text-xs text-gray-600">Toda sexta às 18:00</p>
                      <Badge className="mt-2 bg-green-100 text-green-800">Ativa</Badge>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <p className="font-medium text-sm text-gray-900">Aniversário</p>
                      <p className="text-xs text-gray-600">Parabéns personalizados</p>
                      <Badge className="mt-2 bg-yellow-100 text-yellow-800">Pausada</Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4 hover:bg-purple-50 hover:border-purple-300">
                    Nova Automação
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Email;
