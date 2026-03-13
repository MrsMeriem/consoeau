
export type EquipmentType = "wc" | "douche" | "cuisine" | "lave_vaisselle" | "lave_linge" | "jardin" | "autre";

export type AccountType = "particulier" | "pro" | "collectivite" | "testeur" | "entreprise" | "agriculteur";

export interface UserProfile {
  name: string;
  email: string;
  accountType: AccountType;
  role: 'Admin' | 'Utilisateur';
  createdAt: string;
  isActivated: boolean;
  companyName?: string;
  headOffice?: string;
}

export interface Measurement {
  device_id: string;
  type_equipement: EquipmentType;
  volume_l: number;
  debit_l_min: number;
  timestamp: string;
}

export interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  title: string;
  message: string;
  time: string;
  date: string;
  isRead: boolean;
  device?: string;
  vol?: number;
}

export type Period = '1MN' | '1H' | '1J' | '3J' | '1S';

export interface AIAnalysis {
  status: string;
  message: string;
  sensibilisation: string;
  biggestConsumer: string;
  economyTip: string;
}

export interface SensorStatus {
  id: string;
  name: string;
  type: EquipmentType;
  zone: string;
  status: 'active' | 'inactive' | 'error';
  battery?: number;
  customThreshold?: number;
  alertsEnabled: boolean;
}
