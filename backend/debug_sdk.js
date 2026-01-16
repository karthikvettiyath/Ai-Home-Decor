const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
dotenv.config();

const ai = new GoogleGenAI({ key: process.env.GEMINI_API_KEY });

async function test() {
    console.log("Testing generation...");
    // Try the exact names likely found
    const models = ["gemini-1.5-flash", "models/gemini-1.5-flash", "gemini-2.0-flash-exp"];

    for (const model of models) {
        console.log(`\n--- Trying ${model} ---`);
        try {
            const result = await ai.models.generateContent({
                model: model,
                contents: [{ role: "user", parts: [{ text: "Hi" }] }]
            });
            console.log(`✅ Success with ${model}`);
        } catch (e) {
            console.error(`❌ Failed ${model}: ${e.message}`);
            if (e.response) console.log(JSON.stringify(e.response.data));
        }
    }
}

test();
