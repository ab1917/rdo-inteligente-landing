import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConsolidadoFinanceiro } from '@/types';
import { DollarSign, TrendingUp, Building, Target, Percent, AlertTriangle } from 'lucide-react';

interface ResumoExecutivoProps {
  consolidado: ConsolidadoFinanceiro;
  indicadores: {
    margem_media_geral: number;
    contratos_no_verde: number;
    contratos_atencao: number;
    contratos_criticos: number;
    percentual_faturado: number;
    receita_potencial_restante: number;
    economia_orcamentaria: number;
  };
}

export function ResumoExecutivo({ consolidado, indicadores }: ResumoExecutivoProps) {
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  const metrics = [
    {
      title: "Receita Total",
      value: formatCurrency(consolidado.valor_total_contratos),
      icon: DollarSign,
      description: `${consolidado.total_contratos_ativos} contratos ativos`,
      trend: "positive",
      color: "text-green-600"
    },
    {
      title: "Margem Média",
      value: formatPercentage(indicadores.margem_media_geral),
      icon: TrendingUp,
      description: "Margem consolidada atual",
      trend: indicadores.margem_media_geral > 15 ? "positive" : indicadores.margem_media_geral > 8 ? "neutral" : "negative",
      color: indicadores.margem_media_geral > 15 ? "text-green-600" : indicadores.margem_media_geral > 8 ? "text-yellow-600" : "text-red-600"
    },
    {
      title: "Contratos Saudáveis",
      value: `${indicadores.contratos_no_verde}/${consolidado.total_contratos_ativos}`,
      icon: Building,
      description: "Contratos com margem positiva",
      trend: "positive",
      color: "text-green-600"
    },
    {
      title: "% Faturado",
      value: formatPercentage(indicadores.percentual_faturado),
      icon: Target,
      description: formatCurrency(consolidado.valor_total_faturado),
      trend: "positive",
      color: "text-blue-600"
    },
    {
      title: "Receita Restante",
      value: formatCurrency(indicadores.receita_potencial_restante),
      icon: Percent,
      description: "Valor ainda a faturar",
      trend: "neutral",
      color: "text-purple-600"
    },
    {
      title: "Contratos em Risco",
      value: `${indicadores.contratos_atencao + indicadores.contratos_criticos}`,
      icon: AlertTriangle,
      description: `${indicadores.contratos_criticos} críticos, ${indicadores.contratos_atencao} atenção`,
      trend: indicadores.contratos_criticos > 0 ? "negative" : indicadores.contratos_atencao > 0 ? "neutral" : "positive",
      color: indicadores.contratos_criticos > 0 ? "text-red-600" : indicadores.contratos_atencao > 0 ? "text-yellow-600" : "text-green-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <metric.icon className={`h-4 w-4 ${metric.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${metric.color}`}>
              {metric.value}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metric.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}