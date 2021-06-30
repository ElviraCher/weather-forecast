/* global ymaps */

import regeneratorRuntime from "regenerator-runtime"; // eslint-disable-line
import css from "./style.css"; // eslint-disable-line

const userCity = `https://get.geojs.io/v1/ip/geo.json`;
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = "88ce4f055b5f8a390b0c49938a6d8383";
const temperatureUnit = "metric";

const exportFunctions = {
  // eslint-disable-next-line no-use-before-define
  init,
  // eslint-disable-next-line no-use-before-define
  getUserCoordinates,
  // eslint-disable-next-line no-use-before-define
  getWeather,
  // eslint-disable-next-line no-use-before-define
  createNewMap,
  // eslint-disable-next-line no-use-before-define
  readCityList,
  // eslint-disable-next-line no-use-before-define
  saveCityList,
};
export default exportFunctions;

async function getUserCoordinates() {
  const addressResponse = await fetch(userCity);
  const addressAnswer = await addressResponse.json();
  const { longitude } = addressAnswer;
  const { latitude } = addressAnswer;
  return `lat=${latitude}&lon=${longitude}`;
}

async function getWeather(coordinates, cityName) {
  const urlByCity =
    `${weatherUrl}?q=${cityName}` +
    `&appid=${API_KEY}&units=${temperatureUnit}`;
  const urlByCoordinates =
    `${weatherUrl}?${coordinates}` +
    `&appid=${API_KEY}&units=${temperatureUnit}`;
  const weatherInCityUrl = coordinates ? urlByCoordinates : urlByCity;

  const weatherResponse = await fetch(weatherInCityUrl);
  return weatherResponse.json();
}

function removeMap() {
  const map = document.getElementById("map");
  map.remove();
}

function addMapToPage(container) {
  const mapContainer = document.createElement("div");
  mapContainer.id = "map";
  container.append(mapContainer);
}

function createNewMap(container, weatherAnswer, recreate = false) {
  if (recreate) {
    removeMap();
    addMapToPage(container);
  }
  const { lon, lat } = weatherAnswer.coord;

  const yandexMap = function createMap() {
    return new ymaps.Map("map", {
      center: [lat, lon],
      zoom: 9,
    });
  };
  ymaps.ready(yandexMap);
}

function readCityList() {
  const cityList = JSON.parse(localStorage.getItem("list"));
  return cityList ?? [];
}

function saveCityList(items) {
  localStorage.setItem("list", JSON.stringify(items));
}

async function init() {
  const container = document.createElement("div");
  container.classList.add("container");

  const input = document.createElement("input");
  const list = document.createElement("p");
  const button = document.createElement("button");
  button.innerText = "Get weather";

  const form = document.createElement("form");
  form.append(input);
  form.append(button);
  form.append(list);

  const element = document.createElement("div");
  element.classList.add("form-container");
  element.append(form);

  container.append(element);

  const weatherContainer = document.createElement("div");
  weatherContainer.classList.add("weather-container");
  container.append(weatherContainer);

  const labelCityHeader = document.createElement("h4");
  labelCityHeader.classList.add("city");
  weatherContainer.append(labelCityHeader);

  const cityHeader = document.createElement("h2");
  cityHeader.classList.add("city");
  weatherContainer.append(cityHeader);

  const labelTemperatureHeader = document.createElement("h4");
  labelTemperatureHeader.classList.add("temp");
  weatherContainer.append(labelTemperatureHeader);

  const weatherImg = document.createElement("img");
  weatherContainer.append(weatherImg);

  const temperatureHeader = document.createElement("h2");
  temperatureHeader.classList.add("temp");
  weatherContainer.append(temperatureHeader);

  document.body.append(container);
  addMapToPage(container);

  function showWeather(weatherAnswer) {
    const city = weatherAnswer.name;
    const { country } = weatherAnswer.sys;
    const { temp } = weatherAnswer.main;
    const img = weatherAnswer.weather[0].icon;

    document.querySelector("h4.temp").textContent = `temperature:`;
    document.querySelector("h2.temp").textContent = `${Math.ceil(temp)}°C`;
    document.querySelector("h2.city").textContent = `${city} (${country})`;
    document.querySelector("h4.city").textContent = `city:`;
    document.querySelector(
      ".weather-container > img"
    ).src = `https://openweathermap.org/img/wn/${img}@2x.png`;
  }

  async function initChangeOfCityAndWeather() {
    const userCoordinates = await exportFunctions.getUserCoordinates();
    const weatherByCoordinates = await exportFunctions.getWeather(
      userCoordinates
    );
    showWeather(weatherByCoordinates);
    exportFunctions.createNewMap(container, weatherByCoordinates);

    input.addEventListener("change", async (ev) => {
      const cityName = ev.target.value;
      const weatherByCityName = await exportFunctions.getWeather(
        undefined,
        cityName
      );
      showWeather(weatherByCityName);
      exportFunctions.createNewMap(container, weatherByCityName, true);
    });

    list.addEventListener("click", async (ev) => {
      if (ev.target.tagName === "LI") {
        const cityName = ev.target.innerText;
        const weatherByCityName = await exportFunctions.getWeather(
          undefined,
          cityName
        );
        showWeather(weatherByCityName);
        exportFunctions.createNewMap(container, weatherByCityName, true);
      }
    });
  }

  await initChangeOfCityAndWeather();

  function drawList(el, items) {
    const listEl = el;
    listEl.innerHTML = `<ul>${items
      .map((cityElem) => `<li>${cityElem}</li>`)
      .join("")}</ul>`;
  }

  function addCityToList(el, items) {
    if (!items.includes(el)) {
      items.unshift(el);
      if (items.length > 10) {
        items.pop();
      }
    }
  }
  const items = exportFunctions.readCityList();
  drawList(list, items);
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();

    const { value } = input;
    input.value = "";

    addCityToList(value, items);
    exportFunctions.saveCityList(items);
    drawList(list, items);
  });
}

init();
