/* =========================================================
   BOOT SEQUENCE
========================================================= */
const bootScreen = document.getElementById('boot-screen');
const bootText = document.getElementById('boot-text');
const bootLines = [
  '> booting portfolio_os v2.6...',
  '> loading design assets... OK',
  '> mounting /work, /skills, /about...',
  '> ACCESS GRANTED'
];

(function runBoot(){
  let li = 0, ci = 0;
  let output = '';

  function typeBoot(){
    if(li >= bootLines.length){
      setTimeout(() => bootScreen.classList.add('hidden'), 350);
      return;
    }
    const line = bootLines[li];
    if(ci < line.length){
      output += line[ci];
      bootText.textContent = output;
      ci++;
      setTimeout(typeBoot, 14);
    } else {
      output += '\n';
      li++; ci = 0;
      setTimeout(typeBoot, 180);
    }
  }
  typeBoot();
})();

/* =========================================================
   HERO TYPING EFFECT
========================================================= */
const NAME = 'Tanvin Ahmed';
const ROLE = 'UI/UX & Product Designer — turning ambiguity into clean, usable interfaces.';

function typeInto(el, text, speed, cursorClass, done){
  let i = 0;
  el.innerHTML = '';
  const span = document.createElement('span');
  span.textContent = '';
  el.appendChild(span);
  const cursor = document.createElement('span');
  cursor.className = cursorClass;
  cursor.textContent = '▍';
  el.appendChild(cursor);

  (function step(){
    if(i < text.length){
      span.textContent += text[i];
      i++;
      setTimeout(step, speed);
    } else if(done){
      done();
    }
  })();
}

window.addEventListener('load', () => {
  setTimeout(() => {
    const nameEl = document.getElementById('typedName');
    const roleEl = document.getElementById('typedRole');
    typeInto(nameEl, NAME, 70, 'cursor', () => {
      setTimeout(() => {
        typeInto(roleEl, ROLE, 24, 'cursor-inline');
      }, 200);
    });
  }, 1400);
});

/* =========================================================
   LIGHT / DARK MODE TOGGLE
========================================================= */
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle?.querySelector('.theme-icon');

function applyTheme(theme){
  if(theme === 'light'){
    document.documentElement.setAttribute('data-theme', 'light');
    if(themeIcon) themeIcon.textContent = '☾';
  } else {
    document.documentElement.removeAttribute('data-theme');
    if(themeIcon) themeIcon.textContent = '☀';
  }
}

// Respect a saved choice, otherwise fall back to normal (dark) mode
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
applyTheme(savedTheme);

themeToggle?.addEventListener('click', () => {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const next = isLight ? 'dark' : 'light';
  applyTheme(next);
  localStorage.setItem('portfolio-theme', next);
});

/* =========================================================
   MOBILE MENU
========================================================= */
const menuBtn = document.getElementById('menuBtn');
const navEl = document.querySelector('.nav');
menuBtn?.addEventListener('click', () => navEl.classList.toggle('open'));
document.querySelectorAll('.nav-tabs .tab').forEach(t => {
  t.addEventListener('click', () => navEl.classList.remove('open'));
});

/* Active tab highlight on scroll */
const sections = document.querySelectorAll('main .section, main .hero');
const tabs = document.querySelectorAll('.nav-tabs .tab');
const tabObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const id = entry.target.getAttribute('id');
      tabs.forEach(t => t.classList.toggle('active', t.getAttribute('href') === '#' + id));
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });
sections.forEach(s => { if(s.id) tabObserver.observe(s); });

/* =========================================================
   SCROLL REVEAL
========================================================= */
document.querySelectorAll('.section, .project-card, .pipeline-step').forEach(el => {
  el.classList.add('reveal');
});
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* =========================================================
   PROJECT CARDS — expand/collapse
========================================================= */
document.querySelectorAll('.project-card').forEach(card => {
  const head = card.querySelector('.project-head');
  function toggle(){
    const isOpen = card.classList.contains('open');
    document.querySelectorAll('.project-card.open').forEach(c => { if(c !== card) c.classList.remove('open'); });
    card.classList.toggle('open', !isOpen);
  }
  head.addEventListener('click', toggle);
  card.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggle(); }
  });
});
// Open first project by default
document.querySelector('.project-card')?.classList.add('open');

