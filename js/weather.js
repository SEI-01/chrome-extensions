const API_KEY = "6573eaf3150461c984f594848a8b5d6c";
const w_icon = document.getElementById("weather_icon");
const loc = document.getElementById("location");
const temperature = document.getElementById("temperature");

function getLocationSuccess(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const API_URL = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  fetch(API_URL).then(async (response) => {
    return response.json().then((json) => {
      const icon_number = json.weather[0].icon;
      w_icon.innerHTML = `<img src="icons/weather/${icon_number}.png" class="weather_icon noselect"/>`;
      loc.innerText = json.name;
      temperature.innerText = Math.round(json.main.temp) + "ºC";
    });
  });
}

function getLocationErr() {
  console.log("위치 정보를 불러올 수 없습니다.");
}

function getLocation() {
  navigator.geolocation.getCurrentPosition(getLocationSuccess, getLocationErr);
}

function init() {
  getLocation();
}

export { init as weather_init };
