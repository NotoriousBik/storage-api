const Metadata = require('./models/Metadata')

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

module.exports = { writeMetadata, getMetadata }

