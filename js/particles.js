(function () {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');

  let dpr = Math.max(1, window.devicePixelRatio || 1);
  let w, h, particles, mouse = { x: 0.5, y: 0.5 };

  function resize() {
    w = canvas.clientWidth = window.innerWidth;
    h = canvas.clientHeight = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initParticles();
  }

  function rand(a, b) { return a + Math.random() * (b - a); }

  function initParticles() {
    const density = Math.min(120, Math.round((w * h) / 16000));
    particles = new Array(density).fill(0).map(() => ({
      x: Math.random() * w, y: Math.random() * h,
      r: rand(1, 2), a: rand(0.15, 0.35),
      tw: rand(0.002, 0.01), t: Math.random() * Math.PI * 2,
      vx: rand(-0.03, 0.03), vy: rand(0.25, 0.5),
      wphase: Math.random() * Math.PI * 2, wfreq: rand(0.0015, 0.0035), wamp: rand(0.25, 0.8),
    }));
  }

  function draw() {
    ctx.fillStyle = 'rgba(6, 10, 22, 0.25)';
    ctx.fillRect(0, 0, w, h);

    const px = (mouse.x - 0.5) * 8;
    const py = (mouse.y - 0.5) * 8;

    for (const p of particles) {
      p.t += p.tw;
      p.y += p.vy;
      p.wphase += p.wfreq;
      const wave = Math.sin(p.wphase) * p.wamp;
      p.x += p.vx + wave * 0.04;

      if (p.y > h + 6) { p.y = -6; p.x = Math.random() * w; }
      if (p.x < -6) p.x = w + 6; else if (p.x > w + 6) p.x = -6;

      const alpha = p.a + Math.sin(p.t) * 0.12;
      ctx.beginPath();
      ctx.arc(p.x + px, p.y + py, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 220, 255, ${alpha})`;
      ctx.fill();
    }

    ctx.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i += 5) {
      const p1 = particles[i];
      for (let j = i + 1; j < i + 9 && j < particles.length; j += 3) {
        const p2 = particles[j];
        const dx = p1.x - p2.x, dy = p1.y - p2.y;
        const dist2 = dx * dx + dy * dy;
        const maxD = 120;
        if (dist2 < maxD * maxD) {
          const a = 0.015 * (1 - dist2 / (maxD * maxD));
          ctx.strokeStyle = `rgba(160, 190, 255, ${a})`;
          ctx.beginPath();
          ctx.moveTo(p1.x + px, p1.y + py);
          ctx.lineTo(p2.x + px, p2.y + py);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX / w; mouse.y = e.clientY / h;
  }, { passive: true });

  window.addEventListener('resize', resize);
  resize();
  ctx.fillStyle = 'rgba(6,10,22,1)';
  ctx.fillRect(0,0,w,h);
  requestAnimationFrame(draw);
})();
