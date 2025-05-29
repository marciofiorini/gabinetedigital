
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Crown, Zap } from "lucide-react";
import { LayoutMain } from "@/components/LayoutMain";

const Planos = () => {
  const planos = [
    {
      nome: "Básico",
      preco: "R$ 297",
      periodo: "/mês",
      icon: Star,
      popular: false,
      descricao: "Ideal para vereadores e candidatos iniciantes",
      recursos: [
        "Até 100 demandas por mês",
        "Cadastro de até 500 líderes",
        "2 grupos WhatsApp",
        "Agenda básica",
        "Relatórios mensais",
        "Suporte por email"
      ],
      limitacoes: [
        "Sem integração Instagram",
        "Sem CRM avançado"
      ]
    },
    {
      nome: "Profissional",
      preco: "R$ 597",
      periodo: "/mês",
      icon: Crown,
      popular: true,
      descricao: "Perfeito para prefeitos e deputados estaduais",
      recursos: [
        "Demandas ilimitadas",
        "Cadastro ilimitado de líderes",
        "Grupos WhatsApp ilimitados",
        "CRM completo em Kanban",
        "Integração Instagram",
        "Agenda avançada com lembretes",
        "Relatórios detalhados",
        "Suporte prioritário",
        "Dashboard analytics",
        "Templates personalizados"
      ],
      limitacoes: []
    },
    {
      nome: "Enterprise",
      preco: "R$ 1.197",
      periodo: "/mês",
      icon: Zap,
      popular: false,
      descricao: "Para senadores e deputados federais",
      recursos: [
        "Tudo do plano Profissional",
        "Multi-usuários (até 10)",
        "API personalizada",
        "Integração com redes sociais",
        "IA para análise de sentimentos",
        "Suporte 24/7",
        "Treinamento da equipe",
        "Backup em tempo real",
        "Relatórios personalizados",
        "Integração com sistemas externos"
      ],
      limitacoes: []
    }
  ];

  return (
    <LayoutMain>
      <div className="w-full max-w-none space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Escolha Seu Plano
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Soluções personalizadas para cada tipo de mandato político. 
            Do vereador ao senador, temos o plano ideal para você.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          {planos.map((plano, index) => {
            const Icon = plano.icon;
            return (
              <Card 
                key={index} 
                className={`relative hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                  plano.popular ? 'border-2 border-blue-500 shadow-xl' : ''
                }`}
              >
                {plano.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                    Mais Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                    plano.popular 
                      ? 'bg-gradient-to-r from-blue-100 to-purple-100' 
                      : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-8 h-8 ${
                      plano.popular 
                        ? 'text-blue-600' 
                        : 'text-gray-600'
                    }`} />
                  </div>
                  <CardTitle className="text-2xl font-bold">{plano.nome}</CardTitle>
                  <CardDescription className="text-gray-600 mt-2">
                    {plano.descricao}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plano.preco}</span>
                    <span className="text-gray-600">{plano.periodo}</span>
                  </div>
                </CardHeader>

                <CardContent>
                  <Button 
                    className={`w-full mb-6 ${
                      plano.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                        : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                  >
                    Contratar Agora
                  </Button>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      Recursos Inclusos
                    </h4>
                    {plano.recursos.map((recurso, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{recurso}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center pt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Precisa de algo personalizado?
          </h3>
          <p className="text-gray-600 mb-6">
            Entre em contato conosco para criar um plano sob medida para seu mandato.
          </p>
          <Button variant="outline" size="lg">
            Falar com Especialista
          </Button>
        </div>
      </div>
    </LayoutMain>
  );
};

export default Planos;
