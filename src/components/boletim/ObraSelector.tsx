import React from 'react';
import { Building2, MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useRDO } from '@/hooks/useRDO';

interface ObraSelectorProps {
  selectedObra: string;
  onObraChange: (obra: string) => void;
}

export const ObraSelector: React.FC<ObraSelectorProps> = ({ selectedObra, onObraChange }) => {
  const { rdos, loading } = useRDO();
  const obras = Array.from(new Set(rdos.map(rdo => rdo.obra).filter(Boolean)));

  return (
    <div className="space-y-4">
      <Select value={selectedObra} onValueChange={onObraChange} disabled={loading || obras.length === 0}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma obra" />
        </SelectTrigger>
        <SelectContent>
          {obras.map((obra) => (
            <SelectItem key={obra} value={obra}>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {obra}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedObra && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{selectedObra}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3" />
                  Obra selecionada para geração do boletim
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Todos os RDOs desta obra no período selecionado serão consolidados.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};