const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
require("dotenv").config();

async function run() {
    const key = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(key);
    // Try gemini-2.0-flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    try {
        const result = await model.generateContent("test");
        fs.writeFileSync("debug_result_2.0.txt", "SUCCESS: " + result.response.text());
        console.log("SUCCESS");
    } catch (e) {
        fs.writeFileSync("debug_result_2.0.txt", "ERROR: " + e.message);
        console.log("ERROR");
    }
}
run();
