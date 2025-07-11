import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import fs from "fs";
import dotenv from "dotenv";
import FormData from "form-data"; // ✅ using the classic stable FormData package

dotenv.config();

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/anpr", upload.single("image"), async (req, res) => {
  const filePath = req.file.path;
  const fileName = req.file.originalname;

  try {
    const form = new FormData();
    form.append("upload", fs.createReadStream(filePath));
    form.append("regions", "in"); // Optional: Improve accuracy for India

    const response = await fetch(
      "https://api.platerecognizer.com/v1/plate-reader/",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${process.env.PLATE_RECOGNIZER_TOKEN}`,
          ...form.getHeaders(), // ✅ VERY IMPORTANT
        },
        body: form,
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("❌ Plate API Error:", error);
      return res.status(500).json({ error: "Plate API error", details: error });
    }

    const data = await response.json();
    console.log("📦 API Response:", JSON.stringify(data, null, 2));

    const plate = data?.results?.[0]?.plate?.toUpperCase() || "UNKNOWN";

    const userInfo = {
      name: "Demo User",
      phone: "+91 9000000000",
      email: "demo.user@evinfra.com",
      vehicleModel: "EV Prototype X1",
      registrationDate: "2024-01-01",
    };

    res.json({ licensePlate: plate, userInfo });
  } catch (err) {
    console.error("ANPR Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    fs.unlink(filePath, () => {});
  }
});

export default router;
