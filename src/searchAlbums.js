import client from "./services/client.js";
import context from "./context.js";
import parseAlbumItem from "./parsers/parseAlbumItem.js";

export const parseSearchAlbumsBody = (body, isContinuation = false) => {
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
      const album = parseAlbumItem(content);
      if (album) {
        results.push(album);
      }
    } catch (err) {
      console.error(err);
    }
  });

  return {
    albums: results,
    ...(continuations && { continuation }),
  };
};

export async function searchAlbums(query) {
  try {
    const response = await client
      .post("search", {
        json: {
          ...context.body,
          params: "EgWKAQIYAWoKEAkQAxAEEAUQCg==",
          query,
        },
      })
      .json();

    return parseSearchAlbumsBody(response);
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function searchAlbumsContinuations(continuation) {
  try {
    const response = await client
      .post("search", {
        json: {
          ...context.body,
          params: "EgWKAQIYAWoKEAkQAxAEEAUQCg==",
        },
        searchParams: { continuation },
      })
      .json();

    return parseSearchAlbumsBody(response, true);
  } catch (e) {
    console.error(e);
    return [];
  }
}
