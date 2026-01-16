const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
    console.log("Testing Gemini API...");
    try {
        // Try gemini-1.5-flash first (the failure case)
        console.log("Attempting gemini-1.5-flash...");
        const modelFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const resFlash = await modelFlash.generateContent("Hello");
        console.log("✅ gemini-1.5-flash WORKED:", resFlash.response.text());
    } catch (err) {
        console.error("❌ gemini-1.5-flash FAILED:", err.message);
    }

    try {
        // Try gemini-pro (the stable fallback)
        console.log("\nAttempting gemini-pro...");
        const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
        const resPro = await modelPro.generateContent("Hello");
        console.log("✅ gemini-pro WORKED:", resPro.response.text());
    } catch (err) {
        console.error("❌ gemini-pro FAILED:", err.message);
    }
}

test();
