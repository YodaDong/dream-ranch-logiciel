const { DB, queryAll, createPage, cors, prop } = require("./_notion");

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  try {
    if (req.method === "GET") {
      const data = await queryAll(DB.FACTURES);
      const factures = data.map(p => ({
        id: p.id,
        ref: prop(p, "N° Facture") || "",
        date: prop(p, "Date") || "",
        client: (prop(p, "Client") || [])[0] || null,
        ventes: prop(p, "Prestations cavalier") || [],
        ht: prop(p, "Montant HT") || 0,
        tva: prop(p, "TVA") || 0,
        ttc: prop(p, "Montant TTC") || 0,
        statut: prop(p, "Statut") || "",
        type: prop(p, "Type") || "Facture",
      }));
      return res.status(200).json(factures);
    }
    if (req.method === "POST") {
      const d = req.body;
      // Generate sequential invoice number: F-YYYY-NNN
      const year = new Date().getFullYear();
      const existing = await queryAll(DB.FACTURES);
      const yearInvoices = existing.filter(f => {
        const ref = prop(f, "N° Facture") || "";
        return ref.startsWith(`F-${year}-`);
      });
      const nextNum = yearInvoices.length + 1;
      const ref = `F-${year}-${String(nextNum).padStart(3, "0")}`;

      const properties = {
        "N° Facture": { title: [{ text: { content: ref } }] },
        "Date": { date: { start: d.date || new Date().toISOString().slice(0, 10) } },
        "Montant HT": { number: d.ht || 0 },
        "TVA": { number: d.tva || 0 },
        "Montant TTC": { number: d.ttc || 0 },
        "Statut": { select: { name: d.statut || "Émise" } },
        "Type": { select: { name: d.type || "Facture" } },
      };

      if (d.clientId) properties["Client"] = { relation: [{ id: d.clientId }] };
      if (d.venteIds && d.venteIds.length > 0) {
        properties["Prestations cavalier"] = { relation: d.venteIds.map(id => ({ id })) };
      }

      const page = await createPage(DB.FACTURES, properties);
      return res.status(201).json({ id: page.id, ref });
    }
    return res.status(405).end();
  } catch (err) { console.error(err); return res.status(500).json({ error: err.message }); }
};
