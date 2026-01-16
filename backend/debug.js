const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
require("dotenv").config();

const LOG_FILE = 'debug_log.txt';

function log(msg) {
    const line = `[${new Date().toISOString()}] ${msg}\n`;
    console.log(msg);
    fs.appendFileSync(LOG_FILE, line);
}

async function runDebug() {
    log("--- START DEBUG ---");
    const key = process.env.GEMINI_API_KEY;
    log(`Key present: ${!!key}`);
    log(`Key length: ${key ? key.length : 0}`);

    if (!key) {
        log("ERROR: No API Key found.");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(key);
        // Test 1: Simple text model
        log("Testing model: gemini-pro...");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = "Explain 'Hello World' in 5 words.";
        log(`Sending prompt: "${prompt}"`);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        log(`SUCCESS! Response: ${text}`);
    } catch (error) {
        log("FATAL ERROR CAUGHT:");
        log(error.message);
        if (error.statusText) log(`Status: ${error.statusText}`);
        if (error.errorDetails) log(JSON.stringify(error.errorDetails, null, 2));
    }
    log("--- END DEBUG ---");
}

runDebug();
