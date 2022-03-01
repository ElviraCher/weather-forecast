import { getWeather, getUserCoordinates } from "./render-data";

describe("render-data", () => {
  beforeEach(() => {
    let originalFetch;
    beforeEach(() => {
      originalFetch = window.fetch;
    });
    afterEach(() => {
      window.fetch = originalFetch;
    });
  });

  describe("getWeather", () => {
    it("returns data by weather response", async () => {
      window.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          city: "Moscow",
        }),
      });
      const data = await getWeather();
      expect(data).toStrictEqual({ city: "Moscow" });
    });
  });

  describe("getUserCoordinates", () => {
    it("is a function", () => {
      expect(getUserCoordinates).toBeInstanceOf(Function);
    });
    it("returns string with longitude and latitude", async () => {
      window.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          region: "St.-Petersburg",
          timezone: "Europe/Moscow",
          longitude: "30.2618",
          country_code3: "RUS",
          area_code: "0",
          ip: "95.161.221.189",
          city: "St Petersburg",
          country: "Russia",
          continent_code: "EU",
          country_code: "RU",
          latitude: "59.8983",
        }),
      });
      const d = await getUserCoordinates();
      expect(d).toStrictEqual("lat=59.8983&lon=30.2618");
    });
  });
});
