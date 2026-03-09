const { DB, queryDB, createPage, updatePage, cors, prop } = require("./_notion");

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    // GET — list all clients
    if (req.method === "GET") {
      const data = await queryDB(DB.CLIENTS, undefined, [
        { property: "Nom", direction: "ascending" },
      ]);
      const clients = data.results.map(p => ({
        id: p.id,
        nom: prop(p, "Nom"),
        prenom: prop(p, "Prénom"),
        type: prop(p, "Type"),
        email: prop(p, "Email"),
        tel: prop(p, "Téléphone"),
        naissance: prop(p, "Date de naissance"),
        adresse: prop(p, "Adresse"),
        cp: prop(p, "Code postal"),
        ville: prop(p, "Ville"),
        parentId: (prop(p, "Parent") || [])[0] || null,
        enfantsIds: prop(p, "Enfants") || [],
        actif: prop(p, "Actif") ?? true,
      }));
      return res.status(200).json(clients);
    }

    // POST — create client
    if (req.method === "POST") {
      const d = req.body;
      const properties = {
        "Nom": { title: [{ text: { content: d.nom || "" } }] },
        "Prénom": { rich_text: [{ text: { content: d.prenom || "" } }] },
        "Type": { select: { name: d.type || "Enfant" } },
      };
      if (d.email) properties["Email"] = { email: d.email };
      if (d.tel) properties["Téléphone"] = { phone_number: d.tel };
      if (d.naissance) properties["Date de naissance"] = { date: { start: d.naissance } };
      if (d.adresse) properties["Adresse"] = { rich_text: [{ text: { content: d.adresse } }] };
      if (d.cp) properties["Code postal"] = { rich_text: [{ text: { content: d.cp } }] };
      if (d.ville) properties["Ville"] = { rich_text: [{ text: { content: d.ville } }] };
      if (d.parentId) properties["Parent"] = { relation: [{ id: d.parentId }] };

      const page = await createPage(DB.CLIENTS, properties);
      return res.status(201).json({ id: page.id });
    }

    // PATCH — update client
    if (req.method === "PATCH") {
      const { id, ...d } = req.body;
      if (!id) return res.status(400).json({ error: "id required" });
      const properties = {};
      if (d.nom !== undefined) properties["Nom"] = { title: [{ text: { content: d.nom } }] };
      if (d.prenom !== undefined) properties["Prénom"] = { rich_text: [{ text: { content: d.prenom } }] };
      if (d.email !== undefined) properties["Email"] = { email: d.email || null };
      if (d.tel !== undefined) properties["Téléphone"] = { phone_number: d.tel || null };
      if (d.naissance !== undefined) properties["Date de naissance"] = { date: d.naissance ? { start: d.naissance } : null };
      if (d.adresse !== undefined) properties["Adresse"] = { rich_text: [{ text: { content: d.adresse || "" } }] };
      if (d.cp !== undefined) properties["Code postal"] = { rich_text: [{ text: { content: d.cp || "" } }] };
      if (d.ville !== undefined) properties["Ville"] = { rich_text: [{ text: { content: d.ville || "" } }] };

      await updatePage(id, properties);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
