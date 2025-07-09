import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight, Zap } from "lucide-react";

const plans = [
  {
    name: "Starter",
    description: "Ideal para pequenas obras e construtoras iniciantes",
    price: "297",
    period: "/mês",
    badge: null,
    features: [
      "RDO automatizado para até 3 obras",
      "Gestão básica de mão de obra",
      "App mobile essencial",
      "Relatórios básicos",
      "Suporte via chat",
      "Armazenamento 10GB"
    ],
    cta: "Começar Teste Grátis",
    popular: false
  },
  {
    name: "Professional",
    description: "Para construtoras em crescimento com múltiplas obras",
    price: "597",
    period: "/mês",
    badge: "Mais Popular",
    features: [
      "RDO ilimitado para todas as obras",
      "Gestão completa de equipes",
      "Cronograma Gantt com IA",
      "Orçamentos inteligentes",
      "CRM básico integrado",
      "Dashboards personalizáveis",
      "API para integrações",
      "Suporte prioritário",
      "Armazenamento 100GB"
    ],
    cta: "Solicitar Demo",
    popular: true
  },
  {
    name: "Enterprise",
    description: "Solução completa para grandes construtoras e incorporadoras",
    price: "1.297",
    period: "/mês",
    badge: "Completo",
    features: [
      "Todos os recursos Professional",
      "ERP financeiro completo",
      "CRM avançado com funil",
      "BI e analytics avançados",
      "Integrações BIM/CAD",
      "White-label disponível",
      "Treinamento in-company",
      "Suporte 24/7 dedicado",
      "Armazenamento ilimitado",
      "Compliance total LGPD"
    ],
    cta: "Falar com Consultor",
    popular: false
  }
];

export function Pricing() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-primary border-primary/20">
            Planos e Preços
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Escolha o plano ideal
            <span className="block text-primary">para sua empresa</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Oferecemos soluções modulares que crescem junto com sua empresa. 
            Comece pequeno e evolua conforme suas necessidades.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative transition-all duration-300 hover:scale-105 border-border/50 ${
                plan.popular 
                  ? 'ring-2 ring-primary shadow-elegant bg-gradient-feature' 
                  : 'hover:shadow-feature bg-card/80'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground font-semibold px-4 py-1">
                    {plan.badge}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl font-bold text-foreground mb-2">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-muted-foreground mb-6">
                  {plan.description}
                </CardDescription>
                
                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center justify-center">
                    <span className="text-sm text-muted-foreground mr-1">R$</span>
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Teste grátis por 14 dias
                  </p>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button 
                  variant={plan.popular ? "hero" : "outline"}
                  className="w-full text-base font-semibold py-3"
                >
                  {plan.cta}
                  {plan.popular ? (
                    <Zap className="ml-2 h-4 w-4" />
                  ) : (
                    <ArrowRight className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="bg-muted/50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Precisa de algo personalizado?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Para grandes volumes, múltiplas empresas ou necessidades específicas, 
            criamos um plano sob medida para você.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="font-semibold">
              Falar com Especialista
            </Button>
            <Button variant="cta" className="font-semibold">
              Solicitar Orçamento Custom
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground mb-4">
            Pagamento seguro • Cancelamento a qualquer momento • Suporte especializado
          </p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <span className="text-sm font-medium">SSL Seguro</span>
            <span className="text-sm font-medium">LGPD Compliant</span>
            <span className="text-sm font-medium">99.9% Uptime</span>
          </div>
        </div>
      </div>
    </section>
  );
}