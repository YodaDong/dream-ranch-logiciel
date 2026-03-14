import { useState, useEffect, useCallback } from "react";
import { uid, td, fE, CSS_GLOBAL } from "./data/helpers.jsx";
import { useIsDesktop } from "./hooks/useIsDesktop.jsx";
import MobileApp from "./components/MobileApp.jsx";
import DesktopApp from "./components/DesktopApp.jsx";
import * as API from "./api.js";

export default function App() {
  const isDesktop = useIsDesktop();
  const [cls, setCls] = useState([]);
  const [cat, setCat] = useState([]);
  const [vts, setVts] = useState([]);
  const [crs, setCrs] = useState([]);
  const [prs, setPrs] = useState([]);
  const [hm, setHm] = useState([]);
  const [caisseMvts, setCaisseMvts] = useState([]);
  const [tab, setTab] = useState("home");
  const [selC, setSelC] = useState(null);
  const [selV, setSelV] = useState(null);
  const [mdl, setMdl] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const flash = (m, t = "ok") => { setToast({ m, t }); setTimeout(() => setToast(null), 2500); };

  // ── LOAD ALL DATA FROM NOTION ──
  useEffect(() => {
    setLoading(true);
    API.loadAll()
      .then(data => {
        setCls(data.clients);
        setCat(data.prestations);
        setVts(data.ventes);
        setCrs(data.planning);
        setPrs(data.presences);
        setHm(data.heures);
        setCaisseMvts(data.caisse);
        setLoading(false);
      })
      .catch(e => { console.error("Load error:", e); setLoading(false); });
  }, []);

  const reload = async (what) => {
    try {
      if (what === "clients" || what === "all") setCls(await API.getClients());
      if (what === "ventes" || what === "all") setVts(await API.getVentes());
      if (what === "planning" || what === "all") setCrs(await API.getPlanning());
      if (what === "presences" || what === "all") setPrs(await API.getPresences());
      if (what === "heures" || what === "all") setHm(await API.getHeures());
      if (what === "caisse" || what === "all") setCaisseMvts(await API.getCaisse());
    } catch (e) { console.error("Reload error:", e); }
  };

  // ── DERIVED DATA ──
  const gc = useCallback(id => cls.find(c => c.id === id), [cls]);
  const gp = useCallback(id => { const c = gc(id); return c?.type === "Enfant" ? gc(c.parentId) : c; }, [gc]);
  const gf = useCallback(id => {
    const c = gc(id); if (!c) return [];
    if (c.type === "Enfant") { const p = gc(c.parentId); return p ? [p, ...p.enfantsIds.filter(x => x !== id).map(gc).filter(Boolean)] : []; }
    return c.enfantsIds.map(gc).filter(Boolean);
  }, [gc]);
  const cv = useCallback(id => vts.filter(v => v.cav === id), [vts]);
  const ch = useCallback(id => {
    const v = cv(id);
    const achats = v.reduce((s, vt) => { const p = cat.find(x => x.id === vt.prest); return s + (p?.h || 0); }, 0);
    const consommes = prs.filter(p => p.cav === id && p.ok).length;
    const manuels = hm.filter(h => h.cav === id).reduce((s, h) => s + h.delta, 0);
    return { achats, consommes, manuels, solde: achats - consommes + manuels };
  }, [cv, prs, hm, cat]);
  const cs = useCallback(id => cv(id).reduce((s, v) => s + (v.du - v.tp), 0), [cv]);
  const csFamille = useCallback(id => {
    const c = gc(id); if (!c) return { details: [], total: 0 };
    let members = [];
    if (c.type === "Parent") members = [c, ...c.enfantsIds.map(gc).filter(Boolean)];
    else { const p = gc(c.parentId); if (p) members = [p, ...p.enfantsIds.map(gc).filter(Boolean)]; else members = [c]; }
    const details = members.map(m => ({ id: m.id, nom: m.prenom + " " + m.nom, solde: cs(m.id) }));
    return { details, total: details.reduce((s, d) => s + d.solde, 0) };
  }, [gc, cs]);

  // ── ACTIONS ──
  const addV = async (d) => {
    const p = cat.find(x => x.id === d.prest);
    try {
      const result = await API.createVente({ cavalier: d.cav, payeur: d.pay, prestation: d.prest, detail: p?.nom || "", prix: d.prix || p?.prix || 0, remise: d.rem || 0, date: td() });
      if (d.payNow && d.payMode) {
        const du = (d.prix || p?.prix || 0) - (d.rem || 0);
        const payMt = d.payAmt ? Math.min(d.payAmt, du) : du;
        await API.createPaiement({ venteId: result.id, montant: payMt, mode: d.payMode, chq: d.payChq || "", detail: p?.nom || "", date: td() });
      }
      flash("Vente créée");
      await reload("ventes"); await reload("caisse");
      return result.id;
    } catch (e) { flash("Erreur: " + e.message, "err"); }
  };

  const addP = async (vid, py) => {
    try {
      const v = vts.find(x => x.id === vid);
      await API.createPaiement({ venteId: vid, montant: py.mt, mode: py.mode, chq: py.chq || "", detail: v?.detail || "", date: py.date || td() });
      flash("Paiement enregistré");
      await reload("ventes"); await reload("caisse");
    } catch (e) { flash("Erreur: " + e.message, "err"); }
  };

  const addCl = async (d) => {
    try {
      const result = await API.createClient({ nom: d.nom?.toUpperCase() || "", prenom: d.prenom || "", type: d.type || "Enfant", parentId: d.parentId || null, tel: d.tel || "", email: d.email || "", naissance: d.naissance || "", adresse: d.adresse || "", cp: d.cp || "", ville: d.ville || "" });
      flash("Client ajouté");
      await reload("clients");
      return result.id;
    } catch (e) { flash("Erreur: " + e.message, "err"); }
  };

  const updCl = async (id, d) => {
    try { await API.updateClient(id, d); flash("Client modifié"); await reload("clients"); }
    catch (e) { flash("Erreur: " + e.message, "err"); }
  };

  // Get active forfaits for a cavalier (ventes with hours remaining)
  const getActiveForfaits = useCallback(id => {
    return cv(id).filter(v => {
      const p = cat.find(x => x.id === v.prest);
      if (!p || !p.impH || !p.h) return false;
      // Calculate hours remaining for this vente
      const consommes = prs.filter(pr => pr.forfaitId === v.id && (pr.statut === "Présent" || pr.statut === "Absent débité")).length;
      const manuels = hm.filter(h => h.cav === id).reduce((s, h) => s + h.delta, 0);
      const reste = p.h - consommes;
      return reste > 0;
    }).map(v => {
      const p = cat.find(x => x.id === v.prest);
      const consommes = prs.filter(pr => pr.forfaitId === v.id && (pr.statut === "Présent" || pr.statut === "Absent débité")).length;
      return { id: v.id, nom: p?.nom || v.detail, heuresTotal: p?.h || 0, heuresConsommees: consommes, heuresRestantes: (p?.h || 0) - consommes };
    });
  }, [cv, cat, prs, hm]);

  const togPr = async (cr, dt, cav) => {
    try { await API.togglePresence(cr, dt, cav); await reload("presences"); }
    catch (e) { flash("Erreur: " + e.message, "err"); }
  };

  // New: set presence with statut + forfait
  const setPresence = async (creneauId, date, cavalierId, statut, forfaitId = null) => {
    try {
      const heures = (statut === "Présent" || statut === "Absent débité") ? 1 : 0;
      await API.togglePresence(creneauId, date, cavalierId, statut, forfaitId, heures);
      if (statut === "Présent" || statut === "Absent débité") {
        flash(forfaitId ? "Présence enregistrée (−1h)" : "Présence enregistrée");
      } else {
        flash("Annulation enregistrée");
      }
      await reload("presences");
    } catch (e) { flash("Erreur: " + e.message, "err"); }
  };

  // New: remove presence entry
  const removePresence = async (presenceId) => {
    try {
      const opts = { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: presenceId }) };
      await fetch("/api/presences", opts);
      flash("Cavalier retiré");
      await reload("presences");
    } catch (e) { flash("Erreur: " + e.message, "err"); }
  };

  const addHM = async (cav, delta, motif, date) => {
    try {
      await API.addHeures({ cavalier: cav, delta, motif: motif || "Ajustement", date: date || td() });
      flash(delta > 0 ? `+${delta}h ajoutée(s)` : `${delta}h retirée(s)`);
      await reload("heures");
    } catch (e) { flash("Erreur: " + e.message, "err"); }
  };

  const addCr = async (d) => {
    try { await API.createCreneau({ nom: d.nom, jour: d.jour, heure: d.heure, duree: d.duree || 60, cavs: d.cavs || [] }); flash("Créneau créé"); await reload("planning"); }
    catch (e) { flash("Erreur: " + e.message, "err"); }
  };

  const updCr = async (id, d) => {
    try { await API.updateCreneau(id, d); flash("Créneau modifié"); await reload("planning"); }
    catch (e) { flash("Erreur: " + e.message, "err"); }
  };

  const delCr = () => flash("Suppression non disponible");

  const addCaisseMvt = async (d) => {
    try {
      await API.addCaisseMvt({ motif: d.motif || d.label || "", date: d.date || td(), montant: d.mt, type: d.type === "entree" ? "Entrée" : "Sortie" });
      flash(d.type === "entree" ? "Entrée enregistrée" : "Sortie enregistrée");
      await reload("caisse");
    } catch (e) { flash("Erreur: " + e.message, "err"); }
  };

  const delV = async (vid) => {
    try {
      await API.deleteVente(vid);
      flash("Prestation supprimée");
      await reload("ventes");
    } catch (e) { flash("Erreur: " + e.message, "err"); }
  };

  const addCatItem = () => flash("Gérer le catalogue dans Notion");
  const updCatItem = () => flash("Gérer le catalogue dans Notion");
  const delCatItem = () => flash("Gérer le catalogue dans Notion");

  const ctx = { cls, cat, vts, crs, prs, hm, caisseMvts, gc, gp, gf, cv, ch, cs, csFamille, getActiveForfaits, addV, addP, addCl, updCl, togPr, setPresence, removePresence, addHM, addCatItem, updCatItem, delCatItem, addCr, updCr, delCr, addCaisseMvt, delV, selC, setSelC, selV, setSelV, tab, setTab, mdl, setMdl, flash, isDesktop };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#12100c", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif", color: "#d4af69" }}>
      <style>{CSS_GLOBAL}</style>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, boxShadow: "0 4px 20px rgba(0,0,0,.3)" }}>
        <img src="/logo.svg" alt="" style={{ width: 56, height: 56, objectFit: "contain" }} />
      </div>
      <div style={{ fontSize: 18, fontFamily: "'DM Serif Display',serif", marginBottom: 8 }}>Dream Ranch</div>
      <div style={{ color: "#7a6f60", fontSize: 13 }}>Chargement...</div>
      <div style={{ width: 120, height: 3, background: "rgba(212,175,105,.1)", borderRadius: 3, marginTop: 16, overflow: "hidden" }}>
        <div style={{ width: "40%", height: "100%", background: "#d4af69", borderRadius: 3, animation: "ld 1.2s ease-in-out infinite" }} />
      </div>
      <style>{`@keyframes ld { 0%{transform:translateX(-100%)} 100%{transform:translateX(350%)} }`}</style>
    </div>
  );

  if (err) return (
    <div style={{ minHeight: "100vh", background: "#12100c", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif", color: "#e87a7a", padding: 20, textAlign: "center" }}>
      <style>{CSS_GLOBAL}</style>
      <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Erreur de connexion</div>
      <div style={{ fontSize: 13, color: "#7a6f60", marginBottom: 16, maxWidth: 300 }}>{err}</div>
      <button onClick={() => window.location.reload()} style={{ background: "#d4af69", color: "#1a1207", border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Réessayer</button>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#12100c", fontFamily: "'DM Sans',sans-serif", color: "#e8dcc8" }}>
      <style>{CSS_GLOBAL}</style>
      {toast && <div style={{ position: "fixed", top: isDesktop ? 20 : 64, left: "50%", transform: "translateX(-50%)", padding: "10px 22px", borderRadius: 10, fontWeight: 600, fontSize: 13, zIndex: 200, boxShadow: "0 8px 32px rgba(0,0,0,.5)", background: toast.t === "info" ? "#1a3d5c" : toast.t === "err" ? "#3d0f0f" : "#0f3d2a", color: toast.t === "info" ? "#7db8e0" : toast.t === "err" ? "#e87a7a" : "#5ae8a0", animation: "ti .3s ease-out" }}>{toast.m}</div>}
      {isDesktop ? <DesktopApp ctx={ctx} /> : <MobileApp ctx={ctx} />}
    </div>
  );
}
