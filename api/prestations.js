const { DB, queryAll, cors, prop } = require("./_notion");

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).end();
  try {
    const data = await queryAll(DB.PRESTATIONS, { property: "Active", checkbox: { equals: true } });
    const prestations = data.map(p => ({
      id: p.id,
      nom: prop(p, "Nom") || "",
      cat: prop(p, "Catégorie") || "Autre",
      prix: prop(p, "Prix TTC") || 0,
      tva: prop(p, "TVA %") || 0,
      h: prop(p, "heure") || 0,
      impH: prop(p, "Impacte les heures") || false,
      needP: prop(p, "Nécessite une personne") || false,
      actif: true,
    }));
    return res.status(200).json(prestations);
  } catch (err) { console.error(err); return res.status(500).json({ error: err.message }); }
};
