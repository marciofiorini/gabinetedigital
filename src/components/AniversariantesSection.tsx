
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Cake, Phone, Mail, MapPin, Eye } from "lucide-react";
import { useAniversariantes } from "@/hooks/useAniversariantes";

export const AniversariantesSection = () => {
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const { aniversariantes, loading } = useAniversariantes();

  const aniversariantesExibidos = mostrarTodos ? aniversariantes : aniversariantes.slice(0, 10);

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Cake className="w-5 h-5" />
            Aniversariantes do Dia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600">Carregando...</div>
        </CardContent>
      </Card>
    );
  }

  if (aniversariantes.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Cake className="w-5 h-5" />
            Aniversariantes do Dia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600">Nenhum aniversariante hoje</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Cake className="w-5 h-5" />
          Aniversariantes do Dia
        </CardTitle>
        <CardDescription>
          {aniversariantes.length} {aniversariantes.length === 1 ? 'pessoa faz' : 'pessoas fazem'} aniversário hoje
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {aniversariantesExibidos.map((aniversariante) => (
            <div key={aniversariante.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <Cake className="w-5 h-5 text-pink-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 text-sm truncate">{aniversariante.nome}</h4>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                  {aniversariante.telefone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span>{aniversariante.telefone}</span>
                    </div>
                  )}
                  {aniversariante.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span className="truncate max-w-[120px]">{aniversariante.email}</span>
                    </div>
                  )}
                  {aniversariante.zona && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{aniversariante.zona}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0">
                <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                  🎉
                </Badge>
              </div>
            </div>
          ))}
        </div>
        
        {aniversariantes.length > 10 && !mostrarTodos && (
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setMostrarTodos(true)}
              className="text-xs"
            >
              <Eye className="w-3 h-3 mr-1" />
              Ver todos ({aniversariantes.length})
            </Button>
          </div>
        )}
        
        {mostrarTodos && aniversariantes.length > 10 && (
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setMostrarTodos(false)}
              className="text-xs"
            >
              Ver menos
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
