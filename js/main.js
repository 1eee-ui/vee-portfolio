(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // header border after scrolling + mobile menu
  var top = $('.top'), nav = $('.nav'), burger = $('.burger');
  addEventListener('scroll', function () { top.classList.toggle('scrolled', scrollY > 10); }, { passive: true });
  burger.addEventListener('click', function () {
    burger.setAttribute('aria-expanded', nav.classList.toggle('open'));
  });
  $$('.nav a').forEach(function (a) {
    a.addEventListener('click', function () { nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); });
  });

  // highlight the menu item of the section on screen
  // the active item is the last section whose top has passed 40% of the screen
  var links = $$('.nav a');
  var secs = links.map(function (a) { return a.getAttribute('href').slice(1); })
    .filter(function (id) { return id !== 'top'; })
    .map(function (id) { return document.getElementById(id); }).filter(Boolean)
    .sort(function (a, b) { return a.offsetTop - b.offsetTop; });
  function spy() {
    var cur = 'top', line = innerHeight * 0.4;
    secs.forEach(function (s) { if (s.getBoundingClientRect().top < line) cur = s.id; });
    links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + cur); });
  }
  addEventListener('scroll', spy, { passive: true }); spy();

  // reveal on scroll, staggered inside grids
  $$('.skills,.folders,.why,.plans,.vsteps,.qs,.side').forEach(function (g) {
    $$('.reveal', g).forEach(function (el, i) { el.style.setProperty('--d', (i * 0.08) + 's'); });
  });
  var items = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else items.forEach(function (el) { el.classList.add('in'); });

  // "90+" counts up when it comes into view
  var stat = $('[data-count]');
  if (stat && !reduce && 'IntersectionObserver' in window) {
    var to = +stat.dataset.count, done = false;
    new IntersectionObserver(function (en, ob) {
      if (!en[0].isIntersecting || done) return; done = true; ob.disconnect();
      var t0 = null;
      requestAnimationFrame(function step(t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / 1300, 1);
        stat.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + (p === 1 ? '+' : '');
        if (p < 1) requestAnimationFrame(step);
      });
    }, { threshold: 0.6 }).observe(stat);
  }

  // project folders: each opens a window with the projects from <template id="projects">
  // whose data-cats include that folder. Counts on the folders are calculated from the same list.
  var tpl = $('#projects'), modal = $('#folder-modal');
  var all = tpl ? $$('[data-cats]', tpl.content) : [];
  function inFolder(key) { return all.filter(function (p) { return p.dataset.cats.split(' ').indexOf(key) > -1; }); }
  $$('.folder').forEach(function (f) {
    var n = inFolder(f.dataset.f).length;
    $('.count', f).textContent = n ? n + (n === 1 ? ' project' : ' projects') : 'soon';
    f.addEventListener('click', function () {
      var list = inFolder(f.dataset.f), body = $('.modal-body', modal);
      $('#modal-title').innerHTML = $('b', f).innerHTML.replace(/<br\s*\/?>/g, ' ');
      body.innerHTML = '';
      list.forEach(function (p) { body.appendChild(p.cloneNode(true)); });
      if (!list.length) body.innerHTML = '<div class="soon"><h3>Coming <span class="serif acc">soon</span></h3>' +
        '<p>No projects in this folder yet — this is exactly the kind of work I take on. Want yours to be the first?</p>' +
        '<a class="btn" href="#contact" data-close>Start a project</a></div>';
      if (modal.showModal) modal.showModal(); else modal.setAttribute('open', '');
    });
  });
  if (modal) {
    var close = function () { if (modal.close) modal.close(); else modal.removeAttribute('open'); };
    $('.close', modal).addEventListener('click', close);
    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.hasAttribute('data-close')) close();   // click outside or on "Start a project"
    });
  }

  var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();
})();

// on phones there is no hover: the step in the middle of the screen turns pink
(function () {
  var steps = Array.prototype.slice.call(document.querySelectorAll('.vstep'));
  if (!steps.length || matchMedia('(hover: hover)').matches) return;
  function pick() {
    var mid = innerHeight / 2, best = null, dist = Infinity;
    steps.forEach(function (s) {
      var r = s.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - mid);
      if (r.bottom > 0 && r.top < innerHeight && d < dist) { dist = d; best = s; }
    });
    steps.forEach(function (s) { s.classList.toggle('on', s === best); });
  }
  addEventListener('scroll', pick, { passive: true }); pick();
})();

// the e-mail address under the buttons is copied on click (works without a mail app)
(function () {
  var m = document.querySelector('[data-copy]');
  if (!m || !navigator.clipboard) return;
  m.addEventListener('click', function (e) {
    e.preventDefault();
    var text = m.dataset.copy;
    navigator.clipboard.writeText(text).then(function () {
      m.textContent = 'Copied \u2713';
      setTimeout(function () { m.textContent = text; }, 1600);
    }, function () { location.href = m.href; });
  });
})();
