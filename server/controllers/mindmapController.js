const geminiService = require('../services/geminiService');
const Content = require('../models/Content');

exports.generate = async (req, res) => {
    try {
        const { topic } = req.body;
        const prompt = `Create a hierarchical mind map for "${topic}" 
    with main concept, 5 branches, and 3 sub-branches each. 
    Return as JSON with 'nodes' and 'edges' arrays compatible with React Flow.
    Example structure: { "nodes": [{ "id": "1", "data": { "label": "Main" }, "position": { "x": 0, "y": 0 } }], "edges": [] }`;

        const result = await geminiService.generateText(prompt);
        let cleanResult = result.replace(/```json/g, '').replace(/```/g, '');
        let parsedData;

        try {
            parsedData = JSON.parse(cleanResult);
        } catch (e) {
            parsedData = { error: "Failed to parse JSON", raw: cleanResult };
        }

        // Save
        try {
            await Content.create({
                topic,
                type: 'mindmap',
                content: parsedData
            });
        } catch (err) {
            console.error(err);
        }

        res.json(parsedData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
