import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FuncionarioForm } from './FuncionarioForm';
import { funcionariosData } from '@/services/mockData';
import type { Funcionario } from '@/types';

interface CreateFuncionarioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateFuncionarioDialog({ open, onOpenChange }: CreateFuncionarioDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const novoFuncionario: Funcionario = {
      id: `func-${Date.now()}`,
      nome: data.nome,
      cpf: data.cpf,
      telefone: data.telefone,
      email: data.email || undefined,
      status: data.status,
      dataAdmissao: data.dataAdmissao.toISOString().split('T')[0],
      cargo: data.cargo,
      salario: data.salario,
      especialidades: data.especialidades,
      certificacoes: [],
      valor_hora: data.valor_hora,
      jornada_normal_dia: 8,
      limite_he_semanal: 10,
      horario_noturno_inicio: "22:00",
      horario_noturno_fim: "05:00",
      percentual_he_60: 1.6,
      percentual_he_100: 2.0,
      adicional_noturno: 0.25,
    };

    // Adicionar ao mock (em uma aplicação real, seria uma chamada à API)
    funcionariosData.push(novoFuncionario);
    
    setIsLoading(false);
    onOpenChange(false);
    
    // Forçar atualização da página
    window.location.reload();
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Funcionário</DialogTitle>
        </DialogHeader>
        
        <FuncionarioForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}