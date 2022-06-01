const app = require('express')();
const path = require('path');
const connectDB = require('./db/connect');
const { uploadFile, downloadFile } = require('./app.service');
const fs = require('fs')

require('dotenv').config();
const port = process.env.PORT || 3000;

// check if server is up
app.get('/', (req, res) => {
	res.status(200).send('Server up and running');
});

//file uploading
app.put('/files/:filename', (req, res) => {
	const dir = './data';

	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
	const { filename } = req.params;
	const filePath = path.join(__dirname, `/data/${filename}`);
	uploadFile(req, filePath)
		.then(() => res.send({ filename }))
		.catch(err => res.status(500).send('Internal server error'));

});

//file downloading
app.get('/files/:filename', (req, res) => {
	const { filename } = req.params;
	downloadFile(req, res, filename);
});

//check if database connection is established than start the server
const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(port, console.log(`Server is listening on port ${port}...`));
	} catch (error) {
		console.log(error);
	}
};

start();