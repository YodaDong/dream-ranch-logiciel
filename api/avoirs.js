const { DB, queryAll, createPage, updatePage, cors, prop } = require("./_notion");

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  try {
    if (req.method === "GET") {
      const data = await queryAll(DB.AVOIRS);
      const avoirs = data.map(p => ({
        id: p.id,
        ref: prop(p, "Référence") || "",
        date: prop(p, "Date") || "",
        client: (prop(p, "Client") || [])[0] || null,
        venteOrigine: (prop(p, "Vente d origine") || [])[0] || null,
        montant: prop(p, "Montant") || 0,
        motif: prop(p, "Motif") || "",
        detail: prop(p, "Détail") || "",
        statut: prop(p, "Statut") || "Actif",
        utiliseSur: (prop(p, "Utilisé sur") || [])[0] || null,
      }));
      return res.status(200).json(avoirs);
    }
    if (req.method === "POST") {
      const d = req.body;
      // Generate sequential reference: AV-YYYY-NNN
      const year = new Date().getFullYear();
      const existing = await queryAll(DB.AVOIRS);
      const yearAvoirs = existing.filter(a => {
        const ref = prop(a, "Référence") || "";
        return ref.startsWith(`AV-${year}-`);
      });
      const nextNum = yearAvoirs.length + 1;
      const ref = `AV-${year}-${String(nextNum).padStart(3, "0")}`;

      const properties = {
        "Référence": { title: [{ text: { content: ref } }] },
        "Date": { date: { start: d.date || new Date().toISOString().slice(0, 10) } },
        "Montant": { number: d.montant || 0 },
        "Statut": { select: { name: "Actif" } },
      };

      if (d.motif) properties["Motif"] = { select: { name: d.motif } };
      if (d.detail) properties["Détail"] = { rich_text: [{ text: { content: d.detail } }] };
      if (d.clientId) properties["Client"] = { relation: [{ id: d.clientId }] };
      if (d.venteId) properties["Vente d origine"] = { relation: [{ id: d.venteId }] };

      const page = await createPage(DB.AVOIRS, properties);
      return res.status(201).json({ id: page.id, ref });
    }
    if (req.method === "PATCH") {
      const { id, ...d } = req.body;
      if (!id) return res.status(400).json({ error: "id required" });
      const properties = {};
      if (d.statut) properties["Statut"] = { select: { name: d.statut } };
      if (d.utiliseSur) properties["Utilisé sur"] = { relation: [{ id: d.utiliseSur }] };
      await updatePage(id, properties);
      return res.status(200).json({ ok: true });
    }
    return res.status(405).end();
  } catch (err) { console.error(err); return res.status(500).json({ error: err.message }); }
};
