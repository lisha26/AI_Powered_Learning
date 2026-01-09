const videoService = require('../services/videoService');
const Content = require('../models/Content');

exports.generate = async (req, res) => {
    try {
        const { topic, type } = req.body;
        const result = await videoService.generateAnimation(topic, type);

        // Save
        try {
            await Content.create({
                topic,
                type: 'video',
                content: result
            });
        } catch (err) {
            console.error(err);
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
