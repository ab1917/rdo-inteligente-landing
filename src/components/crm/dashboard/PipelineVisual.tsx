import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardIntegrado, OportunidadeExpandida, ContratoIntegrado, ConsolidadoFinanceiro } from "@/types";

interface PipelineVisualProps {
  dashboard: DashboardIntegrado;
  oportunidades: OportunidadeExpandida[];
  contratos: ContratoIntegrado[];
  consolidado: ConsolidadoFinanceiro;
}

export const PipelineVisual = ({ dashboard, oportunidades, contratos, consolidado }: PipelineVisualProps) => {
  const pipelineData = [
    { 
      etapa: "Leads", 
      count: dashboard.leads_ativos, 
      valor: `R$ ${(dashboard.valor_pipeline_total * 0.2 / 1000).toFixed(0)}K`, 
      color: "bg-gray-500" 
    },
    { 
      etapa: "Qualificados", 
      count: oportunidades.filter(o => o.status === 'negociacao').length, 
      valor: `R$ ${(oportunidades.filter(o => o.status === 'negociacao').reduce((sum, o) => sum + o.valor_estimado, 0) / 1000).toFixed(0)}K`, 
      color: "bg-blue-500" 
    },
    { 
      etapa: "Proposta", 
      count: oportunidades.filter(o => o.status === 'proposta_enviada').length, 
      valor: `R$ ${(oportunidades.filter(o => o.status === 'proposta_enviada').reduce((sum, o) => sum + o.valor_estimado, 0) / 1000).toFixed(0)}K`, 
      color: "bg-yellow-500" 
    },
    { 
      etapa: "Negociação", 
      count: oportunidades.filter(o => o.status === 'negociacao').length, 
      valor: `R$ ${(oportunidades.filter(o => o.status === 'negociacao').reduce((sum, o) => sum + o.valor_estimado, 0) / 1000).toFixed(0)}K`, 
      color: "bg-orange-500" 
    },
    { 
      etapa: "Aprovados", 
      count: contratos.filter(c => c.status === 'ativo').length, 
      valor: `R$ ${(consolidado.valor_total_contratos / 1000000).toFixed(1)}M`, 
      color: "bg-green-500" 
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pipeline de Vendas</CardTitle>
        <CardDescription>Oportunidades por etapa</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pipelineData.map((item) => (
            <div key={item.etapa} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="font-medium">{item.etapa}</span>
                <Badge variant="outline">{item.count}</Badge>
              </div>
              <span className="text-sm font-medium">{item.valor}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};