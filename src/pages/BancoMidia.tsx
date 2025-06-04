
import React from 'react';
import { ArquivoDigitalManager } from '@/components/arquivos/ArquivoDigitalManager';

const BancoMidia = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Banco de Mídia e Arquivo Digital</h1>
        <p className="text-gray-600">Sistema de gestão documental e arquivo digital</p>
      </div>
      
      <ArquivoDigitalManager />
    </div>
  );
};

export default BancoMidia;
