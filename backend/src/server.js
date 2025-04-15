const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
require('./config/config');

console.log('Config loaded...');
console.log('Created admin user with the following credentials:');
console.log(`Username: ${process.env.ADMIN_USERNAME}`);
console.log(`Password: ${process.env.ADMIN_PASSWORD}`);

// Create necessary directories if they don't exist
const uploadsDir = path.join(__dirname, 'uploads');
const profilePicturesDir = path.join(__dirname, 'profilePictures');
const downloadDir = path.join(__dirname, 'download');
const chunksDir = path.join(__dirname, 'download/tmp');

[uploadsDir, profilePicturesDir, downloadDir, chunksDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Improved MongoDB connection to use the correct remote MongoDB server IP
// This setup mirrors the working approach from OV-Tikkertje
mongoose.connect("mongodb://192.168.1.62:27017/spoekleDB", {
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
  socketTimeoutMS: 45000, // Increase socket timeout
  connectTimeoutMS: 30000, // Increase connect timeout
})
.then(() => {
  console.log('Connected to MongoDB at container...');
  // Only require CreateAdmin after successful MongoDB connection
  require('./scripts/CreateAdmin');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.error('Please check if MongoDB is running at container');
  // Don't exit the process, let the application continue without DB
});

const app = express();

app.set('trust proxy', true);
app.use((_req, _res, next) => {
  _req.ip = _req.headers['x-forwarded-for'] || _req.socket.remoteAddress;
  next();
});

// Increase limits for large file uploads (3GB)
app.use(bodyParser.json({ limit: '3072mb' }));
app.use(bodyParser.urlencoded({ limit: '3072mb', extended: true }));
app.use(express.json({ limit: '3072mb' }));

// Increase request timeout for large uploads
app.use((_req, _res, next) => {
  // Set timeout to 2 hours to prevent timeouts during large uploads
  _req.setTimeout(7200000);
  next();
});

// Configure CORS with more detailed settings
app.use(cors({
  origin: "*", // In production, restrict to your domain
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Static content serving
app.use('/uploads', express.static(uploadsDir));
app.use('/profilePictures', express.static(profilePicturesDir));
app.use('/download', express.static(downloadDir));

// Import route modules
const adminRoute = require('./routes/Admin');
const userRoute = require('./routes/User');
const clipsRoute = require('./routes/Clips');
const messagesRoute = require('./routes/Messages');
const ratingsRoute = require('./routes/Ratings');
const discordRoute = require('./routes/Discord');
const configRoute = require('./routes/Config');
const notificationsRoute = require('./routes/Notifications'); // Add notifications route

// Register API routes
app.use('/api/admin', adminRoute);
app.use('/api/users', userRoute);
app.use('/api/clips', clipsRoute);
app.use('/api/messages', messagesRoute);
app.use('/api/ratings', ratingsRoute);
app.use('/api/discord', discordRoute);
app.use('/api/config', configRoute);
app.use('/api/notifications', notificationsRoute); // Register notifications route

// Swagger API documentation configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'ClipSesh API',
      version: '1.0.0',
      description: 'API for ClipSesh',
    },
    servers: [
      {
        url: `https://api.spoekle.com`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [path.join(__dirname, './routes/*.js'), path.join(__dirname, './models/*.js')],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
  // Keep the server running
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Keep the server running
});