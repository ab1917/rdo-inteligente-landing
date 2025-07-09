import { useState, useCallback } from 'react';
import { BoletimMedicao, FuncionarioBoletim, EquipamentoBoletim, MaterialBoletim, ResumoFinanceiro, ClassificacaoHH, RDO, Funcionario } from '@/types';
import { getStorageData, setStorageData } from '@/services/mockData';

export const useBoletimMedicao = () => {
  const [boletins, setBoletins] = useState<BoletimMedicao[]>([]);
  const [loading, setLoading] = useState(false);

  // Classificar horas por tipo
  const classificarHorasTrabalho = useCallback((
    funcionario: Funcionario,
    horaInicio: string,
    horaFim: string,
    data: string
  ): ClassificacaoHH => {
    const inicio = new Date(`${data}T${horaInicio}`);
    const fim = new Date(`${data}T${horaFim}`);
    
    // Se passa da meia-noite, ajustar
    if (fim < inicio) {
      fim.setDate(fim.getDate() + 1);
    }
    
    const totalHoras = (fim.getTime() - inicio.getTime()) / (1000 * 60 * 60);
    const dataObj = new Date(data);
    const ehDomingoFeriado = dataObj.getDay() === 0; // Domingo
    
    let hh_normais = 0;
    let hh_extras_60 = 0;
    let hh_extras_100 = 0;
    let hh_noturnas = 0;

    if (ehDomingoFeriado) {
      // Domingo/feriado: todas as horas são dobradas
      return {
        funcionario_id: funcionario.id,
        hora_inicio: horaInicio,
        hora_fim: horaFim,
        total_horas: totalHoras,
        hh_normais: 0,
        hh_extras_60: 0,
        hh_extras_100: 0,
        hh_noturnas: 0,
        eh_domingo_feriado: true
      };
    }

    // Classificação normal
    if (totalHoras <= funcionario.jornada_normal_dia) {
      hh_normais = totalHoras;
    } else if (totalHoras <= funcionario.jornada_normal_dia + 2) {
      hh_normais = funcionario.jornada_normal_dia;
      hh_extras_60 = totalHoras - funcionario.jornada_normal_dia;
    } else {
      hh_normais = funcionario.jornada_normal_dia;
      hh_extras_60 = 2;
      hh_extras_100 = totalHoras - funcionario.jornada_normal_dia - 2;
    }

    // Calcular adicional noturno (22h às 5h)
    const horasNoturnas = calcularHorasNoturnas(inicio, fim);
    hh_noturnas = horasNoturnas;

    return {
      funcionario_id: funcionario.id,
      hora_inicio: horaInicio,
      hora_fim: horaFim,
      total_horas: totalHoras,
      hh_normais,
      hh_extras_60,
      hh_extras_100,
      hh_noturnas,
      eh_domingo_feriado: false
    };
  }, []);

  // Calcular horas noturnas (22h às 5h)
  const calcularHorasNoturnas = (inicio: Date, fim: Date): number => {
    let horasNoturnas = 0;
    const current = new Date(inicio);
    
    while (current < fim) {
      const hora = current.getHours();
      if (hora >= 22 || hora < 5) {
        horasNoturnas += 1;
      }
      current.setHours(current.getHours() + 1);
    }
    
    return horasNoturnas;
  };

  // Gerar boletim de medição a partir do RDO
  const gerarBoletimDeRDO = useCallback(async (rdo: RDO): Promise<BoletimMedicao> => {
    setLoading(true);

    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock de funcionários com configurações
        const mockFuncionarios: Funcionario[] = getStorageData('funcionarios', []).map((f: any) => ({
          ...f,
          jornada_normal_dia: f.jornada_normal_dia || 8,
          limite_he_semanal: f.limite_he_semanal || 10,
          horario_noturno_inicio: f.horario_noturno_inicio || "22:00",
          horario_noturno_fim: f.horario_noturno_fim || "05:00",
          percentual_he_60: f.percentual_he_60 || 1.6,
          percentual_he_100: f.percentual_he_100 || 2.0,
          adicional_noturno: f.adicional_noturno || 0.25,
          valor_hora: f.valor_hora || 50
        }));

        // Processar funcionários do RDO
        const funcionariosBoletim: FuncionarioBoletim[] = rdo.equipes.map(equipe => {
          const funcionario = mockFuncionarios.find(f => f.nome === equipe.funcionario) || {
            id: equipe.id,
            nome: equipe.funcionario,
            cargo: equipe.cargo,
            jornada_normal_dia: 8,
            limite_he_semanal: 10,
            percentual_he_60: 1.6,
            percentual_he_100: 2.0,
            adicional_noturno: 0.25,
            valor_hora: 50
          } as Funcionario;

          const classificacao = classificarHorasTrabalho(
            funcionario,
            equipe.horaInicio,
            equipe.horaFim,
            rdo.data
          );

          const valor_hora_normal = funcionario.valor_hora || 50;
          
          return {
            funcionario_id: funcionario.id,
            funcionario_nome: funcionario.nome,
            cargo: funcionario.cargo,
            valor_hora_normal,
            hh_normais: classificacao.hh_normais,
            hh_extras_60: classificacao.hh_extras_60,
            hh_extras_100: classificacao.hh_extras_100,
            hh_noturnas: classificacao.hh_noturnas,
            hh_domingo_feriado: classificacao.eh_domingo_feriado ? classificacao.total_horas : 0,
            valor_hh_normais: classificacao.hh_normais * valor_hora_normal,
            valor_hh_extras_60: classificacao.hh_extras_60 * valor_hora_normal * funcionario.percentual_he_60,
            valor_hh_extras_100: classificacao.hh_extras_100 * valor_hora_normal * funcionario.percentual_he_100,
            valor_hh_noturnas: classificacao.hh_noturnas * valor_hora_normal * funcionario.adicional_noturno,
            valor_hh_domingo_feriado: classificacao.eh_domingo_feriado ? classificacao.total_horas * valor_hora_normal * 2 : 0,
            valor_total: 0, // será calculado abaixo
            hh_extras_semana_atual: 0, // seria calculado consultando outros RDOs da semana
            limite_he_atingido: false
          } as FuncionarioBoletim;
        });

        // Calcular valor total de cada funcionário
        funcionariosBoletim.forEach(fb => {
          fb.valor_total = fb.valor_hh_normais + fb.valor_hh_extras_60 + fb.valor_hh_extras_100 + 
                          fb.valor_hh_noturnas + fb.valor_hh_domingo_feriado;
        });

        // Processar equipamentos
        const equipamentosBoletim: EquipamentoBoletim[] = (rdo.equipamentos || []).map(eq => ({
          equipamento_id: eq.id,
          equipamento_nome: eq.nome,
          categoria: eq.categoria,
          horas_utilizadas: eq.horasUsadas,
          valor_hora: 25, // valor mock
          valor_total: eq.horasUsadas * 25,
          responsavel: 'N/A'
        }));

        // Processar materiais
        const materiaisBoletim: MaterialBoletim[] = (rdo.materiais || []).map(mat => ({
          material_id: mat.id,
          material_nome: mat.nome,
          categoria: mat.categoria,
          quantidade_utilizada: mat.quantidade_usada,
          unidade: mat.unidade,
          valor_unitario: 10, // valor mock
          valor_total: mat.quantidade_usada * 10
        }));

        // Calcular resumo financeiro
        const total_funcionarios = funcionariosBoletim.reduce((sum, fb) => sum + fb.valor_total, 0);
        const total_equipamentos = equipamentosBoletim.reduce((sum, eb) => sum + eb.valor_total, 0);
        const total_materiais = materiaisBoletim.reduce((sum, mb) => sum + mb.valor_total, 0);

        const resumo_financeiro: ResumoFinanceiro = {
          total_funcionarios,
          total_equipamentos,
          total_materiais,
          total_geral: total_funcionarios + total_equipamentos + total_materiais,
          total_hh_normais: funcionariosBoletim.reduce((sum, fb) => sum + fb.valor_hh_normais, 0),
          total_hh_extras_60: funcionariosBoletim.reduce((sum, fb) => sum + fb.valor_hh_extras_60, 0),
          total_hh_extras_100: funcionariosBoletim.reduce((sum, fb) => sum + fb.valor_hh_extras_100, 0),
          total_hh_noturnas: funcionariosBoletim.reduce((sum, fb) => sum + fb.valor_hh_noturnas, 0),
          total_hh_domingo_feriado: funcionariosBoletim.reduce((sum, fb) => sum + fb.valor_hh_domingo_feriado, 0)
        };

        const novoBoletim: BoletimMedicao = {
          id: Date.now().toString(),
          rdo_id: rdo.id,
          data: rdo.data,
          funcionarios: funcionariosBoletim,
          equipamentos: equipamentosBoletim,
          materiais: materiaisBoletim,
          resumo_financeiro,
          status: 'rascunho',
          criado_em: new Date().toISOString()
        };

        // Salvar boletim
        const boletinsExistentes = getStorageData<BoletimMedicao[]>('boletins_medicao', []);
        const boletinsAtualizados = [...boletinsExistentes, novoBoletim];
        setStorageData('boletins_medicao', boletinsAtualizados);
        setBoletins(boletinsAtualizados);

        setLoading(false);
        resolve(novoBoletim);
      }, 1000);
    });
  }, [classificarHorasTrabalho]);

  // Aprovar boletim
  const aprovarBoletim = useCallback(async (boletimId: string, aprovadoPor: string): Promise<void> => {
    setLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const boletinsExistentes = getStorageData<BoletimMedicao[]>('boletins_medicao', []);
        const boletinsAtualizados = boletinsExistentes.map(b => 
          b.id === boletimId 
            ? { ...b, status: 'aprovado' as const, aprovado_em: new Date().toISOString(), aprovado_por: aprovadoPor }
            : b
        );
        
        setStorageData('boletins_medicao', boletinsAtualizados);
        setBoletins(boletinsAtualizados);
        setLoading(false);
        resolve();
      }, 500);
    });
  }, []);

  return {
    boletins,
    loading,
    gerarBoletimDeRDO,
    aprovarBoletim,
    classificarHorasTrabalho
  };
};