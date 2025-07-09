import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

export const QuickActions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
        <CardDescription>Acesso direto às principais funcionalidades</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20 flex-col" asChild>
            <Link to="/leads">
              <Users className="h-6 w-6 mb-2" />
              Gerenciar Leads
            </Link>
          </Button>
          <Button variant="outline" className="h-20 flex-col" asChild>
            <Link to="/oportunidades">
              <TrendingUp className="h-6 w-6 mb-2" />
              Pipeline
            </Link>
          </Button>
          <Button variant="outline" className="h-20 flex-col" asChild>
            <Link to="/clientes">
              <Users className="h-6 w-6 mb-2" />
              Base de Clientes
            </Link>
          </Button>
          <Button variant="outline" className="h-20 flex-col" asChild>
            <Link to="/orcamentos">
              <DollarSign className="h-6 w-6 mb-2" />
              Gerar Orçamento
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};