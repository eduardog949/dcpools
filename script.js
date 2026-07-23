(function(){
  // ---- Sticky nav shadow on scroll ----
  var nav = document.getElementById('siteNav');
  window.addEventListener('scroll', function(){
    nav.classList.toggle('scrolled', window.scrollY > 10);
  });

  // ---- Mobile nav toggle ----
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  toggle.addEventListener('click', function(){
    var open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  links.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ---- Active link highlighting on scroll ----
  var sections = ['home','services','about','gallery','reviews','quote'].map(function(id){
    return document.getElementById(id);
  }).filter(Boolean);
  var navAnchors = Array.prototype.slice.call(links.querySelectorAll('a[href^="#"]'));

  function onScrollSpy(){
    var scrollPos = window.scrollY + 120;
    var current = sections[0];
    sections.forEach(function(sec){
      if (sec.offsetTop <= scrollPos) current = sec;
    });
    navAnchors.forEach(function(a){
      var match = a.getAttribute('href') === '#' + current.id;
      a.classList.toggle('active', match);
    });
  }
  window.addEventListener('scroll', onScrollSpy);
  onScrollSpy();

  // ---- Rotating hero banner ----
  var slides = document.querySelectorAll('.hero-slide');
  var dotsWrap = document.getElementById('heroDots');
  var current = 0;
  var timer;

  slides.forEach(function(_, i){
    var dot = document.createElement('button');
    dot.setAttribute('aria-label', 'Show project photo ' + (i + 1));
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', function(){ goTo(i); resetTimer(); });
    dotsWrap.appendChild(dot);
  });
  var dots = dotsWrap.querySelectorAll('button');

  function goTo(index){
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }
  function next(){ goTo((current + 1) % slides.length); }
  function resetTimer(){
    clearInterval(timer);
    timer = setInterval(next, 5500);
  }
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) resetTimer();

  // ---- Ripple effect on primary buttons ----
  document.querySelectorAll('[data-ripple]').forEach(function(btn){
    btn.addEventListener('click', function(e){
      var rect = btn.getBoundingClientRect();
      var span = document.createElement('span');
      span.className = 'ripple';
      var size = Math.max(rect.width, rect.height);
      span.style.width = span.style.height = size + 'px';
      span.style.left = (e.clientX - rect.left - size / 2) + 'px';
      span.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(span);
      setTimeout(function(){ span.remove(); }, 650);
    });
  });

  // ---- Netlify AJAX form submit (stays on page, shows inline message) ----
  var form = document.getElementById('quoteForm');
  var status = document.getElementById('formStatus');

  function encode(data){
    return Object.keys(data).map(function(key){
      return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
    }).join('&');
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var formData = new FormData(form);
    var payload = {};
    formData.forEach(function(value, key){ payload[key] = value; });

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode(payload)
    }).then(function(){
      status.textContent = "Thanks — your request is in. We'll be in touch within one business day.";
      status.className = 'form-status visible success';
      form.reset();
    }).catch(function(){
      status.textContent = "Something went wrong sending that. Please call or email us directly.";
      status.className = 'form-status visible error';
    });
  });

  // ---- Footer year ----
  document.getElementById('year').textContent = new Date().getFullYear();
})();
