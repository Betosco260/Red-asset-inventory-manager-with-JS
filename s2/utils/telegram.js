// utils/telegram.js
const axios = require("axios");

/**
 * Configuración por variables de entorno:
 * - TELEGRAM_BOT_TOKEN  (obligatorio)
 * - TELEGRAM_CHAT_ID   (obligatorio)
 *
 * Ejemplo export:
 * export TELEGRAM_BOT_TOKEN="123456:ABC-DEF..."
 * export TELEGRAM_CHAT_ID="987654321"
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

if (!BOT_TOKEN || !CHAT_ID) {
    console.warn("Telegram no configurado (TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID faltantes). Las alertas se ignorarán.");
}

async function sendAlert(message) {
    if (!BOT_TOKEN || !CHAT_ID) {
        throw new Error("Telegram no configurado");
    }
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    try {
        await axios.post(url, {
            chat_id: CHAT_ID,
            text: message
        });
        return true;
    } catch (err) {
        console.error("Telegram API error:", err.response ? err.response.data : err.message);
        throw err;
    }
}

module.exports = { sendAlert };
