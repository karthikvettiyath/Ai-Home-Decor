const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
require("dotenv").config();

async function run() {
    const key = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(key);
    // Try gemini-1.5-flash
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const result = await model.generateContent("test");
        fs.writeFileSync("debug_result.txt", "SUCCESS: " + result.response.text());
    } catch (e) {
        const output = {
            message: e.message,
            stack: e.stack,
            response: e.response
        };
        fs.writeFileSync("debug_result.txt", "ERROR:\n" + JSON.stringify(output, null, 2));
    }
}
run();
