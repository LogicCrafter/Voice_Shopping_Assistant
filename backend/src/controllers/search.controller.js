// In-memory demo catalog for search. Replace with real provider as needed.
const CATALOG = [
  { id: 1, name: "Organic Apples", brand: "FreshFarm", price: 120, unit: "kg", category: "produce" },
  { id: 2, name: "Bananas", brand: "Nature's Best", price: 60, unit: "dozen", category: "produce" },
  { id: 3, name: "Whole Wheat Bread", brand: "BakeWell", price: 45, unit: "loaf", category: "bakery" },
  { id: 4, name: "Milk", brand: "DairyPure", price: 68, unit: "liter", category: "dairy" },
  { id: 5, name: "Almond Milk", brand: "NutriMoo", price: 210, unit: "liter", category: "dairy" },
  { id: 6, name: "Toothpaste", brand: "SmileCo", price: 95, unit: "tube", category: "personal_care" },
  { id: 7, name: "Basmati Rice", brand: "Royal Grain", price: 180, unit: "kg", category: "grains" },
  { id: 8, name: "Dark Chocolate", brand: "CocoaCraft", price: 150, unit: "bar", category: "snacks" },
  { id: 9, name: "Eggs", brand: "FarmFresh", price: 80, unit: "dozen", category: "dairy" },
  { id: 10, name: "Orange Juice", brand: "Juicy", price: 110, unit: "liter", category: "beverages" }
];

export function searchItems(req, res) {
  const q = (req.query.q || "").toLowerCase();
  const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined;

  let found = CATALOG.filter(
    p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
  );

  if (maxPrice !== undefined) {
    found = found.filter(p => p.price <= maxPrice);
  }

  res.json(found);
}
