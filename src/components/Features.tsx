import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Clock, 
  Truck, 
  AlertTriangle, 
  Calendar, 
  Brain, 
  Smartphone, 
  Shield, 
  BarChart3,
  Users,
  CreditCard,
  Building
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "RDO Automático",
    description: "Preenchimento inteligente com tarefas, clima, riscos e fotos automaticamente capturadas.",
    badge: "IA Powered"
  },
  {
    icon: Clock,
    title: "Gestão de Mão de Obra",
    description: "Registro automático de horas-homens e controle de produtividade em tempo real.",
    badge: "Tempo Real"
  },
  {
    icon: Truck,
    title: "Controle de Equipamentos",
    description: "Monitoramento de máquinas e equipamentos com alertas de manutenção preventiva.",
    badge: "IoT Ready"
  },
  {
    icon: AlertTriangle,
    title: "Gestão de Ocorrências",
    description: "Registro e acompanhamento de paralisações, acidentes e não conformidades.",
    badge: "Compliance"
  },
  {
    icon: Calendar,
    title: "Cronograma Inteligente",
    description: "Gantt integrado com previsões de prazo usando machine learning e EAP.",
    badge: "ML Powered"
  },
  {
    icon: Brain,
    title: "Orçamentos com IA",
    description: "Sugestões automáticas baseadas em histórico e comparativo de preços online.",
    badge: "Smart AI"
  },
  {
    icon: Users,
    title: "CRM Especializado",
    description: "Prospecção de clientes e funil de vendas específico para construção civil.",
    badge: "CRM"
  },
  {
    icon: CreditCard,
    title: "ERP Financeiro",
    description: "Gestão completa de financeiro, compras, estoque e documentos integrados.",
    badge: "ERP"
  },
  {
    icon: Smartphone,
    title: "App Mobile Completo",
    description: "Aplicativo para obras com upload de fotos, validação digital e push notifications.",
    badge: "Mobile First"
  },
  {
    icon: BarChart3,
    title: "BI e Dashboards",
    description: "Dashboards personalizáveis com métricas de performance e relatórios avançados.",
    badge: "Analytics"
  },
  {
    icon: Building,
    title: "Integrações BIM/CAD",
    description: "Conectividade com sistemas BIM, CAD e principais ERPs do mercado (Odoo).",
    badge: "Integração"
  },
  {
    icon: Shield,
    title: "Segurança Total",
    description: "Assinatura digital, conformidade LGPD, login federado e trilha de auditoria.",
    badge: "Security"
  }
];

export function Features() {
  return (
    <section className="py-20 bg-gradient-feature">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-primary border-primary/20">
            Funcionalidades Completas
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Tudo que sua obra precisa
            <span className="block text-primary">em uma só plataforma</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Desde o RDO automatizado até o ERP completo, nossa solução modular cresce junto com sua empresa, 
            oferecendo todas as ferramentas para uma gestão de obras de excelência.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-feature border-border/50 transition-all duration-300 hover:scale-105 bg-card/50 backdrop-blur-sm"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs font-medium">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-muted-foreground mb-6">
            Quer ver todas as funcionalidades em ação?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all hover:shadow-elegant">
              Agendar Demonstração
            </button>
            <button className="px-8 py-3 border border-border text-foreground rounded-lg font-semibold hover:bg-muted transition-all">
              Baixar Catálogo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}