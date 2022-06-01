const Metadata = require('./models/Metadata');
const { Logger } = require('./logger');
const { APIError } = require('./errors/error')
const logger = new Logger();

//write metadata to the db, rewrite if file exists
const writeMetadata = async (name, mimeType, size) => {
	//check if file is already exists
	let metadata = await Metadata.findOne({ name });
	if (!metadata) {
		try {
			metadata = await Metadata.create({ name, mimeType, size });
			return metadata;
		} catch (e) {
			logger.error(e);
			return e;
		}
	}

	try {
		metadata = await await Metadata.findOneAndUpdate({ name }, { name, mimeType, size }, { new: true, runValidators: true });
		return metadata;
	} catch (e) {
		logger.error(e);
		return e;
	}

};

//get files metadata
const getMetadata = async (req, res, name) => {

	try {
		const metadata = await Metadata.findOne({ name });
		if (!metadata) {
			res.status(404).send('File not found')
		}
		return (metadata);
	} catch (e) {
		logger.error(e);
		console.log(e);
	}

};

module.exports = { writeMetadata, getMetadata };

