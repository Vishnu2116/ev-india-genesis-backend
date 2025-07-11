import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import fs from "fs";
import FormData from "form-data";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/anpr", upload.single("image"), async (req, res) => {
  const filePath = req.file.path;
  try {
    const form = new FormData();
    form.append("upload", fs.createReadStream(filePath));
    form.append("regions", "in");

    const response = await fetch(
      "https://api.platerecognizer.com/v1/plate-reader/",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${process.env.PLATE_RECOGNIZER_TOKEN}`,
          ...form.getHeaders(),
        },
        body: form,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Plate API error:", errorText);
      return res
        .status(500)
        .json({ error: "Plate API error", details: errorText });
    }

    const data = await response.json();
    const plate = data.results?.[0]?.plate?.toUpperCase() ?? "UNKNOWN";
    const userInfo = {
      name: "Demo User",
      phone: "+91 9000000000",
      email: "demo.user@evinfra.com",
      vehicleModel: "EV Prototype X1",
      registrationDate: "2024-01-01",
    };

    res.json({ licensePlate: plate, userInfo });
  } catch (err) {
    console.error("ANPR error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    fs.unlink(filePath, () => {});
  }
});

export default router;
