import { API } from "./constants.js";

const time = document.querySelector("#time-text");
const timeAmPm = document.querySelector("#am-pm");
const myDate = document.querySelector("#date");
const weatherForecast = document.querySelector("#weather-forecast");
const currentTemp = document.querySelector("#current-temp");
const desc = document.querySelector("#today-desc");
const humidity = document.querySelector("#humidity");
const wind = document.querySelector("#wind");
const todayIcon = document.querySelector("#today-icon");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const addZero = (x) => {
  if (x < 10) {
    return (x = "0" + x);
  } else {
    return x;
  }
};

const setTime = () => {
  const now = new Date();
  const month = now.getMonth();
  const date = now.getDate();
  const day = now.getDay();
  const hour = now.getHours();
  const hoursIn12HrForm = hour >= 13 ? hour % 12 : hour;
  const minutes = now.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";

  time.innerHTML = addZero(hoursIn12HrForm) + ":" + addZero(minutes);

  timeAmPm.innerHTML = ampm;

  myDate.innerHTML = days[day] + ", " + months[month] + " " + date;
};

const noDelaySetInterval = (func, interval) => {
  func();
  return setInterval(func, interval);
};

const startSetInterval = () => noDelaySetInterval(setTime, 1000);

const error = (err) => {
  console.warn(err.message);
};

const getWeatherData = async (pos) => {
  let { latitude, longitude } = pos.coords;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&appid=${API}`
    );

    if (response.status === 200) {
      const weatherData = await response.json();
      //console.log(weatherData);
      setWeatherData(weatherData);
    }
  } catch (e) {
    console.log("something went wrong.");
  }
};

const setWeatherData = (data) => {
  currentTemp.innerHTML = data.current.temp + "&#176;";
  desc.innerHTML = data.current.weather[0].description;
  humidity.innerHTML = "Humidity: " + data.current.humidity + "%";
  wind.innerHTML = "Wind: " + data.current.wind_speed + " mph";
  todayIcon.src = `https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`;

  let otherDayForecast = "";

  data.daily.forEach((day, id) => {
    if (id !== 0) {
      otherDayForecast += `<div class="weather-forecast-item">
            <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
            <img src="https://openweathermap.org/img/wn/${
              day.weather[0].icon
            }@2x.png" alt="weather icon" class="w-icon" />

            <div class="temp-container">
              <div class="temp">${day.temp.max}&#176;</div>
              <div class="temp">${day.temp.min}&#176;</div>
            </div>
          </div>`;
    }
  });

  weatherForecast.innerHTML = otherDayForecast;
};

startSetInterval();
navigator.geolocation.getCurrentPosition(getWeatherData, error);
