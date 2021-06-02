
const userCity = `https://get.geojs.io/v1/ip/geo.json`;
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = "88ce4f055b5f8a390b0c49938a6d8383";
const temperatureUnit = 'metric';

export async function init(element) {
    const form = document.createElement('form');
    element.append(form);
    const input = document.createElement('input');
    const button = document.createElement('button');
    const list = document.createElement('ul');
    document.body.append(element);

    form.append(input);
    form.append(button);
    form.append(list);
    button.innerText = "Get weather";

    async function getUserCoordinates() {
        const addressResponse = await fetch(userCity);
        const addressAnswer = await addressResponse.json();
        const longitude = addressAnswer.longitude;
        const latitude = addressAnswer.latitude;
        return `lat=${latitude}&lon=${longitude}`;
    }

    async function getWeather() {
        const userCoordinates = await getUserCoordinates();

        const url = `${weatherUrl}?${userCoordinates}&appid=${API_KEY}&units=${temperatureUnit}`;
        const weatherResponse = await fetch(url);
        const weatherAnswer = await weatherResponse.json();
        console.log(weatherAnswer);
        const city = weatherAnswer.name;
        const country = weatherAnswer.sys.country;
        const temp = weatherAnswer.main.temp;
        const img = weatherAnswer.weather[0].icon;

        const temperatureHeader = document.createElement('h2');
        const cityHeader = document.createElement('h2');
        const weatherImg = document.createElement('img');
        const labelCityHeader = document.createElement('h4');
        const labelTemperatureHeader = document.createElement('h4');

        labelTemperatureHeader.innerText = `temperature:`;
        temperatureHeader.innerText = temp;
        cityHeader.innerText = `${city} (${country})`;
        labelCityHeader.innerText = `city:`;

        weatherImg.src = `https://openweathermap.org/img/wn/${img}@2x.png`;

        const div = document.querySelector('div');
        div.append(labelCityHeader);
        div.append(cityHeader);
        div.append(weatherImg);
        div.append(labelTemperatureHeader)
        div.append(temperatureHeader);
    }

    await getWeather();

    async function drawListOfCities() {
        async function readCityList() {
            const cityList = await JSON.parse(localStorage.getItem("list"));
            return cityList ?? [];
        }

        function saveCityList(items) {
            localStorage.setItem("list", JSON.stringify(items));
        }

        function drawList(el, items) {
            el.innerHTML = `<ul>${items.map((el) => `<li>${el}</li>`).join("")}</ul>`;
        }

        function addCityToList(el, items) {
            if (!items.includes(el)) {
                items.unshift(el);
            }
        }

        const items = await readCityList();
        drawList(list, items);
        form.addEventListener("submit", (ev) => {
            ev.preventDefault();

        const formElement = ev.target;
        const userInput = formElement.querySelector("input");
        const value = userInput.value;
        userInput.value = "";
        addCityToList(value, items);
        saveCityList(items);

        drawList(list, items);

        });
    }

    await drawListOfCities()
}



  // const formEl = document.querySelector(".form");
  // const weatherInfoEl = document.querySelector(".weatherInfo");
  //
  // function showWeather(el, weatherInfo) {
  //   weatherInfoEl.innerHTML = JSON.stringify(weatherInfo, null, 2);
  // }
  // async function getWeather(cityName) {
  //   const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}
  //       &appid=${API_KEY}`;
  //   const response = await fetch(url);
  //
  //   const text = await response.text();
  //   return Promise.resolve(text);
  // }
  // formEl.addEventListener("submit", async (ev) => {
  //   ev.preventDefault();
  //
  //   const formElement = ev.target;
  //   const inputEl = formElement.querySelector(".userInput");
  //   const cityName = inputEl.value;
  //   inputEl.value = "";
  //
  //   const weather = await getWeather(cityName);
  //   showWeather(weatherInfoEl, weather);
  // });

