import { getUserCoordinates, getWeather } from "./render-data";
import { showWeather } from "./draw-page";
import { createNewMap } from "./map-generation";

export function readCityList() {
  const cityList = JSON.parse(localStorage.getItem("list"));
  return cityList ?? [];
}

export function saveCityList(items) {
  localStorage.setItem("list", JSON.stringify(items));
}

export function drawList(el, items) {
  const listEl = el;
  listEl.innerHTML = `<ul>${items
    .map((cityElem) => `<li>${cityElem}</li>`)
    .join("")}</ul>`;
}

export function addCityToList(el, items) {
  if (!items.includes(el)) {
    items.unshift(el);
    if (items.length > 10) {
      items.pop();
    }
  }
}

export async function initChangeOfCityAndWeather() {
  const list = document.querySelector("p");
  const container = document.querySelector(".container");
  const input = document.querySelector("input");

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
