import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Filter, Phone, Mail, ArrowRight } from "lucide-react";

const LeadsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const leads = [
    {
      id: 1,
      nome: "Construtora Horizonte",
      contato: "Roberto Silva",
      email: "roberto@horizonte.com.br",
      telefone: "(11) 99999-0001",
      origem: "Site",
      status: "Novo",
      valor_estimado: "R$ 500.000",
      segmento: "Construção Civil",
      data_criacao: "2024-01-08",
      observacoes: "Interessado em sistema de ventilação industrial"
    },
    {
      id: 2, 
      nome: "Indústria Metalúrgica ABC",
      contato: "Ana Costa",
      email: "ana@abc.ind.br",
      telefone: "(11) 99999-0002",
      origem: "Indicação",
      status: "Qualificado",
      valor_estimado: "R$ 750.000",
      segmento: "Indústria",
      data_criacao: "2024-01-05",
      observacoes: "Manutenção preventiva em equipamentos"
    },
    {
      id: 3,
      nome: "Fábrica de Alimentos XYZ",
      contato: "Carlos Mendes", 
      email: "carlos@xyz.com.br",
      telefone: "(11) 99999-0003",
      origem: "Google Ads",
      status: "Contactado",
      valor_estimado: "R$ 320.000",
      segmento: "Indústria Alimentícia",
      data_criacao: "2024-01-07",
      observacoes: "Reforma da área de produção"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Novo": return "bg-blue-100 text-blue-800";
      case "Contactado": return "bg-yellow-100 text-yellow-800";
      case "Qualificado": return "bg-green-100 text-green-800";
      case "Perdido": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleConvertToOpportunity = (leadId: number) => {
    console.log("Converting lead to opportunity:", leadId);
    // Implementar lógica de conversão
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.contato.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leads</h1>
          <p className="text-muted-foreground">
            Gestão de leads e prospecção comercial
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Lead</DialogTitle>
              <DialogDescription>
                Preencha as informações do novo lead para iniciar o processo comercial
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Empresa</Label>
                <Input id="nome" placeholder="Ex: Construtora ABC" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contato">Pessoa de Contato</Label>
                <Input id="contato" placeholder="Ex: João Silva" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="joao@empresa.com.br" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" placeholder="(11) 99999-9999" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="segmento">Segmento</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o segmento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="construcao">Construção Civil</SelectItem>
                    <SelectItem value="industria">Indústria</SelectItem>
                    <SelectItem value="manutencao">Manutenção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="origem">Origem</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Como chegou até nós?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="site">Site</SelectItem>
                    <SelectItem value="indicacao">Indicação</SelectItem>
                    <SelectItem value="google">Google Ads</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea id="observacoes" placeholder="Descreva o interesse ou necessidade do cliente..." />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>
                Salvar Lead
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por empresa ou contato..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="Novo">Novo</SelectItem>
                <SelectItem value="Contactado">Contactado</SelectItem>
                <SelectItem value="Qualificado">Qualificado</SelectItem>
                <SelectItem value="Perdido">Perdido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Leads */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Leads ({filteredLeads.length})</CardTitle>
          <CardDescription>
            Leads capturados aguardando qualificação e conversão
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valor Estimado</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{lead.nome}</p>
                      <p className="text-sm text-muted-foreground">{lead.segmento}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{lead.contato}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {lead.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {lead.telefone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{lead.origem}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(lead.status)}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {lead.valor_estimado}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(lead.data_criacao).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Editar
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleConvertToOpportunity(lead.id)}
                        disabled={lead.status === "Perdido"}
                      >
                        <ArrowRight className="h-4 w-4 mr-1" />
                        Converter
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadsList;