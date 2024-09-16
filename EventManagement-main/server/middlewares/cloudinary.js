require("dotenv").config();
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.getFile = async (id) => {
  try {
    return await cloudinary.v2.api.resource_by_asset_id(id)
  } catch (error) {
    console.log(error);
  }
};

exports.deleteFile = async (id) => {
  try {
    return await cloudinary.v2.uploader.destroy(id)
  } catch (error) {
    console.log(error);
  }
};

exports.uploadFile = async (filename, tag) => {
  try {
    try {
      return await cloudinary.v2.uploader.upload(filename, {
        resource_type: 'image',
        type: 'upload',
        tags: tag
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Upload Error!!!");
    }
  } catch (error) {
    return error
  }
};