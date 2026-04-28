require('dotenv').config();
const app = require('../src/app.js');
const connectToDB = require('../src/config/database.js');

// Connect to database on serverless function initialization
connectToDB();

module.exports = app;
