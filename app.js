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
          (x.images || []).forEach(function (im) {
            var f = el('figure');
            var img = el('img');
            img.src = im.src;
            img.alt = t(im.caption, 'en') || t(im.caption, 'ko');
            img.loading = 'lazy';
            img.decoding = 'async';
            f.appendChild(img);
            if (im.caption) f.appendChild(bi('figcaption', t(im.caption, 'ko'), t(im.caption, 'en')));
            s.appendChild(f);
          });
          archive.appendChild(s);
        });
    })
    .catch(function () {
      archive.appendChild(bi('p', '데이터를 불러오지 못했습니다.', 'Could not load the archive.'));
    });
})();
