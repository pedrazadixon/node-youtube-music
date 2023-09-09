import got from 'got';
import context from './context.js';
import parseArtistSearchResult from './parsers/parseArtistSearchResult.js';

export const parseArtistsSearchBody = (body, isContinuation = false) => {
  if (isContinuation) {
    var { contents, continuations } = body.continuationContents.musicShelfContinuation;
  } else {
    var { contents, continuations } =
      body.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents.pop()
        .musicShelfRenderer;
  }

  if (continuations !== undefined) {
    var continuation = continuations[0].nextContinuationData.continuation;
  }

  const results = [];

  contents.forEach((content) => {
    try {
      const artist = parseArtistSearchResult(content);
      if (artist) {
        results.push(artist);
      }
    } catch (err) {
      console.error(err);
    }
  });

  return {
    artists: results,
    ...(continuations) && { continuation }
  };

};

export async function searchArtists(
  query,
  options
) {
  const response = await got.post(
    'https://music.youtube.com/youtubei/v1/search?alt=json&key=AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30',
    {
      json: {
        ...context.body,
        params: 'EgWKAQIgAWoKEAMQBBAJEAoQBQ%3D%3D',
        query,
      },
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Accept-Language': options?.lang ?? 'en',
        origin: 'https://music.youtube.com',
      },
    }
  );
  try {
    return parseArtistsSearchBody(JSON.parse(response.body));
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function searchArtistsContinuations(
  continuation,
  options
) {
  const response = await got.post(
    `https://music.youtube.com/youtubei/v1/search?alt=json&key=AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30&continuation=${continuation}`,
    {
      json: {
        ...context.body,
        params: 'EgWKAQIgAWoKEAMQBBAJEAoQBQ%3D%3D',
      },
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Accept-Language': options?.lang ?? 'en',
        origin: 'https://music.youtube.com',
      },
    }
  );
  try {
    return parseArtistsSearchBody(JSON.parse(response.body), true);
  } catch (e) {
    console.error(e);
    return [];
  }
}
