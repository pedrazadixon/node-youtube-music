export default function parseArtistsSuggestionsItem(item) {
    let artistId;
    try {
        artistId =
            item.musicTwoRowItemRenderer.title.runs[0].navigationEndpoint
                .browseEndpoint.browseId;
    } catch (e) {
        console.error("Couldn't get artistId", e);
    }

    let name;
    try {
        name = item.musicTwoRowItemRenderer.title.runs[0].text;
    } catch (e) {
        console.error("Couldn't get name", e);
    }

    let thumbnailUrl;
    try {
        thumbnailUrl =
            item.musicTwoRowItemRenderer.thumbnailRenderer.musicThumbnailRenderer.thumbnail.thumbnails.pop()
                ?.url;
    } catch (e) {
        console.error("Couldn't get thumbnailUrl", e);
    }
    return {
        artistId,
        name,
        thumbnailUrl,
    };
};
