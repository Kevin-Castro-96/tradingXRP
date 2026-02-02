import express from "express";
import axios from "axios";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

const SYMBOL = "XRPUSDT";
const INTERVAL = "1d";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function rangesOverlap(a, b) {
  return Math.max(a.min, b.min) <= Math.min(a.max, b.max);
}

app.get("/cron", async (req, res) => {
  try {
    const url = `https://api.binance.com/api/v3/klines?symbol=${SYMBOL}&interval=${INTERVAL}&limit=3`;
    const { data } = await axios.get(url);

    const candles = data.map((c) => ({
      open: parseFloat(c[1]),
      close: parseFloat(c[4]),
    }));

    const ranges = candles.map((c) => ({
      min: Math.min(c.open, c.close),
      max: Math.max(c.open, c.close),
    }));

    const noOverlap =
      !rangesOverlap(ranges[0], ranges[1]) &&
      !rangesOverlap(ranges[1], ranges[2]) &&
      !rangesOverlap(ranges[0], ranges[2]);

    const bearish =
      candles[0].close > candles[1].close &&
      candles[1].close > candles[2].close;

    let message;

    if (noOverlap && bearish) {
      message = `✅ Buen momento para comprar XRP`;
    } else {
      message = `❌ No es momento de comprar XRP`;
    }

    await transporter.sendMail({
      from: `"XRP Bot" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: "Análisis diario XRP",
      text: message,
    });

    res.json({
      noOverlap,
      bearish,
      candles,
      message,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}/cron`);
});
