import { Role, Country, State } from './types';

export const ROLES: Role[] = ['CEO', 'CFO', 'Gerente de Produto', 'Líder de Inovação', 'Analista'];
export const COUNTRIES: Country[] = ['Brasil', 'EUA', 'Portugal', 'Reino Unido'];
export const STATES: Record<Country, State[]> = {
  'Brasil': ['SP', 'RJ', 'MG', 'RS'],
  'EUA': ['CA', 'NY'],
  'Portugal': ['Lisboa'],
  'Reino Unido': ['Londres']
};

export const VALUE_TYPES = ['Redução de Custos', 'Aumento de Receita', 'Nova Receita'];

export const RISK_CATEGORIES = [
  'Alinhamento Estratégico',
  'Viabilidade Técnica',
  'Legal/Regulatório',
  'Apoio de Stakeholders',
  'Maturidade de Mercado',
  'Disponibilidade de Recursos'
];
