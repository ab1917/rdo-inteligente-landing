import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { OportunidadeExpandida } from "@/types";

interface RecentOpportunitiesProps {
  oportunidades: OportunidadeExpandida[];
}

export const RecentOpportunities = ({ oportunidades }: RecentOpportunitiesProps) => {
  const recentOpportunities = oportunidades
    .sort((a, b) => new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Oportunidades Recentes</CardTitle>
          <CardDescription>Últimas atualizações</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/oportunidades">Ver todas</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOpportunities.map((opp) => (
            <div key={opp.id} className="flex items-center justify-between border-b pb-2 last:border-b-0">
              <div>
                <p className="font-medium">{opp.empresa_cliente}</p>
                <p className="text-sm text-muted-foreground">{opp.responsavel_comercial}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">R$ {(opp.valor_estimado / 1000).toFixed(0)}K</p>
                <Badge variant="outline" className="text-xs">
                  {opp.status === 'proposta_enviada' ? 'Proposta' : 
                   opp.status === 'negociacao' ? 'Negociação' :
                   opp.status === 'aprovada' ? 'Aprovada' : opp.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};