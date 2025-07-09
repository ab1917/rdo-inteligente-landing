import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react';
import { RDO } from '@/types';

interface StatusBadgeProps {
  status: RDO['status'];
  className?: string;
}

const statusConfig = {
  rascunho: {
    label: 'Rascunho',
    icon: Clock,
    variant: 'secondary' as const,
    className: 'bg-slate-100 text-slate-700 border-slate-200'
  },
  pendente: {
    label: 'Pendente',
    icon: Clock,
    variant: 'outline' as const,
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200'
  },
  aprovado: {
    label: 'Aprovado',
    icon: CheckCircle,
    variant: 'default' as const,
    className: 'bg-green-50 text-green-700 border-green-200'
  },
  alerta: {
    label: 'Alerta',
    icon: AlertTriangle,
    variant: 'destructive' as const,
    className: 'bg-red-50 text-red-700 border-red-200'
  },
  em_execucao: {
    label: 'Em Execução',
    icon: Clock,
    variant: 'default' as const,
    className: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  finalizado: {
    label: 'Finalizado',
    icon: CheckCircle,
    variant: 'default' as const,
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant}
      className={`${config.className} ${className}`}
    >
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
}