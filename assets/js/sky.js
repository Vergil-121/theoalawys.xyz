(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canvas = document.getElementById('sky');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  var stars = [], comets = [], mx = 0, my = 0, tx = 0, ty = 0, running = true;

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildStars();
  }

  function buildStars() {
    var n = Math.round(Math.min(70, (W * H) / 24000));
    stars = [];
    for (var i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.3 + 0.4,
        a: Math.random() * 0.35 + 0.12,
        sp: Math.random() * 0.9 + 0.2,
        ph: Math.random() * Math.PI * 2,
        depth: Math.random() * 0.6 + 0.2
      });
    }
  }

  function spawnComet() {
    var fromLeft = Math.random() > 0.35;
    comets.push({
      x: fromLeft ? -60 : W + 60,
      y: Math.random() * H * 0.45,
      vx: (fromLeft ? 1 : -1) * (Math.random() * 2.6 + 3.6),
      vy: Math.random() * 1.6 + 1.1,
      life: 0,
      max: Math.random() * 90 + 70,
      len: Math.random() * 90 + 70
    });
  }

  function isNight() { return document.body.classList.contains('night'); }

  function draw(ts) {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);

    tx += (mx - tx) * 0.05;
    ty += (my - ty) * 0.05;

    var night = isNight();
    var t = ts / 1000;

    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var tw = reduce ? s.a : s.a * (0.55 + 0.45 * Math.sin(t * s.sp + s.ph));
      var x = s.x + tx * s.depth * 26;
      var y = s.y + ty * s.depth * 18 + (reduce ? 0 : Math.sin(t * 0.25 + s.ph) * 3);
      ctx.beginPath();
      ctx.arc(x, y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = night
        ? 'rgba(226,232,255,' + tw + ')'
        : 'rgba(255,240,214,' + tw + ')';
      ctx.fill();
      if (s.r > 1.2 && !reduce) {
        ctx.beginPath();
        ctx.arc(x, y, s.r * 3.2, 0, Math.PI * 2);
        ctx.fillStyle = night ? 'rgba(180,200,255,0.05)' : 'rgba(255,230,190,0.06)';
        ctx.fill();
      }
    }

    for (var c = comets.length - 1; c >= 0; c--) {
      var k = comets[c];
      k.x += k.vx;
      k.y += k.vy;
      k.life++;
      var g = ctx.createLinearGradient(k.x, k.y, k.x - k.vx * k.len * 0.25, k.y - k.vy * k.len * 0.25);
      var fade = Math.max(0, 1 - k.life / k.max);
      g.addColorStop(0, 'rgba(255,255,255,' + (0.95 * fade) + ')');
      g.addColorStop(0.35, night ? 'rgba(160,200,255,' + (0.55 * fade) + ')' : 'rgba(255,224,170,' + (0.6 * fade) + ')');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = g;
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(k.x, k.y);
      ctx.lineTo(k.x - k.vx * k.len * 0.25, k.y - k.vy * k.len * 0.25);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(k.x, k.y, 2.6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + fade + ')';
      ctx.fill();
      if (k.life > k.max) comets.splice(c, 1);
    }

    requestAnimationFrame(draw);
  }

  function loop() {
    if (reduce) return;
    var wait = 9000 + Math.random() * 14000;
    setTimeout(function () {
      if (running && !document.hidden) spawnComet();
      loop();
    }, wait);
  }

  function makeClouds() {
    var host = document.getElementById('clouds');
    if (!host || reduce) return;
    var svg = '<svg viewBox="0 0 200 70" xmlns="http://www.w3.org/2000/svg">' +
      '<g fill="rgba(255,255,255,.85)">' +
      '<ellipse cx="60" cy="45" rx="48" ry="22"/>' +
      '<ellipse cx="100" cy="34" rx="42" ry="26"/>' +
      '<ellipse cx="140" cy="46" rx="40" ry="20"/>' +
      '<rect x="20" y="45" width="160" height="20" rx="10"/>' +
      '</g></svg>';
    for (var i = 0; i < 3; i++) {
      var d = document.createElement('div');
      d.className = 'cloud';
      d.style.width = (150 + i * 70) + 'px';
      d.style.top = (8 + i * 17) + 'vh';
      d.style.opacity = String(0.4 - i * 0.08);
      d.style.animationDuration = (70 + i * 34) + 's';
      d.style.animationDelay = (-i * 22) + 's';
      d.innerHTML = svg;
      host.appendChild(d);
    }
  }

  function makeBokeh() {
    var host = document.getElementById('bokeh');
    if (!host || reduce) return;
    for (var i = 0; i < 14; i++) {
      var b = document.createElement('i');
      var size = 6 + Math.random() * 16;
      b.style.width = size + 'px';
      b.style.height = size + 'px';
      b.style.left = (Math.random() * 100) + 'vw';
      b.style.animationDuration = (16 + Math.random() * 20) + 's';
      b.style.animationDelay = (-Math.random() * 26) + 's';
      host.appendChild(b);
    }
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', function (e) {
    mx = (e.clientX / window.innerWidth - 0.5);
    my = (e.clientY / window.innerHeight - 0.5);
  });
  document.addEventListener('visibilitychange', function () {
    running = !document.hidden;
    if (running) requestAnimationFrame(draw);
  });

  resize();
  makeClouds();
  makeBokeh();
  requestAnimationFrame(draw);
  loop();
})();
