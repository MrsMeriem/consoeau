import React, { useMemo, useState } from 'react';
import { BarChart3, Activity, Euro, TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { useWater } from '../store/WaterContext';
import { EQUIPMENT_LABELS, WATER_PRICE_PER_M3 } from '../constants';

const COLORS = [
  '#3b82f6', '#0ea5e9', '#06b6d4', '#10b981', '#6366f1', '#f59e0b', '#94a3b8',
  '#ec4899', '#14b8a6', '#f97316'
];

const Analytics: React.FC = () => {
  const { measurements, sensors, equipmentThresholds, period, setPeriod } = useWater();
  const [tarifMode] = useState<'reference'>('reference');
  const activeTarifPerL = WATER_PRICE_PER_M3 / 1000;

  const stats = useMemo(() => {
    if (measurements.length === 0 || sensors.length === 0) return null;

    const sortedMs = [...measurements].sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    const referenceDate = new Date(sortedMs[0].timestamp);
    const cutoff = new Date(referenceDate);
    if (period === '1MN') cutoff.setMinutes(cutoff.getMinutes() - 1);
    else if (period === '1H') cutoff.setHours(cutoff.getHours() - 1);
    else if (period === '1J') cutoff.setDate(cutoff.getDate() - 1);
    else if (period === '3J') cutoff.setDate(cutoff.getDate() - 3);
    else cutoff.setDate(cutoff.getDate() - 7);

    const filtered = measurements.filter(m => new Date(m.timestamp) >= cutoff);
    const totalL = filtered.reduce((acc, m) => acc + m.volume_l, 0);

    // Per-sensor breakdown
    const breakdown = sensors.map((sensor, i) => {
      const sensorMs = filtered.filter(m => m.device_id === sensor.id);
      const vol = sensorMs.reduce((acc, m) => acc + m.volume_l, 0);
      const avgDebit = sensorMs.length > 0
        ? sensorMs.reduce((acc, m) => acc + m.debit_l_min, 0) / sensorMs.length
        : 0;
      const eqThreshold = sensor.customThreshold ?? equipmentThresholds[sensor.type] ?? 0;
      const percent = totalL > 0 ? Math.round((vol / totalL) * 100) : 0;
      return {
        name: sensor.name,
        shortName: sensor.name.split(' ').slice(0, 2).join(' '),
        typeLabel: EQUIPMENT_LABELS[sensor.type] ?? sensor.type,
        vol: Math.round(vol * 10) / 10,
        avgDebit: Math.round(avgDebit * 10) / 10,
        cost: parseFloat((vol * activeTarifPerL).toFixed(2)),
        eqThreshold,
        isOver: eqThreshold > 0 && vol > eqThreshold,
        percent,
        battery: sensor.battery ?? 100,
        status: sensor.status,
        color: COLORS[i % COLORS.length],
        usages: sensorMs.length,
      };
    });

    // Per-day per-sensor chart data
    const daysToShow = period === '1J' ? 1 : period === '3J' ? 3 : period === '1S' ? 7 : 1;
    const dailyBreakdown: Record<string, any>[] = [];
    if (period === '1MN' || period === '1H') {
      const buckets = 12;
      const rangeMs = period === '1MN' ? 60_000 : 3_600_000;
      const bucketMs = rangeMs / buckets;
      for (let i = 0; i < buckets; i++) {
        const from = new Date(referenceDate.getTime() - rangeMs + i * bucketMs);
        const to = new Date(from.getTime() + bucketMs);
        const label = period === '1MN'
          ? `${from.getSeconds()}s`
          : `${String(from.getHours()).padStart(2,'0')}:${String(from.getMinutes()).padStart(2,'0')}`;
        const entry: Record<string, any> = { date: label };
        sensors.forEach(sensor => {
          const vol = filtered
            .filter(m => m.device_id === sensor.id && new Date(m.timestamp).getTime() >= from.getTime() && new Date(m.timestamp).getTime() < to.getTime())
            .reduce((acc, m) => acc + m.volume_l, 0);
          entry[sensor.name] = Math.round(vol * 100) / 100;
        });
        dailyBreakdown.push(entry);
      }
    } else {
      for (let i = daysToShow - 1; i >= 0; i--) {
        const d = new Date(referenceDate);
        d.setDate(d.getDate() - i);
        const dStr = d.toISOString().split('T')[0];
        const entry: Record<string, any> = { date: dStr.split('-').slice(1).reverse().join('/') };
        sensors.forEach(sensor => {
          const vol = filtered
            .filter(m => m.device_id === sensor.id && m.timestamp.startsWith(dStr))
            .reduce((acc, m) => acc + m.volume_l, 0);
          entry[sensor.name] = Math.round(vol);
        });
        dailyBreakdown.push(entry);
      }
    }

    return { breakdown, totalL, dailyBreakdown };
  }, [measurements, sensors, period, equipmentThresholds, activeTarifPerL]);

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Aucune donnée disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 flex items-center gap-4">
            <span className="p-3 bg-indigo-600 rounded-[22px] shadow-xl shadow-indigo-600/20">
              <BarChart3 size={28} className="text-white" />
            </span>
            Analytique
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] ml-2 mt-1">
            Détail par équipement · {sensors.length} capteurs actifs
          </p>
        </div>
        <div className="flex p-1.5 bg-white rounded-[22px] shadow-sm border border-slate-100">
          {(['1MN', '1H', '1J', '3J', '1S'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-6 py-3 rounded-[18px] text-[11px] font-black uppercase tracking-widest transition-all ${
                period === p ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Bar chart — consommation par équipement par jour */}
      <div className="p-10 bg-white rounded-[48px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all">
        <h3 className="font-black text-2xl tracking-tight mb-10 flex items-center gap-4">
          <div className="w-2 h-8 bg-indigo-600 rounded-full" />
          Consommation journalière par équipement
        </h3>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.dailyBreakdown} barSize={14}>
              <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: '800', fill: '#cbd5e1' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: '800', fill: '#cbd5e1' }} unit="L" />
              <Tooltip
                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px' }}
                formatter={(val: number) => [`${val} L`, '']}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '11px', fontWeight: '800', paddingTop: '16px' }}
              />
              {sensors.map((sensor, i) => (
                <Bar key={sensor.id} dataKey={sensor.name} stackId="a" fill={COLORS[i % COLORS.length]} radius={i === sensors.length - 1 ? [6, 6, 0, 0] : [0, 0, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Full analytics table */}
      <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-2xl transition-all">
        <div className="p-10 flex justify-between items-center border-b border-slate-50">
          <h3 className="font-black text-2xl tracking-tight uppercase flex items-center gap-3">
            <Activity size={22} className="text-indigo-600" />
            Tableau détaillé
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Total : {Math.round(stats.totalL)} L · {(stats.totalL * activeTarifPerL).toFixed(2)} €
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] border-b border-slate-50 bg-slate-50/50">
                <th className="py-6 px-6">Capteur</th>
                <th className="py-6 px-6">Type</th>
                <th className="py-6 px-6">Statut</th>
                <th className="py-6 px-6">Usages</th>
                <th className="py-6 px-6">Volume</th>
                <th className="py-6 px-6">Débit moy.</th>
                <th className="py-6 px-6">Seuil</th>
                <th className="py-6 px-6">Coût</th>
                <th className="py-6 px-6 text-right">Part</th>
              </tr>
            </thead>
            <tbody>
              {stats.breakdown.map((b) => (
                <tr key={b.name} className="border-b border-slate-50/80 hover:bg-slate-50/40 transition-colors last:border-0">
                  <td className="py-6 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: b.color }} />
                      <div>
                        <p className="text-sm font-black text-slate-900">{b.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{b.name.toLowerCase().replace(/\s+/g, '_')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-6">
                    <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1.5 rounded-xl uppercase tracking-wider">
                      {b.typeLabel}
                    </span>
                  </td>
                  <td className="py-6 px-6">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <span className={`block w-2 h-2 rounded-full ${b.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {b.status === 'active' && <span className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-30" />}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${b.status === 'active' ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {b.status === 'active' ? 'Actif' : 'Hors ligne'}
                      </span>
                      <span className="text-[10px] text-slate-300">· {b.battery}%</span>
                    </div>
                  </td>
                  <td className="py-6 px-6 font-black text-slate-700">{b.usages}</td>
                  <td className="py-6 px-6">
                    <span className="text-base font-black text-slate-900">{b.vol}</span>
                    <span className="text-[10px] text-slate-400 ml-1">L</span>
                  </td>
                  <td className="py-6 px-6 font-bold text-slate-600">{b.avgDebit} <span className="text-[10px] text-slate-400">L/min</span></td>
                  <td className="py-6 px-6">
                    <span className={`text-[11px] font-black px-3 py-1.5 rounded-xl border block w-fit ${
                      b.isOver ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-50 border-slate-100 text-slate-500'
                    }`}>
                      {b.eqThreshold > 0 ? `${b.eqThreshold} L` : '—'}
                      {b.isOver && ' ⚠'}
                    </span>
                  </td>
                  <td className="py-6 px-6">
                    <div className="flex items-center gap-1.5">
                      {b.isOver
                        ? <TrendingUp size={14} className="text-rose-500" />
                        : <TrendingDown size={14} className="text-emerald-500" />}
                      <span className="font-black text-slate-700">{b.cost} €</span>
                    </div>
                  </td>
                  <td className="py-6 px-6 text-right">
                    <div className="flex items-center gap-3 justify-end">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${b.percent}%`, backgroundColor: b.color }} />
                      </div>
                      <span className="text-xs font-black text-slate-900 min-w-[32px]">{b.percent}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
