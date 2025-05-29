
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Shortcut {
  key: string;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const shortcuts: Shortcut[] = [
    {
      key: 'g h',
      action: () => navigate('/'),
      description: 'Ir para Dashboard'
    },
    {
      key: 'g c',
      action: () => navigate('/contatos'),
      description: 'Ir para Contatos'
    },
    {
      key: 'g l',
      action: () => navigate('/leads'),
      description: 'Ir para CRM'
    },
    {
      key: 'g a',
      action: () => navigate('/agenda'),
      description: 'Ir para Agenda'
    },
    {
      key: 'g d',
      action: () => navigate('/demandas'),
      description: 'Ir para Demandas'
    },
    {
      key: '?',
      action: () => {
        // Show shortcuts modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
        modal.innerHTML = `
          <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Atalhos de Teclado</h3>
            <div class="space-y-2">
              ${shortcuts.map(s => `
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 dark:text-gray-300">${s.description}</span>
                  <kbd class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">${s.key}</kbd>
                </div>
              `).join('')}
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Fechar
            </button>
          </div>
        `;
        document.body.appendChild(modal);
        modal.onclick = (e) => {
          if (e.target === modal) modal.remove();
        };
      },
      description: 'Mostrar esta ajuda'
    }
  ];

  useEffect(() => {
    if (!user) return;

    let sequence = '';
    let timeout: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Clear sequence after 2 seconds of inactivity
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        sequence = '';
      }, 2000);

      // Build sequence
      if (e.key === ' ') {
        sequence += ' ';
      } else if (e.key.length === 1) {
        sequence += e.key.toLowerCase();
      } else if (e.key === '?') {
        sequence = '?';
      }

      // Check for matches
      const shortcut = shortcuts.find(s => s.key === sequence);
      if (shortcut) {
        e.preventDefault();
        shortcut.action();
        sequence = '';
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeout);
    };
  }, [user, navigate]);

  return { shortcuts };
};
