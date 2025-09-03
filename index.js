let homeTab = document.querySelector("[your-weather]");
let nextTab = document.querySelector("[search-weather]");
const API_KEY = "27499b2edc96926bb7bef2baf2094e59";
let homeWeatherInfo = document.querySelector(".home-weather-container");
let searchScreen = document.querySelector("[data-searchForm]");
let locationReq = document.querySelector("[grant-location-page]");
let loadingScreen = document.querySelector("[loading-screen]");

let oldTab = homeTab;
oldTab.classList.add("current-tab");
getfromSessionStorage();

function switchTabs(newTab) {
  if (oldTab != newTab) {
    oldTab.classList.remove("current-tab");
    oldTab = newTab;
    oldTab.classList.add("current-tab");

    if (!searchScreen.classList.contains("active")) {
      homeWeatherInfo.classList.remove("active");
      locationReq.classList.remove("active");
      searchScreen.classList.add("active");
    } else {
      searchScreen.classList.remove("active");
      homeWeatherInfo.classList.add("active");
      newBoy.classList.remove("active");
      getfromSessionStorage();
    }
  }
}

function getfromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    locationReq.classList.add("active");
  } else {
    let coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  locationReq.classList.remove("active");
  loadingScreen.classList.add("active");

  try {
    let result = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    let toDisplay = await result.json();
    loadingScreen.classList.remove("active");
    homeWeatherInfo.classList.add("active");
    renderWeatherInfo(toDisplay);
  } catch (err) {
    loadingScreen.classList.remove("active");
    locationReq.classList.add("active");
  }
}

function renderWeatherInfo(toDisplay) {
  const cityName = document.querySelector("[data-cityName]");
  const countryFlag = document.querySelector("[data-countryFlag]");
  const weatherCond = document.querySelector("[weather-condition]");
  const weatherCondImg = document.querySelector("[weather-condition-image]");
  const temprature = document.querySelector("[temprature-display]");
  const windSpeedVal = document.querySelector("[windspeed-val]");
  const humidityVal = document.querySelector("[humidity-val]");
  const cloudsVal = document.querySelector("[clouds-val]");

  cityName.innerText = toDisplay?.name;
  countryFlag.src = `https://flagcdn.com/144x108/${toDisplay?.sys?.country.toLowerCase()}.png`;
  weatherCond.innerText = toDisplay?.weather?.[0]?.description;
  weatherCondImg.src = `http://openweathermap.org/img/w/${toDisplay?.weather?.[0]?.icon}.png`;
  temprature.innerHTML = `${toDisplay?.main?.temp} °C`;
  windSpeedVal.innerText = `${toDisplay?.wind?.speed} m/s`;
  humidityVal.innerText = `${toDisplay?.main?.humidity}%`;
  cloudsVal.innerText = `${toDisplay?.clouds?.all}%`;
}

let locationBtn = document.querySelector("[access-location-btn]");
locationBtn.addEventListener("click", getLocation);

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("no location support available");
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

homeTab.addEventListener("click", () => {
  switchTabs(homeTab);
  homeWeatherInfo.classList.remove("active");
});

nextTab.addEventListener("click", () => {
  switchTabs(nextTab);
});

let searchedLoc = document.querySelector("[data-searchInput]");
let searchForm = document.querySelector("[data-searchForm]");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityName = searchedLoc.value;
  if (cityName === "") {
    return;
  } else {
    fetchSearchedLocWeather(cityName);
  }
});

let newBoy = document.querySelector(".error-handling-page");

async function fetchSearchedLocWeather(city) {
  locationReq.classList.remove("active");
  homeWeatherInfo.classList.remove("active");
  loadingScreen.classList.add("active");

  try {
    let response1 = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!response1.ok) throw new Error("Invalid city");
    let toDisplay1 = await response1.json();
    loadingScreen.classList.remove("active");
    homeWeatherInfo.classList.add("active");
    newBoy.classList.remove("active");
    renderWeatherInfo(toDisplay1);
  } catch (err) {
    loadingScreen.classList.remove("active");
    newBoy.classList.add("active");
    
  }
}
