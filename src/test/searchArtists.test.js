import { expect, test } from 'vitest'
import { searchArtists, searchArtistsContinuations } from '../index.js'

let searchResult;
let artist1 = {}
let artist2 = {}

test('searchArtists: test if find artists', async () => {
    const query = "Daft Punk"
    searchResult = await searchArtists(query);
    expect(searchResult.artists.length).toBeGreaterThan(0)
    artist1 = searchResult.artists[0]
})

test('searchArtists: test if artist has correct required properties', async () => {
    expect(artist1).toHaveProperty('name')
    expect(artist1).toHaveProperty('artistId')
    expect(artist1).toHaveProperty('thumbnailUrl')

    expect(artist1.name).toBeTypeOf('string')
    expect(artist1.artistId).toBeTypeOf('string')
    expect(artist1.thumbnailUrl).toBeTypeOf('string')
})

test('searchArtistsContinuations:  test if continuations works correctly', async () => {
    expect(searchResult).toHaveProperty('continuation')
    let continuations = await searchArtistsContinuations(searchResult.continuation);
    expect(continuations.artists.length).toBeGreaterThan(0)
    artist2 = continuations.artists[0]
    expect(artist1).not.toEqual(artist2)
})