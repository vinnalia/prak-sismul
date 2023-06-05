const express = require("express");
const multer = require("multer");
const { spawn } = require("child_process");

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/compress-audio", upload.single("audio"), (req, res) => {
  const inputFile = req.file.path;
  const outputFile = `compressed_${req.file.filename}.mp3`;

  const ffmpegProcess = spawn("ffmpeg", [
    "-i",
    inputFile,
    "-b:a",
    "64k",
    outputFile,
  ]);
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  ffmpegProcess.on("close", () => {
    res.download(outputFile, (err) => {
      if (err) {
        console.error("Error sending file:", err);
      } else {
        console.log("File sent successfully");
      }
    });
  });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
