const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

const ImageValidation =async  (file,basePath,pathOfFile) => {

    console.log("hi4");
  
    const filetypes = /jpg|jpeg|png|webp/;
  
    const mimetype = filetypes.test(file.mimetype);
    console.log("hi5", file);
  
    if (mimetype === false){
    await unlinkAsync(pathOfFile)

      return (response = {
        error: true,            
        msg: "Only JPEG, JPG, PNG, and WebP files are allowed!",
      });}
    console.log("hi3");
  
    // Check file size
    const maxSize = 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      await unlinkAsync(pathOfFile)

      return (response = {
        error: true,
        msg: "File size exceeds the maximum limit of 1 mb",
      });
    }
    const fileName = file?.filename;
    let photo = file ? `${basePath}/${fileName}` : null;
    console.log(photo)
    return (response = { photo });
  };
  
  module.exports = {
    ImageValidation,
  };