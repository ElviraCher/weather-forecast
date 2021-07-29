import { showWeather, init } from "./draw-page";

describe("draw-page", () => {
  describe("showWeather", () => {
    it("is a function", () => {
      expect(showWeather).toBeInstanceOf(Function);
    });
    it("shows data about weather", async () => {
      const weatherAnswer = {
        weather: [
          {
            icon: "10n",
          },
        ],
        main: {
          temp: 19.15,
        },
        sys: {
          country: "RU",
        },
        name: "Saint Petersburg",
      };
      await init();
      showWeather(weatherAnswer);
      expect(document.querySelector("h2.temp").textContent).toStrictEqual(
        "20°C"
      );
      expect(document.querySelector("h2.city").textContent).toEqual(
        "Saint Petersburg (RU)"
      );
    });
  });

  describe("init", () => {
    it("creates basic markup", () => {
      init();
      const list = document.querySelector("p");
      const button = document.querySelector("button");
      const input = document.querySelector("input");
      const container = document.querySelector(".container");
      const formContainer = document.querySelector(".form-container");
      const weatherContainer = document.querySelector(".weather-container");

      expect(list).not.toBe(null);
      expect(button).not.toBe(null);
      expect(input).not.toBe(null);
      expect(container).not.toBe(null);
      expect(formContainer).not.toBe(null);
      expect(weatherContainer).not.toBe(null);
    });
  });
});
