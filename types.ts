export type Role = 'CEO' | 'CFO' | 'Gerente de Produto' | 'Líder de Inovação' | 'Analista' | 'Administrador';
export type Country = 'Brasil' | 'EUA' | 'Portugal' | 'Reino Unido';
export type State = 'SP' | 'RJ' | 'MG' | 'RS' | 'CA' | 'NY' | 'Lisboa' | 'Londres';
export type City = string;

export interface User {
  id: string;
  email: string;
  name: string;
  role?: Role;
  country?: Country;
  state?: State;
  city?: City;
  company?: string;
  phone?: string;
  isGoogleUser: boolean;
  isProfileComplete: boolean;
  createdAt: string;
  lastLogin?: string;
}

export type ProjectMode = 'LIGHT' | 'PRO';
export type ValueType = 'Redução de Custos' | 'Aumento de Receita' | 'Nova Receita';

// ICV Answer: 1 = Sim (12.5%), 0.5 = Parcial (6.25%), 0 = Não (0%)
export type ICVResponse = 0 | 0.5 | 1;

export interface FinancialData {
  // Inputs da POC (Cpoc)
  investment: number; // Cd: Custos Diretos (usado como base ou soma de detalhados)
  externalFees?: number; // Ci: Custos Indiretos
  hourlyRate?: number; // Vh: Valor Hora
  hoursPerMonth?: number; // h: Horas dedicadas/mês
  monthsToImplement: number; // Tm: Duração POC
  
  // Pro Detalhado
  startupCost?: number;
  licenses?: number;
  servicesCost?: number;
  teamSize?: number;
  otherExpenses?: number;
  scaleImplementationMonths?: number;

  // Inputs de Valor (Ve)
  monthlySavings?: number; 
  monthlyRevenue?: number;
  lifespanMonths: number; // Para projeção de longo prazo
  discountRate: number; 

  // Dados de Valor Unitário (Auxiliares)
  unitCostCurrent?: number;
  unitCostNew?: number;
  monthlyVolume?: number;

  // Innovation Accounting Metrics (Calculados)
  cpoc: number; // Custo Total da POC
  gePoc: number; // Ganho Econômico da POC (Ve - Cpoc)
  
  // Scale Projections (Weighted)
  scaleInvestment: number; // Ce: Custo esperado em escala
  scaleValue: number; // VEe: Valor Econômico esperado em escala
  scaleEconomicGain: number; // GEe: Ganho Econômico em escala (VEe - Ce)
  benefitCostRatio: number; // GEe / Ce
}

export interface Scenario {
  name: string;
  optimistic: number;
  realistic: number;
  pessimistic: number;
}

export interface DetailedScenario {
  baseCost: number;
  volume: number;
  unitSavings: number;
}

export interface ProScenarios {
  realistic: DetailedScenario;
  optimistic: DetailedScenario;
  pessimistic: DetailedScenario;
}

export interface Premises {
  volumePredictable?: number;
  frequency?: string;
  seasonality?: string;
  restrictions?: string;
  dependencies?: string;
}

export interface Portfolio {
  horizon: string;
  complexity: string;
  uncertainty: string;
  clientImpact: string;
  internalImpact: string;
}

export interface Risk {
  category: string;
  level: 'Baixo' | 'Médio' | 'Alto';
}

export interface AiAnalysis {
  strategic: string;
  market: string;
  risks: string;
  actionPlan: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  mode: ProjectMode;
  status: 'Rascunho' | 'Ativo' | 'Arquivado';
  
  // General Data
  area?: string;
  responsible?: string;
  valueType?: ValueType;
  
  // Pro Fields
  stakeholders?: string;
  initiativeType?: string;
  stage?: string;
  innovationTheme?: string;
  strategicGoal?: string;
  problem?: string;
  opportunity?: string;

  // Qualitativos
  mainGoal?: string;
  keyIndicator?: string;
  businessImpact?: string;
  comments?: string;
  
  financials: FinancialData;
  premises?: Premises;
  proScenarios?: ProScenarios;
  portfolio?: Portfolio;
  
  risks?: Risk[];
  icvAnswers?: ICVResponse[]; // Array de 8 respostas
  icvScore: number; // 0 a 100%
  
  score: number;
  roi: number; // Mantido para compatibilidade visual, mas o foco é BCR
  
  aiAnalysis?: AiAnalysis;
}