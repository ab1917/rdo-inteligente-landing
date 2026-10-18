import type { RDO } from '@/types';

interface RDOPrintDocumentProps {
  rdo: RDO;
  companyName?: string;
}

const dateLabel = (date: string) => {
  const value = new Date(`${date}T12:00:00`);
  return Number.isNaN(value.getTime()) ? '—' : value.toLocaleDateString('pt-BR');
};

export function RDOPrintDocument({ rdo, companyName }: RDOPrintDocumentProps) {
  const roles = rdo.equipes.reduce<Record<string, number>>((result, member) => {
    const role = member.cargo || 'Não informado';
    result[role] = (result[role] ?? 0) + 1;
    return result;
  }, {});
  const starts = rdo.equipes.map(member => member.horaInicio).filter(Boolean).sort();
  const ends = rdo.equipes.map(member => member.horaFim).filter(Boolean).sort();
  const workHours = starts.length && ends.length ? `${starts[0]} às ${ends[ends.length - 1]}` : '—';
  const weather = { sol: 'Tempo bom', chuva: 'Chuva', nublado: 'Nublado', vento: 'Vento' }[rdo.clima];
  const photos = rdo.fotos;
  const photoPages = Array.from({ length: Math.ceil(photos.length / 4) }, (_, index) => photos.slice(index * 4, index * 4 + 4));

  const header = (sheet: number) => <>
    <div className="rdo-document-heading">
      <div className="rdo-document-brand">{companyName || 'Contratada não informada'}</div>
      <h1>DIÁRIO DE OBRA</h1>
      <div className="rdo-document-brand">{rdo.cliente || 'Cliente não informado'}</div>
    </div>
    <table className="rdo-document-table rdo-document-identification"><tbody>
      <tr><th>CONTRATADA</th><td colSpan={3}>{companyName || '—'}</td><th>FOLHA</th><td>{sheet} / {1 + photoPages.length}</td></tr>
      <tr><th>CONTRATO</th><td>{rdo.id_contrato || '—'}</td><th>OBRA / ESCOPO</th><td colSpan={3}>{rdo.obra}</td></tr>
      <tr><th>DATA ATUAL</th><td>{dateLabel(rdo.data)}</td><th>DISCIPLINA</th><td>{rdo.tipo === 'obra_civil' ? 'Obra civil' : 'Manutenção industrial'}</td><th>RDO Nº</th><td>{rdo.id.padStart(3, '0')}</td></tr>
      <tr><th>LOCAL</th><td colSpan={3}>{rdo.local || '—'}</td><th>OS</th><td>{rdo.os_numero || '—'}</td></tr>
    </tbody></table>
  </>;

  const signatures = <div className="rdo-document-verification">
    <h2>VERIFICADO POR</h2>
    <div className="rdo-document-signature-head"><span>CONTRATADA</span><span>FISCALIZAÇÃO</span></div>
    <div className="rdo-document-signatures">
      <div><span>{rdo.responsavel}</span><p>Responsável / Planejamento</p></div>
      <div><span> </span><p>Engenharia / Supervisão</p></div>
      <div><span> </span><p>Contratante / Fiscalização</p></div>
    </div>
  </div>;

  return <article className="rdo-document" aria-label="Documento do RDO">
    <div className="rdo-document-sheet">
      {header(1)}
      <table className="rdo-document-table rdo-document-conditions"><thead><tr><th>TEMPO</th><th>TEMPERATURA</th><th>DIA DA SEMANA</th><th>HORÁRIO DE TRABALHO</th><th>EFETIVO REGISTRADO</th></tr></thead><tbody><tr><td>{weather}</td><td>{rdo.temperatura} °C</td><td>{new Date(`${rdo.data}T12:00:00`).toLocaleDateString('pt-BR', { weekday: 'long' })}</td><td>{workHours}</td><td>{rdo.equipes.length}</td></tr></tbody></table>
      <div className="rdo-document-columns">
        <div className="rdo-document-services">
          <h2>DESCRIÇÃO DOS SERVIÇOS</h2>
          <h3>SEGURANÇA / VERIFICAÇÕES TÉCNICAS</h3>
          <div className="rdo-document-text">
            {rdo.checklists?.length ? rdo.checklists.map(item => <p key={item.id}>{item.nome} — {item.status.replaceAll('_', ' ')}{item.observacoes ? ` · ${item.observacoes}` : ''}</p>) : <p>Sem checklist registrado.</p>}
            {rdo.validacao_tecnica?.alertas.map((alert, index) => <p key={index}>{alert}</p>)}
          </div>
          <h3>SERVIÇOS EXECUTADOS</h3>
          <div className="rdo-document-text">
            {rdo.atividades.length ? rdo.atividades.map((activity, index) => <div className="rdo-document-activity" key={activity.id}><strong>{index + 1}. {activity.descricao}</strong><p>{activity.inicio} às {activity.fim} · Avanço: {activity.percentual}%</p><p>Responsável: {activity.responsavel}</p>{activity.observacoes_tecnicas && <p>{activity.observacoes_tecnicas}</p>}</div>) : <p>Nenhuma atividade registrada.</p>}
          </div>
          <h3>OCORRÊNCIAS</h3>
          <div className="rdo-document-text">{rdo.ocorrencias?.length ? rdo.ocorrencias.map(item => <p key={item.id}>{item.descricao}{item.acoes_tomadas ? ` · Ações: ${item.acoes_tomadas}` : ''}</p>) : <p>Nenhuma ocorrência registrada.</p>}</div>
        </div>
        <div className="rdo-document-workforce">
          <h2>EFETIVO POR FUNÇÃO</h2>
          <table className="rdo-document-table"><thead><tr><th>FUNÇÃO</th><th>QTD</th></tr></thead><tbody>{Object.entries(roles).map(([role, count]) => <tr key={role}><td>{role}</td><td>{count}</td></tr>)}{!rdo.equipes.length && <tr><td colSpan={2}>Nenhum funcionário registrado.</td></tr>}<tr className="rdo-document-total"><th>TOTAL REGISTRADO</th><td>{rdo.equipes.length}</td></tr></tbody></table>
          <h3>EQUIPE / JORNADA</h3>
          <table className="rdo-document-table"><thead><tr><th>FUNCIONÁRIO</th><th>HORÁRIO</th><th>HH</th></tr></thead><tbody>{rdo.equipes.map(member => <tr key={member.id}><td>{member.funcionario}</td><td>{member.horaInicio}–{member.horaFim}</td><td>{member.horasTrabalhadas}</td></tr>)}{!rdo.equipes.length && <tr><td colSpan={3}>—</td></tr>}</tbody></table>
          <h3>EQUIPAMENTOS</h3>
          <table className="rdo-document-table"><thead><tr><th>EQUIPAMENTO</th><th>HORAS</th></tr></thead><tbody>{rdo.equipamentos?.length ? rdo.equipamentos.map(item => <tr key={item.id}><td>{item.nome}</td><td>{item.horasUsadas}</td></tr>) : <tr><td colSpan={2}>Nenhum equipamento registrado.</td></tr>}</tbody></table>
          <h3>RESUMO DE HORAS</h3>
          <table className="rdo-document-table"><tbody><tr><th>HH PREVISTO</th><td>{rdo.hh_previsto_dia} h</td></tr><tr><th>HH EXECUTADO</th><td>{rdo.hh_executado_total} h</td></tr><tr><th>CUSTO REALIZADO</th><td>{rdo.custo_hh_realizado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td></tr></tbody></table>
        </div>
      </div>
      <h2>COMENTÁRIOS GERAIS / OBSERVAÇÕES DA CONTRATADA</h2>
      <div className="rdo-document-text rdo-document-comments">{rdo.observacoes || 'Nenhuma observação registrada.'}</div>
      {rdo.materiais?.length ? <><h3>MATERIAIS UTILIZADOS</h3><table className="rdo-document-table"><thead><tr><th>MATERIAL</th><th>QUANTIDADE</th><th>UNIDADE</th></tr></thead><tbody>{rdo.materiais.map(item => <tr key={item.id}><td>{item.nome}</td><td>{item.quantidade_usada}</td><td>{item.unidade}</td></tr>)}</tbody></table></> : null}
      {signatures}
    </div>
    {photoPages.map((page, index) => <div className="rdo-document-sheet rdo-document-photo-sheet" key={index}>
      {header(index + 2)}
      <h2>REGISTRO FOTOGRÁFICO — PRINCIPAIS ATIVIDADES</h2>
      <div className="rdo-document-photos">{page.map(photo => <figure key={photo.id}><div className="rdo-document-photo"><img src={photo.url} alt={photo.descricao || 'Registro fotográfico da obra'} onError={event => { event.currentTarget.style.display = 'none'; }} /></div><figcaption>{photo.descricao || 'Registro fotográfico'}<span>{photo.timestamp ? new Date(photo.timestamp).toLocaleDateString('pt-BR') : ''}</span></figcaption></figure>)}</div>
      {signatures}
    </div>)}
  </article>;
}