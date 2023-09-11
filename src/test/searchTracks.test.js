import { expect, test } from 'vitest'
import { searchTracks, searchTracksContinuations } from '../index.js'
import { trackStructure } from './structures/structures.js';

let searchResult;
let track1 = {}
let track2 = {}

test('searchTracks: test if find tracks', async () => {
    const query = "Hello"
    searchResult = await searchTracks(query);
    expect(searchResult.tracks.length).toBeGreaterThan(0)
    track1 = searchResult.tracks[0]
})

test('searchTracks: test if track has correct required properties', async () => {
    expect(track1).toMatchObject(trackStructure)
})


test('searchTracksContinuations: test if continuations works correctly', async () => {
    expect(searchResult).toHaveProperty('continuation')
    let continuations = await searchTracksContinuations(searchResult.continuation);
    expect(continuations.tracks.length).toBeGreaterThan(0)
    track2 = continuations.tracks[0]
    expect(track1).not.toEqual(track2)
})