/* =========================================================
   SKILL BARS — animate on view
========================================================= */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const bars = entry.target.querySelectorAll('.skill-bar');
      bars.forEach(bar => {
        const level = bar.getAttribute('data-level');
        const fill = bar.querySelector('.bar-fill');
        requestAnimationFrame(() => { fill.style.width = level + '%'; });
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
const skillsGrid = document.querySelector('.skills-grid');
if(skillsGrid) skillObserver.observe(skillsGrid);

/* =========================================================
   CONTACT FORM — submits to a Google Sheet via SheetDB
   ---------------------------------------------------------
   SETUP (one-time, ~5 minutes, free):
   1. Create a Google Sheet with header row: name | email | message | date
   2. Go to https://sheetdb.io, sign up free, click "Create API",
      connect it to that Google Sheet.
   3. Copy the API URL it gives you (looks like
      "https://sheetdb.io/api/v1/xxxxxxxxxxxxx") and paste it below,
      replacing the empty string.
   Until you paste a real URL, the form will just show a friendly
   message instead of actually submitting anywhere.
========================================================= */
const SHEETDB_API_URL = ''; // <-- PASTE your SheetDB API URL here

const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if(!name || !email || !message){
    status.textContent = 'Please fill in every field.';
    return;
  }

  if(!SHEETDB_API_URL){
    status.textContent = 'Form is ready — connect SHEETDB_API_URL in script.js to start receiving messages in your spreadsheet.';
    return;
  }

  status.textContent = 'Sending...';
  try{
    const res = await fetch(SHEETDB_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [{ name, email, message, date: new Date().toISOString() }]
      })
    });
    if(!res.ok) throw new Error('Request failed');
    status.textContent = 'Thanks, ' + name + ' — your message has been sent!';
    form.reset();
  } catch(err){
    status.textContent = 'Something went wrong — please email tanbinahmed51@gmail.com directly.';
  }
});

/* =========================================================
   FOOTER YEAR
========================================================= */
document.getElementById('year').textContent = new Date().getFullYear();

/* =========================================================
   MATRIX RAIN CANVAS (signature ambient element)
========================================================= */
const canvas = document.getElementById('rain');
const ctx = canvas.getContext('2d');
let rainOn = true;
let columns, drops, fontSize;
const glyphs = 'アカサタナハマヤラワ01<>[]{}/\\+*=%$#01UX01';

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = document.documentElement.scrollHeight;
  fontSize = window.innerWidth < 700 ? 14 : 16;
  columns = Math.floor(canvas.width / fontSize);
  drops = new Array(columns).fill(0).map(() => Math.floor(Math.random() * -100));
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let mouseX = -1000, mouseY = -1000;
window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY + window.scrollY;
});

function drawRain(){
  if(!rainOn){ requestAnimationFrame(drawRain); return; }
  ctx.fillStyle = 'rgba(6,10,7,0.08)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = fontSize + 'px monospace';

  for(let i = 0; i < drops.length; i++){
    const x = i * fontSize;
    const y = drops[i] * fontSize;
    const glyph = glyphs[Math.floor(Math.random() * glyphs.length)];

    const dist = Math.hypot(x - mouseX, y - mouseY);
    if(dist < 90){
      ctx.fillStyle = '#c8ffe0';
      ctx.shadowColor = '#39ff14';
      ctx.shadowBlur = 12;
    } else {
      ctx.fillStyle = 'rgba(57,255,20,0.75)';
      ctx.shadowBlur = 0;
    }
    ctx.fillText(glyph, x, y);
    ctx.shadowBlur = 0;

    if(y > canvas.height && Math.random() > 0.975){
      drops[i] = 0;
    }
    drops[i]++;
  }
  requestAnimationFrame(drawRain);
}
requestAnimationFrame(drawRain);

const rainToggle = document.getElementById('rainToggle');
rainToggle?.addEventListener('click', () => {
  rainOn = !rainOn;
  rainToggle.textContent = 'rain: ' + (rainOn ? 'on' : 'off');
  rainToggle.setAttribute('aria-pressed', String(rainOn));
  canvas.style.opacity = rainOn ? '0.14' : '0';
});

/* Recalculate canvas height if content changes size */
window.addEventListener('load', resizeCanvas);
