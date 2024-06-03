import client from "./services/client.js";
import context from "./context.js";
import parseSuggestionItem from "./parsers/parseSuggestionItem.js";

export const parseGetSuggestionsBody = (body) => {
  const { contents } =
    body.contents.singleColumnMusicWatchNextResultsRenderer.tabbedRenderer
      .watchNextTabbedResultsRenderer.tabs[0].tabRenderer.content
      .musicQueueRenderer.content.playlistPanelRenderer;

  const results = [];

  contents.forEach((content) => {
    try {
      const video = parseSuggestionItem(content);
      if (video) {
        results.push(video);
      }
    } catch (e) {
      console.error(e);
    }
  });
  return results;
};

export async function getSuggestions(videoId) {
  try {
    const response = await client
      .post("next", {
        json: {
          ...context.body,
          enablePersistentPlaylistPanel: true,
          isAudioOnly: true,
          params: "mgMDCNgE",
          playerParams: "igMDCNgE",
          tunerSettingValue: "AUTOMIX_SETTING_NORMAL",
          playlistId: `RDAMVM${videoId}`,
          videoId,
        },
      })
      .json();

    return parseGetSuggestionsBody(response);
  } catch {
    return [];
  }
}
