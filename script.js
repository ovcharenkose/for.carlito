// ===== Кнопка "No" на странице 2: убегает + звук =====
const noBtn = document.getElementById('noBtn');
const noSound = document.getElementById('noSound');

if (noBtn) {
  let scale = 1;

  // Ставим кнопку "No" изначально рядом с "Yes"
  function placeInitial() {
    const yesBtn = document.querySelector('.answer-btn:not(.no-btn)');
    if (yesBtn) {
      const rect = yesBtn.getBoundingClientRect();
      noBtn.style.left = (rect.right + 18) + 'px';
      noBtn.style.top = rect.top + 'px';
    }
  }

  // Двигаем кнопку в случайное место в пределах экрана
  function moveNo() {
    const btnW = noBtn.offsetWidth || 100;
    const btnH = noBtn.offsetHeight || 56;
    const pad = 12;

    const maxX = window.innerWidth  - btnW - pad;
    const maxY = window.innerHeight - btnH - pad;

    const x = pad + Math.random() * Math.max(0, maxX - pad);
    const y = pad + Math.random() * Math.max(0, maxY - pad);

    noBtn.style.left = x + 'px';
    noBtn.style.top  = y + 'px';
  }

  function handleNo() {
    // звук
    if (noSound) {
      try {
        noSound.currentTime = 0;
        noSound.play().catch(() => {});
      } catch (e) {}
    }
    // уменьшение (не меньше 30%)
    scale = Math.max(0.1, scale - 0.4);
    noBtn.style.transform = `scale(${scale})`;
    // убегание
    moveNo();
  }

  noBtn.addEventListener('click', handleNo);
  noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleNo();
  }, { passive: false });

  // При повороте экрана не даём кнопке улететь за край
  window.addEventListener('resize', () => {
    if (!noBtn.style.left) return;
    const btnW = noBtn.offsetWidth, btnH = noBtn.offsetHeight;
    const x = Math.min(parseFloat(noBtn.style.left) || 0, window.innerWidth  - btnW - 12);
    const y = Math.min(parseFloat(noBtn.style.top)  || 0, window.innerHeight - btnH - 12);
    noBtn.style.left = Math.max(12, x) + 'px';
    noBtn.style.top  = Math.max(12, y) + 'px';
  });

  // Ставим позицию после загрузки шрифтов/картинок
  window.addEventListener('load', placeInitial);
  placeInitial();
}

// ===== Страница 4: звук "Карлитоооо" =====
const carlitoBtn = document.getElementById('carlitoBtn');
const carlitoSound = document.getElementById('carlitoSound');

if (carlitoBtn && carlitoSound) {
  carlitoBtn.addEventListener('click', () => {
    try {
      carlitoSound.currentTime = 0;
      carlitoSound.play().catch(() => {});
    } catch (e) {}
  });
}

// ===== Страница 5: карусель фото =====
(function () {
  const imgEl = document.getElementById('carouselImg');
  if (!imgEl) return;

  const photos = [
    'мои фото/liverpool.JPG',
    'мои фото/в платье.JPG',
    'мои фото/ем.JPG',
    'мои фото/зеркало.JPG',
    'мои фото/любимая 2я.JPG',
    'мои фото/любимая карла.JPG',
    'мои фото/макияж.JPG',
    'мои фото/медведь.jpg',
    'мои фото/сеньора.JPG',
    'мои фото/сердечко.JPG',
    'мои фото/чб.jpg',
    'мои фото/я селфи.JPG',
    'мои фото/я.JPG'
  ];

  // предзагрузка
  photos.forEach((src) => { const im = new Image(); im.src = src; });

  let current = 0;
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('dots');

  photos.forEach((_, i) => {
    const d = document.createElement('span');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    dotsWrap.appendChild(d);
  });
  const dots = dotsWrap.querySelectorAll('.dot');

  function show(index, direction) {
    current = (index + photos.length) % photos.length;

    // убираем старые классы анимации
    imgEl.classList.remove('slide-from-left', 'slide-from-right');

    // меняем картинку
    imgEl.src = photos[current];

    // форсируем перерасчёт, чтобы анимация перезапустилась
    void imgEl.offsetWidth;

    // добавляем нужный класс
    if (direction === 'prev') {
      imgEl.classList.add('slide-from-right');
    } else {
      imgEl.classList.add('slide-from-left');
    }

    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  if (prevBtn) prevBtn.addEventListener('click', () => show(current - 1, 'prev'));
  if (nextBtn) nextBtn.addEventListener('click', () => show(current + 1, 'next'));

  // свайп
  let touchStartX = 0;
  imgEl.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  imgEl.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      if (dx > 0) show(current - 1, 'prev');
      else show(current + 1, 'next');
    }
  }, { passive: true });
})();

