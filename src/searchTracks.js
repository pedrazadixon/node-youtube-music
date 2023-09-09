import got from 'got';
import context from './context.js';
import parseTrackItem from './parsers/parseTrackItem.js';

export const parseSearchTracksBody = (body, isContinuation = false) => {
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
      const track = parseTrackItem(content);
      if (track) {
        results.push(track);
      }
    } catch (e) {
      console.error(e);
    }
  });

  return {
    tracks: results,
    ...(continuations) && { continuation }
  };
};

export async function searchTracks(query) {
  const response = await got.post(
    'https://music.youtube.com/youtubei/v1/search?alt=json&key=AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30',
    {
      json: {
        ...context.body,
        params: 'EgWKAQIIAWoKEAoQCRADEAQQBQ%3D%3D',
        query,
      },
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        origin: 'https://music.youtube.com',
      },
    }
  );
  try {
    return parseSearchTracksBody(JSON.parse(response.body));
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function searchTracksContinuations(continuation) {
  // console.log("🚀 ~ file: searchTracks.js:61 ~ searchTracksContinuations ~ continuation:", continuation)
  const response = await got.post(
    `https://music.youtube.com/youtubei/v1/search?alt=json&key=AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30&continuation=${continuation}`,
    {
      json: {
        ...context.body,
        params: 'EgWKAQIIAWoKEAoQCRADEAQQBQ%3D%3D',
      },
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        origin: 'https://music.youtube.com',
      },
    }
  );
  try {
    return parseSearchTracksBody(JSON.parse(response.body), true);
  } catch (e) {
    console.error(e);
    return [];
  }
}
