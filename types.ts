export type Role = 'CEO' | 'CFO' | 'Gerente de Produto' | 'Líder de Inovação' | 'Analista';
export type Country = 'Brasil' | 'EUA' | 'Portugal' | 'Reino Unido';
export type State = 'SP' | 'RJ' | 'MG' | 'RS' | 'CA' | 'NY' | 'Lisboa' | 'Londres'; // Simplificado
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
}

export type ProjectMode = 'LIGHT' | 'PRO';
export type ValueType = 'Redução de Custos' | 'Aumento de Receita' | 'Nova Receita';

export interface FinancialData {
  investment: number;
  monthlySavings?: number; // Cost Reduction
  monthlyRevenue?: number; // Revenue
  monthsToImplement: number;
  lifespanMonths: number;
  discountRate: number; // For NPV
  
  // Detalhes do Form Light
  externalFees?: number; // Taxas/Comissões
  hourlyRate?: number; // Valor Hora Média
  totalHours?: number; // Total de Horas
  
  // Dados de Valor Unitário
  unitCostCurrent?: number;
  unitCostNew?: number;
  monthlyVolume?: number;
}

export interface Scenario {
  name: string;
  optimistic: number;
  realistic: number;
  pessimistic: number;
}

export interface Risk {
  category: string;
  level: 'Baixo' | 'Médio' | 'Alto';
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  createdAt: string; // ISO date
  mode: ProjectMode;
  status: 'Rascunho' | 'Ativo' | 'Arquivado';
  
  // General Data
  area?: string;
  responsible?: string;
  valueType?: ValueType;
  
  // Qualitativos Light
  mainGoal?: string; // Meta Principal
  keyIndicator?: string; // Indicador Chave
  businessImpact?: string; // Impacto no Negócio
  comments?: string; // Observações Finais
  
  // Financials
  financials: FinancialData;
  
  // Pro Specifics
  risks?: Risk[];
  scenarios?: Scenario[];
  
  // Computed (Cached for list view)
  score: number;
  roi: number;
}
