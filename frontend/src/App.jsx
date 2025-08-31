import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSpeech } from "./lib/speech";
import { parseCommand } from "./lib/nlp";
import { api } from "./lib/api";

export default function App() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");
  const [locale, setLocale] = useState("en-IN");
  const [listening, setListening] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [suggest, setSuggest] = useState({ likely: [], seasonal: [] });
  const [totalCost, setTotalCost] = useState(0);
  const [budget, setBudget] = useState(1000);

  const { start, stop, supported } = useSpeech({
    lang: locale,
    onResult: async (text) => {
      setMessage(text);
      await handleText(text);
    },
    onStart: () => setListening(true),
    onEnd: () => setListening(false)
  });

  async function refresh() {
    const data = await api.list.get();
    setItems(data);
    const costData = await api.list.getTotalCost();
    setTotalCost(costData.totalCost);
  }

  async function loadSuggestions() {
    const s = await api.suggestions.get();
    setSuggest(s);
  }

  useEffect(() => {
    refresh();
    loadSuggestions();
  }, []);

  async function handleText(text) {
    const lc = locale.startsWith("hi") ? "hi" : "en";
    const cmd = parseCommand(text, lc);
    if (cmd.intent === "add" && cmd.item) {
      const created = await api.list.add(cmd.item, cmd.quantity, cmd.cost);
      setItems(prev => [created, ...prev]);
      const costMsg = cmd.cost ? ` for ₹${cmd.cost}` : "";
      setMessage(`Added ${created.name} (${created.quantity})${costMsg}`);
      refresh(); // Refresh to update total cost
    } else if (cmd.intent === "remove" && cmd.item) {
      // try to remove first matching item name
      const found = items.find(i => i.name.toLowerCase().includes(cmd.item.toLowerCase()));
      if (found) {
        await api.list.remove(found._id);
        setItems(prev => prev.filter(x => x._id !== found._id));
        setMessage(`Removed ${found.name}`);
        refresh(); // Refresh to update total cost
      } else {
        setMessage("No matching item to remove");
      }
    } else if (cmd.intent === "search" && (cmd.item || cmd.maxPrice)) {
      const res = await api.search.get(cmd.item, cmd.maxPrice);
      setResults(res);
      setMessage(`Found ${res.length} items`);
    } else {
      setMessage("Sorry, I didn't catch that.");
    }
  }

  const budgetStatus = useMemo(() => {
    if (totalCost === 0) return { status: "neutral", message: "No items yet" };
    if (totalCost > budget) return { status: "over", message: `Over budget by ₹${totalCost - budget}` };
    if (totalCost > budget * 0.8) return { status: "warning", message: `Close to budget: ₹${budget - totalCost} remaining` };
    return { status: "good", message: `₹${budget - totalCost} remaining` };
  }, [totalCost, budget]);

  return (
    <div className="container">
      <div className="card">
        <div className="row" style={{justifyContent:"space-between"}}>
          <h2>🛒 Voice Command Shopping Assistant</h2>
          <div className="row">
            <select value={locale} onChange={e => setLocale(e.target.value)}>
              <option value="en-IN">English (India)</option>
              <option value="en-US">English (US)</option>
              <option value="hi-IN">Hindi (India)</option>
            </select>
            <button onClick={() => (listening ? stop() : start())}>
              {listening ? "Stop" : "Tap to Speak"}
            </button>
          </div>
        </div>

        <p className="muted">Try "Add 2 milk for 50 rupees", "Remove bread", or "Find apples under 100".</p>
        <div className="row">
          <span className="chip">🎙️ {listening ? "Listening…" : "Idle"}</span>
          <span className="chip">🧠 {message || "Say something…"} </span>
        </div>
      </div>

      <div className="card" style={{marginTop:12}}>
        <div className="row" style={{justifyContent:"space-between", alignItems:"center"}}>
          <h3>Shopping List</h3>
          <div className="row" style={{alignItems:"center", gap:12}}>
            <div className="row" style={{alignItems:"center", gap:8}}>
              <span className="muted">Budget:</span>
              <input 
                type="number" 
                min="0" 
                value={budget} 
                onChange={e => setBudget(parseFloat(e.target.value) || 0)}
                className="budget-input"
              />
            </div>
            <div className={`chip total-cost ${budgetStatus.status === "over" ? "error" : budgetStatus.status === "warning" ? "warning" : "success"}`}>
              💰 Total: ₹{totalCost.toFixed(2)}
            </div>
            <div className={`chip ${budgetStatus.status === "over" ? "error" : budgetStatus.status === "warning" ? "warning" : "success"}`}>
              {budgetStatus.message}
            </div>
          </div>
        </div>
        <div className="list">
          {items.map(it => (
            <div key={it._id} className="item">
              <div className="row" style={{justifyContent:"space-between"}}>
                <strong>{it.name}</strong>
                <button className="secondary" onClick={async ()=>{
                  await api.list.remove(it._id);
                  setItems(prev => prev.filter(x => x._id !== it._id));
                  refresh(); // Refresh to update total cost
                }}>Remove</button>
              </div>
              <div className="row" style={{marginTop:8, gap:12}}>
                <div className="row" style={{alignItems:"center", gap:4}}>
                  <span className="muted">Qty:</span>
                  <input 
                    type="number" 
                    min="1" 
                    value={it.quantity} 
                    onChange={async (e)=>{
                      const q = parseInt(e.target.value || "1", 10);
                      const updated = await api.list.update(it._id, { quantity: q });
                      setItems(prev => prev.map(x => x._id===it._id? updated : x));
                      refresh(); // Refresh to update total cost
                    }}
                    className="quantity-input"
                  />
                </div>
                <div className="row" style={{alignItems:"center", gap:4}}>
                  <span className="muted">Cost:</span>
                  <input 
                    type="number" 
                    min="0" 
                    step="0.01"
                    value={it.cost || ""} 
                    placeholder="0"
                    onChange={async (e)=>{
                      const c = parseFloat(e.target.value || 0);
                      const updated = await api.list.update(it._id, { cost: c });
                      setItems(prev => prev.map(x => x._id===it._id? updated : x));
                      refresh(); // Refresh to update total cost
                    }}
                    className="cost-input"
                  />
                </div>
                <span className="chip">{it.category}</span>
                <span className="chip">₹{(it.cost * it.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{marginTop:12}}>
        <h3>Smart Suggestions</h3>
        <div className="row">
          <div>
            <div className="muted">Based on history</div>
            <div className="row" style={{marginTop:8, flexWrap:"wrap", gap:8}}>
              {suggest.likely.map((n,i)=>(
                <button key={i} className="secondary" onClick={async ()=>{
                  const created = await api.list.add(n, 1, 0);
                  setItems(prev => [created, ...prev]);
                  refresh(); // Refresh to update total cost
                }}>{n}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="muted">Seasonal</div>
            <div className="row" style={{marginTop:8, flexWrap:"wrap", gap:8}}>
              {suggest.seasonal.map((n,i)=>(
                <button key={i} className="secondary" onClick={async ()=>{
                  const created = await api.list.add(n, 1, 0);
                  setItems(prev => [created, ...prev]);
                  refresh(); // Refresh to update total cost
                }}>{n}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{marginTop:12}}>
        <h3>Voice-Activated Search</h3>
        <div className="row">
          <input placeholder="try 'apples'…" value={query} onChange={e=>setQuery(e.target.value)} />
          <button onClick={async()=>{
            const res = await api.search.get(query, undefined);
            setResults(res);
          }}>Search</button>
        </div>
        <div className="list" style={{marginTop:12}}>
          {results.map(r=>(
            <div key={r.id} className="item">
              <strong>{r.name}</strong>
              <div className="muted">{r.brand}</div>
              <div>₹ {r.price} / {r.unit}</div>
              <button style={{marginTop:8}} onClick={async()=>{
                const created = await api.list.add(r.name, 1, r.price);
                setItems(prev => [created, ...prev]);
                refresh(); // Refresh to update total cost
              }}>Add</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
