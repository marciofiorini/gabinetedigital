
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Camera, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface PhotoUploadProps {
  onPhotoSelected?: (file: File) => void;
  currentPhoto?: string;
  title?: string;
  description?: string;
  acceptMultiple?: boolean;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  onPhotoSelected,
  currentPhoto,
  title = "Upload de Fotos",
  description = "Adicione fotos ao seu perfil ou projeto",
  acceptMultiple = false
}) => {
  const [preview, setPreview] = useState<string | null>(currentPhoto || null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 5MB",
        variant: "destructive"
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Call callback if provided
    if (onPhotoSelected) {
      onPhotoSelected(file);
    }

    toast({
      title: "Sucesso",
      description: "Foto selecionada com sucesso!"
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removePhoto = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3 lg:pb-6">
        <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
          <ImageIcon className="w-4 h-4 lg:w-5 lg:h-5" />
          {title}
        </CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 lg:space-y-4 p-4 lg:p-6">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-32 sm:h-40 lg:h-48 object-cover rounded-lg border"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-1 lg:top-2 right-1 lg:right-2 p-1 lg:p-2 h-auto"
              onClick={removePhoto}
            >
              <X className="w-3 h-3 lg:w-4 lg:h-4" />
            </Button>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-lg p-4 lg:p-8 text-center transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="w-8 h-8 lg:w-12 lg:h-12 mx-auto text-gray-400 mb-2 lg:mb-4" />
            <p className="text-gray-600 mb-1 lg:mb-2 text-sm lg:text-base">
              {isMobile ? 'Toque para selecionar' : 'Arraste uma foto aqui ou clique para selecionar'}
            </p>
            <p className="text-xs lg:text-sm text-gray-500">
              Suporta JPG, PNG até 5MB
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={openFileDialog} className="flex-1 text-sm lg:text-base">
            <Camera className="w-3 h-3 lg:w-4 lg:h-4 mr-2" />
            Selecionar Foto
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={acceptMultiple}
          onChange={handleInputChange}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};
