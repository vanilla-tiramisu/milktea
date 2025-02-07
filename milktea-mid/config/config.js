var dotenv = require('dotenv');
dotenv.config();

const baseURL = process.env.BASE_URL;
const apiKey = process.env.API_KEY;
const model = process.env.MODEL;
const pineconeKey = process.env.PINECONE_KEY;
module.exports = {
    baseURL,
    apiKey,
    model,
    pineconeKey
};
