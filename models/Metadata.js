const mongoose = require('mongoose');

const MetadataSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'name writing is failed'],
		trim: true
	},
	mimeType: {
		type: String,
		required: [true, 'mimeType writing is failed'],
	},
	size: {
		type: Number,
		required: [true, 'size writing is failed'],
	}
});

module.exports = mongoose.model('Metadata', MetadataSchema);