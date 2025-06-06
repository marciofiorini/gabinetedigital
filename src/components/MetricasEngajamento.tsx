
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";

export const MetricasEngajamento = () => {
  const metricas = [
    { nome: 'WhatsApp', valor: 85, cor: 'bg-green-500' },
    { nome: 'Instagram', valor: 72, cor: 'bg-pink-500' },
    { nome: 'E-mail', valor: 68, cor: 'bg-blue-500' }
  ];

  return (
    <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <TrendingUp className="w-5 h-5" />
          Métricas de Engajamento
        </CardTitle>
        <CardDescription className="dark:text-gray-400">
          Performance das suas redes sociais e WhatsApp
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {metricas.map((metrica, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {metrica.nome}
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {metrica.valor}%
              </span>
            </div>
            <Progress value={metrica.valor} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
