import React, { useState, useMemo } from 'react';
import { Droplets, Plus, Trash2, AlertTriangle, CheckCircle2, Link2, Unlink, ShieldAlert } from 'lucide-react';
import { useWater } from '../store/WaterContext';
import { SensorPair } from '../types';

const LeakDetection: React.FC = () => {
  const { sensors, measurements, sensorPairs, addSensorPair, removeSensorPair, alerts, clearAlerts, setAlerts } = useWater() as any;
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', amontId: '', avalId: '', tolerance: 5 });

  const today = new Date().toISOString().split('T')[0];

  // For each pair, compute amont total, aval total, diff, status
  const pairStats = useMemo(() => {
    return sensorPairs.map((pair: SensorPair) => {
      const amontTotal = measurements
        .filter((m: any) => m.device_id === pair.amontId && m.timestamp.startsWith(today))
        .reduce((acc: number, m: any) => acc + m.volume_l, 0);
      const avalTotal = measurements
        .filter((m: any) => m.device_id === pair.avalId && m.timestamp.startsWith(today))
        .reduce((acc: number, m: any) => acc + m.volume_l, 0);
      const diff = Math.max(0, amontTotal - avalTotal);
      const leak = amontTotal > 0 && diff > pair.tolerance;
      const amontSensor = sensors.find((s: any) => s.id === pair.amontId);
      const avalSensor = sensors.find((s: any) => s.id === pair.avalId);
      return { ...pair, amontTotal, avalTotal, diff, leak, amontSensor, avalSensor };
    });
  }, [sensorPairs, measurements, sensors, today]);

  const leakCount = pairStats.filter((p: any) => p.leak).length;

  const handleAdd = () => {
    if (!form.amontId || !form.avalId || form.amontId === form.avalId) return;
    const pair: SensorPair = {
      id: Math.random().toString(36).substr(2, 9),
      name: form.name || `Paire ${sensorPairs.length + 1}`,
      amontId: form.amontId,
      avalId: form.avalId,
      tolerance: form.tolerance,
      createdAt: new Date().toISOString(),
    };
    addSensorPair(pair);
    setForm({ name: '', amontId: '', avalId: '', tolerance: 5 });
    setShowModal(false);
  };

  return (
    <div className="space-y-8 pb-10 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 flex items-center gap-4">
            <span className="p-3 bg-rose-600 rounded-[22px] shadow-xl shadow-rose-600/20">
              <ShieldAlert size={28} className="text-white" />
            </span>
            Détection de Fuite
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] ml-2">
            Surveillance par paires de capteurs • Comparaison amont / aval
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-3 bg-rose-600 text-white px-6 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-rose-600/20 hover:bg-rose-700 transition-all active:scale-95"
        >
          <Link2 size={18} />
          Lier deux capteurs
        </button>
      </div>

      {/* Status banner */}
      {pairStats.length > 0 && (
        <div className={`p-6 rounded-[28px] flex items-center gap-5 border ${leakCount > 0 ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
          {leakCount > 0
            ? <AlertTriangle size={28} className="text-rose-500 shrink-0" />
            : <CheckCircle2 size={28} className="text-emerald-500 shrink-0" />}
          <div>
            <p className={`font-black text-lg ${leakCount > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
              {leakCount > 0 ? `${leakCount} fuite${leakCount > 1 ? 's' : ''} détectée${leakCount > 1 ? 's' : ''}` : 'Aucune fuite détectée'}
            </p>
            <p className={`text-sm ${leakCount > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
              {leakCount > 0 ? 'La différence de volume entre amont et aval dépasse le seuil de tolérance.' : 'Tous les débits amont/aval sont cohérents.'}
            </p>
          </div>
        </div>
      )}

      {/* Pairs list */}
      {pairStats.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center">
          <div className="p-6 bg-slate-100 rounded-[28px]">
            <Unlink size={40} className="text-slate-300 mx-auto" />
          </div>
          <h2 className="text-2xl font-black text-slate-600">Aucune paire configurée</h2>
          <p className="text-slate-400 max-w-sm text-sm">
            Liez deux capteurs (amont + aval) pour détecter automatiquement les fuites entre eux.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-3 bg-rose-600 text-white px-6 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-rose-600/20 hover:bg-rose-700 transition-all mt-4"
          >
            <Plus size={18} />
            Créer ma première paire
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pairStats.map((pair: any) => (
            <div
              key={pair.id}
              className={`p-8 rounded-[40px] border bg-white transition-all hover:shadow-xl ${pair.leak ? 'border-rose-300 shadow-rose-100 shadow-lg' : 'border-slate-100 shadow-sm'}`}
            >
              {/* Pair header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-black text-xl text-slate-900">{pair.name}</h3>
                  <span className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${pair.leak ? 'bg-rose-100 text-rose-600' : pair.amontTotal > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${pair.leak ? 'bg-rose-500 animate-pulse' : pair.amontTotal > 0 ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    {pair.leak ? 'Fuite détectée' : pair.amontTotal > 0 ? 'Nominal' : 'En attente de données'}
                  </span>
                </div>
                <button
                  onClick={() => removeSensorPair(pair.id)}
                  className="p-2.5 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Flow diagram */}
              <div className="flex items-center gap-3 mb-6">
                {/* Amont */}
                <div className="flex-1 p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                  <p className="text-[9px] font-black uppercase tracking-widest text-blue-400 mb-1">Amont (entrée)</p>
                  <p className="font-black text-lg text-blue-700">{pair.amontSensor?.name ?? pair.amontId}</p>
                  <p className="text-2xl font-black text-blue-900 mt-1">{pair.amontTotal.toFixed(1)}<span className="text-xs text-blue-400 ml-1">L</span></p>
                </div>

                {/* Arrow + diff */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black ${pair.diff > pair.tolerance ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                    Δ {pair.diff.toFixed(1)}L
                  </div>
                  <div className="text-slate-300 text-xs">→</div>
                </div>

                {/* Aval */}
                <div className="flex-1 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 text-center">
                  <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-1">Aval (sortie)</p>
                  <p className="font-black text-lg text-indigo-700">{pair.avalSensor?.name ?? pair.avalId}</p>
                  <p className="text-2xl font-black text-indigo-900 mt-1">{pair.avalTotal.toFixed(1)}<span className="text-xs text-indigo-400 ml-1">L</span></p>
                </div>
              </div>

              {/* Tolerance bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>Différence actuelle</span>
                  <span>Tolérance : {pair.tolerance}L</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${pair.diff > pair.tolerance ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(100, (pair.diff / Math.max(pair.tolerance, 0.1)) * 100)}%` }}
                  />
                </div>
                {pair.leak && (
                  <p className="text-rose-500 text-xs font-black flex items-center gap-1.5 mt-1">
                    <AlertTriangle size={12} />
                    {pair.diff.toFixed(1)}L non comptabilisés entre amont et aval — fuite probable
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-[40px] p-10 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Lier deux capteurs</h2>
            <p className="text-slate-400 text-sm mb-8">Sélectionnez un capteur amont (entrée) et un capteur aval (sortie). Si la différence de volume dépasse la tolérance, une fuite est signalée.</p>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Nom de la paire</label>
                <input
                  type="text"
                  placeholder="ex: Réseau cuisine"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-400 transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Capteur Amont (entrée)</label>
                <select
                  value={form.amontId}
                  onChange={e => setForm(f => ({ ...f, amontId: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-400 transition-all"
                >
                  <option value="">— Choisir —</option>
                  {sensors.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Capteur Aval (sortie)</label>
                <select
                  value={form.avalId}
                  onChange={e => setForm(f => ({ ...f, avalId: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-400 transition-all"
                >
                  <option value="">— Choisir —</option>
                  {sensors.filter((s: any) => s.id !== form.amontId).map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Tolérance (litres)</label>
                <input
                  type="number"
                  min={0}
                  value={form.tolerance}
                  onChange={e => setForm(f => ({ ...f, tolerance: parseFloat(e.target.value) || 0 }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-400 transition-all"
                />
                <p className="text-[10px] text-slate-400 mt-1.5 font-semibold">Si amont − aval &gt; tolérance → alerte fuite</p>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3.5 rounded-2xl font-black text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleAdd}
                disabled={!form.amontId || !form.avalId || form.amontId === form.avalId}
                className="flex-1 py-3.5 rounded-2xl font-black text-white bg-rose-600 hover:bg-rose-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-rose-600/20"
              >
                Lier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeakDetection;
