
import React, { useState } from 'react';
import { Droplets, ArrowRight, User, Mail, Lock, Key, ShieldCheck, CheckCircle2, ChevronLeft, Building2, MapPin } from 'lucide-react';
import { AccountType, UserProfile } from '../types';

interface SignupProps {
  onSignup: (user: UserProfile) => void;
  onGoBack: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup, onGoBack }) => {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    accountType: 'pro' as AccountType,
    name: '',
    email: '',
    password: '',
    companyName: '',
    headOffice: '',
    activationCode: ''
  });

  const validateStep = () => {
    setError('');
    if (step === 2) {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Les informations personnelles sont obligatoires.');
        return false;
      }
      if (formData.accountType === 'pro' || formData.accountType === 'collectivite') {
        if (!formData.companyName || !formData.headOffice) {
          const term = formData.accountType === 'pro' ? "l'entreprise" : "la collectivité";
          setError(`Le nom de ${term} et le siège social sont obligatoires.`);
          return false;
        }
      }
    }
    if (step === 3) {
      if (formData.activationCode !== 'CONSO-2026') {
        setError('Code d’activation invalide. Veuillez vérifier votre équipement.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) setStep(step + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep()) {
      onSignup({
        name: formData.name,
        email: formData.email,
        accountType: formData.accountType,
        role: 'Admin',
        createdAt: new Date().toISOString(),
        isActivated: true,
        companyName: (formData.accountType === 'pro' || formData.accountType === 'collectivite') ? formData.companyName : undefined,
        headOffice: (formData.accountType === 'pro' || formData.accountType === 'collectivite') ? formData.headOffice : undefined,
      });
    }
  };

  const isProAccount = formData.accountType === 'pro' || formData.accountType === 'collectivite';

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden font-['Inter']">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-800/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-lg z-10">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-[48px] shadow-2xl p-10 md:p-14">
          <div className="flex flex-col items-center mb-10">
            <div className="bg-blue-600 p-4 rounded-[24px] shadow-xl shadow-blue-500/20 mb-6">
              <Droplets size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Inscription</h1>
            <div className="flex gap-2 mt-4">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className={`h-1 w-8 rounded-full transition-all ${i <= step ? 'bg-blue-500' : 'bg-slate-700'}`} />
               ))}
            </div>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-2xl text-[11px] mb-8 text-center font-bold uppercase tracking-widest">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <p className="text-slate-400 text-sm font-medium">Choisissez votre type de profil</p>
              </div>
              <div className="space-y-3">
                {([
                  { id: 'pro', label: 'Professionnel', desc: 'Suivi optimisé pour vos locaux et entreprises' },
                  { id: 'collectivite', label: 'Collectivité', desc: 'Gestion des bâtiments et infrastructures publics' },
                  { id: 'particulier', label: 'Particulier', desc: 'Suivi optimisé pour votre foyer' },
                ] as { id: AccountType; label: string; desc: string }[]).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setFormData({...formData, accountType: p.id}); handleNext(); }}
                    className={`w-full p-6 rounded-3xl border text-left transition-all ${
                      formData.accountType === p.id
                        ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-500/10'
                        : 'bg-slate-800/50 border-white/5 text-slate-400 hover:border-blue-500/30'
                    }`}
                  >
                    <p className="text-xs font-black uppercase tracking-widest">{p.label}</p>
                    <p className="text-[10px] mt-1 opacity-60">{p.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold placeholder:text-slate-600"
                    placeholder="Nom complet du responsable"
                  />
                </div>
                
                {isProAccount && (
                  <>
                    <div className="relative">
                      <Building2 size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" />
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        className="w-full bg-slate-800/50 border border-blue-500/20 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold placeholder:text-slate-600"
                        placeholder={formData.accountType === 'collectivite' ? "Nom de la collectivité" : "Nom de l'entreprise"}
                      />
                    </div>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" />
                      <input
                        type="text"
                        value={formData.headOffice}
                        onChange={(e) => setFormData({...formData, headOffice: e.target.value})}
                        className="w-full bg-slate-800/50 border border-blue-500/20 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold placeholder:text-slate-600"
                        placeholder="Siège social / Adresse"
                      />
                    </div>
                  </>
                )}

                <div className="relative">
                  <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold placeholder:text-slate-600"
                    placeholder="Adresse Email"
                  />
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold placeholder:text-slate-600"
                    placeholder="Mot de passe"
                  />
                </div>
              </div>
              <button onClick={handleNext} className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-700 shadow-xl shadow-blue-500/20">
                Continuer <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div className="bg-blue-500/10 p-6 rounded-3xl border border-blue-500/20 text-center">
                 <ShieldCheck className="mx-auto text-blue-500 mb-4" size={48} />
                 <h4 className="text-white font-black uppercase tracking-widest text-xs">Code d'activation requis</h4>
                 <p className="text-slate-400 text-[11px] mt-2 font-medium leading-relaxed">Le code se trouve au dos de votre passerelle Cons'Eau ou sur votre guide d'installation.</p>
              </div>
              <div className="relative">
                <Key size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type="text"
                  value={formData.activationCode}
                  onChange={(e) => setFormData({...formData, activationCode: e.target.value.toUpperCase()})}
                  className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-black text-center tracking-[0.3em] placeholder:text-slate-600 placeholder:tracking-normal placeholder:font-bold"
                  placeholder="EX: CONSO-XXXX"
                />
              </div>
              <button onClick={handleNext} className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-700 shadow-xl shadow-blue-500/20">
                Vérifier le code <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8 text-center">
               <div className="bg-emerald-500/10 p-10 rounded-[40px] border border-emerald-500/20">
                  <CheckCircle2 className="mx-auto text-emerald-500 mb-6" size={64} />
                  <h4 className="text-white font-black text-xl tracking-tight">Prêt pour l'activation !</h4>
                  <p className="text-slate-400 text-sm mt-3 font-medium leading-relaxed">
                    Vos informations sont valides. En cliquant sur le bouton ci-dessous, votre compte sera créé et votre accès activé immédiatement.
                  </p>
                  {isProAccount && (
                    <div className="mt-4 pt-4 border-t border-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase">
                       {formData.companyName} • {formData.headOffice}
                    </div>
                  )}
               </div>
               <button onClick={handleSubmit} className="w-full bg-blue-600 text-white font-black py-6 rounded-[28px] flex items-center justify-center gap-3 hover:bg-blue-700 shadow-2xl shadow-blue-500/20 transition-all text-sm uppercase tracking-widest">
                Créer mon compte & activer
              </button>
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
             {step === 1 ? (
               <button onClick={onGoBack} className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Déjà un compte ? Se connecter</button>
             ) : (
               <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                 <ChevronLeft size={16} /> Étape précédente
               </button>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
