import got from 'got';
import context from './context.js';
import fs from 'fs';
import parseArtistsAlbumItem from './parsers/parseArtistsAlbumItem.js';

export const getArtistAlbums = async (
    artistId
) => {

    try {
        const response = await got.post(
            'https://music.youtube.com/youtubei/v1/browse?alt=json&key=AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30',
            {
                json: {
                    ...context.body,
                    browseId: artistId,
                },
                headers: {
                    'User-Agent':
                        'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
                    origin: 'https://music.youtube.com',
                },
            }
        );
        return parseListArtistAlbums(JSON.parse(response.body));
    } catch (error) {
        console.error(`Error in getPlaylistTracks: ${error}`);
        return [];
    }
}

export const getArtistAlbumsContinuation = async (
    continuation,
    clickTrackingParams
) => {

    if (continuation === undefined) {
        return [];
    }

    try {
        const response = await got.post(
            `https://music.youtube.com/youtubei/v1/browse?alt=json&key=AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30&ctoken=${continuation.replace('%3D', '%253D')}&continuation=${continuation}&itct=${clickTrackingParams}type=next&prettyPrint=false`,
            {
                json: {
                    ...context.body
                },
                headers: {
                    'User-Agent':
                        'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
                    origin: 'https://music.youtube.com',
                },
            }
        );
        fs.writeFileSync('./response.json', response.body);
        return []
        // return parseListArtistAlbumsContinuation(JSON.parse(response.body));
    } catch (error) {
        console.error(`Error in getPlaylistTracks: ${error}`);
        return [];
    }
}

const parseListArtistAlbumsContinuation = (body) => {
    const { continuationContents } = body;
    const { items, continuations } = continuationContents

    const albums = [];

    items?.forEach((album) => {
        albums.push(parseArtistsAlbumItem(album));
    });

    if (continuations !== undefined) {
        var continuation = continuations[0]?.nextContinuationData?.continuation;
    }

    return {
        albums,
        ...(continuations) && { continuation }
    };

};

const parseListArtistAlbums = (body) => {
    const { contents } = body;
    const { items, continuations } = contents?.singleColumnBrowseResultsRenderer?.tabs[0]?.tabRenderer?.content?.sectionListRenderer?.contents[0]?.gridRenderer

    const albums = [];

    items?.forEach((album) => {
        albums.push(parseArtistsAlbumItem(album));
    });

    if (continuations !== undefined) {
        var continuation = continuations[0]?.nextContinuationData?.continuation;
        var clickTrackingParams = continuations[0]?.nextContinuationData?.clickTrackingParams;
    }

    return {
        albums,
        ...(continuations) && { continuation },
        ...(continuations) && { clickTrackingParams }
    };

};