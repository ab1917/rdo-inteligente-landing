CREATE TABLE IF NOT EXISTS public.commercial_documents (
 record_id uuid PRIMARY KEY, company_id uuid NOT NULL REFERENCES public.companies(id),
 entity text NOT NULL CHECK(entity IN ('leads','clientes','oportunidades','orcamentos','contratos')),
 document jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.commercial_documents TO CURRENT_USER;
ALTER TABLE public.commercial_documents ENABLE ROW LEVEL SECURITY;
CREATE TABLE IF NOT EXISTS public.bulletin_documents (
 bulletin_id uuid PRIMARY KEY REFERENCES public.boletins_medicao(id), company_id uuid NOT NULL REFERENCES public.companies(id),
 contract_id uuid REFERENCES public.commercial_documents(record_id), document jsonb NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bulletin_documents TO CURRENT_USER;
ALTER TABLE public.bulletin_documents ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS commercial_documents_company ON public.commercial_documents(company_id,record_id);
CREATE INDEX IF NOT EXISTS bulletin_documents_company ON public.bulletin_documents(company_id,bulletin_id);
CREATE UNIQUE INDEX IF NOT EXISTS one_contract_per_budget ON public.commercial_documents(company_id,(document->>'id_orcamento')) WHERE entity='contratos' AND coalesce(document->>'id_orcamento','')<>'';
CREATE UNIQUE INDEX IF NOT EXISTS one_opportunity_per_lead ON public.commercial_documents(company_id,(document->>'id_lead')) WHERE entity='oportunidades' AND coalesce(document->>'id_lead','')<>'';
CREATE OR REPLACE FUNCTION public.save_scope_bulletin(p_company uuid, p_contract uuid, p_id uuid, p_start date, p_end date, p_current numeric, p_notes text, p_author text)
RETURNS jsonb LANGUAGE plpgsql SET search_path=public AS $$
DECLARE c jsonb; previous numeric; total numeric; period_value numeric; cumulative numeric; work uuid; result jsonb;
BEGIN
 SELECT document INTO c FROM public.commercial_documents WHERE record_id=p_contract AND company_id=p_company AND entity='contratos' FOR UPDATE;
 IF c IS NULL OR c->>'status'<>'ativo' OR c->>'tipo_execucao'<>'escopo' THEN RAISE EXCEPTION 'Contrato de escopo fechado ativo não encontrado.' USING ERRCODE='22023'; END IF;
 SELECT document INTO result FROM public.bulletin_documents WHERE bulletin_id=p_id AND company_id=p_company;
 IF result IS NOT NULL THEN RETURN result; END IF;
 IF EXISTS(SELECT 1 FROM public.bulletin_documents WHERE company_id=p_company AND contract_id=p_contract AND document->>'tipo_medicao'='escopo_fechado' AND document->>'status'='rascunho') THEN RAISE EXCEPTION 'Aprove a medição em rascunho antes de registrar novo avanço.' USING ERRCODE='22023'; END IF;
 SELECT coalesce(max((document->'medicao_escopo'->>'percentual_acumulado')::numeric),0) INTO previous FROM public.bulletin_documents WHERE company_id=p_company AND contract_id=p_contract AND document->>'tipo_medicao'='escopo_fechado' AND document->>'status' IN ('aprovado','faturado');
 IF p_current IS NULL OR p_current<=previous OR p_current>100 OR p_start>p_end OR length(trim(p_notes))=0 THEN RAISE EXCEPTION 'Confira avanço, período e descrição da entrega.' USING ERRCODE='22023'; END IF;
 IF EXISTS(SELECT 1 FROM public.bulletin_documents WHERE company_id=p_company AND contract_id=p_contract AND document->>'tipo_medicao'='escopo_fechado' AND (document->>'data_fim')::date >= p_start) THEN RAISE EXCEPTION 'Período sobreposto a uma medição existente.' USING ERRCODE='22023'; END IF;
 total := (c->>'valor_fechado')::numeric;
 cumulative := round(total*p_current/100,2); period_value := cumulative-round(total*previous/100,2);
 SELECT o.id INTO work FROM public.obras o JOIN public.funcionarios f ON f.id=o.responsavel_tecnico_id WHERE f.company_id=p_company AND o.nome=c->>'nome_projeto' LIMIT 1;
 IF work IS NULL THEN INSERT INTO public.obras(nome,cliente,endereco,valor_contrato) VALUES(c->>'nome_projeto',c->>'nome_cliente',c->>'endereco_execucao',total) RETURNING id INTO work; END IF;
 result := jsonb_build_object('id',p_id,'id_contrato',p_contract,'tipo_medicao','escopo_fechado','obra_nome',c->>'nome_projeto','data',p_start,'data_inicio',p_start,'data_fim',p_end,'rdo_id','','funcionarios','[]'::jsonb,'equipamentos','[]'::jsonb,'materiais','[]'::jsonb,'status','rascunho','criado_em',now(),'descricao_entrega',p_notes,
 'medicao_escopo',jsonb_build_object('valor_contrato',total,'percentual_anterior',previous,'percentual_acumulado',p_current,'percentual_periodo',p_current-previous,'valor_anterior',round(total*previous/100,2),'valor_periodo',period_value,'valor_acumulado',cumulative,'saldo_contrato',total-cumulative),
 'resumo_financeiro',jsonb_build_object('total_funcionarios',0,'total_equipamentos',0,'total_materiais',0,'total_geral',period_value,'total_hh_normais',0,'total_hh_extras_60',0,'total_hh_extras_100',0,'total_hh_noturnas',0,'total_hh_domingo_feriado',0));
 INSERT INTO public.boletins_medicao(id,obra_id,periodo_inicio,periodo_fim,responsavel_medicao,valor_total_periodo,valor_acumulado,percentual_fisico_periodo,percentual_fisico_acumulado,observacoes,status) VALUES(p_id,work,p_start,p_end,p_author,period_value,cumulative,p_current-previous,p_current,p_notes,'rascunho');
 INSERT INTO public.bulletin_documents(bulletin_id,company_id,contract_id,document) VALUES(p_id,p_company,p_contract,result);
 RETURN result;
END $$;
REVOKE ALL ON FUNCTION public.save_scope_bulletin(uuid,uuid,uuid,date,date,numeric,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.save_scope_bulletin(uuid,uuid,uuid,date,date,numeric,text,text) TO CURRENT_USER;
CREATE OR REPLACE FUNCTION public.transition_bulletin(p_company uuid,p_id uuid,p_status text,p_author text)
RETURNS jsonb LANGUAGE plpgsql SET search_path=public AS $$
DECLARE b jsonb; contract uuid; prior numeric;
BEGIN
 SELECT contract_id INTO contract FROM public.bulletin_documents WHERE company_id=p_company AND bulletin_id=p_id;
 IF contract IS NOT NULL THEN PERFORM 1 FROM public.commercial_documents WHERE record_id=contract AND company_id=p_company FOR UPDATE; END IF;
 SELECT document INTO b FROM public.bulletin_documents WHERE company_id=p_company AND bulletin_id=p_id FOR UPDATE;
 IF b IS NULL THEN RAISE EXCEPTION 'Boletim não encontrado.' USING ERRCODE='22023'; END IF;
 IF b->>'status'=p_status THEN RETURN b; END IF;
 IF NOT ((b->>'status'='rascunho' AND p_status='aprovado') OR (b->>'status'='aprovado' AND p_status='faturado')) THEN RAISE EXCEPTION 'Transição de status inválida.' USING ERRCODE='22023'; END IF;
 IF b->>'tipo_medicao'='escopo_fechado' AND p_status='aprovado' THEN
  SELECT coalesce(max((document->'medicao_escopo'->>'percentual_acumulado')::numeric),0) INTO prior FROM public.bulletin_documents WHERE company_id=p_company AND contract_id=contract AND document->>'status' IN ('aprovado','faturado') AND document->>'tipo_medicao'='escopo_fechado';
  IF prior<>(b->'medicao_escopo'->>'percentual_anterior')::numeric THEN RAISE EXCEPTION 'A base de avanço mudou; revise a medição.' USING ERRCODE='22023'; END IF;
 END IF;
 b := b || jsonb_build_object('status',p_status);
 IF p_status='aprovado' THEN b := b || jsonb_build_object('aprovado_por',p_author,'aprovado_em',now()); ELSE b := b || jsonb_build_object('faturado_em',now()); END IF;
 UPDATE public.bulletin_documents SET document=b,updated_at=now() WHERE company_id=p_company AND bulletin_id=p_id;
 UPDATE public.boletins_medicao SET status=p_status,responsavel_aprovacao=p_author,data_aprovacao=coalesce(data_aprovacao,current_date),updated_at=now() WHERE id=p_id;
 RETURN b;
END $$;
REVOKE ALL ON FUNCTION public.transition_bulletin(uuid,uuid,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.transition_bulletin(uuid,uuid,text,text) TO CURRENT_USER;
