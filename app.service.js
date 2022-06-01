const { Logger, checkFolderSize } = require('./logger');
const { getMetadata, writeMetadata } = require('./storage');
const fs = require('fs');
const logger = new Logger();
const path = require('path');
const { APIError, HttpStatusCode } = require('./errors/error');


const uploadFile = (req, filePath, filename) => {

	return new Promise((resolve, reject) => {
		const stream = fs.createWriteStream(filePath);
		stream.on('open', () => {

			//log start saving time
			logger.log(`Start saving file ${filename}`);

			req.pipe(stream);
		});

		stream.on('drain', () => {
			const written = parseInt(stream.bytesWritten);
			const total = parseInt(req.headers['content-length']);
			const pWritten = ((written / total) * 100).toFixed(2);
			console.log(`Processing  ...  ${pWritten}% done`);
		});

		stream.on('close', () => {
			console.log('Processing  ...  100%');

			//log file uploading finish
			logger.log(`File ${filename} is uploaded`)
			try {
				//check if folder is bigger than 10 mb and log if true
				if (checkFolderSize('./data') > 10 ^ 6 * 10) {
					logger.log('WARNING: Size of the folder exceeded 10 mb!')
				}
				//write metadata to the database
				const mimeType = req.headers['content-type'];
				const size = parseInt(stream.bytesWritten);
				writeMetadata(filename, mimeType, size);
			} catch (e) {
				logger.error(e);
			}

			resolve(filePath);
		});

		// If error, reject the promise
		stream.on('error', err => {
			logger.error(err);
			reject(err);
		});
	});
};

const downloadFile = async (req, res, filename, next) => {
	const dir = __dirname + `/data`;
	if (!fs.existsSync(dir)) {
		return next(new APIError('File not found', 404));
	};
	try {
		const metadata = await getMetadata(req, res, filename, next);
		if (metadata) {
			return res.download(path.join(`./data/${filename}`));
		}
	} catch (error) {
		logger.error(error);
	}
};


module.exports = { uploadFile, downloadFile };