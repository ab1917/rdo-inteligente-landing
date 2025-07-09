import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit3, CheckCircle, FileText, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useParams } from 'react-router-dom';
import { BoletimMedicao } from '@/types';
import { getStorageData } from '@/services/mockData';
import { BoletimMedicaoCompleto } from '@/components/boletim/BoletimMedicaoCompleto';
import { useBoletimMedicao } from '@/hooks/useBoletimMedicao';
import { toast } from '@/hooks/use-toast';

const BoletimDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { aprovarBoletim, loading } = useBoletimMedicao();
  const [boletim, setBoletim] = useState<BoletimMedicao | null>(null);

  useEffect(() => {
    if (id) {
      const boletins = getStorageData<BoletimMedicao[]>('boletins_medicao', []);
      const boletimEncontrado = boletins.find(b => b.id === id);
      setBoletim(boletimEncontrado || null);
    }
  }, [id]);

  const handleAprovar = async () => {
    if (!boletim) return;
    
    try {
      await aprovarBoletim(boletim.id, 'Sistema');
      
      // Atualizar o boletim local
      setBoletim(prev => prev ? {
        ...prev,
        status: 'aprovado',
        aprovado_em: new Date().toISOString(),
        aprovado_por: 'Sistema'
      } : null);
      
      toast({
        title: "Boletim aprovado!",
        description: "O boletim foi aprovado com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro ao aprovar",
        description: "Ocorreu um erro ao aprovar o boletim.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'rascunho': 'secondary',
      'aprovado': 'default',
      'faturado': 'outline'
    } as const;

    const colors = {
      'rascunho': 'text-yellow-600',
      'aprovado': 'text-green-600', 
      'faturado': 'text-blue-600'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'} 
             className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (!boletim) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/boletim')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Boletim não encontrado</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/boletim')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Boletim #{boletim.id}</h1>
              {getStatusBadge(boletim.status)}
            </div>
            <p className="text-muted-foreground">
              Data: {new Date(boletim.data).toLocaleDateString('pt-BR')} • 
              RDO: {boletim.rdo_id}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {boletim.status === 'rascunho' && (
            <Button 
              onClick={handleAprovar}
              disabled={loading}
              className="gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              {loading ? 'Aprovando...' : 'Aprovar'}
            </Button>
          )}
          
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar PDF
          </Button>
          
          {boletim.status === 'rascunho' && (
            <Button variant="outline" className="gap-2">
              <Edit3 className="h-4 w-4" />
              Editar
            </Button>
          )}
        </div>
      </div>

      {/* Informações do Boletim */}
      {boletim.aprovado_em && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Informações de Aprovação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Aprovado por:</span>
                <div className="font-medium">{boletim.aprovado_por}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Data de aprovação:</span>
                <div className="font-medium">
                  {new Date(boletim.aprovado_em).toLocaleString('pt-BR')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conteúdo do Boletim */}
      <BoletimMedicaoCompleto boletim={boletim} />
    </div>
  );
};

export default BoletimDetail;