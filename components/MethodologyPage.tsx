import React, { useEffect, useState } from 'react';
import { ArrowLeft, Layers, DollarSign, Activity, Target, Shield, PieChart, CheckCircle, TrendingUp, Filter, AlertTriangle, ArrowRight, Minus, Divide, Calculator } from 'lucide-react';

interface MethodologyPageProps {
  onBack: () => void;
  onRegister: () => void;
}

const MethodologyPage: React.FC<MethodologyPageProps> = ({ onBack, onRegister }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-brand-accent selection:text-brand-primary overflow-x-hidden transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-accent/5 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-30 animate-pulse-slow"></div>
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-30"></div>
         <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-primary dark:hover:text-white transition-colors uppercase tracking-wider"
          >
            <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full group-hover:-translate-x-1 transition-transform">
                <ArrowLeft size={16} /> 
            </div>
            Voltar
          </button>
          <div className="hidden md:flex items-center gap-2 font-bold text-xl tracking-tight">
             <Layers className="text-brand-accent" size={20}/>
             <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-400">Metodologia Metria</span>
          </div>
          <button 
            onClick={onRegister}
            className="bg-brand-primary text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-200 dark:text-slate-900 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
          >
            Acesso Corporativo <ArrowRight size={14}/>
          </button>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="pt-40 pb-20 px-6 text-center max-w-4xl mx-auto relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-brand-primary dark:text-brand-accent text-xs font-bold uppercase tracking-wider mb-8 shadow-sm hover:scale-105 transition-transform cursor-default">
          <Calculator size={12} /> Innovation Accounting
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-8 leading-[1.1] tracking-tight">
          Conversão de Volatilidade em <br/>
          <span className="relative inline-block">
             <span className="absolute inset-0 bg-brand-accent/20 skew-y-3 transform -rotate-1 rounded-lg"></span>
             <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-yellow-600 dark:to-yellow-300">ativos tangíveis.</span>
          </span>
        </h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-light max-w-2xl mx-auto">
          O sistema Metria não é apenas um software, é uma estrutura de governança baseada em <em>The Corporate Startup</em> e princípios de Venture Capital para auditar o ROI real da inovação.
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 pb-32 space-y-40">
        
        {/* Section 1: The Funnel & Governance */}
        <section className="grid md:grid-cols-2 gap-16 items-center">
           <div className="relative">
              <div className="absolute -left-10 -top-10 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl"></div>
              <div className="w-14 h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center mb-8 text-brand-primary shadow-sm rotate-3 hover:rotate-0 transition-transform duration-300">
                 <Filter size={28} strokeWidth={1.5} className="text-blue-500" />
              </div>
              <h2 className="text-4xl font-bold mb-6 dark:text-white">Governança & Stage-Gates</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-light">
                A inovação não pode ser uma "caixa preta". Implementamos um funil rigoroso dividido em gates de validação, onde cada trancha de capital depende de evidências, não de opiniões.
              </p>
              
              <div className="space-y-6">
                {[
                    { title: "Descoberta & Ideação", desc: "Validação da tese de investimento e dimensionamento de oportunidade (TAM/SAM/SOM).", color: "bg-blue-500" },
                    { title: "Validação Técnica (POC)", desc: "Prova de conceito em ambiente controlado para validação de hipóteses técnicas.", color: "bg-brand-accent" },
                    { title: "Escala & Sustentação", desc: "Aceleração de crescimento com unit economics (LTV/CAC) comprovados.", color: "bg-green-500" }
                ].map((item, i) => (
                    <div key={i} className="flex gap-4 group cursor-default">
                        <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full ${item.color} mt-2 ring-4 ring-white dark:ring-slate-950 shadow-lg group-hover:scale-125 transition-transform`}></div>
                            {i < 2 && <div className="w-0.5 h-full bg-slate-200 dark:bg-slate-800 my-1 group-hover:bg-slate-300 transition-colors"></div>}
                        </div>
                        <div className="pb-6">
                            <h4 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-brand-primary dark:group-hover:text-brand-accent transition-colors">{item.title}</h4>
                            <p className="text-slate-500 text-sm mt-1">{item.desc}</p>
                        </div>
                    </div>
                ))}
              </div>
           </div>

           {/* Interactive Funnel Visualization */}
           <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-brand-accent/20 rounded-full blur-[80px] opacity-40"></div>
              <div className="relative bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl p-8 border border-white/50 dark:border-slate-700/50 shadow-2xl space-y-4">
                 
                 {/* Top Level */}
                 <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 w-full transform hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Deal Flow</span>
                        <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-2 py-1 rounded-full">100+ Teses</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-400 w-full rounded-full"></div>
                    </div>
                 </div>

                 {/* Arrow Down */}
                 <div className="flex justify-center -my-2 z-10 relative"><div className="bg-slate-200 dark:bg-slate-700 p-1 rounded-full"><ArrowLeft size={16} className="-rotate-90 text-slate-500"/></div></div>

                 {/* Middle Level */}
                 <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md border-l-4 border-l-brand-accent border-y border-r border-y-slate-200 border-r-slate-200 dark:border-y-slate-700 dark:border-r-slate-700 w-[85%] mx-auto transform hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-brand-accent uppercase tracking-wider">Filtro H1/H2/H3</span>
                        <span className="bg-brand-accent/10 text-brand-primary text-[10px] font-bold px-2 py-1 rounded-full">15 POCs</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-accent w-[40%] rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                    </div>
                 </div>

                 {/* Arrow Down */}
                 <div className="flex justify-center -my-2 z-10 relative"><div className="bg-slate-200 dark:bg-slate-700 p-1 rounded-full"><ArrowLeft size={16} className="-rotate-90 text-slate-500"/></div></div>

                 {/* Bottom Level */}
                 <div className="bg-brand-primary text-white rounded-xl p-4 shadow-xl shadow-brand-primary/20 w-[60%] mx-auto transform hover:scale-[1.05] transition-transform duration-300">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Scale-up</span>
                        <span className="bg-white/10 text-white text-[10px] font-bold px-2 py-1 rounded-full">3 Ativos</span>
                    </div>
                    <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[80%] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                    </div>
                 </div>

              </div>
           </div>
        </section>

        {/* Section 2: Innovation Accounting Formula */}
        <section className="bg-slate-900 text-white rounded-[3rem] p-10 md:p-20 relative overflow-hidden group">
           {/* Abstract Background */}
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 transition-all duration-1000 group-hover:bg-white/10"></div>
           <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-accent/10 rounded-full blur-3xl -ml-20 -mb-20 transition-all duration-1000 group-hover:bg-brand-accent/20"></div>
           
           <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
              <div>
                  <div className="inline-flex items-center gap-2 mb-6 text-brand-accent font-mono text-sm">
                      <DollarSign size={16} /> CONTABILIDADE DA INOVAÇÃO
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">A Matemática do Retorno</h2>
                  <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                    Esqueça métricas de vaidade. O Metria introduz uma fórmula proprietária para calcular o <strong>Ganho Econômico (GE)</strong> em ambientes de incerteza, isolando o custo de aprendizado (OpEx) do valor gerado.
                  </p>
                  
                  <div className="flex flex-col gap-4">
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                          <div className="mt-1 bg-green-500/20 p-2 rounded text-green-400"><TrendingUp size={20}/></div>
                          <div>
                              <strong className="block text-white text-lg font-bold">Ve (Valor Econômico)</strong>
                              <p className="text-slate-400 text-sm">O valor tangível gerado: Receita Nova + Redução de Custos + Cost Avoidance.</p>
                          </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                          <div className="mt-1 bg-red-500/20 p-2 rounded text-red-400"><Minus size={20}/></div>
                          <div>
                              <strong className="block text-white text-lg font-bold">Cpoc (Custo da Prova)</strong>
                              <p className="text-slate-400 text-sm">O investimento total para validar a hipótese (Setup + Horas Time + Ferramentas).</p>
                          </div>
                      </div>
                  </div>
              </div>

              {/* The Formula Visualization */}
              <div className="flex items-center justify-center">
                  <div className="relative bg-white/10 backdrop-blur-md border border-white/20 p-8 md:p-12 rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500">
                      <div className="text-center">
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-4">Equação Fundamental</div>
                          <div className="flex items-center justify-center gap-4 text-4xl md:text-6xl font-bold font-mono">
                              <span className="text-white">GE</span>
                              <span className="text-slate-500">=</span>
                              <span className="text-brand-accent">Ve</span>
                              <span className="text-slate-500">-</span>
                              <span className="text-red-400">Cpoc</span>
                          </div>
                          <div className="mt-8 flex justify-center gap-2">
                             <span className="h-1 w-16 bg-white/20 rounded-full"></span>
                             <span className="h-1 w-16 bg-brand-accent rounded-full"></span>
                             <span className="h-1 w-16 bg-red-400/50 rounded-full"></span>
                          </div>
                          <div className="mt-8 pt-8 border-t border-white/10 text-left">
                              <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm text-slate-300">Margem de Contribuição (POC)</span>
                                  <span className="font-mono text-green-400">+ 125%</span>
                              </div>
                              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                  <div className="h-full bg-green-500 w-[70%] rounded-full"></div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
           </div>
        </section>

        {/* Section 3: ICV & Risk Analysis */}
        <section className="grid md:grid-cols-2 gap-20 items-center">
           <div className="order-2 md:order-1 grid grid-cols-2 gap-6">
              {[
                  { label: "Técnico", val: 85, color: "text-emerald-500" },
                  { label: "Mercado", val: 40, color: "text-red-500" },
                  { label: "Legal", val: 95, color: "text-emerald-500" },
                  { label: "Execução", val: 60, color: "text-amber-500" }
              ].map((item, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-center items-center text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                      <div className="relative w-32 h-32 mb-6">
                          <svg className="w-full h-full transform -rotate-90">
                              {/* Track */}
                              <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                              {/* Progress */}
                              <circle 
                                cx="64" cy="64" r="56" 
                                stroke="currentColor" strokeWidth="8" 
                                fill="transparent" 
                                strokeDasharray={351.86} 
                                strokeDashoffset={351.86 - (351.86 * item.val) / 100} 
                                className={`${item.color} transition-all duration-1000 ease-out`} 
                                style={{ strokeLinecap: 'round' }}
                              />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">{item.val}%</span>
                          </div>
                      </div>
                      <span className="text-sm font-bold uppercase text-slate-400 tracking-widest">{item.label}</span>
                  </div>
              ))}
           </div>
           
           <div className="order-1 md:order-2">
              <div className="w-14 h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center mb-8 text-brand-primary shadow-sm rotate-3 hover:rotate-0 transition-transform duration-300">
                 <Shield size={28} strokeWidth={1.5} className="text-brand-accent" />
              </div>
              <h2 className="text-4xl font-bold mb-6 dark:text-white">Índice de Confiança (ICV)</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed font-light">
                Um projeto com ROI alto, mas baixa confiabilidade, é uma aposta, não um investimento corporativo. 
              </p>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-light">
                O <strong>ICV</strong> é nosso algoritmo proprietário que pondera 8 dimensões de risco para calibrar as projeções financeiras. Ele atua como um "Deflator de Otimismo", garantindo que o portfólio reflita a realidade.
              </p>
              
              <div className="flex gap-4">
                 <div className="flex-1 p-5 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl">
                    <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase mb-2">
                        <AlertTriangle size={14}/> ICV Baixo (&lt;30%)
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Zona de Exploração. Foco em reduzir incertezas, não em alavancagem.</p>
                 </div>
                 <div className="flex-1 p-5 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-2xl">
                    <div className="flex items-center gap-2 text-xs font-bold text-green-600 uppercase mb-2">
                        <CheckCircle size={14}/> ICV Alto (&gt;80%)
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Zona de Explotação. Incertezas resolvidas, pronto para escala e go-to-market.</p>
                 </div>
              </div>
           </div>
        </section>

        {/* Section 4: PERT & Scale */}
        <section className="relative">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-950 -z-10 rounded-[3rem]"></div>
           
           <div className="text-center max-w-3xl mx-auto mb-16">
               <div className="inline-flex items-center justify-center w-16 h-16 bg-white dark:bg-slate-800 text-brand-accent rounded-2xl mb-6 shadow-sm">
                  <PieChart size={32} strokeWidth={1.5} />
               </div>
               <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">Engenharia de Valor em Escala (PERT)</h2>
               <p className="text-lg text-slate-600 dark:text-slate-400 font-light">
                 Não confiamos em "números mágicos". O Metria utiliza a técnica de estimativa de três pontos com média ponderada (PERT) para projetar cenários de escala robustos, eliminando o viés do empreendedor.
               </p>
           </div>
           
           <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
              {/* Pessimist */}
              <div className="w-full md:w-64 p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100 transition-opacity transform hover:-translate-y-1">
                 <span className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2 block">Pessimista</span>
                 <div className="h-32 flex items-end justify-center mb-4">
                     <div className="w-16 bg-red-100 dark:bg-red-900/20 rounded-t-lg relative h-[40%] group-hover:h-[45%] transition-all">
                         <div className="absolute bottom-0 w-full bg-red-400 h-1 rounded-b-lg"></div>
                     </div>
                 </div>
                 <div className="text-center font-mono text-xs text-slate-400">Peso 1</div>
              </div>

              {/* Realistic */}
              <div className="w-full md:w-72 p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border-2 border-brand-accent relative z-10 transform scale-110">
                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-accent text-brand-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase">Média Ponderada</div>
                 <span className="text-sm font-bold text-brand-accent uppercase tracking-wider mb-4 block text-center">Realista</span>
                 <div className="h-40 flex items-end justify-center mb-6">
                     <div className="w-20 bg-brand-accent/10 rounded-t-xl relative h-[70%]">
                         <div className="absolute bottom-0 w-full bg-brand-accent h-full rounded-t-xl opacity-20"></div>
                         <div className="absolute bottom-0 w-full bg-brand-accent h-[70%] rounded-t-xl"></div>
                     </div>
                 </div>
                 <div className="text-center font-mono text-sm font-bold text-slate-600 dark:text-slate-300">Peso 4 (Principal)</div>
              </div>

              {/* Optimistic */}
              <div className="w-full md:w-64 p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100 transition-opacity transform hover:-translate-y-1">
                 <span className="text-xs font-bold text-green-500 uppercase tracking-wider mb-2 block">Otimista</span>
                 <div className="h-32 flex items-end justify-center mb-4">
                     <div className="w-16 bg-green-100 dark:bg-green-900/20 rounded-t-lg relative h-[90%] group-hover:h-[95%] transition-all">
                         <div className="absolute bottom-0 w-full bg-green-400 h-1 rounded-b-lg"></div>
                     </div>
                 </div>
                 <div className="text-center font-mono text-xs text-slate-400">Peso 1</div>
              </div>
           </div>
        </section>

      </main>

      {/* Footer CTA */}
      <footer className="bg-brand-primary text-white py-24 text-center px-6 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
         <div className="relative z-10 max-w-3xl mx-auto">
             <h2 className="text-4xl font-bold mb-8 tracking-tight">Pronto para auditar sua inovação?</h2>
             <p className="text-slate-400 text-lg mb-12 font-light">
               Comece agora gratuitamente e valide seus projetos com o mesmo framework utilizado por empresas Fortune 500.
             </p>
             <button onClick={onRegister} className="bg-brand-accent text-brand-primary px-12 py-5 rounded-2xl text-lg font-bold hover:bg-white hover:scale-105 transition-all shadow-2xl shadow-brand-accent/20">
                Iniciar Trial Corporativo
             </button>
         </div>
      </footer>

    </div>
  );
};

export default MethodologyPage;