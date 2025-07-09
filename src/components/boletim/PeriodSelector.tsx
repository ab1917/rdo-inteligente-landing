import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PeriodSelectorProps {
  selectedPeriod: {
    inicio: string;
    fim: string;
    tipo: 'dia' | 'semana' | 'quinzena' | 'mes' | 'personalizado';
  } | null;
  onPeriodChange: (period: {
    inicio: string;
    fim: string;
    tipo: 'dia' | 'semana' | 'quinzena' | 'mes' | 'personalizado';
  }) => void;
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({ selectedPeriod, onPeriodChange }) => {
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const getToday = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajustar para segunda-feira
    return new Date(d.setDate(diff));
  };

  const getEndOfWeek = (date: Date) => {
    const startOfWeek = getStartOfWeek(date);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return endOfWeek;
  };

  const handlePeriodClick = (tipo: 'dia' | 'semana' | 'quinzena' | 'mes') => {
    const hoje = new Date();
    let inicio: Date;
    let fim: Date;

    switch (tipo) {
      case 'dia':
        inicio = hoje;
        fim = hoje;
        break;
      case 'semana':
        inicio = getStartOfWeek(hoje);
        fim = getEndOfWeek(hoje);
        break;
      case 'quinzena':
        const dia = hoje.getDate();
        if (dia <= 15) {
          inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
          fim = new Date(hoje.getFullYear(), hoje.getMonth(), 15);
        } else {
          inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 16);
          fim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
        }
        break;
      case 'mes':
        inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        fim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
        break;
    }

    onPeriodChange({
      inicio: inicio.toISOString().split('T')[0],
      fim: fim.toISOString().split('T')[0],
      tipo
    });
  };

  const handleCustomPeriod = () => {
    if (customStart && customEnd) {
      onPeriodChange({
        inicio: customStart,
        fim: customEnd,
        tipo: 'personalizado'
      });
    }
  };

  const formatPeriod = (period: typeof selectedPeriod) => {
    if (!period) return '';
    
    const inicio = new Date(period.inicio).toLocaleDateString('pt-BR');
    const fim = new Date(period.fim).toLocaleDateString('pt-BR');
    
    if (inicio === fim) {
      return inicio;
    }
    
    return `${inicio} até ${fim}`;
  };

  const getDaysDifference = (period: typeof selectedPeriod) => {
    if (!period) return 0;
    
    const inicio = new Date(period.inicio);
    const fim = new Date(period.fim);
    const diffTime = Math.abs(fim.getTime() - inicio.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className="space-y-4">
      {/* Botões de período pré-definido */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant={selectedPeriod?.tipo === 'dia' ? 'default' : 'outline'}
          onClick={() => handlePeriodClick('dia')}
          className="gap-2"
        >
          <Calendar className="h-4 w-4" />
          Hoje
        </Button>
        <Button
          variant={selectedPeriod?.tipo === 'semana' ? 'default' : 'outline'}
          onClick={() => handlePeriodClick('semana')}
          className="gap-2"
        >
          <Calendar className="h-4 w-4" />
          Esta Semana
        </Button>
        <Button
          variant={selectedPeriod?.tipo === 'quinzena' ? 'default' : 'outline'}
          onClick={() => handlePeriodClick('quinzena')}
          className="gap-2"
        >
          <Calendar className="h-4 w-4" />
          Quinzena
        </Button>
        <Button
          variant={selectedPeriod?.tipo === 'mes' ? 'default' : 'outline'}
          onClick={() => handlePeriodClick('mes')}
          className="gap-2"
        >
          <Calendar className="h-4 w-4" />
          Este Mês
        </Button>
      </div>

      {/* Período personalizado */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Período Personalizado</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="customStart" className="text-xs text-muted-foreground">Data Início</Label>
            <Input
              id="customStart"
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              max={getToday()}
            />
          </div>
          <div>
            <Label htmlFor="customEnd" className="text-xs text-muted-foreground">Data Fim</Label>
            <Input
              id="customEnd"
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              min={customStart}
              max={getToday()}
            />
          </div>
        </div>
        <Button
          variant={selectedPeriod?.tipo === 'personalizado' ? 'default' : 'outline'}
          onClick={handleCustomPeriod}
          disabled={!customStart || !customEnd}
          className="w-full gap-2"
        >
          <Clock className="h-4 w-4" />
          Aplicar Período
        </Button>
      </div>

      {/* Resumo do período selecionado */}
      {selectedPeriod && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Período Selecionado</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm">{formatPeriod(selectedPeriod)}</span>
                  <Badge variant="secondary" className="text-xs">
                    {getDaysDifference(selectedPeriod)} dia(s)
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  {selectedPeriod.tipo === 'dia' && 'Boletim para um dia específico'}
                  {selectedPeriod.tipo === 'semana' && 'Boletim semanal (Segunda a Domingo)'}
                  {selectedPeriod.tipo === 'quinzena' && 'Boletim quinzenal'}
                  {selectedPeriod.tipo === 'mes' && 'Boletim mensal completo'}
                  {selectedPeriod.tipo === 'personalizado' && 'Período personalizado definido'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};