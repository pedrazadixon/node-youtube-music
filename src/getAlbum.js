import client from "./services/client.js";
import context from "./context.js";
import parseAlbumHeader from "./parsers/parseAlbumHeader.js";
import parseMusicInAlbumItem from "./parsers/parseMusicInAlbumItem.js";

export const parseGetAlbumBody = (body, albumId) => {
  const { contents } =
    body.contents.singleColumnBrowseResultsRenderer.tabs[0].tabRenderer.content
      .sectionListRenderer.contents[0].musicShelfRenderer;
  const songs = [];
  const { thumbnailUrl, artist, album } = parseAlbumHeader(body.header);

  contents.forEach((element) => {
    try {
      const song = parseMusicInAlbumItem(element);
      if (song) {
        song.album = {
          albumId,
          title: album,
        };
        if (song.artists?.length === 0) song.artists = [{ name: artist }];
        song.thumbnailUrl = thumbnailUrl;
        songs.push(song);
      }
    } catch (err) {
      console.error(err);
    }
  });
  return {
    albumId,
    title: album,
    artist,
    thumbnailUrl,
    tracks: songs,
  };
};

export async function getAlbum(albumId) {
  try {
    const response = await (
      await client.post("browse", {
        json: {
          ...context.body,
          browseId: albumId,
        },
      })
    ).json();
    return parseGetAlbumBody(response, albumId);
  } catch (e) {
    console.error(e);
    return [];
  }
}
