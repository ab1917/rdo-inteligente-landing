import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface FuncionarioFiltersProps {
  searchTerm: string;
  statusFilter: 'all' | 'ativo' | 'inativo';
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: 'all' | 'ativo' | 'inativo') => void;
}

export function FuncionarioFilters({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusFilterChange
}: FuncionarioFiltersProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar funcionários..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Status: {statusFilter === 'all' ? 'Todos' : statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onStatusFilterChange('all')}>
                Todos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusFilterChange('ativo')}>
                Ativo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusFilterChange('inativo')}>
                Inativo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}