import got from 'got';
import context from './context.js';
import parsePlaylistItem from './parsers/parsePlaylistItem.js';

export const parseSearchPlaylistsBody = (
  body,
  onlyOfficialPlaylists,
  isContinuation = false
) => {
  if (isContinuation) {
    var contents;
    try {
      contents = body.continuationContents.musicShelfContinuation.contents;
    } catch (e) {
      console.error("Couldn't get contents", e);
    }

    var continuations;
    try {
      continuations = body.continuationContents.musicShelfContinuation.continuations;
    } catch (e) {
      console.error("Couldn't get continuations", e);
    }
  } else {
    var contents;
    try {
      contents =
        body.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[0].musicShelfRenderer.contents;
    } catch (e) {
      console.error("Couldn't get contents", e);
    }

    var continuations;
    try {
      continuations =
        body.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[0].musicShelfRenderer.continuations;
    } catch (e) {
      console.error("Couldn't get continuations", e);
    }
  }

  if (!contents) {
    return { playlists: [] };
  }

  if (continuations !== undefined) {
    var continuation = continuations[0].nextContinuationData.continuation;
  }

  const results = [];

  contents.forEach((content) => {
    try {
      const playlist = parsePlaylistItem(content, onlyOfficialPlaylists);
      if (playlist) {
        results.push(playlist);
      }
    } catch (e) {
      console.error(e);
    }
  });

  return {
    playlists: results,
    ...(continuations) && { continuation },
  };
};

export async function searchPlaylists(
  query,
  options
) {
  const response = await got.post(
    'https://music.youtube.com/youtubei/v1/search?alt=json&key=AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30',
    {
      json: {
        ...context.body,
        params: 'EgWKAQIoAWoKEAoQAxAEEAUQCQ%3D%3D',
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
    return parseSearchPlaylistsBody(
      JSON.parse(response.body),
      options?.onlyOfficialPlaylists ?? false
    );
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function searchPlaylistsContinuations(
  continuation,
  options
) {
  const response = await got.post(
    `https://music.youtube.com/youtubei/v1/search?alt=json&key=AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30&continuation=${continuation}`,
    {
      json: {
        ...context.body,
        params: 'EgWKAQIoAWoKEAoQAxAEEAUQCQ%3D%3D',
      },
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        origin: 'https://music.youtube.com',
      },
    }
  );
  try {
    return parseSearchPlaylistsBody(
      JSON.parse(response.body),
      options?.onlyOfficialPlaylists ?? false,
      true
    );
  } catch (e) {
    console.error(e);
    return [];
  }
}
