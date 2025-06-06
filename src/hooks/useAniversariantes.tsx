
import { useState } from 'react';

interface Aniversariante {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
  zona?: string;
  data_nascimento?: string;
}

export const useAniversariantes = () => {
  const [aniversariantes, setAniversariantes] = useState<Aniversariante[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAniversariantes = async () => {
    console.log('Mock: fetchAniversariantes');
    setAniversariantes([]);
  };

  return {
    aniversariantes,
    loading,
    refetch: fetchAniversariantes
  };
};
