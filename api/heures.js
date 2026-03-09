const { DB, queryDB, createPage, cors, prop } = require("./_notion");

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    // GET — heures manuelles
    if (req.method === "GET") {
      const { cavalier } = req.query || {};
      let filter = undefined;
      if (cavalier) {
        filter = { property: "Cavalier", relation: { contains: cavalier } };
      }
      const data = await queryDB(DB.HEURES_MANUELLES, filter, [
        { property: "Date", direction: "descending" },
      ]);
      const heures = data.results.map(p => ({
        id: p.id,
        cav: (prop(p, "Cavalier") || [])[0] || null,
        delta: prop(p, "Delta") || 0,
        motif: prop(p, "Détail"),
        date: prop(p, "Date"),
      }));
      return res.status(200).json(heures);
    }

    // POST — add heures manuelles
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

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
