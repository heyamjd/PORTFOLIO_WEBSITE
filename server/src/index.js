import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";

import { connectDb } from "./config/db.js";
import contactRoutes from "./routes/contactRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: clientOrigin }));
app.use(morgan("dev"));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "portfolio-server" });
});

app.use("/api/portfolio", portfolioRoutes);
app.use("/api/contact", contactRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

async function startServer() {
  try {
    await connectDb(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
