const { DB, queryAll, createPage, updatePage, cors, prop } = require("./_notion");

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  try {
    if (req.method === "GET") {
      const data = await queryAll(DB.PAIEMENTS);
      const paiements = data.map(p => ({
        id: p.id,
        ref: prop(p, "Référence") || "",
        ventes: prop(p, "Prestation cavalier") || [],
        mt: prop(p, "Montant") || 0,
        mode: prop(p, "Règlement") || "",
        chq: prop(p, "N° chèque") || "",
        date: prop(p, "Date") || "",
        note: prop(p, "Note") || "",
      }));
      return res.status(200).json(paiements);
    }
    if (req.method === "POST") {
      const d = req.body;
      const now = new Date();
      const ref = `PAY-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,"0")}${String(now.getDate()).padStart(2,"0")}-${String(now.getHours()).padStart(2,"0")}${String(now.getMinutes()).padStart(2,"0")}${String(now.getSeconds()).padStart(2,"0")}`;

      // Support multi-ventes: accept venteId (single) or venteIds (array)
      const venteIds = d.venteIds || (d.venteId ? [d.venteId] : []);

      const properties = {
        "Référence": { title: [{ text: { content: ref } }] },
        "Date": { date: { start: d.date || now.toISOString().slice(0, 10) } },
        "Montant": { number: d.montant || 0 },
        "Règlement": { select: { name: d.mode || "Espèces" } },
      };

      // Multi-ventes relation
      if (venteIds.length > 0) {
        properties["Prestation cavalier"] = { relation: venteIds.map(id => ({ id })) };
      }

      if (d.chq) properties["N° chèque"] = { rich_text: [{ text: { content: d.chq } }] };
      if (d.note) properties["Note"] = { rich_text: [{ text: { content: d.note } }] };

      const page = await createPage(DB.PAIEMENTS, properties);

      // Auto caisse entry for Espèces — WITH bidirectional link
      if (d.mode === "Espèces" && d.montant > 0) {
        try {
          const caisseEntry = await createPage(DB.CAISSE, {
            "Motif": { title: [{ text: { content: d.detail || "Paiement espèces" } }] },
            "Date": { date: { start: d.date || now.toISOString().slice(0, 10) } },
            "Montant": { number: d.montant },
            "Type": { select: { name: "Entrée" } },
            "Auto": { checkbox: true },
            "\uD83D\uDCB5 PAIEMENTS": { relation: [{ id: page.id }] },
          });
          // Link paiement back to caisse
          await updatePage(page.id, {
            "Caisse": { relation: [{ id: caisseEntry.id }] },
          });
        } catch(e) { console.warn("Caisse auto-entry failed:", e.message); }
      }

      return res.status(201).json({ id: page.id, ref });
    }
    return res.status(405).end();
  } catch (err) { console.error(err); return res.status(500).json({ error: err.message }); }
};
