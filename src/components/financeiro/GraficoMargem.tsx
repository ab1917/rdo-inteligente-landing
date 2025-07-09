import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConsolidadoFinanceiro } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface GraficoMargemProps {
  consolidado: ConsolidadoFinanceiro;
}

export function GraficoMargem({ consolidado }: GraficoMargemProps) {
  const data = consolidado.analises_por_contrato.map(contrato => ({
    projeto: contrato.nome_projeto.length > 15 
      ? contrato.nome_projeto.substring(0, 15) + '...' 
      : contrato.nome_projeto,
    projetoCompleto: contrato.nome_projeto,
    margemPrevista: contrato.margem_prevista,
    margemAtual: contrato.margem_atual,
    desvio: contrato.desvio_margem,
    status: contrato.status_financeiro,
    valor: contrato.valor_contrato
  })).sort((a, b) => b.valor - a.valor);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.projetoCompleto}</p>
          <p className="text-sm text-gray-600 mb-2">{formatCurrency(data.valor)}</p>
          <p className="text-blue-600">
            Prevista: {data.margemPrevista.toFixed(1)}%
          </p>
          <p className="text-green-600">
            Atual: {data.margemAtual.toFixed(1)}%
          </p>
          <p className={`${data.desvio >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            Desvio: {data.desvio >= 0 ? '+' : ''}{data.desvio.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Análise de Margem por Contrato
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="projeto" 
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis 
              label={{ value: 'Margem (%)', angle: -90, position: 'insideLeft' }}
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="2 2" />
            <ReferenceLine y={15} stroke="#22c55e" strokeDasharray="2 2" opacity={0.5} />
            <Bar 
              dataKey="margemPrevista" 
              fill="hsl(var(--primary))" 
              opacity={0.7}
              name="Margem Prevista"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="margemAtual" 
              fill="hsl(var(--chart-2))"
              name="Margem Atual"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded"></div>
            <span>Margem Prevista</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-chart-2 rounded"></div>
            <span>Margem Atual</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}