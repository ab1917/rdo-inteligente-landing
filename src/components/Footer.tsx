import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Building, Mail, Phone, MapPin, Shield, FileText, Users, HelpCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Building className="h-8 w-8 text-accent" />
              <span className="text-2xl font-bold">RDO Inteligente</span>
            </div>
            <p className="text-white/70 leading-relaxed">
              A plataforma de gestão de obras mais avançada do Brasil. 
              Automatize, otimize e revolucione sua construção civil.
            </p>
            <div className="space-y-2">
              <Badge variant="outline" className="border-accent/30 text-accent bg-accent/10">
                LGPD Compliant
              </Badge>
              <Badge variant="outline" className="border-success/30 text-success bg-success/10 ml-2">
                ISO 27001
              </Badge>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Produto</h3>
            <ul className="space-y-3 text-white/70">
              <li><a href="#" className="hover:text-white transition-colors">Funcionalidades</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrações</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Segurança</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Soluções</h3>
            <ul className="space-y-3 text-white/70">
              <li><a href="#" className="hover:text-white transition-colors">Pequenas Construtoras</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Médias Empresas</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Grandes Incorporadoras</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Engenheiros Autônomos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Casos de Uso</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Suporte</h3>
            <ul className="space-y-3 text-white/70">
              <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Treinamentos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Status do Sistema</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>
        </div>

        <Separator className="bg-white/20 mb-8" />

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-accent" />
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-white/70">contato@rdointeligente.com.br</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-accent" />
            <div>
              <p className="font-semibold">Telefone</p>
              <p className="text-white/70">(11) 99999-9999</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-accent" />
            <div>
              <p className="font-semibold">Endereço</p>
              <p className="text-white/70">São Paulo, SP - Brasil</p>
            </div>
          </div>
        </div>

        <Separator className="bg-white/20 mb-8" />

        {/* Legal & LGPD */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="font-semibold mb-3 flex items-center">
              <Shield className="h-4 w-4 mr-2 text-accent" />
              Privacidade e Proteção de Dados
            </h4>
            <p className="text-white/70 text-sm leading-relaxed mb-3">
              Estamos comprometidos com a proteção dos seus dados pessoais e empresariais. 
              Seguimos rigorosamente as diretrizes da LGPD (Lei Geral de Proteção de Dados).
            </p>
            <div className="flex flex-wrap gap-2">
              <a href="#" className="text-accent hover:text-accent/80 text-sm underline">
                Política de Privacidade
              </a>
              <span className="text-white/50">•</span>
              <a href="#" className="text-accent hover:text-accent/80 text-sm underline">
                Termos de Uso
              </a>
              <span className="text-white/50">•</span>
              <a href="#" className="text-accent hover:text-accent/80 text-sm underline">
                DPO
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 flex items-center">
              <FileText className="h-4 w-4 mr-2 text-accent" />
              Informações Legais
            </h4>
            <div className="text-white/70 text-sm space-y-1">
              <p><strong>RDO Inteligente Ltda.</strong></p>
              <p>CNPJ: 00.000.000/0001-00</p>
              <p>Inscrição Municipal: 000.000-0</p>
              <p>Certificação ISO 27001:2013</p>
            </div>
          </div>
        </div>

        <Separator className="bg-white/20 mb-6" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 text-sm mb-4 md:mb-0">
            © 2025 RDO Inteligente. Todos os direitos reservados.
          </p>
          
          <div className="flex items-center space-x-6 text-sm text-white/70">
            <span>Versão 2.1.0</span>
            <span>•</span>
            <span>99.9% Uptime</span>
            <span>•</span>
            <span className="text-success">Sistema Operacional</span>
          </div>
        </div>
      </div>
    </footer>
  );
}