import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit3, CheckCircle, FileText, Printer } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useParams } from 'react-router-dom';
import { BoletimMedicao } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { Alert,AlertDescription } from '@/components/ui/alert';
import { BoletimMedicaoCompleto } from '@/components/boletim/BoletimMedicaoCompleto';
import { useBoletimMedicao } from '@/hooks/useBoletimMedicao';
import { toast } from '@/hooks/use-toast';

const BoletimDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { aprovarBoletim, faturarBoletim, boletins, loading, error } = useBoletimMedicao();
  const {user}=useAuth();
  const allowed=user&&['admin','manager','super_admin'].includes(user.role);
  const boletim=boletins.find(b=>b.id===id);

  const handleAprovar = async () => {
    if (!boletim) return;
    
    try {
      await aprovarBoletim(boletim.id, 'Sistema');
      
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

  if (loading) return <p role="status">Carregando medição...</p>;
  if(error) return <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>;
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
          <Button variant="ghost" className="print:hidden" onClick={() => navigate('/boletim')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{boletim.obra_nome || 'Boletim de Medição'}</h1>
              {getStatusBadge(boletim.status)}
            </div>
            <p className="text-muted-foreground">
              Data: {new Date(boletim.data).toLocaleDateString('pt-BR')} • 
              RDO: {boletim.rdo_id}
            </p>
          </div>
        </div>

        <div className="flex gap-2 print:hidden">
          {allowed && boletim.status === 'rascunho' && (
            <Button 
              onClick={handleAprovar}
              disabled={loading}
              className="gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              {loading ? 'Aprovando...' : 'Aprovar'}
            </Button>
          )}
          
          <Button variant="outline" className="gap-2 print:hidden" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            Imprimir / PDF
          </Button>
          
          {allowed&&boletim.status==='aprovado'&&<Button onClick={async()=>{try{await faturarBoletim(boletim.id);toast({title:'Faturamento registrado'});}catch(e){toast({title:'Erro ao faturar',description:e instanceof Error?e.message:'Tente novamente.',variant:'destructive'});}}}>Registrar faturamento</Button>}

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