
import { useState } from 'react';
import { Search, Command, Users, FileText, Crown, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useNavigate } from 'react-router-dom';

export const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const searchItems = [
    {
      group: 'Páginas',
      items: [
        { name: 'Dashboard', path: '/', icon: Command },
        { name: 'Contatos', path: '/contatos', icon: Users },
        { name: 'Líderes', path: '/lideres', icon: Crown },
        { name: 'Demandas', path: '/demandas', icon: FileText },
        { name: 'Agenda', path: '/agenda', icon: Calendar },
        { name: 'CRM', path: '/crm', icon: Users },
        { name: 'WhatsApp', path: '/whatsapp', icon: Users },
        { name: 'Instagram', path: '/instagram', icon: Users },
        { name: 'E-mail', path: '/email', icon: Users },
        { name: 'Analytics', path: '/analytics', icon: Users },
        { name: 'Monitor Redes', path: '/monitor-redes', icon: Users },
        { name: 'Portal Cidadão', path: '/portal-cidadao', icon: Users },
        { name: 'Projetos de Lei', path: '/projetos-lei', icon: Users },
        { name: 'Pesquisas', path: '/pesquisas', icon: Users },
        { name: 'Mapa de Influência', path: '/mapa-influencia', icon: Users },
        { name: 'Sistema de Votações', path: '/sistema-votacoes', icon: Users },
      ]
    }
  ];

  const handleSelect = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="relative h-8 w-8 p-0 lg:h-9 lg:w-60 lg:justify-start lg:px-3 lg:py-2"
      >
        <Search className="h-4 w-4 lg:mr-2" />
        <span className="hidden lg:inline-flex">Buscar...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 lg:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Buscar páginas, contatos, demandas..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          {searchItems.map((group) => (
            <CommandGroup key={group.group} heading={group.group}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.path}
                  onSelect={() => handleSelect(item.path)}
                  className="flex items-center gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
};
