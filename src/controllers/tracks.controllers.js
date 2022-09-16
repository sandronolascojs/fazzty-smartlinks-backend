import axios from 'axios'
import { deezerTrack } from '../middlewares/deezerTrack.js'
import { itunesTrack } from '../middlewares/itunesTrack.js'
import { napsterTrack } from '../middlewares/napsterTrack.js'
import { spotifyTrack } from '../middlewares/spotifyTrack.js'
import { youtubeTrack } from '../middlewares/youtubeTrack.js'
import getAuth from '../middlewares/spotifyToken.js'
import { responseHandler } from '../utils/responseHandler.utils.js'

export const getTrack = async (req, res, next) => {
  try {
    const spotify = await spotifyTrack(req, res)
    const deezer = await deezerTrack(req, res)
    const napster = await napsterTrack(req, res)
    if (spotify || deezer || napster) {
      const artistName = spotify.artists ? spotify.artists[0] : deezer.artists ? deezer.artists[0] : napster.artists ? napster.artists : null
      const trackName = spotify.name || deezer.name || napster.name || null
      const songTrack = artistName ? artistName + ' ' + trackName : null
      const itunes = await itunesTrack(req, res, songTrack)
      const youtube = await youtubeTrack(req, res, songTrack)

      const track = {
        artists: spotify.artists || deezer.artists || napster.artists || null,
        name: spotify.name || deezer.name || napster.name || null,
        previewUrl: {
          spotify: spotify.preview || null,
          deezer: deezer.preview || null,
          napster: napster.preview || null
        },
        links: {
          spotify: spotify.url || null,
          deezer: deezer.url || null,
          napster: napster.url || null,
          itunes: itunes.url || null,
          youtube: youtube.url || null
        },
        images: {
          spotify: spotify.albumImage || null,
          deezer: deezer.albumImage || null
        },
        releaseDate: spotify.releaseDate || deezer.releaseDate || null,
        explicit: spotify.explicit
      }
      return responseHandler(res, false, 200, 'Success', track)
    } else {
      return responseHandler(res, true, 404, 'No results found or invalid ISRC.')
    }
  } catch (err) {
    next(err)
  }
}

export const getTracksBySpotifyId = async (req, res, next) => {
  const { id } = req.params
  try {
    const accessToken = await getAuth()
    const trackUrl = `https://api.spotify.com/v1/tracks/${id}`
    const spotifyResponse = await axios.get(trackUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (spotifyResponse.data === 0) {
      return null
    } else {
      const { album, artists, explicit } = spotifyResponse.data
      const track = {
        isrc: spotifyResponse.data.external_ids.isrc,
        artists: artists.map(artist => artist.name),
        name: album.name,
        previewUrl: {
          spotify: spotifyResponse.data.preview_url

        },
        links: {
          spotify: album.external_urls.spotify

        },
        images: {
          spotify: album.images[2]
        },
        releaseDate: album.release_date,
        explicit
      }

      return responseHandler(res, false, 200, 'Success', track)
    }
  } catch (err) {
    next(err)
  }
}
