import React, { useEffect, useState } from 'react';
import { Project, AiAnalysis } from '../types';
import { db } from '../services/db';
import { GoogleGenAI } from "@google/genai";
import { ArrowLeft, Download, RefreshCw, AlertTriangle, Sparkles, Building, Briefcase, FileText, Target, ChevronRight, Zap, Activity, TrendingUp, HelpCircle, Calculator, Info, Lock, Share2, Layers } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ReportProps {
  projectId: string;
  onBack: () => void;
}

const MetricTooltip = ({ text }: { text: React.ReactNode }) => (
  <div className="group relative inline-flex items-center ml-1.5 align-middle z-50">
    <HelpCircle size={12} className="text-slate-400 hover:text-brand-accent cursor-help transition-colors" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-4 bg-slate-900 text-white text-xs leading-relaxed rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none border border-slate-700 text-left z-50">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
    </div>
  </div>
);

const Report: React.FC<ReportProps> = ({ projectId, onBack }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'strategic' | 'market' | 'risks' | 'actionPlan' | 'methodology'>('strategic');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    const p = db.getProjectById(projectId);
    if (p) {
        setProject(p);
        // Só gera IA automaticamente se for PRO e tiver chave
        if (p.mode === 'PRO' && !p.aiAnalysis && process.env.API_KEY) {
            generateAiReport(p);
        } else if (p.mode === 'PRO' && !process.env.API_KEY) {
            setAiError("Chave de API não configurada.");
        }
    }
  }, [projectId]);

  const generateAiReport = async (p: Project) => {
    if (p.mode !== 'PRO') return; // Bloqueio de segurança

    setIsGeneratingAi(true);
    setAiError(null);

    try {
        if (!process.env.API_KEY) throw new Error("API Key missing");

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const prompt = `
            Atue como um Sênior Investment Officer de Venture Capital e Innovation Accounting.
            Gere um relatório executivo de alta densidade estratégica para o seguinte projeto:

            DADOS ESTRATÉGICOS:
            Projeto: ${p.name} (${p.area})
            Objetivo: ${p.mainGoal}
            
            FINANÇAS:
            - Investimento POC: R$ ${p.financials.cpoc}
            - Retorno em Escala (GEe): R$ ${p.financials.scaleEconomicGain}
            - Multiplicador de Eficiência (BCR): ${p.financials.benefitCostRatio.toFixed(2)}x
            - Score de Maturidade: ${p.icvScore}%
            
            RETORNO JSON:
            {
                "strategic": "Análise da tese de investimento, alinhamento com tendências de mercado e potencial de 'unfair advantage'. Seja direto e crítico.",
                "market": "Tamanho da oportunidade (TAM/SAM), barreiras de entrada e validade do problema.",
                "risks": "Análise 'Pre-mortem': O que pode matar o projeto? Riscos de execução, técnicos e adoção.",
                "actionPlan": "Recomendação Go/No-Go clara. Sugira 3 próximos passos táticos para destravar valor."
            }
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        const analysis: AiAnalysis = JSON.parse(response.text);
        const updatedProject = { ...p, aiAnalysis: analysis };
        db.saveProject(updatedProject);
        setProject(updatedProject);

    } catch (error) {
        console.error("AI Error:", error);
        setAiError("Conexão com Intelligence Lab indisponível.");
    } finally {
        setIsGeneratingAi(false);
    }
  };

  if (!project) return null;

  const isPro = project.mode === 'PRO';
  const f = project.financials;
  const icv = project.icvScore || 0;
  const bcr = f.benefitCostRatio || 0;
  const monthlyGains = (f.monthlySavings || 0) + (f.monthlyRevenue || 0);
  const paybackMonths = monthlyGains > 0 ? (f.cpoc / monthlyGains).toFixed(1) : "N/A";

  const chartData = [
    { name: 'Pessimista', value: f.scaleValue * 0.8 },
    { name: 'Realista', value: f.scaleValue },
    { name: 'Otimista', value: f.scaleValue * 1.3 }
  ];

  const getBCRStatus = (ratio: number) => {
    if (ratio < 0) return { label: 'Inviável', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' };
    if (ratio < 2) return { label: 'Marginal', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' };
    if (ratio <= 5) return { label: 'Saudável', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' };
    return { label: 'Exponencial', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' };
  };
  const bcrStatus = getBCRStatus(bcr);

  const renderMethodology = () => {
      const laborCost = (f.hourlyRate || 0) * (f.hoursPerMonth || 0) * (f.teamSize || 1) * (f.monthsToImplement || 0);
      const directCosts = (f.startupCost || 0) + (f.externalFees || 0) + (f.licenses || 0) + (f.servicesCost || 0) + (f.otherExpenses || 0);
      
      return (
          <div className="animate-fadeIn space-y-8 p-2">
              <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <Info className="text-blue-500 mt-1 flex-shrink-0" size={20}/>
                  <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">Transparência Algorítmica</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          O Metria utiliza o método de <strong>Média Ponderada (PERT)</strong>: (Pessimista + 4x Realista + Otimista) / 6. 
                          Isso reduz o viés de otimismo natural em projetos de inovação. O ICV atua como um fator de desconto sobre os fluxos futuros.
                      </p>
                  </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                      <h5 className="text-xs font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100 dark:border-slate-700 pb-2">Composição do CPOC</h5>
                      <div className="space-y-3 text-sm">
                          <div className="flex justify-between items-center group">
                              <span className="text-slate-500">Custos Diretos (Infra/Licenças)</span>
                              <div className="flex-1 border-b border-dashed border-slate-200 mx-4"></div>
                              <span className="font-mono font-medium text-slate-700 dark:text-slate-300">R$ {directCosts.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center group">
                              <span className="text-slate-500">Capital Humano (Hora/Homem)</span>
                              <div className="flex-1 border-b border-dashed border-slate-200 mx-4"></div>
                              <span className="font-mono font-medium text-slate-700 dark:text-slate-300">R$ {laborCost.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-2 rounded-lg font-bold text-slate-900 dark:text-white mt-2">
                              <span>Total Investido (POC)</span>
                              <span>R$ {f.cpoc.toLocaleString()}</span>
                          </div>
                      </div>
                  </div>

                  <div className="space-y-4">
                      <h5 className="text-xs font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100 dark:border-slate-700 pb-2">Auditoria de Confiança (ICV)</h5>
                      <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-end mb-1">
                              <span className="text-sm font-bold text-slate-700 dark:text-white">
                                  {isPro ? `${icv.toFixed(1)}%` : 'Simplificado'}
                              </span>
                              <span className="text-xs text-slate-400">Score de Maturidade</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${icv > 70 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{width: `${icv}%`}}></div>
                          </div>
                          
                          {/* ICV Breakdown - PRO ONLY */}
                          {isPro ? (
                              <div className="flex gap-1 mt-2">
                                  {(project.icvAnswers || []).map((ans, idx) => (
                                      <div key={idx} className={`h-1.5 flex-1 rounded-full ${ans === 1 ? 'bg-green-500' : ans === 0.5 ? 'bg-yellow-400' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                                  ))}
                              </div>
                          ) : (
                              <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-center">
                                  <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
                                      <Lock size={10} /> Auditoria detalhada disponível no Professional
                                  </p>
                              </div>
                          )}
                          
                          <p className="text-[10px] text-slate-400 mt-1">*Baseado em 8 pontos de verificação de governança.</p>
                      </div>
                  </div>
              </div>
          </div>
      )
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] pb-20 font-sans">
      
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
              <div className="flex items-center gap-4">
                  <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                      <ArrowLeft size={20}/>
                  </button>
                  <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
                  <div>
                      <h1 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          {project.name} <span className="text-slate-400 font-normal">/ Relatório Executivo</span>
                      </h1>
                  </div>
                  {!isPro && (
                      <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-bold text-slate-500 border border-slate-200 dark:border-slate-700">
                          <span className="w-2 h-2 rounded-full bg-slate-400"></span> Discovery
                      </div>
                  )}
              </div>
              <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <Share2 size={14} /> Compartilhar
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:opacity-90 transition-opacity shadow-sm">
                      <Download size={14} /> PDF
                  </button>
              </div>
          </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Hero Card - Innovation Score */}
            <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-brand-accent/20 transition-all duration-1000"></div>
                
                <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/10 p-1.5 rounded-lg backdrop-blur-sm">
                                <Sparkles size={16} className="text-brand-accent"/>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Innovation Score</span>
                            <MetricTooltip text={<>Métrica proprietária que combina viabilidade financeira (ROI) com maturidade de execução (ICV).</>}/>
                        </div>
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${project.score > 70 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {project.score > 70 ? 'Alta Viabilidade' : 'Média Viabilidade'}
                        </span>
                    </div>
                    
                    <div className="mt-6">
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-extrabold tracking-tight">{project.score}</span>
                            <span className="text-xl text-slate-400">/100</span>
                        </div>
                        <div className="w-full bg-slate-700/50 h-2 rounded-full mt-4 overflow-hidden">
                            <div className="bg-gradient-to-r from-brand-accent to-yellow-500 h-full rounded-full transition-all duration-1000" style={{width: `${project.score}%`}}></div>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">Probabilidade de sucesso baseada em {Object.keys(project.financials).length} variáveis.</p>
                    </div>
                </div>
            </div>

            {/* BCR Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between group hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Eficiência (BCR)</p>
                        <MetricTooltip text={<>Retorno para cada R$ 1,00 investido.<br/>Fórmula: GEe / Ce</>}/>
                    </div>
                    <div className={`p-2 rounded-lg ${bcrStatus.bg}`}>
                        <Target size={18} className={bcrStatus.color} />
                    </div>
                </div>
                <div>
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">{bcr.toFixed(2)}x</span>
                    <p className={`text-xs font-bold mt-1 ${bcrStatus.color}`}>{bcrStatus.label}</p>
                </div>
            </div>

            {/* Financial Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between group hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Ganho (Ge POC)</p>
                        <MetricTooltip text={<>Valor Econômico Líquido gerado na fase de POC.<br/>Ve - Cpoc</>}/>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500">
                        <TrendingUp size={18} />
                    </div>
                </div>
                <div>
                    <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        R$ {f.gePoc >= 1000 ? `${(f.gePoc/1000).toFixed(1)}k` : f.gePoc}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">Payback: <span className="font-bold text-slate-700 dark:text-slate-300">{paybackMonths} meses</span></p>
                </div>
            </div>
        </div>

        {/* Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Charts & Data */}
            <div className="lg:col-span-2 space-y-8">
                {/* Chart - LOCKED FOR DISCOVERY */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Projeção de Cenários (PERT)</h3>
                            <p className="text-sm text-slate-500">Análise de sensibilidade de Valor Econômico (Ve)</p>
                        </div>
                        {isPro && (
                            <div className="flex gap-2">
                                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase"><div className="w-2 h-2 rounded-full bg-slate-300"></div> Conservador</span>
                                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase"><div className="w-2 h-2 rounded-full bg-brand-accent"></div> Projetado</span>
                            </div>
                        )}
                    </div>
                    
                    {isPro ? (
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} barSize={60}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fontSize: 12, fill: '#64748b', fontWeight: 600}} 
                                        dy={10} 
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fontSize: 11, fill: '#94a3b8'}} 
                                        tickFormatter={(val) => `R$ ${val/1000}k`} 
                                    />
                                    <Tooltip 
                                        cursor={{fill: 'transparent'}}
                                        contentStyle={{
                                            borderRadius: '12px', 
                                            border: 'none', 
                                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                            padding: '12px 16px',
                                            backgroundColor: '#1e293b',
                                            color: 'white'
                                        }}
                                        itemStyle={{color: '#eab308'}}
                                        formatter={(value: number) => [`R$ ${value.toLocaleString()}`, 'Valor Econômico']}
                                    />
                                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 1 ? '#eab308' : '#e2e8f0'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-72 w-full bg-slate-50 dark:bg-slate-900 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-slate-100/50 dark:bg-slate-800/50 blur-[2px] transition-all group-hover:blur-0"></div>
                            <div className="relative z-10 text-center p-6 max-w-sm">
                                <div className="bg-white dark:bg-slate-800 p-3 rounded-full inline-flex mb-3 shadow-sm">
                                    <Lock size={20} className="text-brand-accent" />
                                </div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Cenários Avançados Bloqueados</h4>
                                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                                    A visualização de sensibilidade PERT e cenários ponderados é exclusiva do plano Professional.
                                </p>
                                <button className="text-xs font-bold text-white bg-slate-900 dark:bg-brand-accent dark:text-brand-primary px-4 py-2 rounded-lg hover:shadow-lg transition-all">
                                    Upgrade para Professional
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Project Details List */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Detalhamento Operacional</h3>
                    <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                        <div className="flex justify-between border-b border-slate-50 dark:border-slate-700 pb-2">
                            <span className="text-sm text-slate-500">Horizonte Temporal</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{f.lifespanMonths} meses</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 dark:border-slate-700 pb-2">
                            <span className="text-sm text-slate-500">Tipo de Valor</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{project.valueType}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 dark:border-slate-700 pb-2">
                            <span className="text-sm text-slate-500">Custo Total (Cpoc)</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">R$ {f.cpoc.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 dark:border-slate-700 pb-2">
                            <span className="text-sm text-slate-500">Impacto Mensal</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">R$ {monthlyGains.toLocaleString()}</span>
                        </div>
                        <div className="col-span-2 pt-2">
                            <p className="text-xs text-slate-400 uppercase font-bold mb-2">Comentários</p>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl">
                                {project.comments || "Nenhum comentário adicional registrado."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Intelligence Lab */}
            <div className="lg:col-span-1">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden sticky top-24">
                    <div className="bg-slate-900 p-5 border-b border-slate-800">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="bg-brand-accent p-1.5 rounded-lg text-slate-900">
                                <Sparkles size={16} strokeWidth={2.5}/>
                            </div>
                            <h3 className="text-white font-bold text-sm">Metria Intelligence Lab</h3>
                        </div>
                        <p className="text-slate-400 text-xs pl-10">Análise de Venture Capital via IA</p>
                    </div>

                    <div className="flex overflow-x-auto border-b border-slate-100 dark:border-slate-700 scrollbar-hide">
                         {[
                            {id: 'strategic', label: 'Estratégia'},
                            {id: 'market', label: 'Mercado'},
                            {id: 'risks', label: 'Riscos'},
                            {id: 'actionPlan', label: 'Ação'},
                            {id: 'methodology', label: 'Cálculo'}
                          ].map(tab => (
                              <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex-1 px-4 py-3 text-[10px] font-bold uppercase tracking-wider transition-colors ${activeTab === tab.id ? 'text-brand-accent border-b-2 border-brand-accent bg-slate-50 dark:bg-slate-800' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                              >
                                  {tab.label}
                              </button>
                          ))}
                    </div>

                    <div className="p-6 min-h-[400px]">
                        {activeTab === 'methodology' ? (
                            renderMethodology()
                        ) : (
                            <>
                                {isPro ? (
                                    <>
                                        {isGeneratingAi ? (
                                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                                <div className="relative w-16 h-16 mb-6">
                                                    <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                                                    <div className="absolute inset-0 border-4 border-brand-accent rounded-full border-t-transparent animate-spin"></div>
                                                </div>
                                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Analisando Dados...</h4>
                                                <p className="text-xs text-slate-500 max-w-[200px]">O agente Metria está comparando seu projeto com benchmarks de mercado.</p>
                                            </div>
                                        ) : aiError ? (
                                            <div className="text-center py-12">
                                                <Lock className="mx-auto text-slate-300 mb-3" size={32}/>
                                                <p className="text-sm font-bold text-slate-700 dark:text-white mb-2">Análise Bloqueada</p>
                                                <p className="text-xs text-slate-500 mb-4 px-4">{aiError}</p>
                                                <button onClick={() => generateAiReport(project)} className="text-xs font-bold text-brand-accent hover:underline">Tentar Novamente</button>
                                            </div>
                                        ) : project.aiAnalysis ? (
                                            <div className="animate-fadeIn">
                                                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                                    {activeTab === 'strategic' && <Target size={16} className="text-brand-accent"/>}
                                                    {activeTab === 'market' && <Building size={16} className="text-blue-500"/>}
                                                    {activeTab === 'risks' && <AlertTriangle size={16} className="text-red-500"/>}
                                                    {activeTab === 'actionPlan' && <FileText size={16} className="text-green-500"/>}
                                                    {activeTab === 'strategic' && 'Parecer Estratégico'}
                                                    {activeTab === 'market' && 'Contexto de Mercado'}
                                                    {activeTab === 'risks' && 'Matriz de Riscos'}
                                                    {activeTab === 'actionPlan' && 'Plano de Ação'}
                                                </h4>
                                                <div className="prose dark:prose-invert prose-sm max-w-none text-slate-600 dark:text-slate-300 text-xs leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-700/20 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                                    {project.aiAnalysis[activeTab]}
                                                </div>
                                                <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-400">
                                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                                    Gerado via Gemini 2.5 Flash
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <button onClick={() => generateAiReport(project)} className="bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 mx-auto">
                                                    <Sparkles size={16} className="text-brand-accent"/> Gerar Análise
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    /* LOCKED STATE FOR DISCOVERY */
                                    <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6">
                                        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-6">
                                            <Sparkles size={32} className="text-slate-400" />
                                        </div>
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">Metria Intelligence Lab</h4>
                                        <p className="text-sm text-slate-500 max-w-xs mb-8 leading-relaxed">
                                            Obtenha análises estratégicas, benchmarking de mercado e mitigação de riscos geradas por IA.
                                        </p>
                                        <div className="flex items-center gap-2 text-xs font-bold text-brand-accent uppercase tracking-wider mb-2">
                                            <Lock size={12} /> Recurso Professional
                                        </div>
                                        <button className="text-xs underline text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                                            Saiba mais sobre o plano Pro
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Report;