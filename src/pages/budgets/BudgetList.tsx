import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Calendar, 
  DollarSign, 
  User, 
  Eye,
  Edit,
  Filter,
  Building,
  Factory,
  Wrench,
  Sparkles
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Budget {
  id: string;
  nome: string;
  tipo: 'obra_civil' | 'manutencao_industrial';
  cliente: string;
  responsavel: string;
  valor_total: number;
  status: 'rascunho' | 'enviado' | 'aprovado' | 'rejeitado';
  data_criacao: string;
  data_validade: string;
  template_usado?: string;
  criado_com_ia: boolean;
}

const mockBudgets: Budget[] = [
  {
    id: '1',
    nome: 'Casa Térrea 120m² - Alvenaria',
    tipo: 'obra_civil',
    cliente: 'João e Maria Silva',
    responsavel: 'João Silva',
    valor_total: 350000,
    status: 'aprovado',
    data_criacao: '2024-01-05',
    data_validade: '2024-02-05',
    template_usado: 'Casa Térrea Padrão',
    criado_com_ia: false
  },
  {
    id: '2',
    nome: 'Manutenção Elétrica - Linha Produção 2',
    tipo: 'manutencao_industrial',
    cliente: 'Cimento Forte S.A.',
    responsavel: 'Carlos Técnico',
    valor_total: 85000,
    status: 'enviado',
    data_criacao: '2024-01-08',
    data_validade: '2024-01-23',
    template_usado: 'Manutenção Elétrica Industrial',
    criado_com_ia: true
  },
  {
    id: '3',
    nome: 'Retrofit Fábrica - Adequação NR-12',
    tipo: 'manutencao_industrial',
    cliente: 'Metalúrgica XYZ Ltda',
    responsavel: 'Maria Santos',
    valor_total: 420000,
    status: 'rascunho',
    data_criacao: '2024-01-10',
    data_validade: '2024-02-10',
    criado_com_ia: true
  }
];

const statusConfig = {
  rascunho: { label: 'Rascunho', variant: 'secondary' as const, color: 'bg-gray-100 text-gray-700' },
  enviado: { label: 'Enviado', variant: 'outline' as const, color: 'bg-blue-100 text-blue-700' },
  aprovado: { label: 'Aprovado', variant: 'default' as const, color: 'bg-green-100 text-green-700' },
  rejeitado: { label: 'Rejeitado', variant: 'destructive' as const, color: 'bg-red-100 text-red-700' }
};

const tipoConfig = {
  obra_civil: { label: 'Obra Civil', icon: Building, color: 'bg-blue-100 text-blue-700' },
  manutencao_industrial: { label: 'Manutenção Industrial', icon: Factory, color: 'bg-purple-100 text-purple-700' }
};

export function BudgetList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [tipoFilter, setTipoFilter] = useState<string>('todos');

  const filteredBudgets = mockBudgets.filter(budget => {
    const matchesSearch = budget.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         budget.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || budget.status === statusFilter;
    const matchesTipo = tipoFilter === 'todos' || budget.tipo === tipoFilter;
    return matchesSearch && matchesStatus && matchesTipo;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Orçamentos Inteligentes</h1>
          <p className="text-muted-foreground">
            Templates inteligentes para obras civis e manutenção industrial
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/orcamentos/templates">
              <Wrench className="mr-2 h-4 w-4" />
              Templates
            </Link>
          </Button>
          <Button asChild>
            <Link to="/orcamentos/criar">
              <Plus className="mr-2 h-4 w-4" />
              Novo Orçamento
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome do projeto ou cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="sm:w-48">
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger>
                  <Building className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Tipos</SelectItem>
                  <SelectItem value="obra_civil">Obra Civil</SelectItem>
                  <SelectItem value="manutencao_industrial">Manutenção Industrial</SelectItem>
                </SelectContent>
              </Select>
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
                  <SelectItem value="enviado">Enviado</SelectItem>
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                  <SelectItem value="rejeitado">Rejeitado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget List */}
      <div className="grid gap-4">
        {filteredBudgets.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'todos' || tipoFilter !== 'todos'
                    ? 'Nenhum orçamento encontrado com os filtros aplicados.'
                    : 'Nenhum orçamento cadastrado ainda.'
                  }
                </p>
                <Button asChild className="mt-4">
                  <Link to="/orcamentos/criar">
                    <Plus className="mr-2 h-4 w-4" />
                    Criar primeiro orçamento
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredBudgets.map((budget) => {
            const StatusConfig = statusConfig[budget.status];
            const TipoConfig = tipoConfig[budget.tipo];
            const TipoIcon = TipoConfig.icon;
            
            return (
              <Card key={budget.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl">{budget.nome}</CardTitle>
                        {budget.criado_com_ia && (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            <Sparkles className="w-3 h-3 mr-1" />
                            IA
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-4 w-4" />
                          {new Date(budget.data_criacao).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="flex items-center">
                          <User className="mr-1 h-4 w-4" />
                          {budget.responsavel}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="mr-1 h-4 w-4" />
                          {formatCurrency(budget.valor_total)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={TipoConfig.color}>
                        <TipoIcon className="w-3 h-3 mr-1" />
                        {TipoConfig.label}
                      </Badge>
                      <Badge className={StatusConfig.color}>
                        {StatusConfig.label}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Cliente:</span>
                        <div className="font-medium">{budget.cliente}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Template:</span>
                        <div className="font-medium">{budget.template_usado || 'Personalizado'}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Válido até:</span>
                        <div className="font-medium">
                          {new Date(budget.data_validade).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-2 border-t">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/orcamentos/${budget.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </Link>
                      </Button>
                      
                      {budget.status === 'rascunho' && (
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/orcamentos/${budget.id}/editar`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        </Button>
                      )}
                      
                      <Button size="sm" asChild>
                        <Link to={`/orcamentos/${budget.id}/duplicar`}>
                          <Plus className="mr-2 h-4 w-4" />
                          Duplicar
                        </Link>
                      </Button>
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