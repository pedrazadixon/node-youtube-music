export default function parseArtistSearchResult(content) {
    let name;
    try {
        name =
            content.musicResponsiveListItemRenderer.flexColumns[0]
                .musicResponsiveListItemFlexColumnRenderer.text.runs[0].text;
    } catch (e) {
        console.error("Couldn't get name", e);
    }

    let artistId;
    try {
        artistId =
            content.musicResponsiveListItemRenderer.navigationEndpoint.browseEndpoint
                .browseId;
    } catch (e) {
        console.error("Couldn't get artistId", e);
    }

    let thumbnailUrl;
    try {
        thumbnailUrl =
            content.musicResponsiveListItemRenderer.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails.pop()
                ?.url;
    } catch (e) {
        console.error("Couldn't get thumbnailUrl", e);
    }

    return {
        name,
        artistId,
        thumbnailUrl
    };
};