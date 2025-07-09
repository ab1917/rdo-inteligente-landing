import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { funcionariosData } from '@/services/mockData';
import { FuncionarioFilters } from '@/components/funcionario/FuncionarioFilters';
import { FuncionarioCard } from '@/components/funcionario/FuncionarioCard';
import { FuncionarioTableRow } from '@/components/funcionario/FuncionarioTableRow';
import { FuncionarioEmptyState } from '@/components/funcionario/FuncionarioEmptyState';
import { getStatusColor, formatSalary } from '@/utils/funcionarioHelpers';
import type { Funcionario } from '@/types';

export function FuncionarioList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ativo' | 'inativo'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredFuncionarios = funcionariosData.filter(funcionario => {
    const matchesSearch = funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         funcionario.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         funcionario.especialidades.some(esp => 
                           esp.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || funcionario.status === statusFilter;
    return matchesSearch && matchesStatus;
  });


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Funcionários</h1>
          <p className="text-muted-foreground">
            Gerencie funcionários, especialidades e certificações
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}>
            {viewMode === 'grid' ? 'Visão Tabela' : 'Visão Cards'}
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Funcionário
          </Button>
        </div>
      </div>

      <FuncionarioFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
      />

      {viewMode === 'grid' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFuncionarios.map((funcionario) => (
            <FuncionarioCard
              key={funcionario.id}
              funcionario={funcionario}
              getStatusColor={getStatusColor}
              formatSalary={formatSalary}
            />
          ))}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Especialidades</TableHead>
                <TableHead>Certificações</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Salário</TableHead>
                <TableHead>Admissão</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFuncionarios.map((funcionario) => (
                <FuncionarioTableRow
                  key={funcionario.id}
                  funcionario={funcionario}
                  getStatusColor={getStatusColor}
                  formatSalary={formatSalary}
                />
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {filteredFuncionarios.length === 0 && (
        <FuncionarioEmptyState
          searchTerm={searchTerm}
          statusFilter={statusFilter}
        />
      )}
    </div>
  );
}