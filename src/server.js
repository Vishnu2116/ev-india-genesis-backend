import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import stationRoutes from "./routes/stationRoutes.js";
import detailsRoutes from "./routes/detailsRoutes.js";
import anprRoutes from "./routes/anprRoutes.js";

dotenv.config();

const app = express();
// use Render’s PORT or fallback to 5008 for localhost
const PORT = process.env.PORT || 5008;

app.use(cors()); // open to all origins (POC)
app.use(express.json());

app.use("/api", stationRoutes);
app.use("/api", detailsRoutes);
app.use("/api", anprRoutes);

app.get("/", (req, res) => {
  res.send("✅ EV India Genesis Backend is running!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
