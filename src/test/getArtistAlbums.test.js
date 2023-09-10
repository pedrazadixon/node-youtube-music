import { expect, test } from 'vitest'
import { getArtistAlbums, getArtistAlbumsContinuations } from '../index.js'

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
    expect(album1).toHaveProperty('albumId')
    expect(album1).toHaveProperty('title')
    expect(album1).toHaveProperty('type')
    expect(album1).toHaveProperty('year')
    expect(album1).toHaveProperty('thumbnailUrl')
    // expect(album1).toHaveProperty('artist') // TODO: missing, should be object
    // expect(album1).toHaveProperty('artistId') // TODO: missing, should be object

    expect(album1.albumId).toBeTypeOf('string')
    expect(album1.title).toBeTypeOf('string')
    expect(album1.type).toBeTypeOf('string')
    expect(album1.year).toBeTypeOf('string')
    expect(album1.thumbnailUrl).toBeTypeOf('string')
    // expect(album1.artist).toBeTypeOf('string') // TODO: missing, should be object
    // expect(album1.artistId).toBeTypeOf('string') // TODO: missing, should be object
})

test('getArtistAlbumsContinuations: test if continuations works correctly', async () => {
    expect(searchResult).toHaveProperty('continuation')
    let continuations = await getArtistAlbumsContinuations(searchResult.continuation, searchResult.vd);
    expect(continuations.albums.length).toBeGreaterThan(0)
    album2 = continuations.albums[0]
    expect(album1).not.toEqual(album2)
})