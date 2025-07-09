import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building2, 
  Search, 
  Filter,
  MoreHorizontal,
  Eye,
  Ban,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { useSuperAdmin } from '@/hooks/useSuperAdmin';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const SuperAdminCompanies = () => {
  const { companies, updateCompanyPlan, suspendCompany, activateCompany, extendTrial, loading } = useSuperAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.cnpj.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || company.status === statusFilter;
    const matchesPlan = planFilter === 'all' || company.plano === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      ativa: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      trial: { variant: 'secondary' as const, icon: Clock, color: 'text-orange-600' },
      suspensa: { variant: 'destructive' as const, icon: Ban, color: 'text-red-600' }
    };

    const config = variants[status as keyof typeof variants] || variants.suspensa;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPlanBadge = (plan: string) => {
    const colors = {
      starter: 'bg-blue-100 text-blue-800',
      professional: 'bg-purple-100 text-purple-800',
      enterprise: 'bg-gold-100 text-gold-800'
    };

    return (
      <Badge variant="outline" className={colors[plan as keyof typeof colors]}>
        {plan.charAt(0).toUpperCase() + plan.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Empresas</h1>
          <p className="text-muted-foreground">
            Gerencie todas as empresas cadastradas no sistema
          </p>
        </div>
        <Button>
          <Building2 className="h-4 w-4 mr-2" />
          Nova Empresa
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, email ou CNPJ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="ativa">Ativa</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="suspensa">Suspensa</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Plano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Planos</SelectItem>
                <SelectItem value="starter">Starter</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Empresas */}
      <Card>
        <CardHeader>
          <CardTitle>Empresas ({filteredCompanies.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCompanies.map((company) => (
              <div key={company.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium">{company.nome}</h4>
                    {getStatusBadge(company.status)}
                    {getPlanBadge(company.plano)}
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>{company.email}</p>
                    <p>CNPJ: {company.cnpj}</p>
                    <div className="flex items-center gap-4">
                      <span>Criada em: {new Date(company.data_criacao).toLocaleDateString('pt-BR')}</span>
                      {company.data_expiracao && (
                        <span className={company.status === 'trial' ? 'text-orange-600 font-medium' : ''}>
                          Expira: {new Date(company.data_expiracao).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span>Obras: {company.limites.obras === -1 ? 'Ilimitadas' : company.limites.obras}</span>
                    <span>Usuários: {company.limites.usuarios === -1 ? 'Ilimitados' : company.limites.usuarios}</span>
                    <span>Storage: {company.limites.armazenamento_gb === -1 ? 'Ilimitado' : `${company.limites.armazenamento_gb}GB`}</span>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </DropdownMenuItem>
                    
                    {company.status === 'ativa' ? (
                      <DropdownMenuItem onClick={() => suspendCompany(company.id)}>
                        <Ban className="h-4 w-4 mr-2" />
                        Suspender
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => activateCompany(company.id)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Ativar
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => updateCompanyPlan(company.id, 'starter')}>
                      Mudar para Starter
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateCompanyPlan(company.id, 'professional')}>
                      Mudar para Professional
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateCompanyPlan(company.id, 'enterprise')}>
                      Mudar para Enterprise
                    </DropdownMenuItem>
                    
                    {company.status === 'trial' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => extendTrial(company.id, 30)}>
                          <Clock className="h-4 w-4 mr-2" />
                          Estender Trial (30 dias)
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};