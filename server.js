const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
require('dotenv').config();
//console.log(process.env);
// 🔹 PUT YOUR TELEGRAM BOT TOKEN HERE
const BOT_TOKEN = process.env.BOT_TOKEN;

// 🔹 PUT YOUR TELEGRAM CHAT ID HERE
const CHAT_ID = process.env.CHAT_ID;
//console.log('BOT_TOKEN:', BOT_TOKEN);
//console.log('CHAT_ID:', CHAT_ID);
// API to send alert
app.post("/send-alert", async (req, res) => {
    const { latitude, longitude } = req.body;

    const message = `
🚨 ELDERLY ALERT 🚨

Elderly moved outside safe zone!

Live Location:
https://www.google.com/maps?q=${latitude},${longitude}
`;

    try {
        await axios.post(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                chat_id: CHAT_ID,
                text: message,
            }
        );

        res.json({ success: true });
    } catch (error) {
        console.error("Telegram Error:", error.message);
        res.status(500).json({ success: false });
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});