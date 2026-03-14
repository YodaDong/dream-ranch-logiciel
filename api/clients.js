const { DB, queryAll, createPage, updatePage, cors, prop } = require("./_notion");

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  try {
    if (req.method === "GET") {
      const data = await queryAll(DB.CLIENTS);
      const clients = data.map(p => ({
        id: p.id,
        nom: prop(p, "Nom") || "",
        prenom: prop(p, "Prénom") || "",
        type: prop(p, "Type") || "Parent",
        email: prop(p, "Adresse mail") || "",
        tel: prop(p, "Téléphone") || "",
        naissance: prop(p, "Date de naissance") || "",
        adresse: prop(p, "Adresse") || "",
        cp: String(prop(p, "Code postal") || ""),
        ville: prop(p, "Ville") || "",
        parentId: (prop(p, "Parent") || [])[0] || null,
        enfantsIds: prop(p, "Enfants") || [],
        actif: prop(p, "Actif") ?? true,
      }));
      return res.status(200).json(clients);
    }
    if (req.method === "POST") {
      const d = req.body;
      const displayName = `${d.prenom || ""} ${d.nom || ""}`.trim();
      const properties = {
        "Nom complet": { title: [{ text: { content: displayName } }] },
        "Nom": { rich_text: [{ text: { content: d.nom || "" } }] },
        "Prénom": { rich_text: [{ text: { content: d.prenom || "" } }] },
        "Type": { select: { name: d.type || "Enfant" } },
      };
      if (d.email) properties["Adresse mail"] = { email: d.email };
      if (d.tel) properties["Téléphone"] = { rich_text: [{ text: { content: d.tel } }] };
      if (d.naissance) properties["Date de naissance"] = { rich_text: [{ text: { content: d.naissance } }] };
      if (d.adresse) properties["Adresse"] = { rich_text: [{ text: { content: d.adresse } }] };
      if (d.cp) properties["Code postal"] = { number: parseInt(d.cp) || 0 };
      if (d.ville) properties["Ville"] = { rich_text: [{ text: { content: d.ville } }] };
      if (d.parentId) properties["Parent"] = { relation: [{ id: d.parentId }] };
      properties["Actif"] = { checkbox: true };
      const page = await createPage(DB.CLIENTS, properties);
      return res.status(201).json({ id: page.id });
    }
    if (req.method === "PATCH") {
      const { id, ...d } = req.body;
      if (!id) return res.status(400).json({ error: "id required" });
      const properties = {};
      if (d.nom !== undefined) properties["Nom"] = { rich_text: [{ text: { content: d.nom } }] };
      if (d.prenom !== undefined) properties["Prénom"] = { rich_text: [{ text: { content: d.prenom } }] };
      // Update display title if nom or prenom changed
      if (d.nom !== undefined || d.prenom !== undefined) {
        const newNom = d.nom !== undefined ? d.nom : "";
        const newPrenom = d.prenom !== undefined ? d.prenom : "";
        const displayName = `${newPrenom} ${newNom}`.trim();
        if (displayName) properties["Nom complet"] = { title: [{ text: { content: displayName } }] };
      }
      if (d.email !== undefined) properties["Adresse mail"] = { email: d.email || null };
      if (d.tel !== undefined) properties["Téléphone"] = { rich_text: [{ text: { content: d.tel || "" } }] };
      if (d.naissance !== undefined) properties["Date de naissance"] = { rich_text: [{ text: { content: d.naissance || "" } }] };
      if (d.adresse !== undefined) properties["Adresse"] = { rich_text: [{ text: { content: d.adresse || "" } }] };
      if (d.cp !== undefined) properties["Code postal"] = { number: parseInt(d.cp) || 0 };
      if (d.ville !== undefined) properties["Ville"] = { rich_text: [{ text: { content: d.ville || "" } }] };
      await updatePage(id, properties);
      return res.status(200).json({ ok: true });
    }
    return res.status(405).end();
  } catch (err) { console.error(err); return res.status(500).json({ error: err.message }); }
};
