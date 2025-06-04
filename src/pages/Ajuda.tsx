
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  LayoutDashboard, 
  Users, 
  Crown, 
  Target, 
  FileText, 
  Scale, 
  MessageCircle, 
  Instagram, 
  Mail, 
  BarChart3, 
  Monitor, 
  Vote, 
  DoorOpen, 
  Map, 
  Settings,
  CreditCard,
  DollarSign,
  Receipt,
  PieChart,
  Zap,
  HelpCircle,
  Book,
  PlayCircle,
  ExternalLink,
  Calendar,
  Phone,
  AlertCircle
} from 'lucide-react';

const Ajuda = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('visao-geral');

  const sections = [
    {
      id: 'visao-geral',
      title: 'Visão Geral',
      icon: LayoutDashboard,
      content: [
        {
          title: 'Dashboard Principal',
          description: 'Central de controle com métricas em tempo real',
          features: [
            'Resumo diário de demandas pendentes',
            'Contatos novos do dia',
            'Aniversariantes',
            'Gráficos de performance',
            'Notificações importantes'
          ],
          tips: [
            'Use os filtros de data para análises específicas',
            'Configure notificações para não perder prazos',
            'Monitore as métricas semanalmente'
          ]
        }
      ]
    },
    {
      id: 'contatos',
      title: 'Gestão de Contatos',
      icon: Users,
      content: [
        {
          title: 'Lista de Contatos',
          description: 'Gerencie sua base de contatos eleitorais',
          features: [
            'Cadastro completo com dados pessoais',
            'Organização por zonas eleitorais',
            'Sistema de tags personalizáveis',
            'Histórico de interações',
            'Importação via CSV',
            'Filtros avançados'
          ],
          tips: [
            'Use tags para categorizar contatos por interesse',
            'Mantenha os dados atualizados regularmente',
            'Configure lembretes para aniversários'
          ]
        },
        {
          title: 'Upload de Contatos',
          description: 'Importação em massa via planilha',
          features: [
            'Suporte a arquivos CSV',
            'Validação automática de dados',
            'Preview antes da importação',
            'Relatório de erros'
          ]
        }
      ]
    },
    {
      id: 'lideres',
      title: 'Líderes de Influência',
      icon: Crown,
      content: [
        {
          title: 'Gestão de Lideranças',
          description: 'Mapeamento e relacionamento com líderes locais',
          features: [
            'Cadastro com nível de influência',
            'Organização por região',
            'Status de relacionamento',
            'Histórico de contatos',
            'Avaliação de impacto'
          ],
          tips: [
            'Mantenha contato regular com líderes ativos',
            'Documente todas as reuniões',
            'Avalie periodicamente o nível de influência'
          ]
        }
      ]
    },
    {
      id: 'crm',
      title: 'CRM - Pipeline',
      icon: Target,
      content: [
        {
          title: 'Funil de Conversão',
          description: 'Acompanhe leads desde o primeiro contato até a conversão',
          features: [
            'Kanban com 4 estágios: Leads, Qualificados, Proposta, Fechados',
            'Score de qualificação automático',
            'Tags personalizáveis',
            'Histórico completo de interações',
            'Filtros por região e interesse'
          ],
          tips: [
            'Mova cards conforme o progresso do lead',
            'Use o score para priorizar contatos',
            'Agende follow-ups regulares'
          ]
        }
      ]
    },
    {
      id: 'demandas',
      title: 'Gestão de Demandas',
      icon: FileText,
      content: [
        {
          title: 'Controle de Solicitações',
          description: 'Organize e acompanhe demandas da população',
          features: [
            'Cadastro com prioridade e categoria',
            'Status de andamento',
            'Prazos e alertas',
            'Histórico de atualizações',
            'Relatórios de conclusão'
          ],
          tips: [
            'Defina prazos realistas',
            'Mantenha o solicitante informado',
            'Use categorias para análises estatísticas'
          ]
        }
      ]
    },
    {
      id: 'projetos-lei',
      title: 'Projetos de Lei',
      icon: Scale,
      content: [
        {
          title: 'Acompanhamento Legislativo',
          description: 'Monitore projetos de lei e proposições',
          features: [
            'Cadastro de projetos',
            'Status de tramitação',
            'Documentos anexos',
            'Cronograma de votações',
            'Relatórios de impacto'
          ]
        }
      ]
    },
    {
      id: 'comunicacao',
      title: 'Canais de Comunicação',
      icon: MessageCircle,
      content: [
        {
          title: 'Central de Comunicação',
          description: 'Gerencie todos os canais de comunicação',
          features: [
            'WhatsApp Business integrado',
            'E-mail marketing',
            'Instagram Direct',
            'Templates personalizáveis',
            'Agendamento de mensagens',
            'Métricas de engajamento'
          ]
        },
        {
          title: 'WhatsApp',
          description: 'Atendimento direto via WhatsApp',
          features: [
            'Chat em tempo real',
            'Respostas automáticas',
            'Grupos organizados',
            'Backup de conversas'
          ]
        },
        {
          title: 'E-mail',
          description: 'Campanhas de e-mail marketing',
          features: [
            'Editor de templates',
            'Listas segmentadas',
            'Métricas de abertura',
            'A/B Testing'
          ]
        },
        {
          title: 'Instagram',
          description: 'Gestão de Instagram Direct',
          features: [
            'Mensagens diretas',
            'Stories interativos',
            'Agendamento de posts',
            'Analytics de engajamento'
          ]
        }
      ]
    },
    {
      id: 'painel',
      title: 'Painel Analítico',
      icon: BarChart3,
      content: [
        {
          title: 'Analytics Avançado',
          description: 'Análises detalhadas de performance',
          features: [
            'Métricas de engajamento',
            'Dados eleitorais',
            'Comparativos temporais',
            'Dashboards customizáveis',
            'Exportação de relatórios'
          ]
        },
        {
          title: 'Monitor de Redes',
          description: 'Acompanhamento de redes sociais',
          features: [
            'Monitoramento de menções',
            'Análise de sentimento',
            'Comparação com concorrentes',
            'Alertas automáticos'
          ]
        },
        {
          title: 'Pesquisas',
          description: 'Criação e análise de pesquisas',
          features: [
            'Formulários personalizados',
            'Distribuição automática',
            'Análise estatística',
            'Gráficos interativos'
          ]
        },
        {
          title: 'Portal do Cidadão',
          description: 'Interface pública para solicitações',
          features: [
            'Formulários online',
            'Protocolo de atendimento',
            'Acompanhamento público',
            'FAQ automatizado'
          ]
        },
        {
          title: 'Mapa de Influência',
          description: 'Visualização geográfica de dados',
          features: [
            'Mapas interativos',
            'Densidade eleitoral',
            'Pontos de interesse',
            'Rotas otimizadas'
          ]
        },
        {
          title: 'Sistema de Votações',
          description: 'Acompanhamento de votações',
          features: [
            'Registro de votos',
            'Análise de posicionamento',
            'Histórico legislativo',
            'Relatórios de coerência'
          ]
        }
      ]
    },
    {
      id: 'gestao',
      title: 'Gestão Administrativa',
      icon: Settings,
      content: [
        {
          title: 'Gestão de Equipe',
          description: 'Administração de recursos humanos',
          features: [
            'Cadastro de funcionários',
            'Ponto eletrônico',
            'Avaliações de desempenho',
            'Agenda da equipe',
            'Tarefas e metas'
          ]
        },
        {
          title: 'Orçamento Público',
          description: 'Controle orçamentário e emendas',
          features: [
            'Cadastro de emendas',
            'Acompanhamento de execução',
            'Relatórios financeiros',
            'Status de aprovação',
            'Documentos oficiais'
          ]
        },
        {
          title: 'Prestação de Contas',
          description: 'Transparência e accountability',
          features: [
            'Lançamentos financeiros',
            'Categorização de gastos',
            'Comprovantes digitais',
            'Relatórios periódicos',
            'Auditoria interna'
          ]
        },
        {
          title: 'Projetos com Impacto Financeiro',
          description: 'Gestão de projetos e custos',
          features: [
            'Planejamento financeiro',
            'Controle de custos',
            'Cronograma de execução',
            'ROI e beneficiários',
            'Documentação completa'
          ]
        }
      ]
    },
    {
      id: 'configuracoes',
      title: 'Configurações',
      icon: Settings,
      content: [
        {
          title: 'Preferências do Sistema',
          description: 'Personalize sua experiência',
          features: [
            'Tema claro/escuro',
            'Notificações',
            'Atalhos de teclado',
            'Timezone',
            'Idioma'
          ]
        },
        {
          title: 'Integrações',
          description: 'Conecte serviços externos',
          features: [
            'Google Calendar',
            'WhatsApp Business',
            'E-mail providers',
            'Webhooks personalizados'
          ]
        }
      ]
    },
    {
      id: 'planos',
      title: 'Planos e Assinatura',
      icon: CreditCard,
      content: [
        {
          title: 'Gerenciamento de Planos',
          description: 'Informações sobre sua assinatura',
          features: [
            'Plano atual e benefícios',
            'Histórico de pagamentos',
            'Upgrade/downgrade',
            'Faturas e recibos',
            'Cancelamento'
          ]
        }
      ]
    }
  ];

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.content.some(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const quickLinks = [
    { title: 'Primeiros Passos', icon: PlayCircle, href: '#primeiros-passos' },
    { title: 'Vídeo Tutoriais', icon: PlayCircle, href: '#videos' },
    { title: 'FAQ', icon: HelpCircle, href: '#faq' },
    { title: 'Contato Suporte', icon: Phone, href: '#suporte' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Central de Ajuda
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Encontre tudo sobre o Painel Político e suas funcionalidades
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Buscar na ajuda..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="w-5 h-5" />
            Links Rápidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((link) => (
              <Button
                key={link.title}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
                asChild
              >
                <a href={link.href}>
                  <link.icon className="w-6 h-6" />
                  <span className="text-sm">{link.title}</span>
                </a>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-sm">Navegação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {sections.map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "default" : "ghost"}
                  className="w-full justify-start text-sm h-auto p-2"
                  onClick={() => setActiveSection(section.id)}
                >
                  <section.icon className="w-4 h-4 mr-2" />
                  {section.title}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {filteredSections.map((section) => (
            <div
              key={section.id}
              className={`space-y-6 ${activeSection === section.id ? 'block' : 'hidden'}`}
            >
              <div className="flex items-center gap-3 mb-6">
                <section.icon className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl font-bold">{section.title}</h2>
              </div>

              {section.content.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {item.title}
                      <Badge variant="outline">Módulo</Badge>
                    </CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Funcionalidades Principais
                      </h4>
                      <ul className="space-y-1">
                        {item.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {item.tips && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-600" />
                          Dicas de Uso
                        </h4>
                        <ul className="space-y-1">
                          {item.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                              <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <Card id="faq">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Perguntas Frequentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Como importar contatos via CSV?</h4>
              <p className="text-sm text-gray-600">
                Acesse Contatos → Upload CSV, baixe o template, preencha com seus dados e faça o upload. 
                O sistema validará automaticamente os dados.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Como configurar notificações?</h4>
              <p className="text-sm text-gray-600">
                Vá em Configurações → Notificações e escolha quais alertas deseja receber via 
                e-mail ou push notification.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Posso integrar com WhatsApp Business?</h4>
              <p className="text-sm text-gray-600">
                Sim! Acesse Configurações → Integrações → WhatsApp para conectar sua conta 
                WhatsApp Business.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support Contact */}
      <Card id="suporte">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Precisa de Mais Ajuda?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Mail className="w-6 h-6 text-blue-600" />
              <div>
                <h4 className="font-semibold">E-mail Suporte</h4>
                <p className="text-sm text-gray-600">suporte@painelpolitico.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Phone className="w-6 h-6 text-green-600" />
              <div>
                <h4 className="font-semibold">WhatsApp</h4>
                <p className="text-sm text-gray-600">(11) 99999-9999</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Ajuda;
