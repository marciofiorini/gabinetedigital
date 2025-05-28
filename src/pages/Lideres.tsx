import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { NovoLiderModal } from "@/components/NovoLiderModal";
import { Plus, Search, Filter, Phone, Mail, MapPin, Users, Star } from "lucide-react";

const Lideres = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const lideres = [
    {
      id: 1,
      nome: "José da Silva",
      cargo: "Presidente da Associação",
      regiao: "Centro",
      whatsapp: "(11) 99999-9999",
      email: "jose@email.com",
      influencia: "Alta",
      seguidores: 1200,
      grupos: 5,
      categoria: "Associação",
      ativo: true
    },
    {
      id: 2,
      nome: "Maria Santos",
      cargo: "Líder Comunitária",
      regiao: "Zona Norte",
      whatsapp: "(11) 88888-8888",
      email: "maria@email.com",
      influencia: "Média",
      seguidores: 800,
      grupos: 3,
      categoria: "Comunidade",
      ativo: true
    },
    {
      id: 3,
      nome: "Carlos Oliveira",
      cargo: "Presidente do Sindicato",
      regiao: "Industrial",
      whatsapp: "(11) 77777-7777",
      email: "carlos@email.com",
      influencia: "Muito Alta",
      seguidores: 2500,
      grupos: 8,
      categoria: "Sindicato",
      ativo: false
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-100 flex">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  Líderes da Base Eleitoral
                </h1>
                <p className="text-gray-600">
                  Gerencie suas lideranças locais e regionais
                </p>
              </div>
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Líder
              </Button>
            </div>
          </div>

          {/* Filtros */}
          <Card className="mb-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar líderes..."
                    className="pl-10 border-gray-200 focus:border-green-500 transition-colors"
                  />
                </div>
                <Button variant="outline" className="hover:bg-green-50 hover:border-green-300 transition-colors">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Total de Líderes", valor: "234", cor: "from-green-500 to-green-600" },
              { label: "Ativos", valor: "198", cor: "from-blue-500 to-blue-600" },
              { label: "Grupos WhatsApp", valor: "45", cor: "from-purple-500 to-purple-600" },
              { label: "Alcance Total", valor: "12.5k", cor: "from-orange-500 to-orange-600" }
            ].map((stat, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.cor} flex items-center justify-center mr-4`}>
                      <Users className="text-white w-6 h-6" />
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

          {/* Lista de Líderes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {lideres.map((lider) => (
              <Card key={lider.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/80 backdrop-blur-sm hover:bg-white/90">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-semibold text-lg">
                          {lider.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{lider.nome}</h3>
                        <p className="text-sm text-gray-600">{lider.cargo}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {lider.ativo && (
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {lider.regiao}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {lider.whatsapp}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {lider.email}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className={`${getInfluenciaColor(lider.influencia)} border`}>
                      <Star className="w-3 h-3 mr-1" />
                      {lider.influencia}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {lider.categoria}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{lider.seguidores}</p>
                      <p className="text-xs text-gray-500">Seguidores</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{lider.grupos}</p>
                      <p className="text-xs text-gray-500">Grupos</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 hover:bg-green-50 hover:border-green-300">
                      Ver Perfil
                    </Button>
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>

      <NovoLiderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default Lideres;
