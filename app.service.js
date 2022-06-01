const { Logger, checkFolderSize } = require('./logger');
const { getMetadata, writeMetadata } = require('./storage');
const fs = require('fs')
const logger = new Logger();
const path = require('path');


// Take in the request & filepath, stream the file to the filePath
const uploadFile = (req, filePath) => {


	const { filename } = req.params;
	return new Promise((resolve, reject) => {
		const stream = fs.createWriteStream(filePath);
		stream.on('open', () => {

			//log start saving time
			logger.log(`Start saving file ${filename}`);

			req.pipe(stream);
		});

		// Drain is fired whenever a data chunk is written.
		// When that happens, print how much data has been written yet.
		stream.on('drain', () => {
			const written = parseInt(stream.bytesWritten);
			const total = parseInt(req.headers['content-length']);
			const pWritten = ((written / total) * 100).toFixed(2);
			console.log(`Processing  ...  ${pWritten}% done`);
		});

		// When the stream is finished, print a final message
		// Also, resolve the location of the file to calling function and write metadata
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
				console.log(e);
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


// Take in the request & filepath, stream the file to the filePath
const downloadFile = async (req, res, filename) => {
	const dir = './data';

	if (!fs.existsSync(dir)) {
		res.status(404).send('File not found')
	}
	try {
		const metadata = await getMetadata(req, res, filename);
	} catch (e) {
		return res.status(404).send('File not found')
	}
	return res.download(path.join(`./data/${filename}`));
};


module.exports = { uploadFile, downloadFile };