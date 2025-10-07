
const apiKey = "5fa4efd574c1a9eaf4de5ad56ba915c7"; // Replace with your OpenWeather API key
const params = new URLSearchParams(window.location.search);
const lat = params.get("lat");
const lon = params.get("lon");
const city = params.get("city");

const currentDiv = document.getElementById("current");
const forecastDiv = document.getElementById("forecast");

async function fetchWeather() {
  try {
    let url;
    if (lat && lon)
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    else
      url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    const res = await fetch(url);
    const data = await res.json();
    if (data.cod !== 200) {
      currentDiv.innerHTML = `<p class='text-danger text-center'>Error: ${data.message} . Please go back to the home page.</p>`;
       footer.classList.add('fixed-footer');
      return;
    }
   footer.classList.remove('fixed-footer');

    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

    // Travel tip logic
    let tip = "";
    const temp = data.main.temp;
    const condition = data.weather[0].main.toLowerCase();

    if (condition.includes("rain")) tip = "Carry an umbrella 🌂";
    else if (temp < 15) tip = "Wear warm clothes 🧥";
    else if (temp > 35) tip = "Stay hydrated 💧";
    else tip = "Perfect weather for a trip 🚗";

    currentDiv.innerHTML = `
      <div class="card shadow-lg p-4 rounded-4">
        <h2>${data.name}, ${data.sys.country}</h2>
        <div class="d-flex align-items-center justify-content gap-2 mt-2">
         <h4 class="mb-0">${data.weather[0].description.toUpperCase()}</h4>
  <img class="weather-icon" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
 
</div>

        
        <p>🌡️ Temperature: <b>${data.main.temp} °C</b> (Feels like ${data.main.feels_like} °C)</p>
        <p>💧 Humidity: ${data.main.humidity}% | 💨 Wind: ${data.wind.speed} m/s</p>
        <p>🌅 Sunrise: ${sunrise} | 🌇 Sunset: ${sunset}</p>
        <p>👁️ Visibility: ${data.visibility / 1000} km | 📈 Pressure: ${data.main.pressure} hPa</p>
        <div class="alert alert-info mt-3">${tip}</div>
      </div>
    `;

    fetchForecast(data.coord.lat, data.coord.lon);
  } catch {
    currentDiv.innerHTML = `<p class='text-danger text-center'>Failed to fetch weather.</p>`;
  }
}

async function fetchForecast(lat, lon) {
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
    const data = await res.json();

    forecastDiv.innerHTML = data.list.slice(0, 6).map(item => `
      <div class="col-md-4">
        <div class="weather-card">
          <p>⏰ ${item.dt_txt}</p>
          <p>🌡️ ${item.main.temp} °C</p>
          <p>☁️ ${item.weather[0].description}</p>
          <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png">
        </div>
      </div>
    `).join("");
  } catch {
    forecastDiv.innerHTML = `<p class='text-danger text-center'>Forecast data unavailable.</p>`;
  }
}




fetchWeather();



