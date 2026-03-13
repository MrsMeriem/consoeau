
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Measurement, Alert, Period, EquipmentType, SensorStatus, SensorPair } from '../types';
import { RAW_JSON_STRING } from '../constants';
import {
  particulierMeasurements, particulierSensors,
  proMeasurements, proSensors,
  collectiviteMeasurements, collectiviteSensors,
} from '../data/profileSimulations';

interface WaterContextType {
  measurements: Measurement[];
  alerts: Alert[];
  sensors: SensorStatus[];
  threshold: number;
  equipmentThresholds: Record<EquipmentType, number>;
  period: Period;
  selectedEquipment: string;
  setPeriod: (p: Period) => void;
  setThreshold: (t: number) => void;
  setEquipmentThreshold: (type: EquipmentType, t: number) => void;
  setSelectedEquipment: (e: string) => void;
  addMeasurement: (m: Measurement) => void;
  addSensor: (s: SensorStatus) => void;
  updateSensor: (id: string, updates: Partial<SensorStatus>) => void;
  markAlertRead: (id: string) => void;
  clearAlerts: () => void;
  resetSystem: () => void;
  sensorPairs: SensorPair[];
  addSensorPair: (pair: SensorPair) => void;
  removeSensorPair: (id: string) => void;
}

const DEFAULT_EQ_THRESHOLDS: Record<EquipmentType, number> = {
  jardin: 150,
  wc: 30,
  douche: 100,
  cuisine: 50,
  lave_vaisselle: 20,
  lave_linge: 80,
  autre: 20
};

const WaterContext = createContext<WaterContextType | undefined>(undefined);

