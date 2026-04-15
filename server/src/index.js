import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import { connectDb } from "./config/db.js";
import contactRoutes from "./routes/contactRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === "production";

const app = express();
const port = process.env.PORT || 5000;
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

if (!isProduction) {
  app.use(cors({ origin: clientOrigin }));
}
app.use(morgan(isProduction ? "combined" : "dev"));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "portfolio-server" });
});

app.use("/api/portfolio", portfolioRoutes);
app.use("/api/contact", contactRoutes);

if (isProduction) {
  const clientDistPath = path.join(__dirname, "../../client/dist");
  app.use(express.static(clientDistPath));
  // Serve the React app for any non-API route (client-side routing fallback)
  app.get(/^(?!\/api\/)/, (_req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

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
