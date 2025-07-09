import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, User, Award, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { funcionariosData } from '@/services/mockData';
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'inativo': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const formatSalary = (salario?: number) => {
    if (!salario) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(salario);
  };

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

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar funcionários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                  Todos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('ativo')}>
                  Ativo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('inativo')}>
                  Inativo
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo */}
      {viewMode === 'grid' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFuncionarios.map((funcionario) => (
            <Card key={funcionario.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {funcionario.nome.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{funcionario.nome}</CardTitle>
                      <p className="text-sm text-muted-foreground">{funcionario.cargo}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Ver Histórico</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Inativar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(funcionario.status)}>
                    {funcionario.status}
                  </Badge>
                  <span className="text-sm font-medium">
                    {formatSalary(funcionario.salario)}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Especialidades
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {funcionario.especialidades.map((especialidade) => (
                      <Badge key={especialidade} variant="secondary" className="text-xs">
                        {especialidade}
                      </Badge>
                    ))}
                  </div>
                </div>

                {funcionario.certificacoes && funcionario.certificacoes.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Certificações
                    </p>
                    <div className="space-y-1">
                      {funcionario.certificacoes.slice(0, 2).map((cert) => (
                        <div key={cert.id} className="flex items-center gap-2">
                          <Award className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">{cert.nome}</span>
                        </div>
                      ))}
                      {funcionario.certificacoes.length > 2 && (
                        <p className="text-xs text-muted-foreground">
                          +{funcionario.certificacoes.length - 2} mais
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Admitido em {new Date(funcionario.dataAdmissao).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                <TableHead>Status</TableHead>
                <TableHead>Salário</TableHead>
                <TableHead>Admissão</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFuncionarios.map((funcionario) => (
                <TableRow key={funcionario.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {funcionario.nome.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{funcionario.nome}</p>
                        <p className="text-sm text-muted-foreground">{funcionario.cpf}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{funcionario.cargo}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {funcionario.especialidades.slice(0, 2).map((esp) => (
                        <Badge key={esp} variant="secondary" className="text-xs">
                          {esp}
                        </Badge>
                      ))}
                      {funcionario.especialidades.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{funcionario.especialidades.length - 2}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(funcionario.status)}>
                      {funcionario.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatSalary(funcionario.salario)}</TableCell>
                  <TableCell>
                    {new Date(funcionario.dataAdmissao).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Ver Histórico</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Inativar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {filteredFuncionarios.length === 0 && (
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
      )}
    </div>
  );
}