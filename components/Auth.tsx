import React, { useState } from 'react';
import { db } from '../services/db';
import { User, Role, Country, State } from '../types';
import { ROLES, COUNTRIES, STATES } from '../constants';
import { Lock, Mail, Building, Globe, MapPin, User as UserIcon, ArrowRight, Briefcase, Phone, AlertCircle } from 'lucide-react';

interface AuthProps {
  onLoginSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('register'); // Padrão 'register' conforme imagem, ou 'login'
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    company: '',
    role: '' as Role,
    country: 'Brasil' as Country, // Default conforme imagem
    state: '' as State,
    city: '',
    phone: ''
  });
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const user = db.login(formData.email);
      if (user) {
        onLoginSuccess();
      } else {
        setError('Usuário não encontrado. Verifique suas credenciais.');
      }
      setIsLoading(false);
    }, 800);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validação básica
    if (activeTab === 'register' && (!formData.role || !formData.state)) {
        setError('Por favor, preencha todos os campos obrigatórios.');
        setIsLoading(false);
        return;
    }

    setTimeout(() => {
        const newUser: User = {
            id: crypto.randomUUID(),
            email: formData.email,
            name: formData.name,
            company: formData.company,
            role: formData.role,
            country: formData.country,
            state: formData.state,
            city: formData.city,
            phone: formData.phone,
            isGoogleUser: false,
            isProfileComplete: true,
            createdAt: new Date().toISOString()
        };
        
        // Verifica se já existe
        const existingUsers = db.getUsers();
        if (existingUsers.find(u => u.email === formData.email)) {
            setError('Este email já está cadastrado.');
            setIsLoading(false);
            return;
        }

        db.saveUser(newUser);
        db.login(newUser.email); // Auto-login
        onLoginSuccess();
    }, 800);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const googleEmail = `google_user_${Math.floor(Math.random() * 1000)}@gmail.com`;
      let user = db.login(googleEmail);
      
      if (!user) {
        user = {
          id: crypto.randomUUID(),
          email: googleEmail,
          name: 'Usuário Google',
          isGoogleUser: true,
          isProfileComplete: true, // Simplificando para fluxo rápido
          createdAt: new Date().toISOString()
        };
        db.saveUser(user);
      }
      
      onLoginSuccess();
      setIsLoading(false);
    }, 800);
  };

  // Styles based on the screenshot
  const inputContainerClass = "relative";
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400";
  const inputClass = "w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-md text-sm text-gray-700 focus:ring-1 focus:ring-brand-accent focus:border-brand-accent outline-none transition-colors placeholder:text-gray-400";
  const labelClass = "block text-[10px] font-bold text-gray-500 uppercase mb-1.5 tracking-wider";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-950 p-4 font-sans">
      
      {/* Header Section */}
      <div className="text-center mb-6 animate-fadeIn">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Metria</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md">
          O seu Laboratório de Inteligência para Contabilidade da Inovação na sua empresa
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-[500px] overflow-hidden border border-gray-100 dark:border-slate-700">
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-slate-700">
          <button
            onClick={() => { setActiveTab('login'); setError(null); }}
            className={`flex-1 py-4 text-sm font-medium transition-all relative ${
              activeTab === 'login' 
                ? 'text-slate-900 dark:text-white' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Entrar
            {activeTab === 'login' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-brand-accent"></div>}
          </button>
          <button
            onClick={() => { setActiveTab('register'); setError(null); }}
            className={`flex-1 py-4 text-sm font-medium transition-all relative ${
              activeTab === 'register' 
                ? 'text-slate-900 dark:text-white' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Criar Conta
            {activeTab === 'register' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-brand-accent"></div>}
          </button>
        </div>

        <div className="p-8">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
            {activeTab === 'register' ? 'Comece a inovar hoje' : 'Bem-vindo de volta'}
          </h2>

          {/* Social Login */}
          <button 
            type="button" 
            onClick={handleGoogleLogin} 
            className="w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-200 py-2.5 rounded-md font-medium hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2 text-sm mb-6"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" color="#4285F4"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" color="#34A853"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" color="#FBBC05"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" color="#EA4335"/>
            </svg>
            Entrar com Google
          </button>

          <div className="relative flex py-2 items-center mb-6">
            <div className="flex-grow border-t border-gray-200 dark:border-slate-700"></div>
            <span className="flex-shrink-0 mx-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ou continue com email</span>
            <div className="flex-grow border-t border-gray-200 dark:border-slate-700"></div>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded flex items-center gap-2 text-red-600 text-xs">
                <AlertCircle size={14} />
                {error}
            </div>
          )}

          <form onSubmit={activeTab === 'register' ? handleRegister : handleLogin} className="space-y-4">
            
            {activeTab === 'register' && (
              <>
                <div>
                  <label className={labelClass}>Nome Completo</label>
                  <div className={inputContainerClass}>
                    <UserIcon size={16} className={iconClass} />
                    <input 
                      required 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      className={inputClass} 
                      placeholder="Ex: João Silva" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Telefone</label>
                    <div className={inputContainerClass}>
                      <Phone size={16} className={iconClass} />
                      <input 
                        required 
                        type="tel" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleInputChange} 
                        className={inputClass} 
                        placeholder="+55 11..." 
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Cargo</label>
                    <div className={inputContainerClass}>
                      <Briefcase size={16} className={iconClass} />
                      <select 
                        required 
                        name="role" 
                        value={formData.role} 
                        onChange={handleInputChange} 
                        className={`${inputClass} appearance-none cursor-pointer`}
                      >
                        <option value="">Selecione...</option>
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Nome da Empresa</label>
                  <div className={inputContainerClass}>
                    <Building size={16} className={iconClass} />
                    <input 
                      required 
                      type="text" 
                      name="company" 
                      value={formData.company} 
                      onChange={handleInputChange} 
                      className={inputClass} 
                      placeholder="Ex: Startup X Ltda" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>País</label>
                    <div className={inputContainerClass}>
                      <Globe size={16} className={iconClass} />
                      <select 
                        required 
                        name="country" 
                        value={formData.country} 
                        onChange={handleInputChange} 
                        className={`${inputClass} appearance-none cursor-pointer`}
                      >
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Estado (UF)</label>
                    <div className={inputContainerClass}>
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] font-bold">UF</div>
                      <select 
                        required 
                        name="state" 
                        value={formData.state} 
                        onChange={handleInputChange} 
                        className={`${inputClass} appearance-none cursor-pointer`}
                      >
                        <option value="">UF</option>
                        {formData.country && STATES[formData.country]?.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                       <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Cidade</label>
                  <div className={inputContainerClass}>
                    <MapPin size={16} className={iconClass} />
                    <input 
                      required 
                      type="text" 
                      name="city" 
                      value={formData.city} 
                      onChange={handleInputChange} 
                      className={inputClass} 
                      placeholder="Nome da Cidade" 
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className={labelClass}>Email Corporativo</label>
              <div className={inputContainerClass}>
                <Mail size={16} className={iconClass} />
                <input 
                  required 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  className={inputClass} 
                  placeholder="voce@empresa.com" 
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Senha</label>
              <div className={inputContainerClass}>
                <Lock size={16} className={iconClass} />
                <input 
                  required 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleInputChange} 
                  className={inputClass} 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-slate-900 dark:bg-brand-accent dark:text-brand-primary text-white py-3 rounded-md font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isLoading 
                ? 'Processando...' 
                : (activeTab === 'register' ? 'Criar Conta Gratuita' : 'Entrar na Plataforma')
              }
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-slate-700/50 p-4 text-center border-t border-gray-100 dark:border-slate-700">
           {activeTab === 'register' ? (
             <p className="text-xs text-gray-500">
               Já possui conta? <button type="button" onClick={() => setActiveTab('login')} className="text-brand-accent font-bold hover:underline">Faça Login</button>
             </p>
           ) : (
             <p className="text-xs text-gray-500">
               Ainda não tem conta? <button type="button" onClick={() => setActiveTab('register')} className="text-brand-accent font-bold hover:underline">Cadastre-se Grátis</button>
             </p>
           )}
        </div>
      </div>
    </div>
  );
};

export default Auth;