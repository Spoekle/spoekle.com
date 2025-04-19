// filepath: /data/compose/spoekle.com/backend/src/routes/CdnRoute.js
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Create reference to directory paths
const uploadsDir = path.join(__dirname, '..', 'uploads');
const profilePicturesDir = path.join(__dirname, '..', 'profilePictures');
const downloadDir = path.join(__dirname, '..', 'download');

// Direct route for blog images
router.get('/api/cdn/images/blog/:filename', (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  const imagePath = path.join(uploadsDir, 'blogImages', filename);
  
  console.log(`Trying to serve blog image: ${imagePath}`);
  
  if (fs.existsSync(imagePath)) {
    // Set caching headers
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.sendFile(imagePath);
  } else {
    console.error(`Image not found: ${imagePath}`);
    res.status(404).json({ error: 'Not Found', path: req.originalUrl });
  }
});

// Direct route for photo images
router.get('/api/cdn/images/photos/:filename', (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  const imagePath = path.join(uploadsDir, 'photos', filename);
  
  console.log(`Trying to serve photo: ${imagePath}`);
  
  if (fs.existsSync(imagePath)) {
    // Set caching headers
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.sendFile(imagePath);
  } else {
    console.error(`Photo not found: ${imagePath}`);
    res.status(404).json({ error: 'Not Found', path: req.originalUrl });
  }
});

// Direct route for photo thumbnails
router.get('/api/cdn/images/photos/thumbnails/:filename', (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  const imagePath = path.join(uploadsDir, 'photos', 'thumbnails', filename);
  
  console.log(`Trying to serve photo thumbnail: ${imagePath}`);
  
  if (fs.existsSync(imagePath)) {
    // Set caching headers
    res.setHeader('Cache-Control', 'public, max-age=604800'); // Cache for 7 days (thumbnails can be cached longer)
    res.sendFile(imagePath);
  } else {
    console.error(`Thumbnail not found: ${imagePath}`);
    res.status(404).json({ error: 'Not Found', path: req.originalUrl });
  }
});

// Direct route for portfolio images
router.get('/api/cdn/images/portfolio/:filename', (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  const imagePath = path.join(uploadsDir, 'portfolioImages', filename);
  
  console.log(`Trying to serve portfolio image: ${imagePath}`);
  
  if (fs.existsSync(imagePath)) {
    // Set caching headers
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.sendFile(imagePath);
  } else {
    console.error(`Portfolio image not found: ${imagePath}`);
    res.status(404).json({ error: 'Not Found', path: req.originalUrl });
  }
});

// Direct route for profile pictures
router.get('/api/cdn/images/profile/:filename', (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  const imagePath = path.join(profilePicturesDir, filename);
  
  console.log(`Trying to serve profile picture: ${imagePath}`);
  
  if (fs.existsSync(imagePath)) {
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.sendFile(imagePath);
  } else {
    console.error(`Profile picture not found: ${imagePath}`);
    res.status(404).json({ error: 'Not Found', path: req.originalUrl });
  }
});

// Direct route for download files
router.get('/api/cdn/files/:filename', (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  const filePath = path.join(downloadDir, filename);
  
  console.log(`Trying to serve file: ${filePath}`);
  
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    console.error(`File not found: ${filePath}`);
    res.status(404).json({ error: 'Not Found', path: req.originalUrl });
  }
});

module.exports = router;
