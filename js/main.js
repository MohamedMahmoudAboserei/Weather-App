// ==> inputs <==
let cityInput = document.getElementById('city_input'),
    searchBtn = document.getElementById('search_btn'),
    locationBtn = document.getElementById('location_btn'),
    api_key = '3066861016be81a279e58573a0396ef8',
    currentWeatherCard = document.querySelectorAll('.weather-left .card-weather')[0],
    fiveDaysForecastCard = document.querySelector('.day-forecast'),
    aqiCard = document.querySelectorAll('.highlights .card-weather')[0],
    sunriseCard = document.querySelectorAll('.highlights .card-weather')[1],
    aqiList = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'],
    humidityVal = document.getElementById('humidityVal'),
    pressureVal = document.getElementById('pressureVal'),
    visibilityVal = document.getElementById('visibilityVal'),
    windSpeedVal = document.getElementById('windSpeedVal'),
    feelsVal = document.getElementById('feelsVal'),
    hourlyForeCastCard = document.querySelector('.hourly-forecast');

function getWeatherDetails(name, lat, lon, country, state) {
    const FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
    const AIR_POLLUTION_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`;
    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    fetch(AIR_POLLUTION_API_URL).then(res => res.json()).then(data => {
        let { co, no, no2, o3, so2, pm2_5, pm10, nh3 } = data.list[0].components;
        aqiCard.innerHTML = `
            <div class="card-head">
                <p>Air Quality Index</p>
                <p class="air-index aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi - 1]}</p>
            </div>
            <div class="air-indices">
                <i class="fa-solid fa-wind fa-4x"></i>
                <div class="item"><p>PM 2.5</p><h2>${pm2_5}</h2></div>
                <div class="item"><p>PM 10</p><h2>${pm10}</h2></div>
                <div class="item"><p>SO 2</p><h2>${so2}</h2></div>
                <div class="item"><p>CO</p><h2>${co}</h2></div>
                <div class="item"><p>NO</p><h2>${no}</h2></div>
                <div class="item"><p>NO 2</p><h2>${no2}</h2></div>
                <div class="item"><p>NH 3</p><h2>${nh3}</h2></div>
                <div class="item"><p>O 3</p><h2>${o3}</h2></div>
            </div>
        `;
    }).catch(error => {
        alert(`Failed to fetch Air Quality index. Error: ${error.message}`);
    });
    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        let date = new Date();
        currentWeatherCard.innerHTML = `
            <div class="current-weather">
                <div class="details">
                    <p>Now</p>
                    <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                    <p>${data.weather[0].description}</p>
                </div>
                <div class="weather-icon w-25">
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" class="w-100">
                </div>
            </div>
            <hr>
            <div class="card-footer">
                <p><i class="fa-regular fa-calendar"></i>${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}</p>
                <p><i class="fa-solid fa-location-dot"></i>${name}, ${country}</p>
            </div>
        `;
        let { sunrise, sunset, timezone, visibility, main: { humidity, pressure, feels_like }, wind: { speed } } = data;
        let sRiseTime = moment.utc(sunrise, 'X').add(timezone, 'seconds').format('hh:mm A');
        let sSetTime = moment.utc(sunset, 'X').add(timezone, 'seconds').format('hh:mm A');
        sunriseCard.innerHTML = `
            <div class="card-head"><p>Sunrise & Sunset</p></div>
            <div class="sunrise-sunset">
                <div class="item"><div class="icon"><i class="fa-solid fa-sun fa-4x"></i></div><div><p>Sunrise</p><h2>${sRiseTime}</h2></div></div>
                <div class="item"><div class="icon"><i class="fa-regular fa-sun fa-4x"></i></div><div><p>Sunset</p><h2>${sSetTime}</h2></div></div>
            </div>
        `;
        humidityVal.innerHTML = `${humidity}%`;
        pressureVal.innerHTML = `${pressure}hpa`;
        visibilityVal.innerHTML = `${visibility / 1000}km`;
        windSpeedVal.innerHTML = `${speed}m/s`;
        feelsVal.innerHTML = `${(feels_like - 273.15).toFixed(2)}&deg;C`;
    }).catch(error => {
        alert(`Failed to fetch current weather. Error: ${error.message}`);
    });
    fetch(FORECAST_API_URL).then(res => res.json()).then(data => {
        let hourlyForeCast = data.list;
        hourlyForeCastCard.innerHTML = '';
        for (let i = 0; i <= 7; i++) {
            let hrForecastDate = new Date(hourlyForeCast[i].dt_txt);
            let hr = hrForecastDate.getHours();
            let a = 'PM';
            if (hr < 12) a = 'AM';
            if (hr == 0) hr = 12;
            if (hr > 12) hr -= 12;
            hourlyForeCastCard.innerHTML += `
                <div class="card-weather">
                    <p>${hr} ${a}</p>
                    <img src="https://openweathermap.org/img/wn/${hourlyForeCast[i].weather[0].icon}.png" class="w-100">
                    <p>${(hourlyForeCast[i].main.temp - 273.15).toFixed(2)}&deg;C</p>
                </div>
            `;
        }
        let uniqueForecastDays = [];
        let fiveDaysForecast = data.list.filter(forecast => {
            let forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                uniqueForecastDays.push(forecastDate);
                return true;
            }
            return false;
        });
        fiveDaysForecastCard.innerHTML = '';
        for (let i = 0; i < fiveDaysForecast.length; i++) {
            let date = new Date(fiveDaysForecast[i].dt_txt);
            fiveDaysForecastCard.innerHTML += `
                <div class="forecast-item">
                    <div class="icon-wrapper w-100">
                        <img src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}@2x.png" class="w-100">
                        <span>${(fiveDaysForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</span>
                    </div>
                    <p>${date.getDate()} ${months[date.getMonth()]}</p>
                    <p>${days[date.getDay()]}</p>
                </div>
            `;
        }
    }).catch(error => {
        alert(`Failed to fetch weather forecast. Error: ${error.message}`);
    });
}
function getCityCoordinates() {
    let cityName = cityInput.value.trim();
    if (!cityName) return;
    let GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if (data.length === 0) {
            alert(`No coordinates found for ${cityName}`);
            return;
        }
        let { name, lat, lon, country, state } = data[0];
        getWeatherDetails(name, lat, lon, country, state);
    }).catch((error) => {
        alert(`Failed to fetch coordinates of ${cityName}. Error: ${error.message}`);
    });
}
function getUserCoordinates() {
    navigator.geolocation.getCurrentPosition(position => {
        let { latitude, longitude } = position.coords;
        let REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`;
        fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
            let { name, country, state } = data[0];
            getWeatherDetails(name, latitude, longitude, country, state)
        }).catch(error => {
            alert(`Failed to fetch user location. Error: ${error.message}`);
        });
    })
}

searchBtn.addEventListener('click', getCityCoordinates);
locationBtn.addEventListener('click', getUserCoordinates);
cityInput.addEventListener('keyup', e => e.key === 'Enter' && getCityCoordinates())
cityInput.addEventListener('keyup', (e) => {
    if (cityInput.value.trim() !== '') {
        getCityCoordinates();
    }
});
window.addEventListener('load', getUserCoordinates);