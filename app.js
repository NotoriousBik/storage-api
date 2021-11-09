const app = require('express')();
const fs = require('fs');
const path = require('path');
const connectDB = require('./db/connect');
const {uploadFile, downloadFile} = require('./adapter');
require('dotenv').config();
const port = process.env.PORT || 3000;

// check if server is up
app.get('/', (req, res) => {
	res.status(200).send('Server up and running');
});
 
//file uploading
app.put('/files/:filename', (req, res) => {
	const { filename: filename } = req.params;
	const filePath = path.join(__dirname, `/data/${filename}`);
	uploadFile(req, filePath)
		.then(path => res.send({ status: 'success', path }))
		.catch(err => res.send({ status: 'error', err }));

});

//file downloading
app.get('/files/:filename', (req, res) => {
	const { filename: filename } = req.params;
	const filePath = path.join(`./data/${filename}`);
	downloadFile(req, res, filePath);

});

//check if database connection is established than start server
const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(port, console.log(`Server is listening on port ${port}...`));
	} catch (error) {
		console.log(error);
	}
};

start();