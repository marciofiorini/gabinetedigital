
import React, { useState, useEffect } from 'react';
import { PhotoUpload } from '@/components/PhotoUpload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePhotoUpload } from '@/hooks/usePhotoUpload';
import { Image as ImageIcon, Trash2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const GaleriaFotos = () => {
  const { uploadPhoto, getUploadedPhotos, deletePhoto, isUploading } = usePhotoUpload();
  const [photos, setPhotos] = useState<any[]>([]);
  const { toast } = useToast();

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
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Galeria de Fotos</h1>
        <p className="text-gray-600">Gerencie suas fotos e imagens</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PhotoUpload
            title="Nova Foto"
            description="Adicione uma nova foto à galeria"
            onPhotoSelected={handlePhotoUpload}
          />
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Suas Fotos ({photos.length})
              </CardTitle>
              <CardDescription>
                Fotos enviadas para sua galeria
              </CardDescription>
            </CardHeader>
            <CardContent>
              {photos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma foto enviada ainda</p>
                  <p className="text-sm">Use o painel ao lado para adicionar fotos</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {photos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <img
                        src={photo.base64}
                        alt="Foto da galeria"
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => downloadPhoto(photo)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeletePhoto(photo.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
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
