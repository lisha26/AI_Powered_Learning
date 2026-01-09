const express = require('express');
const router = express.Router();
const referenceController = require('../controllers/referenceController');
const videoController = require('../controllers/videoController');
const audioController = require('../controllers/audioController');
const mindmapController = require('../controllers/mindmapController');
const historyController = require('../controllers/historyController');
const Content = require('../models/Content');
const sampleTopics = require('../data/sampleTopics.json');

router.post('/reference', referenceController.generate);
router.post('/video', videoController.generate);
router.post('/audio', audioController.generate);
router.post('/mindmap', mindmapController.generate);

router.get('/history', historyController.getHistory);

router.get('/topics', (req, res) => {
    res.json(sampleTopics.sampleTopics);
});

router.get('/content/:topic', async (req, res) => {
    try {
        // Get the latest content for this topic
        const content = await Content.findOne({ topic: req.params.topic }).sort({ createdAt: -1 });
        if (content) res.json(content);
        else res.status(404).json({ message: "Not found" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
