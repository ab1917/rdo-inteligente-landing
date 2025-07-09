import { Users, TrendingUp, DollarSign } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { DashboardIntegrado, ConsolidadoFinanceiro } from "@/types";

interface DashboardMetricsProps {
  dashboard: DashboardIntegrado;
  consolidado: ConsolidadoFinanceiro;
  indicadores: {
    contratos_criticos: number;
  };
}

export const DashboardMetrics = ({ dashboard, consolidado, indicadores }: DashboardMetricsProps) => {
  const metrics = [
    {
      title: "Leads Ativos",
      value: dashboard.leads_ativos.toString(),
      change: `+${dashboard.leads_mes} este mês`,
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Taxa Conversão",
      value: `${dashboard.taxa_conversao_lead_oportunidade.toFixed(1)}%`,
      change: dashboard.taxa_conversao_lead_oportunidade > 60 ? "+Boa" : "Atenção",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Pipeline Total",
      value: `R$ ${(dashboard.valor_pipeline_total / 1000000).toFixed(1)}M`,
      change: `${dashboard.oportunidades_ativas} oportunidades`,
      icon: DollarSign,
      color: "text-primary"
    },
    {
      title: "Margem Atual",
      value: `${consolidado.margem_total_atual.toFixed(1)}%`,
      change: `${indicadores.contratos_criticos > 0 ? 'Atenção' : 'Saudável'}`,
      icon: TrendingUp,
      color: indicadores.contratos_criticos > 0 ? "text-orange-600" : "text-green-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <MetricCard key={metric.title} {...metric} />
      ))}
    </div>
  );
};