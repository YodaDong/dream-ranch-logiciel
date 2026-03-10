const { DB, queryAll, createPage, cors, prop } = require("./_notion");

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  try {
    if (req.method === "GET") {
      const data = await queryAll(DB.CAISSE);
      const mvts = data.results.map(p => ({
        id: p.id,
        motif: prop(p, "Motif") || "",
        date: prop(p, "Date") || "",
        mt: prop(p, "Montant") || 0,
        type: prop(p, "Type") || "",
        auto: prop(p, "Auto") ?? false,
      }));
      return res.status(200).json(mvts);
    }
    if (req.method === "POST") {
      const d = req.body;
      const page = await createPage(DB.CAISSE, {
        "Motif": { title: [{ text: { content: d.motif || "" } }] },
        "Date": { date: { start: d.date || new Date().toISOString().slice(0, 10) } },
        "Montant": { number: d.montant || 0 },
        "Type": { select: { name: d.type || "Entrée" } },
        "Auto": { checkbox: false },
      });
      return res.status(201).json({ id: page.id });
    }
    return res.status(405).end();
  } catch (err) { console.error(err); return res.status(500).json({ error: err.message }); }
};
