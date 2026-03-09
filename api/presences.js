const { DB, queryDB, createPage, updatePage, cors, prop } = require("./_notion");

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  try {
    if (req.method === "GET") {
      const data = await queryDB(DB.PRESENCES);
      const presences = data.results.map(p => ({
        id: p.id,
        cr: (prop(p, "Créneau") || [])[0] || null,
        date: prop(p, "Date") || "",
        cav: (prop(p, "FICHIER CLIENT") || [])[0] || null,
        ok: prop(p, "Présent") ?? false,
      }));
      return res.status(200).json(presences);
    }
    if (req.method === "POST") {
      const d = req.body;
      const existing = await queryDB(DB.PRESENCES, { and: [
        { property: "Créneau", relation: { contains: d.creneauId } },
        { property: "Date", date: { equals: d.date } },
        { property: "FICHIER CLIENT", relation: { contains: d.cavalierId } },
      ]});
      if (existing.results.length > 0) {
        const current = prop(existing.results[0], "Présent");
        await updatePage(existing.results[0].id, { "Présent": { checkbox: !current } });
        return res.status(200).json({ id: existing.results[0].id, ok: !current });
      } else {
        const page = await createPage(DB.PRESENCES, {
          "Nom": { title: [{ text: { content: "" } }] },
          "Créneau": { relation: [{ id: d.creneauId }] },
          "Date": { date: { start: d.date } },
          "FICHIER CLIENT": { relation: [{ id: d.cavalierId }] },
          "Présent": { checkbox: true },
        });
        return res.status(201).json({ id: page.id, ok: true });
      }
    }
    return res.status(405).end();
  } catch (err) { console.error(err); return res.status(500).json({ error: err.message }); }
};
