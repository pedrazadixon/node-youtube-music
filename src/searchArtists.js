import client from "./services/client.js";
import context from "./context.js";
import parseArtistSearchResult from "./parsers/parseArtistSearchResult.js";

export const parseArtistsSearchBody = (body, isContinuation = false) => {
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
    ...(continuations && { continuation }),
  };
};

export async function searchArtists(query, options) {
  try {
    const response = await client
      .post("search", {
        json: {
          ...context.body,
          params: "EgWKAQIgAWoKEAMQBBAJEAoQBQ==",
          query,
        },
      })
      .json();

    return parseArtistsSearchBody(response);
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function searchArtistsContinuations(continuation, options) {
  try {
    const response = await client
      .post("search", {
        json: {
          ...context.body,
          params: "EgWKAQIgAWoKEAMQBBAJEAoQBQ==",
        },
        searchParams: { continuation },
      })
      .json();

    return parseArtistsSearchBody(response, true);
  } catch (e) {
    console.error(e);
    return [];
  }
}
