const { DB, queryAll, createPage, updatePage, notion, cors, prop } = require("./_notion");

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  try {
    if (req.method === "GET") {
      // Get all ventes and all paiements in parallel
      const [ventesRaw, paiementsRaw] = await Promise.all([
        queryAll(DB.VENTES),
        queryAll(DB.PAIEMENTS).catch(() => []),
      ]);
      // Build paiements map: venteId -> [{mt, mode, date, chq}]
      const payMap = {};
      for (const p of paiementsRaw) {
        const venteIds = prop(p, "Prestation cavalier") || [];
        const pay = { id: p.id, mt: prop(p, "Montant") || 0, mode: prop(p, "Règlement") || "", date: prop(p, "Date") || "", chq: prop(p, "N° chèque") || "" };
        for (const vid of venteIds) {
          if (!payMap[vid]) payMap[vid] = [];
          payMap[vid].push(pay);
        }
      }
      const ventes = ventesRaw.map(p => {
        const pays = payMap[p.id] || [];
        const tp = pays.reduce((s, py) => s + py.mt, 0);
        const mt = prop(p, "Montant TTC") || 0;
        const rem = prop(p, "Remise") || 0;
        const du = mt - rem;
        const st = tp <= 0 ? "Non payée" : tp >= du ? "Soldée" : "Partielle";
        return {
          id: p.id, ref: prop(p, "Référence") || "", cav: (prop(p, "Cavalier") || [])[0] || null,
          pay: (prop(p, "Client payeur") || [])[0] || null, prest: (prop(p, "Prestations") || [])[0] || null,
          detail: prop(p, "Détail") || "", mt, rem, du, tp, st, date: prop(p, "Date") || "", pays, fact: false,
        };
      });
      return res.status(200).json(ventes);
    }
    if (req.method === "POST") {
      const d = req.body;
      const now = new Date();
      const ref = `V-${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}${String(now.getDate()).padStart(2,"0")}-${String(now.getHours()).padStart(2,"0")}${String(now.getMinutes()).padStart(2,"0")}${String(now.getSeconds()).padStart(2,"0")}`;
      const properties = {
        "Référence": { title: [{ text: { content: ref } }] },
        "Date": { date: { start: d.date || now.toISOString().slice(0, 10) } },
        "Cavalier": { relation: [{ id: d.cavalier }] },
        "Client payeur": { relation: [{ id: d.payeur }] },
        "Prestations": { relation: [{ id: d.prestation }] },
        "Détail": { rich_text: [{ text: { content: d.detail || "" } }] },
        "Montant TTC": { number: d.prix || 0 },
        "Remise": { number: d.remise || 0 },
      };
      const page = await createPage(DB.VENTES, properties);
      return res.status(201).json({ id: page.id, ref });
    }
    if (req.method === "DELETE") {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: "id required" });
      await updatePage(id, {});
      // Archive the page
      const archiveRes = await notion(`/pages/${id}`, "PATCH", { archived: true });
      return res.status(200).json({ ok: true });
    }
    return res.status(405).end();
  } catch (err) { console.error(err); return res.status(500).json({ error: err.message }); }
};
