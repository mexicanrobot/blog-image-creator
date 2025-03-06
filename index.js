const express = require("express");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.post(
  "/convert",
  upload.fields([{ name: "image", maxCount: 1 }]),
  async (req, res) => {
    try {
    const image = req.files.image[0].buffer;
    const filename = req.files.image[0].originalname.split(".")[0];
    const convertedImage = await sharp(image).toFormat("jpg").toBuffer();
    res.set('Content-Type', 'image/jpeg');
    res.set('Content-Disposition', `attachment; filename=${filename}.jpg`);
    res.send(convertedImage);
    } catch(error) {
      res.sendStatus(500);
    }
  }
);

app.listen(8080);
console.log(`Express running in http://localhost:8080`);