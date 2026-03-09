const { DB, queryDB, createPage, cors, prop } = require("./_notion");

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  try {
    if (req.method === "GET") {
      const data = await queryDB(DB.VENTES);
      const ventes = data.results.map(p => ({
        id: p.id,
        ref: prop(p, "Référence") || "",
        cav: (prop(p, "Cavalier") || [])[0] || null,
        pay: (prop(p, "Client payeur") || [])[0] || null,
        prest: (prop(p, "Prestations") || [])[0] || null,
        detail: prop(p, "Détail") || "",
        mt: prop(p, "Montant TTC") || 0,
        rem: prop(p, "Remise") || 0,
        du: prop(p, "Montant du") || 0,
        tp: 0,
        st: prop(p, "Statut") || "Non payée",
        date: prop(p, "Date") || "",
        pays: [],
        fact: false,
      }));
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
    return res.status(405).end();
  } catch (err) { console.error(err); return res.status(500).json({ error: err.message }); }
};
