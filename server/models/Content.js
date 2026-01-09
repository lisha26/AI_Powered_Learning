const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  type: { type: String, enum: ['reference', 'video', 'audio', 'mindmap'] },
  content: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Content', contentSchema);
