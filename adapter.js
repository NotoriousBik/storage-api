const {writeMetadata, getMetadata, checkFolderSize} = require('./logger')
const fs = require('fs');

// Take in the request & filepath, stream the file to the filePath
const uploadFile = (req, filePath) => {
  const { filename: filename } = req.params;
  return new Promise((resolve, reject) => {
   const stream = fs.createWriteStream(filePath);
   // With the open - event, data will start being written
   // from the request to the stream's destination path
   stream.on('open', () => {
    
    //log start saving time
    fs.appendFileSync("stdout.txt", `Start saving file ${filename}` + '\n');
    fs.appendFileSync("stdout.txt", new Date(Date.now()).toString() + '\n');
    console.log('Stream open ...  0.00%');

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
    fs.appendFileSync("stdout.txt", `Finished saving file ${filename}`+ '\n');
    fs.appendFileSync("stdout.txt", new Date(Date.now()).toString() + '\n');

    //check if folder is bigger than 10 mb and log if true
    if (checkFolderSize('./data') > 10^6 * 10) {
      fs.appendFileSync("stdout.txt", `WARNING: Size of the folder exceeded 10 mb!`+ '\n');
    }

    //write metadata to the database
    const mimeType = req.headers['content-type'];
    const size = parseInt(stream.bytesWritten);
    writeMetadata(filename, mimeType, size)
    resolve(filePath);
   });

    // If error, reject the promise
   stream.on('error', err => {
    console.error(err);
    reject(err);
   });
  });
 };


// Take in the request & filepath, stream the file to the filePath
const downloadFile = (req, res, filePath) => {
  const { filename: filename } = req.params;
  const metadata = getMetadata(filename);
  console.log(metadata);
  //return error
  if (metadata.msg) {
    return res.send({msg: metadata.msg})
  }
  res.download(filePath)
 };


 module.exports = {uploadFile,downloadFile};