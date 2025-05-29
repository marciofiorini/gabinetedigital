import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  TrendingUp, 
  MessageCircle, 
  Heart, 
  Share2, 
  AlertTriangle,
  Plus,
  Filter,
  Eye
} from "lucide-react";

const MonitorRedes = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const mencoes = [
    {
      id: 1,
      plataforma: "Twitter",
      usuario: "@cidadao_sp",
      texto: "Parabéns pela iniciativa na educação! Finalmente alguém que ouve a população",
      sentimento: "positivo",
      engajamento: 45,
      data: "2024-05-28 14:30"
    },
    {
      id: 2,
      plataforma: "Instagram", 
      usuario: "@maria_silva",
      texto: "Quando vai resolver o problema da mobilidade urbana?",
      sentimento: "neutro",
      engajamento: 23,
      data: "2024-05-28 12:15"
    },
    {
      id: 3,
      plataforma: "Facebook",
      usuario: "João Santos",
      texto: "Promessas e mais promessas... cadê as ações?",
      sentimento: "negativo", 
      engajamento: 67,
      data: "2024-05-28 10:45"
    }
  ];

  const hashtags = [
    { tag: "#EducaçãoSP", mencoes: 234, crescimento: "+15%" },
    { tag: "#MobilidadeUrbana", mencoes: 189, crescimento: "+8%" },
    { tag: "#TransparenciaSP", mencoes: 156, crescimento: "+22%" },
    { tag: "#SaúdePública", mencoes: 98, crescimento: "-5%" }
  ];

  const getSentimentColor = (sentimento: string) => {
    switch (sentimento) {
      case "positivo": return "bg-green-100 text-green-800";
      case "negativo": return "bg-red-100 text-red-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Monitor de Redes Sociais
          </h1>
          <p className="text-gray-600">
            Acompanhe menções, hashtags e sentimento nas redes sociais
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Menções Hoje", valor: "47", icone: MessageCircle, cor: "from-blue-500 to-blue-600", crescimento: "+12%" },
          { label: "Sentimento Positivo", valor: "68%", icone: Heart, cor: "from-green-500 to-green-600", crescimento: "+5%" },
          { label: "Engajamento", valor: "2.3k", icone: TrendingUp, cor: "from-purple-500 to-purple-600", crescimento: "+18%" },
          { label: "Alcance Total", valor: "15.7k", icone: Eye, cor: "from-orange-500 to-orange-600", crescimento: "+25%" }
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

      <Tabs defaultValue="mencoes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="mencoes">Menções</TabsTrigger>
          <TabsTrigger value="hashtags">Hashtags Trending</TabsTrigger>
          <TabsTrigger value="config">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="mencoes" className="space-y-6">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="search"
                placeholder="Buscar menções..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtrar
            </Button>
          </div>

          <div className="space-y-4">
            {mencoes.map((mencao) => (
              <Card key={mencao.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{mencao.plataforma}</Badge>
                      <span className="font-medium text-gray-900">{mencao.usuario}</span>
                      <Badge className={getSentimentColor(mencao.sentimento)}>
                        {mencao.sentimento}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">{mencao.data}</span>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{mencao.texto}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-600">{mencao.engajamento} interações</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Responder</Button>
                      <Button size="sm">Marcar como Lida</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="hashtags" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hashtags.map((hashtag, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-blue-600">{hashtag.tag}</h3>
                    <Badge className={hashtag.crescimento.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {hashtag.crescimento}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">{hashtag.mencoes}</span>
                    <span className="text-sm text-gray-600">menções hoje</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Configurar Monitoramento</CardTitle>
              <CardDescription>
                Configure palavras-chave e alertas para monitoramento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Palavras-chave para monitorar</label>
                <Input placeholder="Ex: seu nome, cidade, projetos..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hashtags de interesse</label>
                <Input placeholder="Ex: #educacao, #saude, #mobilidade..." />
              </div>
              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MonitorRedes;
