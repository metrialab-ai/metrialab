import React from 'react';
import { User, LogOut, Sun, Moon, LayoutDashboard, PlusCircle, FileText } from 'lucide-react';
import { db } from '../services/db';

interface LayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  toggleTheme: () => void;
  onNavigate: (path: string) => void;
  currentPath: string;
}

const Layout: React.FC<LayoutProps> = ({ children, darkMode, toggleTheme, onNavigate, currentPath }) => {
  const user = db.getCurrentUser();

  const handleLogout = () => {
    db.logout();
    onNavigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-primary text-white flex-shrink-0 hidden md:flex flex-col shadow-xl">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-2 font-bold text-2xl text-brand-accent">
            <LayoutDashboard className="h-8 w-8" />
            <span>Metria</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Innovation Accounting</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => onNavigate('/dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              currentPath === '/dashboard' ? 'bg-brand-accent text-brand-primary font-bold' : 'hover:bg-slate-700 text-slate-300'
            }`}
          >
            <FileText size={20} />
            Meus Relatórios
          </button>
          
          <button
            onClick={() => onNavigate('/new-project')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              currentPath === '/new-project' ? 'bg-brand-accent text-brand-primary font-bold' : 'hover:bg-slate-700 text-slate-300'
            }`}
          >
            <PlusCircle size={20} />
            Novo Projeto
          </button>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-10 w-10 rounded-full bg-brand-accent flex items-center justify-center text-brand-primary font-bold text-lg">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.role || 'Usuário'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-sm text-red-400 hover:text-red-300 hover:bg-slate-800 py-2 rounded transition-colors"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header / Top Bar */}
        <header className="bg-white dark:bg-slate-900 shadow-sm z-10 p-4 flex justify-between items-center md:justify-end">
          <div className="md:hidden flex items-center gap-2 font-bold text-xl text-brand-primary dark:text-brand-accent">
            <LayoutDashboard />
            Metria
          </div>

          <div className="flex items-center gap-4">
             <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Alternar Tema"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="h-8 w-8 rounded-full bg-brand-primary text-white flex md:hidden items-center justify-center text-xs">
              {user?.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
