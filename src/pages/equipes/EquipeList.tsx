import React, { useState } from 'react';
import { Plus, Users, Search, Filter, MoreHorizontal } from 'lucide-react';
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
import { equipesData, funcionariosData } from '@/services/mockData';
import type { Equipe, Funcionario } from '@/types';

export function EquipeList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ativa' | 'inativa'>('all');

  const filteredEquipes = equipesData.filter(equipe => {
    const matchesSearch = equipe.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipe.obra.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || equipe.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getFuncionario = (id: string): Funcionario | undefined => 
    funcionariosData.find(f => f.id === id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'inativa': return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipes</h1>
          <p className="text-muted-foreground">
            Gerencie equipes e seus membros por especialidade
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Equipe
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar equipes..."
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
                <DropdownMenuItem onClick={() => setStatusFilter('ativa')}>
                  Ativa
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('inativa')}>
                  Inativa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Equipes */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEquipes.map((equipe) => {
          const lider = getFuncionario(equipe.lider);
          const membros = equipe.membros.map(id => getFuncionario(id)).filter(Boolean) as Funcionario[];
          
          return (
            <Card key={equipe.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{equipe.nome}</CardTitle>
                    <Badge className={getStatusColor(equipe.status)}>
                      {equipe.status}
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Ver Relatório</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Inativar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Obra */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Obra</p>
                  <p className="text-sm">{equipe.obra}</p>
                </div>

                {/* Líder */}
                {lider && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Líder</p>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {lider.nome.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{lider.nome}</p>
                        <p className="text-xs text-muted-foreground">{lider.cargo}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Membros */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Membros ({membros.length})
                  </p>
                  <div className="flex items-center gap-1">
                    {membros.slice(0, 5).map((membro) => (
                      <Avatar key={membro.id} className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {membro.nome.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {membros.length > 5 && (
                      <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">
                          +{membros.length - 5}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Especialidades */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Especialidades
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {[...new Set(membros.flatMap(m => m.especialidades))].map((especialidade) => (
                      <Badge key={especialidade} variant="secondary" className="text-xs">
                        {especialidade}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredEquipes.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma equipe encontrada</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca' 
                : 'Comece criando sua primeira equipe'}
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Equipe
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}