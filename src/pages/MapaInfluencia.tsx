
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Map, Users, MapPin, Filter, Download } from "lucide-react";

const MapaInfluencia = () => {
  const zonas = [
    {
      nome: "Zona Norte",
      lideres: 15,
      contatos: 450,
      influencia: "Alta",
      cor: "#10B981",
      atividade: "95%"
    },
    {
      nome: "Zona Sul",
      lideres: 12,
      contatos: 380,
      influencia: "Média",
      cor: "#F59E0B",
      atividade: "78%"
    },
    {
      nome: "Centro",
      lideres: 8,
      contatos: 290,
      influencia: "Alta",
      cor: "#3B82F6",
      atividade: "88%"
    },
    {
      nome: "Zona Leste",
      lideres: 6,
      contatos: 195,
      influencia: "Baixa",
      cor: "#EF4444",
      atividade: "42%"
    }
  ];

  const bairrosFoco = [
    { nome: "Centro Histórico", lideres: 3, score: 92 },
    { nome: "Vila Nova", lideres: 5, score: 88 },
    { nome: "Jardim América", lideres: 4, score: 85 },
    { nome: "São José", lideres: 2, score: 78 },
    { nome: "Industrial", lideres: 1, score: 65 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Mapa de Influência
          </h1>
          <p className="text-gray-600 text-sm">
            Visualize suas áreas de atuação geográfica e influência política
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Mapa Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="w-5 h-5" />
            Mapa Geográfico de Influência
          </CardTitle>
          <CardDescription>
            Distribuição de líderes e contatos por região
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <Map className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Mapa Interativo</p>
              <p className="text-sm text-gray-500 mt-1">
                Integração com Google Maps em desenvolvimento
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Zonas de Influência */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Zonas de Influência
            </CardTitle>
            <CardDescription>
              Análise por região administrativa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {zonas.map((zona, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: zona.cor }}
                      ></div>
                      <h3 className="font-semibold text-gray-900">{zona.nome}</h3>
                    </div>
                    <Badge 
                      variant={zona.influencia === 'Alta' ? 'default' : zona.influencia === 'Média' ? 'secondary' : 'outline'}
                    >
                      {zona.influencia}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-gray-500">Líderes</p>
                      <p className="font-semibold text-blue-600">{zona.lideres}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500">Contatos</p>
                      <p className="font-semibold text-green-600">{zona.contatos}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500">Atividade</p>
                      <p className="font-semibold text-purple-600">{zona.atividade}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bairros Estratégicos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Bairros Estratégicos
            </CardTitle>
            <CardDescription>
              Ranking de influência por bairro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bairrosFoco.map((bairro, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-700">
                        #{index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{bairro.nome}</p>
                      <p className="text-sm text-gray-500">{bairro.lideres} líderes</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{bairro.score}</p>
                    <p className="text-xs text-gray-500">Score</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights Estratégicos</CardTitle>
          <CardDescription>
            Recomendações baseadas na análise geográfica
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">💪 Fortalezas</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Zona Norte com alta atividade</li>
                <li>• Centro bem estruturado</li>
                <li>• Boa distribuição de líderes</li>
              </ul>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Atenção</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Zona Sul precisa de reforço</li>
                <li>• Baixa atividade na Zona Leste</li>
                <li>• Poucos líderes no Industrial</li>
              </ul>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">🎯 Oportunidades</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Expandir atuação na Zona Leste</li>
                <li>• Recrutar líderes no Industrial</li>
                <li>• Fortalecer Vila Nova</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapaInfluencia;
