import React, { useEffect, useState } from 'react';
import { db } from '../services/db';
import { Project } from '../types';
import { Eye, Trash2, Plus, Wallet, Activity, TrendingUp, LayoutGrid, List, Search, ArrowUpRight, AlertCircle, PieChart } from 'lucide-react';

interface DashboardProps {
  onNavigate: (path: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const user = db.getCurrentUser();

  useEffect(() => {
    if (user) {
      setProjects(db.getProjects(user.email));
    }
  }, [user]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Tem certeza que deseja excluir este projeto? A ação é irreversível e removerá todos os dados financeiros associados.')) {
      db.deleteProject(id);
      if (user) setProjects(db.getProjects(user.email));
    }
  };

  // Portfolio Metrics
  const totalProjects = projects.length;
  const totalInvestment = projects.reduce((acc, p) => acc + (p.financials.investment || 0), 0);
  const avgScore = totalProjects > 0 ? Math.round(projects.reduce((acc, p) => acc + p.score, 0) / totalProjects) : 0;
  const avgRoi = totalProjects > 0 ? (projects.reduce((acc, p) => acc + p.roi, 0) / totalProjects).toFixed(1) : '0.0';

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.area?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Visão de Portfólio</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 text-sm">
             Gestão de Ativos de Inovação &bull; <span className="font-mono">{user?.company || 'Corporativo'}</span>
          </p>
        </div>
        <button 
          onClick={() => onNavigate('/new-project')}
          className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-6 py-3 rounded-xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center gap-2 text-sm"
        >
          <Plus size={18} strokeWidth={2.5} /> Nova Análise
        </button>
      </div>

      {/* Portfolio Summary Cards */}
      {projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                        <Wallet size={20} />
                    </div>
                    {totalInvestment > 0 && (
                        <span className="flex items-center text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                            <ArrowUpRight size={10} className="mr-0.5"/> CapEx
                        </span>
                    )}
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Investimento Total</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                        {totalInvestment.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                        <Activity size={20} />
                    </div>
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Score Médio (ICV)</p>
                    <div className="flex items-baseline gap-2 mt-1">
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{avgScore}/100</p>
                        <div className="h-1.5 w-16 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${avgScore > 70 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{width: `${avgScore}%`}}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400">
                        <TrendingUp size={20} />
                    </div>
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Eficiência Média (BCR)</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{avgRoi}x</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-brand-accent/10 rounded-lg text-brand-accent">
                        <PieChart size={20} />
                    </div>
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Projetos Ativos</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalProjects}</p>
                </div>
            </div>
        </div>
      )}

      {/* Filters & View Toggle */}
      {projects.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                    type="text" 
                    placeholder="Filtrar por nome, área ou responsável..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-sm focus:ring-2 focus:ring-brand-accent outline-none transition-all placeholder:text-slate-400"
                />
            </div>
            <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow text-brand-primary dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <List size={18} />
                </button>
                <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow text-brand-primary dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <LayoutGrid size={18} />
                </button>
            </div>
          </div>
      )}

      {/* Projects List/Grid */}
      {projects.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-16 text-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Activity size={32} className="text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Seu portfólio está vazio</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
                Comece a estruturar suas iniciativas de inovação com rigor financeiro. Crie sua primeira análise agora.
            </p>
            <button onClick={() => onNavigate('/new-project')} className="bg-brand-accent text-brand-primary px-8 py-3 rounded-xl font-bold hover:bg-brand-accent/90 transition-colors shadow-lg shadow-brand-accent/20">
                Iniciar Primeiro Projeto
            </button>
        </div>
      ) : (
        <>
            {viewMode === 'list' ? (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Projeto / Área</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Investimento (CPOC)</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Modo</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Innovation Score</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Eficiência (BCR)</th>
                                    <th className="px-6 py-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {filteredProjects.map((p) => (
                                    <tr 
                                        key={p.id} 
                                        onClick={() => onNavigate(`/report/${p.id}`)}
                                        className="group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-all cursor-pointer"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold text-sm group-hover:bg-white group-hover:shadow-sm transition-all border border-slate-200 dark:border-slate-600">
                                                    {p.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-brand-primary dark:group-hover:text-brand-accent transition-colors">{p.name}</p>
                                                    <p className="text-xs text-slate-500">{p.area || 'Geral'} &bull; {new Date(p.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm font-mono font-medium text-slate-700 dark:text-slate-300">
                                                {p.financials.investment?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </p>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${p.mode === 'PRO' ? 'bg-slate-900 text-white border-slate-700 dark:bg-white dark:text-slate-900' : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300'}`}>
                                                {p.mode === 'LIGHT' ? 'Discovery' : 'Professional'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden min-w-[80px]">
                                                    <div 
                                                        className={`h-full rounded-full ${p.score > 70 ? 'bg-green-500' : p.score > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                                        style={{width: `${p.score}%`}}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 w-8">{p.score}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-sm font-bold ${p.roi >= 2 ? 'text-green-600 dark:text-green-400' : p.roi >= 1 ? 'text-yellow-600 dark:text-yellow-400' : 'text-slate-500'}`}>
                                                    {p.roi?.toFixed(2)}x
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); onNavigate(`/report/${p.id}`); }}
                                                    className="p-2 text-slate-400 hover:text-brand-primary dark:hover:text-white hover:bg-white dark:hover:bg-slate-600 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-500"
                                                    title="Ver Análise Completa"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button 
                                                    onClick={(e) => handleDelete(p.id, e)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                    title="Arquivar Projeto"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((p) => (
                        <div 
                            key={p.id} 
                            onClick={() => onNavigate(`/report/${p.id}`)}
                            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-slate-900 dark:text-white font-bold border border-slate-100 dark:border-slate-600 group-hover:border-brand-accent/50 transition-colors">
                                        {p.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${p.mode === 'PRO' ? 'bg-slate-900 text-white border-slate-700 dark:bg-white dark:text-slate-900' : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-700 dark:text-slate-400'}`}>
                                        {p.mode === 'LIGHT' ? 'Discovery' : 'Professional'}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 group-hover:text-brand-primary dark:group-hover:text-brand-accent transition-colors">{p.name}</h3>
                                <p className="text-sm text-slate-500 mb-6 line-clamp-2">{p.mainGoal || 'Sem objetivo definido.'}</p>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Score</span>
                                        <span className={`font-bold ${p.score > 70 ? 'text-green-600' : 'text-slate-700 dark:text-white'}`}>{p.score}/100</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${p.score > 70 ? 'bg-green-500' : p.score > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${p.score}%`}}></div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center pt-4 border-t border-slate-50 dark:border-slate-700/50">
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Investimento</p>
                                    <p className="font-mono font-medium text-slate-700 dark:text-slate-300 text-sm">
                                        {p.financials.investment?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-400 uppercase font-bold">ROI Estimado</p>
                                    <p className={`font-mono font-bold text-sm ${p.roi >= 2 ? 'text-green-600' : 'text-slate-700 dark:text-white'}`}>
                                        {p.roi?.toFixed(2)}x
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
      )}
    </div>
  );
};

export default Dashboard;