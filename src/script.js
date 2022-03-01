import "./style.css";
import {
  readCityList,
  saveCityList,
  addCityToList,
  drawList,
  initChangeOfCityAndWeather,
} from "./components";
import { init } from "./draw-page";

(async function main() {
  await init();

  const form = document.querySelector("form");
  const list = document.querySelector("p");
  const input = document.querySelector("input");

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
