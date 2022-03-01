import { USER_CITY, WEATHER_URL, TEMPERATURE_UNIT, API_KEY } from "./constants";

export async function getUserCoordinates() {
  try {
    const addressResponse = await fetch(USER_CITY);
    const addressAnswer = await addressResponse.json();
    const { longitude } = addressAnswer;
    const { latitude } = addressAnswer;
    return `lat=${latitude}&lon=${longitude}`;
  } catch {
    return new Error("Error in determining the city by coordinates");
  }
}

export async function getWeather(coordinates, cityName) {
  try {
    const urlByCity =
      `${WEATHER_URL}?q=${cityName}` +
      `&appid=${API_KEY}&units=${TEMPERATURE_UNIT}`;
    const urlByCoordinates =
      `${WEATHER_URL}?${coordinates}` +
      `&appid=${API_KEY}&units=${TEMPERATURE_UNIT}`;
    const weatherInCityUrl = coordinates ? urlByCoordinates : urlByCity;

    const weatherResponse = await fetch(weatherInCityUrl);
    return weatherResponse.json();
  } catch {
    return new Error("Service error");
  }
}
