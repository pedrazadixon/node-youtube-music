import { expect, test } from 'vitest'
import { getArtistAlbums, getArtistAlbumsContinuations } from '../index.js'
import { artistAlbumStructure } from './structures/structures.js';

let searchResult;
let album1 = {}
let album2 = {}

test('getArtistAlbums: test if find albums', async () => {
    const query = "UCAeLFBCQS7FvI8PvBrWvSBg" // armin van buuren
    searchResult = await getArtistAlbums(query);
    expect(searchResult.albums.length).toBeGreaterThan(0)
    album1 = searchResult.albums[0]
})

test('getArtistAlbums: test if album has correct required properties', async () => {
    expect(album1).toMatchObject(artistAlbumStructure)
})

test('getArtistAlbumsContinuations: test if continuations works correctly', async () => {
    expect(searchResult).toHaveProperty('continuation')
    let continuations = await getArtistAlbumsContinuations(searchResult.continuation, searchResult.vd);
    expect(continuations.albums.length).toBeGreaterThan(0)
    album2 = continuations.albums[0]
    expect(album1).not.toEqual(album2)
})