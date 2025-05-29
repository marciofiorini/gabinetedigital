
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Star, Zap } from "lucide-react";

const Planos = () => {
  const planos = [
    {
      nome: "Básico",
      preco: "R$ 97",
      periodo: "/mês",
      descricao: "Ideal para candidatos iniciantes",
      icone: Star,
      cor: "from-blue-500 to-blue-600",
      recursos: [
        "Até 1.000 contatos",
        "5 campanhas de e-mail por mês",
        "Dashboard básico",
        "Suporte por e-mail",
        "Agenda básica"
      ],
      limitacoes: [
        "WhatsApp limitado",
        "Instagram básico"
      ]
    },
    {
      nome: "Premium",
      preco: "R$ 197",
      periodo: "/mês",
      descricao: "Para candidatos em crescimento",
      icone: Crown,
      cor: "from-purple-500 to-purple-600",
      popular: true,
      recursos: [
        "Até 10.000 contatos",
        "Campanhas ilimitadas",
        "CRM completo",
        "WhatsApp integrado",
        "Instagram avançado",
        "Analytics completo",
        "Suporte prioritário",
        "Relatórios em PDF"
      ]
    },
    {
      nome: "Enterprise",
      preco: "R$ 397",
      periodo: "/mês",
      descricao: "Para grandes campanhas políticas",
      icone: Zap,
      cor: "from-indigo-500 to-indigo-600",
      recursos: [
        "Contatos ilimitados",
        "Tudo do Premium",
        "API personalizada",
        "Suporte 24/7",
        "Treinamento especializado",
        "Integração personalizada",
        "Gerente de conta dedicado",
        "Relatórios customizados"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Escolha seu Plano
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Encontre o plano ideal para sua campanha política e maximize seus resultados
        </p>
      </div>

      {/* Planos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {planos.map((plano, index) => (
          <Card 
            key={index} 
            className={`relative border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm ${
              plano.popular ? 'ring-2 ring-purple-500 ring-offset-2 scale-105' : ''
            }`}
          >
            {plano.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1 text-sm font-semibold">
                  Mais Popular
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
                className={`w-full bg-gradient-to-r ${plano.cor} hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200`}
              >
                {plano.popular ? 'Começar Agora' : 'Escolher Plano'}
              </Button>
            </CardContent>
          </Card>
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
