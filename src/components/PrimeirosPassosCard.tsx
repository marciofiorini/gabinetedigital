
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  Users, 
  MessageCircle, 
  BarChart3,
  HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    id: 1,
    title: "Configure seu perfil",
    description: "Complete suas informações pessoais e preferências",
    path: "/configuracoes",
    icon: Users,
    completed: false
  },
  {
    id: 2,
    title: "Adicione seus primeiros contatos",
    description: "Importe ou cadastre contatos para começar a usar o CRM",
    path: "/contatos",
    icon: Users,
    completed: false
  },
  {
    id: 3,
    title: "Configure canais de comunicação",
    description: "Conecte WhatsApp, Instagram e e-mail",
    path: "/comunicacao",
    icon: MessageCircle,
    completed: false
  },
  {
    id: 4,
    title: "Explore o Analytics",
    description: "Veja relatórios e insights dos seus dados",
    path: "/analytics",
    icon: BarChart3,
    completed: false
  }
];

export const PrimeirosPassosCard = () => {
  const completedSteps = steps.filter(step => step.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Primeiros Passos
          </CardTitle>
          <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
            {completedSteps}/{steps.length} concluído
          </Badge>
        </div>
        <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2 mt-2">
          <div 
            className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.id} className="flex items-center gap-3 p-3 bg-white/50 dark:bg-white/5 rounded-lg">
              <div className="flex-shrink-0">
                {step.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {step.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {step.description}
                </p>
              </div>
              <Button asChild variant="ghost" size="sm" className="flex-shrink-0">
                <Link to={step.path} className="flex items-center gap-1">
                  <span className="text-xs">Ir</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </Button>
            </div>
          );
        })}
        
        <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link to="/ajuda" className="flex items-center justify-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Ver Guia Completo
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
