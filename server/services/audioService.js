const { ElevenLabsClient } = require("elevenlabs");
require('dotenv').config();

const client = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY
});

exports.generateAudio = async (text, language) => {
    try {
        // In a real scenario, we'd handle translation here if language is not 'en'
        const audio = await client.generate({
            voice: "Rachel",
            text: text,
            model_id: "eleven_multilingual_v2"
        });
        return audio;
    } catch (error) {
        console.error("ElevenLabs Error:", error);
        throw error;
    }
}
