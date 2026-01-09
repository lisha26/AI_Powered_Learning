const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '../.env' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testModels() {
    const modelsToTest = [
        "gemini-1.5-flash",        // Failed before
        "gemini-1.5-flash-001",
        "gemini-1.5-flash-latest",
        "gemini-pro",              // Failed before
        "gemini-pro-latest",       // Seen in list
        "gemini-1.0-pro"
    ];

    for (const modelName of modelsToTest) {
        console.log(`Testing ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            await model.generateContent("Test");
            console.log(`SUCCESS: ${modelName}`);
            return; // Stop at first success
        } catch (e) {
            console.log(`FAILED: ${modelName} - ${e.message.split(':')[0]}`);
        }
    }
}

testModels();
