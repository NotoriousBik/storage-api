const Metadata = require('./models/Metadata');
const { Logger } = require('./logger');
const { APIError } = require('./errors/error')
const logger = new Logger();

//write metadata to the db, rewrite if file exists
const writeMetadata = async (name, mimeType, size) => {
	try {
		metadata = await Metadata.create({ name, mimeType, size });
		return metadata;
	} catch (e) {
		return res.json(e)
	}

};

//get files metadata
const getMetadata = async (req, res, name, next) => {
	const metadata = await Metadata.findOne({ name });
	if (!metadata) {
		return next(new APIError('File not found', 404));
	}
	return (metadata);
};

module.exports = { writeMetadata, getMetadata };

