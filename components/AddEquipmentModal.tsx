
import React, { useState } from 'react';
import { X, Wifi, CheckCircle2, QrCode, Smartphone, ArrowRight, Save, Loader2, Camera } from 'lucide-react';
import { EquipmentType, SensorStatus } from '../types';
import { EQUIPMENT_LABELS } from '../constants';

interface AddEquipmentModalProps {
  onClose: () => void;
  onAdd: (sensor: SensorStatus) => void;
}

const AddEquipmentModal: React.FC<AddEquipmentModalProps> = ({ onClose, onAdd }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sensorData, setSensorData] = useState({
    id: `SENSOR-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
    name: '',
    type: 'wc' as EquipmentType,
    zone: ''
  });

  const nextStep = () => {
    if (step === 2) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(3);
      }, 1500);
    } else {
      setStep(step + 1);
    }
  };

  const handleFinalize = () => {
    // Fix: Add missing alertsEnabled property required by SensorStatus type
    const newSensor: SensorStatus = {
      id: sensorData.id,
      name: sensorData.name || EQUIPMENT_LABELS[sensorData.type],
      type: sensorData.type,
      zone: sensorData.zone || 'Maison',
      status: 'active',
      battery: 100,
      alertsEnabled: true
    };
    onAdd(newSensor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Ajouter un équipement</h2>
            <div className="flex gap-2 mt-2">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-1 w-8 rounded-full transition-colors ${i <= step ? 'bg-blue-600' : 'bg-slate-100'}`} />
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors text-slate-400">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-10">
          {step === 1 && (
            <div className="space-y-8">
              <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                <p className="text-sm font-semibold text-blue-900 mb-4 tracking-tight leading-relaxed">
                  Pour ajouter un équipement, assurez-vous que :
                </p>
                <ul className="space-y-3">
                  {[
                    "Votre téléphone est connecté au Wi-Fi de l'installation",
                    "La passerelle Cons'Eau est active",
                    "Le capteur est sous tension"
                  ].map((text, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-blue-800/80 font-medium">
                      <CheckCircle2 size={18} className="text-blue-500 shrink-0" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Indicateurs de proximité</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: "Réseau local détecté", icon: Wifi },
                    { label: "Passerelle détectée", icon: Smartphone },
                    { label: "Prêt pour l'appairage", icon: CheckCircle2 }
                  ].map((ind, i) => (
                    <div key={i} className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                       <ind.icon size={18} className="text-emerald-500" />
                       <span className="text-xs font-bold text-slate-600">{ind.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={nextStep}
                className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
              >
                Démarrer l'installation <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 text-center">
              <div className="w-full aspect-square max-w-[240px] mx-auto bg-slate-900 rounded-[32px] flex flex-col items-center justify-center relative overflow-hidden group border-4 border-slate-800">
                {loading ? (
                   <div className="flex flex-col items-center gap-4">
                      <Loader2 className="animate-spin text-blue-400" size={48} />
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Analyse en cours...</span>
                   </div>
                ) : (
                  <>
                    <Camera size={48} className="text-slate-600 mb-4" />
                    <div className="absolute inset-0 border-2 border-dashed border-blue-500/30 m-8 rounded-2xl animate-pulse" />
                    <button 
                      onClick={nextStep}
                      className="absolute bottom-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all"
                    >
                      Simuler Scan QR
                    </button>
                  </>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 justify-center text-blue-600">
                  <QrCode size={20} />
                  <span className="font-bold tracking-tight">Scannez le QR code présent sur votre capteur</span>
                </div>
                
                <div className="flex items-center gap-3">
                   <div className="h-px bg-slate-100 flex-1" />
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ou saisie manuelle</span>
                   <div className="h-px bg-slate-100 flex-1" />
                </div>

                <input 
                  type="text" 
                  value={sensorData.id}
                  readOnly
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-center font-black text-slate-400 uppercase tracking-[0.3em] focus:outline-none"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
               <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 mb-6">
                  <CheckCircle2 className="text-emerald-500" size={24} />
                  <div>
                    <p className="text-xs font-bold text-emerald-900">Capteur {sensorData.id} associé !</p>
                    <p className="text-[10px] text-emerald-700/70 font-bold uppercase tracking-widest">Configuration finale requise</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Type d'équipement</label>
                    <select 
                      value={sensorData.type}
                      onChange={(e) => setSensorData({...sensorData, type: e.target.value as EquipmentType})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold appearance-none"
                    >
                      {Object.entries(EQUIPMENT_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Zone / Pièce</label>
                    <input 
                      type="text"
                      placeholder="ex: Cuisine, Étage..."
                      value={sensorData.zone}
                      onChange={(e) => setSensorData({...sensorData, zone: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nom personnalisé</label>
                  <input 
                    type="text"
                    placeholder="ex: WC Invités"
                    value={sensorData.name}
                    onChange={(e) => setSensorData({...sensorData, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
               </div>

               <div className="p-6 bg-slate-900 rounded-[28px] text-slate-400 flex items-center gap-4">
                  <Smartphone size={20} className="text-blue-500 shrink-0" />
                  <p className="text-xs font-medium leading-relaxed">
                    L'équipement sera associé à votre passerelle Cons'Eau et synchronisé avec votre dashboard.
                  </p>
               </div>

               <button 
                onClick={handleFinalize}
                className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3 hover:bg-blue-700 transition-all mt-4"
              >
                Finaliser l'ajout <Save size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddEquipmentModal;