// ===== Страница 6: аудио-плеер =====
(function () {
  const audio = document.getElementById('letterAudio');
  const playBtn = document.getElementById('audioPlayBtn');
  const icon = document.getElementById('audioIcon');
  const progress = document.getElementById('audioProgress');
  const timeEl = document.getElementById('audioTime');
  const wrap = document.querySelector('.audio-progress-wrap');

  if (!audio || !playBtn) return;

  function formatTime(sec) {
    if (!isFinite(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  });

  audio.addEventListener('play', () => { icon.textContent = '❚❚'; });
  audio.addEventListener('pause', () => { icon.textContent = '▶'; });

  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      const pct = (audio.currentTime / audio.duration) * 100;
      progress.style.width = pct + '%';
      timeEl.textContent = formatTime(audio.currentTime);
    }
  });

  audio.addEventListener('ended', () => {
    icon.textContent = '▶';
    progress.style.width = '100%';
    timeEl.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('loadedmetadata', () => {
    timeEl.textContent = formatTime(audio.duration);
  });

  if (wrap) {
    wrap.addEventListener('click', (e) => {
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, x / rect.width));
      if (audio.duration) {
        audio.currentTime = pct * audio.duration;
      }
    });
  }
})();



// ===== Страница 1: телепортация с вращением и взрывом =====
// ===== Страница 1: телепортация с вращением и взрывом =====
// ===== Страница 1: телепортация с вращением и взрывом =====
(function () {
  const pressBtn = document.getElementById('pressBtn');
  if (!pressBtn) return;

  const overlay = document.getElementById('teleportOverlay');
  const countEl = document.getElementById('teleportCount');
  const flash = document.getElementById('teleportFlash');

  let started = false;

  function createParticles(btn) {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const burst = document.createElement('div');
    burst.className = 'burst-container';
    document.body.appendChild(burst);

    const total = 40;
    for (let i = 0; i < total; i++) {
      const p = document.createElement('span');
      p.className = 'burst-particle';

      const angle = (Math.PI * 2 * i) / total + (Math.random() - 0.5) * 0.5;
      const dist = 120 + Math.random() * 220;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      const rot = Math.random() * 1080 - 540;
      const size = 5 + Math.random() * 12;
      const dur = 2.8 + Math.random() * 0.4;   // ~3 секунды полёта

      p.style.left = cx + 'px';
      p.style.top  = cy + 'px';
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.setProperty('--dx', dx + 'px');
      p.style.setProperty('--dy', dy + 'px');
      p.style.setProperty('--rot', rot + 'deg');
      p.style.animationDuration = dur + 's';

      burst.appendChild(p);
    }

    setTimeout(() => burst.remove(), 3500);
  }

  function runTeleport() {
    if (started) return;
    started = true;

    // 1. Вращение 3 секунды
    pressBtn.classList.add('spin-3s');

    // 2. Взрыв через 3 секунды (летит 3 секунды)
    setTimeout(() => {
      pressBtn.classList.remove('spin-3s');
      pressBtn.classList.add('teleporting');
      createParticles(pressBtn);
    }, 3000);

    // 3. Затемнение только через 3 секунды ПОСЛЕ взрыва (то есть на 6-й секунде)
    setTimeout(() => {
      overlay.classList.add('active');
    }, 6000);

    // 4. Отсчёт — ещё через 0.5с после начала затемнения
    setTimeout(() => {
      let count = 3;

      function showNumber() {
        countEl.textContent = count;
        countEl.classList.remove('show');
        void countEl.offsetWidth;
        countEl.classList.add('show');

        if (count > 1) {
          count--;
          setTimeout(showNumber, 900);
        } else {
          setTimeout(() => {
            flash.classList.add('active');
            setTimeout(() => {
              window.location.href = 'page2.html';
            }, 250);
          }, 900);
        }
      }

      showNumber();
    }, 6500);
  }

  pressBtn.addEventListener('click', runTeleport);
  pressBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    runTeleport();
  }, { passive: false });
})();



// ===== Магический переход page3 → page4 =====
(function () {
  const magicBtn = document.getElementById('magicBtn');
  if (!magicBtn) return;

  const fog = document.getElementById('fogOverlay');
  const spinner = document.getElementById('magicSpinner');
  let started = false;

  function runMagic() {
    if (started) return;
    started = true;

    // 1. Кнопка «растворяется»
    magicBtn.classList.add('magic-pressed');

    // 2. Через 0.4с — серый туман наползает
    setTimeout(() => {
      fog.classList.add('active');
    }, 400);

    // 3. Через 1.0с — появляется спиннер
    setTimeout(() => {
      spinner.classList.add('active');
    }, 1000);

    // 4. Через 2.6с — переход на page4.html
    setTimeout(() => {
      window.location.href = 'page4.html';
    }, 2600);
  }

  magicBtn.addEventListener('click', runMagic);
  magicBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    runMagic();
  }, { passive: false });
})();