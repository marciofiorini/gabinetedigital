
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface AnimatedCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  delay?: number;
}

export const AnimatedCard = ({ 
  title, 
  description, 
  children, 
  className, 
  interactive = false,
  delay = 0
}: AnimatedCardProps) => {
  return (
    <Card 
      className={cn(
        "animate-fade-in transition-smooth",
        interactive && "card-interactive",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {(title || description) && (
        <CardHeader>
          {title && (
            <CardTitle className="animate-slide-in-right" style={{ animationDelay: `${delay + 100}ms` }}>
              {title}
            </CardTitle>
          )}
          {description && (
            <CardDescription className="animate-slide-in-right" style={{ animationDelay: `${delay + 200}ms` }}>
              {description}
            </CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className="animate-slide-in-right" style={{ animationDelay: `${delay + 300}ms` }}>
        {children}
      </CardContent>
    </Card>
  );
};
