# Voice Shopping Assistant — Backend (Node.js + Express + MongoDB)

## Setup
1. Create `.env` from `.env.example` and set `MONGO_URI`.
2. Install deps: `npm install`
3. Run dev: `npm run dev` (defaults to port 4000)

## API
- `GET /health`
- `GET /api/list` — fetch items
- `POST /api/list` — add item `{ name, quantity }`
- `PATCH /api/list/:id` — update `{ quantity, checked }`
- `DELETE /api/list/:id` — remove
- `GET /api/suggestions` — returns `{ likely[], seasonal[] }`
- `GET /api/suggestions/substitutes?name=milk` — returns alternatives
- `GET /api/search?q=apples&maxPrice=100` — demo search
