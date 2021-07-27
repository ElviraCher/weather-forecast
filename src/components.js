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
