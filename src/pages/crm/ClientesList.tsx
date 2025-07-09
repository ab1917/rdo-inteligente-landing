import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, Phone, Mail, MapPin, Calendar, DollarSign, FileText, Plus, Search, Filter } from "lucide-react";

const ClientesList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [segmentoFilter, setSegmentoFilter] = useState("all");

  const clientes = [
    {
      id: 1,
      nome: "Construtora Horizonte",
      cnpj: "12.345.678/0001-90",
      segmento: "Construção Civil",
      contato_principal: "Roberto Silva",
      email: "roberto@horizonte.com.br",
      telefone: "(11) 99999-0001",
      endereco: "Av. Paulista, 1000 - São Paulo/SP",
      data_cadastro: "2023-05-15",
      ultimo_contato: "2024-01-08",
      status: "Ativo",
      valor_total_projetos: 1200000,
      projetos_concluidos: 3,
      historico: [
        { data: "2024-01-08", tipo: "Reunião", descricao: "Reunião para novo projeto" },
        { data: "2023-12-15", tipo: "Proposta", descricao: "Proposta enviada para reforma" },
        { data: "2023-11-20", tipo: "Projeto", descricao: "Conclusão do projeto A" }
      ]
    },
    {
      id: 2,
      nome: "Indústria Metalúrgica ABC",
      cnpj: "23.456.789/0001-01",
      segmento: "Indústria",
      contato_principal: "Ana Costa",
      email: "ana@abc.ind.br",
      telefone: "(11) 99999-0002",
      endereco: "Rua Industrial, 500 - São Bernardo/SP",
      data_cadastro: "2023-03-20",
      ultimo_contato: "2024-01-05",
      status: "Ativo",
      valor_total_projetos: 2800000,
      projetos_concluidos: 5,
      historico: [
        { data: "2024-01-05", tipo: "Manutenção", descricao: "Manutenção preventiva mensal" },
        { data: "2023-12-05", tipo: "Manutenção", descricao: "Manutenção preventiva mensal" },
        { data: "2023-11-15", tipo: "Projeto", descricao: "Instalação novo sistema" }
      ]
    },
    {
      id: 3,
      nome: "Fábrica de Alimentos XYZ",
      cnpj: "34.567.890/0001-12",
      segmento: "Indústria Alimentícia",
      contato_principal: "Carlos Mendes",
      email: "carlos@xyz.com.br",
      telefone: "(11) 99999-0003",
      endereco: "Rod. Anhanguera, km 25 - Jundiaí/SP",
      data_cadastro: "2023-08-10",
      ultimo_contato: "2024-01-07",
      status: "Ativo",
      valor_total_projetos: 650000,
      projetos_concluidos: 2,
      historico: [
        { data: "2024-01-07", tipo: "Contato", descricao: "Interesse em nova reforma" },
        { data: "2023-11-30", tipo: "Projeto", descricao: "Finalização da reforma da linha 2" }
      ]
    }
  ];

  const [selectedCliente, setSelectedCliente] = useState(clientes[0]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo": return "bg-green-100 text-green-800";
      case "Inativo": return "bg-red-100 text-red-800";
      case "Prospecto": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredClientes = clientes.filter(cliente => {
    const matchesSearch = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.contato_principal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSegmento = segmentoFilter === "all" || cliente.segmento === segmentoFilter;
    return matchesSearch && matchesSegmento;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Base de Clientes</h1>
          <p className="text-muted-foreground">
            Gestão completa do relacionamento com clientes
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Total Clientes</span>
            </div>
            <p className="text-2xl font-bold">{clientes.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Faturamento Total</span>
            </div>
            <p className="text-2xl font-bold">
              {formatCurrency(clientes.reduce((acc, c) => acc + c.valor_total_projetos, 0))}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Projetos</span>
            </div>
            <p className="text-2xl font-bold">
              {clientes.reduce((acc, c) => acc + c.projetos_concluidos, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Novos este Mês</span>
            </div>
            <p className="text-2xl font-bold">5</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Clientes */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Clientes</CardTitle>
              <CardDescription>
                Lista de todos os clientes cadastrados
              </CardDescription>
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={segmentoFilter} onValueChange={setSegmentoFilter}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Segmentos</SelectItem>
                    <SelectItem value="Construção Civil">Construção Civil</SelectItem>
                    <SelectItem value="Indústria">Indústria</SelectItem>
                    <SelectItem value="Indústria Alimentícia">Indústria Alimentícia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {filteredClientes.map((cliente) => (
                  <div
                    key={cliente.id}
                    onClick={() => setSelectedCliente(cliente)}
                    className={`p-4 cursor-pointer border-b hover:bg-muted/50 transition-colors ${
                      selectedCliente.id === cliente.id ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{cliente.nome}</h4>
                        <Badge className={getStatusColor(cliente.status)}>
                          {cliente.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{cliente.segmento}</p>
                      <p className="text-xs text-muted-foreground">{cliente.contato_principal}</p>
                      <p className="text-xs font-medium">{formatCurrency(cliente.valor_total_projetos)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detalhes do Cliente */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedCliente.nome}</CardTitle>
                  <CardDescription>
                    Cliente desde {new Date(selectedCliente.data_cadastro).toLocaleDateString('pt-BR')}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                  <Button size="sm">
                    Nova Oportunidade
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="informacoes">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="informacoes">Informações</TabsTrigger>
                  <TabsTrigger value="historico">Histórico</TabsTrigger>
                  <TabsTrigger value="projetos">Projetos</TabsTrigger>
                </TabsList>
                
                <TabsContent value="informacoes" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Contato Principal</label>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{selectedCliente.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{selectedCliente.telefone}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">CNPJ</label>
                        <p className="text-sm text-muted-foreground">{selectedCliente.cnpj}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Segmento</label>
                        <p className="text-sm text-muted-foreground">{selectedCliente.segmento}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Endereço</label>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                          <span className="text-sm">{selectedCliente.endereco}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Último Contato</label>
                        <p className="text-sm text-muted-foreground">
                          {new Date(selectedCliente.ultimo_contato).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Status</label>
                        <Badge className={getStatusColor(selectedCliente.status)}>
                          {selectedCliente.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="historico" className="space-y-4">
                  <div className="space-y-3">
                    {selectedCliente.historico.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{item.tipo}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(item.data).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.descricao}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="projetos" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold">{selectedCliente.projetos_concluidos}</p>
                          <p className="text-sm text-muted-foreground">Projetos Concluídos</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold">
                            {formatCurrency(selectedCliente.valor_total_projetos)}
                          </p>
                          <p className="text-sm text-muted-foreground">Faturamento Total</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="text-center text-muted-foreground">
                    <p>Lista detalhada de projetos será implementada na próxima fase</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientesList;