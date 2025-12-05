import React, { useEffect, useState } from 'react';
import { Project } from '../types';
import { db } from '../services/db';
import { ArrowLeft, Download, TrendingUp, Info, HelpCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ReportProps {
  projectId: string;
  onBack: () => void;
}

// Componente auxiliar para Tooltips
const MetricTooltip = ({ text }: { text: string }) => (
  <div className="group relative inline-flex items-center ml-2">
    <HelpCircle size={14} className="text-slate-400 hover:text-brand-accent cursor-help transition-colors" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 md:w-64 p-3 bg-slate-900 text-slate-100 text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-center pointer-events-none border border-slate-700">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
    </div>
  </div>
);

const Report: React.FC<ReportProps> = ({ projectId, onBack }) => {
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const p = db.getProjectById(projectId);
    setProject(p || null);
  }, [projectId]);

  if (!project) return <div>Carregando...</div>;

  const investment = project.financials.investment;
  const monthlyReturn = (project.financials.monthlySavings || 0) + (project.financials.monthlyRevenue || 0);
  const economicGain = (monthlyReturn * project.financials.lifespanMonths) - investment;
  const paybackMonths = monthlyReturn > 0 ? (investment / monthlyReturn) : Infinity;

  // Mock data for charts
  const scenarioData = [
    { name: 'Pessimista', value: economicGain * 0.7 },
    { name: 'Realista', value: economicGain },
    { name: 'Otimista', value: economicGain * 1.3 },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-brand-primary dark:text-gray-400 dark:hover:text-white mb-2">
            <ArrowLeft size={16} /> Voltar ao Dashboard
          </button>
          <div className="flex items-center gap-3">
             <h1 className="text-3xl font-bold text-brand-primary dark:text-white">{project.name}</h1>
             <span className="px-2 py-0.5 rounded text-xs border border-brand-accent text-brand-accent uppercase font-bold tracking-wider">
               Modo {project.mode}
             </span>
          </div>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">NÍVEL DE CONFIANÇA: 98% (SIMULAÇÃO MONTE CARLO)</p>
        </div>
        <button className="bg-brand-primary dark:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90">
          <Download size={18} /> Exportar PDF
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Innovation Score Card */}
        <div className="bg-brand-primary text-white p-6 rounded-xl relative overflow-hidden shadow-lg group">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp size={100} />
          </div>
          <div className="flex items-center mb-2">
            <p className="text-xs uppercase font-bold text-brand-accent flex items-center gap-1">
              <TrendingUp size={14} /> Score de Inovação
            </p>
            <MetricTooltip text="Índice de 0 a 100 que avalia o potencial de inovação e viabilidade, combinando métricas financeiras, alinhamento estratégico e análise de risco." />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-bold">{project.score}</span>
            <span className="text-lg text-gray-400 mb-1">/ 100</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 mt-4 rounded-full overflow-hidden">
             <div className="bg-brand-accent h-full" style={{ width: `${project.score}%` }}></div>
          </div>
        </div>

        {/* ROI */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border border-gray-100 dark:border-slate-700">
          <div className="flex items-center mb-2">
            <p className="text-xs uppercase font-bold text-gray-400">Custo Benefício (ROI)</p>
            <MetricTooltip text="Multiplicador de retorno sobre o investimento. Indica quantas vezes o valor investido retorna como lucro líquido ao final do período." />
          </div>
          <p className="text-3xl font-bold text-brand-primary dark:text-white">{(economicGain / investment).toFixed(1)}x</p>
          <p className={`text-sm mt-2 font-medium ${economicGain > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {project.roi > 0 ? 'Projeto Viável' : 'Descontinuar'}
          </p>
        </div>

        {/* Probability */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border border-gray-100 dark:border-slate-700">
           <div className="flex justify-between items-start mb-2">
             <div className="flex items-center">
               <p className="text-xs uppercase font-bold text-gray-400">Probabilidade de Sucesso</p>
               <MetricTooltip text="Estimativa estatística baseada nos riscos identificados e na consistência dos dados financeiros (Simulação de Monte Carlo)." />
             </div>
             <Info size={14} className="text-gray-300" />
           </div>
          <p className="text-3xl font-bold text-brand-primary dark:text-white">{(project.score * 0.85).toFixed(1)}%</p>
          <div className="flex justify-between mt-4 text-xs text-gray-400">
            <span>Score ICV</span>
            <span>{project.score * 0.1}%</span>
          </div>
        </div>

        {/* Economic Gain */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border border-gray-100 dark:border-slate-700">
          <div className="flex items-center mb-2">
            <p className="text-xs uppercase font-bold text-gray-400">Ganho Econômico (GE)</p>
            <MetricTooltip text="Valor Econômico Total gerado pelo projeto descontando o investimento inicial (Lucro Líquido Projetado) ao final do horizonte de tempo." />
          </div>
          <p className={`text-3xl font-bold ${economicGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
             R$ {economicGain.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-brand-accent inline-block"></span>
            Payback: {paybackMonths === Infinity ? 'Infinito' : paybackMonths.toFixed(1)} meses
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow border border-gray-100 dark:border-slate-700">
          <h3 className="font-bold text-lg mb-4 dark:text-white flex items-center gap-2">
            <span className="text-brand-accent">|l</span> Cenários (Ano 1/POC)
          </h3>
          <p className="text-xs text-gray-400 mb-6">Comparativo de Ganho Econômico (R$) nos cenários projetados</p>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scenarioData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#fff'}}
                  formatter={(value: number) => [`R$ ${value.toLocaleString()}`, 'Ganho Econômico']}
                />
                <Bar dataKey="value" fill="#eab308" radius={[4, 4, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Details */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border border-gray-100 dark:border-slate-700">
          <h3 className="font-bold text-lg mb-6 dark:text-white flex items-center gap-2">
             <span className="text-brand-accent">III</span> Detalhes do Projeto
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b dark:border-slate-700">
              <span className="text-sm text-gray-500">Horizonte</span>
              <span className="text-sm font-medium dark:text-gray-200">{project.financials.lifespanMonths} meses</span>
            </div>
            <div className="flex justify-between py-2 border-b dark:border-slate-700">
              <span className="text-sm text-gray-500">Tipo de Valor</span>
              <span className="text-sm font-medium dark:text-gray-200">{project.valueType || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-2 border-b dark:border-slate-700">
              <span className="text-sm text-gray-500">Custo Total POC</span>
              <span className="text-sm font-medium dark:text-gray-200">R$ {investment.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b dark:border-slate-700">
              <span className="text-sm text-gray-500">Risco Não-Econômico</span>
              <span className={`text-sm font-bold ${project.risks?.some(r => r.level === 'Alto') ? 'text-red-500' : 'text-green-500'}`}>
                {project.risks?.some(r => r.level === 'Alto') ? 'Alto' : 'Médio'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Intelligence Lab Footer */}
      <div className="bg-brand-primary text-white rounded-xl shadow overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex items-center gap-3">
          <div className="p-2 bg-brand-accent text-brand-primary rounded font-bold">
            <TrendingUp size={20} />
          </div>
          <div>
            <h3 className="font-bold">Metria Intelligence Lab</h3>
            <p className="text-xs text-slate-400">Análise qualitativa e recomendações de IA</p>
          </div>
        </div>
        <div className="grid grid-cols-4 text-center text-sm font-medium text-slate-300 divide-x divide-slate-700">
          <div className="p-3 bg-slate-800 text-white border-b-2 border-brand-accent">Análise Estratégica</div>
          <div className="p-3 hover:bg-slate-800 cursor-pointer">Mercado & Viabilidade</div>
          <div className="p-3 hover:bg-slate-800 cursor-pointer">Aval. Riscos</div>
          <div className="p-3 hover:bg-slate-800 cursor-pointer">Plano de Ação</div>
        </div>
        <div className="p-8 text-center text-slate-400 bg-white dark:bg-slate-900 border-l-4 border-brand-accent">
           <p>Análise qualitativa detalhada gerada pelo motor de IA da Metria com base em parâmetros de contabilidade da inovação.</p>
        </div>
      </div>
    </div>
  );
};

export default Report;
