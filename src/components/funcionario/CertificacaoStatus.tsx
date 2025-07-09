import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';
import type { Certificacao } from '@/types';

interface CertificacaoStatusProps {
  certificacoes: Certificacao[];
  compact?: boolean;
}

export function CertificacaoStatus({ certificacoes, compact = false }: CertificacaoStatusProps) {
  const getStatusCounts = () => {
    const counts = {
      valida: 0,
      proximo_vencimento: 0,
      vencida: 0,
      pendente_renovacao: 0
    };

    certificacoes.forEach(cert => {
      // Calcular status baseado na data de vencimento se não estiver definido
      if (cert.data_vencimento) {
        const hoje = new Date();
        const vencimento = new Date(cert.data_vencimento);
        const diffDays = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
          counts.vencida++;
        } else if (diffDays <= 30) {
          counts.proximo_vencimento++;
        } else {
          counts.valida++;
        }
      } else {
        counts[cert.status]++;
      }
    });

    return counts;
  };

  const statusCounts = getStatusCounts();
  const total = certificacoes.length;

  if (total === 0) {
    return (
      <Badge variant="secondary" className="bg-gray-50 text-gray-600">
        Sem certificações
      </Badge>
    );
  }

  // Determinar status principal baseado na prioridade
  const getMainStatus = () => {
    if (statusCounts.vencida > 0) return 'vencida';
    if (statusCounts.proximo_vencimento > 0) return 'proximo_vencimento';
    if (statusCounts.pendente_renovacao > 0) return 'pendente_renovacao';
    return 'valida';
  };

  const mainStatus = getMainStatus();

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'valida':
        return {
          icon: CheckCircle,
          label: 'Conforme',
          className: 'bg-green-50 text-green-700 border-green-200'
        };
      case 'proximo_vencimento':
        return {
          icon: Clock,
          label: 'Próximo ao Vencimento',
          className: 'bg-yellow-50 text-yellow-700 border-yellow-200'
        };
      case 'vencida':
        return {
          icon: XCircle,
          label: 'Vencida',
          className: 'bg-red-50 text-red-700 border-red-200'
        };
      case 'pendente_renovacao':
        return {
          icon: AlertTriangle,
          label: 'Pendente',
          className: 'bg-orange-50 text-orange-700 border-orange-200'
        };
      default:
        return {
          icon: CheckCircle,
          label: 'Conforme',
          className: 'bg-gray-50 text-gray-700 border-gray-200'
        };
    }
  };

  const config = getStatusConfig(mainStatus);
  const Icon = config.icon;

  if (compact) {
    return (
      <Badge className={config.className} variant="outline">
        <Icon className="w-3 h-3 mr-1" />
        {total}
      </Badge>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Badge className={config.className} variant="outline">
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
      <span className="text-xs text-muted-foreground">
        {total} certificaç{total === 1 ? 'ão' : 'ões'}
      </span>
    </div>
  );
}