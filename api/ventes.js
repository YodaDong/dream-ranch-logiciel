const { DB, queryDB, createPage, updatePage, cors, prop } = require("./_notion");

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    // GET — list ventes (optionally filtered by cavalier)
    if (req.method === "GET") {
      const { cavalier } = req.query || {};
      let filter = undefined;
      if (cavalier) {
        filter = { property: "Cavalier", relation: { contains: cavalier } };
      }
      const data = await queryDB(DB.VENTES, filter, [
        
      ]);
      const ventes = data.results.map(p => ({
        id: p.id,
        ref: prop(p, "Référence"),
        cav: (prop(p, "Cavalier") || undefined)[0] || null,
        pay: (prop(p, "Client payeur") || undefined)[0] || null,
        prest: (prop(p, "Prestation") || undefined)[0] || null,
        detail: prop(p, "Détail"),
        mt: prop(p, "Montant TTC") || 0,
        rem: prop(p, "Remise") || 0,
        du: prop(p, "Montant dû") || 0,
        tp: prop(p, "Total payé") || 0,
        st: prop(p, "Statut paiement") || "Non payée",
        date: prop(p, "Date"),
        fact: prop(p, "Facture générée") ?? false,
      }));
      return res.status(200).json(ventes);
    }

    // POST — create vente
    if (req.method === "POST") {
      const d = req.body;
      const now = new Date();
      const ref = `V-${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}${String(now.getDate()).padStart(2,"0")}-${String(now.getHours()).padStart(2,"0")}${String(now.getMinutes()).padStart(2,"0")}${String(now.getSeconds()).padStart(2,"0")}`;
      const du = (d.prix || 0) - (d.remise || 0);
      
      const properties = {
        "Référence": { title: [{ text: { content: ref } }] },
        "Date": { date: { start: d.date || now.toISOString().slice(0, 10) } },
        "Cavalier": { relation: [{ id: d.cavalier }] },
        "Client payeur": { relation: [{ id: d.payeur }] },
        "Prestation": { relation: [{ id: d.prestation }] },
        "Détail": { rich_text: [{ text: { content: d.detail || "" } }] },
        "Montant TTC": { number: d.prix || 0 },
        "Remise": { number: d.remise || 0 },
      };

      const page = await createPage(DB.VENTES, properties);
      return res.status(201).json({ id: page.id, ref });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
