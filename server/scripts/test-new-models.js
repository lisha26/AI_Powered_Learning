const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '../.env' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testModels() {
    const modelsToTest = [
        "gemini-2.0-flash",
        "gemini-flash-latest"
    ];

    for (const modelName of modelsToTest) {
        console.log(`Testing ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const res = await model.generateContent("Test");
            console.log(`SUCCESS: ${modelName}`);
            console.log(res.response.text());
            return;
        } catch (e) {
            console.log(`FAILED: ${modelName} - ${e.message.split(':')[0]}`);
        }
    }
}

testModels();
