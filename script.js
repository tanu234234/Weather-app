
    function getWeather() {
      let city = document.getElementById("city").value;
      let result = document.getElementById("result");

      if (city === "") {
        result.innerText = "Please enter a city";
        return;
      }

      result.innerText = "Loading...";

      fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`)
        .then(res => res.json())
        .then(locData => {
          if (!locData.results) throw new Error("City not found");

          let lat = locData.results[0].latitude;
          let lon = locData.results[0].longitude;

          return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        })
        .then(res => res.json())
        .then(data => {
          let temp = data.current_weather.temperature;
          let wind = data.current_weather.windspeed;
          let code = data.current_weather.weathercode;

          // Reset background
          document.body.className = "";

          // Better conditions
          if (temp > 30) {
            document.body.classList.add("sunny");
          } else if (code >= 60 && code <= 70) {
            document.body.classList.add("rainy");
          } else {
            document.body.classList.add("cloudy");
          }

          result.innerHTML = `
            <p><b>📍 ${city}</b></p>
            <p>🌡 Temperature: ${temp}°C</p>
            <p>💨 Wind Speed: ${wind} km/h</p>
          `;
        })
        .catch(() => {
          document.body.className = "default";
          result.innerText = "City not found / Error";
        });
    }
