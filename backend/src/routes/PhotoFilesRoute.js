const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { directories } = require('./storage/ImageService');

router.get('/photos/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(directories.photos, filename);
  
  // Check if file exists
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).json({ message: 'Photo not found' });
  }
});

router.get('/thumbnails/:filename', (req, res) => {
  const filename = req.params.filename;
  const thumbnailPath = path.join(directories.thumbnails, filename);
  
  // Check if file exists
  if (fs.existsSync(thumbnailPath)) {
    res.sendFile(thumbnailPath);
  } else {
    res.status(404).json({ message: 'Thumbnail not found' });
  }
});

module.exports = router;
