import ky from "ky";

const client = ky.create({
  prefixUrl: "https://music.youtube.com/youtubei/v1",
  headers: {
    "User-Agent":
      "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Accept-Language": "en",
    origin: "https://music.youtube.com",
  },
  searchParams: {
    alt: "json",
    key: "AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30",
  },
});

export default client;
