import React, { useState } from 'react';
import { LogOut, Sun, Moon, LayoutDashboard, PlusCircle, FileText, User as UserIcon, Shield, Menu, X, ChevronRight } from 'lucide-react';
import { db } from '../services/db';

interface LayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  toggleTheme: () => void;
  onNavigate: (path: string) => void;
  currentPath: string;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, darkMode, toggleTheme, onNavigate, currentPath, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = db.getCurrentUser();
  const isAdmin = user?.role === 'Administrador';

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setIsMobileMenuOpen(false);
  };

  const navItemClass = (path: string, isMobile = false) => `
    flex items-center gap-3 px-4 py-2 rounded-lg transition-all font-medium duration-200
    ${isMobile ? 'w-full text-base' : 'text-sm'}
    ${currentPath === path 
      ? 'bg-brand-accent text-brand-primary shadow-lg shadow-brand-accent/20 font-bold transform scale-[1.02]' 
      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'}
  `;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header Navigation */}
      <header className="bg-brand-primary text-white shadow-xl z-30 flex-shrink-0 relative border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Desktop Nav Group */}
            <div className="flex items-center gap-8">
              {/* Logo */}
              <div 
                className="flex items-center gap-2 font-bold text-xl text-brand-accent select-none cursor-pointer hover:opacity-90 transition-opacity" 
                onClick={() => handleNavClick('/dashboard')}
              >
                <div className="bg-brand-accent text-brand-primary p-1 rounded-lg">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <span className="tracking-tight">Metria</span>
              </div>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1 bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
                <button
                  onClick={() => handleNavClick('/dashboard')}
                  className={navItemClass('/dashboard')}
                >
                  <FileText size={18} />
                  Meus Relatórios
                </button>
                
                <button
                  onClick={() => handleNavClick('/new-project')}
                  className={navItemClass('/new-project')}
                >
                  <PlusCircle size={18} />
                  Novo Projeto
                </button>

                {isAdmin && (
                  <button
                    onClick={() => handleNavClick('/admin')}
                    className={navItemClass('/admin')}
                  >
                    <Shield size={18} />
                    Painel Admin
                  </button>
                )}
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700"
                title="Alternar Tema"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <div className="h-6 w-px bg-slate-700 hidden sm:block"></div>

              {/* User Profile & Logout */}
              <div className="flex items-center gap-3 pl-2 sm:pl-0 border-l sm:border-none border-slate-700">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-bold leading-none text-slate-200">{user?.name?.split(' ')[0]}</span>
                  <span className="text-[10px] text-brand-accent uppercase tracking-wider leading-none mt-1 font-bold">{user?.role || 'Usuário'}</span>
                </div>
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-accent to-yellow-600 text-brand-primary flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-brand-primary ring-offset-2 ring-offset-brand-accent/20">
                  {user?.name?.charAt(0).toUpperCase() || <UserIcon size={16} />}
                </div>
                <button 
                  onClick={onLogout}
                  className="hidden sm:flex p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-full transition-colors"
                  title="Sair"
                >
                  <LogOut size={18} />
                </button>
              </div>

              {/* Mobile Menu Toggle Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors ml-2"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-brand-primary border-b border-slate-700 shadow-2xl animate-fadeIn origin-top">
            <div className="px-4 py-6 space-y-3">
              <button
                onClick={() => handleNavClick('/dashboard')}
                className={navItemClass('/dashboard', true)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <FileText size={20} />
                  Meus Relatórios
                </div>
                {currentPath === '/dashboard' && <ChevronRight size={16} />}
              </button>
              
              <button
                onClick={() => handleNavClick('/new-project')}
                className={navItemClass('/new-project', true)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <PlusCircle size={20} />
                  Novo Projeto
                </div>
                {currentPath === '/new-project' && <ChevronRight size={16} />}
              </button>

              {isAdmin && (
                <button
                  onClick={() => handleNavClick('/admin')}
                  className={navItemClass('/admin', true)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Shield size={20} />
                    Painel Admin
                  </div>
                  {currentPath === '/admin' && <ChevronRight size={16} />}
                </button>
              )}

              <div className="border-t border-slate-700 my-4 pt-4">
                <div className="flex items-center justify-between px-4 mb-4">
                   <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">{user?.name}</span>
                      <span className="text-xs text-brand-accent uppercase">{user?.role}</span>
                   </div>
                   <button 
                      onClick={onLogout}
                      className="flex items-center gap-2 text-xs font-bold text-red-400 bg-red-500/10 px-3 py-1.5 rounded-full"
                    >
                      <LogOut size={14} /> Sair
                    </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth relative z-10">
        <div className="max-w-7xl mx-auto h-full">
          {children}
        </div>
      </main>
      
      {/* Mobile Menu Overlay Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-20 top-16 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Layout;