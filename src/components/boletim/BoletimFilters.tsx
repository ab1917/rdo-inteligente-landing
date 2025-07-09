import React, { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BoletimMedicao } from '@/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface BoletimFiltersProps {
  boletins: BoletimMedicao[];
  onFilter: (filtered: BoletimMedicao[]) => void;
}

export const BoletimFilters: React.FC<BoletimFiltersProps> = ({ boletins, onFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    dataInicio: '',
    dataFim: '',
    valorMinimo: '',
    valorMaximo: ''
  });

  useEffect(() => {
    applyFilters();
  }, [filters, boletins]);

  const applyFilters = () => {
    let filtered = [...boletins];

    if (filters.status) {
      filtered = filtered.filter(b => b.status === filters.status);
    }

    if (filters.dataInicio) {
      filtered = filtered.filter(b => new Date(b.data) >= new Date(filters.dataInicio));
    }

    if (filters.dataFim) {
      filtered = filtered.filter(b => new Date(b.data) <= new Date(filters.dataFim));
    }

    if (filters.valorMinimo) {
      const minimo = parseFloat(filters.valorMinimo);
      filtered = filtered.filter(b => (b.resumo_financeiro?.total_geral || 0) >= minimo);
    }

    if (filters.valorMaximo) {
      const maximo = parseFloat(filters.valorMaximo);
      filtered = filtered.filter(b => (b.resumo_financeiro?.total_geral || 0) <= maximo);
    }

    onFilter(filtered);
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      dataInicio: '',
      dataFim: '',
      valorMinimo: '',
      valorMaximo: ''
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <Card className="mt-4">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Filtros Avançados</CardTitle>
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
                  <X className="h-4 w-4" />
                  Limpar
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={filters.status} 
                  onValueChange={(value) => setFilters(prev => ({...prev, status: value}))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="rascunho">Rascunho</SelectItem>
                    <SelectItem value="aprovado">Aprovado</SelectItem>
                    <SelectItem value="faturado">Faturado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataInicio">Data Início</Label>
                <Input
                  type="date"
                  value={filters.dataInicio}
                  onChange={(e) => setFilters(prev => ({...prev, dataInicio: e.target.value}))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataFim">Data Fim</Label>
                <Input
                  type="date"
                  value={filters.dataFim}
                  onChange={(e) => setFilters(prev => ({...prev, dataFim: e.target.value}))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valorMinimo">Valor Mínimo (R$)</Label>
                <Input
                  type="number"
                  placeholder="0,00"
                  value={filters.valorMinimo}
                  onChange={(e) => setFilters(prev => ({...prev, valorMinimo: e.target.value}))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valorMaximo">Valor Máximo (R$)</Label>
                <Input
                  type="number"
                  placeholder="0,00"
                  value={filters.valorMaximo}
                  onChange={(e) => setFilters(prev => ({...prev, valorMaximo: e.target.value}))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};