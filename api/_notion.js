// ============================================================
// DREAM RANCH — Notion API Configuration
// ============================================================

const NOTION_KEY = process.env.NOTION_KEY;
const NOTION_VERSION = "2022-06-28";

// Database IDs
const DB = {
  CLIENTS:          "31bdae11-828a-80b3-97b5-c3446bfde644",
  PRESTATIONS:      "31bdae11-828a-806a-8edc-f04cabc7eca3",
  VENTES:           "31bdae11-828a-8029-a6da-ebcae1780a06",
  PAIEMENTS:        "31bdae11-828a-802e-8a3f-d2ae894e2f22",
  FACTURES:         "31bdae11-828a-801e-9f94-c3849530d1ae",
  PLANNING:         "31edae11-828a-80cb-8c90-e962093b1957",
  PRESENCES:        "31edae11-828a-80ea-81c9-f622e3e3900c",
  HEURES_MANUELLES: "31bdae11-828a-802d-aca1-ebcc4bf8a426",
  CAISSE:           "31edae11-828a-80b8-a702-fa23da998918",
};

// Helper: call Notion API
async function notion(path, method = "GET", body = null) {
  const opts = {
    method,
    headers: {
      "Authorization": `Bearer ${NOTION_KEY}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`https://api.notion.com/v1${path}`, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Notion ${res.status}: ${err.message || JSON.stringify(err)}`);
  }
  return res.json();
}

// Helper: query a database with optional filter/sorts
async function queryDB(dbId, filter = undefined, sorts = undefined, startCursor = undefined) {
  const body = {};
  if (filter) body.filter = filter;
  if (sorts) body.sorts = sorts;
  if (startCursor) body.start_cursor = startCursor;
  body.page_size = 100;
  return notion(`/databases/${dbId}/query`, "POST", body);
}

// Helper: create a page
async function createPage(dbId, properties) {
  return notion("/pages", "POST", {
    parent: { database_id: dbId },
    properties,
  });
}

// Helper: update a page
async function updatePage(pageId, properties) {
  return notion(`/pages/${pageId}`, "PATCH", { properties });
}

// Helper: get a page
async function getPage(pageId) {
  return notion(`/pages/${pageId}`);
}

// Helper: CORS headers for Vercel
function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

// Helper: extract property value from Notion page
function prop(page, name) {
  const p = page.properties[name];
  if (!p) return null;
  switch (p.type) {
    case "title": return p.title.map(t => t.plain_text).join("");
    case "rich_text": return p.rich_text.map(t => t.plain_text).join("");
    case "number": return p.number;
    case "select": return p.select?.name || null;
    case "multi_select": return p.multi_select.map(s => s.name);
    case "checkbox": return p.checkbox;
    case "date": return p.date?.start || null;
    case "relation": return p.relation.map(r => r.id);
    case "formula":
      if (p.formula.type === "string") return p.formula.string;
      if (p.formula.type === "number") return p.formula.number;
      if (p.formula.type === "boolean") return p.formula.boolean;
      return p.formula[p.formula.type];
    case "rollup":
      if (p.rollup.type === "number") return p.rollup.number;
      if (p.rollup.type === "array") return p.rollup.array;
      return null;
    case "email": return p.email;
    case "phone_number": return p.phone_number;
    default: return null;
  }
}

module.exports = { DB, notion, queryDB, createPage, updatePage, getPage, cors, prop };
