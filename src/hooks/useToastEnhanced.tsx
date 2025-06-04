
import { useToast } from '@/hooks/use-toast';

export const useToastEnhanced = () => {
  const { toast } = useToast();

  const showSuccess = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "default"
    });
  };

  const showError = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "destructive"
    });
  };

  const showWarning = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "destructive"
    });
  };

  const showInfo = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "default"
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    toast
  };
};
