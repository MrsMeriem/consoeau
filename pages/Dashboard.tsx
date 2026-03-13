import React, { useMemo, useState } from "react";
import {
  Droplets,
  BarChart3,
  Euro,
  Calendar,
  Check,
  ShieldCheck,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useWater } from "../store/WaterContext";
import { KPICard, TarifCard } from "../components/DashboardCards";
import { EQUIPMENT_LABELS, WATER_PRICE_PER_L, WATER_PRICE_PER_M3 } from "../constants";


const COLORS = [
  "#3b82f6", // Douche (Blue)
  "#0ea5e9", // WC (Sky)
  "#06b6d4", // Cuisine (Cyan)
  "#10b981", // Lave-vaisselle (Emerald)
  "#6366f1", // Lave-linge (Indigo)
  "#f59e0b", // Jardin (Amber)
  "#94a3b8", // Autre (Slate)
];

const Dashboard: React.FC = () => {
  const [tarifMode, setTarifMode] = useState<'reference' | 'perso'>('reference');
  const [customTarif, setCustomTarif] = useState(4.34);

  const {
    measurements,
    sensors,
    threshold,
    period,
    setPeriod,
    setThreshold,
    selectedEquipment,
    setSelectedEquipment,
  } = useWater();

  const equipmentOptions = sensors.map(s => ({ key: s.id, label: s.name }));

  const stats = useMemo(() => {
    console.log("Dashboard - measurements:", measurements.length);
    if (measurements.length === 0) {
      console.log("Dashboard - No measurements, returning null");
      return null;
    }

    const sortedDates = measurements
      .map((m) => new Date(m.timestamp).getTime())
      .sort((a, b) => b - a);
    const referenceDate = new Date(sortedDates[0]);

    // Cutoff based on period
    const cutoff = new Date(referenceDate);
    if (period === "1MN") cutoff.setMinutes(cutoff.getMinutes() - 1);
    else if (period === "1H") cutoff.setHours(cutoff.getHours() - 1);
    else if (period === "1J") cutoff.setDate(cutoff.getDate() - 1);
    else if (period === "3J") cutoff.setDate(cutoff.getDate() - 3);
    else cutoff.setDate(cutoff.getDate() - 7); // 1S

    const filtered = measurements.filter((m) => {
      const date = new Date(m.timestamp);
      const inPeriod = date >= cutoff;
      const inEquip = selectedEquipment === "all" || m.device_id === selectedEquipment;
      return inPeriod && inEquip;
    });

    const totalL = filtered.reduce((acc, m) => acc + m.volume_l, 0);
    const effectivePricePerL = (tarifMode === 'perso' ? customTarif : WATER_PRICE_PER_M3) / 1000;
    const totalCost = totalL * effectivePricePerL;

    const breakdown = sensors.map((sensor) => {
      const vol = filtered
        .filter((m) => m.device_id === sensor.id)
        .reduce((acc, m) => acc + m.volume_l, 0);
      return { name: sensor.name, value: Math.round(vol * 10) / 10, key: sensor.id };
    });

    // Graph: for sub-day periods, group by minute; for days, group by day
    const dailyGraph: any[] = [];
    if (period === "1MN" || period === "1H") {
      const buckets = period === "1MN" ? 12 : 12; // 12 buckets
      const rangeMs = period === "1MN" ? 60_000 : 3_600_000;
      const bucketMs = rangeMs / buckets;
      for (let i = 0; i < buckets; i++) {
        const from = new Date(referenceDate.getTime() - rangeMs + i * bucketMs);
        const to = new Date(from.getTime() + bucketMs);
        const vol = filtered
          .filter((m) => { const t = new Date(m.timestamp).getTime(); return t >= from.getTime() && t < to.getTime(); })
          .reduce((acc, m) => acc + m.volume_l, 0);
        const label = period === "1MN"
          ? `${from.getSeconds()}s`
          : `${String(from.getHours()).padStart(2,'0')}:${String(from.getMinutes()).padStart(2,'0')}`;
        dailyGraph.push({ date: label, l: Math.round(vol * 100) / 100 });
      }
    } else {
      const daysToShow = period === "1J" ? 1 : period === "3J" ? 3 : 7;
      for (let i = daysToShow - 1; i >= 0; i--) {
        const d = new Date(referenceDate);
        d.setDate(d.getDate() - i);
        const dStr = d.toISOString().split("T")[0];
        const vol = filtered
          .filter((m) => m.timestamp.startsWith(dStr))
          .reduce((acc, m) => acc + m.volume_l, 0);
        dailyGraph.push({ date: dStr.split("-").slice(1).reverse().join("/"), l: Math.round(vol) });
      }
    }

    return { totalL, totalCost, breakdown, dailyGraph, referenceDate };
  }, [measurements, sensors, period, selectedEquipment, tarifMode, customTarif]);

  if (!stats) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
      <div className="p-5 bg-blue-50 rounded-[28px]">
        <Droplets size={40} className="text-blue-400" />
      </div>
      <h2 className="text-2xl font-black text-slate-700">Aucune donnée disponible</h2>
      <p className="text-slate-400 max-w-sm">Les mesures apparaîtront ici dès que des données seront disponibles.</p>
    </div>
  );

  const progressPercent = Math.min(
    100,
    Math.round((stats.totalL / threshold) * 100),
  );

  return (
    <div className="space-y-8 pb-10 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 flex items-center gap-4">
            <span className="p-3 bg-blue-600 rounded-[22px] shadow-xl shadow-blue-600/20">
              <Calendar size={28} className="text-white" />
            </span>
            Vue {period}
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] ml-2">
            Période du {stats.referenceDate.toLocaleDateString("fr-FR")} •
            Simulation IA active
          </p>
        </div>
        <div className="flex p-1.5 bg-white rounded-[22px] shadow-sm border border-slate-100 backdrop-blur-xl">
          {(["1MN", "1H", "1J", "3J", "1S"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-6 py-3 rounded-[18px] text-[11px] font-black uppercase tracking-widest transition-all ${
                period === p
                  ? "bg-slate-900 text-white shadow-xl"
                  : "text-slate-400 hover:text-slate-900"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Volume total"
          value={Math.round(stats.totalL)}
          unit="Litres"
          icon={Droplets}
        />
        <KPICard
          title="Consommation moyenne"
          value={
            period === "1MN" ? (stats.totalL / 60).toFixed(3) :
            period === "1H"  ? stats.totalL.toFixed(2) :
            Math.round(stats.totalL / (period === "1J" ? 1 : period === "3J" ? 3 : 7))
          }
          unit={period === "1MN" ? "L / s" : period === "1H" ? "L / h" : "L / Jour"}
          icon={BarChart3}
          color="indigo"
        />
        <KPICard
          title="Dépense estimée"
          value={stats.totalCost.toFixed(2)}
          unit="Euros"
          icon={Euro}
          color="emerald"
        />
        <TarifCard mode={tarifMode} customValue={customTarif} onModeChange={setTarifMode} onValueChange={setCustomTarif} />
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between group transition-all hover:shadow-xl hover:shadow-slate-200/50">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 block">
            Seuil de vigilance (L)
          </span>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xl font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-slate-300 text-xs">
                LITRES
              </span>
            </div>
            <button className="bg-blue-600 text-white p-5 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
              <Check size={24} strokeWidth={3} />
            </button>
          </div>
        </div>

        <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-slate-200/50">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 block">
            Équipement cible
          </span>
          <div className="relative">
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-black text-slate-900 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            >
              <option value="all">Tous les équipements</option>
              {equipmentOptions.map(({ key, label }) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <BarChart3 size={18} />
            </div>
          </div>
        </div>

        <div className="bg-[#0f172a] text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-blue-600/10 rounded-full blur-3xl transition-transform group-hover:scale-150" />
          <div className="flex justify-between items-center mb-6 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
              Objectif du jour
            </span>
            <div className="bg-slate-800 px-3 py-1.5 rounded-full border border-white/5">
              <span className="text-[9px] font-black text-slate-400 tracking-widest uppercase">
                CAP {threshold}L
              </span>
            </div>
          </div>
          <div className="mb-6 relative z-10">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tighter text-blue-500">
                {progressPercent}%
              </span>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                Utilisés
              </span>
            </div>
            <div className="w-full bg-slate-800 h-3 rounded-full mt-6 overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${progressPercent > 90 ? "bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]" : "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]"}`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
          <div className="relative z-10 flex items-center gap-3">
            <ShieldCheck size={16} className="text-emerald-500" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Surveillance active • Analyse continue
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Activity Chart */}
        <div className="p-10 bg-white rounded-[48px] border border-slate-100 shadow-sm flex flex-col group transition-all hover:shadow-2xl hover:shadow-slate-200/50">
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-black text-2xl tracking-tight flex items-center gap-4">
              <div className="w-2 h-8 bg-blue-600 rounded-full" />
              Historique de débit
            </h3>
            <div className="flex gap-2">
              <span className="text-[10px] bg-blue-50 px-4 py-2 rounded-full font-black text-blue-600 uppercase tracking-widest border border-blue-100">
                Unit: Litres
              </span>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.dailyGraph}>
                <defs>
                  <linearGradient id="colorL" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="6 6"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fontWeight: "800", fill: "#cbd5e1" }}
                  dy={15}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fontWeight: "800", fill: "#cbd5e1" }}
                />
                <Tooltip
                  cursor={{
                    stroke: "#2563eb",
                    strokeWidth: 2,
                    strokeDasharray: "4 4",
                  }}
                  contentStyle={{
                    borderRadius: "24px",
                    border: "none",
                    boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.15)",
                    padding: "20px",
                  }}
                  itemStyle={{
                    fontSize: "13px",
                    fontWeight: "900",
                    color: "#1e293b",
                    textTransform: "uppercase",
                  }}
                  labelStyle={{
                    fontSize: "11px",
                    fontWeight: "800",
                    color: "#94a3b8",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="l"
                  stroke="#2563eb"
                  strokeWidth={5}
                  fillOpacity={1}
                  fill="url(#colorL)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown Chart */}
        <div className="p-10 bg-white rounded-[48px] border border-slate-100 shadow-sm flex flex-col group transition-all hover:shadow-2xl hover:shadow-slate-200/50">
          <h3 className="font-black text-2xl tracking-tight mb-10 flex items-center gap-4">
            <div className="w-2 h-8 bg-indigo-600 rounded-full" />
            Mix des consommations
          </h3>
          <div className="flex flex-col flex-1 items-center justify-center space-y-12">
            <div className="w-full h-[280px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.breakdown.filter((b) => b.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={85}
                    outerRadius={125}
                    paddingAngle={10}
                    dataKey="value"
                    stroke="none"
                  >
                    {stats.breakdown
                      .filter((b) => b.value > 0)
                      .map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          className="hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
                        />
                      ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "20px",
                      border: "none",
                      boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className="text-4xl font-black text-slate-900 leading-none">
                  {Math.round(stats.totalL)}
                </p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3">
                  Litres total
                </p>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-4 px-2">
              {stats.breakdown
                .filter((b) => b.value > 0)
                .map((b, i) => (
                  <div
                    key={b.key}
                    className="flex flex-col p-4 bg-slate-50 rounded-3xl border border-slate-100/50 transition-all hover:bg-white hover:shadow-lg"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      ></div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                        {b.name}
                      </span>
                    </div>
                    <span className="text-lg font-black text-slate-800">
                      {b.value}
                      <span className="text-[10px] text-slate-400 ml-1">L</span>
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
