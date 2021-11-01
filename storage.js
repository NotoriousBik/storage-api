const fs = require("fs");

const readStream = fs.createReadStream(whereFrom)
const writeStream = fs.createWriteStream(whereTo)

// You could achieve the same with destructuring:
const {createReadStream, createWriteStream} = require("fs");