export const WaterProvider: React.FC<{ children: React.ReactNode; accountType?: string }> = ({ children, accountType = 'particulier' }) => {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [sensors, setSensors] = useState<SensorStatus[]>([]);
  const [threshold, setThresholdState] = useState(300);
  const thresholdRef = useRef(300);
  const [equipmentThresholds, setEquipmentThresholds] = useState<Record<EquipmentType, number>>(DEFAULT_EQ_THRESHOLDS);
  const [period, setPeriod] = useState<Period>('3J');
  const [sensorPairs, setSensorPairs] = useState<SensorPair[]>(() => {
    try { const s = localStorage.getItem('water_sensor_pairs'); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const [selectedEquipment, setSelectedEquipment] = useState('all');

  // Load initial data — profile-specific
  useEffect(() => {
    const savedThreshold = localStorage.getItem('water_threshold');
    if (savedThreshold) { const v = parseInt(savedThreshold); setThresholdState(v); thresholdRef.current = v; }

    const savedEqT = localStorage.getItem('water_eq_thresholds');
    if (savedEqT) setEquipmentThresholds(JSON.parse(savedEqT));

    // If profile changed, wipe stored data and reload fresh simulation
    const storedProfile = localStorage.getItem('water_profile');
    const profileChanged = storedProfile !== accountType;
    if (profileChanged) {
      localStorage.removeItem('water_measurements');
      localStorage.removeItem('water_sensors');
      localStorage.removeItem('water_alerts');
      localStorage.setItem('water_profile', accountType);
    }

    // Testeur: no static data, CSV polling handles everything
    if (accountType === 'testeur') {
      setSensors([{
        id: 'equipement_test',
        name: 'Équipement Test',
        type: 'autre',
        zone: 'Arduino',
        status: 'active',
        battery: 100,
        alertsEnabled: true,
      }]);
      setMeasurements([]);
      return;
    }

    // Pick profile data
    let initialMeasurements: Measurement[] = [];
    let initialSensors: SensorStatus[] = [];
    if (accountType === 'pro') {
      initialMeasurements = proMeasurements();
      initialSensors = proSensors();
    } else if (accountType === 'collectivite') {
      initialMeasurements = collectiviteMeasurements();
      initialSensors = collectiviteSensors();
    } else {
      initialMeasurements = particulierMeasurements();
      initialSensors = particulierSensors();
    }

    if (!profileChanged) {
      try {
        const saved = localStorage.getItem('water_measurements');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) initialMeasurements = parsed;
        }
        const savedS = localStorage.getItem('water_sensors');
        if (savedS) {
          const parsedS = JSON.parse(savedS);
          if (Array.isArray(parsedS) && parsedS.length > 0) initialSensors = parsedS;
        }
      } catch { /* keep generated data */ }
    }

    setMeasurements(initialMeasurements);
    setSensors(initialSensors);

    const SIM_ALERTS_INIT: Alert[] = [
      { id: 'sim-1', type: 'danger', title: 'Fuite suspectée — Douche', message: 'Débit continu détecté pendant 47 min sans interruption. Possible fuite au niveau du robinet.', time: '08:14', date: new Date().toISOString().split('T')[0], isRead: false, device: 'DEVICE-DOUCHE', vol: 32 },
      { id: 'sim-2', type: 'warning', title: 'Seuil dépassé — Jardin', message: "Consommation cumulée a dépassé le seuil de 80 L fixé pour l'arrosage automatique.", time: '11:02', date: new Date().toISOString().split('T')[0], isRead: false, device: 'DEVICE-JARDIN', vol: 94 },
      { id: 'sim-3', type: 'info', title: 'Pic de consommation — WC', message: '3 déclenchements en 10 minutes. Consommation inhabituelle pour la période.', time: '14:37', date: new Date().toISOString().split('T')[0], isRead: false, device: 'DEVICE-WC', vol: 18 },
    ];
    const savedAlerts = localStorage.getItem('water_alerts');
    if (savedAlerts && !profileChanged) {
      const parsed: Alert[] = JSON.parse(savedAlerts);
      // Merge: keep sim alerts if not already present
      const existing = parsed.map(a => a.id);
      const toAdd = SIM_ALERTS_INIT.filter(a => !existing.includes(a.id));
      setAlerts([...toAdd, ...parsed]);
    } else {
      setAlerts(SIM_ALERTS_INIT);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountType]);

  // Testeur: poll CSV every 2s
  useEffect(() => {
    if (accountType !== 'testeur') return;
    let lastCount = 0;
    const poll = async () => {
      try {
        const res = await fetch('/water-local/measurements.json');
        if (!res.ok) return;
        const data: Measurement[] = await res.json();
        if (data.length !== lastCount) {
          lastCount = data.length;
          setMeasurements(data);
          setSensors(prev => prev.map(s =>
            s.id === 'equipement_test' ? { ...s, status: 'active' } : s
          ));

          // Check threshold alerts on new data
          const today = new Date().toISOString().split('T')[0];
          const dayTotal = data
            .filter(m => m.timestamp.startsWith(today))
            .reduce((acc, m) => acc + m.volume_l, 0);

          if (dayTotal > thresholdRef.current) {
            setAlerts(prev => {
              const alreadyAlerted = prev.some(a => a.type === 'warning' && a.date === today && a.title === 'Seuil Journalier Dépassé');
              if (alreadyAlerted) return prev;
              return [{
                id: Math.random().toString(36).substr(2, 9),
                type: 'warning',
                title: 'Seuil Journalier Dépassé',
                message: `Consommation de ${Math.round(dayTotal)}L supérieure au seuil global (${thresholdRef.current}L).`,
                time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                date: today,
                isRead: false,
              }, ...prev];
            });
          }
        }
      } catch { /* offline */ }
    };
    poll();
    const t = setInterval(poll, 2000);
    return () => clearInterval(t);
  }, [accountType]);

  // Check threshold alerts whenever threshold, equipmentThresholds or measurements change
  useEffect(() => {
    if (measurements.length === 0) return;
    const today = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    setAlerts(prev => {
      let updated = [...prev];

      // Global daily threshold
      const dayTotal = measurements
        .filter(m => m.timestamp.startsWith(today))
        .reduce((acc, m) => acc + m.volume_l, 0);
      if (dayTotal > threshold) {
        const alreadyAlerted = updated.some(a => a.date === today && a.title === 'Seuil Journalier Dépassé');
        if (!alreadyAlerted) {
          updated = [{ id: Math.random().toString(36).substr(2, 9), type: 'warning', title: 'Seuil Journalier Dépassé', message: `Consommation de ${Math.round(dayTotal)}L supérieure au seuil global (${threshold}L).`, time, date: today, isRead: false }, ...updated];
        }
      }

      // Per-equipment threshold
      sensors.forEach(sensor => {
        const eqThreshold = sensor.customThreshold ?? equipmentThresholds[sensor.type] ?? 0;
        if (eqThreshold <= 0) return;
        const sensorDayTotal = measurements
          .filter(m => m.device_id === sensor.id && m.timestamp.startsWith(today))
          .reduce((acc, m) => acc + m.volume_l, 0);
        if (sensorDayTotal > eqThreshold) {
          const alertTitle = `Seuil Dépassé — ${sensor.name}`;
          if (!updated.some(a => a.date === today && a.title === alertTitle)) {
            updated = [{ id: Math.random().toString(36).substr(2, 9), type: 'warning', title: alertTitle, message: `Consommation de ${Math.round(sensorDayTotal)}L sur "${sensor.name}" dépasse le seuil de ${eqThreshold}L.`, time, date: today, isRead: false }, ...updated];
          }
        }
      });

      return updated;
    });
  }, [threshold, equipmentThresholds, measurements, sensors]);

  // Check leak alerts for sensor pairs
  useEffect(() => {
    if (sensorPairs.length === 0 || measurements.length === 0) return;
    const today = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    setAlerts(prev => {
      let updated = [...prev];
      sensorPairs.forEach(pair => {
        const amontTotal = measurements
          .filter(m => m.device_id === pair.amontId && m.timestamp.startsWith(today))
          .reduce((acc, m) => acc + m.volume_l, 0);
        const avalTotal = measurements
          .filter(m => m.device_id === pair.avalId && m.timestamp.startsWith(today))
          .reduce((acc, m) => acc + m.volume_l, 0);
        const diff = Math.max(0, amontTotal - avalTotal);
        if (amontTotal > 0 && diff > pair.tolerance) {
          const alertTitle = `Fuite détectée — ${pair.name}`;
          if (!updated.some(a => a.date === today && a.title === alertTitle)) {
            const amontSensor = sensors.find(s => s.id === pair.amontId);
            const avalSensor = sensors.find(s => s.id === pair.avalId);
            updated = [{
              id: Math.random().toString(36).substr(2, 9),
              type: 'danger',
              title: alertTitle,
              message: `${diff.toFixed(1)}L non comptabilisés entre "${amontSensor?.name ?? pair.amontId}" (amont: ${amontTotal.toFixed(1)}L) et "${avalSensor?.name ?? pair.avalId}" (aval: ${avalTotal.toFixed(1)}L). Tolérance: ${pair.tolerance}L.`,
              time, date: today, isRead: false,
            }, ...updated];
          }
        }
      });
      return updated;
    });
  }, [sensorPairs, measurements, sensors]);

  // Live simulation — add a measurement every 8s for non-testeur profiles
  useEffect(() => {
    if (accountType === 'testeur') return;
    const interval = setInterval(() => {
      setSensors(currentSensors => {
        if (currentSensors.length === 0) return currentSensors;
        const sensor = currentSensors[Math.floor(Math.random() * currentSensors.length)];
        const now = new Date().toISOString().split('.')[0];
        const newM: Measurement = {
          device_id: sensor.id,
          type_equipement: sensor.type,
          volume_l: parseFloat((Math.random() * 2 + 0.2).toFixed(2)),
          debit_l_min: parseFloat((Math.random() * 6 + 0.5).toFixed(2)),
          timestamp: now,
        };
        setMeasurements(prev => [...prev, newM]);
        return currentSensors;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [accountType]);

  // Persistence
  useEffect(() => {
    localStorage.setItem('water_threshold', threshold.toString());
    localStorage.setItem('water_eq_thresholds', JSON.stringify(equipmentThresholds));
    localStorage.setItem('water_alerts', JSON.stringify(alerts));
    localStorage.setItem('water_measurements', JSON.stringify(measurements));
    localStorage.setItem('water_sensors', JSON.stringify(sensors));
  }, [threshold, equipmentThresholds, alerts, measurements, sensors]);

  const setThreshold = (val: number) => { setThresholdState(val); thresholdRef.current = val; };
  const setEquipmentThreshold = (type: EquipmentType, val: number) => setEquipmentThresholds(prev => ({ ...prev, [type]: val }));

  const addSensor = (s: SensorStatus) => {
    setSensors(prev => [...prev, s]);
  };

  const updateSensor = (id: string, updates: Partial<SensorStatus>) => {
    setSensors(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const addMeasurement = useCallback((m: Measurement) => {
    setMeasurements(prev => [...prev, m]);

    const sensor = sensors.find(s => s.id === m.device_id);
    const alertsEnabled = sensor ? sensor.alertsEnabled : true;
    const customThreshold = sensor?.customThreshold;

    if (alertsEnabled) {
      if (m.debit_l_min > 0 && m.debit_l_min <= 0.5 && m.type_equipement === 'wc') {
          const newAlert: Alert = {
              id: Math.random().toString(36).substr(2, 9),
              type: 'danger',
              title: `Alerte Flux Continu`,
              message: `Débit constant détecté sur ${sensor?.name || m.device_id}. Fuite probable.`,
              time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
              date: new Date().toISOString().split('T')[0],
              isRead: false
          };
          setAlerts(prev => [newAlert, ...prev]);
      }

      if (customThreshold) {
        const today = m.timestamp.split('T')[0];
        const sensorDayTotal = [...measurements, m]
            .filter(x => x.device_id === m.device_id && x.timestamp.startsWith(today))
            .reduce((acc, curr) => acc + curr.volume_l, 0);

        if (sensorDayTotal > customThreshold) {
            const alreadyAlerted = alerts.some(a => a.title.includes(m.device_id) && a.date === today && a.title.includes('Seuil Capteur'));
            if (!alreadyAlerted) {
                setAlerts(prev => [{
                    id: Math.random().toString(36).substr(2, 9),
                    type: 'warning',
                    title: `Seuil Capteur Dépassé (${m.device_id})`,
                    message: `Consommation de ${Math.round(sensorDayTotal)}L sur ${sensor?.name || m.device_id} (Seuil: ${customThreshold}L).`,
                    time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                    date: today,
                    isRead: false
                }, ...prev]);
            }
        }
      }
    }

    const today = m.timestamp.split('T')[0];
    const dayTotal = [...measurements, m]
        .filter(x => x.timestamp.startsWith(today))
        .reduce((acc, curr) => acc + curr.volume_l, 0);

    if (dayTotal > threshold) {
        const alreadyAlerted = alerts.some(a => a.type === 'warning' && a.date === today && a.title === 'Seuil Journalier Dépassé');
        if (!alreadyAlerted) {
            const newAlert: Alert = {
                id: Math.random().toString(36).substr(2, 9),
                type: 'warning',
                title: `Seuil Journalier Dépassé`,
                message: `Consommation de ${Math.round(dayTotal)}L supérieure au seuil global (${threshold}L).`,
                time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                date: today,
                isRead: false
            };
            setAlerts(prev => [newAlert, ...prev]);
        }
    }
  }, [measurements, threshold, alerts, sensors]);

  const markAlertRead = (id: string) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
  const clearAlerts = () => setAlerts([]);
  const resetSystem = () => { localStorage.clear(); window.location.reload(); };

  const addSensorPair = (pair: SensorPair) => {
    setSensorPairs(prev => { const next = [...prev, pair]; localStorage.setItem('water_sensor_pairs', JSON.stringify(next)); return next; });
  };
  const removeSensorPair = (id: string) => {
    setSensorPairs(prev => { const next = prev.filter(p => p.id !== id); localStorage.setItem('water_sensor_pairs', JSON.stringify(next)); return next; });
  };

  return (
    <WaterContext.Provider value={{
      measurements, alerts, sensors, threshold, equipmentThresholds, period, selectedEquipment,
      setPeriod, setThreshold, setEquipmentThreshold, setSelectedEquipment, addMeasurement, addSensor, updateSensor, markAlertRead, clearAlerts, resetSystem,
      sensorPairs, addSensorPair, removeSensorPair
    }}>
      {children}
    </WaterContext.Provider>
  );
};

export const useWater = () => {
  const context = useContext(WaterContext);
  if (!context) throw new Error('useWater must be used within WaterProvider');
  return context;
};
