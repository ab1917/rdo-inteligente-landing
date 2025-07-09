import React from 'react';
import { Upload, Download, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { funcionariosData } from '@/services/mockData';
import type { Funcionario } from '@/types';

interface ImportResult {
  linha: number;
  dados: any;
  status: 'sucesso' | 'erro' | 'aviso';
  mensagens: string[];
}

interface FuncionarioImportProps {
  onClose: () => void;
}

export function FuncionarioImport({ onClose }: FuncionarioImportProps) {
  const { toast } = useToast();
  const [arquivo, setArquivo] = React.useState<File | null>(null);
  const [dadosPreview, setDadosPreview] = React.useState<any[]>([]);
  const [resultados, setResultados] = React.useState<ImportResult[]>([]);
  const [etapa, setEtapa] = React.useState<'upload' | 'preview' | 'processando' | 'finalizado'>('upload');
  const [progresso, setProgresso] = React.useState(0);

  const templateColumns = [
    'nome', 'cpf', 'telefone', 'email', 'cargo', 'salario', 
    'dataAdmissao', 'status', 'especialidades', 'valor_hora'
  ];

  const downloadTemplate = () => {
    const csvContent = [
      templateColumns.join(','),
      'João Silva,123.456.789-00,(11) 99999-9999,joao@email.com,Soldador,3500,2024-01-15,ativo,"Soldador,NR-10",25.50',
      'Maria Santos,987.654.321-00,(11) 88888-8888,maria@email.com,Técnico,4200,2024-02-01,ativo,"Eletricista,NR-12",30.00'
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template_funcionarios.csv';
    link.click();
  };

  const parseCSV = (text: string): any[] => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    return lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const obj: any = { linha: index + 2 };
      
      headers.forEach((header, i) => {
        obj[header] = values[i] || '';
      });
      
      return obj;
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setArquivo(file);
    
    try {
      const text = await file.text();
      const dados = parseCSV(text);
      setDadosPreview(dados);
      setEtapa('preview');
    } catch (error) {
      toast({
        title: 'Erro ao ler arquivo',
        description: 'Verifique se o arquivo está no formato CSV correto.',
        variant: 'destructive',
      });
    }
  };

  const validarDados = (dados: any): ImportResult => {
    const erros: string[] = [];
    const avisos: string[] = [];

    // Validações obrigatórias
    if (!dados.nome || dados.nome.length < 2) {
      erros.push('Nome é obrigatório (mín. 2 caracteres)');
    }

    if (!dados.cpf || !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(dados.cpf)) {
      erros.push('CPF inválido (formato: 000.000.000-00)');
    }

    if (!dados.telefone || dados.telefone.length < 10) {
      erros.push('Telefone inválido');
    }

    if (!dados.cargo) {
      erros.push('Cargo é obrigatório');
    }

    if (!dados.dataAdmissao || isNaN(Date.parse(dados.dataAdmissao))) {
      erros.push('Data de admissão inválida');
    }

    if (!dados.status || !['ativo', 'inativo'].includes(dados.status.toLowerCase())) {
      erros.push('Status deve ser "ativo" ou "inativo"');
    }

    // Validações opcionais com avisos
    if (dados.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) {
      avisos.push('Email inválido');
    }

    if (dados.salario && (isNaN(parseFloat(dados.salario)) || parseFloat(dados.salario) < 0)) {
      avisos.push('Salário inválido');
    }

    if (dados.valor_hora && (isNaN(parseFloat(dados.valor_hora)) || parseFloat(dados.valor_hora) < 0)) {
      avisos.push('Valor/hora inválido');
    }

    // Verificar CPF duplicado
    const cpfExiste = funcionariosData.some(f => f.cpf === dados.cpf);
    if (cpfExiste) {
      erros.push('CPF já cadastrado no sistema');
    }

    return {
      linha: dados.linha,
      dados,
      status: erros.length > 0 ? 'erro' : avisos.length > 0 ? 'aviso' : 'sucesso',
      mensagens: [...erros, ...avisos]
    };
  };

  const processarImportacao = async () => {
    setEtapa('processando');
    setProgresso(0);

    const resultados: ImportResult[] = [];

    for (let i = 0; i < dadosPreview.length; i++) {
      const resultado = validarDados(dadosPreview[i]);
      resultados.push(resultado);

      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 100));
      setProgresso(((i + 1) / dadosPreview.length) * 100);
    }

    // Salvar funcionários válidos
    const funcionariosValidos = resultados
      .filter(r => r.status === 'sucesso' || r.status === 'aviso')
      .map(r => {
        const dados = r.dados;
        const especialidades = dados.especialidades ? 
          dados.especialidades.split(',').map((e: string) => e.trim()) : [];

        return {
          id: `func-${Date.now()}-${Math.random()}`,
          nome: dados.nome,
          cpf: dados.cpf,
          telefone: dados.telefone,
          email: dados.email || undefined,
          status: dados.status.toLowerCase(),
          dataAdmissao: dados.dataAdmissao,
          cargo: dados.cargo,
          salario: dados.salario ? parseFloat(dados.salario) : undefined,
          especialidades,
          certificacoes: [],
          valor_hora: dados.valor_hora ? parseFloat(dados.valor_hora) : undefined,
        } as Funcionario;
      });

    // Adicionar ao mock
    funcionariosData.push(...funcionariosValidos);

    setResultados(resultados);
    setEtapa('finalizado');

    const sucessos = resultados.filter(r => r.status === 'sucesso' || r.status === 'aviso').length;
    const erros = resultados.filter(r => r.status === 'erro').length;

    toast({
      title: 'Importação concluída',
      description: `${sucessos} funcionários importados, ${erros} erros encontrados.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sucesso': return 'bg-green-100 text-green-800 border-green-200';
      case 'aviso': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'erro': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sucesso': return <CheckCircle className="h-4 w-4" />;
      case 'aviso': return <AlertCircle className="h-4 w-4" />;
      case 'erro': return <X className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Importação de Funcionários</h2>
          <p className="text-muted-foreground">
            Importe funcionários em lote usando arquivo CSV
          </p>
        </div>
        <Button variant="outline" onClick={downloadTemplate}>
          <Download className="mr-2 h-4 w-4" />
          Download Template
        </Button>
      </div>

      {/* Etapa 1: Upload */}
      {etapa === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Selecionar Arquivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  Faça o download do template CSV e preencha com os dados dos funcionários.
                  Certifique-se de seguir o formato correto para evitar erros.
                </AlertDescription>
              </Alert>

              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium">Clique para selecionar arquivo CSV</p>
                  <p className="text-sm text-muted-foreground">
                    Ou arraste e solte o arquivo aqui
                  </p>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Etapa 2: Preview */}
      {etapa === 'preview' && (
        <Card>
          <CardHeader>
            <CardTitle>Preview dos Dados</CardTitle>
            <p className="text-sm text-muted-foreground">
              {dadosPreview.length} funcionários encontrados. Revise os dados antes de importar.
            </p>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96 w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Linha</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Especialidades</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dadosPreview.map((dados, index) => (
                    <TableRow key={index}>
                      <TableCell>{dados.linha}</TableCell>
                      <TableCell>{dados.nome}</TableCell>
                      <TableCell>{dados.cpf}</TableCell>
                      <TableCell>{dados.cargo}</TableCell>
                      <TableCell>{dados.status}</TableCell>
                      <TableCell>{dados.especialidades}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>

            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setEtapa('upload')}>
                Voltar
              </Button>
              <Button onClick={processarImportacao}>
                Processar Importação
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Etapa 3: Processando */}
      {etapa === 'processando' && (
        <Card>
          <CardHeader>
            <CardTitle>Processando Importação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={progresso} className="w-full" />
              <p className="text-center text-sm text-muted-foreground">
                Processando {Math.round(progresso)}%...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Etapa 4: Resultados */}
      {etapa === 'finalizado' && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados da Importação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Resumo */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {resultados.filter(r => r.status === 'sucesso').length}
                  </div>
                  <div className="text-sm text-green-600">Sucessos</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {resultados.filter(r => r.status === 'aviso').length}
                  </div>
                  <div className="text-sm text-yellow-600">Avisos</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {resultados.filter(r => r.status === 'erro').length}
                  </div>
                  <div className="text-sm text-red-600">Erros</div>
                </div>
              </div>

              {/* Detalhes */}
              <ScrollArea className="h-64 w-full">
                <div className="space-y-2">
                  {resultados.map((resultado, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <Badge className={`${getStatusColor(resultado.status)} flex items-center gap-1`}>
                        {getStatusIcon(resultado.status)}
                        Linha {resultado.linha}
                      </Badge>
                      <div className="flex-1">
                        <p className="font-medium">{resultado.dados.nome}</p>
                        {resultado.mensagens.length > 0 && (
                          <ul className="text-sm text-muted-foreground mt-1">
                            {resultado.mensagens.map((msg, i) => (
                              <li key={i}>• {msg}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setEtapa('upload')}>
                  Nova Importação
                </Button>
                <Button onClick={onClose}>
                  Concluir
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}