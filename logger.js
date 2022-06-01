
const fs = require('fs');
const path = require('path');


class Logger {

  log = (text) => {
    console.log(text)
    fs.appendFileSync('stdout.txt', `${new Date(Date.now()).toString()}: ${text}\n`);
  }

  error = (text) => {
    console.log(text)
    fs.appendFileSync('stderr.txt', `${new Date(Date.now()).toString()}: ${text}\n`);
  }

}

//check folder size
const checkFolderSize = async (dirPath) => {

  //function which returns all files in a folder
  const getAllFiles = function (dirPath) {
    const files = fs.readdirSync(dirPath);

    let arrayOfFiles = [];

    files.forEach(function (file) {
      if (fs.statSync(dirPath + '/' + file).isDirectory()) {
        arrayOfFiles = getAllFiles(`${dirPath}/${file}`, arrayOfFiles);
      } else {
        arrayOfFiles.push(path.join(__dirname, dirPath, file));
      }
    });

    return arrayOfFiles;
  };

  //function which summarize all files sizes in bytes
  getTotalSize = function (dirPath) {
    const arrayOfFiles = getAllFiles(dirPath);

    let totalSize = 0;

    arrayOfFiles.forEach(function (filePath) {
      totalSize += fs.statSync(filePath).size;
    });

    return totalSize;
  };

  return (getTotalSize(dirPath));

};





module.exports = { checkFolderSize, Logger };
