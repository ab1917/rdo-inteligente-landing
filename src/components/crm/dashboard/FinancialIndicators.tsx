import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, DollarSign, TrendingUp } from "lucide-react";
import { DashboardIntegrado, ConsolidadoFinanceiro } from "@/types";

interface FinancialIndicatorsProps {
  dashboard: DashboardIntegrado;
  consolidado: ConsolidadoFinanceiro;
  indicadores: {
    contratos_no_verde: number;
    contratos_atencao: number;
    contratos_criticos: number;
    percentual_faturado: number;
  };
}

export const FinancialIndicators = ({ dashboard, consolidado, indicadores }: FinancialIndicatorsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Situação Financeira
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Contratos Saudáveis</span>
              <Badge variant="outline" className="text-green-600">
                {indicadores.contratos_no_verde}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Requer Atenção</span>
              <Badge variant="outline" className="text-yellow-600">
                {indicadores.contratos_atencao}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Críticos</span>
              <Badge variant="outline" className="text-red-600">
                {indicadores.contratos_criticos}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Faturamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Já Faturado</p>
              <p className="text-2xl font-bold">R$ {(consolidado.valor_total_faturado / 1000000).toFixed(1)}M</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">A Faturar</p>
              <p className="text-xl font-semibold text-green-600">R$ {(consolidado.valor_total_a_faturar / 1000000).toFixed(1)}M</p>
            </div>
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">% Faturado</p>
              <p className="text-lg font-medium">{indicadores.percentual_faturado.toFixed(1)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Margem Média</p>
              <p className="text-2xl font-bold">{consolidado.margem_total_atual.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ticket Médio</p>
              <p className="text-xl font-semibold">R$ {(dashboard.ticket_medio_contrato / 1000000).toFixed(1)}M</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ciclo Comercial</p>
              <p className="text-lg font-medium">{dashboard.tempo_medio_ciclo_comercial} dias</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};