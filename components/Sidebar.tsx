
import React from 'react';
import {
  LayoutGrid, Sparkles, Bell, LogOut, Droplets, Wifi, User, RefreshCw, BarChart3
} from 'lucide-react';
import { useWater } from '../store/WaterContext';
import { UserProfile } from '../types';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  isCollapsed?: boolean;
  user: UserProfile;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate, onLogout, isCollapsed, user }) => {
  const { alerts } = useWater();
  const unreadCount = alerts.filter(a => !a.isRead).length;

  const navItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutGrid },
    { id: 'sensors', label: 'Statut d\'équipement', icon: Wifi },
    { id: 'analytics', label: 'Analytique', icon: BarChart3 },
    { id: 'ai', label: 'Conseils IA', icon: Sparkles },
    { id: 'alerts', label: 'Alertes', icon: Bell, badge: unreadCount > 0 },
  ];

  return (
    <aside className={`bg-[#0f172a] text-white flex flex-col h-screen transition-all duration-300 border-r border-white/5 ${isCollapsed ? 'w-0 overflow-hidden' : 'w-64'}`}>
      <div className="p-8 flex items-center gap-3">
        <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-500/20">
          <Droplets size={24} />
        </div>
        <span className="text-xl font-black tracking-tight">ConsoEau</span>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all relative group ${
                isActive ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-white' : 'group-hover:text-blue-400 transition-colors'} />
              <div className="flex flex-col items-start leading-none text-left">
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
              </div>
              {unreadCount > 0 && item.id === 'alerts' && (
                <span className="absolute top-4 right-4 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0f172a]"></span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-6 mt-auto space-y-3 border-t border-white/5">
        <button 
          onClick={() => onNavigate('profile')}
          className={`w-full flex items-center gap-4 px-4 py-4 rounded-[24px] border transition-all text-left ${
            currentPath === 'profile' ? 'bg-blue-600/10 border-blue-500/30 text-white' : 'bg-white/5 border-white/5 hover:bg-white/10'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-colors shrink-0 ${
             currentPath === 'profile' ? 'bg-blue-600 shadow-blue-600/20' : 'bg-blue-600/80 shadow-blue-600/10'
          }`}>
            <User size={20} />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] truncate">Mon Profil</p>
            <p className="text-xs font-bold text-slate-200 truncate">{user.name}</p>
          </div>
        </button>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button 
            onClick={() => window.location.reload()}
            className="flex flex-col items-center justify-center gap-1.5 py-3 bg-white/5 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
          >
            <RefreshCw size={16} />
            <span className="text-[8px] font-black uppercase tracking-widest">Actualiser</span>
          </button>
          <button 
            onClick={onLogout}
            className="flex flex-col items-center justify-center gap-1.5 py-3 bg-rose-500/5 rounded-2xl text-rose-500/70 hover:text-rose-400 hover:bg-rose-500/10 transition-all border border-rose-500/10"
          >
            <LogOut size={16} />
            <span className="text-[8px] font-black uppercase tracking-widest">Quitter</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
