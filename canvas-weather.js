/**
 * WeatherPulse - Dynamic Canvas Weather Animation Engine
 * Handles realistic particles: rain, splashes, snow, fog mist, starry night, sun rays, and lightning.
 */

class WeatherCanvasEffect {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.splashes = [];
    this.shootingStars = [];
    this.stars = [];
    this.weatherType = 'clear-day'; // clear-day, clear-night, rain, snow, thunderstorm, fog, cloudy
    this.animationFrameId = null;
    this.enabled = true;
    this.width = 0;
    this.height = 0;
    this.lastFlash = 0;
    this.flashOpacity = 0;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    // Visibility API for battery saving
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stop();
      } else if (this.enabled) {
        this.start();
      }
    });

    this.setWeather('clear-day');
    this.start();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.rebuildParticles();
  }

  setWeather(type) {
    this.weatherType = type;
    this.rebuildParticles();
  }

  rebuildParticles() {
    this.particles = [];
    this.splashes = [];
    this.shootingStars = [];
    this.stars = [];

    const w = this.width;
    const h = this.height;

    if (this.weatherType.includes('night') || this.weatherType === 'theme-clear-night') {
      // Starry sky
      const starCount = Math.floor((w * h) / 7000);
      for (let i = 0; i < starCount; i++) {
        this.stars.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.75,
          radius: Math.random() * 1.6 + 0.4,
          alpha: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.02 + 0.005,
          phase: Math.random() * Math.PI * 2
        });
      }
    } else if (this.weatherType.includes('rain') || this.weatherType.includes('thunderstorm')) {
      // Rain drops
      const dropCount = this.weatherType.includes('thunderstorm') ? 140 : 90;
      for (let i = 0; i < dropCount; i++) {
        this.particles.push({
          x: Math.random() * (w + 200) - 100,
          y: Math.random() * h,
          length: Math.random() * 22 + 15,
          speed: Math.random() * 9 + 12,
          slant: -3.5,
          opacity: Math.random() * 0.4 + 0.3,
          width: Math.random() * 1.5 + 1
        });
      }
    } else if (this.weatherType.includes('snow')) {
      // Snow flakes
      const flakeCount = 100;
      for (let i = 0; i < flakeCount; i++) {
        this.particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius: Math.random() * 3 + 1.2,
          speed: Math.random() * 1.2 + 0.6,
          swaySpeed: Math.random() * 0.03 + 0.01,
          swayAngle: Math.random() * Math.PI * 2,
          swayRadius: Math.random() * 2 + 1,
          opacity: Math.random() * 0.7 + 0.3
        });
      }
    } else if (this.weatherType.includes('fog') || this.weatherType.includes('cloudy') || this.weatherType.includes('overcast')) {
      // Drifting mist
      const cloudCount = 14;
      for (let i = 0; i < cloudCount; i++) {
        this.particles.push({
          x: Math.random() * w * 1.5 - w * 0.25,
          y: Math.random() * h * 0.8,
          rx: Math.random() * 250 + 150,
          ry: Math.random() * 100 + 60,
          speed: Math.random() * 0.4 + 0.15,
          opacity: Math.random() * 0.06 + 0.03
        });
      }
    } else {
      // Clear day sun motes / warm particles
      const moteCount = 35;
      for (let i = 0; i < moteCount; i++) {
        this.particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius: Math.random() * 2.5 + 1,
          speedY: -(Math.random() * 0.4 + 0.1),
          speedX: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.4 + 0.1,
          pulse: Math.random() * Math.PI * 2
        });
      }
    }
  }

  update() {
    const w = this.width;
    const h = this.height;

    // Shooting stars in night mode
    if (this.weatherType.includes('night') && Math.random() < 0.007 && this.shootingStars.length < 2) {
      this.shootingStars.push({
        x: Math.random() * w * 0.8,
        y: Math.random() * h * 0.3,
        len: Math.random() * 80 + 50,
        speed: Math.random() * 8 + 10,
        angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
        opacity: 1
      });
    }

    // Lightning trigger in thunderstorm
    if (this.weatherType.includes('thunderstorm')) {
      const now = performance.now();
      if (now - this.lastFlash > 4500 && Math.random() < 0.015) {
        this.flashOpacity = Math.random() * 0.4 + 0.25;
        this.lastFlash = now;
      }
      if (this.flashOpacity > 0.01) {
        this.flashOpacity *= 0.88;
      } else {
        this.flashOpacity = 0;
      }
    }
  }

  draw() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    // Lightning flash overlay
    if (this.flashOpacity > 0) {
      ctx.fillStyle = `rgba(220, 235, 255, ${this.flashOpacity})`;
      ctx.fillRect(0, 0, w, h);
    }

    // 1. Draw Starry Night
    if (this.stars.length > 0) {
      for (const s of this.stars) {
        s.phase += s.speed;
        const currentAlpha = s.alpha * (0.6 + 0.4 * Math.sin(s.phase));
        ctx.fillStyle = `rgba(235, 245, 255, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw shooting stars
      for (let i = this.shootingStars.length - 1; i >= 0; i--) {
        const ss = this.shootingStars[i];
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.opacity -= 0.02;

        if (ss.opacity <= 0 || ss.x > w || ss.y > h) {
          this.shootingStars.splice(i, 1);
          continue;
        }

        const tailX = ss.x - Math.cos(ss.angle) * ss.len;
        const tailY = ss.y - Math.sin(ss.angle) * ss.len;

        const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(1, `rgba(255, 255, 255, ${ss.opacity})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.stroke();
      }
    }

    // 2. Draw Rain & Splashes
    if (this.weatherType.includes('rain') || this.weatherType.includes('thunderstorm')) {
      ctx.strokeStyle = 'rgba(160, 210, 255, 0.55)';
      ctx.lineCap = 'round';

      for (const p of this.particles) {
        p.x += p.slant;
        p.y += p.speed;

        if (p.y > h) {
          // Trigger ground splash ripple
          if (this.splashes.length < 30) {
            this.splashes.push({
              x: p.x,
              y: h - Math.random() * 25,
              radius: 1,
              maxRadius: Math.random() * 10 + 6,
              alpha: 0.6
            });
          }
          p.y = -p.length;
          p.x = Math.random() * (w + 200) - 100;
        }

        ctx.lineWidth = p.width;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.slant * (p.length / 10), p.y + p.length);
        ctx.stroke();
      }

      // Draw splashes
      for (let i = this.splashes.length - 1; i >= 0; i--) {
        const s = this.splashes[i];
        s.radius += 0.8;
        s.alpha *= 0.88;

        if (s.alpha <= 0.05 || s.radius >= s.maxRadius) {
          this.splashes.splice(i, 1);
          continue;
        }

        ctx.strokeStyle = `rgba(180, 220, 255, ${s.alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(s.x, s.y, s.radius * 1.8, s.radius * 0.6, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // 3. Draw Snow
    if (this.weatherType.includes('snow')) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (const p of this.particles) {
        p.swayAngle += p.swaySpeed;
        p.x += Math.sin(p.swayAngle) * p.swayRadius;
        p.y += p.speed;

        if (p.y > h + 10) {
          p.y = -10;
          p.x = Math.random() * w;
        }

        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // 4. Draw Mist / Fog
    if (this.weatherType.includes('fog') || this.weatherType.includes('cloudy') || this.weatherType.includes('overcast')) {
      for (const p of this.particles) {
        p.x += p.speed;
        if (p.x - p.rx > w) {
          p.x = -p.rx;
        }

        const grad = ctx.createRadialGradient(p.x, p.y, 10, p.x, p.y, p.rx);
        grad.addColorStop(0, `rgba(255, 255, 255, ${p.opacity})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.rx, p.ry, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 5. Draw Clear Day Sun Glow Particles
    if (this.weatherType.includes('clear-day') || this.weatherType === 'theme-clear-day') {
      for (const p of this.particles) {
        p.y += p.speedY;
        p.x += p.speedX;
        p.pulse += 0.03;

        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }

        const alpha = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
        ctx.fillStyle = `rgba(255, 235, 180, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  loop() {
    if (!this.enabled) return;
    this.update();
    this.draw();
    this.animationFrameId = requestAnimationFrame(() => this.loop());
  }

  start() {
    if (!this.animationFrameId) {
      this.loop();
    }
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.start();
    } else {
      this.stop();
      if (this.ctx) this.ctx.clearRect(0, 0, this.width, this.height);
    }
    return this.enabled;
  }
}
