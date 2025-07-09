import { useCRMIntegration } from "@/hooks/useCRMIntegration";
import { useFinanceiroIntegrado } from "@/hooks/useFinanceiroIntegrado";
import CreateLeadDialog from "@/components/crm/CreateLeadDialog";
import CreateOportunidadeDialog from "@/components/crm/CreateOportunidadeDialog";
import PipelineBoard from "@/components/crm/PipelineBoard";
import { DashboardMetrics } from "@/components/crm/dashboard/DashboardMetrics";
import { PipelineVisual } from "@/components/crm/dashboard/PipelineVisual";
import { RecentOpportunities } from "@/components/crm/dashboard/RecentOpportunities";
import { FinancialIndicators } from "@/components/crm/dashboard/FinancialIndicators";
import { QuickActions } from "@/components/crm/dashboard/QuickActions";

const CRMDashboard = () => {
  const { dashboard, oportunidades, contratos, loading } = useCRMIntegration();
  const { consolidado, getIndicadoresGlobais } = useFinanceiroIntegrado();

  if (loading) {
    return <div className="flex items-center justify-center h-96">Carregando dados integrados...</div>;
  }

  const indicadores = getIndicadoresGlobais();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">CRM Dashboard</h1>
          <p className="text-muted-foreground">
            Gestão comercial e relacionamento com clientes
          </p>
        </div>
        <div className="flex gap-2">
          <CreateLeadDialog />
          <CreateOportunidadeDialog />
        </div>
      </div>

      {/* Métricas */}
      <DashboardMetrics 
        dashboard={dashboard} 
        consolidado={consolidado} 
        indicadores={indicadores} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Visual */}
        <PipelineVisual 
          dashboard={dashboard}
          oportunidades={oportunidades}
          contratos={contratos}
          consolidado={consolidado}
        />

        {/* Oportunidades Recentes */}
        <RecentOpportunities oportunidades={oportunidades} />
      </div>

      {/* Indicadores Financeiros */}
      <FinancialIndicators 
        dashboard={dashboard}
        consolidado={consolidado}
        indicadores={indicadores}
      />

      {/* Pipeline Visual Completo */}
      <PipelineBoard />
      
      {/* Ações Rápidas */}
      <QuickActions />
    </div>
  );
};

export default CRMDashboard;