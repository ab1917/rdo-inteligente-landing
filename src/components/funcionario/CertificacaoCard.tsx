import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Award, Clock, MapPin, User, FileText } from 'lucide-react';
import type { Certificacao } from '@/types';

interface CertificacaoCardProps {
  certificacao: Certificacao;
  className?: string;
}

export function CertificacaoCard({ certificacao, className }: CertificacaoCardProps) {
  const getStatusConfig = (status: Certificacao['status']) => {
    switch (status) {
      case 'valida':
        return {
          label: 'Válida',
          className: 'bg-green-50 text-green-700 border-green-200'
        };
      case 'proximo_vencimento':
        return {
          label: 'Próximo ao Vencimento',
          className: 'bg-yellow-50 text-yellow-700 border-yellow-200'
        };
      case 'vencida':
        return {
          label: 'Vencida',
          className: 'bg-red-50 text-red-700 border-red-200'
        };
      case 'pendente_renovacao':
        return {
          label: 'Pendente Renovação',
          className: 'bg-orange-50 text-orange-700 border-orange-200'
        };
      default:
        return {
          label: 'Indefinido',
          className: 'bg-gray-50 text-gray-700 border-gray-200'
        };
    }
  };

  const getTipoConfig = (tipo: Certificacao['tipo']) => {
    switch (tipo) {
      case 'certificacao':
        return { icon: Award, label: 'Certificação' };
      case 'treinamento':
        return { icon: User, label: 'Treinamento' };
      case 'curso':
        return { icon: FileText, label: 'Curso' };
      default:
        return { icon: Award, label: 'Certificação' };
    }
  };

  const getCategoriaColor = (categoria: Certificacao['categoria']) => {
    switch (categoria) {
      case 'nr':
        return 'bg-red-100 text-red-700';
      case 'crea':
        return 'bg-blue-100 text-blue-700';
      case 'tecnico':
        return 'bg-purple-100 text-purple-700';
      case 'operacional':
        return 'bg-green-100 text-green-700';
      case 'seguranca':
        return 'bg-orange-100 text-orange-700';
      case 'qualidade':
        return 'bg-indigo-100 text-indigo-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const calcularDiasRestantes = () => {
    if (!certificacao.data_vencimento) return null;
    const hoje = new Date();
    const vencimento = new Date(certificacao.data_vencimento);
    const diffTime = vencimento.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const statusConfig = getStatusConfig(certificacao.status);
  const tipoConfig = getTipoConfig(certificacao.tipo);
  const TipoIcon = tipoConfig.icon;
  const diasRestantes = calcularDiasRestantes();

  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <TipoIcon className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-medium text-sm">{certificacao.nome}</h4>
          </div>
          <Badge className={statusConfig.className} variant="outline">
            {statusConfig.label}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className={getCategoriaColor(certificacao.categoria)} variant="secondary">
              {certificacao.categoria.toUpperCase()}
            </Badge>
            <span className="text-xs text-muted-foreground">{tipoConfig.label}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Award className="h-3 w-3" />
            <span>{certificacao.orgao_emissor}</span>
          </div>

          {certificacao.numero && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="h-3 w-3" />
              <span>Nº {certificacao.numero}</span>
            </div>
          )}

          {certificacao.data_vencimento && (
            <div className="flex items-center gap-2 text-xs">
              <Calendar className="h-3 w-3" />
              <span className={diasRestantes !== null && diasRestantes < 30 ? 'text-orange-600 font-medium' : 'text-muted-foreground'}>
                Válida até {new Date(certificacao.data_vencimento).toLocaleDateString('pt-BR')}
              </span>
              {diasRestantes !== null && diasRestantes >= 0 && diasRestantes < 30 && (
                <span className="text-orange-600 font-medium">
                  ({diasRestantes} dias)
                </span>
              )}
            </div>
          )}

          {certificacao.carga_horaria && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{certificacao.carga_horaria}h</span>
            </div>
          )}

          {certificacao.instrutor && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span>{certificacao.instrutor}</span>
            </div>
          )}

          {certificacao.local_treinamento && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{certificacao.local_treinamento}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}