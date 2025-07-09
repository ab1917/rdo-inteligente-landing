import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRDO } from '@/hooks/useRDO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/rdo/StatusBadge';
import { 
  Plus, 
  Search, 
  Calendar, 
  MapPin, 
  User, 
  Eye,
  Edit,
  Filter,
  Sun,
  Cloud,
  CloudRain,
  Wind
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

const statusColors = {
  rascunho: 'secondary',
  pendente: 'destructive', 
  aprovado: 'default'
} as const;

const statusLabels = {
  rascunho: 'Rascunho',
  pendente: 'Pendente',
  aprovado: 'Aprovado'
};

const climaIcons = {
  sol: Sun,
  nublado: Cloud,
  chuva: CloudRain,
  vento: Wind
};

export function RDOList() {
  const { rdos, loading } = useRDO();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  const filteredRDOs = rdos.filter(rdo => {
    const matchesSearch = rdo.obra.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rdo.responsavel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || rdo.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">RDO - Relatório Diário de Obra</h1>
          <p className="text-muted-foreground">
            Gerencie os relatórios diários de suas obras
          </p>
        </div>
        
        <Button asChild>
          <Link to="/rdo/criar">
            <Plus className="mr-2 h-4 w-4" />
            Novo RDO
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por obra ou responsável..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="rascunho">Rascunho</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                  <SelectItem value="alerta">Alerta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RDO List */}
      <div className="grid gap-4">
        {filteredRDOs.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'todos' 
                    ? 'Nenhum RDO encontrado com os filtros aplicados.'
                    : 'Nenhum RDO cadastrado ainda.'
                  }
                </p>
                <Button asChild className="mt-4">
                  <Link to="/rdo/criar">
                    <Plus className="mr-2 h-4 w-4" />
                    Criar primeiro RDO
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredRDOs.map((rdo) => {
            const ClimaIcon = climaIcons[rdo.clima];
            
            return (
              <Card key={rdo.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="text-xl">{rdo.obra}</CardTitle>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-4 w-4" />
                          {new Date(rdo.data).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="flex items-center">
                          <User className="mr-1 h-4 w-4" />
                          {rdo.responsavel}
                        </div>
                        <div className="flex items-center">
                          <ClimaIcon className="mr-1 h-4 w-4" />
                          {rdo.temperatura}°C
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <StatusBadge status={rdo.status} />
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Summary */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Atividades:</span>
                        <div className="font-medium">{rdo.atividades.length}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Equipe:</span>
                        <div className="font-medium">{rdo.equipes.length} pessoas</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Fotos:</span>
                        <div className="font-medium">{rdo.fotos.length}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Horas:</span>
                        <div className="font-medium">
                          {rdo.equipes.reduce((acc, eq) => acc + eq.horasTrabalhadas, 0)}h
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-2 border-t">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/rdo/${rdo.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </Link>
                      </Button>
                      
                      {rdo.status !== 'aprovado' && (
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/rdo/${rdo.id}/editar`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}