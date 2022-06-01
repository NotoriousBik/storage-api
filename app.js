const app = require('express')();
const path = require('path');
const connectDB = require('./db/connect');
const { uploadFile, downloadFile } = require('./app.service');
const fs = require('fs');
const { errorMiddleware } = require('./errors/errorMiddleware');
const { v4: uuidv4 } = require('uuid');
const { Logger } = require('./logger');

const logger = new Logger();


require('dotenv').config();
const port = process.env.PORT || 3000;

//file uploading
app.put('/files/:filename', async (req, res, next) => {

	try {
		const dir = __dirname + `/data`;

		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}
		const extension = path.extname(req.params.filename);
		const filename = `${uuidv4()}${extension}`;

		const filePath = path.join(__dirname, `/data/${filename}`);
		await uploadFile(req, filePath, filename)
		return res.status(200).json({
			filename
		});
	} catch (e) {
		logger.error(e)
	}

});

//file downloading
app.get('/files/:filename', (req, res, next) => {
	const { filename } = req.params;
	downloadFile(req, res, filename, next);

});

app.use(errorMiddleware);

//check if database connection is established than start the server
const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(port, console.log(`Server is listening on port ${port}...`));
	} catch (e) {
		logger.error(e)

	}
};

start();