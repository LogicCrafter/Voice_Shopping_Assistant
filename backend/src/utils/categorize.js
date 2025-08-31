export const CATEGORY_MAP = {
  milk: "dairy",
  yogurt: "dairy",
  cheese: "dairy",
  bread: "bakery",
  baguette: "bakery",
  eggs: "dairy",
  butter: "dairy",
  apple: "produce",
  apples: "produce",
  banana: "produce",
  bananas: "produce",
  orange: "produce",
  oranges: "produce",
  spinach: "produce",
  tomato: "produce",
  tomatoes: "produce",
  rice: "grains",
  flour: "grains",
  pasta: "grains",
  chips: "snacks",
  cookies: "snacks",
  chocolate: "snacks",
  water: "beverages",
  juice: "beverages",
  coffee: "beverages",
  tea: "beverages",
  toothpaste: "personal_care",
  shampoo: "personal_care",
  soap: "personal_care"
};

export function categorize(name) {
  const key = (name || "").toLowerCase().trim();
  return CATEGORY_MAP[key] || "other";
}
