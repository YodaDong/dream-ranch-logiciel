const { DB, queryAll, createPage, cors, prop } = require("./_notion");

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  try {
    if (req.method === "GET") {
      const data = await queryAll(DB.HEURES_MANUELLES);
      const heures = data.map(p => ({
        id: p.id,
        cav: (prop(p, "Cavalier") || [])[0] || null,
        delta: prop(p, "Delta") || 0,
        motif: prop(p, "Détail") || "",
        date: prop(p, "Date") || "",
      }));
      return res.status(200).json(heures);
    }
    if (req.method === "POST") {
      const d = req.body;
      const page = await createPage(DB.HEURES_MANUELLES, {
        "Détail": { title: [{ text: { content: d.motif || "Ajustement" } }] },
        "Cavalier": { relation: [{ id: d.cavalier }] },
        "Delta": { number: d.delta || 0 },
        "Date": { date: { start: d.date || new Date().toISOString().slice(0, 10) } },
      });
      return res.status(201).json({ id: page.id });
    }
    return res.status(405).end();
  } catch (err) { console.error(err); return res.status(500).json({ error: err.message }); }
};
