(function () {
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  document.documentElement.classList.add('js');

  // mobile menu
  var nav = $('.nav'), burger = $('.burger');
  burger.addEventListener('click', function () { burger.setAttribute('aria-expanded', nav.classList.toggle('open')); });
  $$('.nav a').forEach(function (a) {
    a.addEventListener('click', function () { nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); });
  });

  // sections fade in while scrolling
  var items = $$('.sh, .gal img, .row, .about > *, .contact > *');
  items.forEach(function (el) { el.classList.add('rv'); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else items.forEach(function (el) { el.classList.add('in'); });

  // the map connects to Google only after a click
  var btn = $('#load-map'), map = $('#map');
  btn.addEventListener('click', function () {
    var f = document.createElement('iframe');
    f.src = 'https://maps.google.com/maps?q=Kerkstraat,+Tiel&z=15&output=embed';
    f.title = 'Map: Kerkstraat, Tiel';
    f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    map.appendChild(f);
    map.classList.add('on');
  });

  var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();
})();
