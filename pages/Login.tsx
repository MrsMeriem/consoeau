import React, { useState } from 'react';
import { Droplets, ArrowRight, User, Lock, Home, FileText, Building2, FlaskConical, ArrowLeft, ShieldCheck } from 'lucide-react';

type AccountType = 'particulier' | 'pro' | 'collectivite' | 'testeur';

interface LoginProps {
  onLogin: () => void;
  onDirectLogin: (type: AccountType) => void;
  selectedAccountType: AccountType;
  onSelectAccountType: (type: AccountType) => void;
  onBack?: () => void;
}

const PROFILES: { id: AccountType; label: string; sub: string; icon: React.ElementType; color: string; accent: string }[] = [
  { id: 'pro',          label: 'Professionnel', sub: 'Entreprise & bureau',  icon: FileText,    color: 'violet',  accent: 'bg-violet-600'  },
  { id: 'collectivite', label: 'Collectivité',  sub: 'Bâtiments publics',    icon: Building2,   color: 'cyan',    accent: 'bg-cyan-600'    },
  { id: 'particulier',  label: 'Particulier',   sub: 'Usage domestique',     icon: Home,        color: 'blue',    accent: 'bg-blue-600'    },
  { id: 'testeur',      label: 'Testeur',       sub: 'Mode développeur',     icon: FlaskConical,color: 'emerald', accent: 'bg-emerald-600' },
];

const colorMap: Record<string, string> = {
  blue:    'bg-blue-600/20 border-blue-500 text-blue-400',
  violet:  'bg-violet-600/20 border-violet-500 text-violet-400',
  cyan:    'bg-cyan-600/20 border-cyan-500 text-cyan-400',
  emerald: 'bg-emerald-600/20 border-emerald-500 text-emerald-400',
};

const ringMap: Record<string, string> = {
  blue:    'ring-2 ring-blue-500 bg-blue-600/10 text-blue-400',
  violet:  'ring-2 ring-violet-500 bg-violet-600/10 text-violet-400',
  cyan:    'ring-2 ring-cyan-500 bg-cyan-600/10 text-cyan-400',
  emerald: 'ring-2 ring-emerald-500 bg-emerald-600/10 text-emerald-400',
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
    <div className="min-h-screen bg-[#0f172a] flex flex-col relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-800/10 blur-[120px] rounded-full" />
      </div>

      {/* Back button */}
      {onBack && (
        <div className="relative z-10 px-5 pt-5 sm:px-8 sm:pt-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-all text-xs font-black uppercase tracking-widest"
          >
            <ArrowLeft size={15} /> Retour
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-6 sm:p-6 z-10">
        <div className="w-full max-w-sm sm:max-w-md">

          {/* ── DESKTOP CARD wrapper (sm+) ── */}
          <div className="
            hidden sm:block
            bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-[40px] shadow-2xl p-10
          ">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="bg-blue-600 p-4 rounded-3xl shadow-xl shadow-blue-500/20 mb-4">
                <Droplets size={32} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-1">Cons'Eau</h1>
              <p className="text-slate-400 text-sm">Portail de gestion intelligent</p>
            </div>

            {/* Profile grid — 4 cols desktop */}
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
                      onClick={() => { onSelectAccountType(p.id); onDirectLogin(p.id); }}
                      className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border transition-all duration-200 ${
                        isActive ? colorMap[p.color] : 'bg-white/[0.03] border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isActive ? p.accent : 'bg-white/5'}`}>
                        <Icon size={16} className="text-white" />
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-wider leading-none">{p.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className={`mt-3 text-center text-[10px] font-bold uppercase tracking-widest ${colorMap[active.color].split(' ')[2]}`}>
                Mode sélectionné : {active.label}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-2xl text-xs mb-5 text-center">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block ml-1">Identifiant</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    placeholder="admin" required />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block ml-1">Mot de passe</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    placeholder="••••••••" required />
                </div>
              </div>
              <button type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all group">
                Se connecter
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <p className="text-center mt-8 text-[10px] font-medium text-slate-600 uppercase tracking-widest">
              Système sécurisé • Cons'Eau Pro
            </p>
          </div>

          {/* ── MOBILE LAYOUT (< sm) ── */}
          <div className="block sm:hidden">
            {/* Logo */}
            <div className="flex flex-col items-center mb-6">
              <div className="bg-blue-600 p-3.5 rounded-[22px] shadow-xl shadow-blue-500/25 mb-3">
                <Droplets size={28} className="text-white" />
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">Cons'Eau</h1>
              <p className="text-slate-400 text-xs mt-1">Portail de gestion intelligent</p>
            </div>

            {/* Profile grid — 2 cols mobile */}
            <div className="mb-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-3 text-center">
                Accès rapide · Choisissez un profil
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {PROFILES.map((p) => {
                  const Icon = p.icon;
                  const isActive = selectedAccountType === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => { onSelectAccountType(p.id); onDirectLogin(p.id); }}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all duration-200 text-left ${
                        isActive ? `ring-2 ${ringMap[p.color]}` : 'bg-white/[0.03] border-white/5 text-slate-500 hover:border-white/10 hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isActive ? p.accent : 'bg-white/8'}`}>
                        <Icon size={17} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-black text-white leading-tight truncate">{p.label}</div>
                        <div className="text-[9px] text-slate-500 font-medium truncate">{p.sub}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">ou connectez-vous</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            {/* Form card */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[28px] p-5 shadow-2xl space-y-4">
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-xs text-center font-semibold">
                  {error}
                </div>
              )}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Identifiant</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-800/60 border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-600"
                    placeholder="admin" required />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Mot de passe</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-800/60 border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-600"
                    placeholder="••••••••" required />
                </div>
              </div>
              <button type="button" onClick={handleSubmit}
                className="w-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all text-sm mt-2">
                Se connecter <ArrowRight size={17} />
              </button>
            </div>

            {/* Footer badge */}
            <div className="flex items-center justify-center gap-2 mt-5 pb-20 text-slate-600">
              <ShieldCheck size={13} />
              <span className="text-[10px] font-black uppercase tracking-widest">Système sécurisé • Cons'Eau Pro</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
