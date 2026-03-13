
import React from 'react';
import { Bell, AlertTriangle, AlertCircle, Info, Trash2, CheckCheck, Calendar } from 'lucide-react';
import { useWater } from '../store/WaterContext';
import { Alert } from '../types';

const AlertCard: React.FC<{ alert: Alert; onRead: (id: string) => void }> = ({ alert, onRead }) => {
  const colors = {
    danger: { bg: 'bg-rose-50', border: 'border-rose-200', icon: 'text-rose-600', badge: 'bg-rose-100 text-rose-700', label: 'Critique' },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-600', badge: 'bg-amber-100 text-amber-700', label: 'Vigilance' },
    info: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600', badge: 'bg-blue-100 text-blue-700', label: 'Info' },
  };
  const c = colors[alert.type];
  const Icon = alert.type === 'danger' ? AlertCircle : alert.type === 'warning' ? AlertTriangle : Info;

  return (
    <div className={`p-6 rounded-[32px] flex items-start gap-6 border transition-all group ${c.bg} ${c.border} ${alert.isRead ? 'opacity-50' : 'hover:scale-[1.01]'}`}>
      <div className={`p-4 rounded-2xl bg-white shadow-sm shrink-0 ${c.icon}`}>
        <Icon size={24} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${c.badge}`}>{c.label}</span>
          {!alert.isRead && <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />}
          {alert.device && (
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{alert.device}</span>
          )}
        </div>
        <h4 className="font-black text-base text-slate-900 mb-1">{alert.title}</h4>
        <p className="text-slate-600 text-sm font-medium leading-relaxed">{alert.message}</p>
        <div className="flex items-center gap-2 mt-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <Calendar size={11} />
          <span>{alert.date} · {alert.time}</span>
          {alert.vol && <span className="ml-2 text-rose-500">· {alert.vol} L</span>}
        </div>
      </div>

      {!alert.isRead && (
        <button
          onClick={() => onRead(alert.id)}
          className="shrink-0 flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-slate-200 text-[11px] font-black text-slate-600 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 transition-all shadow-sm"
        >
          <CheckCheck size={14} />
          Lu
        </button>
      )}
    </div>
  );
};

const Alerts: React.FC = () => {
  const { alerts, markAlertRead, clearAlerts } = useWater();
  const unread = alerts.filter(a => !a.isRead);
  const read = alerts.filter(a => a.isRead);

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tight flex items-center gap-4">
            <span className="p-3 bg-rose-600 rounded-[22px] shadow-xl shadow-rose-600/20">
              <Bell size={28} className="text-white" />
            </span>
            Centre d'alertes
          </h1>
          <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.25em] ml-2">
            {unread.length} non lue{unread.length !== 1 ? 's' : ''} · {alerts.length} au total
          </p>
        </div>
        <button
          onClick={clearAlerts}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-slate-100 shadow-sm text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-all font-bold text-xs uppercase tracking-widest"
        >
          <Trash2 size={16} />
          Tout effacer
        </button>
      </div>

      {alerts.length === 0 ? (
        <div className="bg-white rounded-[40px] p-20 border border-dashed border-slate-200 flex flex-col items-center text-center">
          <div className="bg-slate-50 p-6 rounded-full mb-6">
            <Bell size={48} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Tout est sous contrôle</h3>
          <p className="text-slate-400 max-w-xs mx-auto text-sm leading-relaxed font-medium">
            Aucune anomalie détectée sur votre réseau.
          </p>
        </div>
      ) : (
        <>
          {/* Unread */}
          {unread.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">
                  Non lues · {unread.length}
                </h2>
                <button
                  onClick={() => unread.forEach(a => markAlertRead(a.id))}
                  className="flex items-center gap-2 text-[11px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest"
                >
                  <CheckCheck size={14} />
                  Tout marquer comme lu
                </button>
              </div>
              {unread.map(alert => (
                <AlertCard key={alert.id} alert={alert} onRead={markAlertRead} />
              ))}
            </div>
          )}

          {/* Read */}
          {read.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">
                Archivées · {read.length}
              </h2>
              {read.map(alert => (
                <AlertCard key={alert.id} alert={alert} onRead={markAlertRead} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Alerts;
