import css from "./style.css"; // eslint-disable-line

import { getUserCoordinates, getWeather } from "./render-data";
import {
  readCityList,
  saveCityList,
  addCityToList,
  drawList,
} from "./components";
import { init, showWeather } from "./draw-page";
import { createNewMap } from "./map-generation";

(async function () {
  await init();

  const form = document.querySelector("form");
  const list = document.querySelector("p");
  const container = document.querySelector(".container");
  const input = document.querySelector("input");

  async function initChangeOfCityAndWeather() {
    const userCoordinates = await getUserCoordinates();
    const weatherByCoordinates = await getWeather(userCoordinates);
    showWeather(weatherByCoordinates);
    createNewMap(container, weatherByCoordinates);

    input.addEventListener("change", async (ev) => {
      const cityName = ev.target.value;
      const weatherByCityName = await getWeather(undefined, cityName);
      showWeather(weatherByCityName);
      createNewMap(container, weatherByCityName, true);
    });

    list.addEventListener("click", async (ev) => {
      if (ev.target.tagName === "LI") {
        const cityName = ev.target.innerText;
        const weatherByCityName = await getWeather(undefined, cityName);
        showWeather(weatherByCityName);
        createNewMap(container, weatherByCityName, true);
      }
    });
  }

  await initChangeOfCityAndWeather();

  const items = readCityList();
  drawList(list, items);
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();

    const { value } = input;
    input.value = "";

    addCityToList(value, items);
    saveCityList(items);
    drawList(list, items);
  });
})();
