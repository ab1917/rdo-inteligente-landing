export const PLAN_LIMITS = {
  starter: {
    obras: 3,
    usuarios: 10,
    armazenamento_gb: 10,
    preco: 297,
    recursos: [
      'Até 3 obras ativas',
      'Até 10 usuários',
      '10GB de armazenamento',
      'RDO básico',
      'Relatórios básicos'
    ]
  },
  professional: {
    obras: -1, // ilimitado
    usuarios: 50,
    armazenamento_gb: 100,
    preco: 597,
    recursos: [
      'Obras ilimitadas',
      'Até 50 usuários',
      '100GB de armazenamento',
      'Todos os recursos principais',
      'CRM básico integrado',
      'API limitada'
    ]
  },
  enterprise: {
    obras: -1, // ilimitado
    usuarios: -1, // ilimitado
    armazenamento_gb: -1, // ilimitado
    preco: 1297,
    recursos: [
      'Recursos ilimitados',
      'Usuários ilimitados',
      'Armazenamento ilimitado',
      'White-label',
      'API completa',
      'Suporte prioritário'
    ]
  }
};

export const PLAN_FEATURES = {
  starter: ['rdo_basico', 'relatorios_basicos'],
  professional: ['rdo_basico', 'relatorios_basicos', 'crm_basico', 'api_limitada'],
  enterprise: [
    'rdo_basico', 
    'relatorios_basicos', 
    'crm_basico', 
    'api_limitada', 
    'white_label', 
    'api_completa', 
    'suporte_prioritario'
  ]
};

export const PERMISSIONS = {
  super_admin: ['read_all', 'write_all', 'manage_companies', 'manage_subscriptions'],
  admin: ['read_company', 'write_company', 'manage_users'],
  manager: ['read_company', 'write_projects', 'manage_team'],
  engineer: ['read_company', 'write_rdo', 'read_projects'],
  viewer: ['read_company']
};

export const isFeatureEnabled = (plan: string, feature: string): boolean => {
  return PLAN_FEATURES[plan as keyof typeof PLAN_FEATURES]?.includes(feature) || false;
};

export const hasPermission = (role: string, permission: string): boolean => {
  return PERMISSIONS[role as keyof typeof PERMISSIONS]?.includes(permission) || false;
};

export const isLimitReached = (current: number, limit: number): boolean => {
  if (limit === -1) return false; // ilimitado
  return current >= limit;
};

export const formatLimit = (limit: number): string => {
  return limit === -1 ? 'Ilimitado' : limit.toString();
};