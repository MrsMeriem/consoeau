import path from "path";
import fs from "fs";
import { spawn, ChildProcess } from "child_process";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

let loggerProcess: ChildProcess | null = null;
let loggerError: string | null = null;

const WATER_JSON = path.resolve(".", "water-test-data", "water_data.json");
const WATER_CSV = path.resolve(".", "water-test-data", "water_data.csv");

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    server: {
      port: 3001,
      host: "0.0.0.0",
      allowedHosts: true,
      proxy: {
        "/water-api": {
          target: "http://localhost:5000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/water-api/, ""),
        },
      },
    },
    plugins: [
      react(),
      {
        name: "water-local-data",
        configureServer(server) {
          // CSV → Measurements JSON for testeur mode
          server.middlewares.use(
            "/water-local/measurements.json",
            (_req, res) => {
              try {
                const raw = fs.existsSync(WATER_CSV)
                  ? fs.readFileSync(WATER_CSV, "utf-8")
                  : "";
                const lines = raw.trim().split("\n").filter(Boolean);
                const measurements: any[] = [];
                let prevTotal = 0;
                for (let i = 1; i < lines.length; i++) {
                  const parts = lines[i].split(";");
                  if (parts.length < 4) continue;
                  const timestamp = parts[0].trim().replace(" ", "T");
                  const debit = parseFloat(parts[2]) || 0;
                  const total = parseFloat(parts[3]) || 0;
                  const delta = Math.max(0, total - prevTotal);
                  prevTotal = total;
                  measurements.push({
                    device_id: "equipement_test",
                    type_equipement: "autre",
                    volume_l: parseFloat(delta.toFixed(4)),
                    debit_l_min: debit,
                    timestamp,
                  });
                }
                res.setHeader("Content-Type", "application/json");
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.end(JSON.stringify(measurements));
              } catch {
                res.statusCode = 500;
                res.end("[]");
              }
            },
          );

          // Logger start/stop
          server.middlewares.use("/water-local/logger/start", (_req, res) => {
            if (loggerProcess) {
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ status: "already_running" }));
              return;
            }
            loggerError = null;
            const scriptPath = path.resolve(".", "water-test-data", "water_logger.py");
            loggerProcess = spawn("python", [scriptPath], { stdio: "pipe" });
            loggerProcess.stderr?.on("data", (d: Buffer) => {
              loggerError = d.toString().trim();
            });
            loggerProcess.stdout?.on("data", (d: Buffer) => {
              const txt = d.toString();
              if (txt.includes("ERREUR") || txt.includes("Impossible")) loggerError = txt.trim();
            });
            loggerProcess.on("exit", (code) => {
              if (code !== 0 && !loggerError) loggerError = `Le logger s'est arrêté (code ${code})`;
              loggerProcess = null;
            });
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ status: "started" }));
          });

          server.middlewares.use("/water-local/logger/stop", (_req, res) => {
            if (loggerProcess) {
              loggerProcess.kill();
              loggerProcess = null;
            }
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ status: "stopped" }));
          });

          server.middlewares.use("/water-local/logger/clear-csv", (_req, res) => {
            try {
              // Stop logger if running before clearing
              if (loggerProcess) { loggerProcess.kill(); loggerProcess = null; }
              loggerError = null;
              fs.writeFileSync(WATER_CSV, "Horodatage;Temps_ms;Debit_L_min;Total_L\n", "utf-8");
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ status: "cleared" }));
            } catch (e: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ status: "error", message: e.message }));
            }
          });

          server.middlewares.use("/water-local/logger/status", (_req, res) => {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ running: loggerProcess !== null, error: loggerError }));
          });

          server.middlewares.use("/water-local/data.json", (_req, res) => {
            try {
              const raw = fs.existsSync(WATER_JSON)
                ? fs.readFileSync(WATER_JSON, "utf-8")
                : "[]";
              const all: any[] = JSON.parse(raw);
              const last20 = all.slice(-20);
              const response = {
                status: "local_file",
                total_entrees: all.length,
                derniere_entree: all.length > 0 ? all[all.length - 1] : null,
                toutes_les_donnees: last20,
              };
              res.setHeader("Content-Type", "application/json");
              res.setHeader("Access-Control-Allow-Origin", "*");
              res.end(JSON.stringify(response));
            } catch {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: "Fichier non lisible" }));
            }
          });
        },
      },
    ],
    define: {
      "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY),
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
  };
});
