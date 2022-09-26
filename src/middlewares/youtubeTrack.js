import axios from 'axios'
import { YOUTUBE_API_KEY } from '../config/envProcess.js'

export const youtubeTrack = async (req, res, songTrack) => {
  try {
    const youtubeQueryURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=${YOUTUBE_API_KEY}&type=video&topic=music&maxResults=1&videoCategory=music&q=${songTrack}`
    const youtubeLinkEncode = encodeURI(youtubeQueryURL)
    const response = await axios.get(youtubeLinkEncode)

    const videoId = response.data.items[0].id.videoId

    const youtube = { url: `https://music.youtube.com/watch?v=${videoId}` }

    return youtube || null
  } catch (err) {
    console.log(err)
  }
}
