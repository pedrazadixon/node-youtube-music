import client from "./services/client.js";
import context from "./context.js";
import parseArtistsAlbumItem from "./parsers/parseArtistsAlbumItem.js";

const parseListArtistAlbums = (
  body,
  isContinuation = false,
  oldVisitorData
) => {
  let visitorData = body?.responseContext?.visitorData;

  if (isContinuation) {
    visitorData = oldVisitorData;
    var { items, continuations } = body.continuationContents.gridContinuation;
  } else {
    var { items, continuations } =
      body.contents?.singleColumnBrowseResultsRenderer?.tabs[0]?.tabRenderer
        ?.content?.sectionListRenderer?.contents[0]?.gridRenderer;
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
    ...(continuations && { continuation }),
  };
};

export const getArtistAlbums = async (artistId) => {
  if (!artistId.startsWith("MPAD")) {
    artistId = "MPAD" + artistId;
  }

  try {
    const response = await client
      .post("browse", {
        json: {
          ...context.body,
          browseId: artistId,
        },
      })
      .json();
    return parseListArtistAlbums(response);
  } catch (error) {
    console.error(`Error in getArtistAlbums: ${error}`);
    return [];
  }
};

export const getArtistAlbumsContinuations = async (
  continuation,
  visitorData
) => {
  var jsonContext = { ...context.body };
  jsonContext.context.client.visitorData = visitorData;

  try {
    const response = await client
      .post("browse", {
        json: jsonContext,
        searchParams: { continuation },
      })
      .json();
    return parseListArtistAlbums(response, true, visitorData);
  } catch (error) {
    console.error(`Error in getArtistAlbumsContinuations: ${error}`);
    return [];
  }
};
