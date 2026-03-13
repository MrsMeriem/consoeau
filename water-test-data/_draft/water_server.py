from flask import Flask, request, jsonify, render_template_string
import json
import datetime
import os
import socket

# ─── CONFIGURATION ───────────────────────────────────────────
PORT_SERVEUR = 5000
FICHIER = "water_data.json"
# ─────────────────────────────────────────────────────────────

app = Flask(__name__)

def charger_donnees():
    if os.path.exists(FICHIER):
        with open(FICHIER, "r", encoding="utf-8") as f:
            try:
                return json.load(f)
            except:
                return []
    return []

def sauvegarder_donnees(donnees):
    with open(FICHIER, "w", encoding="utf-8") as f:
        json.dump(donnees, f, indent=2, ensure_ascii=False)

@app.route("/data", methods=["POST"])
def recevoir_data():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"status": "erreur", "message": "JSON invalide"}), 400

        # Ajout du timestamp
        data["timestamp"] = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S")

        # Sauvegarde
        donnees = charger_donnees()
        donnees.append(data)
        sauvegarder_donnees(donnees)

        print(f"[{data['timestamp']}] Débit: {data['debit_l_min']} L/min | Volume: {data['volume_l']} L")
        return jsonify({"status": "ok"}), 200

    except Exception as e:
        print(f"Erreur : {e}")
        return jsonify({"status": "erreur", "message": str(e)}), 400

@app.route("/api/data", methods=["GET"])
def api_data():
    donnees = charger_donnees()
    return jsonify({
        "status": "serveur actif",
        "total_entrees": len(donnees),
        "derniere_entree": donnees[-1] if donnees else None,
        "toutes_les_donnees": donnees[-20:]  # les 20 dernières
    })

@app.route("/", methods=["GET"])
def accueil():
    html = """
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <title>Water Monitor</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: #f4f7fb;
                margin: 0;
                padding: 20px;
            }
            h1 {
                color: #1f4e79;
            }
            .card {
                background: white;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .value {
                font-size: 28px;
                font-weight: bold;
                color: #0b8457;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            th, td {
                padding: 12px;
                border-bottom: 1px solid #ddd;
                text-align: center;
            }
            th {
                background: #1f4e79;
                color: white;
            }
            tr:hover {
                background: #f1f1f1;
            }
        </style>
    </head>
    <body>
        <h1>Suivi de consommation d'eau</h1>

        <div class="card">
            <p><strong>Statut :</strong> <span id="status">...</span></p>
            <p><strong>Total entrées :</strong> <span id="total_entrees">...</span></p>
            <p><strong>Dernier débit :</strong> <span class="value" id="debit">...</span> L/min</p>
            <p><strong>Volume total :</strong> <span class="value" id="volume">...</span> L</p>
            <p><strong>Timestamp :</strong> <span id="timestamp">...</span></p>
        </div>

        <h2>20 dernières mesures</h2>
        <table>
            <thead>
                <tr>
                    <th>Timestamp</th>
                    <th>Device ID</th>
                    <th>Type</th>
                    <th>Débit (L/min)</th>
                    <th>Volume (L)</th>
                </tr>
            </thead>
            <tbody id="table_body">
            </tbody>
        </table>

        <script>
            async function chargerDonnees() {
                try {
                    const response = await fetch('/api/data');
                    const data = await response.json();

                    document.getElementById('status').textContent = data.status;
                    document.getElementById('total_entrees').textContent = data.total_entrees;

                    if (data.derniere_entree) {
                        document.getElementById('debit').textContent = data.derniere_entree.debit_l_min;
                        document.getElementById('volume').textContent = data.derniere_entree.volume_l;
                        document.getElementById('timestamp').textContent = data.derniere_entree.timestamp;
                    }

                    let rows = "";
                    const liste = data.toutes_les_donnees.slice().reverse();

                    liste.forEach(item => {
                        rows += `
                            <tr>
                                <td>${item.timestamp ?? ""}</td>
                                <td>${item.device_id ?? ""}</td>
                                <td>${item.type_equipement ?? ""}</td>
                                <td>${item.debit_l_min ?? ""}</td>
                                <td>${item.volume_l ?? ""}</td>
                            </tr>
                        `;
                    });

                    document.getElementById('table_body').innerHTML = rows;

                } catch (error) {
                    console.error("Erreur chargement données :", error);
                }
            }

            chargerDonnees();
            setInterval(chargerDonnees, 1000);
        </script>
    </body>
    </html>
    """
    return render_template_string(html)

if __name__ == "__main__":
    print("=" * 50)
    print("  WATER SERVER - En attente de données ESP32")
    print("=" * 50)
    print(f"  Fichier : {FICHIER}")
    print(f"  URL     : http://0.0.0.0:{PORT_SERVEUR}/data")
    print("=" * 50)

    ip_pc = socket.gethostbyname(socket.gethostname())
    print(f"\n  Mettez cette IP dans le code Arduino :")
    print(f"  --> http://{ip_pc}:{PORT_SERVEUR}/data\n")

    app.run(host="0.0.0.0", port=PORT_SERVEUR, debug=False)