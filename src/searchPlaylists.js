import client from "./services/client.js";
import context from "./context.js";
import parsePlaylistItem from "./parsers/parsePlaylistItem.js";

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
      continuations =
        body.continuationContents.musicShelfContinuation.continuations;
    } catch (e) {
      console.error("Couldn't get continuations", e);
    }
  } else {
    var contents;
    try {
      contents =
        body.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer.content
          .sectionListRenderer.contents[0].musicShelfRenderer.contents;
    } catch (e) {
      console.error("Couldn't get contents", e);
    }

    var continuations;
    try {
      continuations =
        body.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer.content
          .sectionListRenderer.contents[0].musicShelfRenderer.continuations;
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
    ...(continuations && { continuation }),
  };
};

export async function searchPlaylists(query, options) {
  try {
    const response = await client
      .post("search", {
        json: {
          ...context.body,
          params: "EgWKAQIoAWoKEAoQAxAEEAUQCQ==",
          query,
        },
      })
      .json();

    return parseSearchPlaylistsBody(
      response,
      options?.onlyOfficialPlaylists ?? false
    );
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function searchPlaylistsContinuations(continuation, options) {
  try {
    const response = await client
      .post("search", {
        json: {
          ...context.body,
          params: "EgWKAQIoAWoKEAoQAxAEEAUQCQ==",
        },
        searchParams: { continuation },
      })
      .json();

    return parseSearchPlaylistsBody(
      response.body,
      options?.onlyOfficialPlaylists ?? false,
      true
    );
  } catch (e) {
    console.error(e);
    return [];
  }
}
