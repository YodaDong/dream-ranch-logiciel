const { DB, queryDB, createPage, cors, prop } = require("./_notion");

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    // GET — all caisse movements
    if (req.method === "GET") {
      const data = await queryDB(DB.CAISSE, undefined, [
        
      ]);
      const mvts = data.results.map(p => ({
        id: p.id,
        motif: prop(p, "Motif"),
        date: prop(p, "Date"),
        mt: prop(p, "Montant") || 0,
        type: prop(p, "Type"),
        auto: prop(p, "Auto") ?? false,
        paiement: (prop(p, "PAIEMENTS") || undefined)[0] || null,
      }));
      return res.status(200).json(mvts);
    }

    // POST — manual caisse entry
    if (req.method === "POST") {
      const d = req.body;
      const properties = {
        "Motif": { title: [{ text: { content: d.motif || "" } }] },
        "Date": { date: { start: d.date || new Date().toISOString().slice(0, 10) } },
        "Montant": { number: d.montant || 0 },
        "Type": { select: { name: d.type || "Entrée" } },
        "Auto": { checkbox: false },
      };
      const page = await createPage(DB.CAISSE, properties);
      return res.status(201).json({ id: page.id });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
