import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/place-details", async (req, res) => {
  const { place_id } = req.query;
  if (!place_id) {
    return res.status(400).json({ error: "Missing place_id" });
  }

  const url =
    `https://maps.googleapis.com/maps/api/place/details/json` +
    `?place_id=${place_id}` +
    `&fields=name,rating,formatted_address,user_ratings_total,opening_hours,geometry,photos,url` +
    `&key=${process.env.GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.status !== "OK") {
      return res
        .status(500)
        .json({ error: "Google Details API error", details: data.status });
    }

    const result = data.result;
    const photoUrl = result.photos?.[0]?.photo_reference
      ? `https://maps.googleapis.com/maps/api/place/photo` +
        `?maxwidth=400` +
        `&photo_reference=${result.photos[0].photo_reference}` +
        `&key=${process.env.GOOGLE_MAPS_API_KEY}`
      : null;

    res.json({
      name: result.name,
      address: result.formatted_address,
      rating: result.rating,
      user_ratings_total: result.user_ratings_total,
      open_now: result.opening_hours?.open_now ?? false,
      url: result.url,
      photo: photoUrl,
    });
  } catch (err) {
    console.error("Details fetch error:", err);
    res.status(500).json({ error: "Server error fetching place details." });
  }
});

export default router;
