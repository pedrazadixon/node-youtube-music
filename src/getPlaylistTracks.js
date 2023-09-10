import got from 'got';
import context from './context.js';
import parseMusicInPlaylistItem from './parsers/parseMusicInPlaylistItem.js';


export const parseGetPlaylistTracksBody = (body, isContinuation = false, oldVisitorData) => {

  let visitorData = body?.responseContext?.visitorData
  
  if (isContinuation) {
    visitorData = oldVisitorData
    var { contents, continuations } = body.continuationContents.musicPlaylistShelfContinuation;
  } else {
    var { contents, continuations } =
    body.contents.singleColumnBrowseResultsRenderer.tabs[0].tabRenderer.content
    .sectionListRenderer.contents[0].musicPlaylistShelfRenderer;
  }

  console.log("🚀 ~  ~ visitorData:", visitorData)
  
  if (continuations !== undefined) {
    var continuation = continuations[0].nextContinuationData.continuation;
  }

  const results = [];

  contents.forEach((content) => {
    try {
      const song = parseMusicInPlaylistItem(content);
      if (song) {
        results.push(song);
      }
    } catch (e) {
      console.error(e);
    }
  });
  return {
    tracks: results,
    vd: visitorData,
    ...(continuations) && { continuation }
  };
};

export async function getPlaylistTracks(
  playlistId
) {
  let browseId;

  if (!playlistId.startsWith('VL')) {
    browseId = 'VL' + playlistId;
  }

  try {
    const response = await got.post(
      'https://music.youtube.com/youtubei/v1/browse?alt=json&key=AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30',
      {
        json: {
          ...context.body,
          browseId,
        },
        headers: {
          'User-Agent':
            'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          origin: 'https://music.youtube.com',
        },
      }
    );
    return parseGetPlaylistTracksBody(JSON.parse(response.body));
  } catch (error) {
    console.error(`Error in getPlaylistTracks: ${error}`);
    return [];
  }
}

export async function getPlaylistTracksContinuations(
  continuation,
  visitorData
) {
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
    return parseGetPlaylistTracksBody(JSON.parse(response.body), true, visitorData);
  } catch (error) {
    console.error(`Error in getPlaylistTracks: ${error}`);
    return [];
  }
}
