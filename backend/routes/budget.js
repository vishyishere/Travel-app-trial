import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
  const { budget = 0, category = "movies" } = req.body || {};
  const suggestions = [
    { id: "s1", title: "Movie (standard)", breakdown: [{ label: "Ticket", amount: 200 }, { label: "Travel", amount: 80 }], totalEstimate: 280 },
    { id: "s2", title: "Fort Kochi walk", breakdown: [{ label: "Entry", amount: 0 }, { label: "Travel", amount: 120 }], totalEstimate: 120 }
  ];
  const affordable = suggestions.filter(s => s.totalEstimate <= Number(budget));
  res.json({ budget: Number(budget), category, suggestions: affordable.length ? affordable : suggestions });
});

export default router;
