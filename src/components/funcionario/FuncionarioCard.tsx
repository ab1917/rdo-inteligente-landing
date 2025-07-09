import React from 'react';
import { MoreHorizontal, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CertificacaoStatus } from './CertificacaoStatus';
import type { Funcionario } from '@/types';

interface FuncionarioCardProps {
  funcionario: Funcionario;
  getStatusColor: (status: string) => string;
  formatSalary: (salario?: number) => string;
}

export function FuncionarioCard({ funcionario, getStatusColor, formatSalary }: FuncionarioCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
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

        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Certificações
          </p>
          <CertificacaoStatus 
            certificacoes={funcionario.certificacoes || []} 
          />
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Admitido em {new Date(funcionario.dataAdmissao).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}