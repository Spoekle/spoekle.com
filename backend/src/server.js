const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('./config/config');

console.log('Config loaded...');
console.log('Created admin user with the following credentials:');
console.log(`Username: ${process.env.ADMIN_USERNAME}`);
console.log(`Password: ${process.env.ADMIN_PASSWORD}`);

const uploadsDir = path.join(__dirname, 'uploads');
const profilePicturesDir = path.join(__dirname, 'profilePictures');
const downloadDir = path.join(__dirname, 'download');
const chunksDir = path.join(__dirname, 'download/tmp');
const photosDir = path.join(__dirname, 'uploads', 'photos');
const photoThumbnailsDir = path.join(__dirname, 'uploads', 'photos', 'thumbnails');

[uploadsDir, profilePicturesDir, downloadDir, chunksDir, photosDir, photoThumbnailsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

mongoose.connect("mongodb://mongo:27017/spoekleDB", {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
})
.then(() => {
  console.log('Connected to MongoDB at container...');
  require('./scripts/CreateAdmin');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.error('Please check if MongoDB is running at container');
});

const app = express();

app.set('trust proxy', true);
app.use((_req, _res, next) => {
  _req.ip = _req.headers['x-forwarded-for'] || _req.socket.remoteAddress;
  next();
});

app.use(bodyParser.json({ limit: '3072mb' }));
app.use(bodyParser.urlencoded({ limit: '3072mb', extended: true }));
app.use(express.json({ limit: '3072mb' }));

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use('/api/uploads', express.static(uploadsDir));
app.use('/api/profilePictures', express.static(profilePicturesDir));
app.use('/api/download', express.static(downloadDir));

// API route imports
const adminRoute = require('./routes/Admin');
const userRoute = require('./routes/User');
const discordRoute = require('./routes/Discord');
const blogRoute = require('./routes/Blog');
const portfolioRoute = require('./routes/Portfolio');
const storageRoutes = require('./routes/storage/StorageRoutes');
const cdnRoute = require('./routes/CdnRoute');
const dbAdminRoute = require('./routes/DbAdmin');
const contactRoute = require('./routes/Contact');

let photoRoute;
let photoFilesRoute;
try {
  photoRoute = require('./routes/PhotoRoute');
  photoFilesRoute = require('./routes/PhotoFilesRoute');
  console.log('Photo routes imported successfully');
} catch (error) {
  console.error('Error importing photo routes:', error.message);
  const express = require('express');
  photoRoute = express.Router();
  photoFilesRoute = express.Router();
}

// API routes
app.use('/api/admin', adminRoute);
app.use('/api/users', userRoute);
app.use('/api/discord', discordRoute);
app.use('/api/blog', blogRoute);
app.use('/api/portfolio', portfolioRoute);
app.use('/api/storage', storageRoutes);
app.use('/api/photos', photoRoute);
app.use('/api/photo-files', photoFilesRoute);
app.use('/api/db-admin', dbAdminRoute);
app.use('/api/contact', contactRoute);
app.use('/', cdnRoute);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong'
  });
});

// Fallback route handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

app.listen(5000, () => {
  console.log('Server is running on port 5000...');
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});