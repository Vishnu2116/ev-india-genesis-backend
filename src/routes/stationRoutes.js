import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/nearby-stations", async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) {
    return res
      .status(400)
      .json({ error: "Latitude and longitude are required." });
  }

  const url =
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json` +
    `?location=${lat},${lng}` +
    `&radius=10000` +
    `&keyword=ev%20charging%20station` +
    `&key=${process.env.GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.status !== "OK") {
      return res
        .status(500)
        .json({ error: "Google API error", details: data.status });
    }
    const stations = data.results.map((station) => ({
      name: station.name,
      location: station.geometry.location,
      address: station.vicinity,
      place_id: station.place_id,
      rating: station.rating,
      open_now: station.opening_hours?.open_now ?? false,
    }));
    res.json(stations);
  } catch (err) {
    console.error("Station fetch error:", err);
    res.status(500).json({ error: "Server error fetching station data." });
  }
});

export default router;
