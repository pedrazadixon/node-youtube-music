import { expect, test } from 'vitest'
import { searchTracks, searchTracksContinuations } from '../index.js'

let searchResult;
let track1 = {}
let track2 = {}

test('test if searchTracks find tracks', async () => {
    const query = "hello"
    searchResult = await searchTracks(query);
    expect(searchResult.tracks.length).toBeGreaterThan(0)
    track2 = searchResult.tracks[0]
})

test('test searchTracks continuations', async () => {
    expect(searchResult).toHaveProperty('continuation')
    let continuations = await searchTracksContinuations(searchResult.continuation);
    expect(continuations.tracks.length).toBeGreaterThan(0)
    track2 = continuations.tracks[0]
    expect(track1).not.toEqual(track2)
})