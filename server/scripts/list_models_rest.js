const axios = require('axios');
require('dotenv').config({ path: '../.env' });

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    try {
        console.log(`Querying ${url}...`);
        const response = await axios.get(url);
        console.log("Available Models:");
        response.data.models.forEach(m => {
            if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                console.log(`- ${m.name}`);
            }
        });
    } catch (error) {
        console.error("REST API Error:", error.response ? error.response.data : error.message);
    }
}

listModels();
