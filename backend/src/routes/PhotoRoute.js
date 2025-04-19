const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const verifyToken = require('./middleware/VerifyToken');
const authorizeRoles = require('./middleware/AuthorizeRoles');
const Photo = require('../models/photoModel');
const { uploaders, extractMetadata, generateThumbnail, optimizeOriginalImage, directories, buildCdnUrl } = require('./storage/ImageService');

router.post('/', verifyToken, authorizeRoles(['admin', 'uploader']), (req, res) => {
  uploaders.photo.single('photo')(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
      const { title, description, category, location } = req.body;
      const filePath = path.join(directories.photos, req.file.filename);
      
      // First optimize the original image
      const optimizedPath = await optimizeOriginalImage(filePath, req.file.filename);
      
      // Generate thumbnail
      const thumbnailPath = await generateThumbnail(optimizedPath, req.file.filename);
      const thumbnailFilename = path.basename(thumbnailPath);
      
      // Extract metadata from the image
      const metadata = await extractMetadata(optimizedPath);
      
      // Add location data from the form if available
      if (location) {
        metadata.location = location;
      }
      
      // Create the photo record in the database
      const photo = new Photo({
        title: title || 'Untitled Photo',
        description: description || '',
        imageUrl: buildCdnUrl('photo', req.file.filename),
        thumbnailUrl: buildCdnUrl('photo', thumbnailFilename, true),
        category: category || 'Other',
        metadata,
        userId: req.user.id
      });
      
      await photo.save();
      
      res.status(200).json({ 
        message: 'Photo uploaded successfully',
        photo
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      res.status(500).json({ message: 'Error uploading photo' });
    }
  });
});

router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;
    
    const filter = {};
    if (category && category !== 'All') {
      filter.category = category;
    }
    
    const photos = await Photo.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Photo.countDocuments(filter);
    
    res.json({
      photos,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ message: 'Error fetching photos' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    
    res.json(photo);
  } catch (error) {
    console.error('Error fetching photo:', error);
    res.status(500).json({ message: 'Error fetching photo' });
  }
});

router.put('/:id', verifyToken, authorizeRoles(['admin', 'uploader']), async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    
    // Check if user has permission
    if (photo.userId.toString() !== req.user.id && !req.user.roles.includes('admin')) {
      return res.status(403).json({ message: 'Permission denied' });
    }
    
    const { title, description, category, location } = req.body;
    
    if (title) photo.title = title;
    if (description !== undefined) photo.description = description;
    if (category) photo.category = category;
    if (location) photo.metadata.location = location;
    
    await photo.save();
    
    res.json({
      message: 'Photo updated successfully',
      photo
    });
  } catch (error) {
    console.error('Error updating photo:', error);
    res.status(500).json({ message: 'Error updating photo' });
  }
});

router.delete('/:id', verifyToken, authorizeRoles(['admin', 'uploader']), async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    
    // Check if user has permission
    if (photo.userId.toString() !== req.user.id && !req.user.roles.includes('admin')) {
      return res.status(403).json({ message: 'Permission denied' });
    }
    
    // Delete the image files
    const imagePath = path.join(directories.photos, path.basename(photo.imageUrl));
    const thumbnailPath = path.join(directories.thumbnails, path.basename(photo.thumbnailUrl));
    
    try {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    } catch (fileError) {
      console.error('Error deleting photo files:', fileError);
      // Continue with deletion from database even if file deletion fails
    }
    
    // Remove from database
    await photo.deleteOne();
    
    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({ message: 'Error deleting photo' });
  }
});

router.get('/categories', (req, res) => {
  // These categories match the ones in the schema
  const categories = ['Nature', 'Urban', 'Travel', 'Portrait', 'Other'];
  res.json(categories);
});

module.exports = router;
