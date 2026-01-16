const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function run() {
    console.log("--- DEBUG SUMMARY ---");
    const key = process.env.GEMINI_API_KEY;
    if (!key) { console.log("NO KEY"); return; }

    // Check key format
    console.log(`Key Start: ${key.substring(0, 5)}...`);

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        await model.generateContent("test");
        console.log("SUCCESS");
    } catch (e) {
        console.log("ERROR OCCURRED:");
        const msg = e.message;
        // Print in chunks
        for (let i = 0; i < msg.length; i += 50) {
            console.log(msg.substring(i, i + 50));
        }
    }
    console.log("--- END ---");
}
run();
