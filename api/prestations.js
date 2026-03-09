const { DB, queryDB, cors, prop } = require("./_notion");

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "GET only" });

  try {
    const data = await queryDB(DB.PRESTATIONS, 
      { property: "Active", checkbox: { equals: true } },
      [{ property: "Nom", direction: "ascending" }]
    );
    const prestations = data.results.map(p => ({
      id: p.id,
      nom: prop(p, "Nom"),
      cat: prop(p, "Catégorie"),
      prix: prop(p, "Prix TTC") || 0,
      tva: prop(p, "TVA %") || 0,
      h: prop(p, "heure") || 0,
      actif: prop(p, "Active") ?? true,
    }));
    return res.status(200).json(prestations);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
