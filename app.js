(function () {
  var root = document.documentElement;

  // ---- language -----------------------------------------------------------
  function setLang(l) {
    root.lang = l;
    try { localStorage.setItem('lang', l); } catch (e) {}
    document.querySelectorAll('[data-set-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.setLang === l));
    });
  }
  var saved = null;
  try { saved = localStorage.getItem('lang'); } catch (e) {}
  setLang(saved || ((navigator.language || '').indexOf('ko') === 0 ? 'ko' : 'en'));
  document.querySelectorAll('[data-set-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.dataset.setLang); });
  });

  // ---- archive ------------------------------------------------------------
  var archive = document.getElementById('archive');
  if (!archive) return;

  var EN_MONTHS = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function t(o, l) { return (o && o[l]) || ''; }
  // a node holding both languages; CSS shows the active one
  function bi(tag, ko, en) {
    var n = el(tag);
    n.appendChild(el('span', 'ko', ko));
    n.appendChild(el('span', 'en', en));
    return n;
  }
  function dateLabel(iso, l) {
    var p = iso.split('-'), y = p[0], m = +p[1], d = +p[2];
    return l === 'ko' ? y + '. ' + m + '. ' + d : EN_MONTHS[m - 1] + ' ' + d + ', ' + y;
  }
  function headline(x, l) {
    var parts = [t(x.venue, l), t(x.city, l), t(x.kind, l)].filter(Boolean).join(', ');
    var title = t(x.title, l);
    if (title) parts += (parts ? ', ' : '') + (l === 'ko' ? '《' + title + '》' : '“' + title + '”');
    return dateLabel(x.date, l) + '    ' + parts;
  }


  // ---- enlarged view ------------------------------------------------------
  var box = el('div', 'lightbox');
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  var bigImg = el('img');
  var cap = el('div', 'cap');
  var bClose = el('button', 'close', '✕'); bClose.type = 'button'; bClose.setAttribute('aria-label', 'close');
  var bPrev = el('button', 'prev', '‹'); bPrev.type = 'button'; bPrev.setAttribute('aria-label', 'previous');
  var bNext = el('button', 'next', '›'); bNext.type = 'button'; bNext.setAttribute('aria-label', 'next');
  [bClose, bPrev, bNext, bigImg, cap].forEach(function (n) { box.appendChild(n); });
  document.body.appendChild(box);

  var cur = [], idx = 0, opener = null;
  function show(i) {
    idx = (i + cur.length) % cur.length;
    var im = cur[idx];
    bigImg.src = im.src;
    bigImg.alt = t(im.caption, 'en') || t(im.caption, 'ko');
    cap.textContent = '';
    if (im.caption) {
      cap.appendChild(el('span', 'ko', t(im.caption, 'ko')));
      cap.appendChild(el('span', 'en', t(im.caption, 'en')));
    }
    var one = cur.length < 2;
    bPrev.hidden = bNext.hidden = one;
  }
  function openBox(list, i, from) {
    cur = list; opener = from;
    show(i);
    box.classList.add('open');
    document.body.classList.add('locked');
    bClose.focus();
  }
  function closeBox() {
    box.classList.remove('open');
    document.body.classList.remove('locked');
    bigImg.removeAttribute('src');
    if (opener) opener.focus();
  }
  bClose.addEventListener('click', closeBox);
  bPrev.addEventListener('click', function () { show(idx - 1); });
  bNext.addEventListener('click', function () { show(idx + 1); });
  box.addEventListener('click', function (e) { if (e.target === box) closeBox(); });
  document.addEventListener('keydown', function (e) {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') closeBox();
    else if (e.key === 'ArrowLeft') show(idx - 1);
    else if (e.key === 'ArrowRight') show(idx + 1);
  });

  fetch('data/exhibitions.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      data.exhibitions
        .slice()
        .sort(function (a, b) { return a.date < b.date ? 1 : -1; })
        .forEach(function (x) {
          var s = el('section', 'entry');
          s.id = x.id || x.date;
          var h = bi('h2', headline(x, 'ko'), headline(x, 'en'));
          h.className = 'entry-head';
          s.appendChild(h);

          if (x.credits && x.credits.length) {
            var c = el('div', 'credits');
            x.credits.forEach(function (line) { c.appendChild(bi('p', t(line, 'ko'), t(line, 'en'))); });
            s.appendChild(c);
          }
          var imgs = x.images || [];
          if (imgs.length) {
            var g = el('div', 'grid');
            imgs.forEach(function (im, i) {
              var b = el('button', 'thumb');
              b.type = 'button';
              var img = el('img');
              img.src = im.thumb || im.src;
              img.alt = t(im.caption, 'en') || t(im.caption, 'ko');
              img.loading = 'lazy';
              img.decoding = 'async';
              b.appendChild(img);
              b.addEventListener('click', function () { openBox(imgs, i, b); });
              g.appendChild(b);
            });
            s.appendChild(g);
          }
          archive.appendChild(s);
        });
    })
    .catch(function () {
      archive.appendChild(bi('p', '데이터를 불러오지 못했습니다.', 'Could not load the archive.'));
    });
})();
