const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.resolve(__dirname, '../uploads');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const mimetypes = {
      'image/png': '.png',
      'image/gif': '.gif',
      'image/jpg': '.jpg',
      'image/jpeg': '.jpg',
    };
    const random = Math.round(Math.random() * 1e9)
    cb(null, Date.now() + '-' + random + mimetypes[file.mimetype]);
  },
});

const fileFilter = (req, file, cb) => {
  const mimetypeImages = ['image/png', 'image/gif', 'image/jpg', 'image/jpeg'];

  cb(null, mimetypeImages.includes(file.mimetype));
};

module.exports = multer({
  storage,
  fileFilter,
});
