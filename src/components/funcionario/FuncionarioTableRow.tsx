import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
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

interface FuncionarioTableRowProps {
  funcionario: Funcionario;
  getStatusColor: (status: string) => string;
  formatSalary: (salario?: number) => string;
}

export function FuncionarioTableRow({ funcionario, getStatusColor, formatSalary }: FuncionarioTableRowProps) {
  return (
    <TableRow>
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
        <CertificacaoStatus 
          certificacoes={funcionario.certificacoes || []} 
          compact 
        />
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
  );
}