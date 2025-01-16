const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Upload folder stuff
const postsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true });
}

// Configure multer storage for profile pictures
const postsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, postsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const postUpload = multer({ storage: postsStorage });

module.exports = postUpload;