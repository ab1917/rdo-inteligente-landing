import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ConsolidadoFinanceiro } from '@/types';
import { AlertTriangle, TrendingDown, Eye } from 'lucide-react';

interface AnaliseRiscosProps {
  consolidado: ConsolidadoFinanceiro;
}

export function AnaliseRiscos({ consolidado }: AnaliseRiscosProps) {
  const contratosCriticos = consolidado.analises_por_contrato
    .filter(a => a.status_financeiro === 'critico')
    .sort((a, b) => a.desvio_margem - b.desvio_margem);

  const contratosAtencao = consolidado.analises_por_contrato
    .filter(a => a.status_financeiro === 'atencao')
    .sort((a, b) => a.desvio_margem - b.desvio_margem);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  if (contratosCriticos.length === 0 && contratosAtencao.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <CardTitle className="text-green-700 flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Análise de Riscos - Situação Controlada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-600">
            Todos os contratos estão com margens saudáveis. Continue monitorando o desempenho.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Contratos Críticos */}
      {contratosCriticos.length > 0 && (
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Contratos Críticos ({contratosCriticos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contratosCriticos.slice(0, 3).map((contrato) => (
                <div key={contrato.contrato_id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-100">
                  <div>
                    <h4 className="font-medium text-gray-900">{contrato.nome_projeto}</h4>
                    <p className="text-sm text-gray-600">
                      Margem atual: {formatPercentage(contrato.margem_atual)} 
                      (prevista: {formatPercentage(contrato.margem_prevista)})
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive" className="mb-1">
                      {formatPercentage(contrato.desvio_margem)}
                    </Badge>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(contrato.valor_contrato)}
                    </p>
                  </div>
                </div>
              ))}
              {contratosCriticos.length > 3 && (
                <p className="text-sm text-red-600 text-center">
                  +{contratosCriticos.length - 3} outros contratos críticos
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contratos em Atenção */}
      {contratosAtencao.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader>
            <CardTitle className="text-yellow-700 flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Contratos em Atenção ({contratosAtencao.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contratosAtencao.slice(0, 2).map((contrato) => (
                <div key={contrato.contrato_id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-100">
                  <div>
                    <h4 className="font-medium text-gray-900">{contrato.nome_projeto}</h4>
                    <p className="text-sm text-gray-600">
                      Margem atual: {formatPercentage(contrato.margem_atual)} 
                      (prevista: {formatPercentage(contrato.margem_prevista)})
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="mb-1 bg-yellow-100 text-yellow-800">
                      {formatPercentage(contrato.desvio_margem)}
                    </Badge>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(contrato.valor_contrato)}
                    </p>
                  </div>
                </div>
              ))}
              {contratosAtencao.length > 2 && (
                <p className="text-sm text-yellow-600 text-center">
                  +{contratosAtencao.length - 2} outros contratos em atenção
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}