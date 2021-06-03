const userCity = `https://get.geojs.io/v1/ip/geo.json`;
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = "88ce4f055b5f8a390b0c49938a6d8383";
const temperatureUnit = "metric";

export async function init(element) {
  const form = document.createElement("form");
  element.append(form);
  const input = document.createElement("input");
  const button = document.createElement("button");
  const list = document.createElement("ul");
  document.body.append(element);

  form.append(input);
  form.append(button);
  form.append(list);
  button.innerText = "Get weather";

  async function getUserCoordinates() {
    const addressResponse = await fetch(userCity);
    const addressAnswer = await addressResponse.json();
    const { longitude } = addressAnswer;
    const { latitude } = addressAnswer;
    return `lat=${latitude}&lon=${longitude}`;
  }

  async function getWeather() {
    const userCoordinates = await getUserCoordinates();

    // if (!userCoordinates) {
    //   const urlByCity = `${weatherUrl}?q=${input.value}&appid=${API_KEY}&units=${temperatureUnit}`;
    //   const weatherResponse = await fetch(urlByCity);
    //   const weatherAnswer = await weatherResponse.json();
    // }

    const url = `${weatherUrl}?${userCoordinates}
    &appid=${API_KEY}&units=${temperatureUnit}`;
    const weatherResponse = await fetch(url);
    const weatherAnswer = await weatherResponse.json();
    const city = weatherAnswer.name;
    const { country } = weatherAnswer.sys;
    const { temp } = weatherAnswer.main;
    const img = weatherAnswer.weather[0].icon;

    const temperatureHeader = document.createElement("h2");
    const cityHeader = document.createElement("h2");
    const weatherImg = document.createElement("img");
    const labelCityHeader = document.createElement("h4");
    const labelTemperatureHeader = document.createElement("h4");

    labelTemperatureHeader.innerText = `temperature:`;
    temperatureHeader.innerText = `${Math.ceil(temp)}°C`;
    cityHeader.innerText = `${city} (${country})`;
    labelCityHeader.innerText = `city:`;

    weatherImg.src = `https://openweathermap.org/img/wn/${img}@2x.png`;

    const div = document.querySelector("div");
    div.append(labelCityHeader);
    div.append(cityHeader);
    div.append(weatherImg);
    div.append(labelTemperatureHeader);
    div.append(temperatureHeader);
  }

  await getWeather();

  async function readCityList() {
    const cityList = await JSON.parse(localStorage.getItem("list"));
    return cityList ?? [];
  }

  function saveCityList(items) {
    localStorage.setItem("list", JSON.stringify(items));
  }

  function drawList(el, items) {
    const elem = el;
    elem.innerHTML = `<ul>${items
      .map((elem) => `<li>${elem}</li>`)
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
