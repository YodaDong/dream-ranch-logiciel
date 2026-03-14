const { DB, queryAll, createPage, updatePage, notion, cors, prop } = require("./_notion");

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  try {
    if (req.method === "GET") {
      const data = await queryAll(DB.PRESENCES);
      const presences = data.map(p => ({
        id: p.id,
        cr: (prop(p, "Créneau") || [])[0] || null,
        date: prop(p, "Date") || "",
        cav: (prop(p, "FICHIER CLIENT") || [])[0] || null,
        // Support both old (checkbox) and new (select) format
        ok: prop(p, "Présent") ?? false,
        statut: prop(p, "Statut") || null,
        forfaitId: (prop(p, "Forfait débité") || [])[0] || null,
        hDebitees: prop(p, "Heures débitées") || 0,
      }));
      return res.status(200).json(presences);
    }
    if (req.method === "POST") {
      const d = req.body;

      // Check if entry already exists for this créneau + date + cavalier
      const existing = await queryAll(DB.PRESENCES, { and: [
        { property: "Créneau", relation: { contains: d.creneauId } },
        { property: "Date", date: { equals: d.date } },
        { property: "FICHIER CLIENT", relation: { contains: d.cavalierId } },
      ]});

      if (existing.length > 0) {
        // Update existing entry
        const props = {};
        if (d.statut) {
          props["Statut"] = { select: { name: d.statut } };
          // Also update legacy checkbox for backward compat
          props["Présent"] = { checkbox: d.statut === "Présent" };
        }
        if (d.forfaitId) {
          props["Forfait débité"] = { relation: [{ id: d.forfaitId }] };
        }
        if (d.heures !== undefined) {
          props["Heures débitées"] = { number: d.heures };
        }
        await updatePage(existing[0].id, props);
        return res.status(200).json({ id: existing[0].id, updated: true });
      } else {
        // Create new entry
        const props = {
          "Nom": { title: [{ text: { content: "" } }] },
          "Créneau": { relation: [{ id: d.creneauId }] },
          "Date": { date: { start: d.date } },
          "FICHIER CLIENT": { relation: [{ id: d.cavalierId }] },
        };
        if (d.statut) {
          props["Statut"] = { select: { name: d.statut } };
          props["Présent"] = { checkbox: d.statut === "Présent" };
        }
        if (d.forfaitId) {
          props["Forfait débité"] = { relation: [{ id: d.forfaitId }] };
        }
        if (d.heures !== undefined) {
          props["Heures débitées"] = { number: d.heures };
        }
        const page = await createPage(DB.PRESENCES, props);
        return res.status(201).json({ id: page.id, created: true });
      }
    }
    if (req.method === "DELETE") {
      // Remove a cavalier from a session (delete the presence entry)
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: "id required" });
      await notion(`/pages/${id}`, "PATCH", { archived: true });
      return res.status(200).json({ ok: true });
    }
    return res.status(405).end();
  } catch (err) { console.error(err); return res.status(500).json({ error: err.message }); }
};
