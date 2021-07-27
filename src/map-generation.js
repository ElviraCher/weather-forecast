/* global ymaps */

function removeMap() {
  const map = document.getElementById("map");
  map.remove();
}

export function addMapToPage(container) {
  const mapContainer = document.createElement("div");
  mapContainer.id = "map";
  container.append(mapContainer);
}

export function createNewMap(container, weatherAnswer, recreate = false) {
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
