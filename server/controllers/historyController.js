const Content = require('../models/Content');

exports.getHistory = async (req, res) => {
    try {
        // Fetch last 10 items, sorted by newest first
        const history = await Content.find()
            .sort({ createdAt: -1 })
            .limit(10);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
