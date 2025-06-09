
import React, { useState, useEffect } from 'react';
import { PhotoUpload } from '@/components/PhotoUpload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePhotoUpload } from '@/hooks/usePhotoUpload';
import { Image as ImageIcon, Trash2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const GaleriaFotos = () => {
  const { uploadPhoto, getUploadedPhotos, deletePhoto, isUploading } = usePhotoUpload();
  const [photos, setPhotos] = useState<any[]>([]);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = () => {
    const uploadedPhotos = getUploadedPhotos();
    setPhotos(uploadedPhotos);
  };

  const handlePhotoUpload = async (file: File) => {
    const result = await uploadPhoto(file, 'galeria');
    if (result) {
      loadPhotos();
    }
  };

  const handleDeletePhoto = (photoId: string) => {
    if (deletePhoto(photoId)) {
      loadPhotos();
    }
  };

  const downloadPhoto = (photo: any) => {
    const link = document.createElement('a');
    link.href = photo.base64;
    link.download = photo.fileName.split('/').pop() || 'photo.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto py-4 lg:py-6 space-y-4 lg:space-y-6 px-4 lg:px-0">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Galeria de Fotos</h1>
        <p className="text-gray-600 text-sm lg:text-base">Gerencie suas fotos e imagens</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-1">
          <PhotoUpload
            title="Nova Foto"
            description="Adicione uma nova foto à galeria"
            onPhotoSelected={handlePhotoUpload}
          />
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3 lg:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                <ImageIcon className="w-5 h-5" />
                Suas Fotos ({photos.length})
              </CardTitle>
              <CardDescription className="text-sm">
                Fotos enviadas para sua galeria
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 lg:p-6">
              {photos.length === 0 ? (
                <div className="text-center py-6 lg:py-8 text-gray-500">
                  <ImageIcon className="w-8 h-8 lg:w-12 lg:h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm lg:text-base">Nenhuma foto enviada ainda</p>
                  <p className="text-xs lg:text-sm">Use o painel {isMobile ? 'acima' : 'ao lado'} para adicionar fotos</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
                  {photos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <img
                        src={photo.base64}
                        alt="Foto da galeria"
                        className="w-full h-24 sm:h-32 lg:h-32 object-cover rounded-lg border"
                      />
                      
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1 lg:gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => downloadPhoto(photo)}
                          className="p-1 lg:p-2 h-auto"
                        >
                          <Download className="w-3 h-3 lg:w-4 lg:h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="p-1 lg:p-2 h-auto"
                        >
                          <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                        </Button>
                      </div>
                      
                      <div className="absolute bottom-1 lg:bottom-2 left-1 lg:left-2 right-1 lg:right-2">
                        <p className="text-xs text-white bg-black bg-opacity-50 px-1 lg:px-2 py-0.5 lg:py-1 rounded">
                          {new Date(photo.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GaleriaFotos;
