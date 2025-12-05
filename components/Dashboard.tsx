import React, { useEffect, useState } from 'react';
import { db } from '../services/db';
import { Project } from '../types';
import { Eye, Trash2, Plus } from 'lucide-react';

interface DashboardProps {
  onNavigate: (path: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const user = db.getCurrentUser();

  useEffect(() => {
    if (user) {
      setProjects(db.getProjects(user.email));
    }
  }, [user]);

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      db.deleteProject(id);
      if (user) setProjects(db.getProjects(user.email));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-brand-primary dark:text-white">Meus Relatórios</h1>
        <button 
          onClick={() => onNavigate('/new-project')}
          className="bg-brand-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-700 transition-colors"
        >
          <Plus size={18} /> Novo Projeto
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow border border-gray-100 dark:border-slate-700 overflow-hidden">
        {projects.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">Nenhum projeto encontrado.</p>
            <button onClick={() => onNavigate('/new-project')} className="text-brand-accent hover:underline">Crie sua primeira análise</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-700 text-xs uppercase text-gray-500 dark:text-gray-400">
                  <th className="p-4 font-semibold">Projeto</th>
                  <th className="p-4 font-semibold">Criado em</th>
                  <th className="p-4 font-semibold">Modo</th>
                  <th className="p-4 font-semibold">Pontuação</th>
                  <th className="p-4 font-semibold">ROI (Realista)</th>
                  <th className="p-4 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors group">
                    <td className="p-4">
                      <p className="font-bold text-brand-primary dark:text-white">{p.name}</p>
                      <p className="text-xs text-gray-400">Inv: R$ {p.financials.investment.toLocaleString()}</p>
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                      {new Date(p.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${p.mode === 'PRO' ? 'bg-brand-primary text-white' : 'bg-green-100 text-green-800'}`}>
                        {p.mode}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${p.score > 70 ? 'text-green-600' : p.score > 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {p.score}
                        </span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full ${p.score > 70 ? 'bg-green-500' : p.score > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${p.score}%`}}></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-medium dark:text-gray-200">
                      {p.roi}%
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => onNavigate(`/report/${p.id}`)}
                          className="p-2 text-gray-400 hover:text-brand-primary dark:hover:text-brand-accent transition-colors"
                          title="Ver Relatório"
                        >
                          <Eye size={18} />
                        </button>
                         <button 
                          onClick={() => handleDelete(p.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
