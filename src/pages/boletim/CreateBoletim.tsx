import React, { useState, useEffect } from 'react';
import { ArrowLeft, Building2, Calendar, FileText, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { BoletimMedicao, RDO } from '@/types';
import { useRDO } from '@/hooks/useRDO';
import { ObraSelector } from '@/components/boletim/ObraSelector';
import { PeriodSelector } from '@/components/boletim/PeriodSelector';
import { useBoletimMedicao } from '@/hooks/useBoletimMedicao';
import { BoletimMedicaoCompleto } from '@/components/boletim/BoletimMedicaoCompleto';
import { toast } from '@/hooks/use-toast';
import { MeasurementSettings } from '@/components/boletim/MeasurementSettings';
import { normalizeRole } from '@/services/measurementConfig';
import { ScopeMeasurement } from '@/components/boletim/ScopeMeasurement';
import { Tabs,TabsList,TabsTrigger } from '@/components/ui/tabs';
import { useCommercialData } from '@/hooks/useCommercialData';
import { Select,SelectTrigger,SelectValue,SelectContent,SelectItem } from '@/components/ui/select';
import { useMeasurementSettings } from '@/hooks/useMeasurementSettings';

const CreateBoletim = () => {
  const navigate = useNavigate();
  const { gerarBoletimConsolidado, loading } = useBoletimMedicao();
  const [mode,setMode]=useState('hh');
  const [contractId,setContractId]=useState('none');
  const {contratos}=useCommercialData();
  const { rdos: companyRDOs, loading: rdosLoading, error: rdosError } = useRDO();
  const [selectedObra, setSelectedObra] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<{
    inicio: string;
    fim: string;
    tipo: 'dia' | 'semana' | 'quinzena' | 'mes' | 'personalizado';
  } | null>(null);
  const [rdosEncontrados, setRdosEncontrados] = useState<RDO[]>([]);
  const { config: measurementConfig, setConfig: setMeasurementConfig, loading: settingsLoading, saving: settingsSaving, error: settingsError, save: saveSettings } = useMeasurementSettings();
  const [boletimGerado, setBoletimGerado] = useState<BoletimMedicao | null>(null);
  const [step, setStep] = useState<'config' | 'preview' | 'generated'>('config');

  useEffect(() => {
    if (!selectedObra || !selectedPeriod) {
      setRdosEncontrados([]);
      return;
    }
    const rdos = companyRDOs.filter(rdo =>
      rdo.obra === selectedObra && rdo.data.slice(0, 10) >= selectedPeriod.inicio && rdo.data.slice(0, 10) <= selectedPeriod.fim
    );
    setRdosEncontrados(rdos);
  }, [selectedObra, selectedPeriod, companyRDOs]);

  useEffect(() => {
    const roles = [...new Set(rdosEncontrados.flatMap(rdo => rdo.equipes.map(e => e.cargo)))];
    setMeasurementConfig(current => {
      const missing = roles.filter(role => !current.tariffs.some(t => normalizeRole(t.role) === normalizeRole(role)));
      return missing.length ? { ...current, tariffs: [...current.tariffs, ...missing.map(role => ({ role, hourly: 0 }))] } : current;
    });
  }, [rdosEncontrados]);

  const handleGerarBoletim = async () => {
    if (!selectedObra || !selectedPeriod || rdosEncontrados.length === 0) {
      toast({
        title: "Erro na geração",
        description: "Selecione uma obra, período e certifique-se que há RDOs no período.",
        variant: "destructive"
      });
      return;
    }

    try {
      const boletim = await gerarBoletimConsolidado(
        rdosEncontrados,
        selectedObra,
        selectedPeriod.inicio,
        selectedPeriod.fim,
        measurementConfig,
        contractId==='none'?undefined:contractId
      );
      
      setBoletimGerado(boletim);
      setStep('generated');
      
      toast({
        title: "Boletim gerado com sucesso!",
        description: `Boletim consolidado criado para ${rdosEncontrados.length} RDO(s).`
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar boletim",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao processar os dados. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const canGenerate = !rdosLoading && !rdosError && selectedObra && selectedPeriod && rdosEncontrados.length > 0;

  if (step === 'generated' && boletimGerado) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/boletim')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Lista
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Boletim Gerado</h1>
            <p className="text-muted-foreground">
              Boletim consolidado criado com sucesso
            </p>
          </div>
        </div>

        <BoletimMedicaoCompleto boletim={boletimGerado} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/boletim')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Criar Boletim de Medição</h1>
          <p className="text-muted-foreground">
            Selecione a obra e período para gerar o boletim consolidado
          </p>
        </div>
      </div>

      <Tabs value={mode} onValueChange={setMode}><TabsList><TabsTrigger value="hh">Por HH / RDO</TabsTrigger><TabsTrigger value="scope">Escopo fechado — avanço %</TabsTrigger></TabsList></Tabs>
      {mode==='scope'?<ScopeMeasurement onGenerated={b=>{setBoletimGerado(b);setStep('generated');}}/>:< >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuração */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Seleção de Obra
              </CardTitle>
              <CardDescription>
                Escolha a obra para o boletim de medição
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ObraSelector 
                selectedObra={selectedObra}
                onObraChange={setSelectedObra}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Período de Medição
              </CardTitle>
              <CardDescription>
                Defina o período para consolidação dos RDOs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PeriodSelector
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
              />
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                RDOs Encontrados
              </CardTitle>
              <CardDescription>
                RDOs que serão incluídos no boletim
              </CardDescription>
            </CardHeader>
            <CardContent>
              {rdosError ? <Alert variant="destructive"><AlertDescription>{rdosError}</AlertDescription></Alert> : rdosLoading ? <p role="status">Carregando RDOs...</p> : !selectedObra || !selectedPeriod ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Selecione uma obra e período para visualizar os RDOs</p>
                </div>
              ) : rdosEncontrados.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Nenhum RDO encontrado para a obra e período selecionados.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  <div className="text-sm font-medium">
                    {rdosEncontrados.length} RDO(s) encontrado(s)
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {rdosEncontrados.map((rdo) => (
                      <div key={rdo.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div>
                          <div className="font-medium">RDO #{rdo.id}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(rdo.data).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                        <div className="text-sm">
                          {rdo.equipes?.length || 0} funcionários
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {canGenerate && (
            <Button 
              onClick={handleGerarBoletim}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Gerando...' : 'Gerar Boletim Consolidado'}
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2"><p className="font-medium">Contrato por HH</p><Select value={contractId} onValueChange={setContractId}><SelectTrigger aria-label="Contrato por HH"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="none">Sem vínculo contratual</SelectItem>{contratos.filter(c=>c.nome_projeto===selectedObra&&c.tipo_execucao!=='escopo'&&c.status==='ativo').map(c=><SelectItem key={c.id} value={c.id}>{c.nome_projeto}</SelectItem>)}</SelectContent></Select></div>
      <MeasurementSettings value={measurementConfig} onChange={setMeasurementConfig} />
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          disabled={settingsLoading || settingsSaving}
          onClick={async () => {
            const saved = await saveSettings(measurementConfig);
            if (saved) toast({ title: "Configuração salva", description: "Tarifas e jornadas salvas para a empresa." });
            else toast({ title: "Erro ao salvar", description: settingsError || "Tente novamente.", variant: "destructive" });
          }}
        >
          {settingsSaving ? 'Salvando...' : 'Salvar configuração da empresa'}
        </Button>
        {settingsLoading && <span className="text-sm text-muted-foreground">Carregando configuração salva...</span>}
        {!settingsLoading && settingsError && <span className="text-sm text-muted-foreground">{settingsError}</span>}
      </div>
      </>}
    </div>
  );
};

export default CreateBoletim;