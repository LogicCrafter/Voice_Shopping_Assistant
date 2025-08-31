export function parseCommand(text, locale="en") {
  const t = (text || "").toLowerCase();
  const tokens = t.split(/\s+/);
  const number = parseInt(tokens.find(x => /^\d+$/.test(x)) || "1", 10);

  const kw = {
    en: { 
      add:["add","buy","need","want"], 
      remove:["remove","delete","drop"], 
      search:["find","search","look for"], 
      under:["under","below","less than"],
      cost:["for","cost","price","rupees","rs","rupee","dollars","dollar"]
    },
    hi: { 
      add:["जोड़ो","लाना","खरीदना","चाहिए"], 
      remove:["हटा","निकाल","डिलीट"], 
      search:["ढूंढ","खोज"], 
      under:["से कम","से नीचे"],
      cost:["के लिए","कीमत","रुपये","रू"]
    }
  }[locale] || { 
    add:["add"], 
    remove:["remove"], 
    search:["find"], 
    under:["under"],
    cost:["for","cost","price","rupees","rs","rupee","dollars","dollar"]
  };

  const isAdd = kw.add.some(k => t.includes(k));
  const isRemove = kw.remove.some(k => t.includes(k));
  const isSearch = kw.search.some(k => t.includes(k));

  let maxPrice = null;
  let itemCost = null;
  
  // Extract cost for individual items (e.g., "add milk for 50 rupees")
  if (isAdd) {
    // Look for patterns like "50 rupees", "50 rs", "50 ₹", "$50", etc.
    const costPatterns = [
      /(\d+\.?\d*)\s*(?:rupees?|rs|rupee|dollars?|dollar)/i,
      /[₹$](\d+\.?\d*)/i,
      /(\d+\.?\d*)\s*[₹$]/i
    ];
    
    for (const pattern of costPatterns) {
      const match = t.match(pattern);
      if (match) {
        itemCost = parseFloat(match[1]);
        break;
      }
    }
  }
  
  // Extract max price for search (e.g., "find apples under 100")
  if (kw.under.some(k => t.includes(k))) {
    const m = t.match(/(\d+\.?\d*)/g);
    if (m && m.length) maxPrice = parseFloat(m[m.length-1]);
  }
  
  // Create a more comprehensive blacklist that excludes cost-related tokens
  const costTokens = new Set();
  if (itemCost !== null) {
    // Add the cost number and any currency symbols to the blacklist
    costTokens.add(itemCost.toString());
    costTokens.add("₹");
    costTokens.add("$");
    costTokens.add("rupees");
    costTokens.add("rs");
    costTokens.add("rupee");
    costTokens.add("dollars");
    costTokens.add("dollar");
  }
  
  const blacklist = new Set([...kw.add, ...kw.remove, ...kw.search, ...kw.cost, ...costTokens, "to","my","list","please"]);
  const itemTokens = tokens.filter(tok => !blacklist.has(tok) && !/^\d+$/.test(tok));
  const item = itemTokens[itemTokens.length-1] || "";

  return { 
    intent: isAdd? "add" : isRemove? "remove" : isSearch? "search" : "unknown", 
    item, 
    quantity: number || 1, 
    maxPrice,
    cost: itemCost
  };
}
