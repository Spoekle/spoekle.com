// Usage: import apiUrl from './config';
// Must be set before running the frontend to ensure that the API URL is correct
// Rename this file to config.js before using

const apiUrl = 'https://your.backend.url';
process.env.API_URL = apiUrl;

module.exports = apiUrl;