// filepath: /data/compose/spoekle.com/backend/src/routes/storage/ImageService.js
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { ExifImage } = require('exif');

// Base upload directory
const uploadsBaseDir = path.join(__dirname, '..', '..', 'uploads');

// Define all image directory paths
const directories = {
  photos: path.join(uploadsBaseDir, 'photos'),
  thumbnails: path.join(uploadsBaseDir, 'photos', 'thumbnails'),
  blogImages: path.join(uploadsBaseDir, 'blogImages'),
  portfolioImages: path.join(uploadsBaseDir, 'portfolioImages'),
  profilePictures: path.join(__dirname, '..', '..', 'profilePictures')
};

// Ensure all directories exist
Object.values(directories).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Common file filter for image files
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, PNG, WEBP, and GIF files are allowed.'), false);
  }
};

// Create storage factory function
const createStorage = (destination) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
};

// Create multer uploader factory function
const createUploader = (directory, sizeLimit) => {
  return multer({
    storage: createStorage(directory),
    limits: {
      fileSize: sizeLimit
    },
    fileFilter: imageFileFilter
  });
};

// Create the multer upload instances with appropriate size limits
const uploaders = {
  photo: createUploader(directories.photos, 40 * 1024 * 1024), // 40MB
  blogImage: createUploader(directories.blogImages, 5 * 1024 * 1024), // 5MB
  portfolioImage: createUploader(directories.portfolioImages, 5 * 1024 * 1024), // 5MB
  profilePicture: createUploader(directories.profilePictures, 2 * 1024 * 1024) // 2MB
};

// Function to extract EXIF metadata from images
const extractMetadata = (filePath) => {
  return new Promise((resolve, reject) => {
    try {
      new ExifImage({ image: filePath }, (error, exifData) => {
        if (error) {
          console.log('EXIF error: ' + error.message);
          resolve({}); // Return empty object if no EXIF data
        } else {
          const metadata = {
            camera: exifData.image && exifData.image.Make ? 
              `${exifData.image.Make} ${exifData.image.Model}` : 'Unknown',
            lens: exifData.exif && exifData.exif.LensModel ? 
              exifData.exif.LensModel : 'Unknown',
            aperture: exifData.exif && exifData.exif.FNumber ? 
              `f/${exifData.exif.FNumber}` : 'Unknown',
            shutterSpeed: exifData.exif && exifData.exif.ExposureTime ? 
              `${exifData.exif.ExposureTime}s` : 'Unknown',
            iso: exifData.exif && exifData.exif.ISO ? 
              exifData.exif.ISO : 'Unknown',
            focalLength: exifData.exif && exifData.exif.FocalLength ? 
              `${exifData.exif.FocalLength}mm` : 'Unknown'
          };
          
          // Safe date handling
          if (exifData.exif && exifData.exif.CreateDate) {
            try {
              const dateStr = exifData.exif.CreateDate.toString();
              const parsedDate = new Date(dateStr);
              // Only set the date if it's valid
              if (!isNaN(parsedDate.getTime())) {
                metadata.takenAt = parsedDate;
              }
            } catch (dateError) {
              console.log('Error parsing EXIF date:', dateError);
            }
          }
          
          resolve(metadata);
        }
      });
    } catch (error) {
      console.log('Error extracting EXIF data: ', error);
      resolve({});
    }
  });
};

// Function to create a thumbnail
const generateThumbnail = async (filePath, filename) => {
  try {
    const thumbnailPath = path.join(directories.thumbnails, `thumb_${filename}`);
    await sharp(filePath)
      .resize(400)
      .jpeg({ quality: 70 })
      .toFile(thumbnailPath);
    
    return thumbnailPath;
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    throw error;
  }
};

// Function to optimize the original image
const optimizeOriginalImage = async (filePath, filename) => {
  try {
    // Create a temporary path for the optimized image
    const optimizedPath = path.join(directories.photos, `opt_temp_${filename}`);
    const finalPath = path.join(directories.photos, filename);
    
    // Optimize the image - convert to JPEG with 85% quality (good balance of quality and compression)
    await sharp(filePath)
      .jpeg({ quality: 85, mozjpeg: true })
      .withMetadata()
      .toFile(optimizedPath);
    
    // Replace the original with the optimized version
    fs.unlinkSync(filePath); // Remove the original
    fs.renameSync(optimizedPath, finalPath); // Rename optimized to original name
    
    return finalPath;
  } catch (error) {
    console.error('Error optimizing image:', error);
    return filePath; // Return original path if optimization fails
  }
};

// CDN URL builder
const buildCdnUrl = (type, filename, isThumbnail = false) => {
  const baseUrl = 'https://cdn.spoekle.com/api/cdn/images';
  
  switch(type) {
    case 'photo':
      return isThumbnail 
        ? `${baseUrl}/photos/thumbnails/${filename}`
        : `${baseUrl}/photos/${filename}`;
    case 'blog':
      return `${baseUrl}/blog/${filename}`;
    case 'portfolio':
      return `${baseUrl}/portfolio/${filename}`;
    case 'profile':
      return `${baseUrl}/profile/${filename}`;
    default:
      return `${baseUrl}/${filename}`;
  }
};

module.exports = {
  directories,
  uploaders,
  extractMetadata,
  generateThumbnail,
  optimizeOriginalImage,
  buildCdnUrl
};
