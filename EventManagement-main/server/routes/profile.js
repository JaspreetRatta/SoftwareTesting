const router = require("express").Router();
const User = require("../models/usersModel");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const upload = require('../config/multer.js');
const { deleteFile, uploadFile } = require("../middlewares/cloudinary.js")

// Handle profile update
router.put('/:id', upload.single('profilePicture'), async (req, res) => {
  let body = req.body;
  const id = req.params.id;
  if (req.file) {
    const user = await User.findById(id);
    if (user.profilePicture) {
      // remove File
      const arr = user.profilePicture.split("/")
      const fileName = arr[arr.length - 1]
      await deleteFile(fileName.split('.')[0]);
    }
    const fileName = path.resolve(__dirname, '../uploads/' + req.file.filename)
    const result = await uploadFile(fileName, 'avatar')
    body.profilePicture = result.url
    fs.unlinkSync(fileName);
  }

  if (body.password) {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    body.password = hashedPassword;
  }
  await User.findByIdAndUpdate(id, body);
  return res.status(200).send({
    success: true,
    message: "Profile updated successfully",
  });
});

module.exports = router;

