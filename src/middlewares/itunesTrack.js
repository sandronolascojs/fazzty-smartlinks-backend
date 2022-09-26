import axios from 'axios'

export const itunesTrack = async (req, res, songTrack) => {
  try {
    const itunesURL = `https://itunes.apple.com/search?term=${songTrack}&media=music&entity=musicTrack,album,mix,song&limit=1`
    const itunesLinkEncode = encodeURI(itunesURL)
    const itunesResponse = await axios.get(itunesLinkEncode)

    if (itunesResponse.data.results.length === 0) {
      return null
    }

    const { collectionId, collectionName, artistName, previewUrl } = itunesResponse.data.results[0]

    const itunes = {
      name: collectionName || null,
      artists: artistName || null,
      url: `https://itunes.apple.com/us/album/${collectionId}` || null,
      preview: previewUrl || null

    }
    return itunes
  } catch (err) {
    console.log(err)
  }
}
