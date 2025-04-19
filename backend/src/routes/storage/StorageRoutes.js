const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const verifyToken = require('../middleware/VerifyToken');
const authorizeRoles = require('../middleware/AuthorizeRoles');
const { uploaders, directories, buildCdnUrl } = require('./ImageService');
router.post('/blog-image', verifyToken, authorizeRoles(['admin']), (req, res) => {
  uploaders.blogImage.single('blogImage')(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageUrl = buildCdnUrl('blog', req.file.filename);
    res.status(200).json({ imageUrl });
  });
});

router.get('/blog-image/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(directories.blogImages, filename);
  
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).json({ message: 'Image not found' });
  }
});

router.post('/portfolio-image', verifyToken, authorizeRoles(['admin']), (req, res) => {
  uploaders.portfolioImage.single('image')(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageUrl = buildCdnUrl('portfolio', req.file.filename);
    res.status(200).json({ imageUrl });
  });
});

router.get('/portfolio-image/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(directories.portfolioImages, filename);
  
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).json({ message: 'Image not found' });
  }
});

router.post('/profile-picture', verifyToken, (req, res) => {
  uploaders.profilePicture.single('profilePicture')(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageUrl = buildCdnUrl('profile', req.file.filename);
    res.status(200).json({ imageUrl });
  });
});

router.get('/profile-picture/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(directories.profilePictures, filename);
  
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).json({ message: 'Profile picture not found' });
  }
});

module.exports = router;
