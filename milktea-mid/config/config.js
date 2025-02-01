var dotenv = require('dotenv');
dotenv.config();

module.exports = {
    baseURL: process.env.BASE_URL,
    apiKey: process.env.API_KEY,
    model: process.env.MODEL,
};