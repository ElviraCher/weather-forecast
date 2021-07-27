import { addMapToPage } from "./map-generation";

export async function init() {
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
}

export function showWeather(weatherAnswer) {
  const city = weatherAnswer.name;
  const { country } = weatherAnswer.sys || {};
  const { temp } = weatherAnswer.main || {};
  const img = weatherAnswer.weather[0].icon;

  document.querySelector("h4.temp").textContent = `temperature:`;
  document.querySelector("h2.temp").textContent = `${Math.ceil(temp)}°C`;
  document.querySelector("h2.city").textContent = `${city} (${country})`;
  document.querySelector("h4.city").textContent = `city:`;
  document.querySelector(
    ".weather-container > img"
  ).src = `https://openweathermap.org/img/wn/${img}@2x.png`;
}
