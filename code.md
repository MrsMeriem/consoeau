# ConsoEau — Architecture & Documentation Technique

> Portail intelligent de suivi et d'optimisation de la consommation d'eau avec analyse prédictive IA et détection de fuites.

---

## 0. Présentation Générale

### Ce que fait l'application

**ConsoEau** est un tableau de bord web complet de surveillance de consommation d'eau en temps réel, destiné à trois types d'utilisateurs (particuliers, professionnels, collectivités) et à un mode technique (testeur). Voici l'ensemble de ses fonctionnalités :

#### Suivi de consommation en temps réel
- Affichage du **volume total consommé** sur une période sélectionnable (1 minute, 1 heure, 1 jour, 3 jours, 1 semaine)
- Calcul automatique de la **consommation moyenne** (en L/s, L/h ou L/jour selon la période)
- Estimation de la **dépense en euros** à partir du tarif de l'eau (référence : 4,34 €/m³ ou tarif personnalisé)
- **Graphique d'historique** (area chart) de la consommation dans le temps
- **Graphique de répartition** (donut chart) de la consommation par équipement
- Suivi de l'**objectif journalier** avec barre de progression colorée (bleue → rouge si >90%)
- **Filtre par équipement** : possibilité de n'afficher que les données d'un capteur spécifique

