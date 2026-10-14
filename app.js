
/* ==========================================
   LOVE GARDEN
   DAY & NIGHT MODE EDITION

   FEATURES:
   - Romantic Day / Night Theme
   - Glowing Fireflies
   - Saved Theme Preference
   - 4 Photo / Video Albums
   - Automatic Photo Slideshow
   - Background Music
   - Animated Butterflies
   - Garden Flowers
   - Falling Petals
   - Floating Balloons
   ========================================== */

(() => {
  'use strict';

  // ======================================
  // CONFIGURATION
  // ======================================

  const config = window.LOVE_CONFIG || {};

  const get = (id) => document.getElementById(id);

  const musicButton = get('musicButton');
  const musicLabel = get('musicLabel');
  const musicIcon = get('musicIcon');

  const envelope = get('openEnvelope');
  const welcome = get('welcome');
  const surprise = get('surprise');

  const photoStage = get('photoStage');
  const photoFrame = get('photoFrame');
  const dots = get('galleryDots');


  // ======================================
  // DAY / NIGHT THEME
  // ======================================

  const themeButton = get('themeButton');
  const themeIcon = get('themeIcon');
  const themeLabel = get('themeLabel');

  function applyTheme(mode) {

    const isNight = mode === 'night';

    document.body.classList.toggle(
      'is-night',
      isNight
    );

    themeButton.setAttribute(
      'aria-pressed',
      String(isNight)
    );

    themeButton.setAttribute(
      'aria-label',
      isNight
        ? 'Switch to day mode'
        : 'Switch to night mode'
    );

    themeIcon.textContent = isNight ? '☀️' : '🌙';

    themeLabel.textContent = isNight
      ? 'Day mode'
      : 'Night mode';

    const themeMeta = get('browserThemeColor');

    if (themeMeta) {
      themeMeta.content = isNight
        ? '#10142b'
        : '#f6e8dd';
    }

    try {
      localStorage.setItem(
        'love-garden-theme',
        mode
      );
    } catch (error) {
      // Continue without saving preference.
    }

  }


  // RESTORE SAVED THEME

  let initialTheme = 'day';

  try {
    initialTheme =
      localStorage.getItem('love-garden-theme') === 'night'
        ? 'night'
        : 'day';
  } catch (error) {
    initialTheme = 'day';
  }

  applyTheme(initialTheme);


  // THEME BUTTON CLICK

  themeButton.addEventListener('click', () => {

    const isNight = document.body.classList.contains(
      'is-night'
    );

    applyTheme(isNight ? 'day' : 'night');

  });


  // ======================================
  // NIGHT MODE FIREFLIES
  // ======================================

  const fireflyField = get('fireflies');

  let currentFireflyCount = -1;

  function renderFireflies() {

    const count = window.innerWidth < 700 ? 16 : 28;

    if (
      !fireflyField ||
      currentFireflyCount === count
    ) {
      return;
    }

    currentFireflyCount = count;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {

      const firefly = document.createElement('span');

      firefly.className = 'firefly';

      firefly.style.setProperty(
        '--x',
        `${(i * 13 + 7) % 97}%`
      );

      firefly.style.setProperty(
        '--y',
        `${(i * 19 + 11) % 85}%`
      );

      firefly.style.setProperty(
        '--size',
        `${2 + (i % 3)}px`
      );

      firefly.style.setProperty(
        '--duration',
        `${6 + (i % 5) * 1.6}s`
      );

      firefly.style.setProperty(
        '--delay',
        `${-i * 0.8}s`
      );

      firefly.style.setProperty(
        '--driftX',
        `${-30 + (i % 6) * 12}px`
      );

      firefly.style.setProperty(
        '--driftY',
        `${-18 + (i % 5) * 9}px`
      );

      fragment.append(firefly);

    }

    fireflyField.replaceChildren(fragment);

  }

  renderFireflies();

  window.addEventListener(
    'resize',
    renderFireflies,
    { passive: true }
  );


  // ======================================
  // LOVE LETTER CONTENT
  // ======================================

  get('openingLine').textContent =
    config.openingLine ||
    'Happy 30th Monthsary!';

  get('envelopeTo').textContent =
    config.recipient || 'My Palangga';

  get('letterTitle').textContent =
    config.letterTitle || 'To My Bebe,';

  get('sender').textContent =
    config.sender || 'Forever Yours ♡';

  const message = Array.isArray(config.message)
    ? config.message
    : [];

  const letterMessage = get('letterMessage');

  letterMessage.replaceChildren();

  message.forEach((paragraph) => {

    const p = document.createElement('p');

    p.textContent = paragraph;

    letterMessage.append(p);

  });


  // ======================================
  // PHOTO & VIDEO ALBUM SETUP
  // ======================================

  const inputGroups =
    Array.isArray(config.gallery) && config.gallery.length
      ? config.gallery
      : [
          {
            id: 'together',
            title: 'OUR MEMORIES',
            type: 'photo',
            items: []
          }
        ];

  const groups = inputGroups.map((group, i) => ({

    id: String(group.id || `album-${i}`),

    title: String(
      group.title || `Album ${i + 1}`
    ),

    subtitle: String(group.subtitle || ''),

    type: group.type === 'video'
      ? 'video'
      : 'photo',

    items: Array.isArray(group.items)
      ? group.items.filter(Boolean)
      : []

  }));

  let activeGroup = 0;

  const activeIndices = groups.map(() => 0);

  let photoToken = 0;
  let slideTimer = null;
  let activeVideo = null;

  let pausedMusicForVideo = false;
  let opened = false;

  let audioWanted = true;
  let audioPlaying = false;


  // ======================================
  // BACKGROUND MUSIC
  // ======================================

  const audio = new Audio(
    config.music || 'assets/music.mp3'
  );

  audio.preload = 'auto';
  audio.load();
  audio.volume = 0.43;
  audio.loop = true;

  function updateMusicButton(label) {

    musicButton.setAttribute(
      'aria-pressed',
      String(audioPlaying)
    );

    musicIcon.textContent = audioPlaying ? '♪' : '♫';

    musicLabel.textContent =
      label || (audioPlaying ? 'Music on' : 'Music off');

  }

  async function playMusic() {

    audioWanted = true;

    updateMusicButton('Loading music...');

    try {

      await audio.play();

      audioPlaying = true;

      updateMusicButton();

    } catch (error) {

      audioPlaying = false;

      updateMusicButton('Tap for music');

    }

  }

  function stopMusic() {

    audioWanted = false;
    pausedMusicForVideo = false;

    audio.pause();

    audioPlaying = false;

    updateMusicButton();

  }

  musicButton.addEventListener('click', () => {

    if (audioPlaying) {

      stopMusic();

    } else {

      if (activeVideo && !activeVideo.paused) {
        activeVideo.pause();
      }

      playMusic();

    }

  });

  audio.addEventListener('playing', () => {
    audioPlaying = true;
    updateMusicButton();
  });

  audio.addEventListener('error', () => {

    audioPlaying = false;

    updateMusicButton('Music not found');

  });


  // ======================================
  // CREATE FOUR ALBUM BUTTONS
  // ======================================

  const sectionBar = document.createElement('nav');

  sectionBar.className = 'memory-tabs';

  sectionBar.setAttribute(
    'aria-label',
    'Choose photo or video album'
  );

  const sectionHint = document.createElement('p');

  sectionHint.className = 'memory-tabs-hint';

  sectionHint.textContent = 'Choose an album ♡';

  const sectionButtons = document.createElement('div');

  sectionButtons.className = 'memory-tab-buttons';

  sectionBar.append(
    sectionHint,
    sectionButtons
  );

  const photoCard = photoStage.closest('.photo-card');

  photoCard.querySelector(
    '.gallery-controls'
  ).after(sectionBar);

  const sectionLabels = [];

  groups.forEach((group, i) => {

    const button = document.createElement('button');

    button.type = 'button';
    button.className = 'memory-tab';

    button.textContent = group.title;

    button.setAttribute('aria-pressed', 'false');

    button.addEventListener('click', () => {
      switchGroup(i);
    });

    sectionButtons.append(button);

    sectionLabels.push(button);

  });


  // ======================================
  // MEDIA FILE HELPERS
  // ======================================

  function fileName(item) {

    if (typeof item === 'string') {
      return item;
    }

    return item && (item.file || item.src)
      ? String(item.file || item.src)
      : '';

  }

  function resolvedPath(group, item) {

    const file = fileName(item);

    if (
      /^(?:https?:\/\/|\/|assets\/|\.\/assets\/)/i.test(file)
    ) {
      return file;
    }

    const folder = group.type === 'video'
      ? 'assets/videos/'
      : 'assets/photos/';

    return `${folder}${file}`;

  }

  function itemCaption(group, item, index) {

    if (
      item &&
      typeof item === 'object' &&
      item.caption
    ) {
      return String(item.caption);
    }

    return group.type === 'video'
      ? `Video ${index + 1} ♡`
      : `Memory ${index + 1} ♡`;

  }

  function emptyMedia(text, extra = '') {

    const wrap = document.createElement('div');

    wrap.className = 'photo-placeholder gallery-empty';

    const heart = document.createElement('span');
    heart.textContent = '♡';

    const note = document.createElement('p');
    note.textContent = text;

    const hint = document.createElement('small');
    hint.textContent = extra;

    wrap.append(heart, note, hint);

    return wrap;

  }


  // ======================================
  // STOP ACTIVE VIDEO
  // ======================================

  function stopActiveVideo() {

    if (activeVideo) {

      activeVideo.onplay = null;
      activeVideo.onpause = null;
      activeVideo.onended = null;
      activeVideo.onerror = null;

      activeVideo.pause();

      activeVideo.removeAttribute('src');

      activeVideo.load();

      activeVideo = null;

    }

    if (pausedMusicForVideo) {

      pausedMusicForVideo = false;

      if (audioWanted) {
        playMusic();
      }

    }

  }


  // ======================================
  // GALLERY DOTS
  // ======================================

  function buildDots(group, selected) {

    dots.replaceChildren();

    group.items.forEach((_, i) => {

      const button = document.createElement('button');

      button.type = 'button';

      button.classList.toggle(
        'is-active',
        i === selected
      );

      button.setAttribute(
        'aria-label',
        `${group.title}: item ${i + 1}`
      );

      button.setAttribute(
        'aria-current',
        i === selected ? 'true' : 'false'
      );

      button.addEventListener('click', () => {
        showItem(i);
      });

      dots.append(button);

    });

    dots.hidden = group.items.length <= 1;

  }


  // ======================================
  // DISPLAY PHOTO OR VIDEO
  // ======================================

  function showItem(index) {

    clearTimeout(slideTimer);

    slideTimer = null;

    const group = groups[activeGroup];

    const total = group.items.length;

    stopActiveVideo();

    const token = ++photoToken;


    // EMPTY ALBUM

    if (!total) {

      get('photoCounter').textContent = '00 / 00';

      get('photoCaption').textContent =
        group.subtitle || group.title;

      photoStage.classList.remove('is-video');

      photoFrame.replaceChildren(
        emptyMedia(
          'No memories yet ♡',
          'Add files in config.js'
        )
      );

      buildDots(group, 0);

      return;

    }


    // SELECT CURRENT ITEM

    const next = ((index % total) + total) % total;

    activeIndices[activeGroup] = next;

    const entry = group.items[next];

    const path = resolvedPath(group, entry);

    get('photoCounter').textContent =
      `${String(next + 1).padStart(2, '0')} / ` +
      `${String(total).padStart(2, '0')}`;

    get('photoCaption').textContent =
      itemCaption(group, entry, next);

    buildDots(group, next);


    // RESTART TRANSITION

    photoFrame.style.animation = 'none';

    void photoFrame.offsetWidth;

    photoFrame.style.animation = '';


    // VIDEO DISPLAY

    if (group.type === 'video') {

      photoStage.classList.add('is-video');

      const video = document.createElement('video');

      video.className = 'gallery-video';

      video.controls = true;
      video.playsInline = true;
      video.preload = 'none';

      video.setAttribute('playsinline', '');

      video.setAttribute(
        'aria-label',
        itemCaption(group, entry, next)
      );

      if (
        entry &&
        typeof entry === 'object' &&
        entry.poster
      ) {
        video.poster = String(entry.poster);
      }


      // PAUSE MUSIC WHILE VIDEO PLAYS

      video.onplay = () => {

        if (audioPlaying) {

          pausedMusicForVideo = true;

          audio.pause();

          audioPlaying = false;

          updateMusicButton('Paused for video');

        }

      };


      // RESTORE MUSIC AFTER VIDEO

      const restoreSound = () => {

        if (pausedMusicForVideo) {

          pausedMusicForVideo = false;

          if (audioWanted) {
            playMusic();
          }

        }

      };

      video.onpause = restoreSound;
      video.onended = restoreSound;

      video.onerror = () => {

        if (token !== photoToken) return;

        photoFrame.replaceChildren(
          emptyMedia(
            'Video cannot play',
            `Check: ${path}`
          )
        );

      };

      photoFrame.replaceChildren(video);

      activeVideo = video;

      video.src = path;

    } else {

      // PHOTO DISPLAY

      photoStage.classList.remove('is-video');

      photoFrame.replaceChildren(
        emptyMedia('Loading our memory ♡')
      );

      const img = new Image();

      img.alt = itemCaption(group, entry, next);

      img.decoding = 'async';
      img.loading = 'eager';

      img.onload = () => {

        if (token === photoToken) {
          photoFrame.replaceChildren(img);
          resetSlideTimer();
        }

      };

      img.onerror = () => {

        if (token === photoToken) {

          photoFrame.replaceChildren(
            emptyMedia(
              'Photo not found',
              `Check: ${path}`
            )
          );

        }

      };

      img.src = path;

    }

    resetSlideTimer();

  }


  // ======================================
  // AUTOMATIC PHOTO SLIDESHOW
  // ======================================

  function resetSlideTimer() {

    clearTimeout(slideTimer);
    slideTimer = null;

    const group = groups[activeGroup];
    const visibleImage = photoFrame.querySelector('img');

    // Never switch away while the current image is downloading.
    if (
      group.type === 'photo' &&
      group.items.length > 1 &&
      opened &&
      visibleImage &&
      visibleImage.complete &&
      visibleImage.naturalWidth > 0
    ) {
      slideTimer = setTimeout(() => {
        if (document.hidden) {
          resetSlideTimer();
          return;
        }
        showItem(activeIndices[activeGroup] + 1);
      }, 8500);
    }
  }


  // ======================================
  // SWITCH ALBUM
  // ======================================

  function switchGroup(index) {

    activeGroup = index;

    const group = groups[index];

    get('galleryAlbumTitle').textContent =
      `✿ ${group.title}`;

    sectionLabels.forEach((button, i) => {

      button.classList.toggle(
        'is-active',
        i === index
      );

      button.setAttribute(
        'aria-pressed',
        String(i === index)
      );

    });

    photoCard.querySelector(
      '.photo-footnote'
    ).textContent =
      group.subtitle || 'The little moments, forever ours';

    showItem(activeIndices[index]);

  }


  // PREVIOUS / NEXT CONTROLS

  get('prevPhoto').addEventListener('click', () => {

    showItem(
      activeIndices[activeGroup] - 1
    );

  });

  get('nextPhoto').addEventListener('click', () => {

    showItem(
      activeIndices[activeGroup] + 1
    );

  });


  // ======================================
  // MOBILE SWIPE GESTURES
  // ======================================

  let touchStart = 0;

  photoStage.addEventListener(
    'touchstart',
    (event) => {

      if (groups[activeGroup].type !== 'video') {

        touchStart =
          event.changedTouches[0].screenX;

      }

    },
    { passive: true }
  );

  photoStage.addEventListener(
    'touchend',
    (event) => {

      if (groups[activeGroup].type === 'video') {
        return;
      }

      const distance =
        event.changedTouches[0].screenX - touchStart;

      if (Math.abs(distance) > 35) {

        showItem(
          activeIndices[activeGroup] +
          (distance < 0 ? 1 : -1)
        );

      }

    },
    { passive: true }
  );


  // LOAD FIRST ALBUM

  switchGroup(0);


  // ======================================
  // ANIMATED BUTTERFLIES
  // ======================================

  const butterflyMarkup = `
    <span class="butterfly-art">
      <span class="butterfly-wings butterfly-wings--left">
        <span class="butterfly-wing butterfly-wing--upper"></span>
        <span class="butterfly-wing butterfly-wing--lower"></span>
        <span class="butterfly-heart">♥</span>
      </span>

      <span class="butterfly-wings butterfly-wings--right">
        <span class="butterfly-wing butterfly-wing--upper"></span>
        <span class="butterfly-wing butterfly-wing--lower"></span>
        <span class="butterfly-heart">♥</span>
      </span>

      <span class="butterfly-body"></span>
    </span>
  `;

  const butterflyColors = [
    '',
    'variant-lilac',
    'variant-gold',
    'variant-mint',
    'variant-peach'
  ];

  let currentButterflyCount = -1;

  function renderButterflies() {

    const isMobile = window.innerWidth < 700;

    const count = isMobile ? 4 : 8;

    if (count === currentButterflyCount) return;

    currentButterflyCount = count;

    const heights = isMobile
      ? [63, 81, 76, 56]
      : [15, 67, 82, 33, 73, 14, 42, 90];

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {

      const butterfly = document.createElement('div');

      butterfly.className =
        `butterfly ${i % 2 ? 'fly-right' : 'fly-left'} ` +
        butterflyColors[i % butterflyColors.length];

      butterfly.innerHTML = butterflyMarkup;

      butterfly.style.setProperty(
        '--y',
        `${heights[i]}%`
      );

      butterfly.style.setProperty(
        '--duration',
        `${17 + (i % 4) * 3}s`
      );

      butterfly.style.setProperty(
        '--delay',
        `${-i * 3.8}s`
      );

      butterfly.style.setProperty(
        '--scale',
        `${isMobile ? 0.78 : 0.88 + (i % 3) * 0.1}`
      );

      fragment.append(butterfly);

    }

    get('butterflies').replaceChildren(fragment);

  }

  renderButterflies();

  window.addEventListener(
    'resize',
    renderButterflies,
    { passive: true }
  );


  // ======================================
  // GARDEN FLOWERS
  // ======================================

  const colors = [
    '#f8aabd',
    '#f6d4ac',
    '#e4beda',
    '#f6e1ac',
    '#df9daa',
    '#d6c3e5'
  ];

  for (let i = 0; i < 16; i++) {

    const flower = document.createElement('div');

    flower.className = 'flower';

    flower.style.setProperty(
      '--x',
      `${(i * 17 + 4) % 102}%`
    );

    flower.style.setProperty(
      '--height',
      `${68 + (i * 29) % 105}px`
    );

    flower.style.setProperty(
      '--petal-color',
      colors[i % colors.length]
    );

    flower.style.setProperty(
      '--sway',
      `${2.2 + (i % 4) * 0.7}s`
    );

    flower.style.setProperty(
      '--delay',
      `${-i * 0.4}s`
    );

    flower.innerHTML = `
      <span class="flower-stem"></span>
      <span class="leaf leaf--left"></span>
      <span class="leaf leaf--right"></span>
      <span class="flower-head">
        ${'<span class="flower-petal"></span>'.repeat(6)}
        <span class="flower-core"></span>
      </span>
    `;

    get('garden').append(flower);

  }


  // ======================================
  // FALLING PETALS
  // ======================================

  for (let i = 0; i < 20; i++) {

    const petal = document.createElement('span');

    petal.className = 'petal';

    petal.style.setProperty(
      '--x',
      `${(i * 29 + 6) % 99}%`
    );

    petal.style.setProperty(
      '--size',
      `${9 + (i % 4) * 3}px`
    );

    petal.style.setProperty(
      '--duration',
      `${12 + (i % 7) * 2}s`
    );

    petal.style.setProperty(
      '--delay',
      `${-i * 2.5}s`
    );

    petal.style.setProperty(
      '--drift',
      `${-75 + (i % 8) * 20}px`
    );

    get('petals').append(petal);

  }


  // ======================================
  // FLOATING BALLOONS
  // ======================================

  for (let i = 0; i < 6; i++) {

    const balloon = document.createElement('span');

    balloon.className = 'balloon';

    balloon.style.setProperty(
      '--x',
      `${3 + (i * 31) % 93}%`
    );

    balloon.style.setProperty(
      '--size',
      `${38 + (i % 3) * 10}px`
    );

    balloon.style.setProperty(
      '--color',
      colors[i]
    );

    balloon.style.setProperty(
      '--duration',
      `${17 + (i % 3) * 6}s`
    );

    balloon.style.setProperty(
      '--delay',
      `${-i * 3}s`
    );

    get('balloons').append(balloon);

  }


  // ======================================
  // BUTTERFLY ON ENVELOPE
  // ======================================

  const envelopeWrap =
    envelope.querySelector('.envelope-wrap');

  if (
    envelopeWrap &&
    !envelopeWrap.querySelector('.envelope-butterfly')
  ) {

    const cuteButterfly = document.createElement('span');

    cuteButterfly.className =
      'perched-butterfly envelope-butterfly variant-lilac';

    cuteButterfly.setAttribute(
      'aria-hidden',
      'true'
    );

    cuteButterfly.innerHTML = butterflyMarkup;

    envelopeWrap.append(cuteButterfly);

  }


  // ======================================
  // ENVELOPE OPENING
  // ======================================

  envelope.addEventListener('click', () => {

    if (opened) return;

    opened = true;

    envelope.classList.add('is-opening');

    envelope.disabled = true;

    if (audioWanted) {
      playMusic();
    }

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    setTimeout(() => {

      document.body.classList.add('is-open');

      welcome.setAttribute(
        'aria-hidden',
        'true'
      );

      welcome.inert = true;

      surprise.removeAttribute('inert');

      surprise.setAttribute(
        'aria-hidden',
        'false'
      );

      resetSlideTimer();

      window.scrollTo({
        top: 0,
        behavior: 'auto'
      });

    }, reduceMotion ? 70 : 1100);

  });


  // ======================================
  // PWA SERVICE WORKER
  // ======================================

  if (
    'serviceWorker' in navigator &&
    (
      location.protocol === 'https:' ||
      location.hostname === 'localhost' ||
      location.hostname === '127.0.0.1'
    )
  ) {

    window.addEventListener('load', () => {

      navigator.serviceWorker
        .register('./sw.js')
        .catch(() => {});

    });

  }

})();
