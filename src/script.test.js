import functions from "./script";

describe("init", () => {
  it("is a function", () => {
    expect(functions.init).toBeInstanceOf(Function);
  });

  it("creates input, button and paragraph inside element", () => {
    functions.init();
    const list = document.querySelector("p");
    const button = document.querySelector("button");
    const input = document.querySelector("input");

    expect(list).not.toBe(null);
    expect(button).not.toBe(null);
    expect(input).not.toBe(null);
  });
});

describe("getUserCoordinates", () => {
  it("returns city coordinates", async () => {
    const userCoordinatesResult = "lat=30.2618&lon=59.8983";
    functions.getUserCoordinates = jest
      .fn()
      .mockReturnValue(userCoordinatesResult);

    const fakeData = {
      coord: { lon: 30.2618, lat: 59.8983 },
      weather: [{ icon: "01d" }],
      main: { temp: 22 },
      sys: { country: "RU" },
      name: "Saint Petersburg",
    };
    functions.getWeather = jest.fn().mockReturnValue(fakeData);
    functions.createNewMap = jest.fn().mockReturnValue(null);
    functions.readCityList = jest.fn().mockReturnValue([]);
    functions.saveCityList = jest.fn().mockReturnValue(null);

    await functions.init();

    const cityContainer = document.querySelector("h2.city");
    const tempContainer = document.querySelector("h2.temp");

    expect(cityContainer.textContent).toBe("Saint Petersburg (RU)");
    expect(tempContainer.textContent).toBe("22°C");
    expect(functions.getWeather).toHaveBeenCalledWith(userCoordinatesResult);
  });

  it("shows city name, temperature, icon at the page", () => {});
});
