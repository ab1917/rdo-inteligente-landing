import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Carlos Silva",
    role: "Engenheiro Civil",
    company: "Silva Construções",
    content: "O RDO Inteligente revolucionou nossa gestão. Antes gastávamos 3 horas por dia com relatórios, agora são apenas 20 minutos. A IA realmente funciona!",
    rating: 5,
    projectSize: "15 obras ativas"
  },
  {
    name: "Maria Fernanda",
    role: "Gestora de Projetos",
    company: "MF Incorporadora",
    content: "A integração com nossos sistemas existentes foi perfeita. O controle de cronograma com previsões de IA nos ajudou a entregar 2 projetos antes do prazo.",
    rating: 5,
    projectSize: "R$ 50M em obras"
  },
  {
    name: "Roberto Santos",
    role: "Diretor Técnico",
    company: "Santos & Associados",
    content: "Impressionante como o sistema aprende com nossos dados. As sugestões de orçamento estão cada vez mais precisas, economizamos 30% em compras.",
    rating: 5,
    projectSize: "8 anos no mercado"
  },
  {
    name: "Ana Carolina",
    role: "Coordenadora de Obras",
    company: "AC Construtora",
    content: "O app mobile é fantástico! Nossos mestres de obra adoraram a facilidade de uso. Os relatórios ficam prontos automaticamente com fotos e tudo.",
    rating: 5,
    projectSize: "25 colaboradores"
  },
  {
    name: "José Oliveira",
    role: "Gerente Operacional",
    company: "Oliveira Engenharia",
    content: "O módulo de segurança e compliance nos salvou de várias autuações. A trilha de auditoria é perfeita para atender às exigências dos órgãos.",
    rating: 5,
    projectSize: "Compliance 100%"
  },
  {
    name: "Patricia Lima",
    role: "CEO",
    company: "Lima Construções",
    content: "ROI em 3 meses! O sistema se pagou rapidamente com a redução de retrabalho e melhor controle de custos. Recomendo sem hesitar.",
    rating: 5,
    projectSize: "ROI 350%"
  }
];

export function Testimonials() {
  return (
    <section className="py-20 bg-primary/5">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-primary border-primary/20">
            Depoimentos de Clientes
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            O que nossos clientes
            <span className="block text-primary">estão dizendo</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Mais de 500 empresas já transformaram sua gestão de obras com o RDO Inteligente. 
            Veja alguns depoimentos reais de quem já está colhendo os resultados.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="group hover:shadow-elegant transition-all duration-300 hover:scale-105 border-border/50 bg-card/80 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="flex items-start justify-between mb-4">
                  <Quote className="h-8 w-8 text-primary/30 flex-shrink-0" />
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                </div>
                
                {/* Content */}
                <p className="text-muted-foreground mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                
                {/* Author Info */}
                <div className="border-t border-border/50 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <p className="text-sm text-primary font-medium">{testimonial.company}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-xs">
                        {testimonial.projectSize}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <p className="text-sm text-muted-foreground">Obras Ativas</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success mb-2">98%</div>
              <p className="text-sm text-muted-foreground">Satisfação</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">24/7</div>
              <p className="text-sm text-muted-foreground">Suporte</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">3 anos</div>
              <p className="text-sm text-muted-foreground">No Mercado</p>
            </div>
          </div>
          
          <p className="text-muted-foreground mb-6">
            Junte-se aos líderes do setor que já escolheram o RDO Inteligente
          </p>
          
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all hover:shadow-elegant">
            Quero Fazer Parte Deste Grupo
          </button>
        </div>
      </div>
    </section>
  );
}