import { Measurement, SensorStatus } from '../types';

function rand(min: number, max: number, dec = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(dec));
}

function pastDates(n: number): string[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    return d.toISOString().split('T')[0];
  });
}

type DeviceCfg = {
  id: string;
  type: string;
  minVol: number;
  maxVol: number;
  minDebit: number;
  maxDebit: number;
  usagesPerDay: number;
};

function buildMeasurements(devices: DeviceCfg[], days = 3): Measurement[] {
  const dates = pastDates(days);
  const result: Measurement[] = [];
  dates.forEach(date => {
    devices.forEach(dev => {
      const n = Math.max(0, Math.round(dev.usagesPerDay + rand(-1, 1, 0)));
      for (let u = 0; u < n; u++) {
        const h = String(Math.floor(rand(5, 23, 0))).padStart(2, '0');
        const m = String(Math.floor(rand(0, 59, 0))).padStart(2, '0');
        result.push({
          device_id: dev.id,
          type_equipement: dev.type as Measurement['type_equipement'],
          volume_l: rand(dev.minVol, dev.maxVol),
          debit_l_min: rand(dev.minDebit, dev.maxDebit),
          timestamp: `${date}T${h}:${m}:00`,
        });
      }
    });
  });
  return result.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

// ─── PARTICULIER (maison) ────────────────────────────────────
export const particulierMeasurements = (): Measurement[] => buildMeasurements([
  { id: 'douche_01',    type: 'douche',        minVol: 50,  maxVol: 85,  minDebit: 7,  maxDebit: 10, usagesPerDay: 2 },
  { id: 'wc_01',        type: 'wc',            minVol: 6,   maxVol: 10,  minDebit: 2,  maxDebit: 4,  usagesPerDay: 8 },
  { id: 'cuisine_01',   type: 'cuisine',       minVol: 3,   maxVol: 12,  minDebit: 3,  maxDebit: 6,  usagesPerDay: 6 },
  { id: 'jardin_01',    type: 'jardin',        minVol: 60,  maxVol: 120, minDebit: 8,  maxDebit: 14, usagesPerDay: 1 },
  { id: 'lave_linge_01',type: 'lave_linge',    minVol: 55,  maxVol: 75,  minDebit: 5,  maxDebit: 8,  usagesPerDay: 1 },
]);

export const particulierSensors = (): SensorStatus[] => [
  { id: 'douche_01',    name: 'Douche Principale',       type: 'douche',     zone: 'Salle de bain', status: 'active', battery: 91, alertsEnabled: true },
  { id: 'wc_01',        name: 'WC Rez-de-chaussée',      type: 'wc',         zone: 'Toilettes',     status: 'active', battery: 85, alertsEnabled: true },
  { id: 'cuisine_01',   name: 'Évier Cuisine',           type: 'cuisine',    zone: 'Cuisine',       status: 'active', battery: 78, alertsEnabled: false },
  { id: 'jardin_01',    name: 'Arrosage Automatique',    type: 'jardin',     zone: 'Extérieur',     status: 'active', battery: 64, alertsEnabled: true },
  { id: 'lave_linge_01',name: 'Lave-linge Buanderie',    type: 'lave_linge', zone: 'Buanderie',     status: 'active', battery: 72, alertsEnabled: false },
];

// ─── PRO (bâtiment bureau) ───────────────────────────────────
export const proMeasurements = (): Measurement[] => buildMeasurements([
  { id: 'sanitaires_RDC',  type: 'wc',          minVol: 8,   maxVol: 11,  minDebit: 3,  maxDebit: 5,  usagesPerDay: 22 },
  { id: 'sanitaires_1er',  type: 'wc',          minVol: 8,   maxVol: 11,  minDebit: 3,  maxDebit: 5,  usagesPerDay: 18 },
  { id: 'cafeteria_01',    type: 'cuisine',     minVol: 6,   maxVol: 14,  minDebit: 4,  maxDebit: 7,  usagesPerDay: 14 },
  { id: 'nettoyage_01',    type: 'autre',       minVol: 15,  maxVol: 30,  minDebit: 3,  maxDebit: 6,  usagesPerDay: 3 },
  { id: 'jardin_pro_01',   type: 'jardin',      minVol: 100, maxVol: 200, minDebit: 10, maxDebit: 16, usagesPerDay: 1 },
  { id: 'lave_vaisselle_01',type:'lave_vaisselle',minVol: 14, maxVol: 20, minDebit: 4,  maxDebit: 6,  usagesPerDay: 4 },
]);

export const proSensors = (): SensorStatus[] => [
  { id: 'sanitaires_RDC',  name: 'Sanitaires RDC',       type: 'wc',           zone: 'Rez-de-chaussée', status: 'active', battery: 88, alertsEnabled: true },
  { id: 'sanitaires_1er',  name: 'Sanitaires 1er étage', type: 'wc',           zone: '1er étage',       status: 'active', battery: 82, alertsEnabled: true },
  { id: 'cafeteria_01',    name: 'Cafétéria',             type: 'cuisine',      zone: 'Cafétéria',       status: 'active', battery: 75, alertsEnabled: false },
  { id: 'nettoyage_01',    name: 'Local Nettoyage',       type: 'autre',        zone: 'Local technique', status: 'active', battery: 61, alertsEnabled: false },
  { id: 'jardin_pro_01',   name: 'Arrosage Espaces Verts',type: 'jardin',      zone: 'Extérieur',       status: 'active', battery: 70, alertsEnabled: true },
  { id: 'lave_vaisselle_01',name:'Lave-vaisselle Cantine',type: 'lave_vaisselle',zone:'Cuisine pro',    status: 'active', battery: 90, alertsEnabled: false },
];

// ─── COLLECTIVITÉ (municipal) ────────────────────────────────
export const collectiviteMeasurements = (): Measurement[] => buildMeasurements([
  { id: 'parc_nord',    type: 'jardin',     minVol: 600,  maxVol: 1200, minDebit: 18, maxDebit: 28, usagesPerDay: 2 },
  { id: 'parc_sud',     type: 'jardin',     minVol: 500,  maxVol: 1000, minDebit: 15, maxDebit: 24, usagesPerDay: 2 },
  { id: 'batiment_A',   type: 'wc',         minVol: 9,    maxVol: 12,   minDebit: 3,  maxDebit: 5,  usagesPerDay: 45 },
  { id: 'batiment_B',   type: 'cuisine',    minVol: 10,   maxVol: 18,   minDebit: 5,  maxDebit: 8,  usagesPerDay: 20 },
  { id: 'fontaine_01',  type: 'autre',      minVol: 150,  maxVol: 300,  minDebit: 6,  maxDebit: 10, usagesPerDay: 4 },
  { id: 'piscine_01',   type: 'lave_vaisselle', minVol: 400, maxVol: 800, minDebit: 12, maxDebit: 20, usagesPerDay: 1 },
]);

export const collectiviteSensors = (): SensorStatus[] => [
  { id: 'parc_nord',   name: 'Arrosage Parc Nord',       type: 'jardin',       zone: 'Espaces verts',   status: 'active', battery: 76, alertsEnabled: true },
  { id: 'parc_sud',    name: 'Arrosage Parc Sud',        type: 'jardin',       zone: 'Espaces verts',   status: 'active', battery: 68, alertsEnabled: true },
  { id: 'batiment_A',  name: 'Sanitaires Bâtiment A',    type: 'wc',           zone: 'Bâtiment A',      status: 'active', battery: 89, alertsEnabled: true },
  { id: 'batiment_B',  name: 'Cuisine Bâtiment B',       type: 'cuisine',      zone: 'Bâtiment B',      status: 'active', battery: 82, alertsEnabled: false },
  { id: 'fontaine_01', name: 'Fontaine Centrale',        type: 'autre',        zone: 'Place publique',  status: 'active', battery: 55, alertsEnabled: true },
  { id: 'piscine_01',  name: 'Bassin Municipal',         type: 'lave_vaisselle',zone:'Complexe sportif', status: 'warning',battery: 40, alertsEnabled: true },
];
