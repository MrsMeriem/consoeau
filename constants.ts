
import { RAW_JSON_STRING } from './data/sensor_input.json.ts';
import { DAILY_SCENARIO } from './data/simulation_data';

export { RAW_JSON_STRING, DAILY_SCENARIO };

export const WATER_PRICE_PER_M3 = 4.34;
export const WATER_PRICE_PER_L = WATER_PRICE_PER_M3 / 1000;

export const EQUIPMENT_LABELS: Record<string, string> = {
  "douche": "Douche",
  "wc": "WC",
  "cuisine": "Cuisine",
  "lave_vaisselle": "Lave-vaisselle",
  "lave_linge": "Lave-linge",
  "jardin": "Jardin",
  "autre": "Autre"
};
