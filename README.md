# Unofficial YouTube Music API for Node.js

Based on the work of [baptisteArno](https://github.com/baptisteArno/node-youtube-music).

## Features

- [x] Search
  - [x] Musics
  - [x] Playlists
  - [x] Albums
  - [x] Artists
- [x] List musics from playlist
- [x] List musics from album
- [x] List albums from artist
- [x] List musics from artist
- [x] Get suggestions from music

## Get started

```shell
npm install https://github.com/pedrazadixon/node-youtube-music
```

or

```shell
yarn add https://github.com/pedrazadixon/node-youtube-music
```

## How to use

```ts
import {
  searchTracks,
  searchTracksContinuations,
  searchAlbums,
  searchPlaylists,
  getSuggestions,
  getAlbum,
  getPlaylistTracks,
  searchArtists,
  getArtist,
  getRankingsFromCountry
} from "node-youtube-music";

const musics = await searchTracks("Never gonna give you up");

const musics = await searchTracksContinuations("continuation_string");

const albums = await searchAlbums("Human after all");

const playlists = await searchPlaylists("Jazz");

const suggestions = await getSuggestions(musics[0].youtubeId);

const albumSongs = await getAlbum(albums[0].albumId);

const playlistSongs = await getPlaylistTracks(playlists[0].playlistId);

const artists = await searchArtists("Daft Punk");

const artist = await getArtist(artists[0].artistId);

const rankings = await getRankingsFromCountry('CO')
```
