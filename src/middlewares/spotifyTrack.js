import axios from 'axios'
import getAuth from './spotifyToken.js'

export const spotifyTrack = async (req, res) => {
  const { isrc } = req.body
  try {
    const accessToken = await getAuth()
    const trackUrl = `https://api.spotify.com/v1/search?type=track&q=isrc:${isrc}`
    const spotifyResponse = await axios.get(trackUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (spotifyResponse.data.tracks.items.length === 0) {
      return null
    } else {
      const { album, artists, explicit } = spotifyResponse.data.tracks.items[0]
      const spotify = {
        type: album.album_type || null,
        name: album.name || null,
        artists: artists.map(artist => artist.name) || null,
        url: album.external_urls.spotify || null,
        preview: spotifyResponse.data.tracks.items[0].preview_url || null,
        albumImage: album.images[0].url || null,
        releaseDate: album.release_date || null,
        explicit
      }

      return spotify
    }
  } catch (err) {
    console.log(err)
  }
}
