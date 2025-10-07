const msg = document.getElementById("msg");
const footer = document.getElementById("footer");
// Search by city
document.getElementById("search").addEventListener("click", () => {
  const city = document.getElementById("city").value.trim();
  if (!city) {
    msg.textContent = "Please enter a city name!";
    return;
  }
  window.location.href = `forecast.html?city=${encodeURIComponent(city)}`;
});

// Use location
document.getElementById("locate").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        window.location.href = `forecast.html?lat=${latitude}&lon=${longitude}`;
      },
      () => msg.textContent = "Location access denied."
    );
  } else {
    msg.textContent = "Geolocation not supported.";
  }
});
