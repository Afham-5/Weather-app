document.addEventListener("DOMContentLoaded", () => {
  const cityInput = document.getElementById("city-input");
  const getWeatherBtn = document.getElementById("get-weather-btn");
  const weatherInfo = document.getElementById("weather-info");
  const cityNameDisplay = document.getElementById("city-name");
  const temperatureDisplay = document.getElementById("temperature");
  const descriptionDisplay = document.getElementById("description");
  const errorMessage = document.getElementById("error-message");
  const weatherIcon = document.getElementById("weather-icon");

  const API_KEY = "b8527cf6a412ed99b19f36c2199ea60b"; // In a real app, this should be secured

  // Weather condition mappings
  const weatherTypes = {
    // Clear
    "clear sky": { icon: "fa-sun", class: "clear-sky", animation: "sun" },
    sunny: { icon: "fa-sun", class: "clear-sky", animation: "sun" },

    // Clouds
    "few clouds": { icon: "fa-cloud-sun", class: "clouds", animation: "cloud" },
    "scattered clouds": {
      icon: "fa-cloud",
      class: "clouds",
      animation: "cloud",
    },
    "broken clouds": { icon: "fa-cloud", class: "clouds", animation: "cloud" },
    "overcast clouds": {
      icon: "fa-cloud",
      class: "clouds",
      animation: "cloud",
    },

    // Rain
    "light rain": { icon: "fa-cloud-rain", class: "rain", animation: "rain" },
    "moderate rain": {
      icon: "fa-cloud-showers-heavy",
      class: "rain",
      animation: "rain",
    },
    "heavy intensity rain": {
      icon: "fa-cloud-showers-heavy",
      class: "rain",
      animation: "rain",
    },
    "very heavy rain": {
      icon: "fa-cloud-showers-heavy",
      class: "rain",
      animation: "rain",
    },
    "extreme rain": {
      icon: "fa-cloud-showers-heavy",
      class: "rain",
      animation: "rain",
    },
    "freezing rain": {
      icon: "fa-cloud-meatball",
      class: "rain",
      animation: "rain",
    },
    "light intensity shower rain": {
      icon: "fa-cloud-rain",
      class: "rain",
      animation: "rain",
    },
    "shower rain": { icon: "fa-cloud-rain", class: "rain", animation: "rain" },
    "heavy intensity shower rain": {
      icon: "fa-cloud-showers-heavy",
      class: "rain",
      animation: "rain",
    },
    "ragged shower rain": {
      icon: "fa-cloud-showers-heavy",
      class: "rain",
      animation: "rain",
    },

    // Thunderstorm
    thunderstorm: {
      icon: "fa-bolt",
      class: "thunderstorm",
      animation: "thunder",
    },
    "thunderstorm with light rain": {
      icon: "fa-bolt",
      class: "thunderstorm",
      animation: "thunder",
    },
    "thunderstorm with rain": {
      icon: "fa-bolt",
      class: "thunderstorm",
      animation: "thunder",
    },
    "thunderstorm with heavy rain": {
      icon: "fa-bolt",
      class: "thunderstorm",
      animation: "thunder",
    },
    "light thunderstorm": {
      icon: "fa-bolt",
      class: "thunderstorm",
      animation: "thunder",
    },
    "heavy thunderstorm": {
      icon: "fa-bolt",
      class: "thunderstorm",
      animation: "thunder",
    },
    "ragged thunderstorm": {
      icon: "fa-bolt",
      class: "thunderstorm",
      animation: "thunder",
    },

    // Snow
    "light snow": { icon: "fa-snowflake", class: "snow", animation: "snow" },
    snow: { icon: "fa-snowflake", class: "snow", animation: "snow" },
    "heavy snow": { icon: "fa-snowflake", class: "snow", animation: "snow" },
    sleet: { icon: "fa-snowflake", class: "snow", animation: "snow" },
    "light shower sleet": {
      icon: "fa-snowflake",
      class: "snow",
      animation: "snow",
    },
    "shower sleet": { icon: "fa-snowflake", class: "snow", animation: "snow" },
    "light rain and snow": {
      icon: "fa-snowflake",
      class: "snow",
      animation: "snow",
    },
    "rain and snow": { icon: "fa-snowflake", class: "snow", animation: "snow" },
    "light shower snow": {
      icon: "fa-snowflake",
      class: "snow",
      animation: "snow",
    },
    "shower snow": { icon: "fa-snowflake", class: "snow", animation: "snow" },
    "heavy shower snow": {
      icon: "fa-snowflake",
      class: "snow",
      animation: "snow",
    },

    // Mist/Fog/Haze
    mist: { icon: "fa-smog", class: "mist", animation: "mist" },
    smoke: { icon: "fa-smog", class: "mist", animation: "mist" },
    haze: { icon: "fa-smog", class: "mist", animation: "mist" },
    "sand/dust whirls": { icon: "fa-wind", class: "mist", animation: "wind" },
    fog: { icon: "fa-smog", class: "mist", animation: "mist" },
    dust: { icon: "fa-smog", class: "mist", animation: "mist" },
    "volcanic ash": { icon: "fa-smog", class: "mist", animation: "mist" },
    squalls: { icon: "fa-wind", class: "mist", animation: "wind" },
    tornado: { icon: "fa-wind", class: "mist", animation: "wind" },
  };

  // Temperature ranges (in Kelvin)
  const tempRanges = [
    { max: 273.15, class: "very-cold" }, // Below 0°C
    { max: 283.15, class: "cold" }, // 0-10°C
    { max: 293.15, class: "cool" }, // 10-20°C
    { max: 298.15, class: "mild" }, // 20-25°C
    { max: 303.15, class: "warm" }, // 25-30°C
    { max: 308.15, class: "hot" }, // 30-35°C
    { max: Infinity, class: "very-hot" }, // Above 35°C
  ];

  // Event listeners
  getWeatherBtn.addEventListener("click", fetchWeather);

  // Also trigger weather fetch on Enter key
  cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      fetchWeather();
    }
  });

  // Main function to fetch weather
  function fetchWeather() {
    const city = cityInput.value.trim();
    if (!city) return;

    showLoadingState();

    fetchWeatherData(city)
      .then((data) => {
        displayWeatherData(data);
      })
      .catch((error) => {
        console.error("Error fetching weather:", error);
        showError();
      });
  }

  // Show loading state
  function showLoadingState() {
    weatherInfo.classList.add("hidden");
    errorMessage.classList.add("hidden");
    getWeatherBtn.textContent = "Loading...";
    getWeatherBtn.disabled = true;
  }

  // Reset button state
  function resetButtonState() {
    getWeatherBtn.textContent = "Get Weather";
    getWeatherBtn.disabled = false;
  }

  // Fetch weather data from API
  async function fetchWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("City not found");
    }
    return await response.json();
  }

  // Get weather style based on description
  function getWeatherStyle(description) {
    const lowerDesc = description.toLowerCase();

    // Try to find an exact match
    if (weatherTypes[lowerDesc]) {
      return weatherTypes[lowerDesc];
    }

    // If no exact match, try to find partial match
    for (const [key, value] of Object.entries(weatherTypes)) {
      if (lowerDesc.includes(key)) {
        return value;
      }
    }

    // Default fallback
    return { icon: "fa-cloud", class: "clouds", animation: "cloud" };
  }

  // Get temperature class based on temperature value
  function getTemperatureClass(temp) {
    for (const range of tempRanges) {
      if (temp <= range.max) {
        return range.class;
      }
    }
    return "mild"; // Default fallback
  }

  // Convert Kelvin to Celsius
  function kelvinToCelsius(kelvin) {
    return (kelvin - 273.15).toFixed(1);
  }

  // Create rain animation
  function createRainAnimation() {
    const rainContainer = document.createElement("div");
    rainContainer.className = "rain-animation";

    // Create multiple raindrops
    for (let i = 0; i < 50; i++) {
      const raindrop = document.createElement("div");
      raindrop.className = "raindrop";
      raindrop.style.left = `${Math.random() * 100}%`;
      raindrop.style.animationDuration = `${0.5 + Math.random() * 1}s`;
      raindrop.style.animationDelay = `${Math.random() * 2}s`;
      rainContainer.appendChild(raindrop);
    }

    return rainContainer;
  }

  // Create snow animation
  function createSnowAnimation() {
    const snowContainer = document.createElement("div");
    snowContainer.className = "snow-animation";

    // Create multiple snowflakes
    for (let i = 0; i < 40; i++) {
      const snowflake = document.createElement("div");
      snowflake.className = "snowflake";
      snowflake.textContent = "❄";
      snowflake.style.left = `${Math.random() * 100}%`;
      snowflake.style.animationDuration = `${3 + Math.random() * 5}s`;
      snowflake.style.animationDelay = `${Math.random() * 3}s`;
      snowflake.style.fontSize = `${8 + Math.random() * 8}px`;
      snowContainer.appendChild(snowflake);
    }

    return snowContainer;
  }

  // Create wind animation
  function createWindAnimation() {
    const windContainer = document.createElement("div");
    windContainer.className = "wind-animation";

    // Create multiple wind lines
    for (let i = 0; i < 15; i++) {
      const windLine = document.createElement("div");
      windLine.className = "wind-line";
      windLine.style.top = `${10 + i * 8}px`;
      windLine.style.animationDuration = `${1 + Math.random() * 2}s`;
      windLine.style.animationDelay = `${Math.random() * 3}s`;
      windContainer.appendChild(windLine);
    }

    return windContainer;
  }

  // Create sun animation
  function createSunAnimation() {
    const sunContainer = document.createElement("div");
    sunContainer.className = "sun-animation";

    // Create animated sun rays
    const sunRay = document.createElement("div");
    sunRay.className = "sun-ray";
    sunContainer.appendChild(sunRay);

    return sunContainer;
  }

  // Create cloud animation
  function createCloudAnimation() {
    const cloudContainer = document.createElement("div");
    cloudContainer.className = "cloud-animation";

    // Create multiple clouds
    for (let i = 0; i < 4; i++) {
      const cloud = document.createElement("div");
      cloud.className = "cloud";
      cloud.style.top = `${10 + i * 20}px`;
      cloud.style.animationDuration = `${15 + Math.random() * 10}s`;
      cloud.style.animationDelay = `${Math.random() * 5}s`;
      // Add some size variation
      cloud.style.transform = `scale(${0.7 + Math.random() * 0.6})`;
      cloudContainer.appendChild(cloud);
    }

    return cloudContainer;
  }

  // Create thunder animation
  function createThunderAnimation() {
    const thunderContainer = document.createElement("div");
    thunderContainer.className = "thunder-animation";

    // Create lightning with multiple flashes
    const lightning = document.createElement("div");
    lightning.className = "lightning";
    thunderContainer.appendChild(lightning);

    // Add rain effects for thunderstorms
    const rainEffect = createRainAnimation();
    thunderContainer.appendChild(rainEffect);

    return thunderContainer;
  }

  // Create mist animation
  function createMistAnimation() {
    const mistContainer = document.createElement("div");
    mistContainer.className = "mist-animation";
    return mistContainer;
  }

  // Create appropriate animation based on weather type
  function createAnimation(animationType) {
    switch (animationType) {
      case "rain":
        return createRainAnimation();
      case "snow":
        return createSnowAnimation();
      case "wind":
        return createWindAnimation();
      case "sun":
        return createSunAnimation();
      case "cloud":
        return createCloudAnimation();
      case "thunder":
        return createThunderAnimation();
      case "mist":
        return createMistAnimation();
      default:
        return null;
    }
  }

  // Display weather data and animations
  function displayWeatherData(data) {
    resetButtonState();

    const { name, main, weather } = data;
    const description = weather[0].description;
    const temp = main.temp;

    // Get style information based on weather description
    const weatherStyle = getWeatherStyle(description);
    const tempClass = getTemperatureClass(temp);

    // Set content
    cityNameDisplay.textContent = name;
    temperatureDisplay.textContent = `${kelvinToCelsius(temp)}°C`;
    descriptionDisplay.textContent = description;

    // Update icon
    weatherIcon.className = `fas ${weatherStyle.icon} weather-icon`;

    // Clear previous classes and animations
    weatherInfo.className = "weather-card";

    // Remove previous animations
    const existingAnimations = weatherInfo.querySelectorAll(
      ".rain-animation, .snow-animation, .wind-animation, .sun-animation, .cloud-animation, .thunder-animation, .mist-animation"
    );
    existingAnimations.forEach((element) => element.remove());

    // Add new classes
    weatherInfo.classList.add(weatherStyle.class);
    weatherInfo.classList.add(tempClass);

    // Add animation elements
    const animationElement = createAnimation(weatherStyle.animation);
    if (animationElement) {
      weatherInfo.appendChild(animationElement);
    }

    // Show weather info and hide error message
    weatherInfo.classList.remove("hidden");
    errorMessage.classList.add("hidden");

    // Create a nice reveal effect
    weatherInfo.style.opacity = 0;
    weatherInfo.style.transform = "translateY(20px)";

    // Trigger reflow
    weatherInfo.getBoundingClientRect();

    // Apply transition
    weatherInfo.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    weatherInfo.style.opacity = 1;
    weatherInfo.style.transform = "translateY(0)";

    // Apply dynamic background to body based on weather
    document.body.style.transition = "background 2s ease";

    if (weatherStyle.class === "clear-sky") {
      document.body.style.background =
        "linear-gradient(135deg, #4da0b0, #d39d38)";
    } else if (weatherStyle.class === "clouds") {
      document.body.style.background =
        "linear-gradient(135deg, #606c88, #3f4c6b)";
    } else if (weatherStyle.class === "rain") {
      document.body.style.background =
        "linear-gradient(135deg, #2c3e50, #4ca1af)";
    } else if (weatherStyle.class === "thunderstorm") {
      document.body.style.background =
        "linear-gradient(135deg, #232526, #414345)";
    } else if (weatherStyle.class === "snow") {
      document.body.style.background =
        "linear-gradient(135deg, #e6dada, #274046)";
    } else if (weatherStyle.class === "mist") {
      document.body.style.background =
        "linear-gradient(135deg, #757f9a, #d7dde8)";
    }
  }

  // Show error message
  function showError() {
    resetButtonState();
    weatherInfo.classList.add("hidden");
    errorMessage.classList.remove("hidden");

    // Add a shake animation to the error message
    errorMessage.classList.add("shake-animation");
    setTimeout(() => {
      errorMessage.classList.remove("shake-animation");
    }, 500);
  }
});
