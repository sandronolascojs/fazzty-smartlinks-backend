import axios from 'axios'

export const deezerTrack = async (req, res) => {
  const { isrc } = req.body
  try {
    const deezerURI = `https://api.deezer.com/track/isrc:${isrc}`
    const deezerResponse = await axios.get(deezerURI)
    const data = deezerResponse.data
    if (deezerResponse.data.error) {
      return null
    } else {
      const { title, contributors, album } = deezerResponse.data
      const deezer = {
        name: title || null,
        artists: contributors.map(artist => artist.name) || null,
        albumImage: album.cover_xl || null,
        releaseDate: data.release_date || null,
        url: data.link || null,
        preview: data.preview || null
      }
      return deezer
    }
  } catch (err) {
    console.log(err)
  }
}
