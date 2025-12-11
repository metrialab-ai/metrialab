import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { User, Project } from '../types';
import { Users, FileText, Activity, Shield, Search, Clock, Building, MapPin, Calendar, Trash2, Edit2, MoreVertical, XCircle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'projects'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const currentUser = db.getCurrentUser();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setUsers(db.getUsers());
    setProjects(db.getAllProjects());
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (id === currentUser?.id) {
      alert("Você não pode excluir seu próprio usuário.");
      return;
    }
    if (confirm(`Tem certeza que deseja excluir o usuário ${name}? Esta ação não pode ser desfeita e removerá o acesso à plataforma.`)) {
      db.deleteUser(id);
      loadData();
    }
  };

  const handleDeleteProject = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir o projeto "${name}"? Esta ação não pode ser desfeita.`)) {
      db.deleteProject(id);
      loadData();
    }
  };

  // Stats
  const totalUsers = users.length;
  const totalProjects = projects.length;
  const totalInvestment = projects.reduce((acc, curr) => acc + (curr.financials.investment || 0), 0);
  const averageScore = totalProjects > 0 ? (projects.reduce((acc, curr) => acc + curr.score, 0) / totalProjects).toFixed(1) : 0;

  // Chart Data: Projects by Role
  const roleDataMap = users.reduce((acc, user) => {
    if (user.role) {
      acc[user.role] = (acc[user.role] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const roleData = Object.entries(roleDataMap).map(([name, value]) => ({ name, value }));

  const filterUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.company && u.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filterProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.responsible && p.responsible.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-primary dark:text-white flex items-center gap-2">
            <Shield className="text-brand-accent" /> Painel do Administrador
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Visão global da plataforma e auditoria de dados.</p>
        </div>
        
        <div className="flex bg-white dark:bg-slate-800 p-1 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-brand-primary text-white shadow' : 'text-gray-500 hover:text-brand-primary dark:hover:text-white'}`}
          >
            Visão Geral
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'users' ? 'bg-brand-primary text-white shadow' : 'text-gray-500 hover:text-brand-primary dark:hover:text-white'}`}
          >
            Usuários
          </button>
          <button 
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'projects' ? 'bg-brand-primary text-white shadow' : 'text-gray-500 hover:text-brand-primary dark:hover:text-white'}`}
          >
            Projetos Globais
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group">
              <div className="absolute right-0 top-0 opacity-5 group-hover:opacity-10 transition-opacity">
                <Users size={100} />
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                  <Users size={20} />
                </div>
                <span className="text-xs font-bold uppercase text-gray-400">Total Usuários</span>
              </div>
              <p className="text-3xl font-bold text-brand-primary dark:text-white">{totalUsers}</p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group">
               <div className="absolute right-0 top-0 opacity-5 group-hover:opacity-10 transition-opacity">
                <FileText size={100} />
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                  <FileText size={20} />
                </div>
                <span className="text-xs font-bold uppercase text-gray-400">Projetos Criados</span>
              </div>
              <p className="text-3xl font-bold text-brand-primary dark:text-white">{totalProjects}</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group">
               <div className="absolute right-0 top-0 opacity-5 group-hover:opacity-10 transition-opacity">
                <Activity size={100} />
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
                  <Activity size={20} />
                </div>
                <span className="text-xs font-bold uppercase text-gray-400">Score Médio</span>
              </div>
              <p className="text-3xl font-bold text-brand-primary dark:text-white">{averageScore}/100</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group">
               <div className="absolute right-0 top-0 opacity-5 group-hover:opacity-10 transition-opacity">
                <Building size={100} />
              </div>
               <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded-lg">
                    <Building size={20} />
                 </div>
                 <span className="text-xs font-bold uppercase text-gray-400">Investimento Mapeado</span>
               </div>
               <p className="text-2xl font-bold text-brand-primary dark:text-white">R$ {(totalInvestment / 1000000).toFixed(2)} Mi</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
             <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                <h3 className="font-bold mb-4 dark:text-white">Usuários por Cargo</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={roleData} layout="vertical" margin={{ left: 40, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                      <Tooltip 
                        cursor={{fill: 'transparent'}} 
                        contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: 8, border: 'none' }} 
                      />
                      <Bar dataKey="value" fill="#eab308" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
             </div>
             
             <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                <h3 className="font-bold mb-4 dark:text-white">Atividades Recentes</h3>
                <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    {users.slice(0, 5).map(u => (
                        <div key={u.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-100 dark:border-slate-600">
                             <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-brand-primary text-brand-accent flex items-center justify-center font-bold text-xs">
                                     {u.name.charAt(0)}
                                 </div>
                                 <div>
                                     <p className="text-sm font-bold dark:text-white">{u.name}</p>
                                     <p className="text-xs text-gray-400">{u.email}</p>
                                 </div>
                             </div>
                             <div className="text-right">
                                 <p className="text-xs font-medium dark:text-gray-300">Último Acesso</p>
                                 <p className="text-[10px] text-gray-500 flex items-center justify-end gap-1">
                                    <Clock size={10} />
                                    {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'N/A'}
                                 </p>
                             </div>
                        </div>
                    ))}
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden animate-fadeIn">
           <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-4 bg-gray-50/50 dark:bg-slate-800">
              <div className="relative flex-1 w-full max-w-md">
                 <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                 <input 
                    type="text" 
                    placeholder="Buscar usuários por nome, email ou empresa..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm"
                 />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                 Mostrando {filterUsers.length} de {users.length} usuários
              </div>
           </div>
           <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-slate-700/50 text-gray-500 dark:text-gray-400 font-semibold uppercase text-xs">
                    <tr>
                        <th className="p-4">Usuário</th>
                        <th className="p-4">Cargo / Empresa</th>
                        <th className="p-4">Localização</th>
                        <th className="p-4">Último Acesso</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                    {filterUsers.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                            <td className="p-4">
                                <div className="font-bold dark:text-white flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-[10px] text-slate-600 dark:text-slate-300">
                                        {user.name.charAt(0)}
                                    </div>
                                    {user.name}
                                </div>
                                <div className="text-xs text-gray-500 ml-8">{user.email}</div>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center gap-1"><Building size={14} className="text-gray-400"/> {user.company || '-'}</div>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full mt-1 inline-block ${user.role === 'Administrador' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-400'}`}>
                                    {user.role || 'Sem Cargo'}
                                </span>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center gap-1"><MapPin size={14} className="text-gray-400"/> {user.city}, {user.state}</div>
                                <div className="text-xs text-gray-500 mt-1">{user.country}</div>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center gap-1"><Clock size={14} className="text-gray-400"/> 
                                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Nunca'}
                                </div>
                            </td>
                            <td className="p-4 text-center">
                                {user.isProfileComplete ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                                        <CheckCircle size={10} /> Ativo
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100">
                                        Pendente
                                    </span>
                                )}
                            </td>
                            <td className="p-4 text-right">
                                <button 
                                    onClick={() => handleDeleteUser(user.id, user.name)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    title="Excluir Usuário"
                                    disabled={user.id === currentUser?.id}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
           </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden animate-fadeIn">
           <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-4 bg-gray-50/50 dark:bg-slate-800">
              <div className="relative flex-1 w-full max-w-md">
                 <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                 <input 
                    type="text" 
                    placeholder="Buscar projetos por nome, responsável ou ID..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm"
                 />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                 Mostrando {filterProjects.length} de {projects.length} projetos
              </div>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
                 <thead className="bg-gray-50 dark:bg-slate-700/50 text-gray-500 dark:text-gray-400 font-semibold uppercase text-xs">
                     <tr>
                         <th className="p-4">Projeto</th>
                         <th className="p-4">Responsável (Owner)</th>
                         <th className="p-4">Modo</th>
                         <th className="p-4">Investimento</th>
                         <th className="p-4 text-center">Score</th>
                         <th className="p-4">Data Criação</th>
                         <th className="p-4 text-right">Ações</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                     {filterProjects.map(proj => (
                         <tr key={proj.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                             <td className="p-4">
                                 <div className="font-bold dark:text-white">{proj.name}</div>
                                 <div className="text-xs text-gray-500 font-mono bg-gray-100 dark:bg-slate-700 inline-block px-1 rounded mt-0.5">{proj.id.slice(0, 8)}</div>
                             </td>
                             <td className="p-4">
                                 <div className="text-gray-700 dark:text-gray-300 font-medium">{proj.responsible || 'N/A'}</div>
                                 <div className="text-xs text-gray-500">{proj.userId}</div>
                             </td>
                             <td className="p-4">
                                 <span className={`text-[10px] font-bold px-2 py-1 rounded border ${proj.mode === 'PRO' ? 'border-brand-accent text-brand-primary bg-brand-accent' : 'border-gray-300 text-gray-500 bg-gray-50'}`}>
                                     {proj.mode === 'LIGHT' ? 'Discovery' : 'Professional'}
                                 </span>
                             </td>
                             <td className="p-4 font-mono font-medium">
                                 R$ {proj.financials.investment?.toLocaleString() || '0'}
                             </td>
                             <td className="p-4 text-center">
                                 <div className={`inline-block px-2 py-1 rounded font-bold text-xs ${proj.score > 70 ? 'bg-green-100 text-green-700' : proj.score > 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                     {proj.score}
                                 </div>
                             </td>
                             <td className="p-4 text-gray-500">
                                 {new Date(proj.createdAt).toLocaleDateString()}
                             </td>
                             <td className="p-4 text-right">
                                <button 
                                    onClick={() => handleDeleteProject(proj.id, proj.name)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    title="Excluir Projeto"
                                >
                                    <Trash2 size={16} />
                                </button>
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;