(function () {
  'use strict';

  var S = window.SITE || {};
  var NS = 'pxh:';

  /* ---------------- 工具 ---------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function ymd(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function today() { return ymd(new Date()); }
  function shiftDay(n) { var d = new Date(); d.setDate(d.getDate() + n); return ymd(d); }
  function dayGap(a, b) {
    if (!a || !b) return 0;
    var p = a.split('-'), q = b.split('-');
    return Math.round((new Date(+q[0], +q[1] - 1, +q[2]) - new Date(+p[0], +p[1] - 1, +p[2])) / 86400000);
  }
  function store(key, def) {
    try { var raw = localStorage.getItem(NS + key); return raw ? JSON.parse(raw) : def; }
    catch (e) { return def; }
  }
  function save(key, val) {
    try { localStorage.setItem(NS + key, JSON.stringify(val)); } catch (e) {}
  }
  function paras(arr) {
    return (arr || []).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
  }
  function fmt(sec) {
    sec = Math.max(0, Math.round(sec));
    return Math.floor(sec / 60) + ':' + pad(sec % 60);
  }

  /* ---------------- 主题切换 ---------------- */
  var themeBtn = $('#theme-btn');
  if (themeBtn) {
    function paint() {
      themeBtn.textContent = document.body.classList.contains('night') ? '黄昏' : '星夜';
    }
    if (store('theme', 'dusk') === 'night') document.body.classList.add('night');
    paint();
    themeBtn.addEventListener('click', function () {
      var night = document.body.classList.toggle('night');
      save('theme', night ? 'night' : 'dusk');
      paint();
    });
  }

  /* ---------------- 背景横竖版切换 ---------------- */
  var themeBtnEl = $('#theme-btn');
  if (themeBtnEl) {
    var bgBtn = document.createElement('button');
    bgBtn.className = 'theme-btn';
    bgBtn.id = 'bgmode-btn';
    bgBtn.title = '切换背景图版本（自动跟随屏幕方向 / 强制横版 / 强制竖版）';
    themeBtnEl.parentNode.insertBefore(bgBtn, themeBtnEl);
    var BG_MODES = ['auto', 'wide', 'tall'];
    var BG_LABELS = { auto: '背景·自动', wide: '背景·横版', tall: '背景·竖版' };
    var bgMode = store('bgmode', 'auto');
    if (BG_MODES.indexOf(bgMode) < 0) bgMode = 'auto';
    function applyBgMode() {
      document.body.classList.toggle('force-wide', bgMode === 'wide');
      document.body.classList.toggle('force-tall', bgMode === 'tall');
      bgBtn.textContent = BG_LABELS[bgMode];
    }
    bgBtn.addEventListener('click', function () {
      bgMode = BG_MODES[(BG_MODES.indexOf(bgMode) + 1) % BG_MODES.length];
      save('bgmode', bgMode);
      applyBgMode();
    });
    applyBgMode();
  }

  /* ---------------- 滚动进度条 ---------------- */
  var bar = $('#progress');
  if (bar) {
    function onScroll() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0) + '%';
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------- 进场动画（GSAP 优先，IntersectionObserver 兜底） ---------------- */
  var revealEls = $$('.reveal');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var G = (!reduceMotion && window.gsap) ? window.gsap : null;
  var ST = (G && window.ScrollTrigger) ? window.ScrollTrigger : null;
  if (G && ST) G.registerPlugin(ST);

  if (G) {
    // 首屏 Hero 入场
    if ($('.hero')) {
      G.from('.hero h1', { y: 26, opacity: 0, duration: .85, ease: 'power3.out', delay: .1 });
      G.from('.hero .typing', { opacity: 0, duration: .6, delay: .3 });
      G.from('.hero p', { y: 16, opacity: 0, duration: .7, delay: .42, ease: 'power3.out' });
      G.from('.hero .btn', { y: 14, opacity: 0, duration: .6, delay: .55, stagger: .09, ease: 'power2.out' });
    }
    if ($('.nav')) G.from('.nav', { y: -18, opacity: 0, duration: .8, ease: 'power3.out' });

    // 卡片按网格成组错峰进场
    G.set(revealEls, { opacity: 0, y: 24 });
    $$('.grid').forEach(function (grid) {
      var kids = $$('.reveal', grid);
      if (!kids.length) return;
      if (ST) {
        G.to(kids, {
          opacity: 1, y: 0, duration: .9, stagger: .12, ease: 'power3.out',
          scrollTrigger: { trigger: grid, start: 'top 85%', once: true }
        });
      } else {
        G.to(kids, { opacity: 1, y: 0, duration: .9, delay: .2, stagger: .12, ease: 'power3.out' });
      }
      kids.forEach(function (k) { k.setAttribute('data-gsap-done', '1'); });
    });
    revealEls.filter(function (el) { return el.getAttribute('data-gsap-done') !== '1'; })
      .forEach(function (el) {
        if (ST) {
          G.to(el, {
            opacity: 1, y: 0, duration: .9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true }
          });
        } else {
          G.to(el, { opacity: 1, y: 0, duration: .9, delay: .2, ease: 'power3.out' });
        }
      });

    // 滚动时遮罩轻微加深，制造纵深
    if (ST && $('.veil')) {
      G.fromTo('.veil', { opacity: .78 }, {
        opacity: 1, ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true }
      });
    }
  } else if (revealEls.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------------- GSAP 动效增强 ---------------- */
  if (G) {
    document.body.classList.add('gsap-on');

    // 模块入口图标持续轻微浮动
    if ($('.module .m-icon')) {
      G.to('.module .m-icon', {
        y: -6, duration: 1.6, ease: 'sine.inOut',
        yoyo: true, repeat: -1, stagger: .18
      });
    }

    // 卡片悬停：上浮 + 图标微缩放
    $$('.card').forEach(function (card) {
      if (card.classList.contains('hero-card')) return; // Hero 卡片由鼠标视差控制，不做上浮
      var icon = card.querySelector('.m-icon');
      card.addEventListener('mouseenter', function () {
        G.to(card, { y: -6, duration: .35, ease: 'power2.out' });
        if (icon) G.to(icon, { scale: 1.12, rotate: -4, duration: .35, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', function () {
        G.to(card, { y: 0, duration: .35, ease: 'power2.out' });
        if (icon) G.to(icon, { scale: 1, rotate: 0, duration: .35, ease: 'power2.out' });
      });
    });

    // Hero 鼠标视差
    var heroEl = $('.hero');
    var heroCard = $('.hero-card');
    if (heroEl && heroCard) {
      heroEl.addEventListener('mousemove', function (e) {
        var r = heroEl.getBoundingClientRect();
        var dx = (e.clientX - r.left) / r.width - .5;
        var dy = (e.clientY - r.top) / r.height - .5;
        G.to(heroCard, { x: dx * 10, y: dy * 8, duration: .6, ease: 'power2.out' });
      });
      heroEl.addEventListener('mouseleave', function () {
        G.to(heroCard, { x: 0, y: 0, duration: .6, ease: 'power2.out' });
      });
    }
  }

  /* ---------------- 回到顶部 ---------------- */
  var toTop = document.createElement('button');
  toTop.id = 'to-top';
  toTop.className = 'btn btn-pink btn-sm';
  toTop.textContent = '↑ 回到顶部';
  document.body.appendChild(toTop);
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  var toTopShown = false;
  window.addEventListener('scroll', function () {
    var show = window.scrollY > 400;
    if (show === toTopShown) return;
    toTopShown = show;
    if (G) G.to(toTop, { autoAlpha: show ? 1 : 0, y: show ? 0 : 12, duration: .35, ease: 'power2.out' });
    else toTop.classList.toggle('show', show);
  }, { passive: true });

  /* ---------------- 打字机 ---------------- */
  var typing = $('#typing');
  if (typing) {
    var lines = (S.quotes || []).slice();
    var li = 0, ci = 0, del = false;
    function step() {
      var line = lines[li] || '';
      if (!del) {
        ci++;
        typing.textContent = line.slice(0, ci);
        if (ci >= line.length) { del = true; return setTimeout(step, 2200); }
        return setTimeout(step, 95);
      }
      ci -= 2;
      typing.textContent = line.slice(0, Math.max(0, ci));
      if (ci <= 0) { del = false; li = (li + 1) % lines.length; ci = 0; return setTimeout(step, 500); }
      return setTimeout(step, 40);
    }
    step();
  }

  /* ---------------- 导航高亮 / 页脚 ---------------- */
  var page = (location.pathname.split('/').pop() || 'index.html').replace('.html', '') || 'index';
  $$('.px-nav a').forEach(function (a) {
    if (a.getAttribute('data-nav') === page) a.classList.add('active');
  });
  var footDays = $('#foot-days');
  if (footDays) footDays.textContent = Math.max(1, dayGap(S.siteStart, today()) + 1);

  /* ---------------- 小站大事记 ---------------- */
  var evRoot = $('#home-events');
  if (evRoot) {
    evRoot.innerHTML = (S.siteEvents || []).map(function (e) {
      return '<div class="tl-item"><div class="px">' + esc(e.date) + '</div><div>' + esc(e.text) + '</div></div>';
    }).join('');
  }

  /* ---------------- 学习打卡 ---------------- */
  var CK = 'checkin:v1';
  var CHEER = ['今天也在往前走一点点。', '状态差也没关系，来了就算数。', '坚持比强度重要。', '别忘了喝水。', '明天的你会谢谢今天。', '进度条又亮了一格。'];

  // 数字滚动动画（GSAP 可用时）
  function setNum(el, val) {
    if (!el) return;
    if (G) {
      var obj = { n: parseInt(el.textContent, 10) || 0 };
      G.to(obj, {
        n: val, duration: .8, ease: 'power2.out', snap: { n: 1 },
        onUpdate: function () { el.textContent = Math.round(obj.n); }
      });
    } else {
      el.textContent = val;
    }
  }

  // 页面里可以有任意多个 .ck-block（学习页一个、首页一个），共用同一份数据
  function paintCk(root) {
    var s = store(CK, { last: '', streak: 0, total: 0, history: [] });
    var t = today();
    var done = s.last === t;
    var streak = (s.last === t || s.last === shiftDay(-1)) ? (s.streak || 0) : 0;
    setNum($('.ck-streak', root), streak);
    setNum($('.ck-total', root), s.total || 0);
    setNum($('.ck-longest', root), s.longest || 0);
    var set = {};
    (s.history || []).forEach(function (d) { set[d] = 1; });
    var seg = '';
    for (var i = 29; i >= 0; i--) {
      var day = shiftDay(-i);
      seg += '<i class="' + (set[day] ? 'on' : '') + '" title="' + day + '"></i>';
    }
    var segs = $('.ck-segs', root);
    if (segs) segs.innerHTML = seg;
    var btn = $('.ck-btn', root);
    if (btn) {
      btn.textContent = done ? '今日已打卡' : '打卡今天';
      btn.disabled = done;
    }
    var word = $('.ck-word', root);
    if (word) {
      word.textContent = done
        ? '今天已经记下了，明天见。' + CHEER[(s.total || 0) % CHEER.length]
        : '点一下，把今天也记下来。';
    }
  }
  function ckRender() { $$('.ck-block').forEach(paintCk); }

  document.addEventListener('click', function (e) {
    var ck = e.target.closest('.ck-btn');
    if (!ck) return;
    var s = store(CK, { last: '', streak: 0, total: 0, history: [] });
    var t = today();
    if (s.last === t) return;
    s.streak = (s.last === shiftDay(-1)) ? (s.streak || 0) + 1 : 1;
    s.longest = Math.max(s.longest || 0, s.streak);
    s.total = (s.total || 0) + 1;
    s.history = (s.history || []).concat([t]).slice(-400);
    s.last = t;
    save(CK, s);
    ckRender();
  });
  ckRender();

  /* ---------------- 学习：各科进度 ---------------- */
  var subjRoot = $('#subject-list');
  if (subjRoot) {
    subjRoot.innerHTML = (S.subjects || []).map(function (s) {
      var lv = s.level === 'stuck' ? 'lv-stuck' : 'lv-on';
      return '' +
        '<article class="card card-tight subj t-' + esc(s.tone || 'pink') + '">' +
          '<div class="s-badge">' + esc(s.icon || '·') + '</div>' +
          '<div style="flex:1 1 220px;min-width:0">' +
            '<h3>' + esc(s.name) + ' <span class="s-state ' + lv + '">' + esc(s.state) + '</span></h3>' +
            '<div class="s-bar"><i data-w="' + (s.progress || 0) + '" style="width:' + (s.progress || 0) + '%"></i></div>' +
            '<div class="s-line"><b>在做：</b>' + esc(s.now) + '</div>' +
            '<div class="s-line"><b>下一步：</b>' + esc(s.next) + '</div>' +
            '<p class="s-note">' + esc(s.note) + '</p>' +
          '</div>' +
        '</article>';
    }).join('') || '<div class="empty">还没有添加科目状态</div>';

    // 动态插入的卡片补上悬停上浮（初始扫描时它们还没生成）
    if (G) {
      $$('#subject-list .subj').forEach(function (card) {
        card.addEventListener('mouseenter', function () { G.to(card, { y: -6, duration: .35, ease: 'power2.out' }); });
        card.addEventListener('mouseleave', function () { G.to(card, { y: 0, duration: .35, ease: 'power2.out' }); });
      });
    }

    // 进度条滚动到视野内时生长
    if (G && ST) {
      $$('#subject-list .s-bar > i').forEach(function (bar) {
        G.from(bar, {
          width: 0, duration: 1.1, ease: 'power2.out',
          scrollTrigger: { trigger: bar, start: 'top 92%', once: true }
        });
      });
    }
  }

  /* ---------------- 学习：计划感想 + 计划文件 ---------------- */
  var R = 'reflections:v1';

  function reflCard(r, mine) {
    return '' +
      '<div class="refl">' +
        '<div class="r-head">' +
          '<span class="r-title">' + esc(r.title) + '</span>' +
          '<span class="tag">' + esc(r.cat || '感想') + '</span>' +
          (mine ? '<span class="tag btn-teal">我的记录</span>' : '') +
          '<span class="r-date">' + esc(r.date) + '</span>' +
          (mine ? ' <button class="btn btn-sm btn-ghost" data-rdel="' + esc(r.id) + '">删除</button>' : '') +
        '</div>' +
        '<p>' + esc(r.text) + '</p>' +
      '</div>';
  }
  function renderPlans() {
    var root = $('#plan-list');
    if (!root) return;
    var mine = store(R, []).slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    var built = (S.plans || []).slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    var html = mine.map(function (r) { return reflCard(r, true); }).join('') +
      built.map(function (r) { return reflCard(r, false); }).join('');
    root.innerHTML = html || '<div class="empty">还没有感想，用下面的表单记一条吧</div>';

    // 首页学习区同步显示最新两条
    var hp = $('#home-plans');
    if (hp) {
      var top = mine.concat(built).slice(0, 2);
      hp.innerHTML = top.map(function (r) {
        return reflCard(r, mine.indexOf(r) >= 0);
      }).join('') || '<div class="empty">还没有感想</div>';
    }
  }
  renderPlans();

  var reflForm = $('#refl-form');
  if (reflForm) {
    reflForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var title = $('#r-title').value.trim();
      var text = $('#r-text').value.trim();
      if (!title || !text) { alert('标题和内容都写一下吧'); return; }
      var list = store(R, []);
      list.push({ id: 'r' + Date.now(), title: title, cat: $('#r-cat').value, text: text, date: today() });
      save(R, list);
      reflForm.reset();
      renderPlans();
      var okR = $('#refl-ok');
      okR.style.display = 'inline';
      setTimeout(function () { okR.style.display = 'none'; }, 2600);
    });
  }

  /* 计划文件（PDF）：预览 + 下载 */
  var fileRoot = $('#file-list'), pdfTabs = $('#pdf-tabs'), pdfView = $('#pdf-view'), pdfHint = $('#pdf-hint');
  var pdfFiles = S.planFiles || [];
  if (fileRoot && pdfFiles.length) {
    fileRoot.innerHTML = pdfFiles.map(function (f) {
      return '' +
        '<div class="filecard">' +
          '<div class="f-ico">PDF</div>' +
          '<div class="f-main">' +
            '<div class="f-name">' + esc(f.name) + '</div>' +
            '<div class="f-desc">' + esc(f.desc) + '</div>' +
            '<div class="tiny">' + esc(f.size) + '</div>' +
          '</div>' +
          '<div class="f-act">' +
            '<button class="btn btn-violet btn-sm" data-pdf="' + esc(f.id) + '">在线预览</button>' +
            '<a class="btn btn-ghost btn-sm" href="' + esc(f.file) + '" download>下载</a>' +
            '<a class="btn btn-ghost btn-sm" href="' + esc(f.file) + '" target="_blank" rel="noopener">新窗口打开</a>' +
          '</div>' +
        '</div>';
    }).join('');

    pdfTabs.innerHTML = pdfFiles.map(function (f) {
      return '<button class="btn btn-ghost btn-sm" data-pdf="' + esc(f.id) + '">' + esc(f.name) + '</button>';
    }).join('') + '<button class="btn btn-ghost btn-sm" id="pdf-close">关闭预览</button>';

    var pdfDoc = null, pdfPageNum = 1, pdfScale = 1.3, pdfTask = null;

    // 渲染不出来（比如直接用 file:// 打开）就退回浏览器自带的 PDF 插件
    function pdfFallback(file) {
      var stage = $('.pdf-stage');
      if (stage) {
        stage.innerHTML = '<object data="' + esc(file) + '#view=FitH" type="application/pdf">' +
          '<div class="empty">这个浏览器没能在这儿渲染出来，点上面的「下载」用本地阅读器打开吧。</div>' +
          '</object>';
      }
      var n = $('#pp-num'); if (n) n.textContent = '预览不可用';
    }
    function renderPdfPage() {
      if (!pdfDoc) return;
      pdfDoc.getPage(pdfPageNum).then(function (page) {
        var canvas = $('#pdf-canvas');
        if (!canvas) return;
        var dpr = window.devicePixelRatio || 1;
        var vp = page.getViewport({ scale: pdfScale });
        canvas.width = Math.floor(vp.width * dpr);
        canvas.height = Math.floor(vp.height * dpr);
        canvas.style.width = vp.width + 'px';
        canvas.style.height = vp.height + 'px';
        var ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (pdfTask) { try { pdfTask.cancel(); } catch (e) {} }
        pdfTask = page.render({ canvasContext: ctx, viewport: vp });
        var n = $('#pp-num');
        if (n) n.textContent = pdfPageNum + ' / ' + pdfDoc.numPages;
      });
    }
    function openPdf(id) {
      var hit = null;
      pdfFiles.forEach(function (f) { if (f.id === id) hit = f; });
      if (!hit) return;
      var stage = $('.pdf-stage');
      if (stage && !$('#pdf-canvas')) stage.innerHTML = '<canvas id="pdf-canvas"></canvas>';
      pdfView.classList.add('on');
      if (pdfHint) pdfHint.style.display = 'block';
      $$('[data-pdf]', pdfTabs).forEach(function (b) {
        b.classList.toggle('on', b.getAttribute('data-pdf') === id);
      });
      var n = $('#pp-num'); if (n) n.textContent = '加载中…';
      if (!window.pdfjsLib) { pdfFallback(hit.file); }
      else {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'assets/js/vendor/pdf/pdf.worker.min.js';
        window.pdfjsLib.getDocument(hit.file).promise.then(function (doc) {
          pdfDoc = doc; pdfPageNum = 1; pdfScale = 1.3;
          renderPdfPage();
        })['catch'](function () { pdfFallback(hit.file); });
      }
      pdfView.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    function closePdf() {
      pdfView.classList.remove('on');
      pdfDoc = null;
      if (pdfHint) pdfHint.style.display = 'none';
      $$('[data-pdf]', pdfTabs).forEach(function (b) { b.classList.remove('on'); });
      var n = $('#pp-num'); if (n) n.textContent = '—';
      var c = $('#pdf-canvas');
      if (c) { c.width = 0; c.height = 0; }
    }
    var ppPrev = $('#pp-prev');
    if (ppPrev) ppPrev.addEventListener('click', function () {
      if (pdfDoc && pdfPageNum > 1) { pdfPageNum--; renderPdfPage(); }
    });
    var ppNext = $('#pp-next');
    if (ppNext) ppNext.addEventListener('click', function () {
      if (pdfDoc && pdfPageNum < pdfDoc.numPages) { pdfPageNum++; renderPdfPage(); }
    });
    var ppBig = $('#pp-big');
    if (ppBig) ppBig.addEventListener('click', function () {
      if (pdfDoc) { pdfScale = Math.min(3, pdfScale + 0.25); renderPdfPage(); }
    });
    var ppSmall = $('#pp-small');
    if (ppSmall) ppSmall.addEventListener('click', function () {
      if (pdfDoc) { pdfScale = Math.max(0.6, pdfScale - 0.25); renderPdfPage(); }
    });
    pdfTabs.addEventListener('click', function (e) {
      if (e.target.closest('#pdf-close')) { closePdf(); return; }
      var b = e.target.closest('[data-pdf]');
      if (b) openPdf(b.getAttribute('data-pdf'));
    });
    fileRoot.addEventListener('click', function (e) {
      var b = e.target.closest('[data-pdf]');
      if (b) openPdf(b.getAttribute('data-pdf'));
    });
  } else if (pdfTabs) {
    pdfTabs.style.display = 'none';
  }

  /* ---------------- 首页学习区：各科状态 ---------------- */
  var homeSubj = $('#home-subjects');
  if (homeSubj) {
    homeSubj.innerHTML = (S.subjects || []).map(function (s) {
      var lv = s.level === 'stuck' ? 'lv-stuck' : 'lv-on';
      return '' +
        '<div class="s-mini">' +
          '<div class="s-mini-top"><b>' + esc(s.name) + '</b>' +
            '<span class="s-state ' + lv + '">' + esc(s.state) + '</span></div>' +
          '<div class="bar"><i style="width:' + (s.progress || 0) + '%"></i></div>' +
          '<div class="tiny">' + esc(s.now) + '</div>' +
        '</div>';
    }).join('');

    if (G && ST) {
      $$('#home-subjects .bar > i').forEach(function (bar) {
        G.from(bar, {
          width: 0, duration: 1.1, ease: 'power2.out',
          scrollTrigger: { trigger: bar, start: 'top 95%', once: true }
        });
      });
    }
  }

  /* ---------------- 笔记 ---------------- */
  function noteCard(n, withBody) {
    var tags = (n.tags || []).map(function (t) { return '<span class="tag">#' + esc(t) + '</span>'; }).join('');
    return '' +
      '<article class="item" data-note="' + esc(n.id) + '">' +
        '<h3>' + esc(n.title) + '</h3>' +
        '<div class="meta">' + esc(n.date) + ' · ' + esc((n.tags || []).join(' / ')) + '</div>' +
        '<p style="margin:6px 0 8px">' + esc(n.summary) + '</p>' +
        '<div>' + tags + '</div>' +
        (withBody
          ? '<div style="margin-top:10px"><button class="btn btn-sm btn-ghost" data-toggle="note">展开全文</button></div>' +
            '<div class="note-body">' + paras(n.body) + '</div>'
          : '') +
      '</article>';
  }
  function renderNotes(list, root, withBody) {
    root.innerHTML = list.length ? list.map(function (n) { return noteCard(n, withBody); }).join('')
      : '<div class="empty">这里还空着，去写点什么吧</div>';
  }
  var notesRoot = $('#notes-list');
  if (notesRoot) {
    var all = (S.notes || []).slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    var activeTags = [];
    var tagSet = [];
    all.forEach(function (n) {
      (n.tags || []).forEach(function (t) { if (tagSet.indexOf(t) < 0) tagSet.push(t); });
    });
    var tagBox = $('#note-tags');
    if (tagBox) {
      tagBox.innerHTML = tagSet.map(function (t) {
        return '<span class="tag tag-link" data-tag="' + esc(t) + '">#' + esc(t) + '</span>';
      }).join('');
      tagBox.addEventListener('click', function (e) {
        var el = e.target.closest('[data-tag]');
        if (!el) return;
        var t = el.getAttribute('data-tag');
        var i = activeTags.indexOf(t);
        if (i < 0) activeTags.push(t); else activeTags.splice(i, 1);
        el.classList.toggle('on');
        apply();
      });
    }
    var kw = $('#note-search');
    function apply() {
      var q = (kw && kw.value || '').trim().toLowerCase();
      var list = all.filter(function (n) {
        var hitTag = !activeTags.length || (n.tags || []).some(function (t) { return activeTags.indexOf(t) >= 0; });
        var hitKw = !q || (n.title + n.summary + (n.tags || []).join('') + (n.body || []).join('')).toLowerCase().indexOf(q) >= 0;
        return hitTag && hitKw;
      });
      renderNotes(list, notesRoot, true);
      var c = $('#note-count');
      if (c) c.textContent = list.length;
    }
    if (kw) kw.addEventListener('input', apply);
    apply();
  }
  var homeNotes = $('#home-notes');
  if (homeNotes) {
    renderNotes((S.notes || []).slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; }).slice(0, 2), homeNotes, false);
  }

  /* ---------------- 日记 ---------------- */
  function diaryCard(d) {
    return '' +
      '<div class="tl-item">' +
        '<div class="px">' + esc(d.date) + ' · ' + esc(d.weather) + ' · ' + esc(d.mood) + '</div>' +
        '<div class="bubble">' + esc(d.text) + '</div>' +
      '</div>';
  }
  var diaryRoot = $('#diary-list');
  if (diaryRoot) diaryRoot.innerHTML = (S.diary || []).map(diaryCard).join('');
  var homeDiary = $('#home-diary');
  if (homeDiary) homeDiary.innerHTML = (S.diary || []).slice(0, 1).map(diaryCard).join('');

  /* ---------------- 动漫 ---------------- */
  function stars(n) {
    var out = '';
    for (var i = 1; i <= 5; i++) out += '<i class="' + (i <= n ? '' : 'off') + '">★</i>';
    return '<span class="stars">' + out + '</span>';
  }
  function animeCard(a, idx) {
    var hues = [255, 275, 200, 320, 30, 220];
    var h = hues[idx % hues.length];
    var cover = 'background:linear-gradient(135deg,hsl(' + h + ',70%,62%),hsl(' + ((h + 50) % 360) + ',72%,55%) 55%,hsl(' + ((h + 100) % 360) + ',80%,60%))';
    // 有封面图就用图，没有就退回渐变色块（图挂了也不会开天窗）
    var coverHtml = a.img
      ? '<div class="anime-cover"><img src="' + esc(a.img) + '" alt="' + esc(a.title) + '" loading="lazy" onerror="this.parentNode.classList.add(\'noimg\');this.remove()"><b>' + esc(a.title) + '</b></div>'
      : '<div class="anime-cover" style="' + cover + '"><b>' + esc(a.title) + '</b></div>';
    return '' +
      '<article class="item">' +
        coverHtml +
        '<div class="meta">' + esc(a.year) + ' · ' + esc(a.tag) + ' · ' + esc(a.progress) + '</div>' +
        '<div style="margin:4px 0 6px">' + stars(a.stars) + '</div>' +
        '<p style="margin:0;font-size:14.5px">' + esc(a.comment) + '</p>' +
      '</article>';
  }
  var animeRoot = $('#anime-list');
  if (animeRoot) animeRoot.innerHTML = (S.anime || []).map(animeCard).join('');
  var homeAnime = $('#home-anime');
  if (homeAnime) {
    var thumbCss = 'background:linear-gradient(135deg,hsl(255,70%,62%),hsl(320,72%,58%))';
    homeAnime.innerHTML = (S.anime || []).slice(0, 2).map(function (a) {
      var thumb = a.img
        ? '<div class="anime-thumb" style="background-image:url(' + esc(a.img) + ')"></div>'
        : '<div class="anime-thumb" style="' + thumbCss + '"></div>';
      return '<article class="item">' + thumb + '<h3>' + esc(a.title) + '</h3>' +
        '<div class="meta">' + esc(a.year) + ' · ' + esc(a.tag) + ' · ' + esc(a.progress) + '</div>' +
        '<div style="margin-top:4px">' + stars(a.stars) + '</div></article>';
    }).join('');
  }

  /* ---------------- 游戏 ---------------- */
  function gameCard(g) {
    var cover = g.img
      ? '<div class="game-cover"><img src="' + esc(g.img) + '" alt="' + esc(g.title) + '" loading="lazy" onerror="this.remove()"></div>'
      : '<div class="game-cover game-cover-ph"><b>' + esc(g.title) + '</b></div>';
    var ach = (g.achievements || []).map(function (a) {
      return '<li><i>✓</i>' + esc(a) + '</li>';
    }).join('');
    return '' +
      '<article class="card card-tight game">' +
        cover +
        '<h3 style="margin:12px 0 4px">' + esc(g.title) + ' <span class="tag">' + esc(g.status) + '</span></h3>' +
        '<div class="meta">' + esc(g.platform) + ' · ' + esc(g.hours) + '</div>' +
        '<div class="ach-title">打出来的成就</div>' +
        '<ul class="ach">' + ach + '</ul>' +
        '<p class="game-exp">' + esc(g.exp) + '</p>' +
      '</article>';
  }
  var gameRoot = $('#game-list');
  if (gameRoot) {
    gameRoot.innerHTML = (S.games || []).map(gameCard).join('');
    if (G) {
      $$('#game-list .game').forEach(function (card) {
        card.addEventListener('mouseenter', function () { G.to(card, { y: -6, duration: .35, ease: 'power2.out' }); });
        card.addEventListener('mouseleave', function () { G.to(card, { y: 0, duration: .35, ease: 'power2.out' }); });
      });
    }
  }
  var homeGames = $('#home-games');
  if (homeGames) {
    homeGames.innerHTML = (S.games || []).slice(0, 2).map(function (g) {
      var thumb = g.img
        ? '<div class="anime-thumb" style="background-image:url(' + esc(g.img) + ')"></div>'
        : '<div class="anime-thumb" style="background:linear-gradient(135deg,var(--gold),var(--accent))"></div>';
      return '<article class="item">' + thumb + '<h3>' + esc(g.title) + '</h3>' +
        '<div class="meta">' + esc(g.hours) + ' · ' + esc(g.status) + '</div></article>';
    }).join('');
  }

  /* ---------------- 音乐播放器（真实音频 + 本地导入） ---------------- */
  var playRoot = $('#music-list');
  var playerBox = $('#player');
  var audioEl = $('#audio');
  var cur = 0, playing = false, elapsed = 0, timer = null;
  var localTracks = [];

  function srcOf(s) { return s && s.file ? s.file : ''; }
  function isAudio(f) { return /^audio\//.test(f.type) || /\.(mp3|m4a|aac|ogg|wav|flac)$/i.test(f.name); }
  function norm(s) {
    return String(s || '').toLowerCase().replace(/[\s_\-·．.,，、()（）\[\]【】!！?？'"]/g, '');
  }
  function songList() {
    var locals = localTracks.filter(function (t) { return !t.matched; }).map(function (t) {
      return {
        title: t.name.replace(/\.[^.]+$/, ''), artist: '本地导入', mood: '本地',
        dur: 0, line: '你自己导入的文件，只在这个浏览器里放，不会上传。',
        file: t.url, local: true, lid: t.id
      };
    });
    return (S.music || []).concat(locals);
  }

  /* ---- 本地音乐存 IndexedDB，刷新后还在 ---- */
  var DB_NAME = 'theo-music', STORE = 'tracks';
  function idbOpen(cb) {
    try {
      var req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' });
      };
      req.onsuccess = function () { cb(req.result); };
      req.onerror = function () { cb(null); };
    } catch (e) { cb(null); }
  }
  function loadLocal(after) {
    idbOpen(function (db) {
      if (!db) { after && after(); return; }
      var tx = db.transaction(STORE, 'readonly');
      var req = tx.objectStore(STORE).getAll();
      req.onsuccess = function () {
        localTracks = (req.result || []).map(function (rec) {
          return { id: rec.id, name: rec.name, url: URL.createObjectURL(rec.blob), matched: false };
        });
        bindLocal();
        after && after();
      };
      req.onerror = function () { after && after(); };
    });
  }
  // 文件名和歌单里的歌对得上就自动接上
  function bindLocal() {
    var used = {};
    (S.music || []).forEach(function (s) {
      var key = norm(s.title);
      if (!key) return;
      var hit = null;
      localTracks.forEach(function (t) {
        if (hit || used[t.id]) return;
        var n = norm(t.name.replace(/\.[^.]+$/, ''));
        if (n && (n.indexOf(key) >= 0 || key.indexOf(n) >= 0)) hit = t;
      });
      if (hit) { s.file = hit.url; hit.matched = true; used[hit.id] = 1; }
    });
  }
  function renderLocal() {
    var box = $('#local-list'), cnt = $('#local-count');
    if (cnt) cnt.textContent = localTracks.length ? ('已导入 ' + localTracks.length + ' 首') : '还没导入';
    if (!box) return;
    box.innerHTML = localTracks.length ? localTracks.map(function (t) {
      return '' +
        '<div class="filecard">' +
          '<div class="f-ico">MP3</div>' +
          '<div class="f-main">' +
            '<div class="f-name">' + esc(t.name) + '</div>' +
            '<div class="tiny">' + (t.matched ? '已接上歌单里的歌' : '单独可播') + '</div>' +
          '</div>' +
          '<div class="f-act">' +
            '<button class="btn btn-pink btn-sm" data-lplay="' + esc(t.id) + '">播放</button>' +
            '<button class="btn btn-ghost btn-sm" data-ldel="' + esc(t.id) + '">删除</button>' +
          '</div>' +
        '</div>';
    }).join('') : '<div class="empty">还没有导入文件</div>';
  }
  function importFiles(files) {
    var list = Array.prototype.filter.call(files || [], isAudio);
    if (!list.length) { alert('没识别到音频文件。MP3 / M4A / FLAC / WAV 都行。'); return; }
    idbOpen(function (db) {
      if (!db) { alert('这个浏览器不支持本地存储，导入的歌刷新后会丢。'); return; }
      var tx = db.transaction(STORE, 'readwrite');
      var st = tx.objectStore(STORE);
      list.forEach(function (f, i) {
        st.put({ id: 't' + Date.now() + '_' + i, name: f.name, blob: f, date: today() });
      });
      tx.oncomplete = function () {
        loadLocal(function () { renderLocal(); renderGenres(); renderList(); renderPlay(); });
      };
    });
  }
  function delLocal(id) {
    idbOpen(function (db) {
      if (!db) return;
      var tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE)['delete'](id);
      tx.oncomplete = function () { loadLocal(function () { renderLocal(); renderGenres(); renderList(); }); };
    });
  }
  function renderPlay() {
    if (!playerBox) return;
    var s = songList()[cur] || { title: '—', artist: '', mood: '', dur: 0, line: '' };
    var t = $('#np-title'); if (t) t.textContent = s.title;
    var m = $('#np-mode'); if (m) m.textContent = srcOf(s) ? '真实播放' : '无声演示';
    var ar = $('#np-artist'); if (ar) ar.textContent = s.artist + ' · ' + s.mood;
    var ln = $('#np-line'); if (ln) ln.textContent = s.line;
    $$('#music-list .item').forEach(function (el, i) {
      el.style.background = i === cur ? 'var(--glass-2)' : '';
      el.style.borderRadius = i === cur ? '14px' : '';
    });
    updateBar();
  }
  function totalDur(s) {
    if (srcOf(s) && audioEl && isFinite(audioEl.duration)) return audioEl.duration;
    return s.dur || 0;
  }
  function updateBar() {
    var s = songList()[cur] || { dur: 1 };
    var total = totalDur(s);
    var b = $('#np-bar-i');
    if (b) b.style.width = (total ? Math.min(100, (elapsed / total) * 100) : 0) + '%';
    var c = $('#np-cur'); if (c) c.textContent = fmt(elapsed);
    var tt = $('#np-total'); if (tt) tt.textContent = fmt(total);
  }
  function uiPlay(on) {
    playing = on;
    if (playerBox) playerBox.classList.toggle('playing', on);
    var ab = $('#np-album'); if (ab) ab.classList.toggle('spin', on);
    var btn = $('#play-btn'); if (btn) btn.textContent = on ? '暂停' : '播放';
  }
  function setPlaying(on) {
    var s = songList()[cur] || {};
    if (srcOf(s) && audioEl) {
      if (timer) { clearInterval(timer); timer = null; }
      if (on) {
        var p = audioEl.play();
        if (p && p.catch) p.catch(function () { uiPlay(false); });
        uiPlay(true);
      } else { audioEl.pause(); uiPlay(false); }
      return;
    }
    // 没接音频的歌：只走进度条，不出声
    if (audioEl) audioEl.pause();
    uiPlay(on);
    if (timer) { clearInterval(timer); timer = null; }
    if (on) {
      timer = setInterval(function () {
        var ss = songList()[cur] || { dur: 0 };
        elapsed++;
        if (elapsed >= (ss.dur || 0)) { nextSong(true); return; }
        updateBar();
      }, 1000);
    }
  }
  function playSong(i, autoplay) {
    cur = i;
    elapsed = 0;
    var s = songList()[cur] || {};
    if (audioEl) {
      if (srcOf(s)) { audioEl.src = srcOf(s); audioEl.currentTime = 0; }
      else { audioEl.pause(); audioEl.removeAttribute('src'); }
    }
    renderPlay();
    setPlaying(autoplay === undefined ? playing : !!autoplay);
  }
  function nextSong(auto) {
    var n = (cur + 1) % Math.max(1, songList().length);
    playSong(n, auto ? true : playing);
  }
  function prevSong() {
    var n = (cur - 1 + songList().length) % Math.max(1, songList().length);
    playSong(n, playing);
  }
  var activeGenre = 'all';

  function songItem(s, i) {
    return '' +
      '<article class="item" data-song="' + i + '" style="cursor:pointer">' +
        '<h3 style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap">' +
          '<span>' + esc(s.title) + '</span>' +
          '<span class="px">' + (srcOf(s) ? '能放' : '演示') + ' · ' + esc(s.mood) + '</span>' +
        '</h3>' +
        '<div class="meta">' + esc(s.artist) + '</div>' +
        '<p style="margin:4px 0 0;font-size:14px;color:var(--ink2)">' + esc(s.line) + '</p>' +
      '</article>';
  }
  function groupHtml(name, arr) {
    return '<div class="grp-head"><h3>' + esc(name) + '</h3>' +
      '<span class="tiny">' + arr.length + ' 首</span></div>' +
      arr.map(function (x) { return songItem(x.s, x.i); }).join('');
  }
  // 按风格分组；点上面的分类只显示那一组
  function renderList() {
    if (!playRoot) return;
    var list = songList();
    var byGenre = {};
    list.forEach(function (s, i) {
      var key = s.local ? '_local' : (s.genre || 'other');
      (byGenre[key] = byGenre[key] || []).push({ s: s, i: i });
    });
    var html = '';
    (S.genres || []).forEach(function (g) {
      if (g.id === 'all') return;
      var arr = byGenre[g.id] || [];
      if (!arr.length) return;
      if (activeGenre !== 'all' && activeGenre !== g.id) return;
      html += groupHtml(g.name, arr);
    });
    if (byGenre._local && (activeGenre === 'all' || activeGenre === '_local')) {
      html += groupHtml('本地导入', byGenre._local);
    }
    if (byGenre.other && activeGenre === 'all') html += groupHtml('其他', byGenre.other);
    playRoot.innerHTML = html || '<div class="empty">这个分类下还没有歌</div>';
  }
  function renderGenres() {
    var box = $('#music-genres');
    if (!box) return;
    var list = songList();
    box.innerHTML = (S.genres || []).map(function (g) {
      var n = g.id === 'all'
        ? list.length
        : list.filter(function (s) { return s.genre === g.id; }).length;
      if (g.id !== 'all' && !n) return '';
      return '<span class="tag tag-link' + (activeGenre === g.id ? ' on' : '') + '" data-genre="' + esc(g.id) + '">' +
        esc(g.name) + ' ' + n + '</span>';
    }).join('');
  }

  if (playRoot) {
    renderList();
    playRoot.addEventListener('click', function (e) {
      var el = e.target.closest('[data-song]');
      if (el) playSong(+el.getAttribute('data-song'), true);
    });
  }
  var genreBox = $('#music-genres');
  if (genreBox) {
    genreBox.addEventListener('click', function (e) {
      var el = e.target.closest('[data-genre]');
      if (!el) return;
      activeGenre = el.getAttribute('data-genre');
      renderGenres();
      renderList();
    });
    renderGenres();
  }
  var playBtn = $('#play-btn');
  if (playBtn) playBtn.addEventListener('click', function () { setPlaying(!playing); });
  var nextBtn = $('#next-btn');
  if (nextBtn) nextBtn.addEventListener('click', function () { nextSong(false); });
  var prevBtn = $('#prev-btn');
  if (prevBtn) prevBtn.addEventListener('click', prevSong);

  if (audioEl) {
    audioEl.volume = 0.9;
    audioEl.addEventListener('timeupdate', function () {
      var s = songList()[cur] || {};
      if (!srcOf(s)) return;
      elapsed = audioEl.currentTime;
      updateBar();
    });
    audioEl.addEventListener('loadedmetadata', updateBar);
    audioEl.addEventListener('ended', function () { nextSong(true); });
    audioEl.addEventListener('error', function () {
      var s = songList()[cur] || {};
      if (srcOf(s)) { s.file = ''; renderList(); renderPlay(); }
    });
  }
  var volEl = $('#vol');
  if (volEl && audioEl) volEl.addEventListener('input', function () { audioEl.volume = parseFloat(volEl.value); });
  var pbar = $('#np-bar');
  if (pbar && audioEl) {
    pbar.addEventListener('click', function (e) {
      var s = songList()[cur] || {};
      if (!srcOf(s) || !audioEl.duration) return;
      var r = pbar.getBoundingClientRect();
      audioEl.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * audioEl.duration;
      updateBar();
    });
  }

  /* 导入本地音乐：按钮 + 拖文件进来 */
  var impBtn = $('#import-music'), impInput = $('#music-file');
  if (impBtn && impInput) {
    impBtn.addEventListener('click', function () { impInput.click(); });
    impInput.addEventListener('change', function () {
      importFiles(impInput.files);
      impInput.value = '';
    });
  }
  var localBox = $('#local-list');
  if (localBox) {
    localBox.addEventListener('click', function (e) {
      var lp = e.target.closest('[data-lplay]');
      if (lp) {
        var id = lp.getAttribute('data-lplay'), hit = null;
        localTracks.forEach(function (t) { if (t.id === id) hit = t; });
        if (hit) {
          var list = songList(), idx = -1;
          list.forEach(function (s, i) { if (s.lid === id || s.file === hit.url) idx = idx < 0 ? i : idx; });
          playSong(idx < 0 ? 0 : idx, true);
        }
        return;
      }
      var ld = e.target.closest('[data-ldel]');
      if (ld && confirm('把这个文件从本地音乐里删掉？')) delLocal(ld.getAttribute('data-ldel'));
    });
  }
  if (playerBox) {
    ['dragenter', 'dragover'].forEach(function (ev) {
      document.addEventListener(ev, function (e) { e.preventDefault(); });
    });
    document.addEventListener('drop', function (e) {
      if (!e.dataTransfer || !e.dataTransfer.files || !e.dataTransfer.files.length) return;
      e.preventDefault();
      importFiles(e.dataTransfer.files);
    });
    loadLocal(function () { renderLocal(); renderGenres(); renderList(); renderPlay(); });
    renderPlay();
    uiPlay(false);
  }

  var homeMusic = $('#home-music');
  if (homeMusic) {
    homeMusic.innerHTML = songList().slice(0, 2).map(function (s) {
      return '<article class="item"><h3>' + esc(s.title) + '</h3>' +
        '<div class="meta">' + esc(s.artist) + ' · ' + esc(s.mood) + '</div>' +
        '<p style="margin:4px 0 0;font-size:14px;color:var(--ink2)">' + esc(s.line) + '</p></article>';
    }).join('');
  }

  /* ---------------- 学习模块：经验投稿 ---------------- */
  var P = 'posts:v1', C = 'comments:v1', L = 'likes:v1';

  function findPost(id) {
    var hit = null;
    (S.experiences || []).forEach(function (e) { if (e.id === id) hit = e; });
    if (!hit) store(P, []).forEach(function (e) { if (e.id === id) hit = e; });
    return hit;
  }
  function catClass(cat) {
    var map = { '备考': 'btn-pink', '方法': 'btn-violet', '心态': 'btn-ghost', '资源': 'btn-teal' };
    return map[cat] || 'btn-ghost';
  }
  function expCard(e, mine) {
    var liked = store(L, {})[e.id] ? 1 : 0;
    return '' +
      '<article class="item" data-post="' + esc(e.id) + '">' +
        '<h3>' + esc(e.title) + (mine ? ' <span class="tag">我的投稿</span>' : '') + '</h3>' +
        '<div class="meta">' + esc(e.author) + ' · ' + esc(e.date) + ' · <span class="tag ' + catClass(e.cat) + '">' + esc(e.cat || '经验') + '</span></div>' +
        '<p style="margin:6px 0 8px">' + esc(e.summary) + '</p>' +
        '<div class="note-body">' + paras(e.body) + '</div>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">' +
          '<button class="btn btn-sm btn-ghost" data-toggle="post">展开全文</button>' +
          '<button class="btn btn-sm btn-pink" data-like="' + esc(e.id) + '">赞 ' + ((e.likes || 0) + liked) + '</button>' +
          '<button class="btn btn-sm btn-violet" data-cmt-toggle="' + esc(e.id) + '">评论</button>' +
          (mine ? '<button class="btn btn-sm btn-ghost" data-del="' + esc(e.id) + '">删除</button>' : '') +
        '</div>' +
        '<div class="cmt" data-cmt="' + esc(e.id) + '" style="display:none;margin-top:12px">' +
          '<div class="cmt-list"></div>' +
          '<div class="field" style="margin-top:10px"><label class="lb">你的名字</label>' +
            '<input class="inp" type="text" data-cmt-name="' + esc(e.id) + '" placeholder="匿名同学"></div>' +
          '<div class="field"><label class="lb">说点什么</label>' +
            '<textarea class="ta" style="min-height:72px" data-cmt-text="' + esc(e.id) + '" placeholder="交流一下你的做法吧"></textarea></div>' +
          '<button class="btn btn-sm btn-teal" data-cmt-send="' + esc(e.id) + '">发送评论</button>' +
        '</div>' +
      '</article>';
  }
  function renderComments(pid) {
    var box = $('[data-cmt="' + pid + '"]');
    if (!box) return;
    var list = store(C, {})[pid] || [];
    $('.cmt-list', box).innerHTML = list.length ? list.map(function (c) {
      return '<div class="bubble"><div class="who">' + esc(c.author) + ' · ' + esc(c.date) + '</div>' + esc(c.text) + '</div>';
    }).join('') : '<div class="tiny">还没有评论，来说第一句</div>';
  }
  var expRoot = $('#exp-list'), myRoot = $('#my-posts');
  function renderExp() {
    var mine = store(P, []).slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    if (expRoot) expRoot.innerHTML = (S.experiences || []).map(function (e) { return expCard(e, false); }).join('');
    if (myRoot) {
      myRoot.innerHTML = mine.length ? mine.map(function (e) { return expCard(e, true); }).join('')
        : '<div class="empty">还没有投稿，用下面的表单写一篇吧</div>';
      var mc = $('#my-count');
      if (mc) mc.textContent = mine.length;
    }
    $$('[data-cmt]').forEach(function (box) { renderComments(box.getAttribute('data-cmt')); });
  }

  document.addEventListener('click', function (e) {
    var t = e.target;

    var tg = t.closest('[data-toggle]');
    if (tg) {
      var art = tg.closest('article');
      var box = art ? art.querySelector('.note-body') : null;
      if (box) {
        box.classList.toggle('open');
        tg.textContent = box.classList.contains('open') ? '收起' : '展开全文';
      }
      return;
    }

    var lk = t.closest('[data-like]');
    if (lk) {
      var id = lk.getAttribute('data-like');
      var likes = store(L, {});
      likes[id] = !likes[id];
      save(L, likes);
      var base = (findPost(id) || {}).likes || 0;
      lk.textContent = '赞 ' + (base + (likes[id] ? 1 : 0));
      return;
    }

    var ct = t.closest('[data-cmt-toggle]');
    if (ct) {
      var cbox = $('[data-cmt="' + ct.getAttribute('data-cmt-toggle') + '"]');
      if (cbox) {
        var open = cbox.style.display !== 'none';
        cbox.style.display = open ? 'none' : 'block';
        ct.textContent = open ? '评论' : '收起评论';
      }
      return;
    }

    var sd = t.closest('[data-cmt-send]');
    if (sd) {
      var sid = sd.getAttribute('data-cmt-send');
      var name = $('[data-cmt-name="' + sid + '"]').value.trim() || '匿名同学';
      var text = $('[data-cmt-text="' + sid + '"]').value.trim();
      if (!text) { alert('写点什么再发送吧'); return; }
      var all = store(C, {});
      all[sid] = (all[sid] || []).concat([{ author: name, text: text, date: today() }]);
      save(C, all);
      $('[data-cmt-text="' + sid + '"]').value = '';
      renderComments(sid);
      return;
    }

    var dl = t.closest('[data-del]');
    if (dl) {
      var did = dl.getAttribute('data-del');
      if (!confirm('确定删除这篇投稿？此操作不可撤销。')) return;
      save(P, store(P, []).filter(function (x) { return x.id !== did; }));
      renderExp();
      return;
    }

    var rd = t.closest('[data-rdel]');
    if (rd) {
      var rid = rd.getAttribute('data-rdel');
      if (!confirm('删掉这条感想？')) return;
      save(R, store(R, []).filter(function (x) { return x.id !== rid; }));
      renderPlans();
      return;
    }
  });

  var form = $('#post-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var title = $('#p-title').value.trim();
      var author = $('#p-author').value.trim() || '匿名同学';
      var cat = $('#p-cat').value;
      var summary = $('#p-summary').value.trim();
      var body = $('#p-body').value.trim();
      if (!title || !summary) { alert('标题和一句话摘要要填哦'); return; }
      var list = store(P, []);
      list.push({
        id: 'u' + Date.now(), title: title, author: author, cat: cat,
        date: today(), likes: 0, summary: summary,
        body: body ? body.split(/\n+/).filter(Boolean) : []
      });
      save(P, list);
      form.reset();
      renderExp();
      var ok = $('#post-ok');
      ok.style.display = 'block';
      setTimeout(function () { ok.style.display = 'none'; }, 2600);
    });
  }
  var expBtn = $('#export-btn');
  if (expBtn) {
    expBtn.addEventListener('click', function () {
      var data = { posts: store(P, []), comments: store(C, {}), likes: store(L, {}), checkin: store(CK, {}), reflections: store(R, []) };
      var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'theo-site-backup-' + today() + '.json';
      a.click();
      URL.revokeObjectURL(a.href);
    });
  }
  var impBtn = $('#import-btn');
  if (impBtn) impBtn.addEventListener('click', function () { $('#import-file').click(); });
  var impFile = $('#import-file');
  if (impFile) {
    impFile.addEventListener('change', function () {
      var f = impFile.files[0];
      if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var d = JSON.parse(r.result);
          if (d.posts) save(P, d.posts);
          if (d.comments) save(C, d.comments);
          if (d.likes) save(L, d.likes);
          if (d.checkin) save(CK, d.checkin);
          if (d.reflections) save(R, d.reflections);
          ckRender(); renderExp(); renderPlans();
          alert('数据已导入');
        } catch (err) { alert('文件格式不对，导入失败'); }
      };
      r.readAsText(f);
      impFile.value = '';
    });
  }
  if (expRoot || myRoot) renderExp();

  /* ---------------- 关于页技能条 ---------------- */
  var skillRoot = $('#skills');
  if (skillRoot) {
    skillRoot.innerHTML = (S.skills || []).map(function (s) {
      return '' +
        '<div style="margin-bottom:14px">' +
          '<div style="display:flex;justify-content:space-between;font-size:13px;color:var(--ink2)">' +
            '<span>' + esc(s.name) + '</span><span>LV ' + Math.round(s.lv / 10) + ' · ' + s.lv + '%</span>' +
          '</div>' +
          '<div class="bar"><i style="width:' + s.lv + '%"></i></div>' +
        '</div>';
    }).join('');
  }
})();
