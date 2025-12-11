import React, { useState, useEffect } from 'react';
import { Check, X, ChevronRight, Zap, Target, BarChart2, Shield, ArrowRight, Layout, Users, FileText, Globe, AlertTriangle, TrendingUp, Lock, Search, Activity, Layers, PieChart, ArrowUpRight, Sparkles, Scale } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
  onNavigateToMethodology?: () => void;
  onNavigateToPlans?: () => void;
  onNavigateToWhyMetria?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onRegister, onNavigateToMethodology, onNavigateToPlans, onNavigateToWhyMetria }) => {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] font-sans text-slate-900 dark:text-slate-100 selection:bg-brand-accent/30 selection:text-brand-primary overflow-x-hidden">
      
      {/* Background Ambient Glows - More diffused and subtle */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-brand-accent/5 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-40 animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-40"></div>
          <div className="absolute top-[40%] left-[40%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[100px] opacity-30"></div>
      </div>

      {/* Header - Adaptive Blur */}
      <header className={`fixed w-full top-0 z-50 transition-all duration-500 border-b ${scrolled ? 'bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-800/60 py-3 shadow-sm' : 'bg-transparent border-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2.5 font-bold text-xl text-brand-primary dark:text-white cursor-pointer group" onClick={() => window.scrollTo(0,0)}>
               <div className="bg-gradient-to-br from-brand-accent to-yellow-600 text-brand-primary p-2 rounded-xl shadow-lg shadow-brand-accent/20 group-hover:scale-105 transition-transform">
                  <Layout size={20} strokeWidth={2.5} className="text-white" />
               </div>
               <span className="tracking-tight font-extrabold text-2xl">Metria</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-1 bg-white/50 dark:bg-slate-900/50 p-1.5 rounded-full border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md">
              <button onClick={onNavigateToWhyMetria} className="px-5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 rounded-full transition-all">Por que Metria?</button>
              <button onClick={onNavigateToMethodology} className="px-5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 rounded-full transition-all">Metodologia</button>
              <button onClick={onNavigateToPlans} className="px-5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 rounded-full transition-all">Planos</button>
            </nav>

            <div className="flex items-center gap-4">
              <button onClick={onLogin} className="hidden md:block text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Acesso Corporativo</button>
              <button onClick={onRegister} className="group relative overflow-hidden bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-full text-sm font-bold shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5 active:scale-95">
                <span className="relative z-10 flex items-center gap-2">Iniciar Análise <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/></span>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-accent to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 lg:pt-52 lg:pb-32 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div className={`text-left relative z-10 max-w-2xl transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm mb-8 shadow-sm group cursor-default hover:border-brand-accent/50 transition-colors">
              <span className="flex h-2 w-2 rounded-full bg-brand-accent animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Infraestrutura de Governança de Portfólio</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter text-slate-900 dark:text-white mb-8 leading-[1.05]">
              Governança de Capital para <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-yellow-600 relative">
                Inovação Corporativa.
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-brand-accent opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" /></svg>
              </span>
            </h1>
            
            <p className="text-xl text-slate-500 dark:text-slate-400 mb-10 leading-relaxed font-light max-w-xl">
              Plataforma de <strong>Innovation Accounting</strong> para CFOs e Executivos. Valide teses de investimento, mitigue riscos de execução e garanta a eficiência na alocação de recursos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-start">
              <button onClick={onRegister} className="bg-brand-accent text-brand-primary px-8 py-4 rounded-2xl text-lg font-bold shadow-xl shadow-brand-accent/20 hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 active:scale-95 group">
                Avaliar Meu Portfólio <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
              </button>
              <button 
                onClick={onNavigateToMethodology} 
                className="bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center active:scale-95 hover:border-slate-300 dark:hover:border-slate-600"
              >
                Framework Analítico
              </button>
            </div>
            
            <div className="mt-12 flex items-center gap-6 text-sm text-slate-400">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-[#0B1120] bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="User" className="w-full h-full object-cover opacity-80" />
                    </div>
                  ))}
               </div>
               <div className="flex flex-col">
                  <div className="flex items-center gap-1 text-brand-accent">
                      {[1,2,3,4,5].map(i => <StarIcon key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p className="font-medium text-slate-600 dark:text-slate-300">Validado por Heads de Estratégia</p>
               </div>
            </div>
          </div>

          {/* Right Column: 3D Dashboard */}
          <div className="relative w-full h-full min-h-[500px] flex items-center justify-center lg:justify-end perspective-1000">
             <div className="absolute inset-0 bg-gradient-to-tr from-brand-accent/20 to-blue-500/20 rounded-full blur-[100px] opacity-60 animate-pulse-slow"></div>
            
             <div 
                className={`relative w-full max-w-xl rounded-2xl bg-white/70 dark:bg-[#1e293b]/70 backdrop-blur-2xl border border-white/50 dark:border-slate-700/50 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] transform transition-all duration-1000 ease-out group hover:rotate-0 hover:scale-[1.02] ${mounted ? 'rotate-y-12 rotate-x-6 opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}
             >
                {/* Header of Window */}
                <div className="h-12 bg-white/50 dark:bg-slate-800/50 rounded-t-2xl flex items-center px-6 gap-2 border-b border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                    </div>
                    <div className="mx-auto w-40 h-2 bg-slate-200 dark:bg-slate-700 rounded-full opacity-50"></div>
                </div>
                
                {/* Content */}
                <div className="p-8 grid grid-cols-2 gap-6">
                    {/* Main Chart */}
                    <div className="col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 h-64 relative overflow-hidden shadow-sm flex flex-col">
                        <div className="flex justify-between items-start z-10 mb-6">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Valor Econômico Projetado (Ve)</p>
                                <h3 className="text-3xl font-bold text-slate-800 dark:text-white">R$ 2.4M</h3>
                            </div>
                            <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-emerald-100 dark:border-emerald-800">
                                <ArrowUpRight size={14} /> +125% vs Baseline
                            </span>
                        </div>
                        {/* CSS Chart */}
                        <div className="flex-1 w-full flex items-end gap-2 px-2">
                             {[30, 45, 35, 60, 50, 75, 65, 90, 80].map((h, i) => (
                                 <div key={i} className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-t-sm relative group cursor-pointer overflow-hidden">
                                     <div 
                                        className="absolute bottom-0 left-0 w-full bg-brand-accent transition-all duration-1000 ease-out group-hover:bg-yellow-400" 
                                        style={{ height: mounted ? `${h}%` : '0%', transitionDelay: `${i * 100}ms` }}
                                     ></div>
                                 </div>
                             ))}
                        </div>
                    </div>

                    {/* Small Cards */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between group hover:-translate-y-1 transition-transform">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center mb-2">
                            <Activity size={20}/>
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase">Eficiência de Capital (BCR)</p>
                           <p className="text-2xl font-bold text-slate-800 dark:text-white">4.2x</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between group hover:-translate-y-1 transition-transform">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-500 flex items-center justify-center mb-2">
                            <Shield size={20}/>
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase">Índice de Confiança (ICV)</p>
                           <p className="text-2xl font-bold text-slate-800 dark:text-white">Alto</p>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Problem Section - Dark Mode Contrast */}
      <section id="problem" className="py-32 bg-[#0F172A] text-white relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-accent/5 rounded-full blur-[150px]"></div>
         
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
               <span className="text-brand-accent font-bold tracking-[0.2em] text-xs uppercase mb-4 block">Assimetria de Informação</span>
               <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">O Risco da Alocação Não-Estruturada</h2>
               <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                 A gestão de inovação corporativa falha quando tratada como processo criativo e subjetivo, em vez de uma disciplina de engenharia financeira e mitigação de risco.
               </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                {/* The Problem Card */}
                <div className="group relative bg-slate-800/40 p-10 rounded-3xl border border-slate-700/50 hover:border-red-500/30 transition-all duration-500 hover:bg-slate-800/60">
                    <div className="absolute inset-0 bg-red-500/5 blur-2xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-red-500/10 rounded-2xl text-red-500"><X size={28} /></div>
                            <h3 className="text-2xl font-bold text-white">Alocação de Capital às Cegas</h3>
                        </div>
                        <ul className="space-y-6">
                            <li className="flex gap-4 items-start">
                                <AlertTriangle size={20} className="text-red-500/50 mt-1 flex-shrink-0"/>
                                <div>
                                    <strong className="block text-white text-lg mb-1">Aprovação Subjetiva</strong>
                                    <span className="text-sm text-slate-400">Validação de teses baseada em persuasão e "Showmanship", sem clareza sobre Unit Economics ou viabilidade de escala.</span>
                                </div>
                            </li>
                            <li className="flex gap-4 items-start">
                                <AlertTriangle size={20} className="text-red-500/50 mt-1 flex-shrink-0"/>
                                <div>
                                    <strong className="block text-white text-lg mb-1">Invisibilidade do Retorno</strong>
                                    <span className="text-sm text-slate-400">Foco em métricas de atividade (Outputs) em vez de Valor Econômico Agregado (Outcomes) e redução de risco.</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* The Solution Card */}
                <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 p-10 rounded-3xl border border-brand-accent/20 hover:border-brand-accent/50 shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                    <div className="absolute top-0 right-0 p-10 opacity-5">
                        <Layout size={150} />
                    </div>
                    <div className="relative">
                         <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-brand-accent text-brand-primary rounded-2xl"><Check size={28} strokeWidth={3} /></div>
                            <h3 className="text-2xl font-bold text-white">Decisão Baseada em Evidências</h3>
                        </div>
                        <ul className="space-y-6">
                            <li className="flex gap-4 items-start">
                                <Shield size={20} className="text-brand-accent mt-1 flex-shrink-0"/>
                                <div>
                                    <strong className="block text-white text-lg mb-1">Rigor Financeiro (CPOC & ROI)</strong>
                                    <span className="text-sm text-slate-400">Cálculo automatizado do Custo da Prova e projeção de retorno financeiro utilizando média ponderada (PERT).</span>
                                </div>
                            </li>
                            <li className="flex gap-4 items-start">
                                <Scale size={20} className="text-brand-accent mt-1 flex-shrink-0"/>
                                <div>
                                    <strong className="block text-white text-lg mb-1">Stage-Gates Auditáveis</strong>
                                    <span className="text-sm text-slate-400">Algoritmo ICV que libera tranches de investimento apenas mediante validação de hipóteses críticas.</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* Methodology Section - Clean Cards */}
      <section className="py-32 bg-white dark:bg-[#0B1120] border-t border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <span className="text-brand-primary dark:text-brand-accent font-bold tracking-[0.2em] text-xs uppercase mb-4 block">Processo Validado</span>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">Engenharia de Valor em 3 Etapas</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-light leading-relaxed">
              Combinamos a agilidade do Venture Capital com a profundidade analítica necessária para aprovações em comitês executivos e conselhos.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
             <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent z-0"></div>

            {[
                { icon: Layers, title: "1. Governança Estruturada", desc: "Estruturação de teses de investimento e filtro de funil com Stage-Gates baseados em evidência auditável.", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/10" },
                { icon: Target, title: "2. Mensuração de Precisão", desc: "Cálculo detalhado do Custo da Prova (CPOC) e calibração de risco através do Índice de Confiança (ICV).", color: "text-brand-accent", bg: "bg-brand-accent/10" },
                { icon: PieChart, title: "3. Projeção de Escala", desc: "Modelagem de Valor Econômico (ΔV) futuro com cenários estatísticos ponderados para reduzir viés de otimismo.", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/10" }
            ].map((step, i) => (
                <div key={i} className="relative z-10 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2">
                    <div className={`w-24 h-24 mx-auto ${step.bg} rounded-full flex items-center justify-center mb-8 relative border-4 border-white dark:border-slate-900`}>
                        <step.icon size={32} className={step.color} strokeWidth={1.5} />
                    </div>
                    <div className="text-center">
                        <span className={`text-xs font-bold ${step.color} uppercase mb-3 block tracking-wider`}>Fase {i + 1}</span>
                        <h3 className="text-xl font-bold mb-3 dark:text-white">{step.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                </div>
            ))}
          </div>
          
          <div className="mt-20 text-center">
             <button onClick={onNavigateToMethodology} className="inline-flex items-center gap-2 text-slate-900 dark:text-white font-bold hover:text-brand-accent transition-colors border-b-2 border-transparent hover:border-brand-accent pb-1">
                Aprofundar na Metodologia <ArrowRight size={16}/>
             </button>
          </div>
        </div>
      </section>

    </div>
  );
};

// Helper Icon
const StarIcon: React.FC<{ size: number, fill?: string }> = ({ size, fill }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);

export default LandingPage;