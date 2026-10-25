/**
 * WeatherPulse - Weather Icons Library
 * Provides crisp, animated and static SVGs for all weather states and UI elements.
 */

const WeatherIcons = {
  // Clear Day (Sunny)
  clearDay(size = 48) {
    return `
      <svg class="weather-icon-svg icon-clear-day" width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FFDD55" />
            <stop offset="100%" stop-color="#FFAA00" />
          </radialGradient>
          <filter id="sunGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <!-- Sun Rays -->
        <g class="animated-spin-slow" style="transform-origin: 32px 32px;">
          <line x1="32" y1="8" x2="32" y2="14" stroke="#FFB703" stroke-width="3.5" stroke-linecap="round" />
          <line x1="32" y1="50" x2="32" y2="56" stroke="#FFB703" stroke-width="3.5" stroke-linecap="round" />
          <line x1="8" y1="32" x2="14" y2="32" stroke="#FFB703" stroke-width="3.5" stroke-linecap="round" />
          <line x1="50" y1="32" x2="56" y2="32" stroke="#FFB703" stroke-width="3.5" stroke-linecap="round" />
          <line x1="15.03" y1="15.03" x2="19.27" y2="19.27" stroke="#FFB703" stroke-width="3.5" stroke-linecap="round" />
          <line x1="44.73" y1="44.73" x2="48.97" y2="48.97" stroke="#FFB703" stroke-width="3.5" stroke-linecap="round" />
          <line x1="15.03" y1="48.97" x2="19.27" y2="44.73" stroke="#FFB703" stroke-width="3.5" stroke-linecap="round" />
          <line x1="44.73" y1="19.27" x2="48.97" y2="15.03" stroke="#FFB703" stroke-width="3.5" stroke-linecap="round" />
        </g>
        <!-- Central Sun Core -->
        <circle cx="32" cy="32" r="14" fill="url(#sunGrad)" filter="url(#sunGlow)" />
        <circle cx="32" cy="32" r="11" fill="#FFC300" opacity="0.6" />
      </svg>
    `;
  },

  // Clear Night
  clearNight(size = 48) {
    return `
      <svg class="weather-icon-svg icon-clear-night" width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#E2E8F0" />
            <stop offset="100%" stop-color="#94A3B8" />
          </linearGradient>
          <filter id="moonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <!-- Twinkling Stars -->
        <circle class="animated-twinkle" cx="16" cy="18" r="1.5" fill="#E2E8F0" />
        <circle class="animated-twinkle-delay" cx="48" cy="16" r="2" fill="#BAE6FD" />
        <circle class="animated-twinkle" cx="44" cy="46" r="1.2" fill="#E2E8F0" />
        <!-- Crescent Moon -->
        <path class="animated-bob" d="M38.5 15C32.7 15 28 19.7 28 25.5C28 36.8 37.2 46 48.5 46C49.3 46 50.1 45.9 50.9 45.8C47.2 50.2 41.7 53 35.5 53C23.6 53 14 43.4 14 31.5C14 20.3 22.5 11.1 33.3 10.1C35 10 36.8 10.2 38.5 10.6C36.4 11.8 38.5 15 38.5 15Z" 
          fill="url(#moonGrad)" filter="url(#moonGlow)" />
        <circle cx="28" cy="28" r="2.5" fill="#64748B" opacity="0.3" />
        <circle cx="34" cy="38" r="1.8" fill="#64748B" opacity="0.25" />
      </svg>
    `;
  },

  // Partly Cloudy Day
  partlyCloudyDay(size = 48) {
    return `
      <svg class="weather-icon-svg icon-partly-cloudy-day" width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="sunGradP" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FFDD55" />
            <stop offset="100%" stop-color="#FFAA00" />
          </radialGradient>
          <linearGradient id="cloudGradP" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="100%" stop-color="#CBD5E1" />
          </linearGradient>
          <filter id="cloudShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" flood-opacity="0.2" />
          </filter>
        </defs>
        <!-- Sun peeking -->
        <g class="animated-pulse-gentle">
          <circle cx="24" cy="24" r="11" fill="url(#sunGradP)" />
          <line x1="24" y1="6" x2="24" y2="10" stroke="#FFB703" stroke-width="2.5" stroke-linecap="round" />
          <line x1="10" y1="20" x2="6" y2="19" stroke="#FFB703" stroke-width="2.5" stroke-linecap="round" />
          <line x1="12" y1="12" x2="9" y2="9" stroke="#FFB703" stroke-width="2.5" stroke-linecap="round" />
          <line x1="36" y1="12" x2="39" y2="9" stroke="#FFB703" stroke-width="2.5" stroke-linecap="round" />
        </g>
        <!-- Cloud in front -->
        <path class="animated-drift" filter="url(#cloudShadow)" d="M48 48H22C16.48 48 12 43.52 12 38C12 32.96 15.74 28.78 20.62 28.09C22.28 21.75 28.08 17 35 17C43.28 17 50 23.72 50 32C50 32.68 49.95 33.35 49.87 34.01C53.37 34.92 56 38.16 56 42C56 45.31 52.42 48 48 48Z" fill="url(#cloudGradP)" />
      </svg>
    `;
  },

  // Partly Cloudy Night
  partlyCloudyNight(size = 48) {
    return `
      <svg class="weather-icon-svg icon-partly-cloudy-night" width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cloudNightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#94A3B8" />
            <stop offset="100%" stop-color="#475569" />
          </linearGradient>
        </defs>
        <!-- Moon behind -->
        <path d="M28 12C24.5 12 21.5 14 20 17C24.5 17.5 28 21.3 28 26C28 27.5 27.6 28.9 26.9 30.1C29.2 30.7 31 32.7 31 35.1C35 34.3 38 30.5 38 26C38 18.27 33.5 12 28 12Z" fill="#CBD5E1" />
        <!-- Cloud in front -->
        <path class="animated-drift" d="M48 48H22C16.48 48 12 43.52 12 38C12 32.96 15.74 28.78 20.62 28.09C22.28 21.75 28.08 17 35 17C43.28 17 50 23.72 50 32C50 32.68 49.95 33.35 49.87 34.01C53.37 34.92 56 38.16 56 42C56 45.31 52.42 48 48 48Z" fill="url(#cloudNightGrad)" />
      </svg>
    `;
  },

  // Overcast / Cloudy
  overcast(size = 48) {
    return `
      <svg class="weather-icon-svg icon-cloudy" width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#E2E8F0" />
            <stop offset="100%" stop-color="#94A3B8" />
          </linearGradient>
          <linearGradient id="cGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#94A3B8" />
            <stop offset="100%" stop-color="#64748B" />
          </linearGradient>
        </defs>
        <!-- Back Cloud -->
        <path class="animated-drift-slow" opacity="0.75" d="M42 36H24C20 36 17 33 17 29C17 25.5 19.5 22.5 23 22.1C24.5 17.5 28.5 14 33.5 14C39.5 14 44.5 19 44.5 25C44.5 25.5 44.4 26 44.3 26.5C47 27.2 49 29.5 49 32.5C49 34.5 46.5 36 42 36Z" fill="url(#cGrad1)" />
        <!-- Front Cloud -->
        <path class="animated-drift" d="M48 50H20C14.48 50 10 45.52 10 40C10 34.96 13.74 30.78 18.62 30.09C20.28 23.75 26.08 19 33 19C41.28 19 48 25.72 48 34C48 34.68 47.95 35.35 47.87 36.01C51.37 36.92 54 40.16 54 44C54 47.31 51.31 50 48 50Z" fill="url(#cGrad2)" />
      </svg>
    `;
  },

  // Fog / Mist
  fog(size = 48) {
    return `
      <svg class="weather-icon-svg icon-fog" width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path class="animated-drift" d="M12 24H52" stroke="#94A3B8" stroke-width="4" stroke-linecap="round" opacity="0.8" />
        <path class="animated-drift-slow" d="M16 32H48" stroke="#CBD5E1" stroke-width="4" stroke-linecap="round" />
        <path class="animated-drift" d="M10 40H54" stroke="#94A3B8" stroke-width="4" stroke-linecap="round" opacity="0.9" />
        <path class="animated-drift-slow" d="M18 48H46" stroke="#CBD5E1" stroke-width="4" stroke-linecap="round" opacity="0.7" />
      </svg>
    `;
  },

  // Rain Showers / Light Rain
  rainShowers(size = 48) {
    return `
      <svg class="weather-icon-svg icon-rain" width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="rainC" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#94A3B8" />
            <stop offset="100%" stop-color="#475569" />
          </linearGradient>
        </defs>
        <!-- Cloud -->
        <path d="M46 38H18C13.58 38 10 34.42 10 30C10 25.97 12.99 22.62 16.9 22.07C18.22 17 22.86 13.2 28.4 13.2C35.03 13.2 40.4 18.57 40.4 25.2C40.4 25.74 40.36 26.28 40.3 26.81C43.1 27.54 45.2 30.13 45.2 33.2C45.2 35.85 43.1 38 46 38Z" fill="url(#rainC)" />
        <!-- Rain Drops -->
        <g class="animated-rain">
          <line x1="20" y1="44" x2="16" y2="52" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" />
          <line x1="30" y1="44" x2="26" y2="52" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" style="animation-delay: 0.2s;" />
          <line x1="40" y1="44" x2="36" y2="52" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" style="animation-delay: 0.4s;" />
        </g>
      </svg>
    `;
  },

  // Heavy Rain
  heavyRain(size = 48) {
    return `
      <svg class="weather-icon-svg icon-heavy-rain" width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="heavyRainC" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#475569" />
            <stop offset="100%" stop-color="#1E293B" />
          </linearGradient>
        </defs>
        <!-- Dark Cloud -->
        <path d="M48 38H20C15.58 38 12 34.42 12 30C12 25.97 14.99 22.62 18.9 22.07C20.22 17 24.86 13.2 30.4 13.2C37.03 13.2 42.4 18.57 42.4 25.2C42.4 25.74 42.36 26.28 42.3 26.81C45.1 27.54 47.2 30.13 47.2 33.2C47.2 35.85 45.1 38 48 38Z" fill="url(#heavyRainC)" />
        <!-- Intensive Rain Streaks -->
        <g class="animated-rain-fast">
          <line x1="18" y1="42" x2="14" y2="54" stroke="#0284C7" stroke-width="3" stroke-linecap="round" />
          <line x1="28" y1="42" x2="24" y2="54" stroke="#0284C7" stroke-width="3" stroke-linecap="round" style="animation-delay: 0.15s;" />
          <line x1="38" y1="42" x2="34" y2="54" stroke="#0284C7" stroke-width="3" stroke-linecap="round" style="animation-delay: 0.3s;" />
          <line x1="46" y1="44" x2="42" y2="56" stroke="#0284C7" stroke-width="3" stroke-linecap="round" style="animation-delay: 0.45s;" />
        </g>
      </svg>
    `;
  },

  // Thunderstorm
  thunderstorm(size = 48) {
    return `
      <svg class="weather-icon-svg icon-thunderstorm" width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="thunderC" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#334155" />
            <stop offset="100%" stop-color="#0F172A" />
          </linearGradient>
          <filter id="lightningGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <!-- Storm Cloud -->
        <path d="M48 36H20C15.58 36 12 32.42 12 28C12 23.97 14.99 20.62 18.9 20.07C20.22 15 24.86 11.2 30.4 11.2C37.03 11.2 42.4 16.57 42.4 23.2C42.4 23.74 42.36 24.28 42.3 24.81C45.1 25.54 47.2 28.13 47.2 31.2C47.2 33.85 45.1 36 48 36Z" fill="url(#thunderC)" />
        <!-- Lightning Bolt -->
        <polygon class="animated-lightning" points="34,32 24,45 31,45 27,58 40,43 33,43" fill="#FACC15" filter="url(#lightningGlow)" />
        <!-- Secondary Rain -->
        <line x1="16" y1="42" x2="13" y2="50" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round" />
        <line x1="44" y1="42" x2="41" y2="50" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round" />
      </svg>
    `;
  },

  // Snow
  snow(size = 48) {
    return `
      <svg class="weather-icon-svg icon-snow" width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="snowC" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#CBD5E1" />
            <stop offset="100%" stop-color="#94A3B8" />
          </linearGradient>
        </defs>
        <!-- Cloud -->
        <path d="M46 36H18C13.58 36 10 32.42 10 28C10 23.97 12.99 20.62 16.9 20.07C18.22 15 22.86 11.2 28.4 11.2C35.03 11.2 40.4 16.57 40.4 23.2C40.4 23.74 40.36 24.28 40.3 24.81C43.1 25.54 45.2 28.13 45.2 31.2C45.2 33.85 43.1 36 46 36Z" fill="url(#snowC)" />
        <!-- Snowflakes -->
        <g class="animated-snow">
          <circle cx="20" cy="46" r="3" fill="#F0F9FF" />
          <circle cx="32" cy="52" r="3" fill="#F0F9FF" style="animation-delay: 0.3s;" />
          <circle cx="44" cy="46" r="3" fill="#F0F9FF" style="animation-delay: 0.6s;" />
          <!-- Star cross flake -->
          <path d="M30 42L34 42M32 40L32 44" stroke="#BAE6FD" stroke-width="1.5" stroke-linecap="round" />
        </g>
      </svg>
    `;
  },

  // UI Icons
  search(size = 20) {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    `;
  },

  location(size = 20) {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2v3m0 14v3M2 12h3m14 0h3"></path>
        <circle cx="12" cy="12" r="7"></circle>
        <circle cx="12" cy="12" r="2" fill="currentColor"></circle>
      </svg>
    `;
  },

  wind(size = 24) {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
      </svg>
    `;
  },

  humidity(size = 24) {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
      </svg>
    `;
  },

  uv(size = 24) {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;
  },

  pressure(size = 24) {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path>
        <path d="M12 12l3-3"></path>
        <circle cx="12" cy="12" r="1.5" fill="currentColor"></circle>
      </svg>
    `;
  },

  sunrise(size = 24) {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 18a5 5 0 0 0-10 0"></path>
        <line x1="12" y1="2" x2="12" y2="9"></line>
        <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line>
        <line x1="1" y1="18" x2="3" y2="18"></line>
        <line x1="21" y1="18" x2="23" y2="18"></line>
        <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line>
        <line x1="23" y1="22" x2="1" y2="22"></line>
        <polyline points="8 6 12 2 16 6"></polyline>
      </svg>
    `;
  },

  sunset(size = 24) {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 18a5 5 0 0 0-10 0"></path>
        <line x1="12" y1="9" x2="12" y2="2"></line>
        <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line>
        <line x1="1" y1="18" x2="3" y2="18"></line>
        <line x1="21" y1="18" x2="23" y2="18"></line>
        <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line>
        <line x1="23" y1="22" x2="1" y2="22"></line>
        <polyline points="16 5 12 9 8 5"></polyline>
      </svg>
    `;
  },

  cloud(size = 24) {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
      </svg>
    `;
  },

  droplet(size = 20) {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
      </svg>
    `;
  },

  eye(size = 24) {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    `;
  },

  leaf(size = 24) {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
      </svg>
    `;
  },

  compass(size = 24) {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" opacity="0.8"></polygon>
      </svg>
    `;
  },

  star(size = 20, filled = false) {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${filled ? '#FACC15' : 'none'}" stroke="${filled ? '#FACC15' : 'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    `;
  },

  refresh(size = 20) {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="23 4 23 10 17 10"></polyline>
        <polyline points="1 20 1 14 7 14"></polyline>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
      </svg>
    `;
  },

  chevronRight(size = 18) {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    `;
  },

  chevronDown(size = 18) {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    `;
  },

  mapPin(size = 18) {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    `;
  },

  sparkles(size = 20) {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3L14.5 8.5L20 11L14.5 13.5L12 19L9.5 13.5L4 11L9.5 8.5L12 3Z"></path>
      </svg>
    `;
  },

  /**
   * Helper to map WMO Weather Code to icon SVG
   * @param {number} code WMO code
   * @param {number|boolean} isDay 1 for day, 0 for night
   * @param {number} size pixel size
   */
  getIconByWmoCode(code, isDay = 1, size = 48) {
    const isDayBool = Boolean(isDay);

    // 0: Clear Sky
    if (code === 0) {
      return isDayBool ? this.clearDay(size) : this.clearNight(size);
    }
    // 1, 2: Mainly clear, partly cloudy
    if (code === 1 || code === 2) {
      return isDayBool ? this.partlyCloudyDay(size) : this.partlyCloudyNight(size);
    }
    // 3: Overcast
    if (code === 3) {
      return this.overcast(size);
    }
    // 45, 48: Fog
    if (code === 45 || code === 48) {
      return this.fog(size);
    }
    // 51, 53, 55, 56, 57: Drizzle
    if ((code >= 51 && code <= 57) || code === 80) {
      return this.rainShowers(size);
    }
    // 61, 63, 65, 66, 67, 81, 82: Rain
    if ((code >= 61 && code <= 67) || code === 81 || code === 82) {
      return code === 65 || code === 82 ? this.heavyRain(size) : this.rainShowers(size);
    }
    // 71, 73, 75, 77, 85, 86: Snow
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
      return this.snow(size);
    }
    // 95, 96, 99: Thunderstorm
    if (code >= 95 && code <= 99) {
      return this.thunderstorm(size);
    }

    // Default fallback
    return isDayBool ? this.partlyCloudyDay(size) : this.partlyCloudyNight(size);
  },

  /**
   * Returns human-readable weather condition text
   */
  getDescriptionByWmoCode(code) {
    const map = {
      0: "Clear Sky",
      1: "Mainly Clear",
      2: "Partly Cloudy",
      3: "Overcast",
      45: "Foggy",
      48: "Depositing Rime Fog",
      51: "Light Drizzle",
      53: "Moderate Drizzle",
      55: "Dense Drizzle",
      56: "Light Freezing Drizzle",
      57: "Dense Freezing Drizzle",
      61: "Slight Rain",
      63: "Moderate Rain",
      65: "Heavy Rain",
      66: "Light Freezing Rain",
      67: "Heavy Freezing Rain",
      71: "Slight Snow Fall",
      73: "Moderate Snow Fall",
      75: "Heavy Snow Fall",
      77: "Snow Grains",
      80: "Slight Rain Showers",
      81: "Moderate Rain Showers",
      82: "Violent Rain Showers",
      85: "Slight Snow Showers",
      86: "Heavy Snow Showers",
      95: "Thunderstorm",
      96: "Thunderstorm with Slight Hail",
      99: "Thunderstorm with Heavy Hail"
    };
    return map[code] || "Variable Weather";
  },

  /**
   * Maps weather condition code to background theme class
   */
  getThemeByWmoCode(code, isDay = 1) {
    const dayNight = isDay ? 'day' : 'night';
    if (code === 0) return `theme-clear-${dayNight}`;
    if (code === 1 || code === 2) return `theme-partly-cloudy-${dayNight}`;
    if (code === 3) return 'theme-overcast';
    if (code === 45 || code === 48) return 'theme-fog';
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'theme-rain';
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'theme-snow';
    if (code >= 95 && code <= 99) return 'theme-thunderstorm';
    return `theme-clear-${dayNight}`;
  }
};
