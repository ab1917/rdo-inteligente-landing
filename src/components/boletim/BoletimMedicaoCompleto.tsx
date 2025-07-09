import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Wrench, Package, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { BoletimMedicao } from '@/types';

interface BoletimMedicaoCompletoProps {
  boletim: BoletimMedicao;
  onAprovar?: () => void;
  readOnly?: boolean;
}

export function BoletimMedicaoCompleto({ boletim, onAprovar, readOnly = false }: BoletimMedicaoCompletoProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (status: BoletimMedicao['status']) => {
    const variants = {
      rascunho: 'default' as const,
      aprovado: 'success' as const,
      faturado: 'secondary' as const
    };
    
    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Boletim de Medição
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Data: {new Date(boletim.data).toLocaleDateString('pt-BR')} | RDO: {boletim.rdo_id}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(boletim.status)}
              {!readOnly && boletim.status === 'rascunho' && onAprovar && (
                <Button onClick={onAprovar} size="sm">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Aprovar
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{formatCurrency(boletim.resumo_financeiro.total_funcionarios)}</div>
              <p className="text-sm text-muted-foreground">Funcionários</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Wrench className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold">{formatCurrency(boletim.resumo_financeiro.total_equipamentos)}</div>
              <p className="text-sm text-muted-foreground">Equipamentos</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Package className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{formatCurrency(boletim.resumo_financeiro.total_materiais)}</div>
              <p className="text-sm text-muted-foreground">Materiais</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold">{formatCurrency(boletim.resumo_financeiro.total_geral)}</div>
              <p className="text-sm text-muted-foreground">Total Geral</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabelas Detalhadas */}
      <Tabs defaultValue="funcionarios" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="funcionarios" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Funcionários
          </TabsTrigger>
          <TabsTrigger value="equipamentos" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Equipamentos
          </TabsTrigger>
          <TabsTrigger value="materiais" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Materiais
          </TabsTrigger>
        </TabsList>

        <TabsContent value="funcionarios">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Detalhamento de Horas por Funcionário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Funcionário</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead className="text-center">HH Normais</TableHead>
                    <TableHead className="text-center">HE 60%</TableHead>
                    <TableHead className="text-center">HE 100%</TableHead>
                    <TableHead className="text-center">HH Noturnas</TableHead>
                    <TableHead className="text-center">Dom/Feriado</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {boletim.funcionarios.map((funcionario) => (
                    <TableRow key={funcionario.funcionario_id}>
                      <TableCell className="font-medium">{funcionario.funcionario_nome}</TableCell>
                      <TableCell>{funcionario.cargo}</TableCell>
                      <TableCell className="text-center">
                        <div>
                          <div className="font-medium">{funcionario.hh_normais.toFixed(1)}h</div>
                          <div className="text-xs text-muted-foreground">{formatCurrency(funcionario.valor_hh_normais)}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div>
                          <div className="font-medium">{funcionario.hh_extras_60.toFixed(1)}h</div>
                          <div className="text-xs text-muted-foreground">{formatCurrency(funcionario.valor_hh_extras_60)}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div>
                          <div className="font-medium">{funcionario.hh_extras_100.toFixed(1)}h</div>
                          <div className="text-xs text-muted-foreground">{formatCurrency(funcionario.valor_hh_extras_100)}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div>
                          <div className="font-medium">{funcionario.hh_noturnas.toFixed(1)}h</div>
                          <div className="text-xs text-muted-foreground">{formatCurrency(funcionario.valor_hh_noturnas)}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div>
                          <div className="font-medium">{funcionario.hh_domingo_feriado.toFixed(1)}h</div>
                          <div className="text-xs text-muted-foreground">{formatCurrency(funcionario.valor_hh_domingo_feriado)}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(funcionario.valor_total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipamentos">
          <Card>
            <CardHeader>
              <CardTitle>Equipamentos Utilizados</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipamento</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-center">Horas</TableHead>
                    <TableHead className="text-center">Valor/Hora</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {boletim.equipamentos.map((equipamento) => (
                    <TableRow key={equipamento.equipamento_id}>
                      <TableCell className="font-medium">{equipamento.equipamento_nome}</TableCell>
                      <TableCell>{equipamento.categoria}</TableCell>
                      <TableCell className="text-center">{equipamento.horas_utilizadas.toFixed(1)}h</TableCell>
                      <TableCell className="text-center">{formatCurrency(equipamento.valor_hora)}</TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(equipamento.valor_total)}</TableCell>
                    </TableRow>
                  ))}
                  {boletim.equipamentos.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        Nenhum equipamento utilizado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materiais">
          <Card>
            <CardHeader>
              <CardTitle>Materiais Consumidos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-center">Quantidade</TableHead>
                    <TableHead className="text-center">Unidade</TableHead>
                    <TableHead className="text-center">Valor Unit.</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {boletim.materiais.map((material) => (
                    <TableRow key={material.material_id}>
                      <TableCell className="font-medium">{material.material_nome}</TableCell>
                      <TableCell>{material.categoria}</TableCell>
                      <TableCell className="text-center">{material.quantidade_utilizada}</TableCell>
                      <TableCell className="text-center">{material.unidade}</TableCell>
                      <TableCell className="text-center">{formatCurrency(material.valor_unitario)}</TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(material.valor_total)}</TableCell>
                    </TableRow>
                  ))}
                  {boletim.materiais.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        Nenhum material consumido
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Resumo por Tipo de HH */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo por Tipo de Hora</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="font-bold text-blue-700">{formatCurrency(boletim.resumo_financeiro.total_hh_normais)}</div>
              <div className="text-blue-600">HH Normais</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="font-bold text-orange-700">{formatCurrency(boletim.resumo_financeiro.total_hh_extras_60)}</div>
              <div className="text-orange-600">HE 60%</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="font-bold text-red-700">{formatCurrency(boletim.resumo_financeiro.total_hh_extras_100)}</div>
              <div className="text-red-600">HE 100%</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="font-bold text-purple-700">{formatCurrency(boletim.resumo_financeiro.total_hh_noturnas)}</div>
              <div className="text-purple-600">HH Noturnas</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="font-bold text-green-700">{formatCurrency(boletim.resumo_financeiro.total_hh_domingo_feriado)}</div>
              <div className="text-green-600">Dom/Feriado</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}