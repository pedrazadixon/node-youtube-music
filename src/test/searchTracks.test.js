import { expect, test } from 'vitest'
import { searchTracks, searchTracksContinuations } from '../index.js'

let searchResult;
let track1 = {}
let track2 = {}

test('test if searchTracks find tracks', async () => {
    const query = "hello"
    searchResult = await searchTracks(query);
    expect(searchResult.tracks.length).toBeGreaterThan(0)
    track1 = searchResult.tracks[0]
})

test('test if track has required properties', async () => {
    expect(track1).toHaveProperty('trackId')
    expect(track1).toHaveProperty('title')
    expect(track1).toHaveProperty('artists')
    expect(track1).toHaveProperty('album')
    expect(track1).toHaveProperty('thumbnailUrl')
    expect(track1).toHaveProperty('duration')
})


test('test searchTracks continuations', async () => {
    expect(searchResult).toHaveProperty('continuation')
    let continuations = await searchTracksContinuations(searchResult.continuation);
    expect(continuations.tracks.length).toBeGreaterThan(0)
    track2 = continuations.tracks[0]
    expect(track1).not.toEqual(track2)
})