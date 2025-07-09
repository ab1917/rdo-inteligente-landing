import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ConsolidadoFinanceiro } from '@/types';
import { Building, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface TabelaContratosProps {
  consolidado: ConsolidadoFinanceiro;
}

export function TabelaContratos({ consolidado }: TabelaContratosProps) {
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'positivo':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'atencao':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critico':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string, desvio: number) => {
    switch (status) {
      case 'positivo':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Saudável</Badge>;
      case 'atencao':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Atenção</Badge>;
      case 'critico':
        return <Badge variant="destructive">Crítico</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const contratos = consolidado.analises_por_contrato
    .sort((a, b) => {
      // Ordenar por status (crítico primeiro) e depois por desvio
      if (a.status_financeiro !== b.status_financeiro) {
        const statusOrder = { 'critico': 0, 'atencao': 1, 'positivo': 2 };
        return statusOrder[a.status_financeiro as keyof typeof statusOrder] - 
               statusOrder[b.status_financeiro as keyof typeof statusOrder];
      }
      return a.desvio_margem - b.desvio_margem;
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Contratos Detalhados ({contratos.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contratos.map((contrato) => (
            <div 
              key={contrato.contrato_id} 
              className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-card"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(contrato.status_financeiro)}
                  <h4 className="font-semibold text-lg">{contrato.nome_projeto}</h4>
                </div>
                {getStatusBadge(contrato.status_financeiro, contrato.desvio_margem)}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Valor do Contrato</p>
                  <p className="font-medium text-lg">{formatCurrency(contrato.valor_contrato)}</p>
                </div>
                
                <div>
                  <p className="text-muted-foreground">Margem Atual</p>
                  <p className={`font-medium text-lg ${
                    contrato.margem_atual > 15 ? 'text-green-600' : 
                    contrato.margem_atual > 8 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {formatPercentage(contrato.margem_atual)}
                  </p>
                </div>
                
                <div>
                  <p className="text-muted-foreground">Desvio da Margem</p>
                  <p className={`font-medium text-lg ${
                    contrato.desvio_margem >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {contrato.desvio_margem >= 0 ? '+' : ''}{formatPercentage(contrato.desvio_margem)}
                  </p>
                </div>
                
                <div>
                  <p className="text-muted-foreground">% Execução</p>
                  <p className="font-medium text-lg">{formatPercentage(contrato.percentual_execucao)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3 pt-3 border-t text-sm">
                <div>
                  <p className="text-muted-foreground">Custo Executado</p>
                  <p className="font-medium">{formatCurrency(contrato.custo_executado)}</p>
                </div>
                
                <div>
                  <p className="text-muted-foreground">Já Faturado</p>
                  <p className="font-medium text-green-600">{formatCurrency(contrato.valor_faturado)}</p>
                </div>
                
                <div>
                  <p className="text-muted-foreground">A Faturar</p>
                  <p className="font-medium text-blue-600">{formatCurrency(contrato.valor_a_faturar)}</p>
                </div>
              </div>

              {/* Barra de progresso da execução */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progresso da Obra</span>
                  <span>{formatPercentage(contrato.percentual_execucao)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(contrato.percentual_execucao, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
          
          {contratos.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum contrato encontrado</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}