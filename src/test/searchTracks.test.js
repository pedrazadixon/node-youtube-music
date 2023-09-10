import { expect, test } from 'vitest'
import { searchTracks, searchTracksContinuations } from '../index.js'

let searchResult;
let track1 = {}
let track2 = {}

test('searchTracks: test if find tracks', async () => {
    const query = "hello"
    searchResult = await searchTracks(query);
    expect(searchResult.tracks.length).toBeGreaterThan(0)
    track1 = searchResult.tracks[0]
})

test('searchTracks: test if track has correct required properties', async () => {
    expect(track1).toHaveProperty('trackId')
    expect(track1).toHaveProperty('title')
    expect(track1).toHaveProperty('artists')
    expect(track1).toHaveProperty('album')
    expect(track1).toHaveProperty('thumbnailUrl')
    expect(track1).toHaveProperty('duration')

    expect(track1.trackId).toBeTypeOf('string')
    expect(track1.title).toBeTypeOf('string')
    expect(track1.artists).toBeTypeOf('object')
    expect(track1.album).toBeTypeOf('object')
    expect(track1.thumbnailUrl).toBeTypeOf('string')
    expect(track1.duration).toBeTypeOf('object')
})


test('searchTracksContinuations: test if continuations works correctly', async () => {
    expect(searchResult).toHaveProperty('continuation')
    let continuations = await searchTracksContinuations(searchResult.continuation);
    expect(continuations.tracks.length).toBeGreaterThan(0)
    track2 = continuations.tracks[0]
    expect(track1).not.toEqual(track2)
})