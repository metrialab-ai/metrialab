import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, X, Zap, Shield, HelpCircle, ArrowRight, Layout, Star, Briefcase, Globe } from 'lucide-react';

interface PlansPageProps {
  onBack: () => void;
  onRegister: () => void;
}

const PlansPage: React.FC<PlansPageProps> = ({ onBack, onRegister }) => {
  const [proTier, setProTier] = useState<1 | 2 | 5 | 10>(5);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const proPrices = {
    1: 59,
    2: 99,
    5: 229,
    10: 349
  };

  const calculatePrice = (basePrice: number) => {
    return billingCycle === 'yearly' ? Math.floor(basePrice * 0.85) : basePrice;
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-brand-accent selection:text-brand-primary overflow-x-hidden transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-accent/5 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-30"></div>
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-30"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 transition-all duration-300">
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
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
             <div className="bg-brand-accent text-brand-primary p-1 rounded">
                <Layout size={18} />
             </div>
             <span>Planos & Investimento</span>
          </div>
          <button 
            onClick={onRegister}
            className="bg-brand-primary text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-200 dark:text-slate-900 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
          >
            Começar Grátis <ArrowRight size={14}/>
          </button>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6">
            Maximização de ROIC com <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-yellow-600">risco controlado.</span>
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
             Escolha a infraestrutura que melhor se adapta à maturidade de governança da sua empresa. Transparência total, sem custos ocultos.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-10 inline-flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl relative">
             <button 
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}
             >
                Mensal
             </button>
             <button 
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}
             >
                Anual <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full">-15%</span>
             </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 items-start mb-24">
            
            {/* PLANO LIGHT */}
            <div className="flex flex-col border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 p-8 hover:shadow-xl transition-all duration-300">
               <div className="mb-6">
                 <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 text-slate-400">
                    <Star size={24} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-800 dark:text-white">Discovery</h3>
                 <p className="text-sm text-slate-500 mt-2">Para validação de teses iniciais.</p>
               </div>
               
               <div className="mb-8">
                 <span className="text-5xl font-bold text-slate-900 dark:text-white tracking-tight">R$ 0</span>
               </div>

               <div className="flex-1 space-y-4 text-sm mb-10 border-t border-slate-100 dark:border-slate-800 pt-8">
                 <ul className="space-y-4">
                   <li className="flex gap-3 text-slate-700 dark:text-slate-300"><Check size={18} className="text-slate-400 flex-shrink-0" /> Até 3 projetos ativos</li>
                   <li className="flex gap-3 text-slate-700 dark:text-slate-300"><Check size={18} className="text-slate-400 flex-shrink-0" /> 1 usuário administrador</li>
                   <li className="flex gap-3 text-slate-700 dark:text-slate-300"><Check size={18} className="text-slate-400 flex-shrink-0" /> Cálculo básico de ROI</li>
                   <li className="flex gap-3 text-slate-700 dark:text-slate-300"><Check size={18} className="text-slate-400 flex-shrink-0" /> Exportação Padrão</li>
                 </ul>
               </div>

               <button onClick={onRegister} className="w-full py-4 px-6 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                 Acessar Agora
               </button>
            </div>

            {/* PLANO PRO */}
            <div className="flex flex-col border-2 border-brand-accent rounded-3xl bg-slate-900 text-white p-8 shadow-2xl shadow-brand-accent/20 relative transform scale-105 z-10">
               <div className="absolute top-0 right-0 bg-brand-accent text-brand-primary text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl rounded-tr-2xl uppercase tracking-wide">
                 Gestão de Portfólio
               </div>
               
               <div className="mb-6">
                 <div className="w-12 h-12 bg-brand-accent/20 rounded-2xl flex items-center justify-center mb-4 text-brand-accent">
                    <Zap size={24} fill="currentColor" />
                 </div>
                 <h3 className="text-xl font-bold flex items-center gap-2">Professional</h3>
                 <p className="text-sm text-slate-400 mt-2">Governança completa e análise de risco.</p>
               </div>

               {/* Tier Selector */}
               <div className="bg-slate-800 p-1.5 rounded-xl flex mb-6">
                  {[1, 2, 5, 10].map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setProTier(tier as any)}
                      className={`flex-1 py-1.5 text-[10px] md:text-xs font-bold rounded-lg transition-all ${proTier === tier ? 'bg-brand-accent text-brand-primary shadow-sm' : 'text-slate-400 hover:text-white'}`}
                    >
                      {tier}
                    </button>
                  ))}
               </div>
               
               <div className="mb-8">
                 <div className="flex items-baseline">
                    <span className="text-6xl font-bold tracking-tight">R$ {calculatePrice(proPrices[proTier])}</span>
                    <span className="text-slate-400 ml-2">/ mês</span>
                 </div>
                 {billingCycle === 'yearly' && (
                    <p className="text-xs text-brand-accent mt-2 font-bold">Faturado anualmente (R$ {calculatePrice(proPrices[proTier]) * 12})</p>
                 )}
               </div>

               <div className="flex-1 space-y-4 text-sm mb-10 border-t border-slate-800 pt-8">
                 <ul className="space-y-4">
                   <li className="flex gap-3 text-white font-bold"><Check size={18} className="text-brand-accent flex-shrink-0" /> {proTier} Projetos Ativos</li>
                   <li className="flex gap-3 text-slate-300"><Check size={18} className="text-brand-accent flex-shrink-0" /> Cenários PERT (Ponderados)</li>
                   <li className="flex gap-3 text-slate-300"><Check size={18} className="text-brand-accent flex-shrink-0" /> ICV & Matriz de Risco</li>
                   <li className="flex gap-3 text-slate-300"><Check size={18} className="text-brand-accent flex-shrink-0" /> Inteligência Artificial (Gemini)</li>
                   <li className="flex gap-3 text-slate-300"><Check size={18} className="text-brand-accent flex-shrink-0" /> Relatórios White-label</li>
                 </ul>
               </div>

               <button onClick={onRegister} className="w-full py-4 px-6 bg-brand-accent text-brand-primary font-bold rounded-xl hover:bg-white hover:scale-105 transition-all shadow-lg shadow-brand-accent/20">
                 Iniciar Trial Pro
               </button>
            </div>

            {/* PLANO ENTERPRISE */}
            <div className="flex flex-col border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 p-8 hover:shadow-xl transition-all duration-300">
               <div className="mb-6">
                 <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 text-slate-400">
                    <Briefcase size={24} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-800 dark:text-white">Enterprise</h3>
                 <p className="text-sm text-slate-500 mt-2">Infraestrutura corporativa dedicada.</p>
               </div>
               
               <div className="mb-8">
                 <span className="text-4xl font-bold text-slate-900 dark:text-white">Customizado</span>
               </div>

               <div className="flex-1 space-y-4 text-sm mb-10 border-t border-slate-100 dark:border-slate-800 pt-8">
                 <ul className="space-y-4">
                   <li className="flex gap-3 text-slate-700 dark:text-slate-300"><Check size={18} className="text-slate-400 flex-shrink-0" /> Portfólios Ilimitados</li>
                   <li className="flex gap-3 text-slate-700 dark:text-slate-300"><Check size={18} className="text-slate-400 flex-shrink-0" /> Múltiplos Admins & Equipes</li>
                   <li className="flex gap-3 text-slate-700 dark:text-slate-300"><Check size={18} className="text-slate-400 flex-shrink-0" /> API Access & Webhooks</li>
                   <li className="flex gap-3 text-slate-700 dark:text-slate-300"><Check size={18} className="text-slate-400 flex-shrink-0" /> SSO (SAML/AD)</li>
                   <li className="flex gap-3 text-slate-700 dark:text-slate-300"><Check size={18} className="text-slate-400 flex-shrink-0" /> Customer Success Dedicado</li>
                 </ul>
               </div>

               <button onClick={() => window.location.href = 'mailto:enterprise@metria.com'} className="w-full py-4 px-6 border border-slate-900 dark:border-slate-700 bg-slate-900 dark:bg-slate-800 text-white font-bold rounded-xl hover:opacity-90 transition-colors">
                 Agendar Consultoria
               </button>
            </div>
        </div>

        {/* Feature Comparison */}
        <div className="max-w-5xl mx-auto mb-24">
            <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Comparativo de Recursos</h2>
            
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                        <tr>
                            <th className="px-6 py-4 rounded-tl-xl rounded-bl-xl">Recurso</th>
                            <th className="px-6 py-4 text-center">Discovery</th>
                            <th className="px-6 py-4 text-center text-brand-primary dark:text-brand-accent font-bold">Professional</th>
                            <th className="px-6 py-4 text-center rounded-tr-xl rounded-br-xl">Enterprise</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {[
                            { name: 'Projetos Ativos', light: '3', pro: '1 a 10', ent: 'Ilimitado' },
                            { name: 'Modelagem Financeira Básica', light: true, pro: true, ent: true },
                            { name: 'Cenários Ponderados (PERT)', light: false, pro: true, ent: true },
                            { name: 'Índice ICV (Score de Risco)', light: 'Simplificado', pro: 'Completo (8 pts)', ent: 'Customizável' },
                            { name: 'Exportação Executiva', light: 'Com Marca', pro: 'White-label', ent: 'White-label' },
                            { name: 'Suporte Técnico', light: 'Comunidade', pro: 'Email (Prioritário)', ent: 'SLA Dedicado' },
                            { name: 'Integrações (API)', light: false, pro: false, ent: true },
                        ].map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{row.name}</td>
                                <td className="px-6 py-4 text-center text-slate-500">
                                    {row.light === true ? <Check size={16} className="mx-auto text-green-500"/> : row.light === false ? <X size={16} className="mx-auto text-slate-300"/> : row.light}
                                </td>
                                <td className="px-6 py-4 text-center font-bold text-slate-700 dark:text-slate-200">
                                     {row.pro === true ? <Check size={16} className="mx-auto text-brand-accent"/> : row.pro === false ? <X size={16} className="mx-auto text-slate-300"/> : row.pro}
                                </td>
                                <td className="px-6 py-4 text-center text-slate-500">
                                     {row.ent === true ? <Check size={16} className="mx-auto text-blue-500"/> : row.ent === false ? <X size={16} className="mx-auto text-slate-300"/> : row.ent}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Perguntas Frequentes</h2>
            <div className="space-y-4">
                {[
                    { q: 'O que acontece se eu exceder o limite de projetos no plano Pro?', a: 'Você receberá um alerta. É possível realizar o upgrade para um tier superior (até 10 projetos) instantaneamente. Acima disso, nossa equipe Enterprise fará a migração do seu ambiente.' },
                    { q: 'Qual a política de cancelamento?', a: 'Transparência total. Nos planos mensais, cancele a qualquer momento sem multa. Nos planos anuais, oferecemos garantia de reembolso proporcional nos primeiros 30 dias.' },
                    { q: 'Como o Índice ICV é calculado?', a: 'O Índice de Confiança e Viabilidade (ICV) é um algoritmo proprietário que pondera 8 vetores de risco (técnico, mercado, legal, etc) para calibrar as projeções financeiras, atuando como um "deflator de otimismo".' },
                    { q: 'Preciso de cartão de crédito para o plano Discovery?', a: 'Não. O acesso ao plano Discovery é gratuito para fins de validação inicial e não requer dados de pagamento.' }
                ].map((item, i) => (
                    <div key={i} className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:bg-white dark:hover:bg-slate-900 transition-colors">
                        <h4 className="font-bold text-lg mb-2 flex items-start gap-3 text-slate-800 dark:text-white">
                            <HelpCircle size={20} className="text-brand-accent flex-shrink-0 mt-1"/>
                            {item.q}
                        </h4>
                        <p className="text-slate-500 dark:text-slate-400 pl-8">{item.a}</p>
                    </div>
                ))}
            </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 text-center border-t border-slate-800">
         <div className="max-w-4xl mx-auto px-6">
             <h3 className="text-2xl font-bold mb-6">Fale com um Especialista</h3>
             <div className="flex justify-center gap-4">
                 <button className="bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-lg font-bold transition-colors">
                     Central de Suporte
                 </button>
                 <button className="bg-brand-accent text-brand-primary px-6 py-3 rounded-lg font-bold hover:bg-white transition-colors">
                     Consultoria Comercial
                 </button>
             </div>
             <p className="text-slate-500 mt-12 text-sm">&copy; 2024 Metria Inc. Todos os direitos reservados.</p>
         </div>
      </footer>

    </div>
  );
};

export default PlansPage;