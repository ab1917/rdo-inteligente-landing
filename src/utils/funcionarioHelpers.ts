export const getStatusColor = (status: string) => {
  switch (status) {
    case 'ativo': return 'bg-green-500/10 text-green-600 border-green-500/20';
    case 'inativo': return 'bg-red-500/10 text-red-600 border-red-500/20';
    default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  }
};

export const formatSalary = (salario?: number) => {
  if (!salario) return 'Não informado';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(salario);
};