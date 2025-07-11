import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import stationRoutes from "./routes/stationRoutes.js";
import detailsRoutes from "./routes/detailsRoutes.js";
import anprRoutes from "./routes/anprRoutes.js";

const app = express();
const PORT = 5008;

dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/api", stationRoutes);
app.use("/api", detailsRoutes);
app.use("/api", anprRoutes);

app.get("/", (req, res) => {
  res.send("EV India Genesis Backend is running!");
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
