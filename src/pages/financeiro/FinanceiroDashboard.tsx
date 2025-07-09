import { ResumoExecutivo } from '@/components/financeiro/ResumoExecutivo';
import { GraficoMargem } from '@/components/financeiro/GraficoMargem';
import { TabelaContratos } from '@/components/financeiro/TabelaContratos';
import { AnaliseRiscos } from '@/components/financeiro/AnaliseRiscos';
import { FluxoCaixa } from '@/components/financeiro/FluxoCaixa';
import { ResumoClientes } from '@/components/financeiro/ResumoClientes';
import { FiltrosFinanceiro } from '@/components/financeiro/FiltrosFinanceiro';
import { useFinanceiroIntegrado } from '@/hooks/useFinanceiroIntegrado';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, AlertTriangle, Users } from 'lucide-react';

export function FinanceiroDashboard() {
  const { consolidado, loading, getIndicadoresGlobais } = useFinanceiroIntegrado();
  const [filtros, setFiltros] = useState({
    periodo: 'todos',
    cliente: 'todos',
    status: 'todos'
  });

  const indicadores = getIndicadoresGlobais();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Dashboard Financeiro</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Dashboard Financeiro</h1>
        </div>
        <FiltrosFinanceiro filtros={filtros} onFiltrosChange={setFiltros} />
      </div>

      {/* Resumo Executivo */}
      <ResumoExecutivo consolidado={consolidado} indicadores={indicadores} />

      {/* Análise de Riscos - Destacado */}
      <AnaliseRiscos consolidado={consolidado} />

      {/* Gráficos e Análises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GraficoMargem consolidado={consolidado} />
        <FluxoCaixa consolidado={consolidado} />
      </div>

      {/* Detalhamentos */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TabelaContratos consolidado={consolidado} />
        </div>
        <div>
          <ResumoClientes consolidado={consolidado} />
        </div>
      </div>
    </div>
  );
}