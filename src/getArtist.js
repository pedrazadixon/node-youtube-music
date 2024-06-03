import client from "./services/client.js";
import context from "./context.js";
import parseArtistData from "./parsers/parseArtistData.js";

export async function getArtist(artistId, options) {
  try {
    const response = await client
      .post("browse", {
        json: {
          ...context.body,
          browseId: artistId,
        },
      })
      .json();
    return parseArtistData(response, artistId);
  } catch (e) {
    console.error(e);
    return {};
  }
}
