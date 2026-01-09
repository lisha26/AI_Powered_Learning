const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.generateText = async (prompt, retries = 3) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        if (error.status === 429 && retries > 0) {
            console.warn(`Gemini API 429 (Too Many Requests). Retrying in 10 seconds... (${retries} retries left)`);
            await wait(10000); // Wait 10 seconds
            return exports.generateText(prompt, retries - 1);
        }

        console.error("Gemini API Error:", error);
        throw error;
    }
};
