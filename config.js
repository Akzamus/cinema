require('dotenv').config();

module.exports = {
    JWT_SECRET: process.env.JWT_SECRET,
    PORT: process.env.PORT,
    MONGODB_CONNECT_URL: process.env.MONGODB_CONNECT_URL,
    TMDB_API_KEY: process.env.TMDB_API_KEY
}
