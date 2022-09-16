import { config } from 'dotenv'
config()

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  SPOTIFY_API_ID: process.env.SPOTIFY_API_ID,
  SPOTIFY_API_SECRET: process.env.SPOTIFY_API_SECRET,
  NAPSTER_API_KEY: process.env.NAPSTER_API_KEY,
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
  BCRYPT_KEY: process.env.BCRYPT_KEY
}
