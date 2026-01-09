const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '../.env' }); // Adjust path to reach .env in server root

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        console.log("Using API Key:", process.env.GEMINI_API_KEY ? "Found" : "Missing");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        // There isn't a direct listModels method on the client instance in some versions, 
        // but the error message suggested calling ListModels. 
        // Actually, usually it's not directly exposed in the high-level SDK easily without a specific call.
        // Let's try to just run a generation with a fallback model "gemini-1.0-pro" to see if that works.

        console.log("Testing gemini-pro...");
        try {
            const result = await genAI.getGenerativeModel({ model: "gemini-pro" }).generateContent("Hello");
            console.log("gemini-pro success!");
        } catch (e) { console.log("gemini-pro failed:", e.message); }

        console.log("Testing gemini-1.5-flash...");
        try {
            const result = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).generateContent("Hello");
            console.log("gemini-1.5-flash success!");
        } catch (e) { console.log("gemini-1.5-flash failed:", e.message); }

    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
