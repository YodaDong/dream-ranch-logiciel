import { useState, useMemo, useCallback } from "react";
import { INIT_CLIENTS, INIT_CATALOGUE, INIT_VENTES, INIT_CRENEAUX, INIT_PRESENCES, INIT_HEURES_MANUELLES } from "./data/mockData.jsx";
import { uid, td, fE, CSS_GLOBAL } from "./data/helpers.jsx";
import { useIsDesktop } from "./hooks/useIsDesktop.jsx";
import MobileApp from "./components/MobileApp.jsx";
import DesktopApp from "./components/DesktopApp.jsx";

export default function App() {
  const isDesktop = useIsDesktop();
  const [cls, setCls] = useState(INIT_CLIENTS);
  const [cat, setCat] = useState(INIT_CATALOGUE);
  const [vts, setVts] = useState(INIT_VENTES);
  const [crs, setCrs] = useState(INIT_CRENEAUX);
  const [prs, setPrs] = useState(INIT_PRESENCES);
  const [hm, setHm] = useState(INIT_HEURES_MANUELLES);
  const [caisseMvts, setCaisseMvts] = useState([]);
  const [tab, setTab] = useState("home");
  const [selC, setSelC] = useState(null);
  const [selV, setSelV] = useState(null);
  const [mdl, setMdl] = useState(null);
  const [toast, setToast] = useState(null);

  const flash = (m, t = "ok") => { setToast({ m, t }); setTimeout(() => setToast(null), 2500); };
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

  const addV = (d) => {
    const p = cat.find(x => x.id === d.prest);
    const ref = `V-2026-${String(vts.length + 1).padStart(4, "0")}`;
    const du = (d.prix || p?.prix || 0) - (d.rem || 0);
    let pays = [], tp = 0, st = "Non payée", fact = false;
    if (d.payNow && d.payMode) {
      const payMt = d.payAmt ? Math.min(d.payAmt, du) : du;
      pays = [{ id: `py-${uid()}`, mt: payMt, mode: d.payMode, date: td(), chq: d.payChq || "" }];
      tp = payMt;
      st = tp >= du ? "Soldée" : "Partielle";
      fact = tp >= du;
      if (fact) setTimeout(() => flash("Facture générée auto", "info"), 500);
    }
    const nv = { id: `v-${uid()}`, ref, cav: d.cav, pay: d.pay, prest: d.prest, detail: p?.nom || "", mt: d.prix || p?.prix || 0, rem: d.rem || 0, du, tp, st, date: td(), pays, fact };
    setVts(prev => [nv, ...prev]); flash("Vente créée"); return nv.id;
  };

  const addP = (vid, py) => {
    setVts(prev => prev.map(v => {
      if (v.id !== vid) return v;
      const np = [...v.pays, { id: `py-${uid()}`, ...py }];
      const tp = np.reduce((s, p) => s + p.mt, 0);
      const r = v.du - tp;
      const st = r <= 0 ? "Soldée" : tp > 0 ? "Partielle" : "Non payée";
      const fact = r <= 0 || v.fact;
      if (r <= 0 && !v.fact) setTimeout(() => flash("Facture générée auto", "info"), 500);
      return { ...v, pays: np, tp, st, fact };
    })); flash("Paiement enregistré");
  };

  const addCl = (d) => {
    const nid = `c-${uid()}`;
    const nc = { id: nid, ...d, enfantsIds: [], actif: true };
    setCls(prev => {
      let n = [...prev, nc];
      if (d.type === "Enfant" && d.parentId) n = n.map(c => c.id === d.parentId ? { ...c, enfantsIds: [...c.enfantsIds, nid] } : c);
      return n;
    }); flash("Client ajouté"); return nid;
  };
  const updCl = (id, d) => { setCls(prev => prev.map(c => c.id === id ? { ...c, ...d } : c)); flash("Client modifié"); };
  const togPr = (cr, dt, cav) => {
    setPrs(prev => {
      const ex = prev.find(p => p.cr === cr && p.date === dt && p.cav === cav);
      if (ex) return prev.map(p => p.id === ex.id ? { ...p, ok: !p.ok } : p);
      return [...prev, { id: `pr-${uid()}`, cr, date: dt, cav, ok: true }];
    });
  };
  const addHM = (cav, delta, motif, date) => { setHm(prev => [...prev, { id: `hm-${uid()}`, cav, delta, motif, date: date || td() }]); flash(delta > 0 ? `+${delta}h ajoutée(s)` : `${delta}h retirée(s)`); };
  const addCatItem = (d) => { setCat(prev => [...prev, { id: `p-${uid()}`, ...d, actif: true }]); flash("Prestation ajoutée"); };
  const updCatItem = (id, d) => { setCat(prev => prev.map(p => p.id === id ? { ...p, ...d } : p)); flash("Prestation modifiée"); };
  const delCatItem = (id) => { setCat(prev => prev.map(p => p.id === id ? { ...p, actif: false } : p)); flash("Prestation désactivée"); };

  // Créneau CRUD
  const addCr = (d) => { setCrs(prev => [...prev, { id: `cr-${uid()}`, ...d }]); flash("Créneau créé"); };
  const updCr = (id, d) => { setCrs(prev => prev.map(c => c.id === id ? { ...c, ...d } : c)); flash("Créneau modifié"); };
  const delCr = (id) => { setCrs(prev => prev.filter(c => c.id !== id)); flash("Créneau supprimé"); };

  // Caisse
  const addCaisseMvt = (d) => { setCaisseMvts(prev => [...prev, { id: `cm-${uid()}`, ...d }]); flash(d.type === "entree" ? "Entrée enregistrée" : "Sortie enregistrée"); };

  const ctx = { cls, cat, vts, crs, prs, hm, caisseMvts, gc, gp, gf, cv, ch, cs, csFamille, addV, addP, addCl, updCl, togPr, addHM, addCatItem, updCatItem, delCatItem, addCr, updCr, delCr, addCaisseMvt, selC, setSelC, selV, setSelV, tab, setTab, mdl, setMdl, flash, isDesktop };

  return (
    <div style={{ minHeight: "100vh", background: "#12100c", fontFamily: "'DM Sans',sans-serif", color: "#e8dcc8" }}>
      <style>{CSS_GLOBAL}</style>
      {toast && <div style={{ position: "fixed", top: isDesktop ? 20 : 64, left: "50%", transform: "translateX(-50%)", padding: "10px 22px", borderRadius: 10, fontWeight: 600, fontSize: 13, zIndex: 200, boxShadow: "0 8px 32px rgba(0,0,0,.5)", background: toast.t === "info" ? "#1a3d5c" : "#0f3d2a", color: toast.t === "info" ? "#7db8e0" : "#5ae8a0", animation: "ti .3s ease-out" }}>{toast.m}</div>}
      {isDesktop ? <DesktopApp ctx={ctx} /> : <MobileApp ctx={ctx} />}
    </div>
  );
}
