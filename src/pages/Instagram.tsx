
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Instagram as InstagramIcon, 
  Plus, 
  Search, 
  Filter, 
  Heart, 
  MessageCircle, 
  Send, 
  Users,
  BarChart3,
  TrendingUp,
  Calendar,
  Image
} from "lucide-react";

const Instagram = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const posts = [
    {
      id: 1,
      conteudo: "Visitando obras da nova escola no bairro Esperança! 🏫✨",
      imagem: "/placeholder.svg",
      dataPublicacao: "2024-05-27 14:30",
      curtidas: 245,
      comentarios: 18,
      compartilhamentos: 12,
      alcance: 1850,
      status: "Publicado"
    },
    {
      id: 2,
      conteudo: "Audiência pública sobre mobilidade urbana foi um sucesso! 🚌🚶‍♀️",
      imagem: "/placeholder.svg",
      dataPublicacao: "2024-05-26 16:00",
      curtidas: 189,
      comentarios: 23,
      compartilhamentos: 8,
      alcance: 1420,
      status: "Publicado"
    },
    {
      id: 3,
      conteudo: "Proposta para criação de mais áreas verdes na cidade 🌳🌱",
      imagem: "/placeholder.svg",
      dataPublicacao: "2024-05-28 10:00",
      curtidas: 0,
      comentarios: 0,
      compartilhamentos: 0,
      alcance: 0,
      status: "Agendado"
    }
  ];

  const stories = [
    {
      id: 1,
      titulo: "Reunião Comunidade",
      visualizacoes: 450,
      dataPublicacao: "2024-05-27 09:00",
      status: "Ativo"
    },
    {
      id: 2,
      titulo: "Bastidores Sessão",
      visualizacoes: 320,
      dataPublicacao: "2024-05-27 15:30",
      status: "Ativo"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Publicado": return "bg-green-100 text-green-800 border-green-200";
      case "Agendado": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Rascunho": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Instagram
          </h1>
          <p className="text-gray-600">
            Gerencie sua presença no Instagram e engajamento
          </p>
        </div>
        <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
          <Plus className="w-4 h-4 mr-2" />
          Novo Post
        </Button>
      </div>

      <Tabs defaultValue="posts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="stories">Stories</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="novo-post">Novo Post</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Seguidores", valor: "12.4k", cor: "from-pink-500 to-pink-600", icon: Users },
              { label: "Posts este mês", valor: "28", cor: "from-purple-500 to-purple-600", icon: InstagramIcon },
              { label: "Engajamento", valor: "8.2%", cor: "from-blue-500 to-blue-600", icon: TrendingUp },
              { label: "Alcance médio", valor: "1.8k", cor: "from-indigo-500 to-indigo-600", icon: BarChart3 }
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
                    placeholder="Buscar posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-pink-500 transition-colors"
                  />
                </div>
                <Button variant="outline" className="hover:bg-pink-50 hover:border-pink-300 transition-colors">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Grid de Posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {/* Imagem do Post */}
                    <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <Image className="w-8 h-8 text-pink-600" />
                    </div>

                    {/* Conteúdo */}
                    <div className="space-y-2">
                      <p className="text-sm text-gray-900 line-clamp-3">{post.conteudo}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{post.dataPublicacao}</span>
                        <Badge className={`${getStatusColor(post.status)} border`}>
                          {post.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Métricas */}
                    {post.status === "Publicado" && (
                      <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-red-500" />
                          <span>{post.curtidas}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3 text-blue-500" />
                          <span>{post.comentarios}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Send className="w-3 h-3 text-green-500" />
                          <span>{post.compartilhamentos}</span>
                        </div>
                      </div>
                    )}

                    {/* Ações */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="hover:bg-pink-50 flex-1">
                        Ver
                      </Button>
                      <Button size="sm" className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 flex-1">
                        Editar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stories" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Stories Ativos
              </CardTitle>
              <CardDescription>
                Gerencie seus stories do Instagram
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stories.map((story) => (
                  <Card key={story.id} className="border border-pink-200">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="aspect-[9/16] bg-gradient-to-b from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
                          <InstagramIcon className="w-6 h-6 text-pink-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">{story.titulo}</h4>
                          <p className="text-xs text-gray-500">{story.dataPublicacao}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Users className="w-3 h-3 text-pink-600" />
                            <span className="text-xs text-gray-600">{story.visualizacoes} views</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Gráficos de analytics serão implementados aqui</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="novo-post" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Criar Novo Post
              </CardTitle>
              <CardDescription>
                Crie e agende seus posts do Instagram
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Imagem do Post</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pink-500 transition-colors cursor-pointer">
                  <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Clique para fazer upload da imagem</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Legenda</label>
                <Textarea 
                  placeholder="Digite a legenda do seu post aqui... #hashtags"
                  className="min-h-[120px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Data de Publicação</label>
                  <Input type="date" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Horário</label>
                  <Input type="time" />
                </div>
              </div>
              <div className="flex gap-4">
                <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
                  <Send className="w-4 h-4 mr-2" />
                  Publicar Agora
                </Button>
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar
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

export default Instagram;
