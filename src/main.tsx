
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('main.tsx: Iniciando aplicação');

const container = document.getElementById("root");
if (!container) {
  console.error('main.tsx: Elemento root não encontrado');
  throw new Error('Root element not found');
}

console.log('main.tsx: Elemento root encontrado, renderizando App');

createRoot(container).render(<App />);

console.log('main.tsx: App renderizado com sucesso');
