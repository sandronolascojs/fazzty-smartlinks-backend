import axios from 'axios'
import { NAPSTER_API_KEY } from '../config/envProcess.js'

export const napsterTrack = async (req, res) => {
  const { isrc } = req.body

  try {
    const napsterResponse = await axios.get(`https://api.napster.com/v2.2/tracks/isrc/${isrc}`, {
      headers: {
        apikey: NAPSTER_API_KEY
      }
    })
    const { albumId, name } = napsterResponse.data.tracks[0]

    const napster = {
      artists: napsterResponse.data.tracks[0].artistName,
      name,
      url: `https://play.napster.com/album/${albumId}`,
      preview: napsterResponse.data.tracks[0].previewURL || null
    }
    return napster
  } catch (err) {
    return null
  }
}
