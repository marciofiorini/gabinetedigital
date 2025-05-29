
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ArrowRight, ArrowLeft } from "lucide-react";
import { useUserTours } from '@/hooks/useUserTours';

interface TourStep {
  target: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const welcomeTourSteps: TourStep[] = [
  {
    target: '[data-tour="dashboard"]',
    title: 'Bem-vindo ao Dashboard!',
    content: 'Este é seu painel principal onde você pode ver todas as métricas importantes do seu mandato.',
    position: 'bottom'
  },
  {
    target: '[data-tour="sidebar"]',
    title: 'Menu de Navegação',
    content: 'Use este menu lateral para navegar entre todas as funcionalidades da plataforma.',
    position: 'right'
  },
  {
    target: '[data-tour="stats"]',
    title: 'Métricas Rápidas',
    content: 'Aqui você vê um resumo das suas demandas, eventos, contatos e aniversariantes.',
    position: 'bottom'
  },
  {
    target: '[data-tour="notifications"]',
    title: 'Notificações',
    content: 'Clique aqui para ver suas notificações e alertas importantes.',
    position: 'bottom'
  }
];

export const TourGuide = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { showTour, completeTour, setShowTour } = useUserTours();

  useEffect(() => {
    if (showTour) {
      setIsVisible(true);
      setCurrentStep(0);
    }
  }, [showTour]);

  const nextStep = () => {
    if (currentStep < welcomeTourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour('welcome');
      setIsVisible(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    completeTour('welcome');
    setIsVisible(false);
    setShowTour(false);
  };

  if (!isVisible || !showTour) return null;

  const step = welcomeTourSteps[currentStep];
  const target = document.querySelector(step.target);

  if (!target) return null;

  const rect = target.getBoundingClientRect();
  const position = step.position || 'bottom';

  let tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 9999
  };

  switch (position) {
    case 'bottom':
      tooltipStyle = {
        ...tooltipStyle,
        top: rect.bottom + 10,
        left: rect.left + rect.width / 2,
        transform: 'translateX(-50%)'
      };
      break;
    case 'top':
      tooltipStyle = {
        ...tooltipStyle,
        bottom: window.innerHeight - rect.top + 10,
        left: rect.left + rect.width / 2,
        transform: 'translateX(-50%)'
      };
      break;
    case 'right':
      tooltipStyle = {
        ...tooltipStyle,
        top: rect.top + rect.height / 2,
        left: rect.right + 10,
        transform: 'translateY(-50%)'
      };
      break;
    case 'left':
      tooltipStyle = {
        ...tooltipStyle,
        top: rect.top + rect.height / 2,
        right: window.innerWidth - rect.left + 10,
        transform: 'translateY(-50%)'
      };
      break;
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[9998]" />
      
      {/* Highlight */}
      <div 
        className="fixed border-2 border-blue-500 rounded-lg bg-transparent z-[9999] pointer-events-none"
        style={{
          top: rect.top - 2,
          left: rect.left - 2,
          width: rect.width + 4,
          height: rect.height + 4
        }}
      />

      {/* Tooltip */}
      <Card className="w-80 z-[9999]" style={tooltipStyle}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg">{step.title}</h3>
            <Button variant="ghost" size="sm" onClick={skipTour}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {step.content}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {currentStep + 1} de {welcomeTourSteps.length}
            </span>
            
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" size="sm" onClick={prevStep}>
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Anterior
                </Button>
              )}
              
              <Button size="sm" onClick={nextStep}>
                {currentStep === welcomeTourSteps.length - 1 ? 'Finalizar' : 'Próximo'}
                {currentStep < welcomeTourSteps.length - 1 && (
                  <ArrowRight className="w-4 h-4 ml-1" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
