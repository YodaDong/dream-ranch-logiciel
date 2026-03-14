const BASE = "/api";

async function call(path, method = "GET", body = null) {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "API error");
  }
  return res.json();
}

// Safe call - returns default on error
async function safeCall(path, fallback = []) {
  try { return await call(path); }
  catch (e) { console.warn(`API ${path} failed:`, e.message); return fallback; }
}

export const getClients = () => call("/clients");
export const createClient = (data) => call("/clients", "POST", data);
export const updateClient = (id, data) => call("/clients", "PATCH", { id, ...data });
export const getPrestations = () => call("/prestations");
export const getVentes = () => call("/ventes");
export const createVente = (data) => call("/ventes", "POST", data);
export const deleteVente = (id) => call("/ventes", "DELETE", { id });
export const getPaiements = (venteId) => call(`/paiements${venteId ? `?vente=${venteId}` : ""}`);
export const createPaiement = (data) => call("/paiements", "POST", data);
export const getPlanning = () => call("/planning");
export const createCreneau = (data) => call("/planning", "POST", data);
export const updateCreneau = (id, data) => call("/planning", "PATCH", { id, ...data });
export const getPresences = (date, creneau) => {
  const p = []; if (date) p.push(`date=${date}`); if (creneau) p.push(`creneau=${creneau}`);
  return call(`/presences${p.length ? "?" + p.join("&") : ""}`);
};
export const togglePresence = (creneauId, date, cavalierId, statut, forfaitId, heures) => call("/presences", "POST", { creneauId, date, cavalierId, statut, forfaitId, heures });
export const getHeures = () => call("/heures");
export const addHeures = (data) => call("/heures", "POST", data);
export const getCaisse = () => call("/caisse");
export const addCaisseMvt = (data) => call("/caisse", "POST", data);
export const getFactures = () => call("/factures");
export const createFacture = (data) => call("/factures", "POST", data);
export const getAvoirs = () => call("/avoirs");
export const createAvoir = (data) => call("/avoirs", "POST", data);
export const updateAvoir = (id, data) => call("/avoirs", "PATCH", { id, ...data });

// Load all - each call independent, failures return empty arrays
export async function loadAll() {
  const [clients, prestations, ventes, planning, presences, heures, caisse] =
    await Promise.all([
      safeCall("/clients"),
      safeCall("/prestations"),
      safeCall("/ventes"),
      safeCall("/planning"),
      safeCall("/presences"),
      safeCall("/heures"),
      safeCall("/caisse"),
    ]);
  // If clients failed, that's a real problem
  if (clients.length === 0) {
    // Try once more
    const retry = await call("/clients");
    return { clients: retry, prestations, ventes, planning, presences, heures, caisse };
  }
  return { clients, prestations, ventes, planning, presences, heures, caisse };
}
