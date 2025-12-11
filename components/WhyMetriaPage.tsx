import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Target, TrendingUp, Users, Shield, Lightbulb, XCircle, CheckCircle, Brain, BarChart3, Lock, Zap, Search, AlertOctagon, Scale } from 'lucide-react';

interface WhyMetriaPageProps {
  onBack: () => void;
  onRegister: () => void;
}

const WhyMetriaPage: React.FC<WhyMetriaPageProps> = ({ onBack, onRegister }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'problem' | 'solution'>('solution');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] font-sans text-slate-900 dark:text-slate-100 selection:bg-brand-accent/30 selection:text-brand-primary overflow-x-hidden transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Background Decor - Subtle & Premium */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
         <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-brand-accent/5 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-40 animate-pulse-slow"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-40"></div>
         <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-primary dark:hover:text-white transition-colors uppercase tracking-wider"
          >
            <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full group-hover:-translate-x-1 transition-transform">
                <ArrowLeft size={16} /> 
            </div>
            Voltar
          </button>
          
          <div className="flex items-center gap-2.5 font-bold text-lg tracking-tight">
             <div className="bg-brand-accent/10 p-1.5 rounded-lg border border-brand-accent/20">
                <Lightbulb size={18} className="text-brand-accent" strokeWidth={2.5} />
             </div>
             <span className="hidden md:inline">Por que Metria?</span>
          </div>

          <button 
            onClick={onRegister}
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-full text-sm font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            Criar Conta <ArrowRight size={14}/>
          </button>
        </div>
      </nav>

      <main className="pt-40 pb-24 px-6 max-w-7xl mx-auto space-y-40">
        
        {/* Hero Section */}
        <section className="text-center max-w-5xl mx-auto relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-brand-primary dark:text-brand-accent text-xs font-bold uppercase tracking-wider mb-8 shadow-sm hover:border-brand-accent/50 transition-colors cursor-default">
            <Target size={12} /> Manifesto Estratégico
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-8 leading-[1.1] tracking-tight">
            O Elo Perdido entre <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent via-yellow-500 to-amber-600">Estratégia e Execução.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 leading-relaxed font-light max-w-3xl mx-auto">
             Inovação sem mensuração é dispêndio. O Metria foi arquitetado para fornecer aos líderes de estratégia a linguagem que os CFOs respeitam: <strong>ROI, Mitigação de Risco e Previsibilidade de Caixa.</strong>
          </p>
        </section>

        {/* The Contrast: Theater vs Engineering */}
        <section className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 relative">
                <div className="absolute -left-8 top-0 w-1 bg-gradient-to-b from-brand-accent to-transparent h-full rounded-full opacity-30"></div>
                
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold dark:text-white mb-4">A Ineficiência da Alocação Tradicional</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                      Muitas corporações incorrem no erro de fomentar iniciativas de inovação desconectadas do P&L (Profit and Loss). Transformamos iniciativas isoladas em um sistema de engenharia financeira robusto.
                  </p>
                </div>

                <div className="space-y-4">
                    {/* Toggle Switch for visual comparison */}
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit mb-6">
                        <button 
                            onClick={() => setActiveTab('problem')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'problem' ? 'bg-white dark:bg-slate-700 shadow text-red-500' : 'text-slate-500'}`}
                        >
                            <XCircle size={16} /> Gestão Especulativa
                        </button>
                        <button 
                            onClick={() => setActiveTab('solution')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'solution' ? 'bg-white dark:bg-slate-700 shadow text-green-500' : 'text-slate-500'}`}
                        >
                            <CheckCircle size={16} /> Gestão Metria
                        </button>
                    </div>

                    {activeTab === 'problem' ? (
                        <div className="animate-fadeIn p-6 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-red-800 dark:text-red-300">
                                    <AlertOctagon className="flex-shrink-0 mt-0.5" size={20} />
                                    <span>Aprovação baseada em subjetividade e "Showmanship".</span>
                                </li>
                                <li className="flex gap-3 text-red-800 dark:text-red-300">
                                    <AlertOctagon className="flex-shrink-0 mt-0.5" size={20} />
                                    <span>Métricas de vaidade (Outputs) desconectadas do resultado (Outcomes).</span>
                                </li>
                                <li className="flex gap-3 text-red-800 dark:text-red-300">
                                    <AlertOctagon className="flex-shrink-0 mt-0.5" size={20} />
                                    <span>Incapacidade de descontinuar projetos com performance negativa.</span>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <div className="animate-fadeIn p-6 rounded-2xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20">
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-green-800 dark:text-green-300">
                                    <CheckCircle className="flex-shrink-0 mt-0.5" size={20} />
                                    <span>Governança por Stage-Gates auditáveis baseados em evidência.</span>
                                </li>
                                <li className="flex gap-3 text-green-800 dark:text-green-300">
                                    <CheckCircle className="flex-shrink-0 mt-0.5" size={20} />
                                    <span>Métricas reais: Custo da Prova (CPOC), ROI Projetado, Taxa de Sucesso.</span>
                                </li>
                                <li className="flex gap-3 text-green-800 dark:text-green-300">
                                    <CheckCircle className="flex-shrink-0 mt-0.5" size={20} />
                                    <span>Alocação de capital eficiente baseada em risco (ICV).</span>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Visual Representation */}
            <div className="relative perspective-1000">
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-accent/20 to-purple-500/20 rounded-[2rem] blur-3xl transform rotate-6 scale-90"></div>
                
                <div className="relative bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-3xl shadow-2xl p-8 transform transition-transform hover:scale-[1.02] duration-500">
                    {/* Window Controls */}
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded-full bg-red-400"></div>
                             <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                             <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">
                            <Lock size={10} /> metria_intelligence_core.ts
                        </div>
                    </div>
                    
                    <div className="space-y-8">
                        {/* Simulation of Data */}
                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-2">
                                <span>Projeção Financeira (PERT)</span>
                                <span className="text-brand-accent">Ativo</span>
                            </div>
                            <div className="flex items-end gap-1 h-32 w-full pb-2 border-b border-slate-100 dark:border-slate-800">
                                <div className="w-1/3 bg-slate-200 dark:bg-slate-800 rounded-t-lg h-[40%] relative group">
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">Pessimista</div>
                                </div>
                                <div className="w-1/3 bg-brand-accent rounded-t-lg h-[65%] relative group shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-brand-accent whitespace-nowrap">Realista (R$ 2.8M)</div>
                                </div>
                                <div className="w-1/3 bg-slate-200 dark:bg-slate-800 rounded-t-lg h-[85%] relative group">
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">Otimista</div>
                                </div>
                            </div>
                        </div>

                         <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 flex gap-4">
                            <div className="mt-1 bg-brand-accent/10 p-2 rounded-lg text-brand-accent h-fit">
                                <Brain size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase text-brand-accent mb-1">Metria Intelligence</p>
                                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                                    "Com base em 1.200 projetos similares, a probabilidade de sucesso aumenta em 45% se validarmos a hipótese de canal antes do desenvolvimento do MVP."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* 3 Pillars of Truth */}
        <section>
            <div className="text-center mb-20">
                <h2 className="text-3xl md:text-5xl font-bold dark:text-white mb-6">Três Pilares da Verdade</h2>
                <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                    Nossa metodologia não é apenas software, é um sistema de governança fundamentado em rigor analítico.
                </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    {
                        icon: BarChart3,
                        color: "text-blue-600",
                        bg: "bg-blue-50 dark:bg-blue-900/20",
                        title: "Rigor Financeiro",
                        desc: "Traduzimos métricas operacionais (churn, CAC, LTV) em métricas de negócio (EBITDA, ROI, Payback), permitindo o alinhamento estratégico com o CFO."
                    },
                    {
                        icon: Shield,
                        color: "text-brand-accent",
                        bg: "bg-brand-accent/10",
                        title: "Mitigação de Risco",
                        desc: "O algoritmo ICV (Índice de Confiança e Viabilidade) atua como um 'deflator de otimismo', ajustando as projeções financeiras com base na maturidade real do projeto."
                    },
                    {
                        icon: TrendingUp,
                        color: "text-emerald-600",
                        bg: "bg-emerald-50 dark:bg-emerald-900/20",
                        title: "Gestão de Portfólio",
                        desc: "Visualização clara de horizontes de inovação (H1, H2, H3). Garanta que a alocação de recursos não está apenas otimizando o presente, mas garantindo a longevidade da companhia."
                    }
                ].map((item, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                        <div className={`w-16 h-16 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                            <item.icon size={32} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 dark:text-white">{item.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            {item.desc}
                        </p>
                    </div>
                ))}
            </div>
        </section>

        {/* Security / Trust */}
        <section className="bg-[#0F172A] rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden group">
             {/* Abstract Grid Pattern */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-[100px] transition-all duration-1000 group-hover:bg-brand-accent/10"></div>
             
             <div className="relative z-10 max-w-3xl mx-auto">
                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-8 backdrop-blur-sm border border-white/10">
                    <Lock size={12} /> Enterprise Grade Security
                 </div>
                 <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight">Seus dados são o seu maior ativo.</h2>
                 <p className="text-slate-400 text-lg md:text-xl mb-12 font-light">
                     A plataforma Metria é construída com padrões de segurança corporativos, criptografia de ponta a ponta, isolamento de inquilino (multi-tenant isolation) e conformidade global.
                 </p>
                 
                 <div className="flex flex-wrap justify-center gap-6">
                     {['SOC 2 Type II Ready', 'ISO 27001 Compliant', 'LGPD/GDPR', 'SSO Corporativo'].map((tag, i) => (
                         <div key={i} className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 px-6 py-3 rounded-xl text-slate-300 font-medium text-sm hover:bg-slate-800 transition-colors cursor-default">
                             <CheckCircle size={16} className="text-green-500"/> {tag}
                         </div>
                     ))}
                 </div>
             </div>
        </section>

        {/* Final CTA */}
        <section className="text-center">
            <h2 className="text-4xl md:text-6xl font-extrabold dark:text-white mb-8">Pare de adivinhar. <br/><span className="text-brand-accent">Comece a medir.</span></h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <button onClick={onRegister} className="bg-brand-primary text-white px-10 py-5 rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all text-lg shadow-brand-accent/20">
                     Iniciar Trial Corporativo
                 </button>
                 <button onClick={onBack} className="bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 px-10 py-5 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-lg">
                     Voltar para Início
                 </button>
            </div>
            <p className="mt-6 text-sm text-slate-400">Acesso ao plano Light não requer cartão de crédito.</p>
        </section>

      </main>
    </div>
  );
};

export default WhyMetriaPage;