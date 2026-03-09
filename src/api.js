// ============================================================
// DREAM RANCH — API Service (calls Vercel serverless functions)
// ============================================================

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

// ── CLIENTS ──
export const getClients = () => call("/clients");
export const createClient = (data) => call("/clients", "POST", data);
export const updateClient = (id, data) => call("/clients", "PATCH", { id, ...data });

// ── PRESTATIONS (catalogue) ──
export const getPrestations = () => call("/prestations");

// ── VENTES ──
export const getVentes = (cavalier) => call(`/ventes${cavalier ? `?cavalier=${cavalier}` : ""}`);
export const createVente = (data) => call("/ventes", "POST", data);

// ── PAIEMENTS ──
export const getPaiements = (venteId) => call(`/paiements${venteId ? `?vente=${venteId}` : ""}`);
export const createPaiement = (data) => call("/paiements", "POST", data);

// ── PLANNING ──
export const getPlanning = () => call("/planning");
export const createCreneau = (data) => call("/planning", "POST", data);
export const updateCreneau = (id, data) => call("/planning", "PATCH", { id, ...data });

// ── PRÉSENCES ──
export const getPresences = (date, creneau) => {
  const params = [];
  if (date) params.push(`date=${date}`);
  if (creneau) params.push(`creneau=${creneau}`);
  return call(`/presences${params.length ? "?" + params.join("&") : ""}`);
};
export const togglePresence = (creneauId, date, cavalierId) =>
  call("/presences", "POST", { creneauId, date, cavalierId });

// ── HEURES MANUELLES ──
export const getHeures = (cavalier) => call(`/heures${cavalier ? `?cavalier=${cavalier}` : ""}`);
export const addHeures = (data) => call("/heures", "POST", data);

// ── CAISSE ──
export const getCaisse = () => call("/caisse");
export const addCaisseMvt = (data) => call("/caisse", "POST", data);

// ── LOAD ALL DATA (initial fetch) ──
export async function loadAll() {
  const [clients, prestations, ventes, planning, presences, heures, caisse] = 
    await Promise.all([
      getClients(),
      getPrestations(),
      getVentes(),
      getPlanning(),
      getPresences(),
      getHeures(),
      getCaisse(),
    ]);
  return { clients, prestations, ventes, planning, presences, heures, caisse };
}
