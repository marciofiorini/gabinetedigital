
import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface HelpFloatingButtonProps {
  helpSection?: string;
}

export const HelpFloatingButton = ({ helpSection = 'geral' }: HelpFloatingButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            asChild
            size="icon"
            className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          >
            <Link to={`/ajuda?secao=${helpSection}`}>
              <HelpCircle className="h-6 w-6 text-white" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Precisa de ajuda? Clique aqui!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
