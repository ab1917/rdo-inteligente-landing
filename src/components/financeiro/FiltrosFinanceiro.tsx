import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Filter } from 'lucide-react';

interface FiltrosFinanceiroProps {
  filtros: {
    periodo: string;
    cliente: string;
    status: string;
  };
  onFiltrosChange: (filtros: any) => void;
}

export function FiltrosFinanceiro({ filtros, onFiltrosChange }: FiltrosFinanceiroProps) {
  const updateFiltro = (key: string, value: string) => {
    onFiltrosChange({
      ...filtros,
      [key]: value
    });
  };

  return (
    <Card className="w-auto">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filtros:</span>
          </div>

          <Select
            value={filtros.periodo}
            onValueChange={(value) => updateFiltro('periodo', value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="mes">Este Mês</SelectItem>
              <SelectItem value="trimestre">Trimestre</SelectItem>
              <SelectItem value="ano">Este Ano</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filtros.status}
            onValueChange={(value) => updateFiltro('status', value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="positivo">Saudáveis</SelectItem>
              <SelectItem value="atencao">Atenção</SelectItem>
              <SelectItem value="critico">Críticos</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filtros.cliente}
            onValueChange={(value) => updateFiltro('cliente', value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos Clientes</SelectItem>
              {/* Aqui seria ideal buscar a lista de clientes dinamicamente */}
              <SelectItem value="cliente1">Cliente A</SelectItem>
              <SelectItem value="cliente2">Cliente B</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}