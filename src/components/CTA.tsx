import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Phone, FileText } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20 bg-gradient-hero relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-accent/20 rounded-full blur-xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <Badge variant="outline" className="mb-6 border-white/30 text-white bg-white/10 backdrop-blur-sm">
            Oferta Limitada - Janeiro 2025
          </Badge>
          
          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Transforme sua gestão de obras
            <span className="block text-accent">em 2025</span>
          </h2>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Não deixe sua concorrência sair na frente. Implemente o RDO Inteligente agora 
            e lidere a transformação digital na construção civil.
          </p>
          
          {/* Benefits List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-white/90">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <span className="font-semibold">Implementação em 48h</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <span className="font-semibold">Treinamento incluído</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <span className="font-semibold">Suporte 24/7 no primeiro mês</span>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              variant="hero" 
              size="lg" 
              className="text-lg px-8 py-4 bg-white text-primary hover:bg-white/90 shadow-glow"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Agendar Demo Gratuita
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10"
            >
              <Phone className="mr-2 h-5 w-5" />
              (11) 99999-9999
            </Button>
          </div>
          
          {/* Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Calendar className="h-8 w-8 text-accent mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-white mb-2">Demo Personalizada</h3>
              <p className="text-white/80 text-sm mb-4">
                Demonstração completa adaptada às suas necessidades
              </p>
              <Button variant="outline" size="sm" className="w-full border-white/30 text-white hover:bg-white/10">
                Agendar Agora
              </Button>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <FileText className="h-8 w-8 text-accent mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-white mb-2">Teste Grátis</h3>
              <p className="text-white/80 text-sm mb-4">
                14 dias de acesso completo sem compromisso
              </p>
              <Button variant="outline" size="sm" className="w-full border-white/30 text-white hover:bg-white/10">
                Começar Teste
              </Button>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Phone className="h-8 w-8 text-accent mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-white mb-2">Consultoria</h3>
              <p className="text-white/80 text-sm mb-4">
                Conversa com especialista para plano personalizado
              </p>
              <Button variant="outline" size="sm" className="w-full border-white/30 text-white hover:bg-white/10">
                Falar Agora
              </Button>
            </div>
          </div>
          
          {/* Urgency */}
          <div className="mt-12 text-center">
            <p className="text-white/70 text-sm">
              ⚡ Últimas vagas para implementação em Janeiro • 
              <span className="text-accent font-semibold"> 50% de desconto</span> no primeiro trimestre
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}