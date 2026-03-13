import React, { useState } from "react";
import {
  Plus,
  Wifi,
  Battery,
  MapPin,
  Activity,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
  X,
  Bell,
  BellOff,
  Sliders,
  Info,
  Droplet,
} from "lucide-react";
import { useWater } from "../store/WaterContext";
import { EQUIPMENT_LABELS } from "../constants";
import AddEquipmentModal from "../components/AddEquipmentModal";
import { SensorStatus } from "../types";

const EquipmentStatus: React.FC = () => {
  const { sensors, addSensor, updateSensor, measurements } = useWater();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);
  const selectedSensor = selectedSensorId ? sensors.find(s => s.id === selectedSensorId) ?? null : null;
  const [successMessage, setSuccessMessage] = useState(false);

  const handleAddSensor = (sensor: any) => {
    addSensor(sensor);
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 5000);
  };

  const sensorStats = (sensorId: string) => {
    const sensorMs = measurements.filter((m) => m.device_id === sensorId);
    const totalVol = sensorMs.reduce((acc, m) => acc + m.volume_l, 0);
    const lastActivity =
      sensorMs.length > 0 ? sensorMs[sensorMs.length - 1].timestamp : null;
    return { totalVol: Math.round(totalVol), lastActivity };
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tight">
            Statut d'équipement
          </h1>
          <p className="text-slate-400 font-medium tracking-tight">
            Gestion et santé de votre réseau IoT ConsoEau
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-[24px] font-bold flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
        >
          <Plus size={20} />
          Ajouter un équipement
        </button>
      </div>

      {successMessage && (
        <div className="bg-emerald-500 text-white p-6 rounded-[32px] flex items-center justify-between shadow-xl shadow-emerald-500/20 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-2 rounded-xl">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="font-black uppercase text-xs tracking-widest">
                Opération réussie
              </p>
              <p className="text-sm font-medium">
                L'équipement a été ajouté avec succès et est désormais actif.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSuccessMessage(false)}
            className="text-white/60 hover:text-white p-2"
          >
            <Plus className="rotate-45" size={24} />
          </button>
        </div>
      )}

      {/* Grid of Sensors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sensors.map((sensor) => (
          <div
            key={sensor.id}
            className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden flex flex-col cursor-pointer"
            onClick={() => setSelectedSensorId(sensor.id)}
          >
            <div className="flex justify-between items-start mb-6">
              <div
                className={`p-4 rounded-[22px] ${sensor.status === "active" ? "bg-blue-50 text-blue-600" : "bg-rose-50 text-rose-600"}`}
              >
                <Activity size={24} />
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
                  <div
                    className={`w-2 h-2 rounded-full ${sensor.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}
                  />
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                    {sensor.status === "active" ? "En ligne" : "Déconnecté"}
                  </span>
                </div>
                {sensor.alertsEnabled ? (
                  <Bell size={14} className="text-blue-500" />
                ) : (
                  <BellOff size={14} className="text-slate-300" />
                )}
              </div>
            </div>

            <div className="space-y-1 mb-6">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                {sensor.name}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                {EQUIPMENT_LABELS[sensor.type]}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-auto pb-8">
              <div className="bg-slate-50/50 p-4 rounded-2xl flex items-center gap-3 border border-slate-100/50">
                <MapPin size={14} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-600 truncate">
                  {sensor.zone}
                </span>
              </div>
              <div className="bg-slate-50/50 p-4 rounded-2xl flex items-center gap-3 border border-slate-100/50">
                <Battery
                  size={14}
                  className={
                    sensor.battery && sensor.battery < 20
                      ? "text-rose-500"
                      : "text-emerald-500"
                  }
                />
                <span className="text-xs font-bold text-slate-600">
                  {sensor.battery || 100}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                {sensor.id}
              </span>
              <button className="text-blue-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Détails <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}

        {/* Empty Add Placeholder */}
        <button
          onClick={() => setShowAddModal(true)}
          className="border-2 border-dashed border-slate-200 p-8 rounded-[40px] flex flex-col items-center justify-center gap-4 text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/20 transition-all group min-h-[300px]"
        >
          <div className="p-4 rounded-full bg-slate-50 group-hover:bg-blue-100/50 transition-colors">
            <Plus size={32} />
          </div>
          <span className="font-black text-sm uppercase tracking-widest">
            Nouvel Équipement
          </span>
        </button>
      </div>

      {/* Network Stats */}
      <div className="bg-[#0f172a] text-white p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[100%] bg-blue-600/10 blur-[100px] rounded-full group-hover:bg-blue-600/20 transition-colors" />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-2">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
              Passerelle ConsoEau
            </h4>
            <p className="text-2xl font-black flex items-center gap-3">
              <Wifi className="text-emerald-500" /> OPÉRATIONNELLE
            </p>
            <p className="text-xs text-slate-500 font-medium">
              Firmware v1.4.3 • Connecté au Wi-Fi "SmartHome_5G"
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
              Charge réseau
            </h4>
            <p className="text-2xl font-black">LÉGÈRE (12%)</p>
            <p className="text-xs text-slate-500 font-medium">
              {sensors.length} équipements synchronisés sans délai.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
              Dernier Scan
            </h4>
            <p className="text-2xl font-black">À L'INSTANT</p>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span className="text-xs text-emerald-500 font-bold">
                Tous les capteurs répondent
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedSensor && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            onClick={() => setSelectedSensorId(null)}
          />
          <div className="bg-white w-full max-w-2xl rounded-[48px] shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 p-3 rounded-2xl text-white">
                  <Activity size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight">
                    {selectedSensor.name}
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    {EQUIPMENT_LABELS[selectedSensor.type]} •{" "}
                    {selectedSensor.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSensorId(null)}
                className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="p-10 space-y-10">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Volume Total
                  </p>
                  <p className="text-2xl font-black text-slate-900">
                    {sensorStats(selectedSensor.id).totalVol}{" "}
                    <span className="text-xs text-slate-400">L</span>
                  </p>
                </div>
                <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Batterie
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Battery size={18} className="text-emerald-500" />
                    <p className="text-2xl font-black text-slate-900">
                      {selectedSensor.battery}%
                    </p>
                  </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Dernier signal
                  </p>
                  <p className="text-xs font-bold text-slate-900 uppercase">
                    {sensorStats(selectedSensor.id).lastActivity
                      ? new Date(
                          sensorStats(selectedSensor.id).lastActivity!,
                        ).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Jamais"}
                  </p>
                </div>
              </div>

              {/* Settings Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Sliders size={20} className="text-blue-600" />
                  <h3 className="text-lg font-black tracking-tight">
                    Paramètres du capteur
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Seuil d'alerte (L/jour)
                      </label>
                      {selectedSensor.customThreshold && (
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          PERSONNALISÉ
                        </span>
                      )}
                    </div>
                    <div className="relative group">
                      <Droplet
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"
                        size={20}
                      />
                      <input
                        type="number"
                        placeholder="Seuil (L)"
                        value={selectedSensor.customThreshold || ""}
                        onChange={(e) =>
                          updateSensor(selectedSensor.id, {
                            customThreshold: e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-300 placeholder:font-bold"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                      Une alerte sera générée si ce capteur dépasse ce volume
                      sur 24h. Laissez vide pour utiliser le seuil global.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Notifications et Alertes
                    </label>
                    <button
                      onClick={() =>
                        updateSensor(selectedSensor.id, {
                          alertsEnabled: !selectedSensor.alertsEnabled,
                        })
                      }
                      className={`w-full flex items-center justify-between p-6 rounded-[32px] border transition-all ${
                        selectedSensor.alertsEnabled
                          ? "bg-blue-50 border-blue-100 text-blue-900"
                          : "bg-slate-50 border-slate-100 text-slate-400"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {selectedSensor.alertsEnabled ? (
                          <Bell size={24} className="text-blue-600" />
                        ) : (
                          <BellOff size={24} />
                        )}
                        <div className="text-left">
                          <p className="text-sm font-black uppercase tracking-widest">
                            {selectedSensor.alertsEnabled
                              ? "Alertes Actives"
                              : "Alertes Muettes"}
                          </p>
                          <p className="text-[10px] font-bold opacity-60">
                            Gestion intelligente des fuites
                          </p>
                        </div>
                      </div>
                      <div
                        className={`w-12 h-6 rounded-full relative transition-colors ${selectedSensor.alertsEnabled ? "bg-blue-600" : "bg-slate-300"}`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${selectedSensor.alertsEnabled ? "left-7" : "left-1"}`}
                        />
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Help / Footer */}
              <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex gap-4">
                <Info size={20} className="text-slate-400 shrink-0" />
                <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                  Ce capteur utilise la technologie LoRaWAN pour une portée
                  maximale et une faible consommation d'énergie. En cas de perte
                  de signal prolongée ( {">"} 24h), une alerte de maintenance
                  réseau sera automatiquement créée.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <AddEquipmentModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddSensor}
        />
      )}
    </div>
  );
};

export default EquipmentStatus;