#### Gestion des capteurs IoT
- Liste de tous les **capteurs enregistrés** avec statut en temps réel (actif / déconnecté), niveau de batterie, zone, dernière activité, volume total
- **Fiche détaillée** par capteur (volume, batterie, dernier signal) au clic
- **Seuil d'alerte personnalisé** par capteur (en L/jour) configurable directement dans l'interface
- **Toggle activation des alertes** par capteur (activer / silencieux)
- **Ajout de nouveaux capteurs** via un wizard 3 étapes (type d'équipement → nom/zone → confirmation), avec génération automatique d'un identifiant `SENSOR-XXXX`
- Vue réseau IoT avec statut de la passerelle, charge réseau, dernier scan

#### Système d'alertes intelligent
- **Génération automatique d'alertes** en fonction de 3 conditions :
  - Débit continu entre 0 et 0,5 L/min sur un WC → **DANGER** "Fuite probable"
  - Volume journalier d'un capteur dépasse son seuil personnalisé → **WARNING** "Seuil capteur dépassé"
  - Volume journalier global dépasse le seuil global → **WARNING** "Seuil journalier dépassé"
- **3 alertes de simulation** pré-chargées au démarrage (fuite douche, seuil jardin, pic WC)
- Gestion lecture/non-lu par alerte, compteur badge en temps réel dans la navigation
- **Suppression globale** de toutes les alertes

#### Analytics avancées
- **Tableau détaillé** par capteur : nombre d'usages, volume total, débit moyen, seuil configuré, coût estimé, part en %
- Indicateur visuel seuil dépassé (rouge) ou normal (vert)
- **Bar chart empilé** par équipement et par jour
- Mêmes périodes de filtrage que le dashboard (1MN / 1H / 1J / 3J / 1S)

#### Analyse IA avec Google Gemini
- Appel à l'**API Google Gemini** (`gemini-3-flash-preview`) à la demande
- Sélection du périmètre d'analyse (global ou équipement spécifique)
- Résultats structurés : **statut global**, **message de sensibilisation**, **plus gros consommateur**, **conseil d'économie personnalisé**
- Comparaison automatique à la norme OMS de 150 L/personne/jour
- Détection de fuites probables (débit faible constant)

#### Gestion des comptes et profils
- **4 profils utilisateurs** : Particulier, Professionnel, Collectivité, Testeur
- Inscription en 3 étapes avec code d'activation
- Connexion rapide par sélection de profil (démo : admin/admin)
- Profil affiché dans la navigation avec bouton déconnexion
- **Reset complet** du système (efface le localStorage et recharge)

#### Mode Testeur (ingestion de données réelles)
- Polling toutes les **2 secondes** d'un fichier CSV externe (`water_data.csv`)
- Mise à jour en temps réel des mesures et capteurs
- Conçu pour connecter de **vraies données Arduino/capteurs physiques** via un fichier CSV produit par un backend

#### Interface et UX
- **Dark mode** (toggle depuis la landing page, persisté)
- Navigation latérale (Sidebar) avec badge d'alertes non-lues
- Design responsive (mobile → desktop)
- Landing page marketing avec présentation de l'équipe et des fonctionnalités

---

### D'où viennent les données

L'application utilise **4 sources de données** selon le contexte :

#### 1. Simulation générée (profils Particulier / Pro / Collectivité)
- **Fichier source :** `data/profileSimulations.ts`
- Au démarrage, l'application génère un ensemble de mesures historiques réalistes selon le type de compte :
  - **Particulier** : Douche, WC, Cuisine, Jardin, Lave-linge (3–120 L, 0,5–14 L/min, 2–8 usages/jour)
  - **Pro** : Sanitaires, Cafétéria, Nettoyage, Jardin, Lave-vaisselle (6–200 L, 3–16 L/min, 3–22 usages/jour)
  - **Collectivité** : Parcs, Bâtiments, Fontaine, Piscine (9–1200 L, 3–28 L/min, 1–45 usages/jour)
- Ces données couvrent les 7 derniers jours avec des timestamps réalistes

#### 2. Simulation live (toutes les 8 secondes)
- **Fichier source :** `store/WaterContext.tsx` (intervalle `setInterval`)
- Un capteur aléatoire est sélectionné toutes les 8 secondes
- Une nouvelle mesure est générée (volume 0,2–2,2 L, débit 0,5–6,5 L/min)
- Ajoutée au tableau de mesures → re-render des graphiques en temps réel
- Déclenche la vérification des seuils d'alerte à chaque ajout

#### 3. CSV externe (mode Testeur uniquement)
- **Fichier source :** `../water-test-data/water_data.csv` (dossier externe au projet)
- **Format attendu :** `device_id;timestamp;debit;total` (séparateur `;`)
- **Mécanisme :** Middleware Vite intercepte `GET /water-local/measurements.json`, lit le CSV, le parse et retourne un JSON de mesures
- Polling toutes les 2 secondes par le WaterContext en mode testeur
- Conçu pour recevoir des données d'un **vrai capteur Arduino** ou d'un backend Python/Node

#### 4. Persistance localStorage (entre sessions)
- **Clés stockées :** `water_measurements`, `water_sensors`, `water_alerts`, `water_threshold`, `water_eq_thresholds`, `water_profile`
- Toutes les données sont sauvegardées à chaque changement d'état
- Si le profil change, les données sont **réinitialisées** pour charger le jeu de données correspondant

#### 5. API Google Gemini (pour l'analyse IA)
- **Clé API :** définie dans `.env.local` (`GEMINI_API_KEY`)
- Les mesures actuelles sont envoyées en contexte à Gemini
- Réponse structurée (JSON) avec schema validation côté Gemini SDK
- Appel uniquement à la demande (bouton "Analyser avec l'IA"), pas en continu

---

## 1. Vue d'ensemble

**ConsoEau** est une application web React/TypeScript pour le monitoring de consommation d'eau en temps réel. Elle supporte plusieurs types d'utilisateurs (particuliers, professionnels, collectivités, testeurs), génère des mesures simulées via des capteurs IoT, intègre l'IA Google Gemini pour l'analyse, et gère un système d'alertes complet.

**Objectif :** Application de démonstration/prototype avec simulation de données et support d'ingestion CSV réel en mode testeur.

---

## 2. Stack Technique

| Catégorie | Outil | Version |
|---|---|---|
| UI Framework | React | 19.2.4 |
| Build Tool | Vite | 6.2.0 |
| Langage | TypeScript | ~5.8.2 |
| CSS | Tailwind CSS (CDN) | v3+ |
| Icônes | lucide-react | 0.564.0 |
| Animations | framer-motion | 12.35.2 |
| Graphiques | recharts | 3.7.0 |
| IA | @google/genai (Gemini) | 1.41.0 |
| Routing | react-router-dom | 7.13.0 |
| Font | Inter (Google Fonts) | — |

---

## 3. Structure des Fichiers

```
conso/
├── App.tsx                    # Composant racine, routing, auth flow
├── index.tsx                  # Point d'entrée React (ReactDOM.createRoot)
├── index.html                 # Shell HTML (Tailwind CDN, #root div)
├── index.css                  # Styles globaux
├── types.ts                   # Toutes les interfaces TypeScript
├── constants.ts               # Constantes globales (prix, labels, seuils)
├── metadata.json              # Métadonnées de l'application
├── vite.config.ts             # Config Vite (port, proxy, middleware CSV)
├── tsconfig.json              # Config TypeScript
├── .env.local                 # GEMINI_API_KEY
│
├── pages/                     # Vues principales (12 pages)
│   ├── Dashboard.tsx          # Tableau de bord principal
│   ├── Login.tsx              # Connexion + sélection de profil
│   ├── LandingPage.tsx        # Page d'accueil marketing
│   ├── Signup.tsx             # Inscription 3 étapes
│   ├── Activation.tsx         # Vérification du code d'activation
│   ├── Alerts.tsx             # Gestion des alertes
│   ├── AIAdvice.tsx           # Conseils IA (Gemini)
│   ├── EquipmentStatus.tsx    # Gestion des capteurs/équipements
│   ├── Analytics.tsx          # Analytics avancées + graphiques
│   ├── Profile.tsx            # Profil utilisateur
│   ├── Simulator.tsx          # Outil de simulation de données
│   └── TesteurDashboard.tsx   # Dashboard mode testeur
│
├── components/                # Composants réutilisables
│   ├── Sidebar.tsx            # Navigation latérale
│   ├── DashboardCards.tsx     # KPICard + TarifCard
│   ├── AddEquipmentModal.tsx  # Modal ajout capteur (3 étapes)
│   └── ProfileModal.tsx       # Modal édition profil
│
├── store/
│   └── WaterContext.tsx       # Context React (état global + logique)
│
├── services/
│   └── geminiService.ts       # Intégration API Google Gemini
│
├── data/
│   ├── profileSimulations.ts  # Générateurs de mesures par profil
│   ├── simulation_data.ts     # Données journalières d'exemple
│   ├── sensor_input.json      # Données brutes capteurs
│   └── sensor_input.json.ts   # JSON exporté en constante TS
│
├── lib/
│   └── utils.ts               # Utilitaires (cn pour classnames)
│
└── dist/                      # Build de production (généré)
```

---

## 4. Architecture Globale

### Flux d'authentification

```
LandingPage
    ↓
Login  ←→  Signup (3 étapes) → Activation (code "CONSO-2026")
    ↓
App.tsx  →  WaterProvider (Context global)
    ↓
Layout : Sidebar + <Page active>
    ↓
Dashboard / Alerts / AIAdvice / EquipmentStatus / Analytics / Profile
```

### Gestion d'état

| Mécanisme | Usage |
|---|---|
| `WaterContext` (React Context) | Mesures, capteurs, alertes, seuils |
| `localStorage` | Persistance entre sessions |
| `useState` local | État UI par page |

---

## 5. Modèles de Données (types.ts)

```typescript
// Profil utilisateur
interface UserProfile {
  name: string;
  email: string;
  accountType: 'particulier' | 'pro' | 'collectivite' | 'testeur';
  role: 'Admin' | 'Utilisateur';
  createdAt: string;
  isActivated: boolean;
  companyName?: string;
  headOffice?: string;
}

// Mesure d'eau
interface Measurement {
  device_id: string;
  type_equipement: EquipmentType;
  volume_l: number;
  debit_l_min: number;
  timestamp: string;
}

// Capteur / Équipement
interface SensorStatus {
  id: string;
  name: string;
  type: EquipmentType;
  zone: string;
  status: 'active' | 'inactive' | 'error';
  battery?: number;
  customThreshold?: number;
  alertsEnabled: boolean;
}

// Alerte
interface Alert {
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

// Types d'équipement
type EquipmentType =
  'wc' | 'douche' | 'cuisine' |
  'lave_vaisselle' | 'lave_linge' | 'jardin' | 'autre';
```

---

## 6. WaterContext — État Global (store/WaterContext.tsx)

Point central de l'application. Fournit toutes les données et actions via le hook `useWater()`.

### Fonctions exposées

| Fonction | Description |
|---|---|
| `addMeasurement(m)` | Ajoute une mesure + vérifie les seuils → génère alertes |
| `addSensor(s)` | Ajoute un capteur IoT |
| `updateSensor(id, changes)` | Met à jour un capteur (seuil, statut, alertes) |
| `markAlertRead(id)` | Marque une alerte comme lue |
| `clearAlerts()` | Supprime toutes les alertes |
| `setPeriod(p)` | Change la période d'affichage (1MN/1H/1J/3J/1S) |
| `setThreshold(v)` | Seuil global de consommation journalière |
| `setEquipmentThreshold(type, v)` | Seuil par type d'équipement |

### Flux de données

```
Sélection profil
    ↓
Chargement mesures initiales (profileSimulations.ts)
    ↓
Vérification localStorage (données existantes ?)
    ↓ (toutes les 8s)
Simulation live : capteur aléatoire → nouvelle mesure
    ↓
addMeasurement() → vérification alertes → persist localStorage
    ↓
Composants abonnés re-render via Context
```

### Mode Testeur (flux spécial)

```
accountType === 'testeur'
    ↓
Polling toutes les 2s → GET /water-local/measurements.json
    ↓
Vite middleware intercepte la requête
    ↓
Lecture du fichier ../water-test-data/water_data.csv
    ↓
Parsing CSV (device_id;timestamp;debit;total)
    ↓
Conversion en tableau Measurement[] → réponse JSON
    ↓
WaterContext met à jour mesures + capteurs
```

### Logique de génération d'alertes

```
Nouvelle mesure ajoutée
    ↓
Condition 1: débit WC entre 0–0.5 L/min → DANGER "Fuite probable"
Condition 2: volume > seuil custom du capteur → WARNING "Seuil dépassé"
Condition 3: cumul journalier > seuil global → WARNING "Seuil quotidien dépassé"
    ↓
Alert persistée dans localStorage
```

---

## 7. Pages

### Dashboard (pages/Dashboard.tsx)
- KPI Cards : volume total, consommation moyenne, coût estimé
- Sélecteur de période : 1MN / 1H / 1J / 3J / 1S
- Slider de seuil personnalisable
- Filtre par équipement
- Objectif journalier avec barre de progression %
- Graphique area (historique de consommation)
- Donut chart (répartition par équipement)
- Mode tarif : référence ou personnalisé

### Alerts (pages/Alerts.tsx)
- Liste des alertes avec badge sévérité (Danger / Warning / Info)
- Statut lu/non-lu
- Métadonnées : titre, message, heure, capteur, volume
- Bouton "Tout effacer"
- Compteur d'alertes non-lues dans le Sidebar

### AI Advice (pages/AIAdvice.tsx)
- Sélecteur de périmètre (tous / équipement spécifique)
- Appel à l'API Gemini via `analyzeWaterData()`
- Affichage : statut global, sensibilisation, plus gros consommateur, conseils économies
- Skeleton de chargement pendant l'analyse

### Equipment Status (pages/EquipmentStatus.tsx)
- Liste des capteurs avec indicateurs de statut
- Niveau de batterie, zone, dernière activité, volume total
- Toggle alertes par capteur
- Seuil personnalisé par capteur
- Modal d'ajout de capteur (wizard 3 étapes)

### Analytics (pages/Analytics.tsx)
- Tableau détaillé par capteur : utilisations, volume, débit, coût
- Bar chart : consommation par équipement
- Line chart : tendance temporelle
- Comparaison seuil normal vs. dépassé

### Login (pages/Login.tsx)
- 4 boutons de profil rapide : Pro, Collectivité, Particulier, Testeur
- Formulaire email/password (démo : admin / admin)
- Login direct par sélection de profil
- Lien vers inscription

### Signup (pages/Signup.tsx)
- Étape 1 : Type de compte
- Étape 2 : Infos personnelles (nom, email, mot de passe) + infos entreprise si pro/collectivité
- Étape 3 : Code d'activation (hardcodé : "CONSO-2026")
- Indicateur de progression entre étapes

### LandingPage (pages/LandingPage.tsx)
- Page marketing multi-sections : campagne, infos, FAQ, à propos
- Toggle dark mode
- Présentation des 4 profils utilisateurs
- Infos équipe : Victor Paul, Alexandre Della-Schiava, Meriem El Aita, Maxime Goyenaga, Galdrick Rampin

---

## 8. Composants

### Sidebar (components/Sidebar.tsx)
- 5 entrées de navigation (Dashboard, Alertes, Conseils IA, Équipements, Analytics)
- Badge d'alertes non-lues
- Carte profil utilisateur en bas
- Boutons Refresh et Déconnexion
- Dark theme, collapsible mobile

### DashboardCards (components/DashboardCards.tsx)
- `KPICard` — affiche une métrique avec icône et valeur
- `TarifCard` — sélecteur tarif (référence vs. personnalisé) avec champ de prix

### AddEquipmentModal (components/AddEquipmentModal.tsx)
- Étape 1 : Sélection type d'équipement
- Étape 2 : Scan QR simulé / saisie nom et zone
- Étape 3 : Confirmation configuration
- ID auto-généré format `SENSOR-XXXX`

---

## 9. Service IA (services/geminiService.ts)

```typescript
analyzeWaterData(measurements: Measurement[], filter: string): Promise<AIAnalysis>
```

- **Modèle :** `gemini-3-flash-preview`
- **SDK :** `@google/genai`
- **Norme de référence :** 150 L/personne/jour (OMS)
- **Output structuré :** JSON avec schema validation Gemini
- **Détections :**
  - Consommation anormale vs. norme
  - Fuites probables (débit faible constant)
  - Plus gros consommateurs
  - Conseils d'économie concrets

---

## 10. Constantes (constants.ts)

```typescript
// Prix de l'eau
WATER_PRICE_PER_M3 = 4.34 €
WATER_PRICE_PER_L  = 0.00434 €

// Seuils par défaut (litres/jour)
jardin         : 150 L
wc             : 30 L
douche         : 100 L
cuisine        : 50 L
lave_vaisselle : 20 L
lave_linge     : 80 L
autre          : 20 L

// Périodes disponibles
'1MN' | '1H' | '1J' | '3J' | '1S'

// Labels équipements (FR)
wc             → "WC"
douche         → "Douche"
cuisine        → "Cuisine"
lave_vaisselle → "Lave-vaisselle"
lave_linge     → "Lave-linge"
jardin         → "Jardin"
autre          → "Autre"
```

---

## 11. Profils de Simulation (data/profileSimulations.ts)

### Particulier
- Capteurs : Douche, WC, Cuisine, Jardin, Lave-linge
- Volumes : 3–120 L | Débits : 0.5–14 L/min | 2–8 usages/équipement/jour

### Pro
- Capteurs : Sanitaires (2 étages), Cafétéria, Nettoyage, Jardin, Lave-vaisselle
- Volumes : 6–200 L | Débits : 3–16 L/min | 3–22 usages/équipement/jour

### Collectivité
- Capteurs : Parc Nord, Parc Sud, Bâtiment A, Bâtiment B, Fontaine, Piscine
- Volumes : 9–1200 L | Débits : 3–28 L/min | 1–45 usages/équipement/jour

---

## 12. Configuration

### .env.local
```
GEMINI_API_KEY=<clé API Google Gemini>
```

### vite.config.ts
- Port dev : **3001** | Host : `0.0.0.0`
- Proxy `/water-api` → `http://localhost:5000`
- Middleware `/water-local/measurements.json` → convertit `../water-test-data/water_data.csv` en JSON
- Alias `@/` → racine du projet

### tsconfig.json
- Target : ES2022 | Module : ESNext | JSX : react-jsx
- Strict mode activé | Alias `@/*` → `./*`

---

## 13. Design System

| Rôle | Couleur Tailwind |
|---|---|
| Primaire | Blue (#3b82f6, #2563eb) |
| Fond dark | Slate (#0f172a, #1e293b) |
| Succès | Emerald (#10b981) |
| Danger | Rose (#dc2626, #ef4444) |
| Warning | Amber (#f59e0b) |
| Secondaire | Indigo (#6366f1) |

Layout : grilles responsives 1→2→4 colonnes, coins arrondis 2xl–[48px], ombres colorées, font Inter.

---

## 14. Commandes

```bash
npm run dev      # Développement → http://localhost:3001
npm run build    # Build production → /dist
npm run preview  # Prévisualisation du build
```

---

## 15. Limitations Connues

| Limitation | Détail |
|---|---|
| Credentials hardcodés | Login : admin / admin |
| Code d'activation fixe | "CONSO-2026" |
| Pas de backend | Persistance localStorage uniquement |
| API key exposée | GEMINI_API_KEY dans .env.local |
| Routing partiel | Navigation par state manuel (pas React Router complet) |
| Simulation toutes les 8s | Irréaliste, adapté demo |
| Mode testeur | Nécessite `../water-test-data/water_data.csv` |
| Pas d'authentification réelle | Pas de BDD ni backend auth |
