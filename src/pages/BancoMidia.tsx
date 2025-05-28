
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { 
  Upload, 
  Image, 
  Video, 
  FileText, 
  Download,
  Search,
  Filter,
  Folder,
  Plus,
  Eye,
  Edit,
  Trash2
} from "lucide-react";

const BancoMidia = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const arquivos = [
    {
      id: 1,
      nome: "inauguracao-escola.jpg",
      tipo: "imagem",
      tamanho: "2.3 MB",
      categoria: "Eventos",
      data: "2024-05-28",
      downloads: 15
    },
    {
      id: 2,
      nome: "video-audiencia-publica.mp4",
      tipo: "video",
      tamanho: "125 MB",
      categoria: "Institucional",
      data: "2024-05-27",
      downloads: 8
    },
    {
      id: 3,
      nome: "relatorio-atividades-maio.pdf",
      tipo: "documento",
      tamanho: "850 KB",
      categoria: "Relatórios",
      data: "2024-05-26",
      downloads: 23
    },
    {
      id: 4,
      nome: "reuniao-lideres.jpg",
      tipo: "imagem",
      tamanho: "1.8 MB",
      categoria: "Reuniões",
      data: "2024-05-25",
      downloads: 12
    }
  ];

  const categorias = [
    { nome: "Eventos", quantidade: 45, cor: "bg-blue-100 text-blue-800" },
    { nome: "Institucional", quantidade: 32, cor: "bg-green-100 text-green-800" },
    { nome: "Relatórios", quantidade: 28, cor: "bg-purple-100 text-purple-800" },
    { nome: "Reuniões", quantidade: 19, cor: "bg-orange-100 text-orange-800" }
  ];

  const getTypeIcon = (tipo: string) => {
    switch (tipo) {
      case "imagem": return Image;
      case "video": return Video;
      case "documento": return FileText;
      default: return FileText;
    }
  };

  const getTypeColor = (tipo: string) => {
    switch (tipo) {
      case "imagem": return "bg-green-100 text-green-800";
      case "video": return "bg-blue-100 text-blue-800";
      case "documento": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-100 flex">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="p-6">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  Banco de Mídia
                </h1>
                <p className="text-gray-600">
                  Gestão centralizada de arquivos, fotos, vídeos e documentos
                </p>
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Upload className="w-4 h-4 mr-2" />
                Upload Arquivo
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Total de Arquivos", valor: "124", icone: Folder, cor: "from-blue-500 to-blue-600" },
              { label: "Imagens", valor: "67", icone: Image, cor: "from-green-500 to-green-600" },
              { label: "Vídeos", valor: "23", icone: Video, cor: "from-purple-500 to-purple-600" },
              { label: "Documentos", valor: "34", icone: FileText, cor: "from-orange-500 to-orange-600" }
            ].map((stat, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.cor} flex items-center justify-center mr-4`}>
                      <stat.icone className="text-white w-6 h-6" />
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

          <Tabs defaultValue="arquivos" className="space-y-6">
            <TabsList>
              <TabsTrigger value="arquivos">Todos os Arquivos</TabsTrigger>
              <TabsTrigger value="categorias">Por Categoria</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>

            <TabsContent value="arquivos" className="space-y-6">
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="search"
                    placeholder="Buscar arquivos..."
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {arquivos.map((arquivo) => {
                  const TypeIcon = getTypeIcon(arquivo.tipo);
                  return (
                    <Card key={arquivo.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <TypeIcon className="w-5 h-5 text-gray-600" />
                            <Badge className={getTypeColor(arquivo.tipo)}>
                              {arquivo.tipo}
                            </Badge>
                          </div>
                          <Badge variant="outline">{arquivo.categoria}</Badge>
                        </div>
                        
                        <h3 className="font-medium text-gray-900 mb-2 truncate" title={arquivo.nome}>
                          {arquivo.nome}
                        </h3>
                        
                        <div className="text-sm text-gray-600 space-y-1 mb-4">
                          <p>Tamanho: {arquivo.tamanho}</p>
                          <p>Data: {arquivo.data}</p>
                          <p>Downloads: {arquivo.downloads}</p>
                        </div>
                        
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="categorias" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categorias.map((categoria, index) => (
                  <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-200 bg-white/80 backdrop-blur-sm cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Folder className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <h3 className="font-bold text-lg mb-2">{categoria.nome}</h3>
                      <Badge className={categoria.cor}>
                        {categoria.quantidade} arquivos
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-6">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5 text-purple-600" />
                    Upload de Arquivos
                  </CardTitle>
                  <CardDescription>
                    Faça upload de imagens, vídeos e documentos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Arraste arquivos aqui ou clique para selecionar
                    </p>
                    <p className="text-sm text-gray-500">
                      Suporta: JPG, PNG, MP4, AVI, PDF, DOC, XLS (máx. 100MB)
                    </p>
                    <Button className="mt-4">
                      Selecionar Arquivos
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Categoria</label>
                      <Input placeholder="Ex: Eventos, Institucional..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Tags (opcional)</label>
                      <Input placeholder="Ex: educação, saúde, obras..." />
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar ao Banco de Mídia
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default BancoMidia;
