import { expect } from 'vitest';

const artistBaseStructure = {
    artistId: expect.any(String),
    name: expect.any(String),
}

const durationStructure = {
    label: expect.any(String),
    totalSeconds: expect.any(Number),
}

export const artistSearchStructure = {
    ...artistBaseStructure,
    thumbnailUrl: expect.any(String),
}

export const trackStructure = {
    trackId: expect.any(String),
    title: expect.any(String),
    artists: expect.arrayContaining([
        expect.objectContaining(artistBaseStructure)
    ]),
    album: expect.objectContaining({
        albumId: expect.any(String),
        title: expect.any(String),
    }),
    thumbnailUrl: expect.any(String),
    duration: expect.objectContaining(durationStructure),
    isExplicit: expect.any(Boolean),
}

export const artistAlbumStructure = {
    albumId: expect.any(String),
    title: expect.any(String),
    type: expect.any(String),
    thumbnailUrl: expect.any(String),
    year: expect.any(String),
    isExplicit: expect.any(Boolean),
}

export const albumSearchStructure = {
    ...artistAlbumStructure,
    artist: expect.objectContaining(artistBaseStructure),
}



