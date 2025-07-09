import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Building, Menu, X, ArrowRight } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: "Funcionalidades", href: "#features" },
    { name: "Benefícios", href: "#benefits" },
    { name: "Depoimentos", href: "#testimonials" },
    { name: "Preços", href: "#pricing" },
    { name: "Contato", href: "#contact" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Building className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">RDO Inteligente</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="font-medium">
              Entrar
            </Button>
            <Button variant="default" className="font-semibold">
              Demo Gratuita
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-background border-t border-border/50">
            <nav className="py-4 space-y-4">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="px-4 pt-4 space-y-3">
                <Button variant="ghost" className="w-full font-medium">
                  Entrar
                </Button>
                <Button variant="default" className="w-full font-semibold">
                  Demo Gratuita
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}