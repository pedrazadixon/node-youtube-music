import { expect, test } from 'vitest'
import { searchAlbums, searchAlbumsContinuations } from '../index.js'

let searchResult;
let album1 = {}
let album2 = {}

test('searchAlbums: test if find albums', async () => {
    const query = "hello"
    searchResult = await searchAlbums(query);
    expect(searchResult.albums.length).toBeGreaterThan(0)
    album1 = searchResult.albums[0]
})

test('searchAlbums: test if album has correct required properties', async () => {
    expect(album1).toHaveProperty('albumId')
    expect(album1).toHaveProperty('title')
    expect(album1).toHaveProperty('type')
    expect(album1).toHaveProperty('thumbnailUrl')
    expect(album1).toHaveProperty('artist')
    expect(album1).toHaveProperty('artistId')
    expect(album1).toHaveProperty('year')

    expect(album1.albumId).toBeTypeOf('string')
    expect(album1.title).toBeTypeOf('string')
    expect(album1.type).toBeTypeOf('string')
    expect(album1.thumbnailUrl).toBeTypeOf('string')
    expect(album1.artist).toBeTypeOf('string')
    expect(album1.artistId).toBeTypeOf('string')
    expect(album1.year).toBeTypeOf('string')
})

test('searchAlbumsContinuations: test if continuations works correctly', async () => {
    expect(searchResult).toHaveProperty('continuation')
    let continuations = await searchAlbumsContinuations(searchResult.continuation);
    expect(continuations.albums.length).toBeGreaterThan(0)
    album2 = continuations.albums[0]
    expect(album1).not.toEqual(album2)
})