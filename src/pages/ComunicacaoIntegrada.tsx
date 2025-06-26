
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Send, 
  Calendar, 
  Image, 
  Video, 
  FileText, 
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Instagram,
  Facebook,
  Twitter
} from "lucide-react";

const ComunicacaoIntegrada = () => {
  const [postTexto, setPostTexto] = useState("");
  const [agendamento, setAgendamento] = useState("");

  const postsAgendados = [
    {
      id: 1,
      texto: "Reunião pública sobre mobilidade urbana amanhã às 14h no Centro Cívico",
      plataformas: ["Instagram", "Facebook", "Twitter"],
      dataAgendamento: "2024-05-29 08:00",
      status: "agendado"
    },
    {
      id: 2,
      texto: "Investimentos em educação: nova escola inaugurada na Zona Norte",
      plataformas: ["Instagram", "Facebook"],
      dataAgendamento: "2024-05-28 18:00",
      status: "publicado"
    },
    {
      id: 3,
      texto: "Audiência pública sobre saúde - participe e contribua!",
      plataformas: ["Twitter", "Facebook"],
      dataAgendamento: "2024-05-30 10:00",
      status: "rascunho"
    }
  ];

  const templates = [
    {
      id: 1,
      nome: "Reunião Pública",
      categoria: "Eventos",
      texto: "Convido todos para nossa reunião pública sobre [TEMA] que acontecerá em [DATA] às [HORA] no [LOCAL]. Sua participação é fundamental!"
    },
    {
      id: 2,
      nome: "Inauguração",
      categoria: "Obras",
      texto: "É com grande alegria que inauguramos [OBRA/PROJETO] na [LOCALIZAÇÃO]. Mais um passo em direção ao desenvolvimento da nossa cidade!"
    },
    {
      id: 3,
      nome: "Prestação de Contas",
      categoria: "Transparência",
      texto: "Relatório mensal de atividades: [RESUMO]. Continuamos trabalhando por uma gestão transparente e eficiente."
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "publicado": return "bg-green-100 text-green-800";
      case "agendado": return "bg-blue-100 text-blue-800";
      case "rascunho": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "publicado": return CheckCircle;
      case "agendado": return Clock;
      case "rascunho": return FileText;
      default: return AlertCircle;
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Centro de Comunicação Integrado
        </h1>
        <p className="text-gray-600">
          Gerencie posts em múltiplas redes sociais de forma integrada
        </p>
      </div>

      <Tabs defaultValue="criar" className="space-y-6">
        <TabsList>
          <TabsTrigger value="criar">Criar Post</TabsTrigger>
          <TabsTrigger value="agendados">Posts Agendados</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="criar" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <Card className="xl:col-span-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-green-600" />
                  Criar Novo Post
                </CardTitle>
                <CardDescription>
                  Crie um post para publicar em múltiplas redes sociais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Texto do Post</label>
                  <Textarea
                    placeholder="Digite o conteúdo do seu post..."
                    value={postTexto}
                    onChange={(e) => setPostTexto(e.target.value)}
                    rows={6}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">{postTexto.length}/280 caracteres</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Plataformas</label>
                  <div className="flex gap-3">
                    {[
                      { name: "Instagram", icon: Instagram, color: "from-pink-500 to-purple-500" },
                      { name: "Facebook", icon: Facebook, color: "from-blue-600 to-blue-700" },
                      { name: "Twitter", icon: Twitter, color: "from-blue-400 to-blue-500" }
                    ].map((platform) => (
                      <Button
                        key={platform.name}
                        variant="outline"
                        className="flex items-center gap-2 hover:bg-gradient-to-r hover:text-white"
                        style={{ background: `linear-gradient(to right, ${platform.color.split(' ')[1]}, ${platform.color.split(' ')[3]})` }}
                      >
                        <platform.icon className="w-4 h-4 text-white" />
                        <span className="text-white">{platform.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Mídia (Opcional)</label>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      Imagem
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Vídeo
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Agendamento (Opcional)</label>
                  <Input
                    type="datetime-local"
                    value={agendamento}
                    onChange={(e) => setAgendamento(e.target.value)}
                  />
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                    <Send className="w-4 h-4 mr-2" />
                    {agendamento ? 'Agendar Post' : 'Publicar Agora'}
                  </Button>
                  <Button variant="outline">
                    Salvar Rascunho
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">
                      {postTexto || "O preview do seu post aparecerá aqui..."}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Estatísticas Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Posts hoje:</span>
                    <span className="font-bold">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Agendados:</span>
                    <span className="font-bold">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Engajamento médio:</span>
                    <span className="font-bold">8.5%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="agendados" className="space-y-6">
          <div className="space-y-4">
            {postsAgendados.map((post) => {
              const StatusIcon = getStatusIcon(post.status);
              return (
                <Card key={post.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <StatusIcon className="w-5 h-5 text-blue-600" />
                        <Badge className={getStatusColor(post.status)}>
                          {post.status}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">{post.dataAgendamento}</span>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{post.texto}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {post.plataformas.map((plataforma) => (
                          <Badge key={plataforma} variant="outline">
                            {plataforma}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Editar</Button>
                        <Button variant="outline" size="sm">Excluir</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Templates de Comunicação</h3>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Template
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.nome}</CardTitle>
                    <Badge variant="outline">{template.categoria}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{template.texto}</p>
                  <Button variant="outline" className="w-full">
                    Usar Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComunicacaoIntegrada;
