import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from '@/components/ui/table';
import { Alert,AlertDescription } from '@/components/ui/alert';
import { useCRMIntegration } from '@/hooks/useCRMIntegration';
import { CommercialRecordDialog } from '@/components/crm/CommercialRecordDialog';
const money=(v:number)=>v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
export default function ClientesList(){
 const {clientes,contratos,loading,error}=useCRMIntegration();const [search,setSearch]=useState('');
 return <div className="space-y-6"><div className="flex flex-wrap items-center justify-between gap-4"><h1 className="text-3xl font-bold">Base de Clientes</h1><CommercialRecordDialog entity="clientes"/></div><Input aria-label="Buscar cliente" placeholder="Buscar cliente..." value={search} onChange={e=>setSearch(e.target.value)}/>{error?<Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>:loading?<p role="status">Carregando clientes...</p>:<Table><TableHeader><TableRow><TableHead>Cliente</TableHead><TableHead>CPF / CNPJ</TableHead><TableHead>Contato</TableHead><TableHead>Contratos</TableHead><TableHead>Faturado</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{clientes.filter(c=>c.nome.toLowerCase().includes(search.toLowerCase())).map(c=>{const linked=contratos.filter(v=>v.id_cliente===c.id);return <TableRow key={c.id}><TableCell className="font-medium">{c.nome}</TableCell><TableCell>{c.cpf_cnpj}</TableCell><TableCell>{c.email}<br/>{c.telefone}</TableCell><TableCell>{linked.length}</TableCell><TableCell>{money(linked.reduce((s,v)=>s+v.valor_faturado_total,0))}</TableCell><TableCell><Badge variant="outline">{c.status}</Badge></TableCell></TableRow>})}{!clientes.length&&<TableRow><TableCell colSpan={6}>Nenhum cliente cadastrado.</TableCell></TableRow>}</TableBody></Table>}</div>;
}
