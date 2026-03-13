
import React, { useState } from 'react';
import { 
  User, Mail, Shield, Calendar, RefreshCw, LogOut, Building2, 
  MapPin, Lock, CheckCircle2, AlertCircle, Save, Key
} from 'lucide-react';
import { useWater } from '../store/WaterContext';
import { UserProfile } from '../types';

interface ProfilePageProps {
  user: UserProfile;
  onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onLogout }) => {
  const { resetSystem } = useWater();
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [isChanging, setIsChanging] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setIsChanging(true);
    setFeedback(null);

    // Simulation de changement de mot de passe
    setTimeout(() => {
      if (passwords.next !== passwords.confirm) {
        setFeedback({ type: 'error', msg: 'Les mots de passe ne correspondent pas.' });
      } else if (passwords.next.length < 6) {
        setFeedback({ type: 'error', msg: 'Le mot de passe doit faire au moins 6 caractères.' });
      } else {
        setFeedback({ type: 'success', msg: 'Mot de passe mis à jour avec succès.' });
        setPasswords({ current: '', next: '', confirm: '' });
      }
      setIsChanging(false);
    }, 1000);
  };

  const isProAccount = ['entreprise', 'agriculteur', 'pro', 'collectivite'].includes(user.accountType);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 flex items-center gap-4">
            <span className="p-3 bg-blue-600 rounded-[22px] shadow-xl shadow-blue-600/20 text-white">
              <User size={28} />
            </span>
            Profil Utilisateur
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] ml-2 mt-1">
            Gestion du compte • {user.accountType}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl font-bold text-xs uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
          >
            <RefreshCw size={16} /> Actualiser
          </button>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 px-6 py-3 bg-rose-50 border border-rose-100 rounded-2xl font-bold text-xs uppercase tracking-widest text-rose-600 hover:bg-rose-100 transition-all shadow-sm"
          >
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Info Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-blue-600 rounded-[32px] flex items-center justify-center text-white shadow-xl shadow-blue-500/20 mb-6">
              <User size={48} />
            </div>
            <h2 className="text-2xl font-black text-slate-900">{user.name}</h2>
            <span className="mt-2 px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">
              {user.accountType}
            </span>
            
            <div className="w-full mt-10 space-y-4 text-left">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Email / Identifiant</p>
                <p className="text-sm font-bold text-slate-700 truncate">{user.email}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Rôle Système</p>
                <p className="text-sm font-bold text-slate-700">{user.role}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Membre depuis</p>
                <p className="text-sm font-bold text-slate-700">{new Date(user.createdAt).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
          </div>

          {isProAccount && user.companyName && (
            <div className="bg-[#0f172a] text-white p-8 rounded-[40px] shadow-sm relative overflow-hidden group">
              <Building2 className="absolute -right-4 -bottom-4 text-blue-500/10 w-24 h-24" />
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                <Building2 size={14} /> {user.accountType === 'agriculteur' ? "Détails Exploitation" : "Détails Entreprise"}
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Nom</p>
                  <p className="text-lg font-black">{user.companyName}</p>
                </div>
                {user.headOffice && (
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-blue-500 mt-1" />
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Siège / Localisation</p>
                      <p className="text-sm font-bold text-slate-300">{user.headOffice}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Password Section */}
          <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <Lock size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Sécurité</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Mise à jour du mot de passe</p>
              </div>
            </div>

            {feedback && (
              <div className={`p-4 rounded-2xl mb-8 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
                feedback.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
              }`}>
                {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span className="text-xs font-bold uppercase tracking-widest">{feedback.msg}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mot de passe actuel</label>
                <div className="relative">
                  <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-6 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nouveau mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="password"
                    value={passwords.next}
                    onChange={(e) => setPasswords({...passwords, next: e.target.value})}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-6 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirmer le nouveau mot de passe</label>
                <div className="relative">
                  <CheckCircle2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-6 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>
              </div>

              <div className="md:col-span-2 pt-4">
                <button 
                  type="submit"
                  disabled={isChanging || !passwords.current || !passwords.next}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-sm uppercase tracking-widest"
                >
                  {isChanging ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>

          {/* Settings Section */}
          <div className="bg-slate-900 p-10 rounded-[48px] text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <Shield size={120} />
            </div>
            <div className="relative z-10 space-y-8">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl">
                    <Shield size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight">Confidentialité</h3>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Infrastucture de données IoT</p>
                  </div>
               </div>
               <p className="text-sm font-medium text-slate-400 leading-relaxed max-w-xl">
                 Vos données de consommation sont cryptées de bout en bout entre vos capteurs et votre portail. 
                 ConsoEau respecte strictement le RGPD pour la protection de votre vie privée.
               </p>
               <div className="pt-4 flex flex-wrap gap-4">
                  <div className="px-5 py-3 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
                     <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                     <span className="text-[10px] font-black uppercase tracking-widest">Données Chiffrées</span>
                  </div>
                  <div className="px-5 py-3 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
                     <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                     <span className="text-[10px] font-black uppercase tracking-widest">Audit de sécurité OK</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
