import express from "express";
import cors from "cors";
import budgetRouter from "./routes/budget.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Travel App Backend Running ??" });
});

app.use("/budget", budgetRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on 0.0.0.0:${PORT}`);
});
