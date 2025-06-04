
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useContatosFicticios = () => {
  const { user } = useAuth();
  const [adicionandoDados, setAdicionandoDados] = useState(false);

  const contatosFicticios = [
    { nome: "João Silva", email: "joao.silva@email.com", telefone: "(11) 99999-1234", zona: "Centro", endereco: "Rua das Flores, 123", observacoes: "Interessado em mobilidade urbana", tags: ["eleitor", "mobilidade"] },
    { nome: "Maria Santos", email: "maria.santos@email.com", telefone: "(11) 99999-5678", zona: "Zona Norte", endereco: "Av. Principal, 456", observacoes: "Apoiadora ativa", tags: ["apoiadora", "saude"] },
    { nome: "Pedro Costa", email: "pedro.costa@email.com", telefone: "(11) 99999-9012", zona: "Zona Sul", endereco: "Rua da Esperança, 789", observacoes: "Líder comunitário", tags: ["lideranca", "comunidade"] },
    { nome: "Ana Lima", email: "ana.lima@email.com", telefone: "(11) 99999-3456", zona: "Zona Leste", endereco: "Rua do Progresso, 101", observacoes: "Professora engajada", tags: ["educacao", "professora"] },
    { nome: "Carlos Oliveira", email: "carlos.oliveira@email.com", telefone: "(11) 99999-7890", zona: "Centro", endereco: "Praça Central, 202", observacoes: "Comerciante local", tags: ["comercio", "economia"] },
    { nome: "Lucia Ferreira", email: "lucia.ferreira@email.com", telefone: "(11) 99999-1357", zona: "Zona Oeste", endereco: "Rua Nova, 303", observacoes: "Enfermeira do posto", tags: ["saude", "enfermeira"] },
    { nome: "Roberto Alves", email: "roberto.alves@email.com", telefone: "(11) 99999-2468", zona: "Zona Norte", endereco: "Av. Liberdade, 404", observacoes: "Aposentado ativo", tags: ["terceira-idade", "aposentado"] },
    { nome: "Fernanda Rocha", email: "fernanda.rocha@email.com", telefone: "(11) 99999-3579", zona: "Centro", endereco: "Rua do Comércio, 505", observacoes: "Jovem empreendedora", tags: ["jovem", "empreendedorismo"] },
    { nome: "José Mendes", email: "jose.mendes@email.com", telefone: "(11) 99999-4680", zona: "Zona Sul", endereco: "Rua da Paz, 606", observacoes: "Agricultor urbano", tags: ["agricultura", "sustentabilidade"] },
    { nome: "Cristina Barbosa", email: "cristina.barbosa@email.com", telefone: "(11) 99999-5791", zona: "Zona Leste", endereco: "Av. das Nações, 707", observacoes: "Advogada voluntária", tags: ["advocacia", "voluntariado"] },
    { nome: "Antonio Souza", email: "antonio.souza@email.com", telefone: "(11) 99999-6802", zona: "Zona Oeste", endereco: "Rua da Amizade, 808", observacoes: "Mecânico experiente", tags: ["mecanico", "trabalhador"] },
    { nome: "Patricia Dias", email: "patricia.dias@email.com", telefone: "(11) 99999-7913", zona: "Centro", endereco: "Praça da República, 909", observacoes: "Artista plástica", tags: ["arte", "cultura"] },
    { nome: "Eduardo Castro", email: "eduardo.castro@email.com", telefone: "(11) 99999-8024", zona: "Zona Norte", endereco: "Rua do Futuro, 1010", observacoes: "Engenheiro civil", tags: ["engenharia", "infraestrutura"] },
    { nome: "Sandra Gomes", email: "sandra.gomes@email.com", telefone: "(11) 99999-9135", zona: "Zona Sul", endereco: "Av. do Sol, 1111", observacoes: "Psicóloga clínica", tags: ["psicologia", "saude-mental"] },
    { nome: "Ricardo Pereira", email: "ricardo.pereira@email.com", telefone: "(11) 99999-0246", zona: "Zona Leste", endereco: "Rua da Alegria, 1212", observacoes: "Chef de cozinha", tags: ["gastronomia", "chef"] },
    { nome: "Mariana Carvalho", email: "mariana.carvalho@email.com", telefone: "(11) 99999-1357", zona: "Zona Oeste", endereco: "Rua da Harmonia, 1313", observacoes: "Fisioterapeuta", tags: ["fisioterapia", "saude"] },
    { nome: "Paulo Rodrigues", email: "paulo.rodrigues@email.com", telefone: "(11) 99999-2468", zona: "Centro", endereco: "Av. Central, 1414", observacoes: "Contador autônomo", tags: ["contabilidade", "autonomo"] },
    { nome: "Beatriz Nascimento", email: "beatriz.nascimento@email.com", telefone: "(11) 99999-3579", zona: "Zona Norte", endereco: "Rua da Esperança, 1515", observacoes: "Dentista pediátrica", tags: ["odontologia", "pediatria"] },
    { nome: "Marcos Teixeira", email: "marcos.teixeira@email.com", telefone: "(11) 99999-4680", zona: "Zona Sul", endereco: "Rua do Progresso, 1616", observacoes: "Eletricista certificado", tags: ["eletrica", "tecnico"] },
    { nome: "Camila Ribeiro", email: "camila.ribeiro@email.com", telefone: "(11) 99999-5791", zona: "Zona Leste", endereco: "Av. da Liberdade, 1717", observacoes: "Veterinária", tags: ["veterinaria", "animais"] },
    { nome: "Felipe Santos", email: "felipe.santos@email.com", telefone: "(11) 99999-6802", zona: "Zona Oeste", endereco: "Rua da Vitória, 1818", observacoes: "Personal trainer", tags: ["fitness", "esportes"] },
    { nome: "Juliana Moreira", email: "juliana.moreira@email.com", telefone: "(11) 99999-7913", zona: "Centro", endereco: "Praça dos Trabalhadores, 1919", observacoes: "Jornalista investigativa", tags: ["jornalismo", "midia"] },
    { nome: "Gabriel Silva", email: "gabriel.silva@email.com", telefone: "(11) 99999-8024", zona: "Zona Norte", endereco: "Rua da Inovação, 2020", observacoes: "Desenvolvedor de software", tags: ["tecnologia", "desenvolvedor"] },
    { nome: "Renata Costa", email: "renata.costa@email.com", telefone: "(11) 99999-9135", zona: "Zona Sul", endereco: "Av. da Tecnologia, 2121", observacoes: "Arquiteta sustentável", tags: ["arquitetura", "sustentabilidade"] },
    { nome: "Thiago Lima", email: "thiago.lima@email.com", telefone: "(11) 99999-0246", zona: "Zona Leste", endereco: "Rua do Conhecimento, 2222", observacoes: "Professor universitário", tags: ["educacao", "universidade"] },
    { nome: "Vanessa Martins", email: "vanessa.martins@email.com", telefone: "(11) 99999-1357", zona: "Zona Oeste", endereco: "Rua da Criatividade, 2323", observacoes: "Designer gráfica", tags: ["design", "criatividade"] },
    { nome: "Diego Fernandes", email: "diego.fernandes@email.com", telefone: "(11) 99999-2468", zona: "Centro", endereco: "Av. do Empreendedorismo, 2424", observacoes: "Empresário social", tags: ["empreendedorismo", "social"] },
    { nome: "Larissa Azevedo", email: "larissa.azevedo@email.com", telefone: "(11) 99999-3579", zona: "Zona Norte", endereco: "Rua da Música, 2525", observacoes: "Professora de música", tags: ["musica", "educacao"] },
    { nome: "Bruno Cardoso", email: "bruno.cardoso@email.com", telefone: "(11) 99999-4680", zona: "Zona Sul", endereco: "Rua do Esporte, 2626", observacoes: "Técnico em informática", tags: ["informatica", "tecnico"] },
    { nome: "Aline Sousa", email: "aline.sousa@email.com", telefone: "(11) 99999-5791", zona: "Zona Leste", endereco: "Av. da Saúde, 2727", observacoes: "Nutricionista clínica", tags: ["nutricao", "saude"] },
    { nome: "Rodrigo Oliveira", email: "rodrigo.oliveira@email.com", telefone: "(11) 99999-6802", zona: "Zona Oeste", endereco: "Rua da Segurança, 2828", observacoes: "Bombeiro voluntário", tags: ["bombeiro", "seguranca"] },
    { nome: "Carolina Reis", email: "carolina.reis@email.com", telefone: "(11) 99999-7913", zona: "Centro", endereco: "Praça da Justiça, 2929", observacoes: "Assistente social", tags: ["assistencia-social", "comunidade"] },
    { nome: "Leonardo Barros", email: "leonardo.barros@email.com", telefone: "(11) 99999-8024", zona: "Zona Norte", endereco: "Rua da Construção, 3030", observacoes: "Pedreiro especializado", tags: ["construcao", "pedreiro"] },
    { nome: "Tatiana Vieira", email: "tatiana.vieira@email.com", telefone: "(11) 99999-9135", zona: "Zona Sul", endereco: "Av. da Beleza, 3131", observacoes: "Esteticista", tags: ["estetica", "beleza"] },
    { nome: "Gustavo Pinto", email: "gustavo.pinto@email.com", telefone: "(11) 99999-0246", zona: "Zona Leste", endereco: "Rua da Logística, 3232", observacoes: "Motorista de caminhão", tags: ["transporte", "logistica"] },
    { nome: "Isabella Santos", email: "isabella.santos@email.com", telefone: "(11) 99999-1357", zona: "Zona Oeste", endereco: "Rua da Farmácia, 3333", observacoes: "Farmacêutica", tags: ["farmacia", "medicamentos"] },
    { nome: "André Campos", email: "andre.campos@email.com", telefone: "(11) 99999-2468", zona: "Centro", endereco: "Av. do Turismo, 3434", observacoes: "Guia turístico", tags: ["turismo", "guia"] },
    { nome: "Priscila Monteiro", email: "priscila.monteiro@email.com", telefone: "(11) 99999-3579", zona: "Zona Norte", endereco: "Rua da Terapia, 3535", observacoes: "Terapeuta ocupacional", tags: ["terapia", "ocupacional"] },
    { nome: "Vinicius Rocha", email: "vinicius.rocha@email.com", telefone: "(11) 99999-4680", zona: "Zona Sul", endereco: "Rua da Soldagem, 3636", observacoes: "Soldador industrial", tags: ["soldagem", "industrial"] },
    { nome: "Simone Almeida", email: "simone.almeida@email.com", telefone: "(11) 99999-5791", zona: "Zona Leste", endereco: "Av. da Administração, 3737", observacoes: "Administradora", tags: ["administracao", "gestao"] },
    { nome: "Márcio Cunha", email: "marcio.cunha@email.com", telefone: "(11) 99999-6802", zona: "Zona Oeste", endereco: "Rua da Pintura, 3838", observacoes: "Pintor profissional", tags: ["pintura", "profissional"] },
    { nome: "Débora Freitas", email: "debora.freitas@email.com", telefone: "(11) 99999-7913", zona: "Centro", endereco: "Praça da Comunicação, 3939", observacoes: "Publicitária", tags: ["publicidade", "comunicacao"] },
    { nome: "Fábio Correia", email: "fabio.correia@email.com", telefone: "(11) 99999-8024", zona: "Zona Norte", endereco: "Rua da Mecânica, 4040", observacoes: "Mecânico de motos", tags: ["mecanica", "motos"] },
    { nome: "Natália Castro", email: "natalia.castro@email.com", telefone: "(11) 99999-9135", zona: "Zona Sul", endereco: "Av. da Enfermagem, 4141", observacoes: "Técnica em enfermagem", tags: ["enfermagem", "tecnica"] },
    { nome: "Henrique Silva", email: "henrique.silva@email.com", telefone: "(11) 99999-0246", zona: "Zona Leste", endereco: "Rua da Eletrônica, 4242", observacoes: "Técnico em eletrônica", tags: ["eletronica", "tecnico"] },
    { nome: "Carla Mendonça", email: "carla.mendonca@email.com", telefone: "(11) 99999-1357", zona: "Zona Oeste", endereco: "Rua da Limpeza, 4343", observacoes: "Empresária de limpeza", tags: ["limpeza", "empresaria"] },
    { nome: "Rafael Duarte", email: "rafael.duarte@email.com", telefone: "(11) 99999-2468", zona: "Centro", endereco: "Av. da Advocacia, 4444", observacoes: "Advogado trabalhista", tags: ["advocacia", "trabalhista"] },
    { nome: "Mônica Barbosa", email: "monica.barbosa@email.com", telefone: "(11) 99999-3579", zona: "Zona Norte", endereco: "Rua da Costura, 4545", observacoes: "Costureira especializada", tags: ["costura", "moda"] },
    { nome: "Claudio Ramos", email: "claudio.ramos@email.com", telefone: "(11) 99999-4680", zona: "Zona Sul", endereco: "Rua da Jardinagem, 4646", observacoes: "Jardineiro paisagista", tags: ["jardinagem", "paisagismo"] },
    { nome: "Fernanda Costa", email: "fernanda.costa2@email.com", telefone: "(11) 99999-5791", zona: "Zona Leste", endereco: "Av. da Fisioterapia, 4747", observacoes: "Fisioterapeuta esportiva", tags: ["fisioterapia", "esportes"] },
    { nome: "Sergio Lima", email: "sergio.lima@email.com", telefone: "(11) 99999-6802", zona: "Zona Oeste", endereco: "Rua da Padaria, 4848", observacoes: "Padeiro artesanal", tags: ["padaria", "artesanal"] }
  ];

  const adicionarContatosFicticios = async () => {
    if (!user || adicionandoDados) return;

    setAdicionandoDados(true);
    try {
      // Verificar se já existem contatos
      const { data: existingContacts } = await supabase
        .from('contatos')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (existingContacts && existingContacts.length > 0) {
        console.log('Contatos já existem, não adicionando dados fictícios');
        return;
      }

      // Preparar dados para inserção
      const contatosParaInserir = contatosFicticios.map(contato => ({
        ...contato,
        user_id: user.id,
        data_nascimento: new Date(1980 + Math.floor(Math.random() * 30), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
      }));

      // Inserir em lotes de 10
      for (let i = 0; i < contatosParaInserir.length; i += 10) {
        const lote = contatosParaInserir.slice(i, i + 10);
        const { error } = await supabase
          .from('contatos')
          .insert(lote);

        if (error) {
          console.error('Erro ao inserir lote de contatos:', error);
        }
      }

      console.log('Contatos fictícios adicionados com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar contatos fictícios:', error);
    } finally {
      setAdicionandoDados(false);
    }
  };

  useEffect(() => {
    if (user) {
      adicionarContatosFicticios();
    }
  }, [user]);

  return { adicionandoDados };
};
