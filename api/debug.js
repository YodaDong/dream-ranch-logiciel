const { DB, notion, cors } = require("./_notion");

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  
  try {
    const results = {};
    for (const [name, id] of Object.entries(DB)) {
      try {
        const db = await notion(`/databases/${id}`);
        results[name] = Object.entries(db.properties).map(([k, v]) => ({
          name: k,
          type: v.type,
        }));
      } catch (e) {
        results[name] = { error: e.message };
      }
    }
    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
