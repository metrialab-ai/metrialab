import { Role, Country, State } from './types';

export const ROLES: Role[] = ['CEO', 'CFO', 'Gerente de Produto', 'Líder de Inovação', 'Analista', 'Administrador'];
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

export const PRO_RISK_CATEGORIES = [
  'Alinhamento Estratégico',
  'Incompatibilidade Técnica',
  'Barreiras Legais/Reg',
  'Prioridade TI',
  'Apoio Stakeholders',
  'Riscos Reputacionais',
  'Baixa Maturidade Startup',
  'Impacto ESG',
  'Disponibilidade RH',
  'Risco de Execução'
];

export const ICV_QUESTIONS = [
  "Os dados utilizados para construir os cenários são confiáveis?",
  "Todas as variáveis críticas e custos potenciais foram considerados?",
  "Os principais riscos identificados possuem mitigação?",
  "Os cenários refletem a complexidade e incertezas?",
  "A solução atingiu os objetivos da POC com resultados consistentes?",
  "A solução pode ser replicada em escala sem perda de qualidade?",
  "A startup/equipe possui capacidade para sustentar a escala?",
  "O projeto está integrado e os stakeholders alinhados?"
];

export const SCENARIO_WEIGHTS = {
  PESSIMISTIC: 1,
  REALISTIC: 4,
  OPTIMISTIC: 1,
  TOTAL: 6
};