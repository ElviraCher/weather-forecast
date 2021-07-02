import functions from "./script";

describe("script", () => {
  beforeEach(() => {
    let originalFetch;
    beforeEach(() => {
      originalFetch = window.fetch;
    });
    afterEach(() => {
      window.fetch = originalFetch;
    });
  });

  describe("contains function getWeather, that", () => {
    it("returns data by weather response", async () => {
      window.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          city: "Moscow",
        }),
      });
      const data = await functions.getWeather(window.fetch);
      expect(data).toStrictEqual({ city: "Moscow" });
    });
  });

  describe("contains function getUserCoordinates, that", () => {
    it("is a function", () => {
      expect(functions.getUserCoordinates).toBeInstanceOf(Function);
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
      const d = await functions.getUserCoordinates(window.fetch);
      expect(d).toStrictEqual("lat=59.8983&lon=30.2618");
    });
  });

  it("creates input, button and paragraph on the page", () => {
    functions.init();
    const list = document.querySelector("p");
    const button = document.querySelector("button");
    const input = document.querySelector("input");

    expect(list).not.toBe(null);
    expect(button).not.toBe(null);
    expect(input).not.toBe(null);
  });

  it("shows city and temperature by user's coordinates", async () => {
    const userCoordinatesResult = "lat=30.2618&lon=59.8983";
    functions.getUserCoordinates = jest
      .fn()
      .mockReturnValue(userCoordinatesResult);

    const fakeData = {
      weather: [{ icon: "01d" }],
      main: { temp: 12 },
      sys: { country: "GB" },
      name: "London",
    };
    functions.getWeather = jest.fn().mockReturnValue(fakeData);
    functions.createNewMap = jest.fn().mockReturnValue(null);
    functions.readCityList = jest.fn().mockReturnValue([]);
    functions.saveCityList = jest.fn().mockReturnValue(null);

    await functions.init();

    const cityContainer = document.querySelector("h2.city");
    const tempContainer = document.querySelector("h2.temp");

    expect(cityContainer.textContent).toBe("London (GB)");
    expect(tempContainer.textContent).toBe("12°C");
    expect(functions.getWeather).toHaveBeenCalledWith(userCoordinatesResult);
  });
});
