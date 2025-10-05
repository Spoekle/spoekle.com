// Example configuration for email service
// Copy this to your actual config.js file and replace with your actual values

const crypto = require('crypto');

// Admin credentials
const adminUsername = 'admin';
process.env.ADMIN_USERNAME = adminUsername;
const adminPassword = crypto.randomBytes(15).toString('hex').match(/.{1,5}/g).join('-');
process.env.ADMIN_PASSWORD = adminPassword;

// Discord OAuth2 credentials for the application
process.env.DISCORD_CLIENT_ID = 'CLIENT_ID';
process.env.DISCORD_CLIENT_SECRET = 'CLIENT_SECRET';

// Secret key for JWT
const secretKey = crypto.randomBytes(64).toString('hex');
process.env.SECRET_KEY = secretKey;

// Email configuration for contact form
// Replace these with your actual email credentials
process.env.EMAIL_USER = 'your.email@gmail.com'; // Your Gmail address
process.env.EMAIL_PASSWORD = '';
process.env.CONTACT_EMAIL = 'your.email@gmail.com'; // Where you want to receive contact form emails
