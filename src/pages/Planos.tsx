import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Star, Zap, Shield, BarChart3, Database, Mail, FileDown, FileUp, Settings, TrendingUp, Bell, Activity, RefreshCw } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const Planos = () => {
  const { user } = useAuth();
  const { subscribed, subscription_tier, loading, createCheckout, openCustomerPortal, hasAccessToPlan, checkSubscription } = useSubscription();
  const [actionLoading, setActionLoading] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const { toast } = useToast();

  // Check for success/cancel params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      toast({
        title: "Pagamento realizado com sucesso!",
        description: "Sua assinatura foi ativada. Verificando status...",
      });
      // Refresh subscription status after a delay
      setTimeout(() => {
        checkSubscription();
      }, 3000);
    } else if (urlParams.get('canceled') === 'true') {
      toast({
        title: "Pagamento cancelado",
        description: "Você pode tentar novamente quando quiser.",
        variant: "destructive",
      });
    }
  }, []);

  const planos = [
    {
      nome: "Básico",
      precoMensal: "R$ 97",
      precoAnual: "R$ 970",
      periodo: isAnnual ? "/ano" : "/mês",
      stripePriceIdMensal: "price_1234567890", // TODO: Substituir pelo ID real do Stripe
      stripePriceIdAnual: "price_1234567891", // TODO: Substituir pelo ID real do Stripe
      descricao: "Ideal para candidatos iniciantes",
      icone: Star,
      cor: "from-blue-500 to-blue-600",
      planType: "basic" as const,
      economia: isAnnual ? "2 meses grátis" : null,
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
      precoMensal: "R$ 197",
      precoAnual: "R$ 1.970",
      periodo: isAnnual ? "/ano" : "/mês",
      stripePriceIdMensal: "price_0987654321", // TODO: Substituir pelo ID real do Stripe
      stripePriceIdAnual: "price_0987654322", // TODO: Substituir pelo ID real do Stripe
      descricao: "Para candidatos em crescimento",
      icone: Crown,
      cor: "from-purple-500 to-purple-600",
      planType: "premium" as const,
      popular: true,
      economia: isAnnual ? "2 meses grátis" : null,
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
      precoMensal: "R$ 397",
      precoAnual: "R$ 3.970",
      periodo: isAnnual ? "/ano" : "/mês",
      stripePriceIdMensal: "price_1122334455", // TODO: Substituir pelo ID real do Stripe
      stripePriceIdAnual: "price_1122334456", // TODO: Substituir pelo ID real do Stripe
      descricao: "Para grandes campanhas políticas",
      icone: Zap,
      cor: "from-indigo-500 to-indigo-600",
      planType: "enterprise" as const,
      economia: isAnnual ? "2 meses grátis" : null,
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

  const funcionalidadesEspeciais = [
    {
      categoria: "Funcionalidades Administrativas",
      icone: Shield,
      cor: "from-green-500 to-emerald-600",
      items: [
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
      ]
    },
    {
      categoria: "Dashboard & Analytics",
      icone: TrendingUp,
      cor: "from-blue-500 to-indigo-600",
      items: [
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
      ]
    }
  ];

  const handleSubscribe = async (plano: any) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para assinar um plano",
        variant: "destructive",
      });
      return;
    }

    const stripePriceId = isAnnual ? plano.stripePriceIdAnual : plano.stripePriceIdMensal;
    setActionLoading(true);
    try {
      await createCheckout(stripePriceId, plano.planType as any);
    } catch (error) {
      console.error('Erro ao criar checkout:', error);
      toast({
        title: "Erro no pagamento",
        description: "Não foi possível processar o pagamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para gerenciar sua assinatura",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(true);
    try {
      await openCustomerPortal();
    } catch (error) {
      console.error('Erro ao abrir portal do cliente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível abrir o portal de gerenciamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const verificarDisponibilidade = (disponivel: string[]) => {
    return disponivel.includes(subscription_tier || 'basic');
  };

  const currentPlanName = subscription_tier === 'basic' ? 'Básico' : 
                         subscription_tier === 'premium' ? 'Premium' : 
                         subscription_tier === 'enterprise' ? 'Enterprise' : 'Básico';

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
        <div className="flex items-center justify-center gap-4">
          <Badge variant="outline" className="text-sm">
            Plano Atual: {currentPlanName}
          </Badge>
          {subscribed && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleManageSubscription}
              disabled={actionLoading}
            >
              Gerenciar Assinatura
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={checkSubscription}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar Status
          </Button>
        </div>
      </div>

      {/* Toggle Mensal/Anual */}
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-3 bg-gray-100 rounded-lg p-1">
          <Button
            variant={!isAnnual ? "default" : "ghost"}
            size="sm"
            onClick={() => setIsAnnual(false)}
            className={`transition-all duration-200 ${!isAnnual ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
          >
            Mensal
          </Button>
          <Button
            variant={isAnnual ? "default" : "ghost"}
            size="sm"
            onClick={() => setIsAnnual(true)}
            className={`transition-all duration-200 ${isAnnual ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
          >
            Anual
            <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
              -17%
            </Badge>
          </Button>
        </div>
      </div>

      {/* Planos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {planos.map((plano, index) => (
          <Card 
            key={index} 
            className={`relative border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm ${
              plano.popular ? 'ring-2 ring-purple-500 ring-offset-2 scale-105' : ''
            } ${
              subscription_tier === plano.planType ? 'ring-2 ring-green-500 ring-offset-2' : ''
            }`}
          >
            {plano.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1 text-sm font-semibold">
                  Mais Popular
                </Badge>
              </div>
            )}

            {subscription_tier === plano.planType && (
              <div className="absolute -top-4 right-4">
                <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 text-xs font-semibold">
                  Seu Plano
                </Badge>
              </div>
            )}
            
            {plano.economia && isAnnual && (
              <div className="absolute -top-4 left-4">
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 text-xs font-semibold">
                  {plano.economia}
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
                <span className="text-4xl font-bold text-gray-900">
                  {isAnnual ? plano.precoAnual : plano.precoMensal}
                </span>
                <span className="text-gray-600 ml-1">{plano.periodo}</span>
              </div>
              {isAnnual && (
                <p className="text-sm text-green-600 font-medium">
                  Economize 2 meses no plano anual
                </p>
              )}
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
                  subscription_tier === plano.planType ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={subscription_tier === plano.planType || actionLoading || loading}
                onClick={() => handleSubscribe(plano)}
              >
                {actionLoading ? 'Processando...' : 
                 subscription_tier === plano.planType ? 'Plano Atual' : 
                 plano.popular ? 'Começar Agora' : 'Escolher Plano'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Funcionalidades Especiais */}
      <div className="space-y-8 pt-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Funcionalidades Avançadas
          </h2>
          <p className="text-gray-600">Recursos especializados para potencializar sua campanha</p>
        </div>

        {funcionalidadesEspeciais.map((categoria, catIndex) => (
          <div key={catIndex} className="space-y-6">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${categoria.cor} flex items-center justify-center mx-auto mb-4`}>
                <categoria.icone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{categoria.categoria}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoria.items.map((funcionalidade, index) => {
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
          </div>
        ))}
      </div>

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
              resposta: "Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento através do painel do cliente."
            },
            {
              pergunta: "Como funciona o pagamento?",
              resposta: "Utilizamos o Stripe para processar pagamentos de forma segura. Aceitamos cartões de crédito e débito."
            },
            {
              pergunta: "Os dados são seguros?",
              resposta: "Sim, utilizamos criptografia de ponta e seguimos as melhores práticas de segurança para proteger seus dados."
            },
            {
              pergunta: "Posso cancelar a qualquer momento?",
              resposta: "Sim, não há fidelidade. Você pode cancelar quando quiser através do portal do cliente."
            },
            {
              pergunta: "Como funciona o backup automático?",
              resposta: "Realizamos backups diários automáticos com retenção de 30 dias no plano Enterprise."
            },
            {
              pergunta: "Existe suporte técnico?",
              resposta: "Sim, oferecemos suporte por email no plano básico e suporte prioritário 24/7 nos planos superiores."
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
