/* global ymaps */

const userCity = `https://get.geojs.io/v1/ip/geo.json`;
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = "88ce4f055b5f8a390b0c49938a6d8383";
const temperatureUnit = "metric";

export async function init(element) {
  const container = document.createElement("div");
  container.classList.add("container");

  document.body.append(container);
  const form = document.createElement("form");
  element.classList.add("form-container");
  element.append(form);
  const input = document.createElement("input");
  const button = document.createElement("button");
  const list = document.createElement("p");
  container.append(element);

  form.append(input);
  form.append(button);
  form.append(list);
  button.innerText = "Get weather";

  const weatherContainer = document.createElement("div");
  weatherContainer.classList.add("weather-container");
  container.append(weatherContainer);

  function addMapToPage() {
    const mapContainer = document.createElement("div");
    mapContainer.id = "map";
    container.append(mapContainer);
  }
  addMapToPage();

  const temperatureHeader = document.createElement("h2");
  const cityHeader = document.createElement("h2");
  const weatherImg = document.createElement("img");
  const labelCityHeader = document.createElement("h4");
  const labelTemperatureHeader = document.createElement("h4");

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

  async function showWeather(weatherAnswer) {
    const city = weatherAnswer.name;
    const { country } = weatherAnswer.sys;
    const { temp } = weatherAnswer.main;
    const img = weatherAnswer.weather[0].icon;

    labelTemperatureHeader.innerHTML = `temperature:`;
    temperatureHeader.innerHTML = `${Math.ceil(temp)}°C`;
    cityHeader.innerHTML = `${city} (${country})`;
    labelCityHeader.innerHTML = `city:`;

    weatherImg.src = `https://openweathermap.org/img/wn/${img}@2x.png`;

    weatherContainer.append(labelCityHeader);
    weatherContainer.append(cityHeader);
    weatherContainer.append(weatherImg);
    weatherContainer.append(labelTemperatureHeader);
    weatherContainer.append(temperatureHeader);
  }

  function removeMap() {
    const map = document.getElementById("map");
    map.remove();
  }

  function createNewMap(weatherAnswer, recreate = false) {
    if (recreate) {
      removeMap();
      addMapToPage();
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

  async function initChangeOfCityAndWeather() {
    const userCoordinates = await getUserCoordinates();
    const weatherByCoordinates = await getWeather(userCoordinates);
    await showWeather(weatherByCoordinates);
    createNewMap(weatherByCoordinates);

    input.addEventListener("change", async (ev) => {
      const cityName = ev.target.value;
      const weatherByCityName = await getWeather(undefined, cityName);
      await showWeather(weatherByCityName);
      createNewMap(weatherByCityName, true);
    });

    list.addEventListener("click", async (ev) => {
      if (ev.target.tagName === "LI") {
        const cityName = ev.target.innerText;
        const weatherByCityName = await getWeather(undefined, cityName);
        await showWeather(weatherByCityName);
        createNewMap(weatherByCityName, true);
      }
    });
  }

  await initChangeOfCityAndWeather();

  async function readCityList() {
    const cityList = await JSON.parse(localStorage.getItem("list"));
    return cityList ?? [];
  }

  function saveCityList(items) {
    localStorage.setItem("list", JSON.stringify(items));
  }

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
  const items = await readCityList();
  drawList(list, items);
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();

    const { value } = input;
    input.value = "";

    addCityToList(value, items);
    saveCityList(items);
    drawList(list, items);
  });
}

const el = document.createElement("div");
init(el);
