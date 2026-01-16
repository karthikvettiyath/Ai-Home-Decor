const fs = require('fs');
require("dotenv").config();

async function run() {
    const key = process.env.GEMINI_API_KEY;
    console.log("Key:", key.substring(0, 10));

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
        // Native fetch
        const resp = await fetch(url);
        const data = await resp.json();

        fs.writeFileSync("debug_models.txt", JSON.stringify(data, null, 2));
    } catch (e) {
        fs.writeFileSync("debug_models.txt", "ERROR: " + e.message);
    }
}
run();
