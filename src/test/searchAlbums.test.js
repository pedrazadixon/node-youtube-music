import { expect, test } from 'vitest'
import { searchAlbums, searchAlbumsContinuations } from '../index.js'
import { albumSearchStructure } from './structures/structures.js';

let searchResult;
let album1 = {}
let album2 = {}

test('searchAlbums: test if find albums', async () => {
    const query = "Daft Punk"
    searchResult = await searchAlbums(query);
    expect(searchResult.albums.length).toBeGreaterThan(0)
    album1 = searchResult.albums[0]
})

test('searchAlbums: test if album has correct required properties', async () => {
    expect(album1).toMatchObject(albumSearchStructure)
})

test('searchAlbumsContinuations: test if continuations works correctly', async () => {
    expect(searchResult).toHaveProperty('continuation')
    let continuations = await searchAlbumsContinuations(searchResult.continuation);
    expect(continuations.albums.length).toBeGreaterThan(0)
    album2 = continuations.albums[0]
    expect(album1).not.toEqual(album2)
})