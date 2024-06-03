import client from "./services/client.js";
import context from "./context.js";
import parseTrackItem from "./parsers/parseTrackItem.js";

export const parseSearchTracksBody = (body, isContinuation = false) => {
  if (isContinuation) {
    var { contents, continuations } =
      body.continuationContents.musicShelfContinuation;
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
    ...(continuations && { continuation }),
  };
};

export async function searchTracks(query) {
  try {
    const response = await (
      await client.post("search", {
        json: {
          ...context.body,
          params: "EgWKAQIIAWoKEAoQCRADEAQQBQ==",
          query,
        },
      })
    ).json();

    return parseSearchTracksBody(response);
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function searchTracksContinuations(continuation) {
  try {
    const response = await (
      await client.post("search", {
        json: {
          ...context.body,
          params: "EgWKAQIIAWoKEAoQCRADEAQQBQ==",
        },
        searchParams: { continuation },
      })
    ).json();

    return parseSearchTracksBody(response, true);
  } catch (e) {
    console.error(e);
    return [];
  }
}
