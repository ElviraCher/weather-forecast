const userCity = `https://get.geojs.io/v1/ip/geo.json`;
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = "88ce4f055b5f8a390b0c49938a6d8383";
const yandexAPI_KEY = "6462035b-b76c-42e0-ba78-c93b08ab8d16";
const mapUrl = `https://api-maps.yandex.ru/2.1?apikey=${yandexAPI_KEY}&lang=ru_RU`;
const temperatureUnit = "metric";

export async function init(element) {
  const form = document.createElement("form");
  element.classList.add("form-container");
  element.append(form);
  const input = document.createElement("input");
  const button = document.createElement("button");
  const list = document.createElement("p");
  document.body.append(element);

  form.append(input);
  form.append(button);
  form.append(list);
  button.innerText = "Get weather";

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

    const formContainer = document.querySelector(".form-container");
    formContainer.append(labelCityHeader);
    formContainer.append(cityHeader);
    formContainer.append(weatherImg);
    formContainer.append(labelTemperatureHeader);
    formContainer.append(temperatureHeader);
  }

  async function initChangeOfCityAndWeather() {
    const userCoordinates = await getUserCoordinates();
    const weatherByCoordinates = await getWeather(userCoordinates);
    await showWeather(weatherByCoordinates);

    input.addEventListener("change", async (ev) => {
      const cityName = ev.target.value;
      const weatherByCityName = await getWeather(undefined, cityName);
      await showWeather(weatherByCityName);
    });

    list.addEventListener("click", async (ev) => {
      if (ev.target.tagName === "LI") {
        const cityName = ev.target.innerText;
        const weatherByCityName = await getWeather(undefined, cityName);
        await showWeather(weatherByCityName);
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
    el.innerHTML = `<ul>${items
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
