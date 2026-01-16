const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        // There isn't a direct listModels in the high-level SDK easily exposed in all versions, 
        // but let's try to just run a simple prompt on 'gemini-pro' and print the FULL error.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello");
        console.log("Success:", result.response.text());
    } catch (error) {
        console.error("Error Details:", JSON.stringify(error, null, 2));
        console.error("Message:", error.message);
    }
}

listModels();
