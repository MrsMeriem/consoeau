
import React, { useState } from 'react';
import { Droplets, Key, ShieldAlert, ArrowRight, Loader2 } from 'lucide-react';

interface ActivationProps {
  onActivate: () => void;
  userEmail: string;
}

const Activation: React.FC<ActivationProps> = ({ onActivate, userEmail }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (code === 'CONSO-2026') {
        onActivate();
      } else {
        setError('Le code d’activation est incorrect.');
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden font-['Inter']">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-800/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-[48px] shadow-2xl p-10 text-center">
          <div className="bg-blue-600 p-4 rounded-[24px] shadow-xl shadow-blue-500/20 mb-8 inline-block">
            <Droplets size={32} className="text-white" />
          </div>
          
          <div className="space-y-3 mb-10">
            <h1 className="text-3xl font-black text-white tracking-tight">Activation requise</h1>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Votre compte <span className="text-blue-400 font-bold">{userEmail}</span> n'est pas encore activé. Veuillez saisir votre code d'équipement.
            </p>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-8">
              {error}
            </div>
          )}

          <form onSubmit={handleActivate} className="space-y-6 text-left">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block ml-1">Code d'activation Cons'eau</label>
              <div className="relative">
                <Key size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-black tracking-[0.3em] text-center"
                  placeholder="CONSO-XXXX"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[24px] shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3 transition-all disabled:opacity-50 text-sm uppercase tracking-widest"
            >
              {loading ? (
                <> <Loader2 className="animate-spin" size={20} /> Activation en cours... </>
              ) : (
                <> Activer mon application <ArrowRight size={20} /> </>
              )}
            </button>
          </form>

          <div className="mt-12 p-6 bg-slate-800/30 rounded-3xl border border-white/5 flex items-start gap-4 text-left">
            <ShieldAlert size={20} className="text-blue-500 shrink-0 mt-1" />
            <p className="text-[10px] text-slate-500 font-bold leading-relaxed tracking-wide">
              L'activation lie votre compte à vos capteurs IoT. Sans cette étape, les données de consommation ne peuvent être récupérées.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activation;
