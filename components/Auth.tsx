import React, { useState } from 'react';
import { db } from '../services/db';
import { User, Role, Country, State } from '../types';
import { ROLES, COUNTRIES, STATES } from '../constants';
import { Lock, Mail, Building, Globe, MapPin, User as UserIcon } from 'lucide-react';

interface AuthProps {
  onLoginSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [view, setView] = useState<'login' | 'register' | 'completion'>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    company: '',
    role: '' as Role,
    country: '' as Country,
    state: '' as State,
    city: '',
    phone: ''
  });
  
  const [tempUser, setTempUser] = useState<User | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = db.login(formData.email);
    if (user) {
      if (!user.isProfileComplete) {
        setTempUser(user);
        setView('completion');
      } else {
        onLoginSuccess();
      }
    } else {
      alert('Usuário não encontrado. Por favor, cadastre-se.');
    }
  };

  const handleGoogleLogin = () => {
    // Simulate Google Login
    const googleEmail = `google_user_${Math.floor(Math.random() * 1000)}@gmail.com`;
    let user = db.login(googleEmail);
    
    if (!user) {
      // Create new incomplete user
      user = {
        id: crypto.randomUUID(),
        email: googleEmail,
        name: 'Usuário Google',
        isGoogleUser: true,
        isProfileComplete: false
      };
      db.saveUser(user);
    }
    
    setTempUser(user);
    if (!user.isProfileComplete) {
      setView('completion');
    } else {
      onLoginSuccess();
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
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
      isProfileComplete: true
    };
    db.saveUser(newUser);
    onLoginSuccess();
  };

  const handleCompletion = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempUser) {
      const updatedUser: User = {
        ...tempUser,
        name: formData.name || tempUser.name,
        company: formData.company,
        role: formData.role,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        phone: formData.phone,
        isProfileComplete: true
      };
      db.saveUser(updatedUser);
      onLoginSuccess();
    }
  };

  const inputClass = "w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900 p-4">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-slate-700">
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-xl bg-brand-primary text-brand-accent mb-4">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-bold text-brand-primary dark:text-white">Metria</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Plataforma de Innovation Accounting</p>
        </div>

        {view === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Acessar Conta</h2>
            <div>
              <label className={labelClass}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className={`${inputClass} pl-10`} placeholder="nome@empresa.com" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Senha</label>
               <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input required type="password" name="password" value={formData.password} onChange={handleInputChange} className={`${inputClass} pl-10`} placeholder="••••••••" />
              </div>
            </div>
            
            <button type="submit" className="w-full bg-brand-primary text-white py-3 rounded-lg font-bold hover:bg-slate-700 transition-colors">
              Entrar
            </button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-800 text-gray-500">Ou continue com</span>
              </div>
            </div>

            <button type="button" onClick={handleGoogleLogin} className="w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2">
              <span className="text-lg font-bold text-blue-500">G</span> Entrar com Google
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Não tem uma conta? <button type="button" onClick={() => setView('register')} className="text-brand-accent font-bold hover:underline">Cadastre-se</button>
            </p>
          </form>
        )}

        {(view === 'register' || view === 'completion') && (
          <form onSubmit={view === 'register' ? handleRegister : handleCompletion} className="space-y-4">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              {view === 'completion' ? 'Complete seu Perfil' : 'Criar Conta'}
            </h2>
            
            {view === 'register' && (
               <>
                 <div>
                  <label className={labelClass}>Email</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className={inputClass} />
                </div>
                 <div>
                  <label className={labelClass}>Senha</label>
                  <input required type="password" name="password" value={formData.password} onChange={handleInputChange} className={inputClass} />
                </div>
              </>
            )}

            <div>
              <label className={labelClass}>Nome Completo</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 text-gray-400" size={18} />
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className={`${inputClass} pl-10`} placeholder="João Silva" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className={labelClass}>Cargo</label>
                <select required name="role" value={formData.role} onChange={handleInputChange} className={inputClass}>
                  <option value="">Selecione...</option>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
               <div>
                 <label className={labelClass}>Empresa</label>
                 <div className="relative">
                  <Building className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input required type="text" name="company" value={formData.company} onChange={handleInputChange} className={`${inputClass} pl-10`} />
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className={labelClass}>País</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 text-gray-400" size={18} />
                  <select required name="country" value={formData.country} onChange={handleInputChange} className={`${inputClass} pl-10`}>
                    <option value="">Selecione...</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
               <div>
                 <label className={labelClass}>Estado</label>
                  <select required disabled={!formData.country} name="state" value={formData.state} onChange={handleInputChange} className={inputClass}>
                    <option value="">Selecione...</option>
                    {formData.country && STATES[formData.country]?.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Cidade</label>
              <div className="relative">
                 <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                 <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className={`${inputClass} pl-10`} />
              </div>
            </div>

             <div>
              <label className={labelClass}>Telefone</label>
              <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={inputClass} placeholder="+55 11 99999-9999" />
            </div>

            <button type="submit" className="w-full bg-brand-primary text-white py-3 rounded-lg font-bold hover:bg-slate-700 transition-colors mt-6">
              {view === 'completion' ? 'Completar e Entrar' : 'Criar Conta Grátis'}
            </button>
            
            {view === 'register' && (
              <p className="text-center text-sm text-gray-500 mt-4">
                Já tem uma conta? <button type="button" onClick={() => setView('login')} className="text-brand-accent font-bold hover:underline">Entrar</button>
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
