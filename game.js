// 드론 코인 대모험 — 게임 로직
(() => {
  'use strict';

  const W = 960, H = 540;

  // ===== 조정 가능한 수치 =====
  const CONFIG = {
    playTop: 62,          // 5층 위쪽 경계
    playBottom: 492,      // 1층 아래쪽 경계 (땅)
    lanes: 5,
    droneX: 190,
    droneHalfH: 20,
    gravity: 1100,        // 손 뗐을 때 떨어지는 가속도
    lift: 1450,           // 누르고 있을 때 올라가는 가속도
    maxUp: 380,
    maxDown: 420,
    campTime: 2.0,        // 5층에 이 시간(초) 이상 머물면 5층 코인 안 나옴
    hearts: 3,            // 기본 하트 개수 (초록 드론은 +1)
    invulnTime: 1.6,      // 부딪힌 뒤 잠깐 무적인 시간(초)
    abilityUses: 3,       // 특수 기능 사용 횟수 (한 판에)
    unlockAllStages: true, // true면 모든 단계를 잠금 없이 고를 수 있음
    unlockAllDrones: true, // true면 36종 드론을 처음부터 모두 고를 수 있음
    stages: [
      // target: 클리어 코인, speed: 흐르는 속도, interval: 새 무리 간격(초)
      // edge: 새 한 마리가 1층/5층에 나올 확률, box: 랜덤박스 확률
      // move: [아래층, 위층] 새가 위아래로 움직이는 범위, zigzag: 새가 대각선으로 날 확률
      // gift: 선물박스 확률, star: 별 확률, dino: 익룡 단계, meteorAt: 운석이 떨어지는 코인 수
      { target: 20, speed: 210, interval: 1.6,  birdsMin: 1, birdsMax: 2, edge: 0.00, box: 0.00 },
      { target: 25, speed: 230, interval: 1.5,  birdsMin: 1, birdsMax: 2, edge: 0.15, box: 0.00 },
      { target: 30, speed: 250, interval: 1.4,  birdsMin: 1, birdsMax: 3, edge: 0.25, box: 0.22 },
      { target: 35, speed: 270, interval: 1.3,  birdsMin: 2, birdsMax: 3, edge: 0.35, box: 0.24 },
      { target: 40, speed: 290, interval: 1.2,  birdsMin: 2, birdsMax: 3, edge: 0.45, box: 0.26 },
      { target: 45, speed: 280, interval: 1.5,  birdsMin: 1, birdsMax: 2, move: [2, 4], box: 0.24, gift: 0.08 },
      { target: 50, speed: 290, interval: 1.45, birdsMin: 1, birdsMax: 2, move: [1, 5], box: 0.24, gift: 0.08 },
      { target: 55, speed: 295, interval: 1.4,  birdsMin: 1, birdsMax: 2, move: [1, 5], box: 0.25, gift: 0.08, star: 0.04 },
      { target: 60, speed: 300, interval: 1.35, birdsMin: 2, birdsMax: 2, move: [1, 5], box: 0.25, gift: 0.08, star: 0.04 },
      { target: 60, speed: 310, interval: 1.3,  birdsMin: 2, birdsMax: 3, move: [1, 5], box: 0.26, gift: 0.08, star: 0.05 },
      { target: 60, speed: 305, interval: 1.3,  birdsMin: 2, birdsMax: 3, move: [1, 5], zigzag: 0.5, box: 0.26, gift: 0.09, star: 0.05 },
      { target: 60, speed: 310, interval: 1.3,  birdsMin: 2, birdsMax: 3, move: [1, 5], zigzag: 0.5, box: 0.26, gift: 0.09, star: 0.05 },
      { target: 60, speed: 315, interval: 1.25, birdsMin: 2, birdsMax: 3, move: [1, 5], zigzag: 0.55, box: 0.27, gift: 0.09, star: 0.05 },
      { target: 60, speed: 320, interval: 1.25, birdsMin: 2, birdsMax: 3, move: [1, 5], zigzag: 0.6, box: 0.27, gift: 0.09, star: 0.05 },
      { target: 60, speed: 320, interval: 1.3,  birdsMin: 2, birdsMax: 3, move: [1, 5], zigzag: 0.5, box: 0.27, gift: 0.09, star: 0.06, dino: true, meteorAt: 40 },
    ],
    maxGiftsPerRun: 2,    // 한 판에 선물박스가 나오는 최대 횟수
    maxStarsPerRun: 1,    // 한 판에 별이 나오는 최대 횟수 (가끔만!)
  };
  const LAST = CONFIG.stages.length - 1;
  const LANE_H = (CONFIG.playBottom - CONFIG.playTop) / CONFIG.lanes;
  const laneY = (lane) => CONFIG.playBottom - (lane - 0.5) * LANE_H;
  const laneOf = (y) => Math.max(1, Math.min(5, Math.ceil((CONFIG.playBottom - y) / LANE_H)));
  const FONT = "'Jua', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif";
  const BIRD_COLORS = ['#4f86f7', '#ef5b7a', '#8e6cf0', '#22b07d', '#f08a24'];
  const PTERO_COLORS = ['#8d6e63', '#7c8f55', '#a1887f', '#6d7f8f', '#9c6b5a'];
  const SPACE_STAGE = 9;

  // ===== 캔버스 =====
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const DPR = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = W * DPR; canvas.height = H * DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  BG.init(DPR);

  const rand = (a, b) => a + Math.random() * (b - a);
  const randInt = (a, b) => Math.floor(rand(a, b + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function rr(g, x, y, w, h, r) {
    g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
  }

  // ===== 저장 (진행도 / 드론) =====
  const store = {
    read(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } },
    write(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* 무시 */ } },
  };
  // unlocked = 지금까지 깬 진행도 (단계로 열리는 드론, 이어하기에 사용)
  let unlocked = Math.max(1, Math.min(CONFIG.stages.length, parseInt(store.read('droneCoin.unlocked', '1'), 10) || 1));
  let owned = new Set();
  try { owned = new Set(JSON.parse(store.read('droneCoin.owned', '[]'))); } catch (e) { owned = new Set(); }
  const saveOwned = () => store.write('droneCoin.owned', JSON.stringify([...owned]));
  const canUse = (s) => CONFIG.unlockAllDrones || DRONES.isAvailable(s, unlocked, owned);
  const stageOpen = (i) => CONFIG.unlockAllStages || i + 1 <= unlocked;
  let skinId = store.read('droneCoin.skin', 'orange');
  if (DRONES.get(skinId).id !== skinId || !canUse(DRONES.get(skinId))) skinId = 'orange';
  const skin = () => DRONES.get(skinId);
  const maxHearts = () => CONFIG.hearts + (skin().bonusHeart || 0);
  let newSkins = [];   // 방금 단계를 깨서 새로 열린 드론
  let gotSkins = [];   // 이번 판에 선물박스/별로 얻은 드론

  // ===== 사운드 (Web Audio) =====
  const Sound = {
    ac: null, muted: false,
    init() {
      if (!this.ac) { try { this.ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; } }
      if (this.ac.state === 'suspended') this.ac.resume();
    },
    tone(freq, dur, type = 'sine', vol = 0.12, slideTo = 0, delay = 0) {
      if (this.muted || !this.ac) return;
      const t0 = this.ac.currentTime + delay;
      const o = this.ac.createOscillator(), gn = this.ac.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, t0);
      if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
      gn.gain.setValueAtTime(vol, t0); gn.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
      o.connect(gn).connect(this.ac.destination); o.start(t0); o.stop(t0 + dur + 0.02);
    },
    coin() { this.tone(988, 0.07, 'square', 0.06); this.tone(1319, 0.16, 'square', 0.06, 0, 0.06); },
    box(n) {
      if (n === 0) { this.tone(300, 0.18, 'triangle', 0.12, 180); this.tone(220, 0.3, 'triangle', 0.12, 120, 0.16); return; }
      [523, 659, 784, 1047, 1319].slice(0, n + 1).forEach((f, i) => this.tone(f, 0.14, 'square', 0.06, 0, i * 0.07));
    },
    special() { [784, 988, 1175, 1568, 1976].forEach((f, i) => this.tone(f, 0.22, 'triangle', 0.1, 0, i * 0.09)); },
    skill() { this.tone(330, 0.25, 'sawtooth', 0.08, 1200); this.tone(660, 0.2, 'triangle', 0.08, 0, 0.1); },
    pop() { this.tone(700, 0.1, 'square', 0.06, 200); },
    hit() { this.tone(420, 0.25, 'square', 0.1, 140); },
    boom() { this.tone(160, 0.9, 'sawtooth', 0.18, 30); this.tone(90, 1, 'square', 0.12, 25, 0.05); },
    crash() { this.tone(500, 0.5, 'sawtooth', 0.12, 60); this.tone(180, 0.4, 'square', 0.06, 50, 0.05); },
    clear() { [523, 659, 784, 1047, 784, 1047].forEach((f, i) => this.tone(f, 0.2, 'square', 0.07, 0, i * 0.12)); },
    go() { this.tone(660, 0.12, 'triangle', 0.1); this.tone(990, 0.2, 'triangle', 0.1, 0, 0.12); },
  };
  const muteBtn = document.getElementById('muteBtn');
  muteBtn.addEventListener('click', () => { Sound.muted = !Sound.muted; muteBtn.textContent = Sound.muted ? '🔇' : '🔊'; Sound.init(); });

  // ===== 게임 상태 =====
  let state = 'title';     // title, intro, playing, crashing, clear, cleared, over
  let stageIdx = 0;
  let drone, objs, particles, texts, banner, projs, bolts, pendingShots;
  let coins = 0, spawnT = 0, nextBirds = true, prevFree = [1, 2, 3, 4, 5];
  let campT = 0, camping = false, scroll = 0, phaseT = 0, time = 0;
  let hearts = CONFIG.hearts, invuln = 0, playT = 0, giftSpawned = 0, starSpawned = 0;
  let abUses = CONFIG.abilityUses, fx;
  let meteor = null, rage = false, shakeT = 0, flash = 0;

  function resetFx() {
    fx = { shield: 0, shieldLook: '', magnet: 0, slow: 0, double: 0, dash: 0, cone: null, swipe: null, ring: null, beam: null };
  }
  function resetStage(i) {
    stageIdx = i;
    drone = { y: laneY(3), vy: 0, angle: 0, rot: 0, spin: 0 };
    objs = []; particles = []; texts = []; banner = null; projs = []; bolts = []; pendingShots = [];
    coins = 0; spawnT = 0.5; nextBirds = true; prevFree = [1, 2, 3, 4, 5];
    campT = 0; camping = false; phaseT = 0;
    hearts = maxHearts(); invuln = 0; playT = 0; giftSpawned = 0; starSpawned = 0;
    abUses = CONFIG.abilityUses; resetFx();
    meteor = null; rage = false; shakeT = 0; flash = 0;
    gotSkins = [];
    updateSkillBtn();
  }

  // ===== 입력 =====
  const pointers = new Set();
  let keyHeld = false;
  const holding = () => pointers.size > 0 || keyHeld;
  const upBtn = document.getElementById('upBtn');
  const skillBtn = document.getElementById('skillBtn');

  function pDown(e) {
    if (state !== 'playing' && state !== 'intro') return;
    Sound.init();
    pointers.add(e.pointerId);
    upBtn.classList.add('pressed');
    try { e.target.setPointerCapture(e.pointerId); } catch (_) { /* 무시 */ }
    e.preventDefault();
  }
  function pUp(e) { pointers.delete(e.pointerId); if (!holding()) upBtn.classList.remove('pressed'); }
  [upBtn, canvas].forEach((el) => {
    el.addEventListener('pointerdown', pDown);
    el.addEventListener('pointerup', pUp);
    el.addEventListener('pointercancel', pUp);
    el.addEventListener('contextmenu', (e) => e.preventDefault());
  });
  skillBtn.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); Sound.init(); useSkill(); });
  skillBtn.addEventListener('contextmenu', (e) => e.preventDefault());

  const UP_KEYS = ['Space', 'ArrowUp', 'KeyW'];
  const SKILL_KEYS = ['KeyX', 'KeyF', 'KeyZ'];
  window.addEventListener('keydown', (e) => {
    if (UP_KEYS.includes(e.code)) {
      e.preventDefault();
      if (state === 'playing' || state === 'intro') { Sound.init(); keyHeld = true; upBtn.classList.add('pressed'); }
    } else if (SKILL_KEYS.includes(e.code)) {
      if (!e.repeat) useSkill();
    } else if (e.code === 'Enter' && overlay.classList.contains('show')) {
      const b = panel.querySelector('.btn.primary'); if (b) b.click();
    }
  });
  window.addEventListener('keyup', (e) => { if (UP_KEYS.includes(e.code)) { keyHeld = false; if (!holding()) upBtn.classList.remove('pressed'); } });
  window.addEventListener('blur', () => { keyHeld = false; pointers.clear(); upBtn.classList.remove('pressed'); });

  function updateSkillBtn() {
    const ab = skin().ability;
    skillBtn.querySelector('.ic').textContent = ab.icon;
    skillBtn.querySelector('.cnt').textContent = abUses;
    skillBtn.title = `${ab.name} (X 키)`;
    skillBtn.classList.toggle('empty', abUses <= 0);
    skillBtn.classList.toggle('hanja', ab.icon === '火');
  }
  const showButtons = (on) => { upBtn.classList.toggle('show', on); skillBtn.classList.toggle('show', on); };

  // ===== 오버레이 =====
  const overlay = document.getElementById('overlay');
  const panel = document.getElementById('panel');
  function showPanel(html, buttons = []) {
    panel.innerHTML = html;
    panel.classList.remove('wide');
    if (buttons.length) {
      const box = document.createElement('div'); box.className = 'btns';
      buttons.forEach((b) => {
        const el = document.createElement('button');
        el.className = 'btn' + (b.primary ? ' primary' : '');
        el.textContent = b.label;
        el.addEventListener('click', () => { Sound.init(); b.onClick(); });
        box.appendChild(el);
      });
      panel.appendChild(box);
    }
    overlay.classList.add('show');
    showButtons(false);
  }
  function hidePanel() { overlay.classList.remove('show'); }

  function showTitle() {
    state = 'title';
    resetStage(0);
    const info = BG.stages;
    let stageHtml = '<div class="stages">';
    for (let i = 0; i < info.length; i++) {
      const locked = !stageOpen(i);
      stageHtml += `<button class="stageBtn" data-s="${i}" ${locked ? 'disabled' : ''}>
        <b>${locked ? '🔒' : i + 1}</b>${info[i].name}</button>`;
    }
    stageHtml += '</div>';
    const cont = Math.min(unlocked, CONFIG.stages.length);
    showPanel(`
      <h1>🚁 드론 코인 대모험</h1>
      <div class="howto">
        <p class="big"><b>▲ 위로</b> 버튼을 누르면 올라가고, 손을 떼면 내려가요! <b>✨특수 기능</b> 버튼(X 키)은 3번!</p>
        <p>🐦 새를 피하고 💰 코인을 모아요. 💗 하트는 3개! 새와 3번 부딪히면 끝나요. · 원하는 단계를 골라 시작해요</p>
      </div>
      ${stageHtml}
    `, [{ label: cont > 1 ? `${cont}단계 이어하기` : '게임 시작!', primary: true, onClick: () => showDroneSelect(cont - 1) }]);
    panel.classList.add('wide');
    panel.querySelectorAll('.stageBtn').forEach((b) => b.addEventListener('click', () => { Sound.init(); showDroneSelect(+b.dataset.s); }));
  }

  // ===== 드론 고르기 화면 =====
  function lockLabel(s) {
    if (s.stage) return `🔒 ${s.stage}단계`;
    return s.source === 'gift' ? '🎁 선물박스' : '⭐ 별';
  }
  function abilityText(s) {
    const ab = s.ability;
    return `<b>${s.name}</b> · ${ab.icon} <b>${ab.name}</b>: ${ab.desc} (한 판에 ${CONFIG.abilityUses}번)${s.bonusHeart ? ' · 💗 하트 +1' : ''}`;
  }
  function showDroneSelect(startIdx) {
    state = 'title';
    const cards = DRONES.skins.map((s) => {
      const locked = !canUse(s);
      return `<button class="droneCard${s.id === skinId ? ' selected' : ''}${s.special ? ' special' : ''}" data-id="${s.id}" ${locked ? 'disabled' : ''}>
        <canvas width="240" height="150"></canvas>
        <span>${locked ? lockLabel(s) : s.name}</span></button>`;
    }).join('');
    const count = DRONES.skins.filter(canUse).length;
    showPanel(`
      <h2>🚁 ${startIdx + 1}단계 · 내 드론을 골라요! <small>(${count} / ${DRONES.skins.length})${CONFIG.unlockAllDrones ? '' : ' · 🎁선물박스·⭐별로 새 드론!'}</small></h2>
      <p class="abInfo" id="abInfo">${abilityText(skin())}</p>
      <div class="droneGrid">${cards}</div>
    `, [
      { label: '이 드론으로 출발! ▶', primary: true, onClick: () => startStage(startIdx) },
      { label: '뒤로', onClick: showTitle },
    ]);
    panel.classList.add('wide');
    const info = panel.querySelector('#abInfo');
    panel.querySelectorAll('.droneCard').forEach((card) => {
      const s = DRONES.get(card.dataset.id), cv = card.querySelector('canvas'), g = cv.getContext('2d');
      g.scale(2, 2);
      DRONES.draw(g, s, 60, 42, 0, 0.6, 0.2);
      card.addEventListener('click', () => {
        Sound.init(); Sound.coin();
        skinId = s.id; store.write('droneCoin.skin', skinId);
        info.innerHTML = abilityText(s);
        panel.querySelectorAll('.droneCard').forEach((c) => c.classList.toggle('selected', c === card));
      });
    });
  }

  function startStage(i) {
    resetStage(i);
    hidePanel();
    state = 'intro';
    showButtons(true);
    keyHeld = false; pointers.clear(); upBtn.classList.remove('pressed');
  }

  const gotHtml = () => (gotSkins.length
    ? `<p class="big">🎁 이번에 얻은 드론: <b>${gotSkins.map((s) => s.name).join(', ')}</b></p>` : '');

  function gameOver() {
    state = 'over';
    const st = CONFIG.stages[stageIdx];
    showPanel(`
      <h2>앗! 하트를 모두 잃었어요 💔</h2>
      <p class="big">${stageIdx + 1}단계 · ${BG.stages[stageIdx].name}</p>
      <p class="big">모은 코인: 💰 ${coins} / ${st.target}</p>
      ${gotHtml()}
      <p>괜찮아요! 다시 도전해 봐요!</p>
    `, [
      { label: '다시 하기', primary: true, onClick: () => startStage(stageIdx) },
      { label: '드론 바꾸기', onClick: () => showDroneSelect(stageIdx) },
      { label: '처음 화면', onClick: showTitle },
    ]);
  }

  // 다음 단계 안내 문구 (방금 깬 단계 번호 기준)
  const NEXT_TIPS = {
    1: '⚠️ 2단계부터는 맨 아래(1층)와 맨 위(5층)에도 새가 나타나요!',
    2: '🎁 3단계부터는 <b>랜덤박스</b>가 나와요! 코인이 0~5개 들어 있어요.',
    5: `🐦 6단계부터는 새가 <b>위아래로 움직여요!</b> 🎁 빨간 <b>선물박스</b>를 잡으면 ${CONFIG.unlockAllDrones ? '코인 보너스!' : '새 드론을 얻어요!'}`,
    6: '🐦 7단계부터는 새가 1층~5층 전체를 위아래로 움직여요!',
    7: `⭐ 8단계부터는 가끔 <b>별</b>이 나와요! 별을 잡으면 ${CONFIG.unlockAllDrones ? '코인 보너스!' : '반짝이는 특별한 드론을 얻어요!'}`,
    9: '👨‍🚀 10단계는 <b>우주</b>! 새들도 우주복을 입었어요!',
    10: '↗️ 11단계부터는 새가 <b>대각선</b>으로도 날아요!',
    14: '🦖 마지막 15단계는 <b>공룡시대</b>! 코인 40개를 모으면… 무슨 일이 생길까요?',
  };

  function stageCleared() {
    state = 'cleared';
    if (stageIdx === LAST) {
      showPanel(`
        <h1>🏆 GAME CLEAR! 🏆</h1>
        <p class="big">15단계를 모두 깼어요! 서울에서 공룡시대까지 날아간 최고의 드론 조종사예요! 🎉</p>
        <p>서울 → 보스턴 → 대전 → 뉴욕 → 놀이터 → 파리 → 런던 → 시카고 → LA → 우주 → 샌프란시스코 → 워싱턴 DC → 세종 → 마드리드 → 공룡시대</p>
        ${gotHtml()}
        <p>모은 드론: <b>${DRONES.skins.filter(canUse).length} / ${DRONES.skins.length}</b> · 다시 하면서 드론을 모두 모아 봐요!</p>
      `, [
        { label: '처음 화면', primary: true, onClick: showTitle },
        { label: '15단계 다시', onClick: () => showDroneSelect(LAST) },
      ]);
    } else {
      const next = BG.stages[stageIdx + 1];
      const tip = NEXT_TIPS[stageIdx + 1];
      showPanel(`
        <h1>🎉 ${stageIdx + 1}단계 클리어!</h1>
        <p class="big">코인 ${coins}개를 모았어요! 다음은 <b>${stageIdx + 2}단계 · ${next.name}</b> ✈️</p>
        ${tip ? `<p>${tip}</p>` : ''}
        ${newSkins.length ? `<p class="big">🔓 새 드론이 열렸어요: <b>${newSkins.map((s) => s.name).join(', ')}</b></p>` : ''}
        ${gotHtml()}
      `, [
        { label: '다음 단계 ▶', primary: true, onClick: () => startStage(stageIdx + 1) },
        { label: '드론 바꾸기', onClick: () => showDroneSelect(stageIdx + 1) },
        { label: '처음 화면', onClick: showTitle },
      ]);
    }
  }

  // ===== 생성 =====
  function newBird(extra) {
    const st = CONFIG.stages[stageIdx];
    return Object.assign({
      type: 'bird', x: W + 40, phase: Math.random() * 6,
      color: pick(st.dino ? PTERO_COLORS : BIRD_COLORS), ptero: !!st.dino, fire: !!(st.dino && rage),
      shootCd: rand(0.2, 0.9), shots: 0,
    }, extra);
  }

  function spawnBirds() {
    const st = CONFIG.stages[stageIdx];
    if (st.move) {
      // 위아래로 움직이는 새 (6단계~), 대각선으로 나는 새 (11단계~)
      const [lo, hi] = st.move, used = [];
      const n = randInt(st.birdsMin, st.birdsMax);
      for (let k = 0; k < n; k++) {
        const pool = []; for (let l = lo; l <= hi; l++) if (!used.includes(l)) pool.push(l);
        const a = pick(pool); used.push(a);
        if (st.zigzag && Math.random() < st.zigzag) {
          const vy = (a >= 4 ? 1 : a <= 2 ? -1 : (Math.random() < 0.5 ? -1 : 1)) * rand(90, 150);
          objs.push(newBird({ zig: true, x: W + 40 + k * 24, y: laneY(a), vy }));
          continue;
        }
        const span = randInt(1, 2);
        let b = Math.max(lo, Math.min(hi, a + (Math.random() < 0.5 ? -span : span)));
        if (b === a) b = a < hi ? a + 1 : a - 1;
        const ya = laneY(a), yb = laneY(b), ph = Math.random() * 6, w = rand(1.6, 2.6);
        const mid = (ya + yb) / 2, amp = Math.abs(ya - yb) / 2;
        objs.push(newBird({ move: true, x: W + 40 + k * 24, mid, amp, w, phase: ph, y: mid + Math.sin(ph * w) * amp }));
      }
      prevFree = [1, 2, 3, 4, 5];
      return;
    }
    let lanes, free;
    for (let tries = 0; tries < 15; tries++) {
      const n = randInt(st.birdsMin, st.birdsMax);
      lanes = [];
      for (let k = 0; k < n; k++) {
        const useEdge = st.edge > 0 && Math.random() < st.edge;
        let pool = (useEdge ? [1, 5] : [2, 3, 4]).filter((l) => !lanes.includes(l));
        if (!pool.length) pool = (st.edge > 0 ? [1, 2, 3, 4, 5] : [2, 3, 4]).filter((l) => !lanes.includes(l));
        if (pool.length) lanes.push(pick(pool));
      }
      free = [1, 2, 3, 4, 5].filter((l) => !lanes.includes(l));
      // 이전 무리의 빈 층에서 한 칸 이내로 갈 수 있는 빈 층이 있어야 함 (항상 피할 길 보장)
      const ok = free.some((f) => prevFree.some((p) => Math.abs(f - p) <= 1));
      if (ok) break;
    }
    prevFree = free;
    lanes.forEach((l) => objs.push(newBird({ y: laneY(l), base: laneY(l) })));
  }

  function addItem(type, lane, dx = 0) {
    objs.push({ type, lane, x: W + 40 + dx, y: laneY(lane), base: laneY(lane), phase: Math.random() * 6 });
  }

  function spawnCoins() {
    const st = CONFIG.stages[stageIdx];
    const lanes = shuffle([1, 2, 3, 4, 5].filter((l) => !(camping && l === 5)));
    const groups = Math.random() < 0.4 ? 2 : 1;
    for (let g = 0; g < groups; g++) {
      const l = lanes[g];
      if (g === 1 && st.box > 0 && Math.random() < st.box) { addItem('box', l); continue; }
      const n = randInt(1, 3);
      for (let k = 0; k < n; k++) {
        objs.push({ type: 'coin', lane: l, x: W + 40 + (k - (n - 1) / 2) * 46, y: laneY(l), base: laneY(l), phase: k * 0.6 });
      }
    }
    if (groups === 1 && st.box > 0 && Math.random() < st.box * 0.5) addItem('box', lanes[1]);
    // 🎁 선물박스 (6단계~)
    if (st.gift && giftSpawned < CONFIG.maxGiftsPerRun && playT > 6 && Math.random() < st.gift) {
      addItem('gift', lanes[2]); giftSpawned++;
    }
    // ⭐ 별 (8단계~, 가끔만)
    if (st.star && starSpawned < CONFIG.maxStarsPerRun && playT > 10 && Math.random() < st.star) {
      addItem('star', lanes[3]); starSpawned++;
    }
  }

  // 선물박스/별을 잡았을 때: 아직 없는 드론 1개 획득
  function grantSkin(kind, o) {
    // 드론이 모두 열려 있으면(unlockAllDrones) 대신 코인 보너스
    const pool = CONFIG.unlockAllDrones ? [] : DRONES.skins.filter((s) => s.source === kind && !owned.has(s.id));
    burst(o.x, o.y, ['#ffd700', '#ffffff', '#ff80ab', '#80d8ff', '#b9f6ca'], 30, 300);
    if (pool.length) {
      const s = pick(pool);
      owned.add(s.id); saveOwned(); gotSkins.push(s);
      Sound.special();
      banner = { skin: s, kind, life: 2.4 };
    } else {
      const n = kind === 'star' ? 5 : 3;
      addCoins(n); Sound.box(n);
      floatText(o.x, o.y - 26, `${kind === 'star' ? '⭐ 별' : '🎁 선물'} 보너스! +${n}개`, '#ff6d00', 30);
    }
  }
  const addCoins = (n) => { coins += fx.double > 0 ? n * 2 : n; };

  // ===== 효과 =====
  function burst(x, y, colors, n = 12, speed = 220, size = [3, 6], grav = 300) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, s = rand(speed * 0.3, speed);
      particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: rand(0.4, 0.8), max: 0.8, color: pick(colors), size: rand(size[0], size[1]), grav });
    }
  }
  function floatText(x, y, text, color, size = 30) { texts.push({ x, y, text, color, size, life: 1.1 }); }

  // ===== 특수 기능 =====
  const isEnemy = (o) => (o.type === 'bird' && !o.flee) || (o.type === 'fireball' && !o.dead);
  function defeat(o) {
    if (o.type === 'fireball') { o.dead = true; burst(o.x, o.y, ['#ffeb3b', '#ff9800', '#ff5722'], 10, 160); return; }
    o.flee = true; o.defeated = true;
    burst(o.x, o.y, ['#ffffff', '#ffe082', o.color], 12, 200);
    floatText(o.x, o.y - 24, '퇴치!', '#7c4dff', 22);
    Sound.pop();
  }
  function spawnProj(ab, ang) {
    projs.push({
      x: CONFIG.droneX + 34, y: drone.y, vx: Math.cos(ang) * ab.speed, vy: Math.sin(ang) * ab.speed,
      r: ab.r, look: ab.look, pierce: !!ab.pierce, bomb: ab.bomb || 0, boomerang: !!ab.boomerang, t: 0, spin: 0,
    });
  }
  function useSkill() {
    if (state !== 'playing' || abUses <= 0) return;
    const ab = skin().ability;
    abUses--; updateSkillBtn(); Sound.skill();
    const dx0 = CONFIG.droneX;
    floatText(dx0 + 30, drone.y - 46, `${ab.icon} ${ab.name}!`, '#6a1b9a', 24);
    switch (ab.type) {
      case 'shield': fx.shield = ab.dur; fx.shieldLook = ab.look; break;
      case 'heal':
        hearts = Math.min(maxHearts(), hearts + 1);
        burst(dx0, drone.y, ['#ff4d6d', '#ff8fab', '#ffffff'], 16, 160);
        break;
      case 'magnet': case 'slow': case 'double': case 'dash': fx[ab.type] = ab.dur; break;
      case 'proj':
        ab.shots.forEach((a, i) => pendingShots.push({ t: (ab.burst || 0) * i, ab, ang: a }));
        break;
      case 'cone': fx.cone = { t: ab.dur, len: ab.len, look: ab.look }; break;
      case 'swipe': fx.swipe = { t: ab.dur, max: ab.dur, r: ab.radius }; break;
      case 'ring': fx.ring = { t: 0, max: 0.7, R: ab.radius }; break;
      case 'beam': fx.beam = { t: ab.dur, max: ab.dur, look: ab.look }; break;
      case 'lightning': {
        const targets = objs.filter((o) => isEnemy(o) && o.x > dx0 - 40 && o.x < W)
          .sort((a, b) => Math.hypot(a.x - dx0, a.y - drone.y) - Math.hypot(b.x - dx0, b.y - drone.y)).slice(0, ab.count);
        targets.forEach((o) => { bolts.push({ x1: dx0 + 20, y1: drone.y, x2: o.x, y2: o.y, t: 0.35 }); defeat(o); });
        if (!targets.length) floatText(dx0 + 60, drone.y, '새가 없어요!', '#555', 20);
        break;
      }
      case 'clear':
        flash = Math.max(flash, 0.6);
        objs.forEach((o) => { if (isEnemy(o) && o.x < W + 20) defeat(o); });
        break;
      case 'tocoins':
        flash = Math.max(flash, 0.4);
        objs.forEach((o) => {
          if (o.type === 'bird' && !o.flee && o.x < W + 20) {
            o.dead = true; burst(o.x, o.y, ['#ff5252', '#ffeb3b', '#66bb6a', '#42a5f5', '#ab47bc'], 10, 160);
            objs.push({ type: 'coin', x: o.x, y: o.y, base: o.y, phase: 0 });
          } else if (o.type === 'fireball') o.dead = true;
        });
        break;
      default: break;
    }
  }

  function inCone(o, dx0, len) {
    const d = o.x - (dx0 + 24);
    return d > -10 && d < len && Math.abs(o.y - drone.y) < 30 + d * 0.3;
  }
  const CONE_COLORS = {
    fire: ['#ff5722', '#ff9800', '#ffeb3b'], smoke: ['#9e9e9e', '#bdbdbd', '#757575'], juice: ['#ff9800', '#ffb74d', '#ffe0b2'],
    wind: ['#ffffff', '#e3f2fd', '#b3e5fc'], pollen: ['#f8bbd0', '#fff59d', '#ffffff'], ice: ['#b3e5fc', '#e1f5fe', '#ffffff'],
    ink: ['#4a148c', '#311b92', '#6a1b9a'],
  };

  function updateAbilities(dt) {
    const dx0 = CONFIG.droneX;
    for (const k of ['shield', 'magnet', 'slow', 'double', 'dash']) if (fx[k] > 0) fx[k] -= dt;
    // 연속 발사 대기열
    for (const p of pendingShots) { p.t -= dt; if (p.t <= 0) spawnProj(p.ab, p.ang); }
    pendingShots = pendingShots.filter((p) => p.t > 0);
    // 발사체
    for (const p of projs) {
      p.t += dt; p.spin += dt * 14;
      if (p.boomerang) p.vx -= 1500 * dt;
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.look === 'fire' || p.look === 'bigseed') particles.push({ x: p.x - 8, y: p.y, vx: -60, vy: rand(-20, 20), life: 0.25, max: 0.25, color: p.look === 'fire' ? '#ff9800' : '#a1887f', size: 3, grav: 0 });
      if (p.bomb && p.t > 0.9) { explode(p); continue; }
      for (const o of objs) {
        if (!isEnemy(o)) continue;
        if (Math.hypot(o.x - p.x, o.y - p.y) < p.r + 18) {
          if (p.bomb) { explode(p); break; }
          defeat(o);
          if (!p.pierce) { p.gone = true; break; }
        }
      }
      if (p.x > W + 60 || p.x < -60 || p.y < -60 || p.y > H + 60 || (p.boomerang && p.vx < 0 && p.x < dx0)) p.gone = true;
    }
    projs = projs.filter((p) => !p.gone);
    // 내뿜기 (불, 매연, 주스 …)
    if (fx.cone) {
      fx.cone.t -= dt;
      const cols = CONE_COLORS[fx.cone.look] || CONE_COLORS.fire;
      for (let i = 0; i < 4; i++) {
        const a = rand(-0.28, 0.28), sp = rand(380, 520);
        particles.push({ x: dx0 + 30, y: drone.y + rand(-6, 6), vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: fx.cone.len / 520, max: fx.cone.len / 520, color: pick(cols), size: rand(4, 9), grav: 0, grow: fx.cone.look === 'smoke' || fx.cone.look === 'ink' });
      }
      objs.forEach((o) => { if (isEnemy(o) && inCone(o, dx0, fx.cone.len)) defeat(o); });
      if (fx.cone.t <= 0) fx.cone = null;
    }
    if (fx.swipe) {
      fx.swipe.t -= dt;
      objs.forEach((o) => { if (isEnemy(o) && Math.hypot(o.x - dx0, o.y - drone.y) < fx.swipe.r) defeat(o); });
      if (fx.swipe.t <= 0) fx.swipe = null;
    }
    if (fx.ring) {
      fx.ring.t += dt;
      const r = fx.ring.R * Math.min(1, fx.ring.t / fx.ring.max);
      objs.forEach((o) => { if (isEnemy(o) && Math.hypot(o.x - dx0, o.y - drone.y) < r) defeat(o); });
      if (fx.ring.t > fx.ring.max) fx.ring = null;
    }
    if (fx.beam) {
      fx.beam.t -= dt;
      objs.forEach((o) => { if (isEnemy(o) && o.x > dx0 && Math.abs(o.y - drone.y) < 36) defeat(o); });
      if (fx.beam.t <= 0) fx.beam = null;
    }
    for (const b of bolts) b.t -= dt;
    bolts = bolts.filter((b) => b.t > 0);
    // 코인 자석
    if (fx.magnet > 0) {
      for (const o of objs) {
        if (!['coin', 'box', 'gift', 'star'].includes(o.type)) continue;
        if (o.x < W && Math.hypot(o.x - dx0, o.base - drone.y) < 380) {
          const k = Math.min(1, dt * 5);
          o.x += (dx0 - o.x) * k; o.base += (drone.y - o.base) * k;
        }
      }
    }
  }
  function explode(p) {
    p.gone = true;
    burst(p.x, p.y, ['#e53935', '#43a047', '#ffffff', '#212121'], 26, 300);
    Sound.boom();
    objs.forEach((o) => { if (isEnemy(o) && Math.hypot(o.x - p.x, o.y - p.y) < p.bomb) defeat(o); });
  }

  // ===== 운석 (15단계) =====
  function startMeteor() {
    meteor = { t: 0, x0: W + 120, y0: -120, x1: W * 0.62, y1: H * 0.36, done: false };
    floatText(W / 2, 120, '☄️ 앗! 하늘에서 운석이…!', '#d84315', 34);
  }
  function updateMeteor(dt) {
    if (!meteor || meteor.done) return;
    meteor.t += dt;
    const k = Math.min(1, meteor.t / 1.4);
    meteor.x = meteor.x0 + (meteor.x1 - meteor.x0) * k;
    meteor.y = meteor.y0 + (meteor.y1 - meteor.y0) * k;
    particles.push({ x: meteor.x + rand(-10, 10), y: meteor.y + rand(-10, 10), vx: 120, vy: -90, life: 0.5, max: 0.5, color: pick(['#ff9800', '#ffeb3b', '#ff5722']), size: rand(4, 9), grav: 0 });
    if (k >= 1) {
      meteor.done = true; rage = true; shakeT = 0.8; flash = 1;
      Sound.boom();
      // 운석 조각: 보기만 하고 드론에 피해 없음
      for (let i = 0; i < 40; i++) {
        const a = Math.random() * Math.PI * 2, s = rand(150, 520);
        particles.push({ x: meteor.x, y: meteor.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 120, life: rand(1, 1.8), max: 1.8, color: pick(['#6d4c41', '#8d6e63', '#5d4037', '#ff7043']), size: rand(5, 11), grav: 420, rock: true });
      }
      burst(meteor.x, meteor.y, ['#ffeb3b', '#ff9800', '#ffffff'], 40, 420);
      floatText(W / 2, H / 2, '쾅! 익룡들이 화가 났어요! 🔥', '#d84315', 36);
      objs.forEach((o) => { if (o.type === 'bird') o.fire = true; });
    }
  }

  // ===== 업데이트 =====
  function moveObj(o, dt, speed) {
    if (o.type === 'fireball') { o.x -= (speed + 230) * dt; o.phase += dt; return; }
    o.x -= speed * dt;
    o.phase += dt;
    if (o.type === 'bird') {
      if (o.flee) { o.y -= 260 * dt; return; }
      if (o.zig) {
        o.y += o.vy * dt;
        if (o.y < laneY(5)) { o.y = laneY(5); o.vy = Math.abs(o.vy); }
        if (o.y > laneY(1)) { o.y = laneY(1); o.vy = -Math.abs(o.vy); }
      } else o.y = o.move ? o.mid + Math.sin(o.phase * o.w) * o.amp : o.base + Math.sin(o.phase * 3) * 6;
    } else if (o.type === 'box' || o.type === 'gift') o.y = o.base + Math.sin(o.phase * 2.5) * 4;
    else if (o.type === 'star') o.y = o.base + Math.sin(o.phase * 3) * 14;
    else if (o.type === 'coin') o.y = o.base;
  }

  function update(dt) {
    time += dt;
    const st = CONFIG.stages[stageIdx];
    drone.rot += dt * 40;
    if (banner) { banner.life -= dt; if (banner.life <= 0) banner = null; }
    if (shakeT > 0) shakeT -= dt;
    if (flash > 0) flash -= dt * 1.5;

    if (state === 'title') { scroll += 60 * dt; drone.y = laneY(3) + Math.sin(time * 2) * 20; return; }
    if (state === 'over' || state === 'cleared') { updateFx(dt); return; }

    if (state === 'intro') {
      phaseT += dt;
      scroll += st.speed * 0.6 * dt;
      drone.y += (laneY(3) + Math.sin(time * 3) * 6 - drone.y) * Math.min(1, dt * 4);
      if (phaseT >= 2.4) { state = 'playing'; phaseT = 0; Sound.go(); }
      updateFx(dt);
      return;
    }

    if (state === 'crashing') {
      phaseT += dt;
      drone.vy += 900 * dt; drone.y += drone.vy * dt; drone.spin += dt * 12;
      if (drone.y > CONFIG.playBottom - 14) { drone.y = CONFIG.playBottom - 14; drone.vy *= -0.3; }
      updateFx(dt);
      if (phaseT > 1.3) gameOver();
      return;
    }

    if (state === 'clear') {
      phaseT += dt;
      scroll += st.speed * 0.6 * dt;
      drone.y += (laneY(3) - drone.y) * Math.min(1, dt * 3);
      objs.forEach((o) => { if (o.type === 'bird') o.flee = true; if (o.type === 'fireball') o.dead = true; moveObj(o, dt, st.speed); });
      objs = objs.filter((o) => !o.dead);
      if (Math.random() < dt * 8) burst(rand(200, 760), rand(120, 300), ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93'], 18, 260);
      updateFx(dt);
      if (phaseT > 1.6) stageCleared();
      return;
    }

    // ---- playing ----
    const sf = fx.slow > 0 ? 0.5 : 1;          // 느릿느릿 구름: 세상이 절반 속도
    const sdt = dt * sf;
    scroll += st.speed * sdt;
    playT += dt;
    if (invuln > 0) invuln -= dt;

    // 드론 물리
    const acc = holding() ? -CONFIG.lift : CONFIG.gravity;
    drone.vy += acc * dt;
    drone.vy = Math.max(-CONFIG.maxUp, Math.min(CONFIG.maxDown, drone.vy));
    drone.y += drone.vy * dt;
    const top = CONFIG.playTop + CONFIG.droneHalfH, bot = CONFIG.playBottom - CONFIG.droneHalfH;
    if (drone.y < top) { drone.y = top; drone.vy = 0; }
    if (drone.y > bot) { drone.y = bot; drone.vy = 0; }
    drone.angle = Math.max(-0.25, Math.min(0.25, drone.vy / 1400));

    // 5층 캠핑 판정
    if (laneOf(drone.y) === 5) campT += dt; else campT = 0;
    camping = campT >= CONFIG.campTime;

    // 생성
    spawnT -= sdt;
    if (spawnT <= 0) {
      spawnT += st.interval / 2;
      if (nextBirds) spawnBirds(); else spawnCoins();
      nextBirds = !nextBirds;
    }

    // 15단계: 코인 40개가 되면 운석!
    if (st.meteorAt && !meteor && coins >= st.meteorAt) startMeteor();
    updateMeteor(dt);

    updateAbilities(dt);

    // 이동 & 충돌
    const dx0 = CONFIG.droneX;
    const fireballs = [];
    for (const o of objs) {
      moveObj(o, sdt, st.speed);
      // 화난 익룡은 불덩이를 뿜어요
      if (o.type === 'bird' && o.fire && !o.flee && o.shots < 2 && o.x < W - 60 && o.x > dx0 + 160) {
        o.shootCd -= sdt;
        if (o.shootCd <= 0) { o.shootCd = 1.4; o.shots++; fireballs.push({ type: 'fireball', x: o.x - 34, y: o.y + 2, phase: 0 }); }
      }
      const dx = o.x - dx0, dy = o.y - drone.y;
      if (isEnemy(o)) {
        const rx = o.type === 'fireball' ? 26 + 11 : 26 + 16, ry = o.type === 'fireball' ? 14 + 11 : 14 + 16;
        const nx = dx / rx, ny = dy / ry;
        if (nx * nx + ny * ny < 1) {
          if (fx.shield > 0 || fx.dash > 0) { defeat(o); continue; }
          if (invuln > 0) continue;
          hearts--;
          if (o.type === 'bird') o.flee = true; else o.dead = true;
          burst(dx0, drone.y, ['#ffffff', '#ffd166', '#ff6b6b', o.color || '#ff9800'], 22, 260);
          if (hearts <= 0) {
            state = 'crashing'; phaseT = 0; drone.vy = -250;
            Sound.crash(); showButtons(false);
            return;
          }
          invuln = CONFIG.invulnTime; Sound.hit();
          floatText(dx0, drone.y - 44, `아야! 💗 ${hearts}개 남았어요`, '#e53935', 26);
        }
      } else if (o.type !== 'bird' && o.type !== 'fireball' && !o.dead) {
        const r = o.type === 'coin' ? 15 : 20;
        const nx = dx / (34 + r), ny = dy / (22 + r);
        if (nx * nx + ny * ny < 1) {
          o.dead = true;
          if (o.type === 'coin') {
            addCoins(1); Sound.coin();
            burst(o.x, o.y, ['#ffd700', '#fff3a0', '#ffb300'], 8, 160);
            floatText(o.x, o.y - 20, fx.double > 0 ? '+2' : '+1', '#ffb300', 26);
          } else if (o.type === 'box') {
            const n = randInt(0, 5);
            addCoins(n); Sound.box(n);
            burst(o.x, o.y, ['#b388ff', '#ffd700', '#ffffff', '#ff80ab'], 20, 240);
            floatText(o.x, o.y - 26, n === 0 ? '꽝! 0개 😅' : `🎁 +${fx.double > 0 ? n * 2 : n}개!`, n === 0 ? '#7e57c2' : '#ff6d00', 36);
          } else {
            grantSkin(o.type, o);
          }
        }
      }
    }
    objs.push(...fireballs);
    objs = objs.filter((o) => o.x > -80 && o.y > -60 && !o.dead);

    // 드론 효과 파티클
    if (holding() && Math.random() < dt * 30) {
      particles.push({ x: dx0 + rand(-28, 28), y: drone.y + 16, vx: rand(-30, 30) - 60, vy: rand(80, 160), life: 0.3, max: 0.3, color: 'rgba(255,255,255,0.8)', size: rand(2, 4), grav: 0 });
    }
    if (fx.dash > 0) {
      for (let i = 0; i < 3; i++) particles.push({ x: dx0 - 30, y: drone.y + rand(-8, 8), vx: -rand(250, 400), vy: rand(-30, 30), life: 0.3, max: 0.3, color: pick(['#ff9800', '#ffeb3b', '#ff5722']), size: rand(4, 7), grav: 0 });
    }

    updateFx(dt);

    if (coins >= st.target) {
      state = 'clear'; phaseT = 0; invuln = 0;
      newSkins = [];
      if (stageIdx + 2 > unlocked && stageIdx < LAST) {
        unlocked = stageIdx + 2; store.write('droneCoin.unlocked', String(unlocked));
        newSkins = DRONES.skins.filter((s) => s.stage === unlocked);
      }
      showButtons(false);
      Sound.clear();
      floatText(W / 2, H / 2 - 40, stageIdx === LAST ? 'GAME CLEAR!' : 'STAGE CLEAR!', '#ff6d00', 64);
    }
  }

  function updateFx(dt) {
    for (const p of particles) {
      p.x += p.vx * dt; p.y += p.vy * dt; p.vy += p.grav * dt; p.life -= dt;
      if (p.grow) p.size += dt * 14;
    }
    particles = particles.filter((p) => p.life > 0);
    for (const t of texts) { t.y -= 40 * dt; t.life -= dt; }
    texts = texts.filter((t) => t.life > 0);
  }

  // ===== 그리기 =====
  function drawDrone(x, y, ang, rot) {
    DRONES.draw(ctx, skin(), x, y, ang, rot, time);
  }

  function drawBird(o) {
    if (o.ptero) { drawPtero(o); return; }
    const g = ctx, flap = Math.sin(o.phase * 14), space = stageIdx === SPACE_STAGE;
    const body = space ? '#eef1f4' : o.color;
    g.save(); g.translate(o.x, o.y);
    if (o.flee) g.rotate(-0.5);
    // 우주복 산소통
    if (space) { g.fillStyle = '#b0bec5'; rr(g, 10, -12, 10, 18, 4); g.fill(); g.fillStyle = '#ff7043'; g.fillRect(12, -14, 6, 3); }
    // 꼬리
    g.fillStyle = shade(o.color, -25);
    g.beginPath(); g.moveTo(16, -2); g.lineTo(30, -10); g.lineTo(28, 2); g.lineTo(31, 9); g.lineTo(15, 5); g.fill();
    // 뒷날개
    g.fillStyle = shade(o.color, -30);
    g.save(); g.translate(4, -4); g.rotate(-0.4 - flap * 0.7);
    g.beginPath(); g.ellipse(6, -8, 8, 15, 0.3, 0, Math.PI * 2); g.fill(); g.restore();
    // 몸 (우주에서는 하얀 우주복)
    g.fillStyle = body;
    g.beginPath(); g.ellipse(0, 0, 20, 15, 0, 0, Math.PI * 2); g.fill();
    if (space) {
      g.strokeStyle = '#90a4ae'; g.lineWidth = 1.5; g.stroke();
      g.fillStyle = '#90a4ae'; g.fillRect(-14, 5, 26, 3);
      g.fillStyle = '#cfd8dc'; rr(g, -4, -3, 12, 8, 2); g.fill();
      g.fillStyle = '#e53935'; g.beginPath(); g.arc(-1, 1, 1.5, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#43a047'; g.beginPath(); g.arc(3, 1, 1.5, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#1e88e5'; g.beginPath(); g.arc(7, 1, 1.5, 0, Math.PI * 2); g.fill();
    } else {
      g.fillStyle = shade(o.color, 45);
      g.beginPath(); g.ellipse(-4, 6, 12, 7, 0, 0, Math.PI * 2); g.fill();
    }
    // 앞날개 (우주복 소매)
    g.fillStyle = space ? '#dfe5ea' : shade(o.color, -12);
    g.save(); g.translate(2, -2); g.rotate(0.2 + flap * 0.8);
    g.beginPath(); g.ellipse(6, -6, 7, 14, 0.5, 0, Math.PI * 2); g.fill();
    if (space) { g.fillStyle = o.color; g.beginPath(); g.ellipse(9, -17, 4, 4, 0.5, 0, Math.PI * 2); g.fill(); }
    g.restore();
    // 머리 (우주에서는 새 색깔 머리가 헬멧 안에)
    if (space) { g.fillStyle = o.color; g.beginPath(); g.arc(-10, -4, 9, 0, Math.PI * 2); g.fill(); }
    // 부리
    g.fillStyle = '#ffb300';
    g.beginPath(); g.moveTo(-18, -4); g.lineTo(-29, 0); g.lineTo(-18, 4); g.fill();
    // 눈 + 화난 눈썹 (부딪힌 새는 어지러운 눈)
    g.fillStyle = '#fff'; g.beginPath(); g.arc(-9, -5, 5.5, 0, Math.PI * 2); g.fill();
    if (o.flee) {
      g.strokeStyle = '#111'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(-12, -8); g.lineTo(-6, -2); g.moveTo(-6, -8); g.lineTo(-12, -2); g.stroke();
    } else {
      g.fillStyle = '#111'; g.beginPath(); g.arc(-11, -4.5, 2.8, 0, Math.PI * 2); g.fill();
      g.strokeStyle = '#222'; g.lineWidth = 2.5; g.lineCap = 'round';
      g.beginPath(); g.moveTo(-16, -13); g.lineTo(-4, -9); g.stroke();
    }
    // 우주 헬멧: 머리만 감싸는 작은 유리 헬멧
    if (space) {
      g.fillStyle = 'rgba(180,230,255,0.22)'; g.strokeStyle = 'rgba(220,245,255,0.95)'; g.lineWidth = 2;
      g.beginPath(); g.arc(-13, -4, 17, 0, Math.PI * 2); g.fill(); g.stroke();
      g.fillStyle = 'rgba(255,255,255,0.7)'; g.beginPath(); g.ellipse(-20, -13, 4, 2.2, -0.6, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#b0bec5'; g.fillRect(-2, -10, 4, 13);
    }
    g.restore();
  }

  // 🦖 익룡 (15단계)
  function drawPtero(o) {
    const g = ctx, flap = Math.sin(o.phase * 9);
    g.save(); g.translate(o.x, o.y);
    if (o.flee) g.rotate(-0.5);
    const dark = shade(o.color, -30);
    // 뒷날개
    g.fillStyle = dark;
    g.beginPath(); g.moveTo(-2, -4); g.quadraticCurveTo(10, -30 * flap - 10, 30, -34 * flap - 6); g.lineTo(18, 2); g.closePath(); g.fill();
    // 꼬리
    g.strokeStyle = dark; g.lineWidth = 3; g.beginPath(); g.moveTo(14, 2); g.lineTo(30, 6); g.stroke();
    // 몸
    g.fillStyle = o.color; g.beginPath(); g.ellipse(4, 0, 18, 9, 0, 0, Math.PI * 2); g.fill();
    // 앞날개
    g.fillStyle = shade(o.color, 15);
    g.beginPath(); g.moveTo(-4, -2); g.quadraticCurveTo(4, -40 * flap - 4, 24, -44 * flap); g.quadraticCurveTo(14, -10, 16, 4); g.closePath(); g.fill();
    g.strokeStyle = dark; g.lineWidth = 1.2; g.stroke();
    // 머리 + 볏 + 긴 부리
    g.fillStyle = o.color; g.beginPath(); g.ellipse(-16, -6, 10, 7, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#e57373'; g.beginPath(); g.moveTo(-12, -10); g.lineTo(6, -24); g.lineTo(-6, -6); g.fill();
    g.fillStyle = '#ffcc80'; g.beginPath(); g.moveTo(-22, -8); g.lineTo(-44, -3); g.lineTo(-22, -1); g.fill();
    g.fillStyle = '#fff'; g.beginPath(); g.arc(-17, -8, 3.5, 0, Math.PI * 2); g.fill();
    if (o.flee) {
      g.strokeStyle = '#111'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(-19, -10); g.lineTo(-15, -6); g.moveTo(-15, -10); g.lineTo(-19, -6); g.stroke();
    } else {
      g.fillStyle = '#111'; g.beginPath(); g.arc(-18, -8, 1.8, 0, Math.PI * 2); g.fill();
      g.strokeStyle = '#222'; g.lineWidth = 2; g.beginPath(); g.moveTo(-22, -13); g.lineTo(-13, -11); g.stroke();
    }
    // 화난 익룡: 입에서 불꽃
    if (o.fire && !o.flee) {
      const f = 8 + Math.abs(Math.sin(time * 25)) * 8;
      g.fillStyle = '#ff7043'; g.beginPath(); g.moveTo(-42, -6); g.lineTo(-42 - f, -3); g.lineTo(-42, 0); g.fill();
      g.fillStyle = '#ffeb3b'; g.beginPath(); g.moveTo(-42, -4.5); g.lineTo(-42 - f * 0.6, -3); g.lineTo(-42, -1.5); g.fill();
    }
    g.restore();
  }

  function drawFireball(o) {
    const g = ctx;
    g.save(); g.translate(o.x, o.y);
    const gr = g.createRadialGradient(0, 0, 2, 0, 0, 20);
    gr.addColorStop(0, '#fff59d'); gr.addColorStop(0.4, '#ffb300'); gr.addColorStop(1, 'rgba(255,87,34,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 20, 0, Math.PI * 2); g.fill();
    g.fillStyle = 'rgba(255,87,34,0.6)';
    g.beginPath(); g.moveTo(6, -10); g.quadraticCurveTo(30 + Math.sin(time * 30) * 4, 0, 6, 10); g.fill();
    g.restore();
    if (Math.random() < 0.5) particles.push({ x: o.x + 10, y: o.y + rand(-6, 6), vx: 80, vy: rand(-30, 30), life: 0.3, max: 0.3, color: pick(['#ff9800', '#ffeb3b']), size: rand(2, 4), grav: 0 });
  }

  function drawCoin(o) {
    const g = ctx, s = Math.abs(Math.cos(o.phase * 4)), rx = Math.max(3, 15 * s);
    g.save(); g.translate(o.x, o.y);
    g.fillStyle = '#c98a00';
    g.beginPath(); g.ellipse(1.5, 1.5, rx, 15, 0, 0, Math.PI * 2); g.fill();
    const grd = g.createRadialGradient(-4, -5, 2, 0, 0, 16);
    grd.addColorStop(0, '#fff6b0'); grd.addColorStop(0.5, '#ffd43b'); grd.addColorStop(1, '#f5a700');
    g.fillStyle = grd; g.beginPath(); g.ellipse(0, 0, rx, 15, 0, 0, Math.PI * 2); g.fill();
    if (s > 0.45) {
      g.strokeStyle = '#e09400'; g.lineWidth = 1.5;
      g.beginPath(); g.ellipse(0, 0, rx * 0.72, 10.8, 0, 0, Math.PI * 2); g.stroke();
      g.fillStyle = '#e09400'; star(g, 0, 0, 6.5 * s, 3 * s, 5); g.fill();
    }
    g.restore();
  }
  function star(g, x, y, R, r, n) {
    g.beginPath();
    for (let i = 0; i < n * 2; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / n, rad = i % 2 ? r : R;
      g.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad);
    }
    g.closePath();
  }

  function drawBox(o) {
    const g = ctx;
    g.save(); g.translate(o.x, o.y); g.rotate(Math.sin(o.phase * 3) * 0.08);
    g.fillStyle = `rgba(255, 230, 120, ${0.25 + 0.15 * Math.sin(o.phase * 6)})`;
    g.beginPath(); g.arc(0, 0, 30, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#7c4dff'; rr(g, -18, -16, 36, 34, 6); g.fill();
    g.fillStyle = '#9e7bff'; rr(g, -21, -22, 42, 10, 4); g.fill();
    g.fillStyle = '#ffd43b'; g.fillRect(-4, -22, 8, 40);
    g.beginPath(); g.ellipse(-7, -25, 7, 4, -0.4, 0, Math.PI * 2); g.ellipse(7, -25, 7, 4, 0.4, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#fff'; g.font = `24px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.strokeStyle = '#4a2a9e'; g.lineWidth = 4; g.strokeText('?', -0.5, 3); g.fillText('?', -0.5, 3);
    g.restore();
  }

  // 🎁 선물박스: 빨간 상자 + 초록 리본 (랜덤박스와 다르게)
  function drawGift(o) {
    const g = ctx, glow = 0.35 + 0.2 * Math.sin(o.phase * 6);
    g.save(); g.translate(o.x, o.y); g.rotate(Math.sin(o.phase * 3) * 0.1);
    const gr = g.createRadialGradient(0, 0, 6, 0, 0, 40);
    gr.addColorStop(0, `rgba(255,255,255,${glow})`); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 40, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#e53935'; rr(g, -18, -12, 36, 30, 5); g.fill();
    g.fillStyle = '#ff5252'; rr(g, -21, -19, 42, 10, 4); g.fill();
    g.fillStyle = '#2e7d32'; g.fillRect(-4, -19, 8, 37); g.fillRect(-18, 0, 36, 6);
    g.fillStyle = '#43a047';
    g.beginPath(); g.ellipse(-8, -23, 9, 5, -0.5, 0, Math.PI * 2); g.ellipse(8, -23, 9, 5, 0.5, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#2e7d32'; g.beginPath(); g.arc(0, -21, 3.5, 0, Math.PI * 2); g.fill();
    for (let i = 0; i < 3; i++) {
      const a = o.phase * 2 + i * 2.1, x = Math.cos(a) * 30, y = Math.sin(a) * 24;
      g.fillStyle = '#fff59d'; star(g, x, y, 4, 1.6, 4); g.fill();
    }
    g.restore();
  }

  // ⭐ 별: 반짝이며 크게 출렁이는 별
  function drawStar(o) {
    const g = ctx;
    g.save(); g.translate(o.x, o.y);
    const gr = g.createRadialGradient(0, 0, 4, 0, 0, 46);
    gr.addColorStop(0, 'rgba(255,245,160,0.8)'); gr.addColorStop(1, 'rgba(255,245,160,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 46, 0, Math.PI * 2); g.fill();
    g.rotate(Math.sin(o.phase * 2) * 0.3);
    const sg = g.createLinearGradient(0, -22, 0, 22); sg.addColorStop(0, '#fff59d'); sg.addColorStop(1, '#ffa000');
    g.fillStyle = sg; star(g, 0, 0, 24, 11, 5); g.fill();
    g.strokeStyle = '#e65100'; g.lineWidth = 2; g.stroke();
    g.fillStyle = '#5d4037'; g.beginPath(); g.arc(-5, -1, 2.5, 0, Math.PI * 2); g.arc(5, -1, 2.5, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#5d4037'; g.lineWidth = 1.5; g.beginPath(); g.arc(0, 3, 4, 0.2, Math.PI - 0.2); g.stroke();
    g.restore();
    if (Math.random() < 0.5) particles.push({ x: o.x + rand(-20, 20), y: o.y + rand(-20, 20), vx: rand(-40, 40), vy: rand(-40, 40), life: 0.4, max: 0.4, color: pick(['#fff59d', '#ffffff', '#ffd54f']), size: rand(1.5, 3), grav: 0 });
  }

  // ----- 특수 기능 그림 -----
  function drawProj(p) {
    const g = ctx;
    g.save(); g.translate(p.x, p.y);
    const ang = Math.atan2(p.vy, p.vx);
    switch (p.look) {
      case 'missile':
        g.rotate(ang); g.fillStyle = '#eceff1'; rr(g, -10, -4, 18, 8, 4); g.fill();
        g.fillStyle = '#e53935'; g.beginPath(); g.moveTo(8, -4); g.lineTo(14, 0); g.lineTo(8, 4); g.fill();
        g.fillStyle = '#ff9800'; g.beginPath(); g.moveTo(-10, -3); g.lineTo(-18 - Math.random() * 6, 0); g.lineTo(-10, 3); g.fill(); break;
      case 'sting': g.rotate(ang); g.fillStyle = '#3e2723'; g.beginPath(); g.moveTo(-8, -3); g.lineTo(10, 0); g.lineTo(-8, 3); g.fill(); break;
      case 'bullet': g.fillStyle = '#ffd54f'; g.beginPath(); g.ellipse(0, 0, 8, 4, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(3, -1, 1.5, 0, Math.PI * 2); g.fill(); break;
      case 'bubble':
        g.fillStyle = 'rgba(150,220,255,0.35)'; g.strokeStyle = 'rgba(200,240,255,0.95)'; g.lineWidth = 2;
        g.beginPath(); g.arc(0, 0, p.r, 0, Math.PI * 2); g.fill(); g.stroke();
        g.fillStyle = 'rgba(255,255,255,0.8)'; g.beginPath(); g.arc(-4, -5, 3, 0, Math.PI * 2); g.fill(); break;
      case 'bigseed':
        g.rotate(p.spin * 0.3); g.fillStyle = '#c8a165'; g.beginPath(); g.ellipse(0, 0, 22, 14, 0, 0, Math.PI * 2); g.fill();
        g.strokeStyle = '#8d6e3f'; g.lineWidth = 2; g.stroke();
        g.strokeStyle = 'rgba(140,100,50,0.6)'; for (let k = -12; k <= 12; k += 6) { g.beginPath(); g.moveTo(k, -10); g.lineTo(k + 3, 10); g.stroke(); } break;
      case 'spike':
        g.rotate(ang); g.fillStyle = '#9ccc65'; g.beginPath(); g.moveTo(-8, -4); g.lineTo(12, 0); g.lineTo(-8, 4); g.fill();
        g.strokeStyle = '#558b2f'; g.lineWidth = 1; g.stroke(); break;
      case 'seed': g.rotate(ang); g.fillStyle = '#fff176'; g.beginPath(); g.ellipse(0, 0, 6, 3.5, 0, 0, Math.PI * 2); g.fill(); g.strokeStyle = '#c0a000'; g.stroke(); break;
      case 'wave': {
        const h = 60;
        g.fillStyle = 'rgba(41,182,246,0.55)';
        g.beginPath(); g.moveTo(-30, h); g.quadraticCurveTo(-10, -h, 26, -h * 0.6); g.quadraticCurveTo(4, -h * 0.3, 10, h); g.closePath(); g.fill();
        g.strokeStyle = 'rgba(255,255,255,0.9)'; g.lineWidth = 4;
        g.beginPath(); g.moveTo(-14, -h * 0.4); g.quadraticCurveTo(10, -h, 26, -h * 0.6); g.stroke();
        if (Math.random() < 0.6) particles.push({ x: p.x + rand(-20, 20), y: p.y + rand(-50, 50), vx: -40, vy: rand(-40, 0), life: 0.4, max: 0.4, color: pick(['#ffffff', '#b3e5fc']), size: rand(2, 5), grav: 200 });
        break;
      }
      case 'melon':
        g.rotate(p.spin * 0.5); g.fillStyle = '#43a047'; g.beginPath(); g.arc(0, 0, 15, 0, Math.PI * 2); g.fill();
        g.strokeStyle = '#1b5e20'; g.lineWidth = 3; for (const k of [-8, 0, 8]) { g.beginPath(); g.moveTo(k, -14); g.quadraticCurveTo(k + 4, 0, k, 14); g.stroke(); } break;
      case 'banana':
        g.rotate(p.spin); g.fillStyle = '#fdd835'; g.beginPath(); g.moveTo(-16, -4); g.quadraticCurveTo(0, 16, 16, -4); g.quadraticCurveTo(0, 6, -16, -4); g.fill();
        g.strokeStyle = '#a89200'; g.lineWidth = 1.5; g.stroke(); break;
      case 'bamboo':
        g.rotate(ang); g.fillStyle = '#7cb342'; g.fillRect(-26, -4, 46, 8);
        g.fillStyle = '#558b2f'; for (const k of [-14, 0, 12]) g.fillRect(k, -5, 3, 10);
        g.fillStyle = '#aed581'; g.beginPath(); g.moveTo(20, -4); g.lineTo(30, 0); g.lineTo(20, 4); g.fill(); break;
      case 'carrot':
        g.rotate(ang); g.fillStyle = '#ff7043'; g.beginPath(); g.moveTo(-8, -5); g.lineTo(12, 0); g.lineTo(-8, 5); g.fill();
        g.fillStyle = '#43a047'; g.beginPath(); g.moveTo(-8, 0); g.lineTo(-16, -6); g.lineTo(-13, 0); g.lineTo(-16, 6); g.fill(); break;
      default: g.fillStyle = '#ff9800'; g.beginPath(); g.arc(0, 0, p.r, 0, Math.PI * 2); g.fill();
    }
    g.restore();
  }

  function drawShield(x, y) {
    if (fx.shield <= 0) return;
    if (fx.shield < 1 && Math.floor(time * 10) % 2) return;
    const g = ctx;
    g.save(); g.translate(x, y);
    switch (fx.shieldLook) {
      case 'clover': {
        g.fillStyle = 'rgba(102,187,106,0.18)'; g.strokeStyle = 'rgba(46,125,50,0.7)'; g.lineWidth = 3;
        g.beginPath(); g.arc(0, 0, 46, 0, Math.PI * 2); g.fill(); g.stroke();
        g.rotate(time * 1.5);
        for (let i = 0; i < 4; i++) {
          g.save(); g.rotate((i * Math.PI) / 2); g.translate(0, -40);
          g.fillStyle = '#43a047';
          g.beginPath(); g.arc(-5, 0, 7, 0, Math.PI * 2); g.arc(5, 0, 7, 0, Math.PI * 2); g.moveTo(-11, 2); g.lineTo(0, 12); g.lineTo(11, 2); g.fill();
          g.fillStyle = 'rgba(255,255,255,0.35)'; g.beginPath(); g.arc(-5, -2, 2.5, 0, Math.PI * 2); g.fill();
          g.restore();
        }
        break;
      }
      case 'crystal':
        g.rotate(time);
        g.fillStyle = 'rgba(128,222,234,0.22)'; g.strokeStyle = 'rgba(0,172,193,0.85)'; g.lineWidth = 3;
        g.beginPath(); for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; g.lineTo(Math.cos(a) * 46, Math.sin(a) * 46); } g.closePath(); g.fill(); g.stroke();
        break;
      case 'shell':
        g.fillStyle = 'rgba(124,179,66,0.3)'; g.strokeStyle = 'rgba(85,139,47,0.9)'; g.lineWidth = 4;
        g.beginPath(); g.ellipse(0, 4, 48, 40, 0, 0, Math.PI * 2); g.fill(); g.stroke();
        g.strokeStyle = 'rgba(85,139,47,0.5)'; g.lineWidth = 2;
        for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; g.beginPath(); g.moveTo(0, 4); g.lineTo(Math.cos(a) * 46, 4 + Math.sin(a) * 38); g.stroke(); }
        break;
      default:
        g.fillStyle = 'rgba(120,200,255,0.22)'; g.strokeStyle = 'rgba(180,230,255,0.95)'; g.lineWidth = 3;
        g.beginPath(); g.arc(0, 0, 44, 0, Math.PI * 2); g.fill(); g.stroke();
        g.fillStyle = 'rgba(255,255,255,0.6)'; g.beginPath(); g.ellipse(-18, -22, 9, 5, -0.6, 0, Math.PI * 2); g.fill();
    }
    g.restore();
  }

  function drawAbilityFx() {
    const g = ctx, dx0 = CONFIG.droneX, y = drone.y;
    if (fx.beam) {
      const a = Math.min(1, fx.beam.t * 4), h = 20 + Math.sin(time * 40) * 4;
      g.save(); g.globalAlpha = a;
      if (fx.beam.look === 'rainbow') {
        ['#ff5252', '#ffa726', '#ffee58', '#66bb6a', '#42a5f5', '#ab47bc'].forEach((c, i) => { g.fillStyle = c; g.fillRect(dx0 + 30, y - h + i * (h * 2 / 6), W, h * 2 / 6 + 1); });
      } else {
        const gr = g.createLinearGradient(0, y - h, 0, y + h);
        const c = fx.beam.look === 'laser' ? ['rgba(255,82,82,0)', '#ff1744', '#ffffff'] : ['rgba(105,240,174,0)', '#00e676', '#ffffff'];
        gr.addColorStop(0, c[0]); gr.addColorStop(0.35, c[1]); gr.addColorStop(0.5, c[2]); gr.addColorStop(0.65, c[1]); gr.addColorStop(1, c[0]);
        g.fillStyle = gr; g.fillRect(dx0 + 30, y - h, W, h * 2);
      }
      g.restore();
    }
    if (fx.swipe) {
      const k = 1 - fx.swipe.t / fx.swipe.max, a0 = k * Math.PI * 4;
      g.save(); g.translate(dx0, y); g.globalAlpha = 0.85;
      g.strokeStyle = '#ff9800'; g.lineWidth = 16; g.lineCap = 'round';
      g.beginPath(); g.arc(0, 0, fx.swipe.r - 20, a0, a0 + 2.2); g.stroke();
      g.strokeStyle = '#222'; g.lineWidth = 16; g.setLineDash([6, 14]);
      g.beginPath(); g.arc(0, 0, fx.swipe.r - 20, a0, a0 + 2.2); g.stroke();
      g.setLineDash([]); g.lineCap = 'butt';
      g.restore();
    }
    if (fx.ring) {
      const r = fx.ring.R * Math.min(1, fx.ring.t / fx.ring.max);
      g.save(); g.globalAlpha = 1 - fx.ring.t / fx.ring.max;
      g.strokeStyle = '#ff80ab'; g.lineWidth = 8; g.beginPath(); g.arc(dx0, y, r, 0, Math.PI * 2); g.stroke();
      g.strokeStyle = '#ffffff'; g.lineWidth = 3; g.beginPath(); g.arc(dx0, y, r * 0.8, 0, Math.PI * 2); g.stroke();
      g.restore();
    }
    if (fx.cone) {
      const cols = CONE_COLORS[fx.cone.look] || CONE_COLORS.fire;
      g.save(); g.globalAlpha = 0.25;
      const gr = g.createLinearGradient(dx0 + 24, 0, dx0 + 24 + fx.cone.len, 0);
      gr.addColorStop(0, cols[0]); gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.beginPath(); g.moveTo(dx0 + 24, y - 20);
      g.lineTo(dx0 + 24 + fx.cone.len, y - 30 - fx.cone.len * 0.3); g.lineTo(dx0 + 24 + fx.cone.len, y + 30 + fx.cone.len * 0.3); g.lineTo(dx0 + 24, y + 20); g.fill();
      g.restore();
    }
    for (const b of bolts) {
      g.save(); g.globalAlpha = Math.min(1, b.t * 4); g.strokeStyle = '#fff176'; g.lineWidth = 4; g.shadowColor = '#ffeb3b'; g.shadowBlur = 12;
      g.beginPath(); g.moveTo(b.x1, b.y1);
      for (let i = 1; i < 6; i++) { const k = i / 6; g.lineTo(b.x1 + (b.x2 - b.x1) * k + rand(-12, 12), b.y1 + (b.y2 - b.y1) * k + rand(-12, 12)); }
      g.lineTo(b.x2, b.y2); g.stroke(); g.restore();
    }
    if (fx.magnet > 0) {
      g.save(); g.globalAlpha = 0.35 + 0.2 * Math.sin(time * 10); g.strokeStyle = '#e040fb'; g.lineWidth = 2; g.setLineDash([6, 8]);
      g.beginPath(); g.arc(dx0, y, 60 + (time * 80) % 40, 0, Math.PI * 2); g.stroke(); g.setLineDash([]); g.restore();
    }
    if (fx.dash > 0) {
      const gr = g.createRadialGradient(dx0, y, 10, dx0, y, 60); gr.addColorStop(0, 'rgba(255,200,80,0.55)'); gr.addColorStop(1, 'rgba(255,120,0,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(dx0, y, 60, 0, Math.PI * 2); g.fill();
    }
  }

  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const c = (v) => Math.max(0, Math.min(255, v + amt));
    return `rgb(${c(n >> 16)}, ${c((n >> 8) & 255)}, ${c(n & 255)})`;
  }

  function drawLanes() {
    const g = ctx;
    g.save();
    g.strokeStyle = 'rgba(255,255,255,0.22)'; g.lineWidth = 1.5; g.setLineDash([10, 12]);
    for (let i = 1; i < 5; i++) {
      const y = CONFIG.playBottom - i * LANE_H;
      g.beginPath(); g.moveTo(40, y); g.lineTo(W, y); g.stroke();
    }
    g.setLineDash([]);
    g.font = `15px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle';
    for (let l = 1; l <= 5; l++) {
      const y = laneY(l), active = state === 'playing' && laneOf(drone.y) === l;
      g.fillStyle = active ? 'rgba(255,140,26,0.9)' : 'rgba(30,50,90,0.35)';
      g.beginPath(); g.arc(20, y, 15, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#fff'; g.fillText(`${l}층`, 20, y + 1);
    }
    g.restore();
  }

  function heart(g, x, y, s, filled) {
    g.save(); g.translate(x, y); g.scale(s, s);
    g.beginPath(); g.moveTo(0, 6);
    g.bezierCurveTo(-12, -2, -8, -12, 0, -6); g.bezierCurveTo(8, -12, 12, -2, 0, 6); g.closePath();
    g.fillStyle = filled ? '#ff4d6d' : '#e0d6d6'; g.fill();
    g.strokeStyle = filled ? '#c9184a' : '#b8a9a9'; g.lineWidth = 1.5 / s; g.stroke();
    if (filled) { g.fillStyle = 'rgba(255,255,255,0.6)'; g.beginPath(); g.ellipse(-4, -5, 2, 1.3, -0.6, 0, Math.PI * 2); g.fill(); }
    g.restore();
  }

  function drawHUD() {
    const g = ctx, st = CONFIG.stages[stageIdx];
    g.save();
    g.fillStyle = 'rgba(255,255,255,0.88)'; rr(g, 10, 8, W - 90, 44, 20); g.fill();
    g.textBaseline = 'middle';
    g.font = `${BG.stages[stageIdx].name.length > 4 ? 19 : 22}px ${FONT}`; g.fillStyle = '#ff7b00'; g.textAlign = 'left';
    const name = `${stageIdx + 1}단계 · ${BG.stages[stageIdx].name}`;
    g.fillText(name, 24, 31);
    // 하트 (초록 드론은 4개)
    const mh = maxHearts(), hs = mh > 3 ? 1.05 : 1.25, gap = mh > 3 ? 21 : 26;
    const hx = 24 + g.measureText(name).width + 16;
    for (let i = 0; i < mh; i++) {
      const pulse = i === hearts - 1 && invuln > 0 ? 1 + 0.15 * Math.sin(time * 20) : 1;
      heart(g, hx + i * gap, 30, hs * pulse, i < hearts);
    }
    // 코인 개수
    const cx = Math.max(330, hx + mh * gap + 12);
    drawCoin({ x: cx, y: 30, phase: 0 });
    g.font = `24px ${FONT}`; g.fillStyle = '#5a4632'; g.textAlign = 'left';
    g.fillText(`${Math.min(coins, st.target)} / ${st.target}`, cx + 22, 31);
    // 진행 막대
    const bx = cx + 112, bw = W - 90 - bx - 10, p = Math.min(1, coins / st.target);
    g.fillStyle = '#ffe9b0'; rr(g, bx, 22, bw, 18, 9); g.fill();
    if (p > 0) { g.fillStyle = '#ffb703'; rr(g, bx, 22, Math.max(18, bw * p), 18, 9); g.fill(); }
    g.font = `14px ${FONT}`; g.fillStyle = '#7a5a2a'; g.textAlign = 'center';
    let label = p >= 1 ? '클리어!' : `목표까지 ${st.target - coins}개`;
    if (fx.double > 0) label = `✨ 코인 2배! ${Math.ceil(fx.double)}초`;
    else if (fx.slow > 0) label = `⏳ 느릿느릿 ${Math.ceil(fx.slow)}초`;
    else if (fx.magnet > 0) label = `🧲 자석 ${Math.ceil(fx.magnet)}초`;
    g.fillText(label, bx + bw / 2, 32);
    g.restore();
  }

  // 새 드론 획득 알림
  function drawBanner() {
    if (!banner) return;
    const g = ctx, a = Math.min(1, banner.life * 2, (2.4 - banner.life) * 4);
    g.save(); g.globalAlpha = Math.max(0, a);
    const bw = 520, bh = 92, x = (W - bw) / 2, y = 70;
    g.fillStyle = banner.kind === 'star' ? '#fff8d6' : '#fff0f0';
    rr(g, x, y, bw, bh, 22); g.fill();
    g.strokeStyle = banner.kind === 'star' ? '#ffb300' : '#e53935'; g.lineWidth = 5; g.stroke();
    DRONES.draw(g, banner.skin, x + 70, y + bh / 2 + 4, 0, time * 40, time);
    g.textAlign = 'left'; g.textBaseline = 'middle';
    g.font = `20px ${FONT}`; g.fillStyle = banner.kind === 'star' ? '#e08a00' : '#d32f2f';
    g.fillText(banner.kind === 'star' ? '⭐ 특별한 드론 획득!' : '🎁 새 드론 획득!', x + 130, y + 24);
    g.font = `26px ${FONT}`; g.fillStyle = '#4a3a28';
    g.fillText(banner.skin.name, x + 130, y + 52);
    g.font = `15px ${FONT}`; g.fillStyle = '#6a1b9a';
    g.fillText(`${banner.skin.ability.icon} ${banner.skin.ability.name}`, x + 130, y + 76);
    g.restore();
  }

  function drawCenterText(big, small, alpha = 1) {
    const g = ctx;
    g.save(); g.globalAlpha = alpha; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = `60px ${FONT}`; g.lineWidth = 10; g.strokeStyle = '#fff'; g.fillStyle = '#ff7b00';
    g.strokeText(big, W / 2, H / 2 - 30); g.fillText(big, W / 2, H / 2 - 30);
    if (small) {
      g.font = `28px ${FONT}`; g.lineWidth = 7; g.fillStyle = '#3a6ea5';
      g.strokeText(small, W / 2, H / 2 + 30); g.fillText(small, W / 2, H / 2 + 30);
    }
    g.restore();
  }

  function render() {
    ctx.save();
    if (shakeT > 0) ctx.translate(rand(-8, 8) * shakeT, rand(-8, 8) * shakeT);
    BG.draw(ctx, stageIdx, scroll, time);
    if (rage) { ctx.fillStyle = 'rgba(255,80,0,0.12)'; ctx.fillRect(0, 0, W, H); }
    if (fx && fx.slow > 0) { ctx.fillStyle = 'rgba(120,160,255,0.12)'; ctx.fillRect(0, 0, W, H); }
    if (state !== 'title') drawLanes();

    for (const o of objs) {
      if (o.type === 'coin') drawCoin(o);
      else if (o.type === 'box') drawBox(o);
      else if (o.type === 'gift') drawGift(o);
      else if (o.type === 'star') drawStar(o);
    }
    for (const o of objs) if (o.type === 'bird') drawBird(o);
    for (const o of objs) if (o.type === 'fireball') drawFireball(o);

    if (meteor && !meteor.done) {
      ctx.save(); ctx.translate(meteor.x, meteor.y);
      const gr = ctx.createRadialGradient(0, 0, 10, 0, 0, 70); gr.addColorStop(0, 'rgba(255,200,80,0.8)'); gr.addColorStop(1, 'rgba(255,80,0,0)');
      ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(0, 0, 70, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#5d4037'; ctx.beginPath(); ctx.ellipse(0, 0, 36, 30, 0.4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#3e2723'; ctx.beginPath(); ctx.arc(-8, -6, 7, 0, Math.PI * 2); ctx.arc(10, 8, 5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    for (const p of projs) drawProj(p);
    drawAbilityFx();

    if (state === 'crashing' || state === 'over') drawDrone(CONFIG.droneX, drone.y, drone.spin, drone.rot);
    else {
      if (invuln > 0 && Math.floor(time * 12) % 2) ctx.globalAlpha = 0.35;
      drawDrone(CONFIG.droneX, drone.y, drone.angle, drone.rot);
      ctx.globalAlpha = 1;
      if (state === 'playing') drawShield(CONFIG.droneX, drone.y);
    }

    for (const p of particles) {
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life / p.max));
      ctx.fillStyle = p.color;
      if (p.rock) {
        ctx.beginPath(); ctx.moveTo(p.x - p.size, p.y); ctx.lineTo(p.x - p.size * 0.3, p.y - p.size); ctx.lineTo(p.x + p.size, p.y - p.size * 0.4);
        ctx.lineTo(p.x + p.size * 0.6, p.y + p.size); ctx.closePath(); ctx.fill();
      } else { ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); }
    }
    ctx.globalAlpha = 1;
    for (const t of texts) {
      ctx.save(); ctx.globalAlpha = Math.min(1, t.life * 2);
      ctx.font = `${t.size}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.lineWidth = 6; ctx.strokeStyle = '#fff'; ctx.strokeText(t.text, t.x, t.y);
      ctx.fillStyle = t.color; ctx.fillText(t.text, t.x, t.y);
      ctx.restore();
    }
    if (flash > 0) { ctx.fillStyle = `rgba(255,255,255,${Math.min(0.9, flash)})`; ctx.fillRect(-20, -20, W + 40, H + 40); }
    ctx.restore();

    if (state !== 'title') drawHUD();
    drawBanner();

    if (state === 'intro') {
      const info = BG.stages[stageIdx];
      const sub = phaseT < 1.6 ? info.desc : '준비… 출발! 🚁';
      drawCenterText(`${stageIdx + 1}단계 · ${info.name}`, sub, Math.min(1, (2.4 - phaseT) * 3));
    }
    if (state === 'playing' && camping) {
      ctx.save(); ctx.font = `16px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(60,60,90,0.75)';
      ctx.fillText('맨 위에만 있으면 코인이 안 나와요!', W / 2, CONFIG.playTop + 12); ctx.restore();
    }
  }

  // ===== 메인 루프 =====
  resetStage(0);
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    update(dt);
    render();
    requestAnimationFrame(frame);
  }

  const startUp = () => { showTitle(); requestAnimationFrame((t) => { last = t; frame(t); }); };
  if (document.fonts && document.fonts.load) {
    Promise.race([document.fonts.load(`20px Jua`), new Promise((r) => setTimeout(r, 1500))]).then(startUp, startUp);
  } else startUp();
})();
