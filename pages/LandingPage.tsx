import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Droplets, Sun, Moon, ArrowRight, Activity, Info, Bell,
  Cpu, Wifi, Cloud, ChevronDown, ChevronUp, Users,
  Zap, Shield, BarChart3, Heart
} from 'lucide-react';
import { cn } from '../lib/utils';

export type AccountType = 'particulier' | 'pro' | 'collectivite' | 'testeur';
type Page = 'home' | 'campagne' | 'info' | 'faq' | 'apropos';

interface LandingPageProps {
  onEnter: (accountType?: AccountType) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const team = [
  { name: 'Victor Paul', school: 'ENSAM', initials: 'VP' },
  { name: 'Alexandre Della-Schiava', school: 'ENSAM', initials: 'AD' },
  { name: 'Meriem El Aita', school: 'Polytech Marseille', initials: 'ME' },
  { name: 'Maxime Goyenaga', school: 'ENSAM', initials: 'MG' },
  { name: 'Galdrick Rampin', school: 'ENSAM', initials: 'GR' },
];

/* ─── CAMPAGNE PAGE ─── */
const CampagnePage: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const dk = darkMode;
  const users = [
    { icon: '🏠', label: 'Particuliers', desc: 'Suivre la consommation domestique, détecter les fuites et réduire la facture d\'eau.' },
    { icon: '🏢', label: 'Professionnels', desc: 'Analyser la consommation des installations et optimiser l\'utilisation des ressources.' },
    { icon: '🏛️', label: 'Collectivités', desc: 'Surveiller les bâtiments publics et améliorer la gestion des infrastructures.' },
  ];
  const benefits = [
    { icon: <Activity size={20} />, text: 'Suivi en temps réel' },
    { icon: <Zap size={20} />, text: 'Détection des gaspillages' },
    { icon: <Bell size={20} />, text: 'Alertes d\'anomalie' },
    { icon: <BarChart3 size={20} />, text: 'Optimisation de la consommation' },
  ];
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-blue-600/20 text-blue-400 border border-blue-500/30">
          <Heart size={14} /> Campagne de soutien
        </div>
        <h1 className={cn("text-5xl font-black leading-tight", dk ? "text-white" : "text-slate-900")}>
          Soutenez le développement<br /><span className="text-blue-500">Cons'eau</span>
        </h1>
        <p className={cn("text-lg max-w-2xl mx-auto leading-relaxed", dk ? "text-white/70" : "text-slate-600")}>
          Cons'eau est un projet innovant visant à améliorer la gestion de la consommation d'eau dans les habitations, les entreprises et les bâtiments publics.
        </p>
      </motion.div>

