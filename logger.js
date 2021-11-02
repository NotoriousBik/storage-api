const Metadata = require('./models/Metadata')
const fs = require("fs")
const path = require("path")
//write metadata to the db, rewrite if file exists
const writeMetadata = async (name, mimeType, size) => {

  //check if file is already exists
  let metadata = await Metadata.findOne({ name: name })
  
  if (!metadata) {

    try {
      metadata = await Metadata.create({ name: name, mimeType: mimeType, size: size })
      return (metadata);
    } catch (e) {
      console.log(e);
      return e;
    }

  } else {

    try {
      metadata = await await Metadata.findOneAndUpdate({ name: name }, { name: name, mimeType: mimeType, size: size }, { new: true, runValidators: true })
      return (metadata);
    } catch (e) {
      console.log(e);
      return e;
    }
  }

}

//get files metadata
const getMetadata = async (name) => {

  try {
    const metadata = await Metadata.findOne({ name: name })
    console.log(metadata);
    if (!metadata) {
      return { msg: 'File does not exist' }
    }

    return (metadata);
  } catch (e) {
    console.log(e);
    return e;
  }

}

//get files metadata
const checkFolderSize = async (dirPath) => {

  //function which returns all files in a folder
  const getAllFiles = function(dirPath) {
    files = fs.readdirSync(dirPath)
  
    arrayOfFiles = []
  
    files.forEach(function(file) {
      if (fs.statSync(dirPath + "/" + file).isDirectory()) {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
      } else {
        arrayOfFiles.push(path.join(__dirname, dirPath, file))
      }
    })
  
    return arrayOfFiles
  }
  
  //function which summarize all files sizes in bytes
  const getTotalSize = function(dirPath) {
    const arrayOfFiles = getAllFiles(dirPath)
  
    let totalSize = 0
  
    arrayOfFiles.forEach(function(filePath) {
      totalSize += fs.statSync(filePath).size
    })
  
    return totalSize
  }

  return (getTotalSize(dirPath))

}

module.exports = { writeMetadata, getMetadata, checkFolderSize}

