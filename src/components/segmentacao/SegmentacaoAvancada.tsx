
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSegmentosContatos } from "@/hooks/useSegmentosContatos";
import { Plus, Users, Filter, Edit, Trash2, Play } from "lucide-react";
import { NovoSegmentoModal } from "./NovoSegmentoModal";

export const SegmentacaoAvancada = () => {
  const { segmentos, loading } = useSegmentosContatos();
  const [filtro, setFiltro] = useState("");
  const [segmentoSelecionado, setSegmentoSelecionado] = useState<any>(null);
  const [modalNovoAberto, setModalNovoAberto] = useState(false);

  const segmentosFiltrados = segmentos.filter(segmento =>
    segmento.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    segmento.descricao?.toLowerCase().includes(filtro.toLowerCase())
  );

  const getStatusColor = (ativo: boolean) => {
    return ativo ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Segmentação Avançada</h2>
          <p className="text-gray-600">Organize seus contatos em segmentos inteligentes</p>
        </div>
        <Button onClick={() => setModalNovoAberto(true)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Segmento
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Filtrar segmentos..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {segmentosFiltrados.map((segmento) => (
            <Card key={segmento.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{segmento.nome}</CardTitle>
                  <Badge className={getStatusColor(segmento.ativo)}>
                    {segmento.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                {segmento.descricao && (
                  <p className="text-sm text-gray-600">{segmento.descricao}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">
                      {segmento.total_contatos} contatos
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Criado em {new Date(segmento.created_at).toLocaleDateString('pt-BR')}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Play className="w-4 h-4 mr-1" />
                      Aplicar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {segmentosFiltrados.length === 0 && !loading && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum segmento encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              {filtro ? "Tente ajustar seus filtros" : "Comece criando seu primeiro segmento"}
            </p>
            <Button onClick={() => setModalNovoAberto(true)} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Criar Segmento
            </Button>
          </CardContent>
        </Card>
      )}

      <NovoSegmentoModal 
        isOpen={modalNovoAberto} 
        onClose={() => setModalNovoAberto(false)} 
      />
    </div>
  );
};
