import React, { useState, useEffect, useRef } from 'react';
import { ProjectMode, Project, ValueType, Risk, ICVResponse, FinancialData, ProScenarios } from '../types';
import { VALUE_TYPES, RISK_CATEGORIES, PRO_RISK_CATEGORIES, ICV_QUESTIONS } from '../constants';
import { db } from '../services/db';
import { ChevronRight, ChevronLeft, Save, FileText, DollarSign, Zap, Target, AlertTriangle, Edit3, RotateCcw, X, Check, Clock, TrendingUp, HelpCircle, Loader2, Briefcase, Layout, Layers, BarChart2, Shield } from 'lucide-react';

interface WizardProps {
  onComplete: (projectId: string) => void;
}

const DRAFT_KEY = 'metria_project_draft';
const AUTO_SAVE_INTERVAL = 2 * 60 * 1000;

// Helper Component for Tooltips
const WizardTooltip = ({ content }: { content: React.ReactNode }) => (
  <div className="group relative inline-block ml-1.5 align-middle cursor-help z-50">
    <HelpCircle size={14} className="text-gray-400 hover:text-brand-accent transition-colors" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white text-xs leading-relaxed rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none text-left border border-slate-700">
      {content}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
    </div>
  </div>
);

// Currency Input Component (BRL)
interface CurrencyInputProps {
  value: number | undefined;
  onChange: (val: number) => void;
  placeholder?: string;
  className?: string;
}

const CurrencyInput = ({ 
  value, 
  onChange, 
  placeholder = "R$ 0,00",
  className = "w-full p-2.5 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1 focus:ring-1 focus:ring-brand-accent outline-none"
}: CurrencyInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove tudo que não é dígito
    const rawValue = e.target.value.replace(/\D/g, '');
    // Converte para número (centavos)
    const numberValue = rawValue ? parseInt(rawValue, 10) / 100 : 0;
    onChange(numberValue);
  };

  // Formata para exibição
  const displayValue = (value !== undefined && value !== null)
    ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : '';

  return (
    <input
      type="text"
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
    />
  );
};

