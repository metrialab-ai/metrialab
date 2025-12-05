import React, { useState, useEffect } from 'react';
import { ProjectMode, Project, ValueType, Risk } from '../types';
import { VALUE_TYPES, RISK_CATEGORIES } from '../constants';
import { db } from '../services/db';
import { ChevronRight, ChevronLeft, Save, FileText, DollarSign, Zap, Target, AlertTriangle, Edit3 } from 'lucide-react';

interface WizardProps {
  onComplete: () => void;
}

const ProjectWizard: React.FC<WizardProps> = ({ onComplete }) => {
  const [mode, setMode] = useState<ProjectMode | null>(null);
  const [step, setStep] = useState(0);
  
  // Estado estendido para comportar todos os campos do Light
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
      totalHours: 0,
      unitCostCurrent: 0,
      unitCostNew: 0,
      monthlyVolume: 0,
      monthlySavings: 0,
      monthlyRevenue: 0
    },
    risks: [],
    scenarios: []
  });

  // Estado local para os checkboxes de risco do Light
  const [lightRisks, setLightRisks] = useState({
    tiDependency: false,
    dataLack: false,
    lowCapability: false,
    budgetLack: false,
    internalResistance: false
  });

  const currentUser = db.getCurrentUser();

  const handleInputChange = (field: string, value: any, nested?: string) => {
    if (nested === 'financials') {
      setData(prev => ({
        ...prev,
        financials: { ...prev.financials!, [field]: value }
      }));
    } else {
      setData(prev => ({ ...prev, [field]: value }));
    }
  };

  // Cálculo automático de economia baseado em custos unitários
  useEffect(() => {
    if (data.financials?.unitCostCurrent && data.financials?.unitCostNew && data.financials?.monthlyVolume) {
      const savingPerUnit = data.financials.unitCostCurrent - data.financials.unitCostNew;
      const totalSavings = savingPerUnit * data.financials.monthlyVolume;
      if (totalSavings > 0) {
        handleInputChange('monthlySavings', totalSavings, 'financials');
      }
    }
  }, [data.financials?.unitCostCurrent, data.financials?.unitCostNew, data.financials?.monthlyVolume]);

  const steps = mode === 'LIGHT' 
    ? ['Modelo', 'Formulário Light']
    : ['Modelo', 'Dados Gerais', 'Operacional', 'Custos', 'Riscos', 'Revisão'];

  const calculateROI = () => {
    const fin = data.financials!;
    const monthlyGain = (fin.monthlyRevenue || 0) + (fin.monthlySavings || 0);
    const totalGain = monthlyGain * fin.lifespanMonths;
    const netReturn = totalGain - fin.investment;
    const roi = fin.investment > 0 ? (netReturn / fin.investment) * 100 : 0;
    return Math.round(roi);
  };

  const calculateScore = () => {
    let score = 50; 
    if (data.mode === 'PRO') score += 20;
    if (data.financials!.investment < 50000) score += 10;
    if ((data.financials!.monthlySavings || 0) > 1000) score += 10;
    
    // Penalizar riscos marcados no light
    const riskCount = Object.values(lightRisks).filter(Boolean).length;
    score -= (riskCount * 5);

    return Math.max(0, Math.min(100, score));
  };

  const handleSave = () => {
    if (!currentUser) return;

    // Converter riscos booleanos do Light para o formato padrão Risk[]
    const finalRisks: Risk[] = [...(data.risks || [])];
    if (lightRisks.tiDependency) finalRisks.push({ category: 'Dependência de TI', level: 'Alto' });
    if (lightRisks.dataLack) finalRisks.push({ category: 'Falta de Dados', level: 'Alto' });
    if (lightRisks.lowCapability) finalRisks.push({ category: 'Baixa Capacidade', level: 'Médio' });
    if (lightRisks.budgetLack) finalRisks.push({ category: 'Falta de Orçamento', level: 'Alto' });
    if (lightRisks.internalResistance) finalRisks.push({ category: 'Resistência Interna', level: 'Médio' });
    
    const project: Project = {
      id: crypto.randomUUID(),
      userId: currentUser.email,
      name: data.name || 'Projeto Sem Nome',
      createdAt: new Date().toISOString(),
      mode: mode!,
      status: 'Ativo',
      financials: data.financials!,
      area: data.area,
      responsible: data.responsible,
      valueType: data.valueType,
      mainGoal: data.mainGoal,
      keyIndicator: data.keyIndicator,
      businessImpact: data.businessImpact,
      comments: data.comments,
      risks: finalRisks,
      roi: calculateROI(),
      score: calculateScore()
    };

    db.saveProject(project);
    onComplete();
  };

  const renderModeSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <span className="bg-brand-accent text-brand-primary text-xs font-bold px-3 py-1 rounded uppercase tracking-wide">Plataforma de Innovation Accounting</span>
        <h2 className="text-3xl font-bold mt-2 dark:text-white">Analise a Viabilidade do seu Negócio</h2>
        <p className="text-gray-500 max-w-2xl mx-auto mt-2">Utilize nossos modelos financeiros e inteligência artificial para calcular ROI, Payback e mitigar riscos antes de investir.</p>
      </div>

      <div className="bg-brand-primary p-6 rounded-t-xl">
        <h3 className="text-white font-bold text-xl flex items-center gap-2">
           <Zap className="text-brand-accent" /> Novo Projeto
        </h3>
        <p className="text-slate-400 text-sm">Selecione o modelo de análise adequado para o estágio do seu projeto.</p>
      </div>

      <div className="grid md:grid-cols-2">
        <button 
          onClick={() => setMode('LIGHT')}
          className={`p-4 text-center border-b-4 transition-all ${mode === 'LIGHT' ? 'bg-white border-brand-accent text-brand-primary font-bold shadow-lg z-10' : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200'}`}
        >
          MODELO LIGHT (GRATUITO)
        </button>
        <button 
          onClick={() => setMode('PRO')}
          className={`p-4 text-center border-b-4 transition-all ${mode === 'PRO' ? 'bg-white border-brand-accent text-brand-primary font-bold shadow-lg z-10' : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200'}`}
        >
          MODELO PRO (COMPLETO)
        </button>
      </div>
      
      {mode === null && (
        <div className="p-12 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-b-xl">
          Selecione um modelo acima para começar
        </div>
      )}
    </div>
  );

  // Formulário Light - Estilo "One Page" conforme anexo
  const renderLightForm = () => (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Seção 1: Dados Gerais */}
      <section className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
        <h3 className="flex items-center gap-2 text-lg font-bold text-brand-primary dark:text-white mb-6">
          <FileText className="text-brand-accent" size={20} /> 1. Dados Gerais
        </h3>
        
        <div className="grid gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Projeto</label>
            <input 
              type="text" 
              placeholder="Ex: Projeto Beta"
              value={data.name} 
              onChange={(e) => handleInputChange('name', e.target.value)} 
              className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-brand-accent focus:border-transparent dark:bg-slate-700 dark:border-slate-600"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Área Solicitante</label>
              <input 
                type="text" 
                value={data.area} 
                onChange={(e) => handleInputChange('area', e.target.value)} 
                className="w-full p-2.5 border border-gray-300 rounded dark:bg-slate-700 dark:border-slate-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Responsável</label>
              <input 
                type="text" 
                value={data.responsible} 
                onChange={(e) => handleInputChange('responsible', e.target.value)} 
                className="w-full p-2.5 border border-gray-300 rounded dark:bg-slate-700 dark:border-slate-600"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tipo de Valor Econômico (KPI)</label>
            <div className="grid grid-cols-3 gap-2">
              {VALUE_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => handleInputChange('valueType', type)}
                  className={`py-2 px-1 text-xs font-bold uppercase rounded border transition-all ${
                    data.valueType === type 
                    ? 'bg-brand-accent/20 border-brand-accent text-brand-primary' 
                    : 'bg-white border-gray-200 text-gray-400 hover:border-brand-accent'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Seção 2: Custos Estimados */}
      <section className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
        <h3 className="flex items-center gap-2 text-lg font-bold text-brand-primary dark:text-white mb-6">
          <DollarSign className="text-brand-accent" size={20} /> 2. Custos Estimados
        </h3>
        
        <div className="grid gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Custo Total Estimado da Solução (Direto)</label>
            <input 
              type="number" 
              placeholder="0"
              value={data.financials?.investment} 
              onChange={(e) => handleInputChange('investment', Number(e.target.value), 'financials')} 
              className="w-full p-2.5 border border-gray-300 rounded dark:bg-slate-700 dark:border-slate-600"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Taxas / Comissões Extras</label>
              <input 
                type="number" 
                value={data.financials?.externalFees} 
                onChange={(e) => handleInputChange('externalFees', Number(e.target.value), 'financials')} 
                className="w-full p-2.5 border border-gray-300 rounded dark:bg-slate-700 dark:border-slate-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Duração Proj. (Meses)</label>
              <input 
                type="number" 
                value={data.financials?.monthsToImplement} 
                onChange={(e) => handleInputChange('monthsToImplement', Number(e.target.value), 'financials')} 
                className="w-full p-2.5 border border-gray-300 rounded dark:bg-slate-700 dark:border-slate-600"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Valor Hora Médio (RH)</label>
              <input 
                type="number" 
                placeholder="0"
                value={data.financials?.hourlyRate} 
                onChange={(e) => handleInputChange('hourlyRate', Number(e.target.value), 'financials')} 
                className="w-full p-2.5 border border-gray-300 rounded dark:bg-slate-700 dark:border-slate-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Total de Horas</label>
              <input 
                type="number" 
                placeholder="0"
                value={data.financials?.totalHours} 
                onChange={(e) => handleInputChange('totalHours', Number(e.target.value), 'financials')} 
                className="w-full p-2.5 border border-gray-300 rounded dark:bg-slate-700 dark:border-slate-600"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Seção 3: Dados de Valor (KPI) */}
      <section className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
        <h3 className="flex items-center gap-2 text-lg font-bold text-brand-primary dark:text-white mb-6">
          <Zap className="text-brand-accent" size={20} /> 3. Dados de Valor (Uk)
        </h3>
        
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Custo Atual (Unidade)</label>
              <input 
                type="number" 
                value={data.financials?.unitCostCurrent} 
                onChange={(e) => handleInputChange('unitCostCurrent', Number(e.target.value), 'financials')} 
                className="w-full p-2.5 border border-gray-300 rounded dark:bg-slate-700 dark:border-slate-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Novo Custo Estimado</label>
              <input 
                type="number" 
                value={data.financials?.unitCostNew} 
                onChange={(e) => handleInputChange('unitCostNew', Number(e.target.value), 'financials')} 
                className="w-full p-2.5 border border-gray-300 rounded dark:bg-slate-700 dark:border-slate-600"
              />
            </div>
          </div>
           <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Volume Mensal Impactado</label>
            <input 
              type="number" 
              value={data.financials?.monthlyVolume} 
              onChange={(e) => handleInputChange('monthlyVolume', Number(e.target.value), 'financials')} 
              className="w-full p-2.5 border border-gray-300 rounded dark:bg-slate-700 dark:border-slate-600"
            />
          </div>
        </div>
      </section>

      {/* Seção 4: Resultado Esperado */}
      <section className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
        <h3 className="flex items-center gap-2 text-lg font-bold text-brand-primary dark:text-white mb-6">
          <Target className="text-brand-accent" size={20} /> 4. Resultado Esperado
        </h3>
        
        <div className="grid gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Meta Principal do Projeto</label>
            <input 
              type="text" 
              value={data.mainGoal} 
              onChange={(e) => handleInputChange('mainGoal', e.target.value)} 
              className="w-full p-2.5 border border-gray-300 rounded dark:bg-slate-700 dark:border-slate-600"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Indicador Chave Afetado</label>
            <input 
              type="text" 
              value={data.keyIndicator} 
              onChange={(e) => handleInputChange('keyIndicator', e.target.value)} 
              className="w-full p-2.5 border border-gray-300 rounded dark:bg-slate-700 dark:border-slate-600"
            />
          </div>
           <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Impacto Esperado no Negócio</label>
            <input 
              type="text" 
              value={data.businessImpact} 
              onChange={(e) => handleInputChange('businessImpact', e.target.value)} 
              className="w-full p-2.5 border border-gray-300 rounded dark:bg-slate-700 dark:border-slate-600"
            />
          </div>
        </div>
      </section>

      {/* Seção 5: Riscos Principais */}
      <section className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
        <h3 className="flex items-center gap-2 text-lg font-bold text-brand-primary dark:text-white mb-6">
          <AlertTriangle className="text-brand-accent" size={20} /> 5. Riscos Principais
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            <input type="checkbox" checked={lightRisks.tiDependency} onChange={e => setLightRisks({...lightRisks, tiDependency: e.target.checked})} className="w-5 h-5 text-brand-accent rounded focus:ring-brand-accent" />
            <span className="text-sm font-medium">Dependência de TI</span>
          </label>
          <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            <input type="checkbox" checked={lightRisks.dataLack} onChange={e => setLightRisks({...lightRisks, dataLack: e.target.checked})} className="w-5 h-5 text-brand-accent rounded focus:ring-brand-accent" />
            <span className="text-sm font-medium">Falta de Dados</span>
          </label>
          <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            <input type="checkbox" checked={lightRisks.lowCapability} onChange={e => setLightRisks({...lightRisks, lowCapability: e.target.checked})} className="w-5 h-5 text-brand-accent rounded focus:ring-brand-accent" />
            <span className="text-sm font-medium">Baixa Capacidade Startup</span>
          </label>
          <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            <input type="checkbox" checked={lightRisks.budgetLack} onChange={e => setLightRisks({...lightRisks, budgetLack: e.target.checked})} className="w-5 h-5 text-brand-accent rounded focus:ring-brand-accent" />
            <span className="text-sm font-medium">Falta de Orçamento</span>
          </label>
           <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            <input type="checkbox" checked={lightRisks.internalResistance} onChange={e => setLightRisks({...lightRisks, internalResistance: e.target.checked})} className="w-5 h-5 text-brand-accent rounded focus:ring-brand-accent" />
            <span className="text-sm font-medium">Resistência Interna</span>
          </label>
        </div>
      </section>

      {/* Seção 6: Observações Finais */}
      <section className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
        <h3 className="flex items-center gap-2 text-lg font-bold text-brand-primary dark:text-white mb-6">
          <Edit3 className="text-brand-accent" size={20} /> 6. Observações Finais
        </h3>
        
        <textarea 
          value={data.comments} 
          onChange={(e) => handleInputChange('comments', e.target.value)} 
          placeholder="Informações adicionais relevantes..."
          className="w-full p-4 border border-gray-300 rounded-lg min-h-[100px] dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-brand-accent focus:border-transparent"
        />
      </section>

      <button
        onClick={handleSave}
        className="w-full py-4 bg-brand-primary text-white font-bold text-lg rounded-xl hover:bg-slate-700 transition-all shadow-lg flex items-center justify-center gap-2"
      >
        Gerar Relatório Light <ChevronRight />
      </button>
    </div>
  );

  // Renderização condicional para o modo PRO (Mantido simplificado por enquanto)
  const renderProSteps = () => {
      // Implementação simplificada do fluxo antigo para o PRO
      if (step === 1) return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold dark:text-white">Dados Gerais (PRO)</h3>
            <input 
              type="text" 
              placeholder="Nome do Projeto"
              value={data.name} 
              onChange={(e) => handleInputChange('name', e.target.value)} 
              className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-600"
            />
            {/* ... Outros campos PRO ... */}
        </div>
      );
      // ... Outros steps ...
      return (
        <div className="text-center py-10">
            <p>Configuração do Modo PRO em desenvolvimento.</p>
        </div>
      );
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-100 dark:border-slate-800 overflow-hidden min-h-[800px]">
      
      {/* Se estiver no passo inicial de seleção */}
      {step === 0 && renderModeSelection()}

      {/* Conteúdo do Formulário */}
      {step > 0 && (
        <div className="p-8">
            {mode === 'LIGHT' ? renderLightForm() : (
                <>
                    {/* Barra de progresso para o PRO */}
                    <div className="flex mb-8">
                        {steps.map((s, i) => (
                        <div key={i} className="flex items-center flex-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            i <= step ? 'bg-brand-primary text-brand-accent' : 'bg-gray-200 text-gray-500 dark:bg-slate-700'
                            }`}>
                            {i}
                            </div>
                            <div className={`hidden md:block ml-2 text-sm ${i <= step ? 'font-bold text-brand-primary dark:text-white' : 'text-gray-400'}`}>{s}</div>
                            {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-4 ${i < step ? 'bg-brand-primary' : 'bg-gray-200 dark:bg-slate-700'}`} />}
                        </div>
                        ))}
                    </div>
                    {renderProSteps()}
                    <div className="flex justify-between mt-8 border-t dark:border-slate-800 pt-6">
                        <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 px-6 py-2 rounded-lg hover:bg-gray-100">
                             <ChevronLeft size={20} /> Voltar
                        </button>
                        <button onClick={() => setStep(s => s + 1)} className="flex items-center gap-2 px-6 py-2 bg-brand-primary text-white rounded-lg">
                            Próximo <ChevronRight size={20} />
                        </button>
                    </div>
                </>
            )}
        </div>
      )}

      {/* Botão de Avançar da tela de seleção */}
      {step === 0 && mode && (
         <div className="p-6 bg-gray-50 dark:bg-slate-800 border-t dark:border-slate-700 flex justify-end">
            <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 px-8 py-3 bg-brand-primary text-white font-bold rounded-lg hover:bg-slate-700 transition-colors"
            >
                Iniciar Preenchimento <ChevronRight size={20} />
            </button>
         </div>
      )}
    </div>
  );
};

export default ProjectWizard;
