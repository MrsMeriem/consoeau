import serial
import csv
import datetime
import os

# ─── CONFIGURATION ───────────────────────────────────────────
PORT     = "COM9"            # Port de votre Arduino
BAUD     = 9600              # Vitesse (doit correspondre à Serial.begin())
# Chemin absolu → fonctionne peu importe d'où on lance le script
FICHIER  = os.path.join(os.path.dirname(os.path.abspath(__file__)), "water_data.csv")
# ─────────────────────────────────────────────────────────────

def main():
    print("=" * 50)
    print("  WATER LOGGER - Enregistrement des données")
    print("=" * 50)
    print(f"  Port    : {PORT}")
    print(f"  Vitesse : {BAUD} bauds")
    print(f"  Fichier : {FICHIER}")
    print("=" * 50)
    print("  Appuyez sur Ctrl+C pour arrêter\n")

    # Connexion au port série
    try:
        ser = serial.Serial(PORT, BAUD, timeout=2)
        print(f"Connecté à {PORT} !\n")
    except serial.SerialException as e:
        print(f"ERREUR : Impossible d'ouvrir {PORT}")
        print(f"   -> {e}")
        print("\nVerifiez que :")
        print("   1. L'IDE Arduino est fermé")
        print("   2. La carte est bien branchée en USB")
        print("   3. Le port COM7 est correct")
        return

    # Création du fichier CSV
    fichier_existe = os.path.exists(FICHIER)
    with open(FICHIER, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f, delimiter=";")  # ";" pour Excel français

        # En-tête uniquement si nouveau fichier
        if not fichier_existe:
            writer.writerow(["Horodatage", "Temps_ms", "Debit_L_min", "Total_L"])
            print("En-tête créé dans le fichier CSV\n")

        # Lecture en boucle
        try:
            compteur = 0
            while True:
                ligne = ser.readline().decode("utf-8", errors="ignore").strip()

                if ligne.startswith("DATA,"):
                    parties = ligne.split(",")
                    if len(parties) == 4:
                        _, temps_ms, debit, total = parties
                        horodatage = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

                        writer.writerow([horodatage, temps_ms, debit, total])
                        f.flush()  # Sauvegarde immédiate

                        compteur += 1
                        print(f"[{compteur:04d}] {horodatage} | Débit: {debit} L/min | Total: {total} L")

        except KeyboardInterrupt:
            print(f"\nArrêt demandé.")
            print(f"{compteur} lignes enregistrées dans '{FICHIER}'")
            print("Ouvrez ce fichier avec Excel !")

    ser.close()
    print("Port série fermé.")

if __name__ == "__main__":
    main()
