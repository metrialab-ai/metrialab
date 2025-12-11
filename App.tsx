import React, { useState, useEffect } from 'react';
import { db } from './services/db';
import Layout from './components/Layout';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import ProjectWizard from './components/ProjectWizard';
import Report from './components/Report';
import AdminPanel from './components/AdminPanel';
import LandingPage from './components/LandingPage';
import MethodologyPage from './components/MethodologyPage';
import PlansPage from './components/PlansPage';
import WhyMetriaPage from './components/WhyMetriaPage';

const App: React.FC = () => {
  // Inicializa o caminho com o valor salvo ou padrão (agora padrão é '/')
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return localStorage.getItem('metria_last_path') || '/';
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize theme and auth
  useEffect(() => {
    const checkAuth = () => {
      const user = db.getCurrentUser();
      
      if (user && user.isProfileComplete) {
        setIsAuthenticated(true);
        // Se estava na LP, Login, Methodology, Plans ou WhyMetria, vai para dashboard se já estiver logado (opcional)
        if (currentPath === '/' || currentPath === '/login') {
          handleNavigate('/dashboard');
        }
      } else {
        setIsAuthenticated(false);
        // Se tentar acessar rota protegida sem auth, joga para LP
        const publicRoutes = ['/', '/login', '/methodology', '/plans', '/why-metria'];
        if (!publicRoutes.includes(currentPath)) {
           setCurrentPath('/');
        }
      }
      setIsLoaded(true);
    };

    checkAuth();
    
    // Check system preference for dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  // Apply theme class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    // Persiste a rota apenas se não for rotas públicas
    const publicRoutes = ['/', '/login', '/methodology', '/plans', '/why-metria'];
    if (!publicRoutes.includes(path)) {
      localStorage.setItem('metria_last_path', path);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    // Tenta recuperar a última rota ou vai para dashboard
    const lastPath = localStorage.getItem('metria_last_path');
    handleNavigate(lastPath && lastPath !== '/' && lastPath !== '/login' ? lastPath : '/dashboard');
  };

  const handleLogout = () => {
    db.logout();
    setIsAuthenticated(false);
    handleNavigate('/');
    localStorage.removeItem('metria_last_path'); // Limpa histórico ao sair
  };

  if (!isLoaded) return null; // Previne flash de conteúdo

  const renderContent = () => {
    // Rotas Públicas (acessíveis sem login)
    if (currentPath === '/methodology') {
      return (
        <MethodologyPage 
          onBack={() => handleNavigate('/')} 
          onRegister={() => handleNavigate('/login')} 
        />
      );
    }

    if (currentPath === '/plans') {
      return (
        <PlansPage 
          onBack={() => handleNavigate('/')} 
          onRegister={() => handleNavigate('/login')} 
        />
      );
    }

    if (currentPath === '/why-metria') {
      return (
        <WhyMetriaPage 
          onBack={() => handleNavigate('/')} 
          onRegister={() => handleNavigate('/login')} 
        />
      );
    }

    if (!isAuthenticated) {
      if (currentPath === '/login') {
        return <Auth onLoginSuccess={handleLoginSuccess} />;
      }
      // Rota padrão não autenticada é a Landing Page
      return (
        <LandingPage 
          onLogin={() => handleNavigate('/login')} 
          onRegister={() => handleNavigate('/login')} 
          onNavigateToMethodology={() => handleNavigate('/methodology')}
          onNavigateToPlans={() => handleNavigate('/plans')}
          onNavigateToWhyMetria={() => handleNavigate('/why-metria')}
        />
      );
    }

    const user = db.getCurrentUser();

    // Authenticated Routes Router
    const content = () => {
      if (currentPath === '/admin') {
        // Simple role check
        if (user?.role === 'Administrador') {
            return <AdminPanel />;
        }
        // Redirect if not admin
        setTimeout(() => handleNavigate('/dashboard'), 0);
        return null; 
      }
      if (currentPath === '/dashboard') {
        return <Dashboard onNavigate={handleNavigate} />;
      }
      if (currentPath === '/new-project') {
        return <ProjectWizard onComplete={(newProjectId) => handleNavigate(`/report/${newProjectId}`)} />;
      }
      if (currentPath.startsWith('/report/')) {
        const id = currentPath.split('/')[2];
        return <Report projectId={id} onBack={() => handleNavigate('/dashboard')} />;
      }
      // Fallback para dashboard
      return <Dashboard onNavigate={handleNavigate} />;
    };

    return (
      <Layout 
        darkMode={darkMode} 
        toggleTheme={() => setDarkMode(!darkMode)}
        onNavigate={handleNavigate}
        currentPath={currentPath}
        onLogout={handleLogout}
      >
        {content()}
      </Layout>
    );
  };

  return renderContent();
};

export default App;