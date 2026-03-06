import { useState, useRef, useEffect } from "react";

// ─── CONFIG API ─────────────────────────────────────────────────────────────
const API = {
  clients: "https://n8n.srv908649.hstgr.cloud/webhook/clients",
  prestations: "https://n8n.srv908649.hstgr.cloud/webhook/08bdad39-781b-4c8d-9bc3-dc4a876be368",
  encaissement: "https://n8n.srv908649.hstgr.cloud/webhook/18d0b341-d10a-4f59-ac91-4ccf9bfe3eb5",
};

// ─── HELPERS ────────────────────────────────────────────────────────────────
const catColors = {
  Cours: { bg: "#E8F5E9", text: "#2E7D32", border: "#A5D6A7" },
  Forfait: { bg: "#E0F7FA", text: "#00695C", border: "#80CBC4" },
  "Adhésion": { bg: "#E3F2FD", text: "#1565C0", border: "#90CAF9" },
  Licence: { bg: "#FFF3E0", text: "#E65100", border: "#FFCC80" },
  Stage: { bg: "#F3E5F5", text: "#7B1FA2", border: "#CE93D8" },
  Autre: { bg: "#F5F5F5", text: "#616161", border: "#BDBDBD" },
  "Pension/Location": { bg: "#FFF8E1", text: "#F57F17", border: "#FFE082" },
};

const catBadge = (cat) => {
  const c = catColors[cat] || catColors.Autre;
  return {
    display: "inline-block", padding: "2px 10px", borderRadius: 20,
    fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
    background: c.bg, color: c.text, border: `1px solid ${c.border}`,
  };
};

