import React from 'react';
import { Plus, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FuncionarioEmptyStateProps {
  searchTerm: string;
  statusFilter: 'all' | 'ativo' | 'inativo';
}

export function FuncionarioEmptyState({ searchTerm, statusFilter }: FuncionarioEmptyStateProps) {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Nenhum funcionário encontrado</h3>
        <p className="text-muted-foreground mb-4">
          {searchTerm || statusFilter !== 'all' 
            ? 'Tente ajustar os filtros de busca' 
            : 'Comece cadastrando seus funcionários'}
        </p>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Funcionário
        </Button>
      </CardContent>
    </Card>
  );
}