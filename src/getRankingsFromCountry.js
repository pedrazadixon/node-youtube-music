import client from "./services/client.js";
import context from "./context.js";
import parseRankingData from "./parsers/parseRankingData.js";

export async function getRankingsFromCountry(countryIdIso = "ZZ", options) {
  try {
    const response = await (
      await client.post("browse", {
        json: {
          ...context.body,
          browseId: "FEmusic_charts",
          formData: {
            selectedValues: [countryIdIso],
          },
        },
      })
    ).json();

    const responde = parseRankingData(response);
    responde.isoCode = countryIdIso;
    return responde;
  } catch (e) {
    console.error(e);
    return {};
  }
}
