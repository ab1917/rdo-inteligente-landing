import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCommercialData } from '@/hooks/useCommercialData';
import { toast } from '@/hooks/use-toast';
export function CommercialRecordDialog({ entity, opportunityId }: { entity:'clientes'|'orcamentos'; opportunityId?:string }) {
 const [open,setOpen]=useState(false),[saving,setSaving]=useState(false),[client,setClient]=useState(''),[kind,setKind]=useState('obra_civil');
 const {mutate,clientes,oportunidades}=useCommercialData();
 const opportunity=oportunidades.find(v=>v.id===opportunityId);
 const submit=async(e:React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault();const values=new FormData(e.currentTarget),get=(key:string)=>String(values.get(key)??'').trim();const today=new Date().toISOString().slice(0,10);
  let document:Record<string,unknown>;
  if(entity==='clientes') document={nome:get('nome'),tipo:'pessoa_juridica',cpf_cnpj:get('documento'),email:get('email'),telefone:get('telefone'),endereco:get('endereco'),cidade:get('cidade'),estado:get('estado'),cep:get('cep'),data_cadastro:today,responsavel_comercial:get('responsavel'),status:'ativo',total_contratos:0,valor_total_historico:0,margem_media:0,tempo_medio_pagamento:0};
  else {
   const selected=clientes.find(c=>c.id===client);
   if(!selected){toast({title:'Selecione um cliente cadastrado',variant:'destructive'});return;}
   const value=Number(get('valor')),deadline=Number(get('prazo'));
   document={id_oportunidade:opportunityId??'',id_cliente:selected.id,nome_cliente:selected.nome,nome_projeto:get('nome'),endereco_execucao:get('endereco'),tipo:kind,composicoes:[],hh_previsto_total:0,valor_hh_medio:0,valor_total:value,status:'em_elaboracao',data_criacao:today,prazo_execucao_dias:deadline,inicio_previsto:get('inicio'),fim_previsto:get('fim'),margem_lucro_prevista:Number(get('margem')),forma_pagamento:get('pagamento'),validade_proposta:get('validade'),aprovado_comercial:false,aprovado_tecnico:false,virou_contrato:false};
  }
  setSaving(true);try{await mutate({action:'save',entity,id:crypto.randomUUID(),document});toast({title:entity==='clientes'?'Cliente salvo':'Orçamento salvo'});setOpen(false);}catch(error){toast({title:'Não foi possível salvar',description:error instanceof Error?error.message:'Confira os dados.',variant:'destructive'});}finally{setSaving(false);}
 };
 const field=(name:string,label:string,type='text',defaultValue?:string)=> <div className="space-y-2"><Label htmlFor={`${entity}-${name}`}>{label}</Label><Input id={`${entity}-${name}`} name={name} type={type} required defaultValue={defaultValue} min={type==='number'?0:undefined} step={type==='number'?'any':undefined}/></div>;
 return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button variant={opportunityId?'outline':'default'}><Plus className="mr-2 h-4 w-4"/>{entity==='clientes'?'Novo Cliente':'Novo Orçamento'}</Button></DialogTrigger><DialogContent className="max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>{entity==='clientes'?'Cadastrar Cliente':'Cadastrar Orçamento'}</DialogTitle></DialogHeader><form onSubmit={submit} className="space-y-4">
 {field('nome',entity==='clientes'?'Nome do cliente':'Nome da obra / projeto','text',opportunity?.nome_projeto)}
 {entity==='clientes'?<><div className="grid grid-cols-2 gap-4">{field('documento','CPF / CNPJ')}{field('email','E-mail','email')}{field('telefone','Telefone')}{field('responsavel','Responsável comercial')}</div>{field('endereco','Endereço')}<div className="grid grid-cols-3 gap-4">{field('cidade','Cidade')}{field('estado','UF')}{field('cep','CEP')}</div></>:<><div className="space-y-2"><Label>Cliente</Label><Select value={client} onValueChange={setClient}><SelectTrigger aria-label="Cliente do orçamento"><SelectValue placeholder="Selecione o cliente"/></SelectTrigger><SelectContent>{clientes.map(c=><SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label>Tipo</Label><Select value={kind} onValueChange={setKind}><SelectTrigger aria-label="Tipo de orçamento"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="obra_civil">Obra civil</SelectItem><SelectItem value="manutencao_industrial">Manutenção industrial</SelectItem></SelectContent></Select></div>{field('endereco','Endereço de execução')}<div className="grid grid-cols-2 gap-4">{field('valor','Valor contratado (R$)','number',opportunity?.valor_estimado.toString())}{field('margem','Margem prevista (%)','number')}{field('prazo','Prazo (dias)','number')}{field('validade','Validade da proposta','date')}{field('inicio','Início previsto','date')}{field('fim','Fim previsto','date')}</div>{field('pagamento','Condições de pagamento')}</>}
 <Button type="submit" disabled={saving} className="w-full">{saving?'Salvando...':'Salvar'}</Button></form></DialogContent></Dialog>;
}
