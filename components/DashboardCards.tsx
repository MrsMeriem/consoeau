
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  color?: string;
  subtitle?: string;
  dark?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, unit, icon: Icon, color = 'blue', subtitle, dark }) => {
  return (
    <div className={`p-6 rounded-3xl shadow-sm border ${dark ? 'bg-[#0f172a] text-white border-slate-800' : 'bg-white border-slate-100'} flex flex-col justify-between h-44 transition-transform hover:scale-[1.02]`}>
      <div className="flex justify-between items-start">
        <span className={`text-[10px] font-bold uppercase tracking-widest ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{title}</span>
        <div className={`${dark ? 'bg-slate-800' : `bg-${color}-50`} p-2 rounded-xl`}>
          <Icon size={18} className={dark ? 'text-white' : `text-${color}-600`} />
        </div>
      </div>
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold tracking-tight">{value}</span>
          <span className={`text-xs font-bold uppercase tracking-wider ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{unit}</span>
        </div>
        {subtitle && <p className={`text-[9px] mt-1 font-medium leading-tight ${dark ? 'text-slate-400' : 'text-slate-400'}`}>{subtitle}</p>}
      </div>
    </div>
  );
};

interface TarifCardProps {
  mode: 'reference' | 'perso';
  customValue: number;
  onModeChange: (mode: 'reference' | 'perso') => void;
  onValueChange: (value: number) => void;
}

export const TarifCard: React.FC<TarifCardProps> = ({ mode, customValue, onModeChange, onValueChange }) => {
  return (
    <div className="p-6 rounded-3xl bg-blue-600 text-white shadow-xl shadow-blue-500/20 flex flex-col justify-between h-44 relative overflow-hidden group">
      <div className="absolute top-[-20px] right-[-20px] opacity-10 transition-transform group-hover:scale-110">
        <div className="text-[140px] font-bold">€</div>
      </div>
      {/* Tab switcher */}
      <div className="flex gap-1 z-10 bg-blue-700/40 rounded-xl p-1 w-fit">
        <button
          onClick={() => onModeChange('reference')}
          className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${mode === 'reference' ? 'bg-white text-blue-600' : 'text-blue-200 hover:text-white'}`}
        >
          Référence
        </button>
        <button
          onClick={() => onModeChange('perso')}
          className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${mode === 'perso' ? 'bg-white text-blue-600' : 'text-blue-200 hover:text-white'}`}
        >
          Perso
        </button>
      </div>
      <div className="z-10">
        {mode === 'perso' ? (
          <div className="flex items-baseline gap-2">
            <input
              type="number"
              value={customValue}
              onChange={(e) => onValueChange(parseFloat(e.target.value) || 0)}
              step="0.01"
              min="0"
              className="w-24 bg-blue-500/40 text-white font-extrabold text-2xl rounded-xl px-2 py-1 border border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <span className="text-sm font-bold text-blue-100">€ / m³</span>
          </div>
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight">4,34 €</span>
            <span className="text-sm font-bold text-blue-100">/ m³</span>
          </div>
        )}
        <p className="text-[9px] mt-1 font-bold leading-tight text-blue-100 uppercase tracking-widest">
          {mode === 'reference' ? 'Calcul vérifié (base nationale)' : 'Tarif personnalisé actif'}
        </p>
      </div>
    </div>
  );
};
