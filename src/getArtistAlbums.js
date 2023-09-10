import got from 'got';
import context from './context.js';
import fs from 'fs';
import parseArtistsAlbumItem from './parsers/parseArtistsAlbumItem.js';

const parseListArtistAlbums = (body, isContinuation = false, oldVisitorData) => {

    let visitorData = body?.responseContext?.visitorData

    if (isContinuation) {
        visitorData = oldVisitorData
        var { items, continuations } = body.continuationContents.gridContinuation;
    } else {
        var { items, continuations } =
            body.contents?.singleColumnBrowseResultsRenderer?.tabs[0]?.tabRenderer?.content?.sectionListRenderer?.contents[0]?.gridRenderer;
    }

    if (continuations !== undefined) {
        var continuation = continuations[0].nextContinuationData.continuation;
    }

    const albums = [];

    items?.forEach((album) => {
        albums.push(parseArtistsAlbumItem(album));
    });

    return {
        albums,
        vd: visitorData,
        ...(continuations) && { continuation },
    };
};

export const getArtistAlbums = async (
    artistId
) => {

    if (!artistId.startsWith('MPAD')) {
        artistId = 'MPAD' + artistId;
    }

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
        console.error(`Error in getArtistAlbums: ${error}`);
        return [];
    }
}


export const getArtistAlbumsContinuations = async (
    continuation,
    visitorData
) => {

    var jsonContext = { ...context.body }
    jsonContext.context.client.visitorData = visitorData

    try {
        const response = await got.post(
            `https://music.youtube.com/youtubei/v1/browse?alt=json&key=AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30&continuation=${continuation}`,
            {
                json: jsonContext,
                headers: {
                    'User-Agent':
                        'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
                    origin: 'https://music.youtube.com',
                },
            }
        );
        return parseListArtistAlbums(JSON.parse(response.body), true, visitorData);
    } catch (error) {
        console.error(`Error in getArtistAlbumsContinuations: ${error}`);
        return [];
    }
}