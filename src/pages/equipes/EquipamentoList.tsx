import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Wrench, AlertTriangle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { equipamentosData } from '@/services/mockData';
import type { EquipamentoMaster } from '@/types';

export function EquipamentoList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'disponivel' | 'em_uso' | 'manutencao' | 'calibracao'>('all');
  const [categoriaFilter, setCategoriaFilter] = useState<'all' | 'obra_civil' | 'industrial' | 'medicao' | 'seguranca'>('all');

  const filteredEquipamentos = equipamentosData.filter(equipamento => {
    const matchesSearch = equipamento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipamento.tipo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || equipamento.status === statusFilter;
    const matchesCategoria = categoriaFilter === 'all' || equipamento.categoria === categoriaFilter;
    return matchesSearch && matchesStatus && matchesCategoria;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponivel': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'em_uso': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'manutencao': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'calibracao': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'obra_civil': return 'bg-brown-500/10 text-brown-600 border-brown-500/20';
      case 'industrial': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'medicao': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'seguranca': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const formatValorHora = (valor?: number) => {
    if (!valor) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const isManutencaoVencida = (equipamento: EquipamentoMaster) => {
    // Simulação de verificação de manutenção vencida
    return Math.random() > 0.8; // 20% chance de estar vencida
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipamentos</h1>
          <p className="text-muted-foreground">
            Controle de equipamentos, ferramentas e instrumentos
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Equipamento
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar equipamentos..."
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
                <DropdownMenuItem onClick={() => setStatusFilter('disponivel')}>
                  Disponível
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('em_uso')}>
                  Em Uso
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('manutencao')}>
                  Manutenção
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('calibracao')}>
                  Calibração
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Categoria: {categoriaFilter === 'all' ? 'Todas' : categoriaFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setCategoriaFilter('all')}>
                  Todas
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategoriaFilter('obra_civil')}>
                  Obra Civil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategoriaFilter('industrial')}>
                  Industrial
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategoriaFilter('medicao')}>
                  Medição
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategoriaFilter('seguranca')}>
                  Segurança
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Equipamentos */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Equipamento</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Valor/Hora</TableHead>
              <TableHead>Manutenção</TableHead>
              <TableHead>Observações</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEquipamentos.map((equipamento) => {
              const manutencaoVencida = isManutencaoVencida(equipamento);
              
              return (
                <TableRow key={equipamento.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <Wrench className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{equipamento.nome}</p>
                        <p className="text-sm text-muted-foreground">{equipamento.tipo}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoriaColor(equipamento.categoria)}>
                      {equipamento.categoria.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(equipamento.status)}>
                      {equipamento.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatValorHora(equipamento.valor_hora)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {manutencaoVencida && (
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                      )}
                      <span className={`text-sm ${manutencaoVencida ? 'text-orange-600' : 'text-muted-foreground'}`}>
                        {equipamento.manutencao_preventiva} dias
                      </span>
                      {equipamento.calibracao_obrigatoria && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-purple-500" />
                          <span className="text-xs text-purple-600">Cal.</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {equipamento.observacoes || 'Nenhuma observação'}
                    </p>
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
                        <DropdownMenuItem>Agendar Manutenção</DropdownMenuItem>
                        {equipamento.calibracao_obrigatoria && (
                          <DropdownMenuItem>Calibrar</DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive">
                          Inativar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {filteredEquipamentos.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum equipamento encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' || categoriaFilter !== 'all'
                ? 'Tente ajustar os filtros de busca' 
                : 'Comece cadastrando seus equipamentos'}
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Equipamento
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}