      {/* Problème + solution */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className={cn("rounded-3xl p-8 border", dk ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm")}>
        <h2 className={cn("text-2xl font-bold mb-4", dk ? "text-white" : "text-slate-900")}>Le problème</h2>
        <p className={cn("leading-relaxed mb-3", dk ? "text-white/70" : "text-slate-600")}>
          Aujourd'hui, la majorité des utilisateurs ne disposent pas d'outils simples permettant de comprendre précisément leur consommation d'eau.
          Cette absence d'information rend difficile la détection des gaspillages ou des fuites.
        </p>
        <p className={cn("leading-relaxed", dk ? "text-white/70" : "text-slate-600")}>
          Cons'eau propose un capteur connecté installé sur le réseau d'eau, capable de mesurer le débit et de transmettre les données vers une application web de suivi et d'analyse.
        </p>
      </motion.div>

      {/* Nos utilisateurs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <h2 className={cn("text-2xl font-bold mb-6 text-center", dk ? "text-white" : "text-slate-900")}>Nos utilisateurs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {users.map((u, i) => (
            <div key={i} className={cn(
              "p-6 rounded-3xl border text-center space-y-3 transition-all",
              dk ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white border-slate-200 hover:border-blue-200 shadow-sm"
            )}>
              <div className="text-4xl">{u.icon}</div>
              <div className={cn("font-black text-lg", dk ? "text-white" : "text-slate-900")}>{u.label}</div>
              <p className={cn("text-sm leading-relaxed", dk ? "text-white/60" : "text-slate-500")}>{u.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bénéfices */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className={cn("text-2xl font-bold mb-5 text-center", dk ? "text-white" : "text-slate-900")}>Ce que ça apporte</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {benefits.map((b, i) => (
            <div key={i} className={cn(
              "flex flex-col items-center gap-3 p-5 rounded-2xl border text-center",
              dk ? "bg-white/5 border-white/10" : "bg-blue-50 border-blue-100"
            )}>
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">{b.icon}</div>
              <span className={cn("text-sm font-semibold", dk ? "text-white/80" : "text-slate-700")}>{b.text}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Équipe */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <div className="flex items-center gap-3 mb-5">
          <Users size={22} className="text-blue-500" />
          <h2 className={cn("text-2xl font-bold", dk ? "text-white" : "text-slate-900")}>L'équipe</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.map((m, i) => (
            <div key={i} className={cn(
              "flex items-center gap-4 p-4 rounded-2xl border",
              dk ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm"
            )}>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-black shrink-0">
                {m.initials}
              </div>
              <div>
                <div className={cn("font-bold text-sm", dk ? "text-white" : "text-slate-900")}>{m.name}</div>
                <div className={cn("text-xs", dk ? "text-white/50" : "text-slate-500")}>{m.school}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

/* ─── INFO PAGE ─── */
const InfoPage: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const dk = darkMode;
  const sensorParts = ["Un capteur de débit", "Une carte Arduino", "Un module de communication IoT"];
  const appFeatures = ["De visualiser la consommation d'eau", "De consulter les historiques", "D'analyser les habitudes de consommation", "De détecter les anomalies", "De suivre plusieurs installations ou bâtiments"];
  const cloudFeatures = ["La collecte des données", "Leur stockage sécurisé", "Leur analyse", "L'accès via l'interface utilisateur"];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
          <Info size={14} /> Documentation
        </div>
        <h1 className={cn("text-5xl font-black", dk ? "text-white" : "text-slate-900")}>
          Comment fonctionne <span className="text-blue-500">Cons'eau</span> ?
        </h1>
        <p className={cn("text-lg max-w-2xl mx-auto leading-relaxed", dk ? "text-white/60" : "text-slate-500")}>
          Un système de suivi et d'analyse de la consommation d'eau pour les particuliers, les entreprises et les collectivités.
        </p>
      </motion.div>

      {/* Deux éléments */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Capteur */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className={cn("rounded-3xl p-7 border", dk ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm")}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Cpu size={22} />
            </div>
            <div>
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">Élément 1</div>
              <h3 className={cn("font-bold text-lg", dk ? "text-white" : "text-slate-900")}>Le capteur connecté</h3>
            </div>
          </div>
          <p className={cn("text-sm leading-relaxed mb-4", dk ? "text-white/60" : "text-slate-500")}>
            Le dispositif est installé sur le circuit d'eau afin de mesurer le débit. Le prototype actuel utilise :
          </p>
          <ul className="space-y-2">
            {sensorParts.map((p, i) => (
              <li key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                <span className={cn("text-sm", dk ? "text-white/70" : "text-slate-600")}>{p}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* App */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
          className={cn("rounded-3xl p-7 border", dk ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm")}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
              <BarChart3 size={22} />
            </div>
            <div>
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Élément 2</div>
              <h3 className={cn("font-bold text-lg", dk ? "text-white" : "text-slate-900")}>L'application web</h3>
            </div>
          </div>
          <p className={cn("text-sm leading-relaxed mb-4", dk ? "text-white/60" : "text-slate-500")}>
            Les données collectées sont envoyées vers une plateforme accessible depuis un ordinateur ou un smartphone. L'application permet :
          </p>
          <ul className="space-y-2">
            {appFeatures.map((f, i) => (
              <li key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                <span className={cn("text-sm", dk ? "text-white/70" : "text-slate-600")}>{f}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Architecture */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className={cn("text-2xl font-bold mb-6 text-center", dk ? "text-white" : "text-slate-900")}>Architecture du système</h2>
        {/* Flow */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
          {[
            { icon: <Cpu size={20} />, label: 'Capteur', sub: 'Arduino + débit', color: 'blue' },
            { icon: <Wifi size={20} />, label: 'Transmission', sub: 'Module IoT', color: 'indigo' },
            { icon: <Cloud size={20} />, label: 'Cloud', sub: 'Stockage sécurisé', color: 'violet' },
            { icon: <BarChart3 size={20} />, label: 'Application', sub: 'Interface web', color: 'cyan' },
          ].map((step, i, arr) => (
            <React.Fragment key={i}>
              <div className={cn(
                "flex flex-col items-center gap-2 p-5 rounded-2xl border min-w-[110px] text-center",
                dk ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm"
              )}>
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center",
                  step.color === 'blue' ? "bg-blue-600/20 text-blue-400" :
                  step.color === 'indigo' ? "bg-indigo-600/20 text-indigo-400" :
                  step.color === 'violet' ? "bg-violet-600/20 text-violet-400" :
                  "bg-cyan-600/20 text-cyan-400"
                )}>{step.icon}</div>
                <div className={cn("font-bold text-sm", dk ? "text-white" : "text-slate-900")}>{step.label}</div>
                <div className={cn("text-xs", dk ? "text-white/50" : "text-slate-500")}>{step.sub}</div>
              </div>
              {i < arr.length - 1 && (
                <ArrowRight size={16} className={cn("hidden md:block shrink-0", dk ? "text-white/30" : "text-slate-300")} />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className={cn("rounded-3xl p-7 border", dk ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm")}>
          <p className={cn("mb-4 font-medium", dk ? "text-white/80" : "text-slate-700")}>
            Le système repose sur une architecture cloud qui assure :
          </p>
          <div className="grid grid-cols-2 gap-3">
            {cloudFeatures.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <Shield size={14} className="text-blue-400 shrink-0" />
                <span className={cn("text-sm", dk ? "text-white/70" : "text-slate-600")}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/* ─── FAQ PAGE ─── */
const FAQPage: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const dk = darkMode;
  const [open, setOpen] = useState<number | null>(0);
  const faqs = [
    { q: "Comment fonctionne le système ?", a: "Un capteur installé sur la canalisation mesure le débit d'eau et transmet les données à une application via internet." },
    { q: "Faut-il modifier l'installation de plomberie ?", a: "Non. Le système est conçu pour s'intégrer simplement sur une arrivée d'eau sans travaux importants." },
    { q: "Peut-on suivre la consommation en temps réel ?", a: "Oui. L'application permet de visualiser la consommation instantanée ainsi que l'historique complet." },
    { q: "Le système peut-il détecter une fuite ?", a: "Oui. Une consommation anormale peut être automatiquement détectée et signalée à l'utilisateur via une alerte." },
    { q: "Les données sont-elles sécurisées ?", a: "Les données sont stockées sur une infrastructure cloud sécurisée avec des accès strictement contrôlés." },
  ];
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 space-y-12">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-violet-600/20 text-violet-400 border border-violet-500/30">
          FAQ
        </div>
        <h1 className={cn("text-5xl font-black", dk ? "text-white" : "text-slate-900")}>Questions fréquentes</h1>
        <p className={cn("text-lg", dk ? "text-white/60" : "text-slate-500")}>Tout ce que vous devez savoir sur Cons'eau</p>
      </motion.div>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={cn("rounded-2xl border overflow-hidden", dk ? "border-white/10" : "border-slate-200")}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className={cn(
                "w-full flex items-center justify-between p-5 text-left transition-colors",
                dk ? (open === i ? "bg-blue-600/20" : "bg-white/5 hover:bg-white/10") : (open === i ? "bg-blue-50" : "bg-white hover:bg-slate-50")
              )}
            >
              <span className={cn("font-semibold pr-4", dk ? "text-white" : "text-slate-900")}>{faq.q}</span>
              <span className={cn("shrink-0", dk ? "text-white/40" : "text-slate-400")}>
                {open === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </span>
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn("px-5 overflow-hidden", dk ? "bg-white/5" : "bg-white")}
                >
                  <p className={cn("py-4 leading-relaxed", dk ? "text-white/70" : "text-slate-600")}>{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ─── À PROPOS PAGE ─── */
const AProposPage: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const dk = darkMode;
  const skills = ["Mécanique", "Informatique", "Systèmes embarqués", "Analyse de données"];
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
          <Users size={14} /> À propos
        </div>
        <h1 className={cn("text-5xl font-black", dk ? "text-white" : "text-slate-900")}>
          Le projet <span className="text-blue-500">Cons'eau</span>
        </h1>
      </motion.div>

      {/* Mission */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className={cn("rounded-3xl p-8 border", dk ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm")}>
        <h2 className={cn("text-xl font-bold mb-3", dk ? "text-white" : "text-slate-900")}>Notre mission</h2>
        <p className={cn("leading-relaxed mb-3", dk ? "text-white/70" : "text-slate-600")}>
          Cons'eau est un projet d'innovation développé dans le cadre d'un travail d'ingénierie autour de la gestion durable de l'eau.
          La solution vise à aider les particuliers, les entreprises et les collectivités à mieux comprendre et maîtriser leur consommation d'eau.
        </p>
        <p className={cn("font-medium mb-3", dk ? "text-white/80" : "text-slate-700")}>En rendant les données accessibles et analysables, Cons'eau permet :</p>
        <div className="grid md:grid-cols-3 gap-3">
          {["De réduire le gaspillage d'eau", "D'améliorer l'efficacité des installations", "De contribuer à une gestion plus durable des ressources"].map((item, i) => (
            <div key={i} className={cn("flex items-start gap-2 p-3 rounded-xl", dk ? "bg-white/5" : "bg-blue-50")}>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
              <span className={cn("text-sm", dk ? "text-white/70" : "text-slate-600")}>{item}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Nos utilisateurs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <h2 className={cn("text-2xl font-bold mb-5 text-center", dk ? "text-white" : "text-slate-900")}>Nos utilisateurs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '🏠', label: 'Particuliers', desc: 'Suivi de la consommation domestique et réduction de la facture.' },
            { icon: '🏢', label: 'Professionnels', desc: 'Optimisation de la consommation d\'eau dans les entreprises.' },
            { icon: '🏛️', label: 'Collectivités', desc: 'Gestion et surveillance des bâtiments publics.' },
          ].map((u, i) => (
            <div key={i} className={cn(
              "p-6 rounded-3xl border text-center space-y-3",
              dk ? "bg-white/5 border-white/10" : "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100"
            )}>
              <div className="text-4xl">{u.icon}</div>
              <div className={cn("font-black text-lg", dk ? "text-white" : "text-slate-900")}>{u.label}</div>
              <p className={cn("text-sm", dk ? "text-white/60" : "text-slate-500")}>{u.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Équipe */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className={cn("text-2xl font-bold mb-6 text-center", dk ? "text-white" : "text-slate-900")}>L'équipe</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {team.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}
              className={cn(
                "flex items-center gap-4 p-5 rounded-2xl border",
                dk ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white border-slate-200 shadow-sm hover:border-blue-200"
              )}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-black shrink-0">
                {m.initials}
              </div>
              <div>
                <div className={cn("font-bold", dk ? "text-white" : "text-slate-900")}>{m.name}</div>
                <div className={cn("text-xs mt-0.5", dk ? "text-white/50" : "text-slate-500")}>{m.school}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Compétences */}
        <div className={cn("rounded-3xl p-7 border", dk ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm")}>
          <h3 className={cn("font-bold mb-4", dk ? "text-white" : "text-slate-900")}>Compétences combinées</h3>
          <div className="flex flex-wrap gap-3">
            {skills.map((s, i) => (
              <span key={i} className={cn(
                "px-4 py-2 rounded-xl text-sm font-semibold",
                dk ? "bg-blue-600/20 text-blue-300 border border-blue-500/30" : "bg-blue-50 text-blue-700 border border-blue-200"
              )}>{s}</span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/* ─── LANDING PAGE ─── */
const LandingPage: React.FC<LandingPageProps> = ({ onEnter, darkMode, onToggleDarkMode }) => {
  const [page, setPage] = useState<Page>('home');
  const dk = darkMode;

  const navLinks: { label: string; page: Page }[] = [
    { label: 'Accueil', page: 'home' },
    { label: 'Campagne', page: 'campagne' },
    { label: 'Info', page: 'info' },
    { label: 'FAQ', page: 'faq' },
    { label: 'À propos', page: 'apropos' },
  ];

  return (
    <div className={cn(
      "min-h-screen flex flex-col font-sans overflow-y-auto transition-colors duration-700",
      dk ? "bg-[#050A18] dark" : "bg-slate-50",
    )}>
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {dk ? (
          <>
            <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[100px]" />
          </>
        ) : (
          <>
            <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-400/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-400/15 rounded-full blur-[100px]" />
          </>
        )}
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 px-8 py-5 flex items-center justify-between backdrop-blur-xl border-b"
        style={{ background: dk ? 'rgba(5,10,24,0.8)' : 'rgba(248,250,252,0.8)', borderColor: dk ? 'rgba(255,255,255,0.08)' : 'rgba(226,232,240,0.8)' }}>
        <button onClick={() => setPage('home')} className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 backdrop-blur-md rounded-xl flex items-center justify-center",
            dk ? "bg-white/20 border border-white/30" : "bg-blue-600 border border-blue-700"
          )}>
            <Droplets className="text-white" size={22} />
          </div>
          <span className={cn("text-2xl font-bold tracking-tight", dk ? "text-white" : "text-slate-900")}>
            Cons'eau
          </span>
        </button>

        <div className={cn("hidden md:flex items-center gap-1 font-medium", dk ? "text-white/80" : "text-slate-600")}>
          {navLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => setPage(link.page)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                page === link.page
                  ? dk ? "bg-white/15 text-white" : "bg-blue-600 text-white"
                  : dk ? "hover:bg-white/10 hover:text-white" : "hover:bg-slate-200 hover:text-slate-900"
              )}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={onToggleDarkMode}
            className={cn(
              "ml-2 p-2 rounded-xl backdrop-blur-md transition-all",
              dk ? "bg-white/10 border border-white/20 text-white hover:bg-white/20" : "bg-slate-200 border border-slate-300 text-slate-600 hover:bg-slate-300"
            )}
          >
            {dk ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          {page === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              className="flex flex-col lg:flex-row items-center justify-center px-8 lg:px-24 gap-12 min-h-[calc(100vh-140px)]">
              <div className="flex-1 text-center lg:text-left z-10">
                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                  <div className="flex items-center gap-2 mb-6 justify-center lg:justify-start">
                    <div className={cn("w-1.5 h-1.5 rounded-full", dk ? "bg-white" : "bg-blue-500")} />
                    <div className={cn("w-1.5 h-1.5 rounded-full opacity-50", dk ? "bg-white" : "bg-blue-400")} />
                    <div className={cn("w-1.5 h-1.5 rounded-full opacity-25", dk ? "bg-white" : "bg-blue-300")} />
                  </div>
                  <h1 className={cn("text-6xl lg:text-8xl font-black mb-8 leading-tight tracking-tighter", dk ? "text-white" : "text-slate-900")}>
                    PRÉSERVEZ<br />VOTRE EAU
                  </h1>
                  <p className={cn("text-lg max-w-xl mb-12 leading-relaxed font-medium", dk ? "text-white/80" : "text-slate-600")}>
                    Prenez le contrôle de votre consommation hydrique avec notre technologie IoT de pointe. Économisez de l'argent, sauvez la planète, goutte après goutte.
                  </p>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                    <button
                      onClick={() => onEnter()}
                      className="px-10 py-5 bg-blue-600 text-white font-bold rounded-2xl shadow-2xl hover:scale-105 transition-transform flex items-center gap-3"
                    >
                      Commencer <ArrowRight size={20} />
                    </button>
                    <button
                      onClick={() => setPage('campagne')}
                      className={cn(
                        "px-10 py-5 backdrop-blur-xl font-bold rounded-2xl transition-all",
                        dk ? "bg-white/10 border border-white/20 text-white hover:bg-white/20" : "bg-white border border-slate-300 text-slate-900 hover:bg-slate-50 hover:border-blue-300"
                      )}
                    >
                      En savoir plus
                    </button>
                  </div>
                </motion.div>
              </div>

              <div className="flex-1 relative z-10 flex justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="relative w-full max-w-lg aspect-square"
                >
                  <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-2xl">
                    <defs>
                      <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fff" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#fff" stopOpacity="0.1" />
                      </linearGradient>
                      <linearGradient id="waterGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                    <motion.circle cx="250" cy="250" r="200"
                      fill={dk ? "url(#waterGrad)" : "url(#waterGradLight)"}
                      stroke={dk ? "rgba(255,255,255,0.2)" : "rgba(37,99,235,0.3)"} strokeWidth="2"
                      animate={{ r: [200, 210, 200] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
                    <motion.path d="M250 100 C250 100 150 250 150 330 C150 385 195 430 250 430 C305 430 350 385 350 330 C350 250 250 100 250 100 Z"
                      fill={dk ? "white" : "#2563eb"}
                      initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} />
                    {[...Array(5)].map((_, i) => (
                      <motion.circle key={i}
                        cx={150 + (i * 47) % 200} cy={350 + (i * 31) % 100} r={5 + (i * 3) % 10}
                        fill={dk ? "white" : "#93c5fd"} opacity="0.4"
                        animate={{ y: [0, -100 - (i * 37) % 100], opacity: [0.4, 0], scale: [1, 1.5] }}
                        transition={{ duration: 3 + (i * 0.7), repeat: Infinity, delay: i * 0.4, ease: "easeOut" }} />
                    ))}
                  </svg>
                  <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className={cn("absolute -top-4 -right-4 w-24 h-24 backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-2xl",
                      dk ? "bg-white/20 border border-white/30" : "bg-blue-50 border border-blue-200 shadow-blue-100")}>
                    <Droplets className={dk ? "text-white" : "text-blue-600"} size={40} />
                  </motion.div>
                  <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className={cn("absolute -bottom-4 -left-4 w-32 h-32 backdrop-blur-xl rounded-[40px] flex flex-col items-center justify-center shadow-2xl p-4",
                      dk ? "bg-white/20 border border-white/30" : "bg-white border border-blue-200 shadow-blue-100")}>
                    <Activity className={cn("mb-2", dk ? "text-white" : "text-blue-600")} size={32} />
                    <div className={cn("w-full h-1.5 rounded-full overflow-hidden", dk ? "bg-white/20" : "bg-blue-100")}>
                      <motion.div className={cn("h-full", dk ? "bg-white" : "bg-blue-500")}
                        animate={{ width: ["20%", "80%", "40%", "90%"] }} transition={{ duration: 4, repeat: Infinity }} />
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {page === 'campagne' && (
            <motion.div key="campagne" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <CampagnePage darkMode={darkMode} />
            </motion.div>
          )}
          {page === 'info' && (
            <motion.div key="info" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <InfoPage darkMode={darkMode} />
            </motion.div>
          )}
          {page === 'faq' && (
            <motion.div key="faq" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <FAQPage darkMode={darkMode} />
            </motion.div>
          )}
          {page === 'apropos' && (
            <motion.div key="apropos" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <AProposPage darkMode={darkMode} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className={cn("px-8 py-6 flex items-center justify-between relative z-10 border-t",
        dk ? "border-white/10" : "border-slate-200")}>
        <div className={cn("flex items-center gap-4", dk ? "text-white/40" : "text-slate-400")}>
          {navLinks.filter(l => l.page !== 'home').map((link) => (
            <button key={link.page} onClick={() => setPage(link.page)}
              className={cn("text-xs font-medium transition-colors",
                dk ? "hover:text-white/70" : "hover:text-slate-600")}>
              {link.label}
            </button>
          ))}
        </div>
        <span className={cn("font-bold tracking-[0.3em] text-xs opacity-60", dk ? "text-white" : "text-slate-600")}>
          CONSEAU • 2026
        </span>
      </footer>
    </div>
  );
};

export default LandingPage;
