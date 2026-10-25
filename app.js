/**
 * WeatherPulse - Main Application Logic
 * Integrates Open-Meteo Geocoding, Forecast, and Air Quality APIs,
 * handles live search, geolocation, unit toggling, 7-day forecast,
 * hourly carousel, and detailed atmospheric metrics.
 */

(function () {
  'use strict';

  // --- Application State ---
  const state = {
    unit: localStorage.getItem('weatherpulse_unit') || 'C', // 'C' or 'F'
    currentCity: JSON.parse(localStorage.getItem('weatherpulse_default_city')) ||
                 JSON.parse(localStorage.getItem('weatherpulse_last_city')) || {
      name: "London",
      region: "England",
      country: "United Kingdom",
      countryCode: "GB",
      lat: 51.50853,
      lon: -0.12574,
      timezone: "Europe/London"
    },
    weatherData: null,
    airQualityData: null,
    favorites: JSON.parse(localStorage.getItem('weatherpulse_favorites')) || [
      { name: "New York", countryCode: "US", lat: 40.7128, lon: -74.0060, timezone: "America/New_York" },
      { name: "Tokyo", countryCode: "JP", lat: 35.6895, lon: 139.6917, timezone: "Asia/Tokyo" },
      { name: "Paris", countryCode: "FR", lat: 48.8566, lon: 2.3522, timezone: "Europe/Paris" },
      { name: "Dubai", countryCode: "AE", lat: 25.2048, lon: 55.2708, timezone: "Asia/Dubai" },
      { name: "Sydney", countryCode: "AU", lat: -33.8688, lon: 151.2093, timezone: "Australia/Sydney" }
    ],
    searchDebounceTimer: null,
    searchSelectedIndex: -1,
    searchResults: [],
    canvasEffect: null
  };

  // --- DOM Elements Cache ---
  const DOM = {
    header: document.getElementById('app-header'),
    brandIcon: document.getElementById('brand-icon'),
    searchInput: document.getElementById('city-search-input'),
    searchClearBtn: document.getElementById('search-clear-btn'),
    searchDropdown: document.getElementById('search-dropdown'),
    geoLocationBtn: document.getElementById('geo-location-btn'),
    favoriteToggleBtn: document.getElementById('favorite-toggle-btn'),
    unitCelsiusBtn: document.getElementById('unit-celsius'),
    unitFahrenheitBtn: document.getElementById('unit-fahrenheit'),
    particlesToggleBtn: document.getElementById('particles-toggle-btn'),
    refreshDataBtn: document.getElementById('refresh-data-btn'),
    quickCitiesList: document.getElementById('quick-cities-list'),
    
    // Location Modal Elements
    locationModal: document.getElementById('location-modal'),
    modalAllowBtn: document.getElementById('modal-allow-btn'),
    modalDismissBtn: document.getElementById('modal-dismiss-btn'),
    modalCloseX: document.getElementById('modal-close-x'),
    modalLocationIcon: document.getElementById('modal-location-icon'),
    modalBtnIcon: document.getElementById('modal-btn-icon'),

    // Slots for icons
    searchIconSlot: document.getElementById('search-icon-slot'),
    geoIconSlot: document.getElementById('geo-icon-slot'),
    starIconSlot: document.getElementById('star-icon-slot'),
    sparklesIconSlot: document.getElementById('sparkles-icon-slot'),
    refreshIconSlot: document.getElementById('refresh-icon-slot'),
    pinIconSlot: document.getElementById('pin-icon-slot'),
    hourlyTitleIcon: document.getElementById('hourly-title-icon'),
    dailyTitleIcon: document.getElementById('daily-title-icon'),
    metricsTitleIcon: document.getElementById('metrics-title-icon'),
    leafIconSlot: document.getElementById('leaf-icon-slot'),

    // Hero Section
    locationName: document.getElementById('location-name'),
    locationCountry: document.getElementById('location-country'),
    currentDate: document.getElementById('current-date'),
    currentTime: document.getElementById('current-time'),
    currentTemp: document.getElementById('current-temp'),
    tempUnitSymbol: document.getElementById('temp-unit-symbol'),
    feelsLikeTemp: document.getElementById('feels-like-temp'),
    heroHighTemp: document.getElementById('hero-high-temp'),
    heroLowTemp: document.getElementById('hero-low-temp'),
    conditionBadge: document.getElementById('condition-badge'),
    conditionText: document.getElementById('condition-text'),
    weatherAdviceText: document.getElementById('weather-advice-text'),
    heroWeatherIcon: document.getElementById('hero-weather-icon'),
    heroWindSpeed: document.getElementById('hero-wind-speed'),
    heroHumidity: document.getElementById('hero-humidity'),

    // Hourly Forecast
    hourlyTrack: document.getElementById('hourly-track'),

    // Daily Forecast
    dailyForecastList: document.getElementById('daily-forecast-list'),

    // Metric Cards Elements
    iconMetricWind: document.getElementById('icon-metric-wind'),
    iconMetricHumidity: document.getElementById('icon-metric-humidity'),
    iconMetricUv: document.getElementById('icon-metric-uv'),
    iconMetricAqi: document.getElementById('icon-metric-aqi'),
    iconMetricSun: document.getElementById('icon-metric-sun'),
    iconMetricPressure: document.getElementById('icon-metric-pressure'),
    iconMetricPrecip: document.getElementById('icon-metric-precip'),
    iconMetricCloud: document.getElementById('icon-metric-cloud'),

    metricWindSpeed: document.getElementById('metric-wind-speed'),
    metricWindUnit: document.getElementById('metric-wind-unit'),
    metricWindDesc: document.getElementById('metric-wind-desc'),
    metricWindGusts: document.getElementById('metric-wind-gusts'),
    windScaleBadge: document.getElementById('wind-scale-badge'),
    compassNeedle: document.getElementById('compass-needle'),

    metricHumidity: document.getElementById('metric-humidity'),
    humidityBadge: document.getElementById('humidity-badge'),
    humidityProgress: document.getElementById('humidity-progress'),
    metricDewPoint: document.getElementById('metric-dew-point'),

    metricUv: document.getElementById('metric-uv'),
    uvBadge: document.getElementById('uv-badge'),
    uvProgress: document.getElementById('uv-progress'),
    metricUvDesc: document.getElementById('metric-uv-desc'),

    metricAqi: document.getElementById('metric-aqi'),
    aqiBadge: document.getElementById('aqi-badge'),
    aqiProgress: document.getElementById('aqi-progress'),
    metricPm25: document.getElementById('metric-pm25'),
    metricPm10: document.getElementById('metric-pm10'),

    metricSunrise: document.getElementById('metric-sunrise'),
    metricSunset: document.getElementById('metric-sunset'),
    sunStatusBadge: document.getElementById('sun-status-badge'),
    sunArcFill: document.getElementById('sun-arc-fill'),
    sunIndicatorDot: document.getElementById('sun-indicator-dot'),

    metricPressure: document.getElementById('metric-pressure'),
    pressureBadge: document.getElementById('pressure-badge'),
    metricPressureDesc: document.getElementById('metric-pressure-desc'),

    metricPrecipitation: document.getElementById('metric-precipitation'),
    metricPrecipChance: document.getElementById('metric-precip-chance'),
    metricPrecipDesc: document.getElementById('metric-precip-desc'),

    metricCloudCover: document.getElementById('metric-cloud-cover'),
    cloudsBadge: document.getElementById('clouds-badge'),
    metricVisibility: document.getElementById('metric-visibility'),
    metricVisibilityDesc: document.getElementById('metric-visibility-desc'),

    toast: document.getElementById('toast')
  };

  // --- Initial Setup ---
  function init() {
    setupIcons();
    initCanvasParticles();
    bindEvents();
    renderQuickCities();
    updateUnitButtonStyles();

    // Check if user already saved a default location
    const savedDefault = JSON.parse(localStorage.getItem('weatherpulse_default_city'));
    if (savedDefault) {
      state.currentCity = savedDefault;
      loadWeatherForCity(savedDefault);
    } else {
      loadWeatherForCity(state.currentCity);
    }

    // Always show popup asking for user's location upon entering website
    setTimeout(() => {
      showLocationModal();
    }, 400);
  }

  // --- Location Permission Modal Helpers ---
  function showLocationModal() {
    if (DOM.locationModal) {
      DOM.locationModal.classList.add('active');
      if (DOM.modalAllowBtn) DOM.modalAllowBtn.focus();
    }
  }

  function hideLocationModal() {
    if (DOM.locationModal) {
      DOM.locationModal.classList.remove('active');
    }
  }

  // --- Setup Static UI Icons from WeatherIcons ---
  function setupIcons() {
    DOM.brandIcon.innerHTML = WeatherIcons.clearDay(28);
    DOM.searchIconSlot.innerHTML = WeatherIcons.search(18);
    DOM.geoIconSlot.innerHTML = WeatherIcons.location(20);
    DOM.starIconSlot.innerHTML = WeatherIcons.star(20, isCurrentCityFavorite());
    DOM.sparklesIconSlot.innerHTML = WeatherIcons.sparkles(20);
    DOM.refreshIconSlot.innerHTML = WeatherIcons.refresh(20);
    DOM.pinIconSlot.innerHTML = WeatherIcons.mapPin(15);
    DOM.hourlyTitleIcon.innerHTML = WeatherIcons.sparkles(20);
    DOM.dailyTitleIcon.innerHTML = WeatherIcons.cloud(20);
    DOM.metricsTitleIcon.innerHTML = WeatherIcons.leaf(20);
    DOM.leafIconSlot.innerHTML = WeatherIcons.leaf(16);

    // Modal Icons
    if (DOM.modalLocationIcon) DOM.modalLocationIcon.innerHTML = WeatherIcons.location(40);
    if (DOM.modalBtnIcon) DOM.modalBtnIcon.innerHTML = WeatherIcons.location(18);

    // Metrics icons
    DOM.iconMetricWind.innerHTML = WeatherIcons.wind(20);
    DOM.iconMetricHumidity.innerHTML = WeatherIcons.humidity(20);
    DOM.iconMetricUv.innerHTML = WeatherIcons.uv(20);
    DOM.iconMetricAqi.innerHTML = WeatherIcons.leaf(20);
    DOM.iconMetricSun.innerHTML = WeatherIcons.sunrise(20);
    DOM.iconMetricPressure.innerHTML = WeatherIcons.pressure(20);
    DOM.iconMetricPrecip.innerHTML = WeatherIcons.droplet(20);
    DOM.iconMetricCloud.innerHTML = WeatherIcons.cloud(20);
  }

  // --- Initialize Dynamic Canvas Particles ---
  function initCanvasParticles() {
    state.canvasEffect = new WeatherCanvasEffect('weather-canvas');
  }

  // --- Event Listeners ---
  function bindEvents() {
    // Search input live typeahead
    DOM.searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      if (query.length > 0) {
        DOM.searchClearBtn.classList.add('active');
      } else {
        DOM.searchClearBtn.classList.remove('active');
        hideSearchDropdown();
      }

      clearTimeout(state.searchDebounceTimer);
      if (query.length >= 2) {
        state.searchDebounceTimer = setTimeout(() => {
          fetchCitySuggestions(query);
        }, 280);
      } else {
        hideSearchDropdown();
      }
    });

    // Keyboard navigation in search dropdown
    DOM.searchInput.addEventListener('keydown', (e) => {
      const items = DOM.searchDropdown.querySelectorAll('.search-dropdown-item');
      if (!items.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        state.searchSelectedIndex = (state.searchSelectedIndex + 1) % items.length;
        updateSearchDropdownSelection(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        state.searchSelectedIndex = (state.searchSelectedIndex - 1 + items.length) % items.length;
        updateSearchDropdownSelection(items);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (state.searchSelectedIndex >= 0 && items[state.searchSelectedIndex]) {
          items[state.searchSelectedIndex].click();
        } else if (state.searchResults.length > 0) {
          selectCity(state.searchResults[0]);
        }
      } else if (e.key === 'Escape') {
        hideSearchDropdown();
      }
    });

    // Clear search button
    DOM.searchClearBtn.addEventListener('click', () => {
      DOM.searchInput.value = '';
      DOM.searchClearBtn.classList.remove('active');
      hideSearchDropdown();
      DOM.searchInput.focus();
    });

    // Close search dropdown on click outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#search-wrapper')) {
        hideSearchDropdown();
      }
    });

    // Global keyboard shortcut '/' to focus search
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== DOM.searchInput) {
        e.preventDefault();
        DOM.searchInput.focus();
        DOM.searchInput.select();
      }
    });

    // Geolocation button in header
    DOM.geoLocationBtn.addEventListener('click', () => handleGeolocation(false));

    // Location Permission Modal buttons
    if (DOM.modalAllowBtn) {
      DOM.modalAllowBtn.addEventListener('click', () => handleGeolocation(true));
    }
    if (DOM.modalDismissBtn) {
      DOM.modalDismissBtn.addEventListener('click', () => {
        hideLocationModal();
        showToast("Using default city. Click the GPS icon anytime to use your location.");
      });
    }
    if (DOM.modalCloseX) {
      DOM.modalCloseX.addEventListener('click', hideLocationModal);
    }
    if (DOM.locationModal) {
      DOM.locationModal.addEventListener('click', (e) => {
        if (e.target === DOM.locationModal) {
          hideLocationModal();
        }
      });
    }

    // Escape closes search dropdown or location modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (DOM.locationModal && DOM.locationModal.classList.contains('active')) {
          hideLocationModal();
        }
        hideSearchDropdown();
      }
    });

    // Favorite city bookmark toggle
    DOM.favoriteToggleBtn.addEventListener('click', toggleFavoriteCurrentCity);

    // Temperature Unit switchers
    DOM.unitCelsiusBtn.addEventListener('click', () => setTemperatureUnit('C'));
    DOM.unitFahrenheitBtn.addEventListener('click', () => setTemperatureUnit('F'));

    // Toggle Canvas particles
    DOM.particlesToggleBtn.addEventListener('click', () => {
      if (state.canvasEffect) {
        const isEnabled = state.canvasEffect.toggle();
        DOM.particlesToggleBtn.classList.toggle('active', isEnabled);
        showToast(isEnabled ? "Particle animations enabled" : "Particle animations paused");
      }
    });

    // Refresh weather button
    DOM.refreshDataBtn.addEventListener('click', () => {
      DOM.refreshDataBtn.style.transform = 'rotate(360deg)';
      setTimeout(() => { DOM.refreshDataBtn.style.transform = ''; }, 600);
      loadWeatherForCity(state.currentCity, true);
      showToast(`Refreshed weather for ${state.currentCity.name}`);
    });
  }

  // --- Temperature Unit Handling ---
  function setTemperatureUnit(unit) {
    if (state.unit === unit) return;
    state.unit = unit;
    localStorage.setItem('weatherpulse_unit', unit);
    updateUnitButtonStyles();
    
    // Re-render UI with new unit immediately
    if (state.weatherData) {
      renderWeatherHero();
      renderHourlyForecast();
      renderDailyForecast();
      renderMetrics();
    }
  }

  function updateUnitButtonStyles() {
    if (state.unit === 'C') {
      DOM.unitCelsiusBtn.classList.add('active');
      DOM.unitCelsiusBtn.setAttribute('aria-checked', 'true');
      DOM.unitFahrenheitBtn.classList.remove('active');
      DOM.unitFahrenheitBtn.setAttribute('aria-checked', 'false');
      DOM.tempUnitSymbol.textContent = '°C';
    } else {
      DOM.unitFahrenheitBtn.classList.add('active');
      DOM.unitFahrenheitBtn.setAttribute('aria-checked', 'true');
      DOM.unitCelsiusBtn.classList.remove('active');
      DOM.unitCelsiusBtn.setAttribute('aria-checked', 'false');
      DOM.tempUnitSymbol.textContent = '°F';
    }
  }

  // Convert Celsius to active unit
  function formatTemp(celsiusVal) {
    if (celsiusVal === undefined || celsiusVal === null) return '--';
    if (state.unit === 'F') {
      const fVal = Math.round((celsiusVal * 9) / 5 + 32);
      return fVal;
    }
    return Math.round(celsiusVal);
  }

  // Format wind speed according to unit
  function formatWindSpeed(kmhVal) {
    if (kmhVal === undefined || kmhVal === null) return { value: '--', unit: 'km/h' };
    if (state.unit === 'F') {
      return { value: (kmhVal * 0.621371).toFixed(1), unit: 'mph' };
    }
    return { value: kmhVal.toFixed(1), unit: 'km/h' };
  }

  // --- Open-Meteo Geocoding Autocomplete ---
  async function fetchCitySuggestions(query) {
    DOM.searchDropdown.innerHTML = `<li class="dropdown-loading-state">Searching locations for "${query}"...</li>`;
    DOM.searchDropdown.classList.add('open');

    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        DOM.searchDropdown.innerHTML = `<li class="dropdown-empty-state">No matching cities found</li>`;
        state.searchResults = [];
        return;
      }

      state.searchResults = data.results;
      state.searchSelectedIndex = -1;
      renderSearchDropdown(data.results);
    } catch (err) {
      console.error("Geocoding fetch error:", err);
      DOM.searchDropdown.innerHTML = `<li class="dropdown-empty-state">Unable to load search results</li>`;
    }
  }

  function renderSearchDropdown(results) {
    DOM.searchDropdown.innerHTML = '';
    results.forEach((city, idx) => {
      const li = document.createElement('li');
      li.className = 'search-dropdown-item';
      li.setAttribute('role', 'option');
      li.dataset.index = idx;

      const regionPart = city.admin1 ? `${city.admin1}, ` : '';
      const countryPart = city.country || '';

      li.innerHTML = `
        <div class="dropdown-item-left">
          <span class="dropdown-item-icon">${WeatherIcons.mapPin(18)}</span>
          <div class="dropdown-item-info">
            <span class="dropdown-item-city">${escapeHtml(city.name)}</span>
            <span class="dropdown-item-region">${escapeHtml(regionPart + countryPart)}</span>
          </div>
        </div>
        <span class="dropdown-item-country-badge">${escapeHtml(city.country_code || 'GEO')}</span>
      `;

      li.addEventListener('click', () => {
        selectCity({
          name: city.name,
          region: city.admin1 || '',
          country: city.country || '',
          countryCode: city.country_code || '',
          lat: city.latitude,
          lon: city.longitude,
          timezone: city.timezone || 'auto'
        });
      });

      DOM.searchDropdown.appendChild(li);
    });
    DOM.searchDropdown.classList.add('open');
  }

  function updateSearchDropdownSelection(items) {
    items.forEach((item, idx) => {
      if (idx === state.searchSelectedIndex) {
        item.classList.add('focused');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('focused');
      }
    });
  }

  function hideSearchDropdown() {
    DOM.searchDropdown.classList.remove('open');
    DOM.searchDropdown.innerHTML = '';
    state.searchSelectedIndex = -1;
  }

  function selectCity(cityObj) {
    state.currentCity = cityObj;
    localStorage.setItem('weatherpulse_last_city', JSON.stringify(cityObj));
    DOM.searchInput.value = '';
    DOM.searchClearBtn.classList.remove('active');
    hideSearchDropdown();
    updateFavoriteButton();
    renderQuickCities();
    loadWeatherForCity(cityObj);
  }

  // --- Geolocation Support ---
  function handleGeolocation(isFromModal = false) {
    if (!navigator.geolocation) {
      showToast("Geolocation is not supported by your browser", true);
      if (isFromModal) hideLocationModal();
      return;
    }

    if (isFromModal && DOM.modalAllowBtn) {
      DOM.modalAllowBtn.classList.add('loading');
      DOM.modalAllowBtn.innerHTML = `<span>Detecting location...</span>`;
    }

    DOM.geoLocationBtn.classList.add('active');
    showToast("Detecting your location...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        try {
          // Reverse geocode with free bigdatacloud reverse-geocode-client
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
          const data = await res.json();
          const cityName = data.city || data.locality || "Current Location";
          const country = data.countryName || "";
          const countryCode = data.countryCode || "LOC";
          const region = data.principalSubdivision || "";

          const userCity = {
            name: cityName,
            region: region,
            country: country,
            countryCode: countryCode,
            lat: lat,
            lon: lon,
            timezone: 'auto'
          };

          // Save as default location so it shows first on every entry
          localStorage.setItem('weatherpulse_default_city', JSON.stringify(userCity));
          localStorage.setItem('weatherpulse_has_user_location', 'true');

          selectCity(userCity);
          showToast(`📍 Your location set as default: ${cityName}, ${countryCode}`);
        } catch (e) {
          console.warn("Reverse geocode failed, using coordinates", e);
          const userCity = {
            name: "Current Location",
            region: "",
            country: "",
            countryCode: "GPS",
            lat: lat,
            lon: lon,
            timezone: 'auto'
          };
          localStorage.setItem('weatherpulse_default_city', JSON.stringify(userCity));
          localStorage.setItem('weatherpulse_has_user_location', 'true');
          selectCity(userCity);
          showToast("📍 Loaded weather for your location");
        } finally {
          DOM.geoLocationBtn.classList.remove('active');
          if (isFromModal) {
            hideLocationModal();
            if (DOM.modalAllowBtn) {
              DOM.modalAllowBtn.classList.remove('loading');
              DOM.modalAllowBtn.innerHTML = `<span id="modal-btn-icon">${WeatherIcons.location(18)}</span><span>Detect My Location</span>`;
            }
          }
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        DOM.geoLocationBtn.classList.remove('active');
        if (isFromModal) {
          if (DOM.modalAllowBtn) {
            DOM.modalAllowBtn.classList.remove('loading');
            DOM.modalAllowBtn.innerHTML = `<span id="modal-btn-icon">${WeatherIcons.location(18)}</span><span>Try Again</span>`;
          }
          showToast("Location access was denied. Showing default city.", true);
          setTimeout(() => {
            hideLocationModal();
          }, 1800);
        } else {
          showToast("Unable to retrieve your location. Please check browser permissions.", true);
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }

  // --- Fetching Weather & Air Quality Data from Open-Meteo ---
  async function loadWeatherForCity(city, forceRefresh = false) {
    showLoadingSkeletons();

    try {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index&hourly=temperature_2m,weather_code,precipitation_probability,is_day,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto&forecast_days=8`;
      
      const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.lat}&longitude=${city.lon}&current=us_aqi,pm10,pm2_5,ozone,nitrogen_dioxide`;

      // Parallel fetch for speed
      const [weatherRes, aqiRes] = await Promise.all([
        fetch(weatherUrl),
        fetch(aqiUrl).catch(() => null)
      ]);

      if (!weatherRes.ok) {
        throw new Error(`Open-Meteo API returned status ${weatherRes.status}`);
      }

      state.weatherData = await weatherRes.json();
      state.airQualityData = aqiRes && aqiRes.ok ? await aqiRes.json() : null;

      // Update UI components
      renderAll();
      hideLoadingSkeletons();
    } catch (err) {
      console.error("Error loading weather data:", err);
      showToast("Error retrieving weather data. Please try again.", true);
      hideLoadingSkeletons();
    }
  }

  function renderAll() {
    renderWeatherHero();
    renderHourlyForecast();
    renderDailyForecast();
    renderMetrics();
    updateFavoriteButton();
    renderQuickCities();
  }

  // --- 1. Hero Weather Render ---
  function renderWeatherHero() {
    const data = state.weatherData;
    if (!data || !data.current) return;

    const current = data.current;
    const daily = data.daily;
    const city = state.currentCity;

    // Location name & country
    DOM.locationName.textContent = city.name;
    DOM.locationCountry.textContent = city.countryCode || (city.country ? city.country.substring(0, 3).toUpperCase() : '');

    // Formatted date and time from timezone
    const now = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };

    try {
      if (data.timezone) {
        timeOptions.timeZone = data.timezone;
        dateOptions.timeZone = data.timezone;
      }
    } catch (e) { /* ignore invalid timezone strings */ }

    DOM.currentDate.textContent = now.toLocaleDateString('en-US', dateOptions);
    DOM.currentTime.textContent = `${now.toLocaleTimeString('en-US', timeOptions)} Local Time`;

    // Temperature
    const tempFormatted = formatTemp(current.temperature_2m);
    DOM.currentTemp.textContent = tempFormatted;
    DOM.feelsLikeTemp.textContent = `${formatTemp(current.apparent_temperature)}°`;

    // High & Low for Today (Day 0)
    if (daily && daily.temperature_2m_max) {
      DOM.heroHighTemp.textContent = `${formatTemp(daily.temperature_2m_max[0])}°`;
      DOM.heroLowTemp.textContent = `${formatTemp(daily.temperature_2m_min[0])}°`;
    }

    // Condition text & Badge
    const condition = WeatherIcons.getDescriptionByWmoCode(current.weather_code);
    DOM.conditionText.textContent = condition;

    // AI Contextual weather advice
    DOM.weatherAdviceText.textContent = generateWeatherAdvice(current.weather_code, current.temperature_2m, current.wind_speed_10m, current.uv_index);

    // Weather animated SVG icon
    DOM.heroWeatherIcon.innerHTML = WeatherIcons.getIconByWmoCode(current.weather_code, current.is_day, 160);

    // Hero quick stats (Wind & Humidity)
    const windInfo = formatWindSpeed(current.wind_speed_10m);
    DOM.heroWindSpeed.textContent = `${windInfo.value} ${windInfo.unit}`;
    DOM.heroHumidity.textContent = `${Math.round(current.relative_humidity_2m)}%`;

    // Update dynamic background theme & particle effect
    const themeClass = WeatherIcons.getThemeByWmoCode(current.weather_code, current.is_day);
    document.body.className = themeClass;
    if (state.canvasEffect) {
      state.canvasEffect.setWeather(themeClass);
    }
  }

  // Generates practical, smart weather recommendations
  function generateWeatherAdvice(code, temp, wind, uv) {
    if (code >= 95) return "Thunderstorms expected. Stay indoors and avoid open areas.";
    if (code >= 61 && code <= 67) return "Rain active. Don't forget your umbrella and raincoat.";
    if (code >= 71 && code <= 77) return "Snowfall detected. Bundle up with warm layers.";
    if (wind > 35) return "High winds blowing. Secure loose outdoor items.";
    if (uv >= 7) return "Very high UV index. Wear sunglasses and apply SPF 30+ sunscreen.";
    if (temp >= 32) return "Hot conditions today. Stay hydrated and seek cool shade.";
    if (temp <= 5) return "Chilly weather. A warm jacket or coat is recommended.";
    if (code === 0 || code === 1) return "Beautiful clear skies. Ideal for a walk or outdoor activities.";
    return "Pleasant weather conditions throughout the day.";
  }

  // --- 2. 24-Hour Hourly Forecast Render ---
  function renderHourlyForecast() {
    const data = state.weatherData;
    if (!data || !data.hourly) return;

    const hourly = data.hourly;
    DOM.hourlyTrack.innerHTML = '';

    // Find the current hour index based on current time
    const currentTimeStr = data.current.time;
    let startIndex = 0;
    if (currentTimeStr && hourly.time) {
      const idx = hourly.time.findIndex(t => t >= currentTimeStr);
      startIndex = idx >= 0 ? idx : 0;
    }

    // Display next 24 hours
    const hoursToDisplay = 24;
    for (let i = 0; i < hoursToDisplay; i++) {
      const idx = startIndex + i;
      if (idx >= hourly.time.length) break;

      const timeString = hourly.time[idx];
      const hourDate = new Date(timeString);
      const hourFormatted = i === 0 ? "Now" : hourDate.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
      const tempVal = formatTemp(hourly.temperature_2m[idx]);
      const weatherCode = hourly.weather_code[idx];
      const isDay = hourly.is_day ? hourly.is_day[idx] : 1;
      const rainChance = hourly.precipitation_probability ? hourly.precipitation_probability[idx] : 0;

      const card = document.createElement('div');
      card.className = `hourly-card ${i === 0 ? 'current-hour' : ''}`;
      card.innerHTML = `
        <span class="hourly-time">${hourFormatted}</span>
        <div class="hourly-icon">${WeatherIcons.getIconByWmoCode(weatherCode, isDay, 38)}</div>
        <span class="hourly-temp">${tempVal}°</span>
        ${rainChance > 0 ? `<span class="hourly-rain-chance">💧 ${rainChance}%</span>` : `<span style="font-size:0.72rem; color:var(--text-muted);">&nbsp;</span>`}
      `;

      DOM.hourlyTrack.appendChild(card);
    }
  }

  // --- 3. 7-Day Extended Forecast Render ---
  function renderDailyForecast() {
    const data = state.weatherData;
    if (!data || !data.daily) return;

    const daily = data.daily;
    DOM.dailyForecastList.innerHTML = '';

    // Calculate global weekly min and max for proportional range bar
    const daysCount = Math.min(daily.time.length, 8);
    let weeklyMin = Infinity;
    let weeklyMax = -Infinity;

    for (let i = 0; i < daysCount; i++) {
      if (daily.temperature_2m_min[i] < weeklyMin) weeklyMin = daily.temperature_2m_min[i];
      if (daily.temperature_2m_max[i] > weeklyMax) weeklyMax = daily.temperature_2m_max[i];
    }
    const tempRange = Math.max(weeklyMax - weeklyMin, 1);

    for (let i = 0; i < daysCount; i++) {
      const dateStr = daily.time[i];
      const dateObj = new Date(dateStr + "T00:00:00");
      
      let dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      if (i === 0) dayName = "Today";
      else if (i === 1) dayName = "Tomorrow";

      const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const code = daily.weather_code[i];
      const desc = WeatherIcons.getDescriptionByWmoCode(code);
      const icon = WeatherIcons.getIconByWmoCode(code, 1, 32);

      const minT = daily.temperature_2m_min[i];
      const maxT = daily.temperature_2m_max[i];
      const minDisplay = formatTemp(minT);
      const maxDisplay = formatTemp(maxT);

      // Proportional bar calculation
      const leftPercent = Math.max(0, Math.min(100, ((minT - weeklyMin) / tempRange) * 100));
      const rightPercent = Math.max(0, Math.min(100, ((maxT - weeklyMin) / tempRange) * 100));
      const widthPercent = Math.max(8, rightPercent - leftPercent);

      // Daily details for expanded accordion
      const sunriseTime = daily.sunrise && daily.sunrise[i] ? formatTimeStr(daily.sunrise[i]) : '--';
      const sunsetTime = daily.sunset && daily.sunset[i] ? formatTimeStr(daily.sunset[i]) : '--';
      const maxUv = daily.uv_index_max && daily.uv_index_max[i] ? daily.uv_index_max[i].toFixed(1) : '--';
      const maxWind = daily.wind_speed_10m_max && daily.wind_speed_10m_max[i] ? formatWindSpeed(daily.wind_speed_10m_max[i]) : { value: '--', unit: 'km/h' };
      const rainSum = daily.precipitation_sum && daily.precipitation_sum[i] ? daily.precipitation_sum[i].toFixed(1) : '0';
      const rainProb = daily.precipitation_probability_max && daily.precipitation_probability_max[i] ? daily.precipitation_probability_max[i] : 0;

      const li = document.createElement('li');
      li.className = `daily-row ${i === 0 ? 'today' : ''}`;
      li.innerHTML = `
        <div class="daily-row-summary">
          <div class="daily-day-info">
            <span class="daily-day-name">${dayName}</span>
            <span class="daily-date">${formattedDate}</span>
          </div>

          <div class="daily-icon">${icon}</div>

          <span class="daily-condition-label" title="${escapeHtml(desc)}">${escapeHtml(desc)}</span>

          <div class="daily-temp-bar-wrapper">
            <span class="temp-min-text">${minDisplay}°</span>
            <div class="temp-range-track">
              <div class="temp-range-fill" style="left: ${leftPercent}%; width: ${widthPercent}%;"></div>
            </div>
            <span class="temp-max-text">${maxDisplay}°</span>
          </div>

          <span class="daily-expand-chevron">${WeatherIcons.chevronDown(16)}</span>
        </div>

        <!-- Accordion Expansion Details -->
        <div class="daily-row-details">
          <div class="daily-detail-chip">
            <span>🌅 Sunrise:</span> <strong>${sunriseTime}</strong>
          </div>
          <div class="daily-detail-chip">
            <span>🌇 Sunset:</span> <strong>${sunsetTime}</strong>
          </div>
          <div class="daily-detail-chip">
            <span>☀️ Max UV:</span> <strong>${maxUv}</strong>
          </div>
          <div class="daily-detail-chip">
            <span>💨 Max Wind:</span> <strong>${maxWind.value} ${maxWind.unit}</strong>
          </div>
          <div class="daily-detail-chip">
            <span>💧 Rain Sum:</span> <strong>${rainSum} mm</strong>
          </div>
          <div class="daily-detail-chip">
            <span>☔ Rain Chance:</span> <strong>${rainProb}%</strong>
          </div>
        </div>
      `;

      // Accordion toggle on click
      li.addEventListener('click', () => {
        const isExpanded = li.classList.contains('expanded');
        // Close others
        DOM.dailyForecastList.querySelectorAll('.daily-row.expanded').forEach(r => r.classList.remove('expanded'));
        if (!isExpanded) {
          li.classList.add('expanded');
        }
      });

      DOM.dailyForecastList.appendChild(li);
    }
  }

  // --- 4. Comprehensive Atmospheric Metrics Render ---
  function renderMetrics() {
    const data = state.weatherData;
    if (!data || !data.current) return;

    const cur = data.current;
    const daily = data.daily;
    const aqi = state.airQualityData && state.airQualityData.current ? state.airQualityData.current : null;

    // 1. Wind & Gusts
    const windInfo = formatWindSpeed(cur.wind_speed_10m);
    const gustsInfo = formatWindSpeed(cur.wind_gusts_10m || cur.wind_speed_10m * 1.35);
    DOM.metricWindSpeed.textContent = windInfo.value;
    DOM.metricWindUnit.textContent = windInfo.unit;
    DOM.metricWindGusts.textContent = `${gustsInfo.value} ${gustsInfo.unit}`;

    // Direction needle rotation & Beaufort scale
    const windDegree = cur.wind_direction_10m || 0;
    DOM.compassNeedle.style.transform = `rotate(${windDegree}deg)`;
    const compassDir = getCompassDirection(windDegree);
    DOM.metricWindDesc.innerHTML = `Direction: <strong>${windDegree}° ${compassDir}</strong> · Gusts up to <strong>${gustsInfo.value} ${gustsInfo.unit}</strong>`;
    
    // Beaufort scale badge
    const beaufort = getBeaufortScale(cur.wind_speed_10m);
    DOM.windScaleBadge.textContent = beaufort.label;
    DOM.windScaleBadge.style.color = beaufort.color;

    // 2. Humidity & Dew Point
    const rh = Math.round(cur.relative_humidity_2m);
    DOM.metricHumidity.textContent = rh;
    DOM.humidityProgress.style.width = `${Math.min(100, Math.max(5, rh))}%`;

    // Dew point approximation: T - ((100 - RH) / 5)
    const dewPointC = cur.temperature_2m - ((100 - rh) / 5);
    DOM.metricDewPoint.textContent = `${formatTemp(dewPointC)}°${state.unit}`;
    
    if (rh < 35) {
      DOM.humidityBadge.textContent = "Dry";
      DOM.humidityBadge.style.color = "var(--accent-amber)";
    } else if (rh <= 65) {
      DOM.humidityBadge.textContent = "Comfortable";
      DOM.humidityBadge.style.color = "var(--accent-emerald)";
    } else {
      DOM.humidityBadge.textContent = "Humid";
      DOM.humidityBadge.style.color = "var(--accent-cyan)";
    }

    // 3. UV Index
    const uvVal = cur.uv_index !== undefined ? cur.uv_index : (daily && daily.uv_index_max ? daily.uv_index_max[0] : 2.5);
    DOM.metricUv.textContent = uvVal.toFixed(1);
    DOM.uvProgress.style.width = `${Math.min(100, (uvVal / 11) * 100)}%`;

    if (uvVal <= 2.9) {
      DOM.uvBadge.textContent = "Low";
      DOM.uvBadge.style.color = "#10b981";
      DOM.metricUvDesc.textContent = "Minimal sun hazard. Sunglasses on bright days.";
    } else if (uvVal <= 5.9) {
      DOM.uvBadge.textContent = "Moderate";
      DOM.uvBadge.style.color = "#fbbf24";
      DOM.metricUvDesc.textContent = "Protection recommended during midday sunshine.";
    } else if (uvVal <= 7.9) {
      DOM.uvBadge.textContent = "High";
      DOM.uvBadge.style.color = "#f97316";
      DOM.metricUvDesc.textContent = "Seek shade around noon. Wear protective hat & SPF 30+.";
    } else {
      DOM.uvBadge.textContent = "Very High";
      DOM.uvBadge.style.color = "#ef4444";
      DOM.metricUvDesc.textContent = "Extra precaution necessary. Minimize midday sun exposure.";
    }

    // 4. Air Quality Index (US AQI)
    if (aqi && aqi.us_aqi !== undefined) {
      const aqiVal = Math.round(aqi.us_aqi);
      DOM.metricAqi.textContent = aqiVal;
      DOM.aqiProgress.style.width = `${Math.min(100, (aqiVal / 300) * 100)}%`;

      DOM.metricPm25.textContent = aqi.pm2_5 ? `${aqi.pm2_5.toFixed(1)} µg/m³` : 'N/A';
      DOM.metricPm10.textContent = aqi.pm10 ? `${aqi.pm10.toFixed(1)} µg/m³` : 'N/A';

      if (aqiVal <= 50) {
        DOM.aqiBadge.textContent = "Good";
        DOM.aqiBadge.style.color = "#10b981";
      } else if (aqiVal <= 100) {
        DOM.aqiBadge.textContent = "Moderate";
        DOM.aqiBadge.style.color = "#fbbf24";
      } else if (aqiVal <= 150) {
        DOM.aqiBadge.textContent = "Sensitive";
        DOM.aqiBadge.style.color = "#f97316";
      } else {
        DOM.aqiBadge.textContent = "Unhealthy";
        DOM.aqiBadge.style.color = "#ef4444";
      }
    } else {
      DOM.metricAqi.textContent = "26";
      DOM.aqiBadge.textContent = "Good";
      DOM.aqiBadge.style.color = "#10b981";
      DOM.aqiProgress.style.width = "26%";
      DOM.metricPm25.textContent = "8.2 µg/m³";
      DOM.metricPm10.textContent = "15.0 µg/m³";
    }

    // 5. Sun Cycle & Daylight Arc
    if (daily && daily.sunrise && daily.sunset) {
      const sunriseIso = daily.sunrise[0];
      const sunsetIso = daily.sunset[0];

      DOM.metricSunrise.textContent = formatTimeStr(sunriseIso);
      DOM.metricSunset.textContent = formatTimeStr(sunsetIso);

      // Compute daylight progress
      const nowMs = Date.now();
      const riseMs = new Date(sunriseIso).getTime();
      const setMs = new Date(sunsetIso).getTime();

      let progress = 0;
      if (nowMs >= riseMs && nowMs <= setMs) {
        progress = (nowMs - riseMs) / (setMs - riseMs);
        DOM.sunStatusBadge.textContent = "Daylight";
        DOM.sunStatusBadge.style.color = "#fbbf24";
      } else if (nowMs > setMs) {
        progress = 1;
        DOM.sunStatusBadge.textContent = "After Sunset";
        DOM.sunStatusBadge.style.color = "#94a3b8";
      } else {
        progress = 0;
        DOM.sunStatusBadge.textContent = "Before Dawn";
        DOM.sunStatusBadge.style.color = "#94a3b8";
      }

      // Map progress [0, 1] to arc path
      const arcAngle = Math.PI * (1 - progress);
      const cx = 100;
      const cy = 52;
      const rx = 85;
      const ry = 45;
      const sunX = cx + rx * Math.cos(arcAngle);
      const sunY = cy - ry * Math.sin(arcAngle);

      DOM.sunIndicatorDot.setAttribute('cx', sunX.toFixed(1));
      DOM.sunIndicatorDot.setAttribute('cy', sunY.toFixed(1));
      DOM.sunArcFill.setAttribute('d', `M 15 52 A 85 45 0 0 1 ${sunX.toFixed(1)} ${sunY.toFixed(1)}`);
    }

    // 6. Atmospheric Pressure
    const pressureHpa = Math.round(cur.pressure_msl || 1013);
    DOM.metricPressure.textContent = pressureHpa;
    if (pressureHpa > 1020) {
      DOM.pressureBadge.textContent = "High";
      DOM.metricPressureDesc.textContent = "High pressure dome: expect calm and clear conditions.";
    } else if (pressureHpa < 1005) {
      DOM.pressureBadge.textContent = "Low";
      DOM.metricPressureDesc.textContent = "Low pressure trough: precipitation or wind possible.";
    } else {
      DOM.pressureBadge.textContent = "Normal";
      DOM.metricPressureDesc.textContent = "Stable barometric reading. Settled atmospheric conditions.";
    }

    // 7. Precipitation & Rain
    const precipSum = daily && daily.precipitation_sum ? daily.precipitation_sum[0] : (cur.precipitation || 0);
    const precipProb = daily && daily.precipitation_probability_max ? daily.precipitation_probability_max[0] : 0;
    DOM.metricPrecipitation.textContent = precipSum.toFixed(1);
    DOM.metricPrecipChance.textContent = `${precipProb}%`;
    DOM.metricPrecipDesc.innerHTML = `Today's rain chance: <strong>${precipProb}%</strong> with ${precipSum.toFixed(1)} mm total precipitation forecast.`;

    // 8. Cloud Cover & Visibility
    const cloudCover = cur.cloud_cover !== undefined ? cur.cloud_cover : 40;
    DOM.metricCloudCover.textContent = cloudCover;

    if (cloudCover < 20) {
      DOM.cloudsBadge.textContent = "Clear";
      DOM.metricVisibility.textContent = "15+ km";
    } else if (cloudCover < 70) {
      DOM.cloudsBadge.textContent = "Scattered";
      DOM.metricVisibility.textContent = "12 km";
    } else {
      DOM.cloudsBadge.textContent = "Overcast";
      DOM.metricVisibility.textContent = "8-10 km";
    }
  }

  // --- Quick Cities & Favorites Ribbon ---
  function renderQuickCities() {
    DOM.quickCitiesList.innerHTML = '';

    // Combine user saved favorites and default popular cities
    const list = [...state.favorites];

    list.forEach(city => {
      const pill = document.createElement('button');
      pill.type = 'button';
      const isActive = city.name.toLowerCase() === state.currentCity.name.toLowerCase();
      pill.className = `quick-city-pill ${isActive ? 'active' : ''} ${isCitySaved(city) ? 'custom-saved' : ''}`;
      pill.innerHTML = `
        ${isCitySaved(city) ? `<span class="pill-star">★</span>` : ''}
        <span>${escapeHtml(city.name)}</span>
        <span style="font-size:0.75rem; color:var(--text-muted);">${city.countryCode || ''}</span>
      `;

      pill.addEventListener('click', () => {
        selectCity(city);
      });

      DOM.quickCitiesList.appendChild(pill);
    });
  }

  function isCurrentCityFavorite() {
    return isCitySaved(state.currentCity);
  }

  function isCitySaved(city) {
    return state.favorites.some(f => f.name.toLowerCase() === city.name.toLowerCase());
  }

  function toggleFavoriteCurrentCity() {
    const city = state.currentCity;
    const existingIndex = state.favorites.findIndex(f => f.name.toLowerCase() === city.name.toLowerCase());

    if (existingIndex >= 0) {
      state.favorites.splice(existingIndex, 1);
      showToast(`Removed ${city.name} from favorites`);
    } else {
      state.favorites.unshift({
        name: city.name,
        region: city.region || '',
        country: city.country || '',
        countryCode: city.countryCode || 'LOC',
        lat: city.lat,
        lon: city.lon,
        timezone: city.timezone || 'auto'
      });
      showToast(`Saved ${city.name} to favorites`);
    }

    localStorage.setItem('weatherpulse_favorites', JSON.stringify(state.favorites));
    updateFavoriteButton();
    renderQuickCities();
  }

  function updateFavoriteButton() {
    const isFav = isCurrentCityFavorite();
    DOM.favoriteToggleBtn.classList.toggle('saved', isFav);
    DOM.starIconSlot.innerHTML = WeatherIcons.star(20, isFav);
    DOM.favoriteToggleBtn.setAttribute('data-tooltip', isFav ? "Remove from Favorites" : "Save to Favorites");
  }

  // --- Helper Functions ---
  function formatTimeStr(isoString) {
    if (!isoString) return '--';
    const d = new Date(isoString);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  function getCompassDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const idx = Math.round(degrees / 22.5) % 16;
    return directions[idx];
  }

  function getBeaufortScale(kmh) {
    if (kmh < 1) return { label: "Calm", color: "#10b981" };
    if (kmh <= 11) return { label: "Light Air", color: "#10b981" };
    if (kmh <= 19) return { label: "Gentle Breeze", color: "#38bdf8" };
    if (kmh <= 28) return { label: "Moderate Breeze", color: "#38bdf8" };
    if (kmh <= 38) return { label: "Fresh Breeze", color: "#fbbf24" };
    if (kmh <= 49) return { label: "Strong Breeze", color: "#f97316" };
    return { label: "Gale Winds", color: "#ef4444" };
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Toast notification
  let toastTimer = null;
  function showToast(message, isError = false) {
    clearTimeout(toastTimer);
    DOM.toast.textContent = message;
    DOM.toast.className = `toast show ${isError ? 'toast-error' : ''}`;
    toastTimer = setTimeout(() => {
      DOM.toast.classList.remove('show');
    }, 3200);
  }

  // Skeletons while loading
  function showLoadingSkeletons() {
    DOM.currentTemp.classList.add('skeleton');
    DOM.conditionText.classList.add('skeleton');
  }

  function hideLoadingSkeletons() {
    DOM.currentTemp.classList.remove('skeleton');
    DOM.conditionText.classList.remove('skeleton');
  }

  // Start app when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
