import { Badge } from "@/components/ui/badge";
import { CheckCircle, TrendingUp, Clock, DollarSign, Target, Users } from "lucide-react";

const benefits = [
  {
    icon: Clock,
    metric: "80%",
    title: "Redução de Tempo",
    description: "Menos tempo gasto em relatórios e mais foco na execução da obra.",
    color: "text-primary"
  },
  {
    icon: DollarSign,
    metric: "35%",
    title: "Economia de Custos",
    description: "Redução de desperdícios e melhor controle orçamentário.",
    color: "text-success"
  },
  {
    icon: TrendingUp,
    metric: "95%",
    title: "Maior Produtividade",
    description: "Equipes mais eficientes com processos automatizados.",
    color: "text-accent"
  },
  {
    icon: Target,
    metric: "40%",
    title: "Precisão nos Prazos",
    description: "Cronogramas mais assertivos com previsões de IA.",
    color: "text-primary"
  },
  {
    icon: Users,
    metric: "100%",
    title: "Controle da Equipe",
    description: "Visibilidade completa sobre produtividade e presença.",
    color: "text-success"
  },
  {
    icon: CheckCircle,
    metric: "99%",
    title: "Conformidade",
    description: "Atendimento total aos requisitos regulamentares.",
    color: "text-accent"
  }
];

export function Benefits() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-success border-success/20">
            Resultados Comprovados
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Resultados que fazem
            <span className="block text-primary">a diferença real</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Empresas que implementaram o RDO Inteligente obtiveram melhorias significativas 
            em eficiência, controle de custos e qualidade de gestão.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="text-center group hover:scale-105 transition-all duration-300"
            >
              <div className="bg-card rounded-2xl p-8 shadow-feature hover:shadow-elegant border border-border/50">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6 group-hover:bg-primary/20 transition-colors">
                  <benefit.icon className={`h-8 w-8 ${benefit.color}`} />
                </div>
                
                {/* Metric */}
                <div className={`text-4xl font-bold ${benefit.color} mb-2`}>
                  {benefit.metric}
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {benefit.title}
                </h3>
                
                {/* Description */}
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Case Study Section */}
        <div className="bg-card rounded-2xl p-8 md:p-12 shadow-feature border border-border/50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <Badge variant="outline" className="mb-4 text-primary border-primary/20">
                Caso de Sucesso
              </Badge>
              <h3 className="text-3xl font-bold text-foreground mb-4">
                Construtora XYZ reduziu 
                <span className="text-primary"> 45% dos custos</span> administrativos
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "Implementamos o RDO Inteligente em 12 obras simultâneas. O resultado foi uma 
                transformação completa na nossa gestão. Os relatórios que levavam 2 horas para 
                fazer, agora ficam prontos em 15 minutos."
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">JR</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">João Ribeiro</p>
                  <p className="text-sm text-muted-foreground">Gerente de Obras, Construtora XYZ</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">12</div>
                <p className="text-sm text-muted-foreground">Obras Ativas</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-success mb-2">45%</div>
                <p className="text-sm text-muted-foreground">Redução Custos</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">85%</div>
                <p className="text-sm text-muted-foreground">Menos Tempo</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <p className="text-sm text-muted-foreground">Conformidade</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}