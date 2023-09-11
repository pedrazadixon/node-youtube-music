import { expect } from 'vitest';

export const trackStructure = {
    trackId: expect.any(String),
    title: expect.any(String),
    artists: expect.arrayContaining([
        expect.objectContaining({
            artistId: expect.any(String),
            name: expect.any(String),
        })
    ]),
    album: expect.objectContaining({
        albumId: expect.any(String),
        title: expect.any(String),
    }),
    thumbnailUrl: expect.any(String),
    duration: expect.any(Object)
};
