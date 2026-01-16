const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
require("dotenv").config();

async function runDebug() {
    console.log("--- DEBUG START ---");

    // 1. Check SDK Version
    try {
        const pkg = require('@google/generative-ai/package.json');
        console.log(`SDK Version: ${pkg.version}`);
    } catch (e) {
        console.log("Could not read SDK version");
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.log("No API Key");
        return;
    }

    const genAI = new GoogleGenerativeAI(key);

    // 2. Try gemini-1.5-flash
    try {
        console.log("Testing: gemini-1.5-flash");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hi");
        console.log("✅ SUCCESS with gemini-1.5-flash");
    } catch (e) {
        console.log(`❌ FAILED gemini-1.5-flash: ${e.message}`);
    }

    // 3. Try gemini-1.0-pro
    try {
        console.log("Testing: gemini-1.0-pro");
        const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
        const result = await model.generateContent("Hi");
        console.log("✅ SUCCESS with gemini-1.0-pro");
    } catch (e) {
        console.log(`❌ FAILED gemini-1.0-pro: ${e.message}`);
    }

    console.log("--- DEBUG END ---");
}

runDebug();
