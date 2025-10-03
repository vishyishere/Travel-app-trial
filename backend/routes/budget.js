import express from "express";
const router = express.Router();

/**
 * POST /budget
 * Body: { budget: number, category?: string, location?: {lat, lng} }
 * Returns: { budget, category, suggestions: [ ... ] }
 *
 * This is a deterministic mocked implementation so you can test locally.
 */
router.post("/", (req, res) => {
  const body = req.body || {};
  const budget = Number(body.budget || 0);
  const category = (body.category || "general").toLowerCase();

  const CATALOG = [
    { id: "movie_std", title: "Cinema — Standard Seat", category: "movies", totalEstimate: 250, breakdown: [{label:"Ticket",amount:180},{label:"Travel",amount:70}] },
    { id: "movie_prem", title: "Cinema — Premium Seat", category: "movies", totalEstimate: 450, breakdown: [{label:"Ticket",amount:350},{label:"Travel",amount:100}] },
    { id: "fort_walk", title: "Fort Kochi Walking Tour", category: "sightseeing", totalEstimate: 120, breakdown: [{label:"Travel",amount:120}] },
    { id: "tea_street", title: "Street Food — Sample Meal", category: "food", totalEstimate: 200, breakdown: [{label:"Meal",amount:150},{label:"Drink",amount:50}] }
  ];

  // filter by category when given
  const byCategory = category === "general" ? CATALOG : CATALOG.filter(i => i.category === category);

  // matches within budget
  const affordable = byCategory.filter(i => i.totalEstimate <= budget);

  // fallback: sort by closeness to budget
  const fallbackSorted = (byCategory.length ? byCategory : CATALOG)
    .slice()
    .sort((a,b) => Math.abs(a.totalEstimate - budget) - Math.abs(b.totalEstimate - budget));

  const suggestions = affordable.length ? affordable : fallbackSorted.slice(0, 3);

  res.json({ budget, category, suggestions });
});

export default router;
