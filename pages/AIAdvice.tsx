
import React, { useState } from 'react';
import { Sparkles, Activity, Search, RefreshCw, CheckCircle2, Info, Lightbulb } from 'lucide-react';
import { useWater } from '../store/WaterContext';
import { analyzeWaterData } from '../services/geminiService';
import { AIAnalysis } from '../types';

const AIAdvice: React.FC = () => {
  const { measurements, selectedEquipment, setSelectedEquipment } = useWater();
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AIAnalysis | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const data = await analyzeWaterData(measurements, selectedEquipment === 'all' ? 'Toute la maison' : selectedEquipment);
      setReport(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <div className="bg-indigo-600 p-4 rounded-3xl inline-block shadow-xl shadow-indigo-500/20 text-white mb-2">
          <Sparkles size={32} />
        </div>
        <h1 className="text-4xl font-black tracking-tight">Intelligence Hydrique</h1>
        <p className="text-slate-400 font-medium">Votre assistant personnel pour une consommation responsable.</p>
      </div>

      <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 block">Périmètre d'analyse</span>
        <div className="flex flex-col md:flex-row gap-4">
          <select 
            value={selectedEquipment} 
            onChange={(e) => setSelectedEquipment(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <option value="all">Vue Globale (Toute la maison)</option>
            <option value="douche">Douche</option>
            <option value="wc">WC</option>
            <option value="cuisine">Cuisine</option>
          </select>
          <button 
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-[#0f172a] text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all disabled:opacity-50"
          >
            {loading ? <RefreshCw className="animate-spin" size={20} /> : <Activity size={20} />}
            Analyser avec l'IA
          </button>
        </div>
      </div>

      {!report && !loading && (
        <div className="bg-slate-50/50 rounded-[40px] p-20 border border-dashed border-slate-200 flex flex-col items-center text-center">
            <div className="bg-white p-6 rounded-full shadow-sm mb-6">
                <RefreshCw size={48} className="text-slate-200" />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                Aucun rapport généré. Sélectionnez une vue et lancez l'IA.
            </p>
        </div>
      )}

      {loading && (
        <div className="space-y-6">
          <div className="h-32 bg-slate-100 rounded-[32px] animate-pulse"></div>
          <div className="grid grid-cols-2 gap-6">
            <div className="h-40 bg-slate-100 rounded-[32px] animate-pulse"></div>
            <div className="h-40 bg-slate-100 rounded-[32px] animate-pulse"></div>
          </div>
        </div>
      )}

      {report && (
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[40px] flex gap-6">
            <div className="bg-emerald-500 text-white p-4 rounded-2xl h-fit">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Statut</h4>
              <p className="text-emerald-900 font-bold text-xl mb-2">{report.status}</p>
              <p className="text-emerald-800/70 text-sm font-medium leading-relaxed">{report.message}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-50 text-blue-600 p-2 rounded-xl"><Info size={20} /></div>
                <h4 className="font-bold text-slate-900">Plus gros consommateur</h4>
              </div>
              <p className="text-3xl font-black text-slate-900 mb-2">{report.biggestConsumer}</p>
              <p className="text-slate-400 text-sm font-medium">Basé sur l'historique récent des injections.</p>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-amber-50 text-amber-600 p-2 rounded-xl"><Lightbulb size={20} /></div>
                <h4 className="font-bold text-slate-900">Conseil Éco</h4>
              </div>
              <p className="text-lg font-bold text-slate-900 mb-2 italic">"{report.economyTip}"</p>
              <p className="text-slate-400 text-sm font-medium">Recommandation personnalisée de l'IA.</p>
            </div>
          </div>

          <div className="bg-indigo-600 text-white p-10 rounded-[40px] shadow-2xl shadow-indigo-500/20 text-center space-y-4">
             <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60">Sensibilisation</h4>
             <p className="text-2xl font-bold leading-tight max-w-2xl mx-auto">
               {report.sensibilisation}
             </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAdvice;
