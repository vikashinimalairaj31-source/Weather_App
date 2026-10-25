# WeatherPulse - Modern Real-Time Weather Application

A responsive weather web application built using **HTML5, CSS3, and modern JavaScript**. Powered by the **Open-Meteo API** (completely free, no API key required), it provides live global weather data, instant location detection, dynamic interactive animations, a 24-hour hourly forecast, an expandable 7-day outlook, and detailed atmospheric telemetry.

---

## 🌟 Key Features

### 1. 📍 Automatic Location Modal on Entry & Default Location
- **Startup Location Modal**: Automatically prompts a glowing modal popup upon entering the website asking to access the user's location.
- **Set as Default & First**: Clicking **"Detect My Location"** uses high-accuracy browser geolocation and reverse-geocodes your coordinates, making your local city the **first and default view** every time you visit.
- **Privacy First**: Includes a "Maybe Later" option and transparent privacy footnote.

### 2. 🔍 Live City Search & Autocomplete
- **Typeahead Suggestions**: Real-time city search with debounced requests to Open-Meteo Geocoding.
- Shows city name, administrative region/state, country, and country code badge.
- Keyboard accessible navigation (`ArrowUp`, `ArrowDown`, `Enter`, `Escape`) and `/` hotkey to quickly focus search.

### 3. 📅 Next 7 Days Forecast
- Detailed day-by-day outlook displaying day name, date, animated weather icon, and condition summary.
- **Visual Gradient Min/Max Temperature Range Bar** proportionate to the week's overall high and low temperatures.
- **Interactive Accordion**: Click on any day row to expand and view:
  - 🌅 Sunrise & 🌇 Sunset times
  - ☀️ Max UV Index
  - 💨 Max Wind Speed
  - 💧 Rain Accumulation (mm)
  - ☔ Rain Probability (%)

### 4. ⏰ 24-Hour Hourly Forecast
- Smooth horizontal scrolling timeline showing the next 24 hours.
- Hourly temperature, day/night condition icons, and precipitation probability badges.
- Highlights the current hour with a luminous glassmorphism glow.

### 5. 📊 Comprehensive Atmospheric Metrics Grid
- **Wind & Gusts**: Wind speed, gusts, Beaufort wind category, and an **animated compass needle** displaying exact degrees and cardinal direction (e.g., `198° SSW`).
- **Humidity & Dew Point**: Relative humidity percentage, visual progress meter, and calculated dew point with comfort categorization.
- **UV Index**: Live UV level with safety danger rating (Low, Moderate, High, Very High) and sun protection advice.
- **Air Quality Index (AQI)**: US AQI rating with PM2.5 and PM10 breakdown.
- **Daylight & Sun Path Arc**: Interactive SVG solar arc indicating the real-time position of the sun between sunrise and sunset.
- **Atmospheric Pressure**: Barometric reading in hPa with trend analysis.
- **Precipitation**: Today's rain accumulation in mm and percentage chance.
- **Cloud Cover & Visibility**: Cloud coverage percentage and visibility distance.

### 6. 🎨 Dynamic Weather Themes & Particle Effects Engine
- **HTML5 Canvas Animation**: Background engine dynamically switches between:
  - ☀️ Golden sun rays and floating dust motes for clear day
  - 🌙 Twinkling stars and shooting stars for clear night
  - 🌧️ Falling rain streaks with puddle splash ripples for rainy weather
  - ⚡ Periodic lightning sky flashes for thunderstorms
  - ❄️ Drifting, swaying snowflakes for snowy conditions
  - 🌫️ Volumetric drifting mist for fog and overcast skies
- Battery-friendly: Pauses automatically when tab is hidden or can be toggled via the sparkles button.

### 7. 🌡️ Temperature Unit Switcher (°C / °F)
- Instant toggle between Celsius and Fahrenheit without re-fetching network requests.
- Converts all displayed current, hourly, and 7-day temperatures instantly.
- Remembers your preference in `localStorage`.

### 8. ⭐ Favorites & Quick City Bar
- Bookmark any location with the Star button.
- Quick-switch ribbon populated with your favorite and popular global cities.

---

## 📁 File Structure

```text
├── index.html          # Semantic HTML5 markup, meta tags, and accessibility
├── style.css           # Glassmorphism design system, CSS variables, responsive styles
├── icons.js            # Animated SVG weather icons & WMO condition mapper
├── canvas-weather.js   # Dynamic atmospheric particle effects canvas engine
├── app.js              # State management, Open-Meteo API integrations, UI rendering
└── README.md           # Documentation and run instructions
```

---

## 🚀 How to Run

### Option 1: Direct in Browser
Simply double click `index.html` or right click and choose **Open with Google Chrome / Edge / Firefox**.

### Option 2: Local HTTP Server (Recommended)
Using Python:
```bash
python -m http.server 8085
```
Or using Node:
```bash
npx serve .
```
Then visit: `http://localhost:8085` in your browser.
