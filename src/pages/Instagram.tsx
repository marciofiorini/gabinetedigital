
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Plus, Heart, MessageCircle, Send, Eye, Calendar, TrendingUp, Image } from "lucide-react";

const Instagram = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const posts = [
    {
      id: 1,
      tipo: "Imagem",
      conteudo: "Visitei a UBS Central hoje para acompanhar os investimentos em saúde...",
      likes: 234,
      comentarios: 18,
      alcance: 1250,
      data: "2024-05-27",
      status: "Publicado"
    },
    {
      id: 2,
      tipo: "Carrossel",
      conteudo: "Obra da nova escola está 70% concluída. Confira o progresso...",
      likes: 189,
      comentarios: 12,
      alcance: 980,
      data: "2024-05-26",
      status: "Publicado"
    },
    {
      id: 3,
      tipo: "Reel",
      conteudo: "Audiência pública sobre mobilidade urbana - amanhã às 14h",
      likes: 0,
      comentarios: 0,
      alcance: 0,
      data: "2024-05-28",
      status: "Agendado"
    }
  ];

  const stories = [
    { id: 1, conteudo: "Reunião com prefeitos", visualizacoes: 456, ativo: true },
    { id: 2, conteudo: "Visita à obra da escola", visualizacoes: 234, ativo: true },
    { id: 3, conteudo: "Anúncio audiência pública", visualizacoes: 189, ativo: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50 to-purple-100 flex">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Gestão Instagram
                </h1>
                <p className="text-gray-600">
                  Monitore e gerencie sua presença no Instagram
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="hover:bg-pink-50 hover:border-pink-300">
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar Post
                </Button>
                <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Conteúdo
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Seguidores", valor: "12.5k", icone: Eye, cor: "from-pink-500 to-pink-600", crescimento: "+5.2%" },
              { label: "Engajamento", valor: "8.7%", icone: Heart, cor: "from-red-500 to-red-600", crescimento: "+2.1%" },
              { label: "Alcance Semanal", valor: "25.3k", icone: TrendingUp, cor: "from-purple-500 to-purple-600", crescimento: "+12%" },
              { label: "Posts do Mês", valor: "18", icone: Image, cor: "from-blue-500 to-blue-600", crescimento: "+3" }
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
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      {stat.crescimento}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Posts Recentes */}
            <Card className="xl:col-span-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5 text-pink-600" />
                  Posts Recentes
                </CardTitle>
                <CardDescription>
                  Acompanhe o desempenho dos seus posts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {posts.map((post) => (
                    <Card key={post.id} className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
                                {post.tipo}
                              </Badge>
                              <Badge className={
                                post.status === 'Publicado' ? 'bg-green-100 text-green-800' :
                                'bg-yellow-100 text-yellow-800'
                              }>
                                {post.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 mb-3">{post.conteudo}</p>
                            <p className="text-xs text-gray-500">{post.data}</p>
                          </div>
                        </div>

                        {post.status === 'Publicado' && (
                          <>
                            <div className="grid grid-cols-3 gap-4 mb-4">
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <Heart className="w-4 h-4 text-red-500" />
                                  <span className="font-bold text-red-600">{post.likes}</span>
                                </div>
                                <p className="text-xs text-gray-500">Likes</p>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <MessageCircle className="w-4 h-4 text-blue-500" />
                                  <span className="font-bold text-blue-600">{post.comentarios}</span>
                                </div>
                                <p className="text-xs text-gray-500">Comentários</p>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <Eye className="w-4 h-4 text-purple-500" />
                                  <span className="font-bold text-purple-600">{post.alcance}</span>
                                </div>
                                <p className="text-xs text-gray-500">Alcance</p>
                              </div>
                            </div>

                            <div className="mb-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Taxa de Engajamento</span>
                                <span>{((post.likes + post.comentarios) / post.alcance * 100).toFixed(1)}%</span>
                              </div>
                              <Progress value={(post.likes + post.comentarios) / post.alcance * 100} className="h-2" />
                            </div>
                          </>
                        )}

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            Ver Post
                          </Button>
                          <Button size="sm" className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
                            {post.status === 'Agendado' ? 'Editar' : 'Análise'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stories e Métricas */}
            <div className="space-y-6">
              {/* Stories */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    Stories Ativos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stories.map((story) => (
                      <div key={story.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm text-gray-900">{story.conteudo}</p>
                          <p className="text-xs text-gray-600">{story.visualizacoes} visualizações</p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${story.ativo ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 hover:bg-purple-50 hover:border-purple-300">
                    Novo Story
                  </Button>
                </CardContent>
              </Card>

              {/* Engajamento Semanal */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Engajamento Semanal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Likes</span>
                        <span className="font-bold">+15%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Comentários</span>
                        <span className="font-bold">+8%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Compartilhamentos</span>
                        <span className="font-bold">+22%</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Salvamentos</span>
                        <span className="font-bold">+12%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Instagram;
