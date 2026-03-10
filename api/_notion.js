const NOTION_KEY = process.env.NOTION_KEY;
const NOTION_VERSION = "2022-06-28";

const DB = {
  CLIENTS:          "31bdae11-828a-80b3-97b5-c3446bfde644",
  PRESTATIONS:      "31bdae11-828a-806a-8edc-f04cabc7eca3",
  VENTES:           "31bdae11-828a-8029-a6da-ebcae1780a06",
  PAIEMENTS:        "31bdae11-828a-802e-8a3f-d2ae894e2f22",
  FACTURES:         "31bdae11-828a-801e-9f94-c3849530d1ae",
  PLANNING:         "31edae11-828a-80cb-8c90-e962093b1957",
  PRESENCES:        "31edae11-828a-80ea-81c9-f622e3e3900c",
  HEURES_MANUELLES: "31edae11-828a-80b2-a4f4-fc8650bd3977",
  CAISSE:           "31edae11-828a-80b8-a702-fa23da998918",
};

async function notion(path, method = "GET", body = null) {
  const opts = { method, headers: { "Authorization": `Bearer ${NOTION_KEY}`, "Notion-Version": NOTION_VERSION, "Content-Type": "application/json" } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`https://api.notion.com/v1${path}`, opts);
  if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(`Notion ${res.status}: ${err.message || JSON.stringify(err)}`); }
  return res.json();
}

// Query with auto-pagination (fetches ALL results)
async function queryAll(dbId, filter) {
  let all = [], cursor = undefined;
  do {
    const body = { page_size: 100 };
    if (filter) body.filter = filter;
    if (cursor) body.start_cursor = cursor;
    const data = await notion(`/databases/${dbId}/query`, "POST", body);
    all = all.concat(data.results);
    cursor = data.has_more ? data.next_cursor : null;
  } while (cursor);
  return all;
}

async function createPage(dbId, properties) {
  return notion("/pages", "POST", { parent: { database_id: dbId }, properties });
}

async function updatePage(pageId, properties) {
  return notion(`/pages/${pageId}`, "PATCH", { properties });
}

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function prop(page, name) {
  const p = page.properties[name];
  if (!p) return null;
  switch (p.type) {
    case "title": return p.title.map(t => t.plain_text).join("");
    case "rich_text": return p.rich_text.map(t => t.plain_text).join("");
    case "number": return p.number;
    case "select": return p.select?.name || null;
    case "checkbox": return p.checkbox;
    case "date": return p.date?.start || null;
    case "relation": return p.relation.map(r => r.id);
    case "formula":
      if (p.formula.type === "string") return p.formula.string;
      if (p.formula.type === "number") return p.formula.number;
      return null;
    case "rollup":
      if (p.rollup.type === "number") return p.rollup.number;
      return null;
    case "email": return p.email;
    default: return null;
  }
}

module.exports = { DB, notion, queryAll, createPage, updatePage, cors, prop };
