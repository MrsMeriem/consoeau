
import React, { useState, useEffect } from 'react';
import { Menu, X, ShieldCheck } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import AIAdvice from './pages/AIAdvice';
import EquipmentStatus from './pages/EquipmentStatus';
import ProfilePage from './pages/Profile';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Activation from './pages/Activation';
import Analytics from './pages/Analytics';
import LeakDetection from './pages/LeakDetection';
import { WaterProvider } from './store/WaterContext';
import { UserProfile } from './types';

const Layout: React.FC<{ children: React.ReactNode; currentPath: string; onNavigate: (path: string) => void; onLogout: () => void; user: UserProfile }> = ({ children, currentPath, onNavigate, onLogout, user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative font-['Inter']">
      <div 
        className={`fixed md:relative z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] h-full ${
          sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-0'
        }`}
      >
        <Sidebar 
          currentPath={currentPath} 
          onNavigate={(p) => { onNavigate(p); if (window.innerWidth < 1024) setSidebarOpen(false); }} 
          onLogout={onLogout} 
          isCollapsed={!sidebarOpen}
          user={user}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] transition-all duration-500">
        <header className="h-20 bg-white/70 backdrop-blur-2xl border-b border-slate-100 flex items-center px-4 md:px-10 gap-4 shrink-0 z-30 justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-3 bg-white hover:bg-slate-50 rounded-[18px] text-blue-600 shadow-sm border border-slate-100 transition-all active:scale-95 group"
            >
              {sidebarOpen && window.innerWidth < 1024 ? <X size={24} /> : <Menu size={24} className="group-hover:rotate-180 transition-transform duration-500" />}
            </button>
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-300">
               <span className="text-blue-500">/</span>
               <span className="text-slate-400">{currentPath.replace('-', ' ')}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex md:hidden bg-blue-600/10 text-blue-600 px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase border border-blue-600/5 items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                Mobile Access
             </div>
             <div className="hidden sm:flex bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase border border-emerald-500/5 items-center gap-2">
                <ShieldCheck size={14} />
                Système Protégé
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-8 md:px-12 md:py-12 scroll-smooth">
          {children}
        </main>
      </div>

      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40 transition-opacity duration-500"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [authStatus, setAuthStatus] = useState<'landing' | 'login' | 'signup' | 'activation' | 'authenticated'>(() => {
    const savedAuth = localStorage.getItem('water_auth');
    const userJson = localStorage.getItem('water_user');
    if (savedAuth === 'true' && userJson) {
      const user = JSON.parse(userJson) as UserProfile;
      return user.isActivated ? 'authenticated' : 'activation';
    }
    return 'landing';
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('water_dark_mode');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('water_dark_mode', String(darkMode));
  }, [darkMode]);

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const userJson = localStorage.getItem('water_user');
    return userJson ? JSON.parse(userJson) : null;
  });

  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedAccountType, setSelectedAccountType] = useState<'particulier' | 'pro' | 'collectivite' | 'testeur'>('particulier');

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('water_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('water_user');
    }
  }, [currentUser]);

  const handleLogin = (name: string = "Admin") => {
    const user: UserProfile = {
      name: name,
      email: "admin@consoeau.pro",
      accountType: selectedAccountType,
      role: 'Admin',
      createdAt: new Date().toISOString(),
      isActivated: true
    };
    setCurrentUser(user);
    setAuthStatus('authenticated');
    localStorage.setItem('water_auth', 'true');
  };

  const handleSignup = (user: UserProfile) => {
    setCurrentUser(user);
    setAuthStatus('authenticated');
    localStorage.setItem('water_auth', 'true');
  };

  const handleActivate = () => {
    if (currentUser) {
      const activatedUser = { ...currentUser, isActivated: true };
      setCurrentUser(activatedUser);
      setAuthStatus('authenticated');
    }
  };

  const handleLogout = () => {
    setAuthStatus('login');
    setCurrentUser(null);
    localStorage.removeItem('water_auth');
    localStorage.removeItem('water_user');
  };

  if (authStatus === 'landing') {
    return (
      <LandingPage
        onEnter={() => setAuthStatus('login')}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((d) => !d)}
      />
    );
  }

  if (authStatus === 'login') {
    return (
      <div className="flex flex-col min-h-screen">
        <Login
          onLogin={() => handleLogin()}
          onDirectLogin={(accountType) => {
            setSelectedAccountType(accountType);
            const labels: Record<string, string> = {
              particulier: 'Particulier Démo',
              pro: 'Pro Démo',
              collectivite: 'Collectivité Démo',
              testeur: 'Testeur',
            };
            const user: UserProfile = {
              name: labels[accountType] ?? accountType,
              email: `${accountType}@consoeau.pro`,
              accountType: accountType,
              role: 'Admin',
              createdAt: new Date().toISOString(),
              isActivated: true,
            };
            setCurrentUser(user);
            setAuthStatus('authenticated');
            localStorage.setItem('water_auth', 'true');
            localStorage.setItem('water_user', JSON.stringify(user));
          }}
          selectedAccountType={selectedAccountType}
          onSelectAccountType={setSelectedAccountType}
          onBack={() => setAuthStatus('landing')}
        />
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-20">
          <button
            onClick={() => setAuthStatus('signup')}
            className="text-slate-500 hover:text-white transition-all text-xs font-black uppercase tracking-[0.2em] bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/5"
          >
            Nouveau sur Cons'Eau ? S'inscrire
          </button>
        </div>
      </div>
    );
  }

  if (authStatus === 'signup') {
    return <Signup onSignup={handleSignup} onGoBack={() => setAuthStatus('login')} />;
  }

  if (authStatus === 'activation') {
    return <Activation onActivate={handleActivate} userEmail={currentUser?.email || ''} />;
  }

  return (
    <WaterProvider accountType={currentUser?.accountType}>
      <Layout
        currentPath={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
        user={currentUser!}
      >
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'sensors' && <EquipmentStatus />}
          {currentPage === 'analytics' && <Analytics />}
          {currentPage === 'alerts' && <Alerts />}
          {currentPage === 'ai' && <AIAdvice />}
          {currentPage === 'leaks' && <LeakDetection />}
          {currentPage === 'profile' && <ProfilePage user={currentUser!} onLogout={handleLogout} />}
        </div>
      </Layout>
    </WaterProvider>
  );
};

export default App;
