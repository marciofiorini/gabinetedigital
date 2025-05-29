
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useTagSync } from '@/hooks/useTagSync';
import { Plus, X, Tag as TagIcon } from 'lucide-react';

interface TagManagerProps {
  selectedTags?: string[];
  onTagsChange?: (tags: string[]) => void;
  showAddButton?: boolean;
}

export const TagManager = ({ selectedTags = [], onTagsChange, showAddButton = true }: TagManagerProps) => {
  const { tags, addTag, removeTag } = useTagSync();
  const [newTagName, setNewTagName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddTag = () => {
    if (!newTagName.trim()) return;
    
    const newTag = addTag(newTagName.trim());
    if (newTag && onTagsChange) {
      onTagsChange([...selectedTags, newTag.name]);
    }
    
    setNewTagName('');
    setIsDialogOpen(false);
  };

  const toggleTag = (tagName: string) => {
    if (!onTagsChange) return;
    
    if (selectedTags.includes(tagName)) {
      onTagsChange(selectedTags.filter(t => t !== tagName));
    } else {
      onTagsChange([...selectedTags, tagName]);
    }
  };

  const removeSelectedTag = (tagName: string) => {
    if (onTagsChange) {
      onTagsChange(selectedTags.filter(t => t !== tagName));
    }
  };

  return (
    <div className="space-y-4">
      {/* Tags Selecionadas */}
      {selectedTags.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Tags Selecionadas:</label>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map(tagName => {
              const tag = tags.find(t => t.name === tagName);
              return (
                <Badge 
                  key={tagName}
                  className={tag?.color || 'bg-gray-100 text-gray-800'}
                  variant="outline"
                >
                  {tagName}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeSelectedTag(tagName)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Tags Disponíveis */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Tags Disponíveis:</label>
          {showAddButton && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="w-3 h-3 mr-1" />
                  Nova Tag
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Criar Nova Tag</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Nome da Tag</label>
                    <Input
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="Digite o nome da tag..."
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddTag} disabled={!newTagName.trim()}>
                      Criar Tag
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Badge
              key={tag.id}
              className={`cursor-pointer transition-all duration-200 ${tag.color} ${
                selectedTags.includes(tag.name) 
                  ? 'ring-2 ring-indigo-500 ring-opacity-50' 
                  : 'hover:opacity-80'
              }`}
              variant="outline"
              onClick={() => toggleTag(tag.name)}
            >
              <TagIcon className="w-3 h-3 mr-1" />
              {tag.name}
              {tag.count > 0 && (
                <span className="ml-1 text-xs opacity-70">({tag.count})</span>
              )}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