// ─── SEARCH DROPDOWN ────────────────────────────────────────────────────────
function SearchDropdown({ label, icon, placeholder, items, renderItem, onSelect, value, onClear, loading }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = items.filter((item) => {
    const s = `${item.nom || ""} ${item.prenom || ""} ${item.categorie || ""} ${item.type || ""}`.toLowerCase();
    return query.toLowerCase().split(" ").every(w => s.includes(w));
  });

  if (value) {
    return (
      <div style={styles.fieldGroup}>
        <label style={styles.label}>{icon} {label}</label>
        <div style={styles.selectedChip}>
          <span>{renderItem(value, true)}</span>
          <button onClick={onClear} style={styles.clearBtn}>✕</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.fieldGroup} ref={ref}>
      <label style={styles.label}>{icon} {label}</label>
      <div style={styles.searchWrap}>
        <span style={styles.searchIcon}>⌕</span>
        <input style={styles.searchInput} type="text"
          placeholder={loading ? "Chargement..." : placeholder}
          disabled={loading}
          value={query} onChange={(e) => { setQuery(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} />
      </div>
      {open && !loading && (
        <div style={styles.dropdown}>
          {filtered.length === 0 ? (
            <div style={styles.dropdownEmpty}>Aucun résultat</div>
          ) : filtered.slice(0, 20).map((item) => (
            <div key={item.id} style={styles.dropdownItem}
              onClick={() => { onSelect(item); setQuery(""); setOpen(false); }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f8f5f0")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
              {renderItem(item)}
            </div>
          ))}
          {filtered.length > 20 && <div style={styles.dropdownEmpty}>{filtered.length - 20} résultats de plus…</div>}
        </div>
      )}
    </div>
  );
}

// ─── PRESTATION LINE ────────────────────────────────────────────────────────
function PrestationLine({ item, enfants, parent, onChange, onRemove }) {
  const personneOptions = parent ? [parent, ...enfants] : enfants;
  return (
    <div style={styles.prestaCard}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#3e2c1a" }}>{item.prestation.nom}</div>
          <div style={{ marginTop: 4 }}>
            <span style={catBadge(item.prestation.categorie)}>{item.prestation.categorie}</span>
            {item.prestation.prixTTC > 0 && <span style={{ marginLeft: 10, fontWeight: 600, color: "#8B6914" }}>{item.prestation.prixTTC}€</span>}
          </div>
        </div>
        <button onClick={onRemove} style={styles.removeBtn}>✕</button>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 70px", minWidth: 70 }}>
          <label style={styles.miniLabel}>Qté</label>
          <input type="number" min={1} value={item.quantite}
            onChange={(e) => onChange({ ...item, quantite: Math.max(1, parseInt(e.target.value) || 1) })}
            style={styles.miniInput} />
        </div>
        {item.prestation.prixTTC === 0 && (
          <div style={{ flex: "2 1 100px", minWidth: 100 }}>
            <label style={styles.miniLabel}>Prix (€)</label>
            <input type="number" min={0} value={item.prixManuel || ""}
              onChange={(e) => onChange({ ...item, prixManuel: parseFloat(e.target.value) || 0 })}
              placeholder="Montant" style={styles.miniInput} />
          </div>
        )}
        {item.prestation.needPersonne && (
          <div style={{ flex: "3 1 160px", minWidth: 160 }}>
            <label style={styles.miniLabel}>Cavalier *</label>
            <select value={item.personneId || ""}
              onChange={(e) => onChange({ ...item, personneId: e.target.value || null })}
              style={{ ...styles.miniInput, color: item.personneId ? "#3e2c1a" : "#999" }}>
              <option value="">— Sélectionner —</option>
              {personneOptions.map((p) => (
                <option key={p.id} value={p.id}>{p.prenom} {p.nom} ({p.type})</option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div style={styles.lineTotal}>
        Sous-total : <strong>{item.quantite * (item.prestation.prixTTC || item.prixManuel || 0)}€</strong>
      </div>
    </div>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────────────────────
export default function DreamRanchForm() {
  const [clientsDB, setClientsDB] = useState([]);
  const [prestationsDB, setPrestationsDB] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingPrestas, setLoadingPrestas] = useState(true);
  const [error, setError] = useState(null);

  const [client, setClient] = useState(null);
  const [lignes, setLignes] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [reglement, setReglement] = useState("Espèces");
  const [numCheque, setNumCheque] = useState("");
  const [remise, setRemise] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // ── Charger les données au démarrage ──
  useEffect(() => {
    fetch(API.clients)
      .then(r => r.json())
      .then(data => { setClientsDB(data.clients || []); setLoadingClients(false); })
      .catch(() => { setError("Erreur chargement clients"); setLoadingClients(false); });

    fetch(API.prestations)
      .then(r => r.json())
      .then(data => { setPrestationsDB(data.prestations || []); setLoadingPrestas(false); })
      .catch(() => { setError("Erreur chargement prestations"); setLoadingPrestas(false); });
  }, []);

  const getParent = (c) => {
    if (c.type === "Parent") return c;
    return clientsDB.find(p => p.id === c.parentId) || null;
  };
  const getEnfants = (parentId) => clientsDB.filter(c => c.type === "Enfant" && c.parentId === parentId);

  const parent = client ? getParent(client) : null;
  const enfants = parent ? getEnfants(parent.id) : [];

  const addPrestation = (presta) => {
    if (lignes.find(l => l.prestation.id === presta.id)) return;
    setLignes([...lignes, { prestation: presta, quantite: 1, personneId: null, prixManuel: 0 }]);
  };
  const updateLigne = (idx, val) => { const c = [...lignes]; c[idx] = val; setLignes(c); };
  const removeLigne = (idx) => setLignes(lignes.filter((_, i) => i !== idx));

  const totalBrut = lignes.reduce((s, l) => s + l.quantite * (l.prestation.prixTTC || l.prixManuel || 0), 0);
  const totalNet = Math.max(0, totalBrut - remise);

  const isValid = () => {
    if (!client || lignes.length === 0) return false;
    if (reglement === "Chèque" && !numCheque.trim()) return false;
    return lignes.every(l => !l.prestation.needPersonne || l.personneId);
  };

  const handleSubmit = () => { if (isValid()) setShowSummary(true); };

  const confirmSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        clientId: parent.id,
        personneId: client.id,
        prestations: lignes.map(l => ({
          prestationId: l.prestation.id,
          nom: l.prestation.nom,
          quantite: l.quantite,
          prixUnitaire: l.prestation.prixTTC || l.prixManuel || 0,
          personneId: l.personneId || client.id,
        })),
        montant: totalBrut,
        remise,
        montantNet: totalNet,
        reglement,
        numCheque: reglement === "Chèque" ? numCheque : "",
        date,
      };

      const resp = await fetch(API.encaissement, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) throw new Error("Erreur serveur");

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false); setShowSummary(false); setClient(null); setLignes([]);
        setDate(new Date().toISOString().slice(0, 10)); setReglement("Espèces");
        setNumCheque(""); setRemise(0); setSubmitting(false);
      }, 3000);
    } catch (e) {
      alert("Erreur lors de l'envoi : " + e.message);
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.successScreen}>
          <div style={styles.successIcon}>✓</div>
          <h2 style={{ color: "#2E7D32", fontFamily: "'Playfair Display', serif", fontSize: 28, margin: 0 }}>Enregistré !</h2>
          <p style={{ color: "#666", marginTop: 8, fontSize: 15 }}>Ligne ajoutée au livre de caisse.<br/>Le matching automatique est lancé.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700;900&family=Source+Sans+3:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo}>🐴</div>
          <div>
            <h1 style={styles.title}>Dream Ranch</h1>
            <p style={styles.subtitle}>Saisie terrain — Livre de caisse</p>
          </div>
        </div>
        <div style={styles.dateBadge}>{new Date(date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}</div>
      </header>

      {error && (
        <div style={{ margin: "12px 16px", padding: "12px 16px", background: "#FFF3E0", borderRadius: 12, color: "#E65100", fontSize: 14, fontWeight: 600 }}>
          ⚠️ {error}
        </div>
      )}

      <div style={styles.formBody}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}><span style={styles.stepNum}>1</span> Client</h2>
          <SearchDropdown label="Rechercher" icon="👤" placeholder="Nom, prénom…"
            items={clientsDB} value={client} loading={loadingClients}
            onClear={() => { setClient(null); setLignes([]); }}
            onSelect={setClient}
            renderItem={(c, chip) => (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: c.type === "Parent" ? "#8B6914" : "#C4A35A",
                  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, flexShrink: 0
                }}>{(c.prenom || "?")[0]}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#3e2c1a" }}>{c.prenom} {c.nom}</div>
                  {!chip && <div style={{ fontSize: 12, color: "#999" }}>
                    {c.type}{c.type === "Enfant" ? ` — enfant de ${getParent(c)?.prenom || "?"}` : ""}
                  </div>}
                </div>
              </div>
            )} />
          {client && parent && (
            <div style={styles.clientInfo}>
              <div style={styles.infoRow}><span style={styles.infoLabel}>Parent facturé</span><span style={styles.infoValue}>{parent.prenom} {parent.nom}</span></div>
              {parent.email && <div style={styles.infoRow}><span style={styles.infoLabel}>Email</span><span style={styles.infoValue}>{parent.email}</span></div>}
              {enfants.length > 0 && <div style={styles.infoRow}><span style={styles.infoLabel}>Enfants</span><span style={styles.infoValue}>{enfants.map(e => e.prenom).join(", ")}</span></div>}
            </div>
          )}
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}><span style={styles.stepNum}>2</span> Prestations</h2>
          <SearchDropdown label="Ajouter" icon="📋" placeholder="Cours, stage, forfait…"
            items={prestationsDB.filter(p => !lignes.find(l => l.prestation.id === p.id))}
            value={null} onClear={() => {}} onSelect={addPrestation} loading={loadingPrestas}
            renderItem={(p) => (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#3e2c1a" }}>{p.nom}</div>
                  <span style={catBadge(p.categorie)}>{p.categorie}</span>
                </div>
                {p.prixTTC > 0 && <span style={{ fontWeight: 700, color: "#8B6914", fontSize: 15 }}>{p.prixTTC}€</span>}
              </div>
            )} />
          {lignes.length > 0 && (
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              {lignes.map((l, i) => (
                <PrestationLine key={l.prestation.id} item={l} enfants={enfants} parent={parent}
                  onChange={(v) => updateLigne(i, v)} onRemove={() => removeLigne(i)} />
              ))}
            </div>
          )}
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}><span style={styles.stepNum}>3</span> Règlement</h2>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>📅 Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={styles.input} />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>💳 Mode de règlement</label>
            <div style={styles.toggleRow}>
              {["Espèces", "Chèque", "Virement", "CB"].map((m) => (
                <button key={m} onClick={() => setReglement(m)}
                  style={{ ...styles.toggleBtn, ...(reglement === m ? styles.toggleActive : {}) }}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          {reglement === "Chèque" && (
            <div style={styles.fieldGroup}>
              <label style={styles.label}>N° de chèque *</label>
              <input type="text" value={numCheque} onChange={(e) => setNumCheque(e.target.value)} placeholder="Ex : 1234567" style={styles.input} />
            </div>
          )}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>🏷️ Remise (€)</label>
            <input type="number" min={0} value={remise} onChange={(e) => setRemise(Math.max(0, parseFloat(e.target.value) || 0))} style={styles.input} />
          </div>
        </section>

        {lignes.length > 0 && (
          <div style={styles.totalBar}>
            <div>
              {remise > 0 && <div style={{ fontSize: 13, color: "#999", textDecoration: "line-through" }}>{totalBrut}€</div>}
              <div style={{ fontSize: 28, fontWeight: 900, color: "#3e2c1a", fontFamily: "'Playfair Display', serif" }}>{totalNet}€</div>
            </div>
            <button onClick={handleSubmit} disabled={!isValid()}
              style={{ ...styles.submitBtn, opacity: isValid() ? 1 : 0.4, cursor: isValid() ? "pointer" : "not-allowed" }}>
              Valider ➜
            </button>
          </div>
        )}
      </div>

      {showSummary && (
        <div style={styles.overlay} onClick={() => !submitting && setShowSummary(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#3e2c1a", fontSize: 22, margin: "0 0 16px" }}>Récapitulatif</h3>
            <div style={styles.summaryRow}><span>Client</span><strong>{parent?.prenom} {parent?.nom}</strong></div>
            {lignes.map((l) => {
              const pers = l.personneId ? clientsDB.find(c => c.id === l.personneId) : null;
              const prix = l.prestation.prixTTC || l.prixManuel || 0;
              return (
                <div key={l.prestation.id} style={styles.summaryRow}>
                  <span>{l.prestation.nom} × {l.quantite}</span>
                  <span>{pers && <span style={{ fontSize: 12, color: "#8B6914" }}>({pers.prenom}) </span>}<strong>{l.quantite * prix}€</strong></span>
                </div>
              );
            })}
            {remise > 0 && <div style={styles.summaryRow}><span>Remise</span><strong>-{remise}€</strong></div>}
            <div style={{ ...styles.summaryRow, borderTop: "2px solid #3e2c1a", paddingTop: 12, marginTop: 8 }}>
              <strong style={{ fontSize: 18 }}>Total</strong>
              <strong style={{ fontSize: 22, color: "#8B6914" }}>{totalNet}€</strong>
            </div>
            <div style={{ ...styles.summaryRow, borderTop: "none" }}>
              <span>Règlement</span><span>{reglement}{reglement === "Chèque" ? ` n°${numCheque}` : ""}</span>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowSummary(false)} disabled={submitting} style={styles.cancelBtn}>Modifier</button>
              <button onClick={confirmSubmit} disabled={submitting}
                style={{ ...styles.confirmBtn, opacity: submitting ? 0.6 : 1 }}>
                {submitting ? "Envoi..." : "Confirmer ✓"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── STYLES ─────────────────────────────────────────────────────────────────
const styles = {
  page: { minHeight: "100vh", background: "linear-gradient(165deg, #faf6f0 0%, #f2ebe0 50%, #e8dfd2 100%)", fontFamily: "'Source Sans 3', -apple-system, sans-serif", maxWidth: 540, margin: "0 auto", position: "relative" },
  header: { background: "linear-gradient(135deg, #3e2c1a 0%, #5a3e28 100%)", padding: "24px 20px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  headerInner: { display: "flex", alignItems: "center", gap: 14 },
  logo: { fontSize: 36, width: 52, height: 52, background: "rgba(255,255,255,0.12)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" },
  title: { margin: 0, color: "#f5e6c8", fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900, letterSpacing: -0.5 },
  subtitle: { margin: "2px 0 0", color: "rgba(245,230,200,0.6)", fontSize: 13, fontWeight: 400 },
  dateBadge: { background: "rgba(245,230,200,0.15)", color: "#f5e6c8", padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600 },
  formBody: { padding: "12px 16px 100px" },
  section: { background: "#fff", borderRadius: 16, padding: "20px 18px", marginTop: 14, boxShadow: "0 1px 4px rgba(62,44,26,0.06)", border: "1px solid rgba(62,44,26,0.06)" },
  sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#3e2c1a", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 10 },
  stepNum: { width: 28, height: 28, borderRadius: "50%", background: "#3e2c1a", color: "#f5e6c8", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 },
  fieldGroup: { marginBottom: 14 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#7a6b5a", marginBottom: 6 },
  searchWrap: { position: "relative" },
  searchIcon: { position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 18, color: "#bbb", pointerEvents: "none" },
  searchInput: { width: "100%", boxSizing: "border-box", padding: "12px 14px 12px 38px", border: "1.5px solid #e0d6c8", borderRadius: 12, fontSize: 15, outline: "none", background: "#fdfbf8", color: "#3e2c1a" },
  input: { width: "100%", boxSizing: "border-box", padding: "12px 14px", border: "1.5px solid #e0d6c8", borderRadius: 12, fontSize: 15, outline: "none", background: "#fdfbf8", color: "#3e2c1a" },
  dropdown: { marginTop: 4, background: "#fff", border: "1.5px solid #e0d6c8", borderRadius: 12, maxHeight: 240, overflowY: "auto", boxShadow: "0 8px 24px rgba(62,44,26,0.10)", zIndex: 10, position: "relative" },
  dropdownItem: { padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid #f5f0ea", transition: "background 0.15s" },
  dropdownEmpty: { padding: "16px", textAlign: "center", color: "#bbb", fontSize: 14 },
  selectedChip: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fdfbf8", border: "1.5px solid #C4A35A", borderRadius: 12, padding: "10px 14px" },
  clearBtn: { background: "none", border: "none", fontSize: 16, color: "#bbb", cursor: "pointer", padding: "2px 6px" },
  clientInfo: { marginTop: 12, padding: "12px 14px", background: "#faf6f0", borderRadius: 10, border: "1px solid #e8dfd2" },
  infoRow: { display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 14 },
  infoLabel: { color: "#999", fontWeight: 500 },
  infoValue: { color: "#3e2c1a", fontWeight: 600, textAlign: "right", maxWidth: "60%", wordBreak: "break-word" },
  prestaCard: { background: "#fdfbf8", border: "1.5px solid #e8dfd2", borderRadius: 12, padding: 14 },
  removeBtn: { background: "none", border: "none", color: "#ccc", fontSize: 18, cursor: "pointer", padding: "2px 6px" },
  miniLabel: { display: "block", fontSize: 12, color: "#999", marginBottom: 4, fontWeight: 600 },
  miniInput: { width: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1.5px solid #e0d6c8", borderRadius: 8, fontSize: 14, background: "#fff", color: "#3e2c1a", outline: "none" },
  lineTotal: { marginTop: 10, textAlign: "right", fontSize: 14, color: "#8B6914" },
  toggleRow: { display: "flex", gap: 6, flexWrap: "wrap" },
  toggleBtn: { flex: "1 1 auto", padding: "10px 8px", border: "1.5px solid #e0d6c8", borderRadius: 12, background: "#fdfbf8", fontSize: 14, fontWeight: 500, color: "#7a6b5a", cursor: "pointer", textAlign: "center", minWidth: 70 },
  toggleActive: { borderColor: "#8B6914", background: "#fdf6e3", color: "#3e2c1a", fontWeight: 700, boxShadow: "0 0 0 1px #8B6914" },
  totalBar: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 540, background: "#fff", borderTop: "1px solid #e8dfd2", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", boxSizing: "border-box", boxShadow: "0 -4px 20px rgba(62,44,26,0.08)" },
  submitBtn: { background: "linear-gradient(135deg, #3e2c1a, #5a3e28)", color: "#f5e6c8", border: "none", borderRadius: 14, padding: "14px 32px", fontSize: 16, fontWeight: 700, cursor: "pointer", letterSpacing: 0.5 },
  overlay: { position: "fixed", inset: 0, background: "rgba(62,44,26,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16 },
  modal: { background: "#fff", borderRadius: 20, padding: "28px 24px", maxWidth: 440, width: "100%", boxShadow: "0 20px 60px rgba(62,44,26,0.2)", maxHeight: "80vh", overflowY: "auto" },
  summaryRow: { display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 14, color: "#3e2c1a", borderBottom: "1px solid #f5f0ea" },
  cancelBtn: { flex: 1, padding: "14px", border: "1.5px solid #e0d6c8", borderRadius: 14, background: "#fff", fontSize: 15, fontWeight: 600, color: "#7a6b5a", cursor: "pointer" },
  confirmBtn: { flex: 2, padding: "14px", border: "none", borderRadius: 14, background: "linear-gradient(135deg, #2E7D32, #43A047)", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer" },
  successScreen: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh", textAlign: "center", padding: 40 },
  successIcon: { width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #E8F5E9, #C8E6C9)", color: "#2E7D32", fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, fontWeight: 700 },
};
