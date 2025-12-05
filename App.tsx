import React, { useState, useEffect } from 'react';
import { db } from './services/db';
import Layout from './components/Layout';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import ProjectWizard from './components/ProjectWizard';
import Report from './components/Report';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>('/login');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Initialize theme and auth
  useEffect(() => {
    const user = db.getCurrentUser();
    if (user) {
      if (!user.isProfileComplete) {
         // Should stay in auth flow ideally, simplified here
         setIsAuthenticated(false); 
      } else {
        setIsAuthenticated(true);
        if (currentPath === '/login') setCurrentPath('/dashboard');
      }
    }
    
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
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPath('/dashboard');
  };

  const renderContent = () => {
    if (!isAuthenticated) {
      return <Auth onLoginSuccess={handleLoginSuccess} />;
    }

    // Authenticated Routes
    const content = () => {
      if (currentPath === '/dashboard') {
        return <Dashboard onNavigate={handleNavigate} />;
      }
      if (currentPath === '/new-project') {
        return <ProjectWizard onComplete={() => handleNavigate('/dashboard')} />;
      }
      if (currentPath.startsWith('/report/')) {
        const id = currentPath.split('/')[2];
        return <Report projectId={id} onBack={() => handleNavigate('/dashboard')} />;
      }
      return <Dashboard onNavigate={handleNavigate} />;
    };

    return (
      <Layout 
        darkMode={darkMode} 
        toggleTheme={() => setDarkMode(!darkMode)}
        onNavigate={handleNavigate}
        currentPath={currentPath}
      >
        {content()}
      </Layout>
    );
  };

  return renderContent();
};

export default App;
