import express from "express";
import cors from "cors";
import budgetRouter from "./routes/budget.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Travel App Backend Running ??" });
});

// mount budget router
app.use("/budget", budgetRouter);

// basic 404
app.use((req, res) => res.status(404).json({ error: "Not found" }));

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on http://127.0.0.1:${PORT}`);
});
