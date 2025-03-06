const express = require("express");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const PORT = process.env.PORT || 8888;

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
    // const convertedImage = await sharp(image).toFormat("jpg").toBuffer();

    const svgText = `
      <svg width="1000" height="1000">
        <style>
          .title {
            fill: red;
            font-size: 48px;
          }
        </style>
        <text x="45%" y="40%" text-anchor="middle" class="title">Hello world</text>
      </svg>
    `;

    const svgBuffer = Buffer.from(svgText);

    const imageWithText = await sharp(image).composite([{input: svgBuffer, left: 150, top: 90}]).toBuffer();

    res.set('Content-Type', 'image/jpeg');
    res.set('Content-Disposition', `attachment; filename=${filename}.jpg`);
    res.send(imageWithText);
    } catch(error) {
      res.sendStatus(500);
    }
  }
);

app.listen(PORT);
console.log(`Express running in http://localhost:${PORT}`);