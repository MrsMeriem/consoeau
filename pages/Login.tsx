import React, { useState } from 'react';
import { Droplets, ArrowRight, User, Lock, Home, FileText, Building2, FlaskConical, ArrowLeft } from 'lucide-react';

type AccountType = 'particulier' | 'pro' | 'collectivite' | 'testeur';

interface LoginProps {
  onLogin: () => void;
  onDirectLogin: (type: AccountType) => void;
  selectedAccountType: AccountType;
  onSelectAccountType: (type: AccountType) => void;
  onBack?: () => void;
}

const PROFILES: { id: AccountType; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'pro', label: 'Professionnel', icon: FileText, color: 'violet' },
  { id: 'collectivite', label: 'Collectivité', icon: Building2, color: 'cyan' },
  { id: 'particulier', label: 'Particulier', icon: Home, color: 'blue' },
  { id: 'testeur', label: 'Testeur', icon: FlaskConical, color: 'emerald' },
];

const colorMap: Record<string, string> = {
  blue:    'bg-blue-600/20 border-blue-500 text-blue-400',
  violet:  'bg-violet-600/20 border-violet-500 text-violet-400',
  cyan:    'bg-cyan-600/20 border-cyan-500 text-cyan-400',
  emerald: 'bg-emerald-600/20 border-emerald-500 text-emerald-400',
};

const iconBgMap: Record<string, string> = {
  blue:    'bg-blue-600',
  violet:  'bg-violet-600',
  cyan:    'bg-cyan-600',
  emerald: 'bg-emerald-600',
};

const Login: React.FC<LoginProps> = ({ onLogin, onDirectLogin, selectedAccountType, onSelectAccountType, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      onLogin();
    } else {
      setError('Identifiant ou mot de passe incorrect.');
    }
  };

  const active = PROFILES.find((p) => p.id === selectedAccountType)!;

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-800/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md z-10">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-all text-xs font-black uppercase tracking-widest mb-6"
          >
            <ArrowLeft size={16} /> Retour
          </button>
        )}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-[40px] shadow-2xl p-10">

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-blue-600 p-4 rounded-3xl shadow-xl shadow-blue-500/20 mb-4">
              <Droplets size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">ConsoEau</h1>
            <p className="text-slate-400 text-sm">Portail de gestion intelligent</p>
          </div>

          {/* Accès rapide — 4 profils */}
          <div className="mb-8">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-3 text-center">
              Accès rapide · Profil
            </p>
            <div className="grid grid-cols-4 gap-2">
              {PROFILES.map((p) => {
                const Icon = p.icon;
                const isActive = selectedAccountType === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      onSelectAccountType(p.id);
                      onDirectLogin(p.id);
                    }}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border transition-all duration-200 ${
                      isActive
                        ? colorMap[p.color]
                        : 'bg-white/[0.03] border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isActive ? iconBgMap[p.color] : 'bg-white/5'
                    }`}>
                      <Icon size={16} className="text-white" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-wider leading-none">
                      {p.label}
                    </span>
                  </button>
                );
              })}
            </div>
            {/* Badge profil actif */}
            <div className={`mt-3 text-center text-[10px] font-bold uppercase tracking-widest ${colorMap[active.color].split(' ')[2]}`}>
              Mode sélectionné : {active.label}
            </div>
          </div>

          {/* Erreur */}
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-2xl text-xs mb-5 text-center">
              {error}
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block ml-1">Identifiant</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block ml-1">Mot de passe</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all group"
            >
              Se connecter
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-center mt-8 text-[10px] font-medium text-slate-600 uppercase tracking-widest">
            Système sécurisé • ConsoEau Pro
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
