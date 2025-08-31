# Voice Command Shopping Assistant (Full-Stack)

This repository contains:
- `backend/` — Node.js + Express + MongoDB API
- `frontend/` — React + Web Speech API app

## Features

### Core Shopping Features
- **Voice Commands**: Add, remove, and search items using natural language
- **Multi-language Support**: English and Hindi voice commands
- **Smart Suggestions**: History-based and seasonal recommendations
- **Search Integration**: Find products with price filtering

### 💰 **NEW: Cost Management Features**
- **Individual Item Costs**: Set and track cost for each shopping item
- **Total Cost Calculation**: Real-time shopping list total
- **Budget Tracking**: Set budget limits with visual indicators
- **Cost-based Voice Commands**: "Add milk for 50 rupees"
- **Cost Input Fields**: Easy cost editing in the UI
- **Budget Alerts**: Visual warnings when approaching or exceeding budget

## Quickstart (Local)
- Start MongoDB locally (or use Atlas), then:
```
cd backend
cp .env.example .env
npm install
npm run dev
```
- In another terminal:
```
cd frontend
cp .env.example .env
npm install
npm run dev
```
Open http://localhost:5173

## Voice Command Examples

### Basic Commands
- "Add 2 milk" - Add 2 units of milk
- "Remove bread" - Remove bread from list
- "Find apples under 100" - Search for apples under ₹100

### **NEW: Cost Commands**
- "Add milk for 50 rupees" - Add milk with cost ₹50
- "Add 3 apples for 25 each" - Add 3 apples at ₹25 each
- "Buy bread for 30" - Add bread with cost ₹30

## Deployment
- Backend: deploy to Render/Render or Railway/AWS/Fly; set `MONGO_URI` env.
- Frontend: deploy to Netlify/Vercel; set `VITE_API_BASE` to your backend URL.

## Approach (<=200 words)
We built a minimalist voice-first shopping assistant with comprehensive cost management. The frontend uses the browser's Web Speech API to capture speech with live feedback. A lightweight NLP layer extracts intents (add/remove/search), quantities, costs, and price filters for both English and Hindi keywords. The backend stores items in MongoDB with cost tracking, calculates total shopping list costs, and exposes seasonal recommendations and substitutes. Search runs against a demo in-memory catalog but can be swapped with any provider. Items are auto-categorized via a simple map. The UI includes cost input fields, budget tracking with visual indicators, and total cost display. The cost feature supports voice commands like "add milk for 50 rupees" and provides real-time budget monitoring. The code is production-ready for a small demo: MVC structure, error handling, environment-based URLs, and clean React state updates.