const ProjectWizard: React.FC<WizardProps> = ({ onComplete }) => {
  const [mode, setMode] = useState<ProjectMode | null>(null);
  const [step, setStep] = useState(0); 
  // Step mapping for PRO: 
  // 1: Dados Gerais, 2: Operacional, 3: Custos, 4: Premissas, 5: Cenários, 6: ICV, 7: Riscos, 8: Portfólio
  const [isSaving, setIsSaving] = useState(false);
  
  const [data, setData] = useState<Partial<Project>>({
    name: '',
    area: '',
    responsible: '',
    valueType: 'Redução de Custos',
    mainGoal: '',
    keyIndicator: '',
    businessImpact: '',
    comments: '',
    financials: {
      investment: 0,
      monthsToImplement: 3,
      lifespanMonths: 12,
      discountRate: 10,
      externalFees: 0,
      hourlyRate: 0,
      hoursPerMonth: 0,
      unitCostCurrent: 0,
      unitCostNew: 0,
      monthlyVolume: 0,
      monthlySavings: 0,
      monthlyRevenue: 0,
      cpoc: 0,
      gePoc: 0,
      scaleInvestment: 0,
      scaleValue: 0,
      scaleEconomicGain: 0,
      benefitCostRatio: 0,
      // Pro Fields Initial values
      startupCost: 0,
      licenses: 0,
      servicesCost: 0,
      teamSize: 0,
      otherExpenses: 0,
      scaleImplementationMonths: 0,
    },
    premises: {
        volumePredictable: 0,
        frequency: '',
        seasonality: '',
        restrictions: '',
        dependencies: ''
    },
    proScenarios: {
        realistic: { baseCost: 0, volume: 0, unitSavings: 0 },
        optimistic: { baseCost: 0, volume: 0, unitSavings: 0 },
        pessimistic: { baseCost: 0, volume: 0, unitSavings: 0 }
    },
    portfolio: {
        horizon: 'H1 - Incremental',
        complexity: 'Baixa',
        uncertainty: 'Baixo',
        clientImpact: '',
        internalImpact: ''
    },
    risks: [],
    icvAnswers: Array(8).fill(0),
    icvScore: 0
  });

  // Light Mode Only
  const [lightRisks, setLightRisks] = useState({
    tiDependency: false,
    dataLack: false,
    lowCapability: false,
    budgetLack: false,
    internalResistance: false
  });

  // Scale Variation Inputs (Percentages) - Used only as fallback/Light mode
  const [scaleVariations, setScaleVariations] = useState({
    costOptimistic: -10,
    costPessimistic: 20,
    valueOptimistic: 30,
    valuePessimistic: -20
  });

  // Auto-Save logic
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);
  const [draftFoundDate, setDraftFoundDate] = useState<string>('');
  const stateRef = useRef({ mode, step, data, lightRisks, scaleVariations });

  useEffect(() => {
    stateRef.current = { mode, step, data, lightRisks, scaleVariations };
  }, [mode, step, data, lightRisks, scaleVariations]);

  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.data.name || parsed.mode) {
            setDraftFoundDate(new Date(parsed.timestamp).toLocaleString());
            setShowRestorePrompt(true);
        }
      } catch (e) { console.error(e); }
    }
    const timer = setInterval(() => {
      if (stateRef.current.mode || stateRef.current.data.name) saveDraftToStorage(stateRef.current);
    }, AUTO_SAVE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const saveDraftToStorage = (currentState: any) => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...currentState, timestamp: new Date().toISOString() }));
  };

  const restoreDraft = () => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      const parsed = JSON.parse(savedDraft);
      setMode(parsed.mode);
      setStep(parsed.step);
      setData(parsed.data);
      setLightRisks(parsed.lightRisks || {});
      setScaleVariations(parsed.scaleVariations || { costOptimistic: -10, costPessimistic: 20, valueOptimistic: 30, valuePessimistic: -20 });
      setShowRestorePrompt(false);
    }
  };

  const discardDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setShowRestorePrompt(false);
  };

  const currentUser = db.getCurrentUser();

  const handleInputChange = (field: string, value: any, nested?: 'financials' | 'premises' | 'portfolio') => {
    let sanitizedValue = value;
    if (typeof value === 'number' && value < 0) sanitizedValue = 0;

    if (nested) {
      setData(prev => ({
        ...prev,
        [nested]: { ...prev[nested] as any, [field]: sanitizedValue }
      }));
    } else {
      setData(prev => ({ ...prev, [field]: sanitizedValue }));
    }
  };

  const handleScenarioChange = (scenario: 'realistic' | 'optimistic' | 'pessimistic', field: 'baseCost' | 'volume' | 'unitSavings', value: number) => {
      setData(prev => ({
          ...prev,
          proScenarios: {
              ...prev.proScenarios!,
              [scenario]: { ...prev.proScenarios![scenario], [field]: Math.max(0, value) }
          }
      }));
  };

  const handleRiskChangePro = (category: string, level: 'Baixo' | 'Médio' | 'Alto') => {
      const currentRisks = data.risks || [];
      const filtered = currentRisks.filter(r => r.category !== category);
      setData(prev => ({ ...prev, risks: [...filtered, { category, level }] }));
  };

  const getRiskLevel = (category: string) => {
      return data.risks?.find(r => r.category === category)?.level || null;
  };

  const handleICVChange = (index: number, value: ICVResponse) => {
    const newAnswers = [...(data.icvAnswers || [])];
    newAnswers[index] = value;
    setData(prev => ({ ...prev, icvAnswers: newAnswers }));
  };

  // Calculations Logic
  const performCalculations = (): FinancialData => {
    const f = data.financials!;
    
    // 1. CPOC Calculation
    let cpoc = 0;
    if (mode === 'PRO') {
         // Detailed Pro Calculation
         const laborCost = (f.hourlyRate || 0) * (f.hoursPerMonth || 0) * (f.teamSize || 1) * (f.monthsToImplement || 0);
         cpoc = (f.startupCost || 0) + (f.externalFees || 0) + (f.licenses || 0) + (f.servicesCost || 0) + (f.otherExpenses || 0) + laborCost;
    } else {
         // Simple Light Calculation
         const teamCost = (f.hourlyRate || 0) * (f.hoursPerMonth || 0) * (f.monthsToImplement || 0);
         cpoc = (f.investment || 0) + (f.externalFees || 0) + teamCost;
    }

    // 2. Value Estimation (Ve)
    const monthlyGain = (f.monthlySavings || 0) + (f.monthlyRevenue || 0);
    const ve = monthlyGain * (f.lifespanMonths || 12);
    const gePoc = ve - cpoc;

    // 3. Scale Projections
    let scaleInvestment = 0;
    let scaleValue = 0;

    if (mode === 'PRO' && data.proScenarios) {
        // Use Weighted Average from explicit scenarios
        const s = data.proScenarios;
        
        // Calculate Gain for each scenario: (UnitSavings * Volume * 12?) - BaseCost
        // Assuming Annualized for consistency
        const calcVal = (sc: any) => sc.unitSavings * sc.volume * 12; // Annual Value
        const calcCost = (sc: any) => sc.baseCost; // Base Cost (Annual?)

        const valR = calcVal(s.realistic);
        const valO = calcVal(s.optimistic);
        const valP = calcVal(s.pessimistic);

        const costR = calcCost(s.realistic);
        const costO = calcCost(s.optimistic);
        const costP = calcCost(s.pessimistic);

        scaleInvestment = (costR * 4 + costO + costP) / 6;
        scaleValue = (valR * 4 + valO + valP) / 6;

    } else {
        // Fallback / Light Logic
        const baseScaleCost = cpoc * 4; 
        const baseScaleValue = ve * 4; 
        const costR = baseScaleCost;
        const costO = baseScaleCost * (1 + scaleVariations.costOptimistic / 100);
        const costP = baseScaleCost * (1 + scaleVariations.costPessimistic / 100);
        const valR = baseScaleValue;
        const valO = baseScaleValue * (1 + scaleVariations.valueOptimistic / 100);
        const valP = baseScaleValue * (1 + scaleVariations.valuePessimistic / 100);
        scaleInvestment = (costR * 4 + costO + costP) / 6;
        scaleValue = (valR * 4 + valO + valP) / 6;
    }

    const scaleEconomicGain = scaleValue - scaleInvestment;
    const benefitCostRatio = scaleInvestment > 0 ? (scaleEconomicGain / scaleInvestment) : 0;

    return {
      ...f,
      cpoc: isNaN(cpoc) ? 0 : cpoc,
      gePoc: isNaN(gePoc) ? 0 : gePoc,
      scaleInvestment: isNaN(scaleInvestment) ? 0 : scaleInvestment,
      scaleValue: isNaN(scaleValue) ? 0 : scaleValue,
      scaleEconomicGain: isNaN(scaleEconomicGain) ? 0 : scaleEconomicGain,
      benefitCostRatio: isNaN(benefitCostRatio) ? 0 : benefitCostRatio,
      investment: mode === 'PRO' ? cpoc : f.investment // Update main investment field for display consistency
    };
  };

  const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      try { return crypto.randomUUID(); } catch (e) {}
    }
    return 'proj-' + Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  const handleSave = async () => {
    if (!currentUser) {
        alert("Erro de sessão. Por favor, faça login novamente.");
        return;
    }
    
    if (mode === 'LIGHT' && !data.name) {
         alert("Por favor, preencha o nome do projeto.");
         return;
    }

    setIsSaving(true);

    setTimeout(() => {
        try {
            const calculatedFinancials = performCalculations();
            const icvScoreRaw = (data.icvAnswers || []).reduce((acc, curr) => acc + curr, 0);
            let icvScore = icvScoreRaw * 12.5;

            if (mode === 'LIGHT' && icvScore === 0) icvScore = 50;

            let finalRisks: Risk[] = [...(data.risks || [])];
            if (mode === 'LIGHT') {
                if (lightRisks.tiDependency) finalRisks.push({ category: 'Dependência de TI', level: 'Alto' });
                if (lightRisks.dataLack) finalRisks.push({ category: 'Falta de Dados', level: 'Alto' });
                if (lightRisks.lowCapability) finalRisks.push({ category: 'Baixa Capacidade', level: 'Médio' });
                if (lightRisks.budgetLack) finalRisks.push({ category: 'Falta de Orçamento', level: 'Alto' });
                if (lightRisks.internalResistance) finalRisks.push({ category: 'Resistência Interna', level: 'Médio' });
            }

            const project: Project = {
              id: generateId(),
              userId: currentUser.email,
              name: data.name || 'Novo Projeto',
              createdAt: new Date().toISOString(),
              mode: mode!,
              status: 'Ativo',
              financials: calculatedFinancials,
              area: data.area,
              responsible: data.responsible,
              valueType: data.valueType,
              mainGoal: data.mainGoal,
              keyIndicator: data.keyIndicator,
              businessImpact: data.businessImpact,
              comments: data.comments,
              risks: finalRisks,
              icvAnswers: data.icvAnswers,
              icvScore: icvScore,
              roi: calculatedFinancials.benefitCostRatio,
              score: icvScore,
              // Pro Fields
              stakeholders: data.stakeholders,
              initiativeType: data.initiativeType,
              stage: data.stage,
              innovationTheme: data.innovationTheme,
              strategicGoal: data.strategicGoal,
              problem: data.problem,
              opportunity: data.opportunity,
              premises: data.premises,
              proScenarios: data.proScenarios,
              portfolio: data.portfolio
            };

            db.saveProject(project);
            localStorage.removeItem(DRAFT_KEY);
            onComplete(project.id);
            
        } catch (error) {
            console.error("Error saving project:", error);
            alert("Ocorreu um erro ao salvar o projeto. Verifique os dados inseridos.");
            setIsSaving(false);
        }
    }, 500);
  };

  // Auto-calculate Savings from Unit Cost
  useEffect(() => {
    if (data.financials?.unitCostCurrent && data.financials?.unitCostNew && data.financials?.monthlyVolume) {
      const savingPerUnit = data.financials.unitCostCurrent - data.financials.unitCostNew;
      const totalSavings = savingPerUnit * data.financials.monthlyVolume;
      if (totalSavings > 0) handleInputChange('monthlySavings', totalSavings, 'financials');
    }
  }, [data.financials?.unitCostCurrent, data.financials?.unitCostNew, data.financials?.monthlyVolume]);

  const switchMode = (newMode: ProjectMode) => {
    setMode(newMode);
    setStep(1); 
  };

  // ---- RENDERERS ----

  const renderModeSelection = () => (
    <div className="space-y-6">
       <div className="text-center mb-8">
        <span className="bg-brand-accent text-brand-primary text-xs font-bold px-3 py-1 rounded uppercase tracking-wide">Plataforma de Innovation Accounting</span>
        <h2 className="text-3xl font-bold mt-2 dark:text-white">Analise a Viabilidade do seu Negócio</h2>
        <p className="text-gray-500 max-w-2xl mx-auto mt-2">Cálculo de Custo da POC (Cpoc), Ganho Econômico (Ge) e Índice de Viabilidade (ICV).</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <button onClick={() => { setMode('LIGHT'); setStep(1); }} className={`p-6 border-2 rounded-xl transition-all hover:border-brand-primary border-gray-200`}>
          <div className="font-bold text-xl mb-2">DISCOVERY</div>
          <p className="text-sm opacity-80">Ideal para POCs rápidas e validação inicial (Plano Gratuito).</p>
        </button>
        <button onClick={() => { setMode('PRO'); setStep(1); }} className={`p-6 border-2 rounded-xl transition-all hover:border-brand-primary border-gray-200`}>
           <div className="font-bold text-xl mb-2">PROFESSIONAL</div>
           <p className="text-sm opacity-80">Análise detalhada de portfólio e escala.</p>
        </button>
      </div>
    </div>
  );

  const renderLightModeForm = () => (
    <div className="animate-fadeIn pb-12">
      {/* Header with Tabs */}
      <div className="bg-slate-900 text-white p-6 rounded-t-xl -mt-8 -mx-8 mb-8">
           <h2 className="text-xl font-bold flex items-center gap-2">
             <Briefcase className="text-brand-accent"/> Novo Projeto
           </h2>
           <p className="text-slate-400 text-sm mt-1">Selecione o modelo de análise adequado para o estágio do seu projeto.</p>
           
           <div className="flex mt-6 bg-slate-800 rounded-lg p-1 w-full max-w-md border border-slate-700">
              <button className="flex-1 bg-white text-slate-900 font-bold py-2 rounded shadow-sm text-xs uppercase tracking-wide transition-all">Discovery (Gratuito)</button>
              <button onClick={() => switchMode('PRO')} className="flex-1 text-slate-400 hover:text-white py-2 rounded text-xs uppercase tracking-wide transition-all">Professional (Completo)</button>
           </div>
      </div>

      <div className="space-y-8 px-4">
        {/* LIGHT MODE FORM SECTIONS (Keeping existing implementation) */}
        <section>
          <h3 className="text-lg font-bold dark:text-white flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-slate-800 pb-2">
            <span className="text-brand-accent">1.</span> Dados Gerais
          </h3>
          <div className="grid gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">Nome do Projeto</label>
                <input type="text" placeholder="Ex: Projeto Beta" value={data.name} onChange={e => handleInputChange('name', e.target.value)} className="w-full p-2.5 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1 focus:ring-1 focus:ring-brand-accent outline-none" />
              </div>
              {/* ... other light mode fields ... */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Área Solicitante</label>
                    <input type="text" value={data.area} onChange={e => handleInputChange('area', e.target.value)} className="w-full p-2.5 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1 focus:ring-1 focus:ring-brand-accent outline-none" />
                </div>
                <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Responsável</label>
                    <input type="text" value={data.responsible} onChange={e => handleInputChange('responsible', e.target.value)} className="w-full p-2.5 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1 focus:ring-1 focus:ring-brand-accent outline-none" />
                </div>
              </div>
               <div>
                 <label className="text-[10px] font-bold text-brand-accent uppercase mb-2 block">Tipo de Valor de Econômico (VE)</label>
                 <div className="grid grid-cols-3 gap-3">
                    {VALUE_TYPES.map(t => (
                        <button key={t} onClick={() => handleInputChange('valueType', t)} className={`p-2 text-[10px] uppercase font-bold border rounded-md transition-all ${data.valueType === t ? 'bg-brand-accent text-brand-primary border-brand-accent shadow-sm' : 'text-gray-400 border-gray-200 hover:border-gray-300'}`}>{t}</button>
                    ))}
                 </div>
              </div>
          </div>
        </section>

         <section>
          <h3 className="text-lg font-bold dark:text-white flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-slate-800 pb-2">
            <span className="text-brand-accent">2.</span> Custos Estimados
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Custo Total Estimado da Solução (Direto)</label>
                  <CurrencyInput value={data.financials?.investment} onChange={val => handleInputChange('investment', val, 'financials')} />
              </div>
               <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Taxas / Comissões Extras</label>
                  <CurrencyInput value={data.financials?.externalFees} onChange={val => handleInputChange('externalFees', val, 'financials')} />
              </div>
              <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Duração POC (Meses)</label>
                  <input type="number" min="1" value={data.financials?.monthsToImplement || ''} onChange={e => handleInputChange('monthsToImplement', Number(e.target.value), 'financials')} className="w-full p-2.5 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1 focus:ring-1 focus:ring-brand-accent outline-none" />
              </div>
              <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Valor Hora Médio (Vh)</label>
                  <CurrencyInput value={data.financials?.hourlyRate} onChange={val => handleInputChange('hourlyRate', val, 'financials')} />
              </div>
              <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Horas Totais Mês</label>
                  <input type="number" min="0" value={data.financials?.hoursPerMonth || ''} onChange={e => handleInputChange('hoursPerMonth', Number(e.target.value), 'financials')} className="w-full p-2.5 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1 focus:ring-1 focus:ring-brand-accent outline-none" />
              </div>
          </div>
         </section>
        
         <section>
          <h3 className="text-lg font-bold dark:text-white flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-slate-800 pb-2">
            <span className="text-brand-accent"><Zap size={18} fill="currentColor" /></span> Dados de Valor (Ve)
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
             <div>
                 <label className="text-[10px] font-bold text-gray-500 uppercase">Custo Atual (Unidade)</label>
                 <CurrencyInput value={data.financials?.unitCostCurrent} onChange={val => handleInputChange('unitCostCurrent', val, 'financials')} />
             </div>
             <div>
                 <label className="text-[10px] font-bold text-gray-500 uppercase">Novo Custo Estimado</label>
                 <CurrencyInput value={data.financials?.unitCostNew} onChange={val => handleInputChange('unitCostNew', val, 'financials')} />
             </div>
             <div className="md:col-span-2">
                 <label className="text-[10px] font-bold text-gray-500 uppercase">Volume Mensal Impactado</label>
                 <input type="number" min="0" value={data.financials?.monthlyVolume || ''} onChange={e => handleInputChange('monthlyVolume', Number(e.target.value), 'financials')} className="w-full p-2.5 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1 focus:ring-1 focus:ring-brand-accent outline-none" />
             </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold dark:text-white flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-slate-800 pb-2">
            <span className="text-brand-accent">4.</span> Resultado Esperado
          </h3>
          <div className="grid gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">Meta Principal do Projeto</label>
                <input type="text" value={data.mainGoal} onChange={e => handleInputChange('mainGoal', e.target.value)} className="w-full p-2.5 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1 focus:ring-1 focus:ring-brand-accent outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">Indicador Chave (KPI)</label>
                <input type="text" value={data.keyIndicator} onChange={e => handleInputChange('keyIndicator', e.target.value)} className="w-full p-2.5 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1 focus:ring-1 focus:ring-brand-accent outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">Impacto Esperado no Negócio</label>
                <input type="text" value={data.businessImpact} onChange={e => handleInputChange('businessImpact', e.target.value)} className="w-full p-2.5 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1 focus:ring-1 focus:ring-brand-accent outline-none" />
              </div>
          </div>
        </section>
        
        <section>
          <h3 className="text-lg font-bold dark:text-white flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-slate-800 pb-2">
             <span className="text-brand-accent"><AlertTriangle size={18} /></span> 5. Riscos Principais
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
             <label className="flex items-center gap-2 p-3 border rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800">
                <input type="checkbox" checked={lightRisks.tiDependency} onChange={e => setLightRisks({...lightRisks, tiDependency: e.target.checked})} className="rounded text-brand-accent focus:ring-brand-accent" />
                <span className="text-sm">Dependência de TI</span>
             </label>
             <label className="flex items-center gap-2 p-3 border rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800">
                <input type="checkbox" checked={lightRisks.dataLack} onChange={e => setLightRisks({...lightRisks, dataLack: e.target.checked})} className="rounded text-brand-accent focus:ring-brand-accent" />
                <span className="text-sm">Falta de Dados</span>
             </label>
              <label className="flex items-center gap-2 p-3 border rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800">
                <input type="checkbox" checked={lightRisks.lowCapability} onChange={e => setLightRisks({...lightRisks, lowCapability: e.target.checked})} className="rounded text-brand-accent focus:ring-brand-accent" />
                <span className="text-sm">Baixa Capacidade Startup</span>
             </label>
             <label className="flex items-center gap-2 p-3 border rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800">
                <input type="checkbox" checked={lightRisks.budgetLack} onChange={e => setLightRisks({...lightRisks, budgetLack: e.target.checked})} className="rounded text-brand-accent focus:ring-brand-accent" />
                <span className="text-sm">Falta de Orçamento</span>
             </label>
             <label className="flex items-center gap-2 p-3 border rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800">
                <input type="checkbox" checked={lightRisks.internalResistance} onChange={e => setLightRisks({...lightRisks, internalResistance: e.target.checked})} className="rounded text-brand-accent focus:ring-brand-accent" />
                <span className="text-sm">Resistência Interna</span>
             </label>
          </div>
        </section>

         <section>
          <h3 className="text-lg font-bold dark:text-white flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-slate-800 pb-2">
             <span className="text-brand-accent">6.</span> Observações Finais
          </h3>
          <textarea 
            rows={4} 
            value={data.comments} 
            onChange={e => handleInputChange('comments', e.target.value)}
            className="w-full p-3 border rounded-md dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-1 focus:ring-brand-accent"
            placeholder="Informações adicionais relevantes..."
          />
        </section>
      </div>

      <div className="mt-8 flex justify-center">
         <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="w-full md:w-auto bg-slate-900 text-white px-12 py-4 rounded-lg font-bold shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
        >
            {isSaving ? (
                <><Loader2 size={20} className="animate-spin" /> Processando...</>
            ) : (
                'Gerar Relatório Discovery'
            )}
        </button>
      </div>
    </div>
  );

  const renderProSidebar = () => {
      const steps = [
          { id: 1, label: 'Dados Gerais', icon: FileText },
          { id: 2, label: 'Operacional (VE)', icon: Zap },
          { id: 3, label: 'Custos (CPOC)', icon: DollarSign },
          { id: 4, label: 'Premissas', icon: Layers },
          { id: 5, label: 'Cenários', icon: TrendingUp },
          { id: 6, label: 'ICV', icon: Check },
          { id: 7, label: 'Objeções/Riscos', icon: AlertTriangle },
          { id: 8, label: 'Portfólio', icon: Briefcase },
      ];

      return (
          <div className="w-full md:w-64 flex-shrink-0 bg-white dark:bg-slate-900 md:border-r dark:border-slate-800 p-6 flex flex-col gap-2">
              {steps.map(s => (
                  <button 
                    key={s.id}
                    onClick={() => setStep(s.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${step === s.id ? 'text-brand-accent font-bold bg-slate-50 dark:bg-slate-800' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
                  >
                      <s.icon size={16} className={step === s.id ? 'text-brand-accent' : 'text-gray-400'} />
                      {s.label}
                  </button>
              ))}
              
              <div className="mt-8 pt-8 border-t dark:border-slate-800">
                  <div className="bg-slate-900 dark:bg-slate-800 rounded-lg p-4 text-center">
                      <p className="text-white text-xs font-bold mb-3">Tudo pronto?</p>
                      <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full bg-brand-accent text-brand-primary text-xs font-bold py-2 rounded shadow hover:opacity-90 transition-opacity"
                      >
                         {isSaving ? 'Gerando...' : 'Gerar Relatório Completo'}
                      </button>
                  </div>
              </div>
          </div>
      );
  };

  const renderProStepContent = () => {
    switch(step) {
        case 1: // Dados Gerais
          return (
              <div className="animate-fadeIn">
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-6 dark:text-white">
                      <FileText className="text-brand-accent"/> Dados Gerais
                  </h3>
                  <div className="space-y-4">
                      <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Nome do Projeto</label>
                          <input type="text" value={data.name} onChange={e => handleInputChange('name', e.target.value)} className="w-full p-3 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1 focus:ring-1 focus:ring-brand-accent outline-none" placeholder="Projeto Beta" />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                          <div>
                              <label className="text-[10px] font-bold text-gray-500 uppercase">Área Solicitante</label>
                              <input type="text" value={data.area} onChange={e => handleInputChange('area', e.target.value)} className="w-full p-3 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1" />
                          </div>
                          <div>
                              <label className="text-[10px] font-bold text-gray-500 uppercase">Responsável</label>
                              <input type="text" value={data.responsible} onChange={e => handleInputChange('responsible', e.target.value)} className="w-full p-3 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1" />
                          </div>
                      </div>
                      <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Stakeholders Envolvidos</label>
                          <input type="text" value={data.stakeholders} onChange={e => handleInputChange('stakeholders', e.target.value)} className="w-full p-3 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1" placeholder="Ex: Diretor de TI, CFO..." />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                          <div>
                              <label className="text-[10px] font-bold text-gray-500 uppercase">Tipo de Iniciativa</label>
                              <div className="relative">
                                  <select value={data.initiativeType} onChange={e => handleInputChange('initiativeType', e.target.value)} className="w-full p-3 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1 appearance-none cursor-pointer">
                                      <option value="">Selecione...</option>
                                      <option value="Interna">Interna</option>
                                      <option value="Externa">Externa</option>
                                      <option value="Mista">Mista</option>
                                  </select>
                                  <ChevronRight className="absolute right-3 top-1/2 mt-0.5 -translate-y-1/2 text-gray-400 rotate-90" size={14} />
                              </div>
                          </div>
                          <div>
                              <label className="text-[10px] font-bold text-gray-500 uppercase">Estágio (Innovation Gate)</label>
                              <div className="relative">
                                  <select value={data.stage} onChange={e => handleInputChange('stage', e.target.value)} className="w-full p-3 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1 appearance-none cursor-pointer">
                                      <option value="">Selecione...</option>
                                      <option value="Ideação">Ideação</option>
                                      <option value="Descoberta">Descoberta</option>
                                      <option value="Validação">Validação</option>
                                      <option value="Escala">Escala</option>
                                  </select>
                                  <ChevronRight className="absolute right-3 top-1/2 mt-0.5 -translate-y-1/2 text-gray-400 rotate-90" size={14} />
                              </div>
                          </div>
                      </div>
                      <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Tema de Inovação Relacionada</label>
                          <input type="text" value={data.innovationTheme} onChange={e => handleInputChange('innovationTheme', e.target.value)} className="w-full p-3 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1" />
                      </div>
                      <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Objetivo Estratégico</label>
                          <input type="text" value={data.strategicGoal} onChange={e => handleInputChange('strategicGoal', e.target.value)} className="w-full p-3 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1" />
                      </div>
                      <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Problema que resolve</label>
                          <textarea value={data.problem} onChange={e => handleInputChange('problem', e.target.value)} className="w-full p-3 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1" rows={2} />
                      </div>
                      <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Oportunidade Identificada (Quantitativa)</label>
                          <textarea value={data.opportunity} onChange={e => handleInputChange('opportunity', e.target.value)} className="w-full p-3 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1" rows={2} />
                      </div>
                  </div>
              </div>
          );
        
        case 2: // Operacional
          return (
              <div className="animate-fadeIn">
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-6 dark:text-white">
                      <Zap className="text-brand-accent"/> Operacional (VE)
                  </h3>
                   <div className="space-y-6">
                      <div>
                          <label className="text-[10px] font-bold text-brand-accent uppercase mb-2 block">Tipo de Valor Econômico (VE)</label>
                          <div className="relative">
                            <select value={data.valueType} onChange={e => handleInputChange('valueType', e.target.value)} className="w-full p-3 border-2 border-brand-accent/30 bg-brand-accent/5 rounded-md dark:bg-slate-800 dark:border-brand-accent/20 mt-1 font-bold text-slate-700 dark:text-white appearance-none cursor-pointer">
                                {VALUE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <ChevronRight className="absolute right-3 top-1/2 mt-0.5 -translate-y-1/2 text-brand-accent rotate-90" size={16} />
                          </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                          <div>
                              <label className="text-[10px] font-bold text-gray-500 uppercase">Custo Atual (Unidade)</label>
                              <CurrencyInput value={data.financials?.unitCostCurrent} onChange={val => handleInputChange('unitCostCurrent', val, 'financials')} className="w-full p-3 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1" />
                          </div>
                          <div>
                              <label className="text-[10px] font-bold text-gray-500 uppercase">Novo Custo Estimado</label>
                              <CurrencyInput value={data.financials?.unitCostNew} onChange={val => handleInputChange('unitCostNew', val, 'financials')} className="w-full p-3 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1" />
                          </div>
                      </div>
                      <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Volume Mensal Impactado</label>
                          <input type="number" min="0" value={data.financials?.monthlyVolume || ''} onChange={e => handleInputChange('monthlyVolume', Number(e.target.value), 'financials')} className="w-full p-3 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1" />
                      </div>
                   </div>
              </div>
          );

        case 3: // Custos
           return (
              <div className="animate-fadeIn">
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-6 dark:text-white">
                      <DollarSign className="text-brand-accent"/> Custos (CPOC)
                  </h3>
                  
                  <div className="space-y-6">
                      <div>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3 pb-1 border-b dark:border-slate-800">3.1 Custos Diretos</h4>
                          <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                  <label className="text-[10px] font-bold text-gray-500 uppercase">Custo de Startup</label>
                                  <CurrencyInput value={data.financials?.startupCost} onChange={val => handleInputChange('startupCost', val, 'financials')} className="w-full p-3 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1" />
                              </div>
                              <div>
                                  <label className="text-[10px] font-bold text-gray-500 uppercase">Taxas / Comissões</label>
                                  <CurrencyInput value={data.financials?.externalFees} onChange={val => handleInputChange('externalFees', val, 'financials')} className="w-full p-3 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1" />
                              </div>
                              <div>
                                  <label className="text-[10px] font-bold text-gray-500 uppercase">Licenças</label>
                                  <CurrencyInput value={data.financials?.licenses} onChange={val => handleInputChange('licenses', val, 'financials')} className="w-full p-3 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1" />
                              </div>
                              <div>
                                  <label className="text-[10px] font-bold text-gray-500 uppercase">Serviços de Terceiros</label>
                                  <CurrencyInput value={data.financials?.servicesCost} onChange={val => handleInputChange('servicesCost', val, 'financials')} className="w-full p-3 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1" />
                              </div>
                          </div>
                      </div>

                      <div>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3 pb-1 border-b dark:border-slate-800">3.2 Custos Indiretos</h4>
                          <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                  <label className="text-[10px] font-bold text-gray-500 uppercase">Valor Hora Equipe (Vh)</label>
                                  <CurrencyInput value={data.financials?.hourlyRate} onChange={val => handleInputChange('hourlyRate', val, 'financials')} className="w-full p-3 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1" />
                              </div>
                              <div>
                                  <label className="text-[10px] font-bold text-gray-500 uppercase">Horas/Mês Dedicadas</label>
                                  <input type="number" min="0" value={data.financials?.hoursPerMonth || ''} onChange={e => handleInputChange('hoursPerMonth', Number(e.target.value), 'financials')} className="w-full p-3 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1" />
                              </div>
                              <div>
                                  <label className="text-[10px] font-bold text-gray-500 uppercase">Qtd Pessoas</label>
                                  <input type="number" min="1" value={data.financials?.teamSize || ''} onChange={e => handleInputChange('teamSize', Number(e.target.value), 'financials')} className="w-full p-3 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1" />
                              </div>
                              <div>
                                  <label className="text-[10px] font-bold text-gray-500 uppercase">Outras Despesas</label>
                                  <CurrencyInput value={data.financials?.otherExpenses} onChange={val => handleInputChange('otherExpenses', val, 'financials')} className="w-full p-3 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1" />
                              </div>
                          </div>
                      </div>

                      <div>
                           <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3 pb-1 border-b dark:border-slate-800">3.3 Duração</h4>
                           <div className="grid md:grid-cols-2 gap-4">
                               <div>
                                  <label className="text-[10px] font-bold text-gray-500 uppercase">Duração da POC (Meses)</label>
                                  <input type="number" min="1" value={data.financials?.monthsToImplement || ''} onChange={e => handleInputChange('monthsToImplement', Number(e.target.value), 'financials')} className="w-full p-3 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1" />
                               </div>
                               <div>
                                  <label className="text-[10px] font-bold text-gray-500 uppercase">Tempo de Implementação Escala (Meses)</label>
                                  <input type="number" min="0" value={data.financials?.scaleImplementationMonths || ''} onChange={e => handleInputChange('scaleImplementationMonths', Number(e.target.value), 'financials')} className="w-full p-3 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1" />
                               </div>
                           </div>
                      </div>
                  </div>
              </div>
           );

        case 4: // Premissas
           return (
              <div className="animate-fadeIn">
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-6 dark:text-white">
                      <Layers className="text-brand-accent"/> Premissas
                  </h3>
                   <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                          <div>
                              <label className="text-[10px] font-bold text-gray-500 uppercase">Volume Mensal Previsível</label>
                              <input type="number" value={data.premises?.volumePredictable || ''} onChange={e => handleInputChange('volumePredictable', Number(e.target.value), 'premises')} className="w-full p-3 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1" />
                          </div>
                          <div>
                              <label className="text-[10px] font-bold text-gray-500 uppercase">Frequência de Uso</label>
                              <input type="text" value={data.premises?.frequency || ''} onChange={e => handleInputChange('frequency', e.target.value, 'premises')} className="w-full p-3 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1" />
                          </div>
                      </div>
                      <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Sazonalidade</label>
                          <input type="text" value={data.premises?.seasonality || ''} onChange={e => handleInputChange('seasonality', e.target.value, 'premises')} className="w-full p-3 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1" />
                      </div>
                      <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Restrições da Operação</label>
                          <input type="text" value={data.premises?.restrictions || ''} onChange={e => handleInputChange('restrictions', e.target.value, 'premises')} className="w-full p-3 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1" />
                      </div>
                      <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Dependências Críticas</label>
                          <input type="text" value={data.premises?.dependencies || ''} onChange={e => handleInputChange('dependencies', e.target.value, 'premises')} className="w-full p-3 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1" />
                      </div>
                   </div>
              </div>
           );
        
        case 5: // Cenários
           const renderScenarioInputs = (type: 'realistic' | 'optimistic' | 'pessimistic', label: string) => (
             <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-4 mb-4">
                <h4 className="text-sm font-bold uppercase mb-3 text-slate-700 dark:text-gray-300">{label}</h4>
                <div className="grid grid-cols-3 gap-3">
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Custo Base</label>
                        <CurrencyInput value={data.proScenarios?.[type].baseCost} onChange={val => handleScenarioChange(type, 'baseCost', val)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:border-slate-600" />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Volume</label>
                        <input type="number" value={data.proScenarios?.[type].volume || ''} onChange={e => handleScenarioChange(type, 'volume', Number(e.target.value))} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:border-slate-600" />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Economia (Unit)</label>
                        <CurrencyInput value={data.proScenarios?.[type].unitSavings} onChange={val => handleScenarioChange(type, 'unitSavings', val)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:border-slate-600" />
                    </div>
                </div>
             </div>
           );

           return (
               <div className="animate-fadeIn">
                   <h3 className="text-lg font-bold flex items-center gap-2 mb-6 dark:text-white">
                      <TrendingUp className="text-brand-accent"/> Cenários
                  </h3>
                   <div className="space-y-2">
                       {renderScenarioInputs('realistic', 'Cenário Realista')}
                       {renderScenarioInputs('optimistic', 'Cenário Otimista')}
                       {renderScenarioInputs('pessimistic', 'Cenário Pessimista')}
                   </div>
               </div>
           );

        case 6: // ICV
           return (
              <div className="animate-fadeIn">
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-6 dark:text-white">
                      <Check className="text-brand-accent"/> ICV (Índice de Confiança)
                  </h3>
                   <div className="space-y-3">
                        {ICV_QUESTIONS.map((q, idx) => (
                            <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded border border-gray-100 dark:border-slate-700">
                                <span className="text-sm font-medium mb-2 md:mb-0 pr-4 text-slate-700 dark:text-gray-200">{q}</span>
                                <div className="flex gap-2 flex-shrink-0">
                                    <button onClick={() => handleICVChange(idx, 1)} className={`w-16 py-1.5 rounded text-[10px] font-bold uppercase transition-all border ${data.icvAnswers?.[idx] === 1 ? 'bg-brand-accent text-brand-primary border-brand-accent' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'}`}>Sim</button>
                                    <button onClick={() => handleICVChange(idx, 0.5)} className={`w-16 py-1.5 rounded text-[10px] font-bold uppercase transition-all border ${data.icvAnswers?.[idx] === 0.5 ? 'bg-brand-accent text-brand-primary border-brand-accent' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'}`}>Parcial</button>
                                    <button onClick={() => handleICVChange(idx, 0)} className={`w-16 py-1.5 rounded text-[10px] font-bold uppercase transition-all border ${data.icvAnswers?.[idx] === 0 ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'}`}>Não</button>
                                </div>
                            </div>
                        ))}
                   </div>
              </div>
           );

        case 7: // Riscos Grid
            return (
                <div className="animate-fadeIn">
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-6 dark:text-white">
                      <AlertTriangle className="text-brand-accent"/> Objeções/Riscos
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {PRO_RISK_CATEGORIES.map(category => {
                            const level = getRiskLevel(category);
                            return (
                                <div key={category} className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-800/50">
                                    <p className="text-xs font-bold uppercase text-gray-500 mb-3">{category}</p>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleRiskChangePro(category, 'Baixo')}
                                            className={`flex-1 py-1.5 rounded text-[10px] font-bold uppercase border transition-all ${level === 'Baixo' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-transparent text-gray-400 border-gray-200'}`}
                                        >
                                            Baixo
                                        </button>
                                        <button 
                                            onClick={() => handleRiskChangePro(category, 'Médio')}
                                            className={`flex-1 py-1.5 rounded text-[10px] font-bold uppercase border transition-all ${level === 'Médio' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-transparent text-gray-400 border-gray-200'}`}
                                        >
                                            Médio
                                        </button>
                                        <button 
                                            onClick={() => handleRiskChangePro(category, 'Alto')}
                                            className={`flex-1 py-1.5 rounded text-[10px] font-bold uppercase border transition-all ${level === 'Alto' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-transparent text-gray-400 border-gray-200'}`}
                                        >
                                            Alto
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            );

        case 8: // Portfólio
            return (
               <div className="animate-fadeIn">
                   <h3 className="text-lg font-bold flex items-center gap-2 mb-6 dark:text-white">
                      <Briefcase className="text-brand-accent"/> Portfólio
                   </h3>
                   <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Horizonte de Inovação</label>
                                <div className="relative mt-1">
                                    <select value={data.portfolio?.horizon} onChange={e => handleInputChange('horizon', e.target.value, 'portfolio')} className="w-full p-3 border rounded-md dark:bg-slate-800 dark:border-slate-700 appearance-none cursor-pointer">
                                        <option value="H1 - Incremental">H1 - Incremental</option>
                                        <option value="H2 - Adjacente">H2 - Adjacente</option>
                                        <option value="H3 - Disruptiva">H3 - Disruptiva</option>
                                    </select>
                                    <ChevronRight className="absolute right-3 top-1/2 mt-0.5 -translate-y-1/2 text-gray-400 rotate-90" size={14} />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Complexidade</label>
                                <div className="relative mt-1">
                                    <select value={data.portfolio?.complexity} onChange={e => handleInputChange('complexity', e.target.value, 'portfolio')} className="w-full p-3 border rounded-md dark:bg-slate-800 dark:border-slate-700 appearance-none cursor-pointer">
                                        <option value="Baixa">Baixa</option>
                                        <option value="Média">Média</option>
                                        <option value="Alta">Alta</option>
                                    </select>
                                    <ChevronRight className="absolute right-3 top-1/2 mt-0.5 -translate-y-1/2 text-gray-400 rotate-90" size={14} />
                                </div>
                            </div>
                        </div>
                         <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Grau de Incerteza</label>
                            <div className="relative mt-1">
                                <select value={data.portfolio?.uncertainty} onChange={e => handleInputChange('uncertainty', e.target.value, 'portfolio')} className="w-full p-3 border rounded-md dark:bg-slate-800 dark:border-slate-700 appearance-none cursor-pointer">
                                    <option value="Baixo">Baixo</option>
                                    <option value="Médio">Médio</option>
                                    <option value="Alto">Alto</option>
                                    <option value="Extremo">Extremo</option>
                                </select>
                                <ChevronRight className="absolute right-3 top-1/2 mt-0.5 -translate-y-1/2 text-gray-400 rotate-90" size={14} />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Impacto no Cliente</label>
                            <input type="text" value={data.portfolio?.clientImpact || ''} onChange={e => handleInputChange('clientImpact', e.target.value, 'portfolio')} className="w-full p-3 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Impacto Interno</label>
                            <input type="text" value={data.portfolio?.internalImpact || ''} onChange={e => handleInputChange('internalImpact', e.target.value, 'portfolio')} className="w-full p-3 border rounded-md dark:bg-slate-800 dark:border-slate-700 mt-1" />
                        </div>
                   </div>
               </div>
            );

        default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-100 dark:border-slate-800 overflow-hidden min-h-[700px] relative">
      {showRestorePrompt && (
        <div className="bg-blue-50 p-3 flex justify-between items-center text-sm text-blue-800">
          <span>Rascunho de {draftFoundDate} encontrado.</span>
          <div className="gap-2 flex">
            <button onClick={discardDraft} className="underline">Descartar</button>
            <button onClick={restoreDraft} className="font-bold">Restaurar</button>
          </div>
        </div>
      )}

      {step === 0 && (
         <div className="p-8 h-full flex flex-col justify-center min-h-[700px]">
             {renderModeSelection()}
         </div>
      )}

      {/* LIGHT MODE */}
      {step > 0 && mode === 'LIGHT' && (
        <div className="p-8">
            {renderLightModeForm()}
        </div>
      )}

      {/* PRO MODE */}
      {step > 0 && mode === 'PRO' && (
         <div className="flex flex-col md:flex-row h-full min-h-[700px]">
             {renderProSidebar()}
             
             <div className="flex-1 p-8 overflow-y-auto">
                 {/* Header to Switch Back */}
                 <div className="bg-slate-900 text-white p-6 rounded-xl mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Briefcase className="text-brand-accent"/> Novo Projeto
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">Modo Pro: Análise Completa</p>
                    </div>
                    <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                        <button onClick={() => switchMode('LIGHT')} className="px-4 py-2 text-slate-400 hover:text-white rounded text-xs uppercase tracking-wide transition-all">Discovery</button>
                        <button className="px-4 py-2 bg-white text-slate-900 font-bold rounded shadow-sm text-xs uppercase tracking-wide transition-all">Professional</button>
                    </div>
                </div>

                 {renderProStepContent()}

                 <div className="mt-12 pt-6 border-t dark:border-slate-800 flex justify-between">
                     <button 
                        onClick={() => setStep(s => Math.max(1, s - 1))} 
                        disabled={step === 1}
                        className="text-gray-500 font-bold text-sm disabled:opacity-30 hover:text-brand-primary"
                     >
                         Anterior
                     </button>
                     {step < 8 ? (
                         <button 
                            onClick={() => setStep(s => s + 1)} 
                            className="bg-brand-primary text-white px-6 py-2 rounded-lg text-sm font-bold"
                         >
                             Próximo
                         </button>
                     ) : (
                         <button 
                            onClick={handleSave} 
                            disabled={isSaving}
                            className="bg-brand-accent text-brand-primary px-6 py-2 rounded-lg text-sm font-bold shadow-lg hover:opacity-90"
                         >
                             {isSaving ? 'Processando...' : 'Gerar Relatório Completo'}
                         </button>
                     )}
                 </div>
             </div>
         </div>
      )}
    </div>
  );
};

export default ProjectWizard;