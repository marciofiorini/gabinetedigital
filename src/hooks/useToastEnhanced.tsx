
import { toast } from "sonner";
import { CheckCircle, AlertCircle, Info, XCircle } from "lucide-react";

export const useToastEnhanced = () => {
  const showSuccess = (message: string, description?: string) => {
    toast.success(message, {
      description,
      icon: <CheckCircle className="w-4 h-4" />,
      className: "toast-custom",
      duration: 4000,
    });
  };

  const showError = (message: string, description?: string) => {
    toast.error(message, {
      description,
      icon: <XCircle className="w-4 h-4" />,
      className: "toast-custom",
      duration: 5000,
    });
  };

  const showWarning = (message: string, description?: string) => {
    toast.warning(message, {
      description,
      icon: <AlertCircle className="w-4 h-4" />,
      className: "toast-custom",
      duration: 4000,
    });
  };

  const showInfo = (message: string, description?: string) => {
    toast.info(message, {
      description,
      icon: <Info className="w-4 h-4" />,
      className: "toast-custom",
      duration: 3000,
    });
  };

  const showLoading = (message: string) => {
    return toast.loading(message, {
      className: "toast-custom",
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
  };
};
