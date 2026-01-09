const audioService = require('../services/audioService');
const Content = require('../models/Content');

exports.generate = async (req, res) => {
    try {
        const { text, language, topic } = req.body; // Added topic to body
        const audioStream = await audioService.generateAudio(text, language);

        // Note: Storing binary audio in Mongo is not ideal. 
        // Usually we store a file path. For this prototype, we'll log the event 
        // or store metadata. We won't store the blob in DB directly here 
        // to avoid complexity, but we'll record that audio was generated.

        if (topic) {
            try {
                await Content.create({
                    topic,
                    type: 'audio',
                    content: { text, language, generated: true }
                });
            } catch (err) {
                console.error(err);
            }
        }

        res.set('Content-Type', 'audio/mpeg');
        audioStream.pipe(res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
