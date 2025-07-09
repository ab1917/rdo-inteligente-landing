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
import { DollarSign, AlertTriangle, Users } from 'lucide-react';

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
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <DollarSign className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard Financeiro</h1>
            <p className="text-muted-foreground">Carregando dados financeiros...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-20 bg-muted rounded"></div>
                    <div className="h-4 w-4 bg-muted rounded"></div>
                  </div>
                  <div className="h-6 w-16 bg-muted rounded"></div>
                  <div className="h-2 w-24 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <DollarSign className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard Financeiro</h1>
            <p className="text-muted-foreground">
              Visão consolidada da performance financeira dos projetos
            </p>
          </div>
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