
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Crown, Star, Zap, Shield, BarChart3, Database, Mail, FileDown, FileUp, Settings, TrendingUp, Bell, Download, Users, Activity } from "lucide-react";
import { useUserPlans } from "@/hooks/useUserPlans";

const Planos = () => {
  const { userPlan, hasAccessToPlan } = useUserPlans();

  const planos = [
    {
      nome: "Básico",
      preco: "R$ 97",
      periodo: "/mês",
      descricao: "Ideal para candidatos iniciantes",
      icone: Star,
      cor: "from-blue-500 to-blue-600",
      planType: "basic" as const,
      recursos: [
        "Até 1.000 contatos",
        "5 campanhas de e-mail por mês",
        "Dashboard básico",
        "Suporte por e-mail",
        "Agenda básica",
        "Relatórios mensais"
      ],
      limitacoes: [
        "WhatsApp limitado (100 mensagens/mês)",
        "Instagram básico",
        "Analytics limitado"
      ]
    },
    {
      nome: "Premium",
      preco: "R$ 197",
      periodo: "/mês",
      descricao: "Para candidatos em crescimento",
      icone: Crown,
      cor: "from-purple-500 to-purple-600",
      planType: "premium" as const,
      popular: true,
      recursos: [
        "Até 10.000 contatos",
        "Campanhas ilimitadas",
        "CRM completo",
        "WhatsApp integrado",
        "Instagram avançado",
        "Analytics completo",
        "Suporte prioritário",
        "Relatórios em PDF",
        "Templates de email",
        "Métricas em tempo real",
        "Gráficos avançados",
        "Import/Export básico"
      ]
    },
    {
      nome: "Enterprise",
      preco: "R$ 397",
      periodo: "/mês",
      descricao: "Para grandes campanhas políticas",
      icone: Zap,
      cor: "from-indigo-500 to-indigo-600",
      planType: "enterprise" as const,
      recursos: [
        "Contatos ilimitados",
        "Tudo do Premium",
        "API personalizada",
        "Suporte 24/7",
        "Treinamento especializado",
        "Integração personalizada",
        "Gerente de conta dedicado",
        "Relatórios customizados",
        "Backup automático",
        "Import/Export em massa",
        "Templates de email avançados",
        "Configurações administrativas",
        "Alertas inteligentes",
        "Relatórios automáticos"
      ]
    }
  ];

  const funcionalidadesAdministrativas = [
    {
      nome: "Backup Automático",
      descricao: "Sistema de backup dos dados em tempo real",
      icone: Database,
      disponivel: ["enterprise"],
      detalhes: "Backup diário automático com retenção de 30 dias"
    },
    {
      nome: "Import/Export em Massa",
      descricao: "Operações em lote de usuários e dados",
      icone: FileDown,
      disponivel: ["premium", "enterprise"],
      detalhes: "Importação e exportação de contatos, leads e demandas"
    },
    {
      nome: "Templates de Email",
      descricao: "Sistema de notificações customizáveis",
      icone: Mail,
      disponivel: ["premium", "enterprise"],
      detalhes: "Editor avançado com variáveis dinâmicas"
    },
    {
      nome: "Configurações Avançadas",
      descricao: "Parâmetros globais do sistema",
      icone: Settings,
      disponivel: ["enterprise"],
      detalhes: "Controle total sobre comportamentos do sistema"
    }
  ];

  const dashboardAnalytics = [
    {
      nome: "Métricas em Tempo Real",
      descricao: "Contadores dinâmicos de usuários ativos",
      icone: Activity,
      disponivel: ["premium", "enterprise"],
      detalhes: "Atualizações automáticas a cada 30 segundos"
    },
    {
      nome: "Gráficos Avançados",
      descricao: "Charts de performance e uso do sistema",
      icone: BarChart3,
      disponivel: ["premium", "enterprise"],
      detalhes: "Visualizações interativas com drill-down"
    },
    {
      nome: "Relatórios Automáticos",
      descricao: "Envio de relatórios por email",
      icone: FileUp,
      disponivel: ["enterprise"],
      detalhes: "Relatórios semanais e mensais automáticos"
    },
    {
      nome: "Alertas Inteligentes",
      descricao: "Notificações baseadas em thresholds",
      icone: Bell,
      disponivel: ["enterprise"],
      detalhes: "Alertas personalizáveis para métricas críticas"
    }
  ];

  const verificarDisponibilidade = (disponivel: string[]) => {
    return disponivel.includes(userPlan);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Planos e Funcionalidades
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Encontre o plano ideal para sua campanha política e maximize seus resultados
        </p>
        <Badge variant="outline" className="text-sm">
          Plano Atual: {userPlan === 'basic' ? 'Básico' : userPlan === 'premium' ? 'Premium' : 'Enterprise'}
        </Badge>
      </div>

      <Tabs defaultValue="planos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="planos">Planos</TabsTrigger>
          <TabsTrigger value="admin">Funcionalidades Admin</TabsTrigger>
          <TabsTrigger value="analytics">Dashboard & Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="planos" className="space-y-8">
          {/* Planos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {planos.map((plano, index) => (
              <Card 
                key={index} 
                className={`relative border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm ${
                  plano.popular ? 'ring-2 ring-purple-500 ring-offset-2 scale-105' : ''
                } ${
                  userPlan === plano.planType ? 'ring-2 ring-green-500 ring-offset-2' : ''
                }`}
              >
                {plano.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1 text-sm font-semibold">
                      Mais Popular
                    </Badge>
                  </div>
                )}

                {userPlan === plano.planType && (
                  <div className="absolute -top-4 right-4">
                    <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 text-xs font-semibold">
                      Seu Plano
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${plano.cor} flex items-center justify-center mx-auto mb-4`}>
                    <plano.icone className="w-8 h-8 text-white" />
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {plano.nome}
                  </CardTitle>
                  
                  <CardDescription className="text-gray-600 mb-4">
                    {plano.descricao}
                  </CardDescription>
                  
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">{plano.preco}</span>
                    <span className="text-gray-600 ml-1">{plano.periodo}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Recursos */}
                  <div className="space-y-3">
                    {plano.recursos.map((recurso, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-gray-700 text-sm">{recurso}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limitações (se existirem) */}
                  {plano.limitacoes && (
                    <div className="space-y-2 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500 font-medium">Limitações:</p>
                      {plano.limitacoes.map((limitacao, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-yellow-600 text-xs">!</span>
                          </div>
                          <span className="text-gray-600 text-xs">{limitacao}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Botão */}
                  <Button 
                    className={`w-full bg-gradient-to-r ${plano.cor} hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 ${
                      userPlan === plano.planType ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={userPlan === plano.planType}
                  >
                    {userPlan === plano.planType ? 'Plano Atual' : plano.popular ? 'Começar Agora' : 'Escolher Plano'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="admin" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
              <Shield className="w-6 h-6" />
              Funcionalidades Administrativas
            </h2>
            <p className="text-gray-600">Recursos avançados para gestão e automação</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {funcionalidadesAdministrativas.map((funcionalidade, index) => {
              const temAcesso = verificarDisponibilidade(funcionalidade.disponivel);
              const Icon = funcionalidade.icone;
              
              return (
                <Card key={index} className={`transition-all duration-200 ${temAcesso ? 'border-green-200 bg-green-50/50' : 'border-gray-200 opacity-60'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${temAcesso ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <Icon className={`w-6 h-6 ${temAcesso ? 'text-green-600' : 'text-gray-400'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{funcionalidade.nome}</h4>
                          {temAcesso && <Check className="w-4 h-4 text-green-600" />}
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{funcionalidade.descricao}</p>
                        <p className="text-xs text-gray-500">{funcionalidade.detalhes}</p>
                        <div className="mt-3">
                          <Badge variant={temAcesso ? "default" : "secondary"} className="text-xs">
                            {funcionalidade.disponivel.map(plan => 
                              plan === 'basic' ? 'Básico' : 
                              plan === 'premium' ? 'Premium' : 'Enterprise'
                            ).join(', ')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Dashboard & Analytics
            </h2>
            <p className="text-gray-600">Insights avançados e métricas em tempo real</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dashboardAnalytics.map((analytic, index) => {
              const temAcesso = verificarDisponibilidade(analytic.disponivel);
              const Icon = analytic.icone;
              
              return (
                <Card key={index} className={`transition-all duration-200 ${temAcesso ? 'border-blue-200 bg-blue-50/50' : 'border-gray-200 opacity-60'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${temAcesso ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <Icon className={`w-6 h-6 ${temAcesso ? 'text-blue-600' : 'text-gray-400'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{analytic.nome}</h4>
                          {temAcesso && <Check className="w-4 h-4 text-blue-600" />}
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{analytic.descricao}</p>
                        <p className="text-xs text-gray-500">{analytic.detalhes}</p>
                        <div className="mt-3">
                          <Badge variant={temAcesso ? "default" : "secondary"} className="text-xs">
                            {analytic.disponivel.map(plan => 
                              plan === 'basic' ? 'Básico' : 
                              plan === 'premium' ? 'Premium' : 'Enterprise'
                            ).join(', ')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto space-y-6 pt-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Perguntas Frequentes
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              pergunta: "Posso mudar de plano a qualquer momento?",
              resposta: "Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento."
            },
            {
              pergunta: "Existe período de teste gratuito?",
              resposta: "Sim, oferecemos 7 dias grátis para testar todas as funcionalidades."
            },
            {
              pergunta: "Os dados são seguros?",
              resposta: "Sim, utilizamos criptografia de ponta e seguimos as melhores práticas de segurança."
            },
            {
              pergunta: "Posso cancelar a qualquer momento?",
              resposta: "Sim, não há fidelidade. Você pode cancelar quando quiser."
            },
            {
              pergunta: "Como funciona o backup automático?",
              resposta: "Realizamos backups diários com retenção de 30 dias no plano Enterprise."
            },
            {
              pergunta: "Posso exportar meus dados?",
              resposta: "Sim, oferecemos export completo de dados nos planos Premium e Enterprise."
            }
          ].map((faq, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 mb-2">{faq.pergunta}</h4>
                <p className="text-gray-600 text-sm">{faq.resposta}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Planos;
