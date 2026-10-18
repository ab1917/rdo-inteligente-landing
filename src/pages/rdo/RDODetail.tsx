import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BarChart3, Loader2, Printer } from 'lucide-react';
import { useRDO } from '@/hooks/useRDO';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/rdo/StatusBadge';

export function RDODetail() {
  const { id } = useParams();
  const { getRDOById, loading } = useRDO();
  const rdo = id ? getRDOById(id) : undefined;

  if (loading) {
    return <div className="flex justify-center py-16" role="status" aria-label="Carregando RDO"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const back = <Button variant="ghost" className="print:hidden" asChild><Link to="/rdo"><ArrowLeft className="mr-2 h-4 w-4" />Voltar para RDOs</Link></Button>;

  if (!rdo) {
    return <div className="space-y-6">{back}<h1 className="text-2xl font-bold">RDO não encontrado</h1><p className="text-muted-foreground">O relatório solicitado não está disponível.</p></div>;
  }

  return (
    <div className="space-y-8">
      {back}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <h1 className="break-words text-3xl font-bold">{rdo.obra}</h1>
          <p className="text-muted-foreground">Relatório Diário de Obras · {new Date(`${rdo.data}T12:00:00`).toLocaleDateString('pt-BR')}</p>
          <div className="flex flex-wrap gap-2"><StatusBadge status={rdo.status} /><Badge variant="outline">{rdo.tipo === 'obra_civil' ? 'Obra Civil' : 'Manutenção Industrial'}</Badge></div>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" />Imprimir / PDF</Button>
          <Button variant="outline" asChild><Link to={`/rdo/${rdo.id}/relatorio`}><BarChart3 className="mr-2 h-4 w-4" />Relatório</Link></Button>
        </div>
      </header>
      <dl className="grid gap-4 border-y py-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Responsável', rdo.responsavel], ['Cliente', rdo.cliente], ['Local', rdo.local],
          ['Clima', `${rdo.clima} · ${rdo.temperatura}°C`],
          ['HH previsto', `${rdo.hh_previsto_dia} h`], ['HH executado', `${rdo.hh_executado_total} h`],
          ['Custo realizado', rdo.custo_hh_realizado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })],
          ['Ordem de serviço', rdo.os_numero || '—'],
        ].map(([label, value]) => <div key={label} className="min-w-0"><dt className="text-sm text-muted-foreground">{label}</dt><dd className="break-words font-medium">{value}</dd></div>)}
      </dl>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Atividades</h2>
        {rdo.atividades.length === 0 && <p className="text-muted-foreground">Nenhuma atividade registrada.</p>}
        {rdo.atividades.map(atividade => <div key={atividade.id} className="space-y-1 border-b pb-4"><h3 className="font-medium">{atividade.descricao}</h3><p className="text-sm text-muted-foreground">{atividade.responsavel} · {atividade.inicio}–{atividade.fim} · {atividade.percentual}%</p>{atividade.observacoes_tecnicas && <p className="whitespace-pre-wrap text-sm">{atividade.observacoes_tecnicas}</p>}</div>)}
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Equipe</h2>
        {rdo.equipes.length === 0 && <p className="text-muted-foreground">Nenhum funcionário registrado.</p>}
        {rdo.equipes.map(equipe => <div key={equipe.id} className="flex flex-wrap justify-between gap-2 border-b pb-3"><div><p className="font-medium">{equipe.funcionario}</p><p className="text-sm text-muted-foreground">{equipe.cargo}</p></div><p className="text-sm">{equipe.horaInicio}–{equipe.horaFim} · {equipe.horasTrabalhadas} h</p></div>)}
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Fotos</h2>
        {rdo.fotos.length === 0 && <p className="text-muted-foreground">Nenhuma foto registrada.</p>}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{rdo.fotos.map(foto => <figure key={foto.id} className="min-w-0"><img src={foto.url} alt={foto.descricao} className="aspect-[4/3] w-full rounded-md border object-cover" onError={event => { event.currentTarget.hidden = true; }} /><figcaption className="mt-2 break-words text-sm text-muted-foreground">{foto.descricao}</figcaption></figure>)}</div>
      </section>
      {rdo.observacoes && <section className="space-y-3"><h2 className="text-xl font-semibold">Observações</h2><p className="whitespace-pre-wrap break-words">{rdo.observacoes}</p></section>}
      {rdo.validacao_tecnica?.alertas.length > 0 && <section className="space-y-3"><h2 className="text-xl font-semibold">Alertas técnicos</h2><ul className="list-inside list-disc text-destructive">{rdo.validacao_tecnica.alertas.map(alerta => <li key={alerta}>{alerta}</li>)}</ul></section>}
    </div>
  );
}