const geminiService = require('../services/geminiService');
const Content = require('../models/Content');

exports.generate = async (req, res) => {
    try {
        const { topic } = req.body;
        const prompt = `You are an academic research assistant. For the topic "${topic}", 
provide a comprehensive reference list including:
1. Top 5 relevant books with authors and publication years
2. Top 5 peer-reviewed articles with journal names
3. Top 3 expert podcasts or lectures
4. A 500-word summary synthesizing these sources

Focus only on credible academic sources. Format as structured JSON.`;

        const result = await geminiService.generateText(prompt);
        let cleanResult = result.replace(/```json/g, '').replace(/```/g, '');
        let parsedData;

        try {
            parsedData = JSON.parse(cleanResult);
        } catch (e) {
            parsedData = { text: cleanResult };
        }

        // Save to History
        try {
            await Content.create({
                topic,
                type: 'reference',
                content: parsedData
            });
        } catch (err) {
            console.error("Failed to save history:", err);
        }

        res.json(parsedData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
