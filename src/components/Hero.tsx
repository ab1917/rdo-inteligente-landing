import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/hero-construction.jpg";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Construção civil moderna" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center lg:text-left">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6 border border-white/20">
            <span className="w-2 h-2 bg-accent rounded-full mr-2 animate-pulse"></span>
            Revolucione sua gestão de obras
          </div>
          
          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="block">RDO</span>
            <span className="block text-accent">Inteligente</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl leading-relaxed">
            Automatize seus Relatórios Diários de Obra com <strong>Inteligência Artificial</strong> e 
            transforme a gestão do seu canteiro em uma operação de alta performance.
          </p>
          
          {/* Benefits List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-white/90">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>RDO 100% automatizado</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Gestão de cronogramas inteligente</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>CRM e ERP integrados</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Economia de até 80% do tempo</span>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4">
              Solicitar Demo Gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10">
              <Play className="mr-2 h-5 w-5" />
              Ver Demonstração
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-12 text-white/70 text-sm">
            <p>Mais de <strong className="text-white">500+ obras</strong> já confiam no RDO Inteligente</p>
          </div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 right-10 w-20 h-20 bg-accent/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-primary-glow/20 rounded-full blur-xl animate-pulse delay-1000"></div>
    </section>
  );
}