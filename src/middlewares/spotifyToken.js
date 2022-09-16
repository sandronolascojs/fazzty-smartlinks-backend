import axios from 'axios'
import qs from 'qs'
import { SPOTIFY_API_ID, SPOTIFY_API_SECRET } from '../config/envProcess.js'

const authTOken = Buffer.from(`${SPOTIFY_API_ID}:${SPOTIFY_API_SECRET}`, 'utf-8').toString('base64')
const grantType = qs.stringify({ grant_type: 'client_credentials' })

const getAuth = async () => {
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', grantType, {
      headers: {
        Authorization: `Basic ${authTOken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    return response.data.access_token
  } catch (err) {
    console.log(err)
  }
}

export default getAuth
