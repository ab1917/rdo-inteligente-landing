import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConsolidadoFinanceiro } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { DollarSign } from 'lucide-react';

interface FluxoCaixaProps {
  consolidado: ConsolidadoFinanceiro;
}

export function FluxoCaixa({ consolidado }: FluxoCaixaProps) {
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);

  const data = [
    {
      name: 'Já Faturado',
      value: consolidado.valor_total_faturado,
      color: 'hsl(var(--chart-1))',
      percentage: (consolidado.valor_total_faturado / consolidado.valor_total_contratos) * 100
    },
    {
      name: 'A Faturar',
      value: consolidado.valor_total_a_faturar,
      color: 'hsl(var(--chart-2))',
      percentage: (consolidado.valor_total_a_faturar / consolidado.valor_total_contratos) * 100
    }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-lg font-bold text-primary">
            {formatCurrency(data.value)}
          </p>
          <p className="text-sm text-gray-600">
            {data.percentage.toFixed(1)}% do total
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={14}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Fluxo de Caixa
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Resumo */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-600 font-medium">Faturado</p>
              <p className="text-2xl font-bold text-green-700">
                {formatCurrency(consolidado.valor_total_faturado)}
              </p>
              <p className="text-xs text-green-600">
                {((consolidado.valor_total_faturado / consolidado.valor_total_contratos) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600 font-medium">A Faturar</p>
              <p className="text-2xl font-bold text-blue-700">
                {formatCurrency(consolidado.valor_total_a_faturar)}
              </p>
              <p className="text-xs text-blue-600">
                {((consolidado.valor_total_a_faturar / consolidado.valor_total_contratos) * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Gráfico */}
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Legenda */}
          <div className="flex justify-center gap-6">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm">{item.name}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">Valor Total dos Contratos</p>
            <p className="text-3xl font-bold text-primary">
              {formatCurrency(consolidado.valor_total_contratos)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}