const { DB, queryDB, createPage, updatePage, cors, prop } = require("./_notion");

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  try {
    if (req.method === "GET") {
      const data = await queryDB(DB.PLANNING);
      const creneaux = data.results.map(p => ({
        id: p.id,
        nom: prop(p, "Nom") || "",
        jour: prop(p, "Jour") || "",
        heure: prop(p, "Start Date") || "",
        duree: prop(p, "Minutes") || 60,
        cavs: prop(p, "Cavaliers") || [],
      }));
      return res.status(200).json(creneaux);
    }
    if (req.method === "POST") {
      const d = req.body;
      const properties = {
        "Nom": { title: [{ text: { content: d.nom || "" } }] },
        "Jour": { select: { name: d.jour } },
        "Start Date": { rich_text: [{ text: { content: d.heure || "" } }] },
        "Minutes": { number: d.duree || 60 },
      };
      if (d.cavs && d.cavs.length > 0) properties["Cavaliers"] = { relation: d.cavs.map(id => ({ id })) };
      const page = await createPage(DB.PLANNING, properties);
      return res.status(201).json({ id: page.id });
    }
    if (req.method === "PATCH") {
      const { id, ...d } = req.body;
      if (!id) return res.status(400).json({ error: "id required" });
      const properties = {};
      if (d.nom !== undefined) properties["Nom"] = { title: [{ text: { content: d.nom } }] };
      if (d.jour !== undefined) properties["Jour"] = { select: { name: d.jour } };
      if (d.heure !== undefined) properties["Start Date"] = { rich_text: [{ text: { content: d.heure } }] };
      if (d.duree !== undefined) properties["Minutes"] = { number: d.duree };
      if (d.cavs !== undefined) properties["Cavaliers"] = { relation: d.cavs.map(cid => ({ id: cid })) };
      await updatePage(id, properties);
      return res.status(200).json({ ok: true });
    }
    return res.status(405).end();
  } catch (err) { console.error(err); return res.status(500).json({ error: err.message }); }
};
