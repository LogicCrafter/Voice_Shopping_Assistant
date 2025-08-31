const base = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export const api = {
  list: {
    get: () => fetch(`${base}/api/list`).then(r => r.json()),
    getTotalCost: () => fetch(`${base}/api/list/total-cost`).then(r => r.json()),
    add: (name, quantity, cost) => fetch(`${base}/api/list`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, quantity, cost })
    }).then(r => r.json()),
    remove: (id) => fetch(`${base}/api/list/${id}`, { method: "DELETE" }).then(r => r.json()),
    update: (id, data) => fetch(`${base}/api/list/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(r => r.json())
  },
  search: {
    get: (query, maxPrice) => fetch(`${base}/api/search?q=${query}&maxPrice=${maxPrice || ""}`).then(r => r.json())
  },
  suggestions: {
    get: () => fetch(`${base}/api/suggestions`).then(r => r.json())
  }
};
