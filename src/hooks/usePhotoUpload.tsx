
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const usePhotoUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const uploadPhoto = async (file: File, folder: string = 'photos'): Promise<string | null> => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive"
      });
      return null;
    }

    setIsUploading(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${folder}/${Date.now()}.${fileExt}`;

      // For now, we'll use a simple base64 approach since storage isn't set up
      // In a real implementation, this would upload to Supabase Storage
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onload = () => {
          const base64 = reader.result as string;
          
          // Store in localStorage for demo purposes
          const photos = JSON.parse(localStorage.getItem('uploaded_photos') || '[]');
          const photoData = {
            id: Date.now().toString(),
            userId: user.id,
            fileName,
            base64,
            uploadedAt: new Date().toISOString()
          };
          
          photos.push(photoData);
          localStorage.setItem('uploaded_photos', JSON.stringify(photos));
          
          toast({
            title: "Sucesso",
            description: "Foto enviada com sucesso!"
          });
          
          resolve(base64);
        };
        
        reader.onerror = () => {
          toast({
            title: "Erro",
            description: "Erro ao processar a imagem",
            variant: "destructive"
          });
          reject(new Error('Erro ao processar imagem'));
        };
        
        reader.readAsDataURL(file);
      });

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar foto",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const getUploadedPhotos = (): any[] => {
    if (!user) return [];
    
    const photos = JSON.parse(localStorage.getItem('uploaded_photos') || '[]');
    return photos.filter((photo: any) => photo.userId === user.id);
  };

  const deletePhoto = (photoId: string): boolean => {
    try {
      const photos = JSON.parse(localStorage.getItem('uploaded_photos') || '[]');
      const updatedPhotos = photos.filter((photo: any) => photo.id !== photoId || photo.userId !== user?.id);
      localStorage.setItem('uploaded_photos', JSON.stringify(updatedPhotos));
      
      toast({
        title: "Sucesso",
        description: "Foto removida com sucesso!"
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover foto",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    uploadPhoto,
    getUploadedPhotos,
    deletePhoto,
    isUploading
  };
};
