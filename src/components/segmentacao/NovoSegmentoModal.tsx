
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSegmentosContatos } from "@/hooks/useSegmentosContatos";
import { Plus, X } from "lucide-react";

interface NovoSegmentoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NovoSegmentoModal = ({ isOpen, onClose }: NovoSegmentoModalProps) => {
  const { criarSegmento } = useSegmentosContatos();
  const [loading, setLoading] = useState(false);
  const [criterios, setCriterios] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    ativo: true
  });

  const adicionarCriterio = () => {
    setCriterios([...criterios, {
      campo: "",
      operador: "",
      valor: "",
      conector: "E"
    }]);
  };

  const removerCriterio = (index: number) => {
    setCriterios(criterios.filter((_, i) => i !== index));
  };

  const atualizarCriterio = (index: number, campo: string, valor: any) => {
    const novosCriterios = [...criterios];
    novosCriterios[index] = { ...novosCriterios[index], [campo]: valor };
    setCriterios(novosCriterios);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) return;

    setLoading(true);
    try {
      await criarSegmento({
        nome: formData.nome,
        descricao: formData.descricao,
        criterios: { criterios },
        ativo: formData.ativo
      });
      
      onClose();
      setFormData({ nome: "", descricao: "", ativo: true });
      setCriterios([]);
    } catch (error) {
      console.error('Erro ao criar segmento:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Segmento</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="nome">Nome do Segmento *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: Jovens Interessados em Saúde"
                required
              />
            </div>
            <div>
              <Label htmlFor="ativo">Status</Label>
              <Select 
                value={formData.ativo ? "true" : "false"} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, ativo: value === "true" }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Ativo</SelectItem>
                  <SelectItem value="false">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              placeholder="Descreva o objetivo deste segmento..."
              rows={3}
            />
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Critérios de Segmentação</CardTitle>
                <Button type="button" onClick={adicionarCriterio} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Critério
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {criterios.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Adicione critérios para definir este segmento</p>
                  <p className="text-sm">Ex: Idade entre 18-35 anos E Zona = Norte</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {criterios.map((criterio, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Critério {index + 1}</span>
                        <Button 
                          type="button" 
                          onClick={() => removerCriterio(index)} 
                          size="sm" 
                          variant="ghost"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-12 gap-3">
                        {index > 0 && (
                          <div className="col-span-2">
                            <Select 
                              value={criterio.conector} 
                              onValueChange={(value) => atualizarCriterio(index, 'conector', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="E">E</SelectItem>
                                <SelectItem value="OU">OU</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        
                        <div className={index > 0 ? "col-span-3" : "col-span-4"}>
                          <Select 
                            value={criterio.campo} 
                            onValueChange={(value) => atualizarCriterio(index, 'campo', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Campo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="zona">Zona</SelectItem>
                              <SelectItem value="idade">Idade</SelectItem>
                              <SelectItem value="tags">Tags</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="telefone">Telefone</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="col-span-3">
                          <Select 
                            value={criterio.operador} 
                            onValueChange={(value) => atualizarCriterio(index, 'operador', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Operador" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="igual">Igual a</SelectItem>
                              <SelectItem value="diferente">Diferente de</SelectItem>
                              <SelectItem value="contem">Contém</SelectItem>
                              <SelectItem value="maior">Maior que</SelectItem>
                              <SelectItem value="menor">Menor que</SelectItem>
                              <SelectItem value="entre">Entre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="col-span-4">
                          <Input
                            value={criterio.valor}
                            onChange={(e) => atualizarCriterio(index, 'valor', e.target.value)}
                            placeholder="Valor"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
              {loading ? "Criando..." : "Criar Segmento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
