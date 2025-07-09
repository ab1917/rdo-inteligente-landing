import React, { useState, useEffect } from 'react';
import { Building2, MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { getStorageData } from '@/services/mockData';
import { RDO } from '@/types';

interface ObraSelectorProps {
  selectedObra: string;
  onObraChange: (obra: string) => void;
}

export const ObraSelector: React.FC<ObraSelectorProps> = ({ selectedObra, onObraChange }) => {
  const [obras, setObras] = useState<string[]>([]);

  useEffect(() => {
    // Buscar obras dos RDOs existentes
    const rdos = getStorageData<RDO[]>('rdos', []);
    const obrasUnicas = Array.from(new Set(rdos.map(rdo => rdo.obra).filter(Boolean)));
    
    // Adicionar obras mock se não houver RDOs
    if (obrasUnicas.length === 0) {
      setObras([
        'Residencial Bella Vista',
        'Edifício Comercial Centro',
        'Galpão Industrial Norte',
        'Condomínio Solar das Águas'
      ]);
    } else {
      setObras(obrasUnicas);
    }
  }, []);

  return (
    <div className="space-y-4">
      <Select value={selectedObra} onValueChange={onObraChange}>
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