
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Tag {
  id: string;
  name: string;
  color: string;
  count: number;
}

export const useTagSync = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const { toast } = useToast();

  // Tags padrão do sistema
  const defaultTags = [
    { id: '1', name: 'VIP', color: 'bg-yellow-100 text-yellow-800', count: 0 },
    { id: '2', name: 'Interessado', color: 'bg-blue-100 text-blue-800', count: 0 },
    { id: '3', name: 'Follow Up', color: 'bg-orange-100 text-orange-800', count: 0 },
    { id: '4', name: 'Prioridade Alta', color: 'bg-red-100 text-red-800', count: 0 },
    { id: '5', name: 'Reunião Agendada', color: 'bg-green-100 text-green-800', count: 0 },
    { id: '6', name: 'Proposta Enviada', color: 'bg-purple-100 text-purple-800', count: 0 },
  ];

  useEffect(() => {
    // Inicializar com tags padrão
    setTags(defaultTags);
  }, []);

  const addTag = useCallback((tagName: string, color?: string) => {
    const newTag: Tag = {
      id: Date.now().toString(),
      name: tagName,
      color: color || 'bg-gray-100 text-gray-800',
      count: 0
    };

    setTags(prev => {
      const exists = prev.find(tag => tag.name.toLowerCase() === tagName.toLowerCase());
      if (exists) {
        toast({
          title: 'Tag já existe',
          description: 'Uma tag com esse nome já foi criada.',
          variant: 'destructive'
        });
        return prev;
      }
      
      toast({
        title: 'Tag criada',
        description: `Tag "${tagName}" foi criada com sucesso.`
      });
      
      return [...prev, newTag];
    });

    return newTag;
  }, [toast]);

  const removeTag = useCallback((tagId: string) => {
    setTags(prev => {
      const tag = prev.find(t => t.id === tagId);
      if (tag) {
        toast({
          title: 'Tag removida',
          description: `Tag "${tag.name}" foi removida.`
        });
      }
      return prev.filter(t => t.id !== tagId);
    });
  }, [toast]);

  const updateTagCount = useCallback((tagName: string, increment: number) => {
    setTags(prev => prev.map(tag => 
      tag.name === tagName 
        ? { ...tag, count: Math.max(0, tag.count + increment) }
        : tag
    ));
  }, []);

  const getTagByName = useCallback((name: string) => {
    return tags.find(tag => tag.name.toLowerCase() === name.toLowerCase());
  }, [tags]);

  const syncTagsFromLead = useCallback((leadTags: string[]) => {
    leadTags.forEach(tagName => {
      const existingTag = getTagByName(tagName);
      if (!existingTag) {
        addTag(tagName);
      }
    });
  }, [getTagByName, addTag]);

  return {
    tags,
    addTag,
    removeTag,
    updateTagCount,
    getTagByName,
    syncTagsFromLead
  };
};
