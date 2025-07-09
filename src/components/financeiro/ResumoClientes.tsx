import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ConsolidadoFinanceiro } from '@/types';
import { Users, TrendingUp } from 'lucide-react';

interface ResumoClientesProps {
  consolidado: ConsolidadoFinanceiro;
}

export function ResumoClientes({ consolidado }: ResumoClientesProps) {
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  const clientesOrdenados = consolidado.resumo_por_cliente
    .sort((a, b) => b.valor_total - a.valor_total);

  const getMargemColor = (margem: number) => {
    if (margem >= 15) return 'text-green-600';
    if (margem >= 8) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMargemBadge = (margem: number) => {
    if (margem >= 15) return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Excelente</Badge>;
    if (margem >= 8) return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Regular</Badge>;
    return <Badge variant="destructive">Baixa</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Resumo por Cliente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {clientesOrdenados.map((cliente) => (
            <div 
              key={cliente.cliente_id} 
              className="p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold">{cliente.nome_cliente}</h4>
                {getMargemBadge(cliente.margem_media)}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor Total:</span>
                  <span className="font-medium">{formatCurrency(cliente.valor_total)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contratos Ativos:</span>
                  <span className="font-medium">{cliente.contratos_ativos}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Margem Média:</span>
                  <span className={`font-medium ${getMargemColor(cliente.margem_media)}`}>
                    {formatPercentage(cliente.margem_media)}
                  </span>
                </div>
              </div>

              {/* Barra de representatividade */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Representatividade</span>
                  <span>
                    {((cliente.valor_total / consolidado.valor_total_contratos) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min((cliente.valor_total / consolidado.valor_total_contratos) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}

          {clientesOrdenados.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum cliente encontrado</p>
            </div>
          )}

          {/* Resumo Total */}
          {clientesOrdenados.length > 0 && (
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total de Clientes:</span>
                <span className="text-2xl font-bold text-primary">
                  {clientesOrdenados.length}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-muted-foreground">Valor Médio por Cliente:</span>
                <span className="font-medium">
                  {formatCurrency(consolidado.valor_total_contratos / clientesOrdenados.length)}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}