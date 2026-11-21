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
    hearts: 3,            // 하트 개수 (새에 부딪히면 1개씩 줄어듦)
    invulnTime: 1.6,      // 부딪힌 뒤 잠깐 무적인 시간(초)
    stages: [
      // target: 클리어 코인, speed: 흐르는 속도, interval: 새 무리 간격(초)
      // edge: 새 한 마리가 1층/5층에 나올 확률, box: 랜덤박스 확률
      // move: [아래층, 위층] 새가 위아래로 움직이는 범위, gift: 선물박스 확률, star: 별 확률
      { target: 20, speed: 210, interval: 1.6,  birdsMin: 1, birdsMax: 2, edge: 0.00, box: 0.00 },
      { target: 25, speed: 230, interval: 1.5,  birdsMin: 1, birdsMax: 2, edge: 0.15, box: 0.00 },
      { target: 30, speed: 250, interval: 1.4,  birdsMin: 1, birdsMax: 3, edge: 0.25, box: 0.22 },
      { target: 35, speed: 270, interval: 1.3,  birdsMin: 2, birdsMax: 3, edge: 0.35, box: 0.24 },
      { target: 40, speed: 290, interval: 1.2,  birdsMin: 2, birdsMax: 3, edge: 0.45, box: 0.26 },
      { target: 45, speed: 280, interval: 1.5,  birdsMin: 1, birdsMax: 2, move: [2, 4], box: 0.24, gift: 0.08 },
      { target: 50, speed: 290, interval: 1.45, birdsMin: 1, birdsMax: 2, move: [1, 5], box: 0.24, gift: 0.08 },
      { target: 55, speed: 295, interval: 1.4,  birdsMin: 1, birdsMax: 2, move: [1, 5], box: 0.25, gift: 0.08, star: 0.04 },
      { target: 60, speed: 300, interval: 1.35, birdsMin: 2, birdsMax: 2, move: [1, 5], box: 0.25, gift: 0.08, star: 0.04 },
      { target: 65, speed: 310, interval: 1.3,  birdsMin: 2, birdsMax: 3, move: [1, 5], box: 0.26, gift: 0.08, star: 0.05 },
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
  let unlocked = Math.max(1, Math.min(CONFIG.stages.length, parseInt(store.read('droneCoin.unlocked', '1'), 10) || 1));
  let owned = new Set();
  try { owned = new Set(JSON.parse(store.read('droneCoin.owned', '[]'))); } catch (e) { owned = new Set(); }
  const saveOwned = () => store.write('droneCoin.owned', JSON.stringify([...owned]));
  const canUse = (s) => DRONES.isAvailable(s, unlocked, owned);
  let skinId = store.read('droneCoin.skin', 'orange');
  if (DRONES.get(skinId).id !== skinId || !canUse(DRONES.get(skinId))) skinId = 'orange';
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
    hit() { this.tone(420, 0.25, 'square', 0.1, 140); },
    crash() { this.tone(500, 0.5, 'sawtooth', 0.12, 60); this.tone(180, 0.4, 'square', 0.06, 50, 0.05); },
    clear() { [523, 659, 784, 1047, 784, 1047].forEach((f, i) => this.tone(f, 0.2, 'square', 0.07, 0, i * 0.12)); },
    go() { this.tone(660, 0.12, 'triangle', 0.1); this.tone(990, 0.2, 'triangle', 0.1, 0, 0.12); },
  };
  const muteBtn = document.getElementById('muteBtn');
  muteBtn.addEventListener('click', () => { Sound.muted = !Sound.muted; muteBtn.textContent = Sound.muted ? '🔇' : '🔊'; Sound.init(); });

  // ===== 게임 상태 =====
  let state = 'title';     // title, intro, playing, crashing, clear, cleared, over
  let stageIdx = 0;
  let drone, objs, particles, texts, banner;
  let coins = 0, spawnT = 0, nextBirds = true, prevFree = [1, 2, 3, 4, 5];
  let campT = 0, camping = false, scroll = 0, phaseT = 0, time = 0;
  let hearts = CONFIG.hearts, invuln = 0, playT = 0, giftSpawned = 0, starSpawned = 0;

  function resetStage(i) {
    stageIdx = i;
    drone = { y: laneY(3), vy: 0, angle: 0, rot: 0, spin: 0 };
    objs = []; particles = []; texts = []; banner = null;
    coins = 0; spawnT = 0.5; nextBirds = true; prevFree = [1, 2, 3, 4, 5];
    campT = 0; camping = false; phaseT = 0;
    hearts = CONFIG.hearts; invuln = 0; playT = 0; giftSpawned = 0; starSpawned = 0;
    gotSkins = [];
  }
  resetStage(0);

  // ===== 입력 =====
  const pointers = new Set();
  let keyHeld = false;
  const holding = () => pointers.size > 0 || keyHeld;
  const upBtn = document.getElementById('upBtn');

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
  const UP_KEYS = ['Space', 'ArrowUp', 'KeyW'];
  window.addEventListener('keydown', (e) => {
    if (UP_KEYS.includes(e.code)) {
      e.preventDefault();
      if (state === 'playing' || state === 'intro') { Sound.init(); keyHeld = true; upBtn.classList.add('pressed'); }
    } else if (e.code === 'Enter' && overlay.classList.contains('show')) {
      const b = panel.querySelector('.btn.primary'); if (b) b.click();
    }
  });
  window.addEventListener('keyup', (e) => { if (UP_KEYS.includes(e.code)) { keyHeld = false; if (!holding()) upBtn.classList.remove('pressed'); } });
  window.addEventListener('blur', () => { keyHeld = false; pointers.clear(); upBtn.classList.remove('pressed'); });

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
    upBtn.classList.remove('show');
  }
  function hidePanel() { overlay.classList.remove('show'); }

  function showTitle() {
    state = 'title';
    resetStage(0);
    const info = BG.stages;
    let stageHtml = '<div class="stages">';
    for (let i = 0; i < info.length; i++) {
      const locked = i + 1 > unlocked;
      stageHtml += `<button class="stageBtn" data-s="${i}" ${locked ? 'disabled' : ''}>
        <b>${locked ? '🔒' : i + 1}</b>${info[i].name}</button>`;
    }
    stageHtml += '</div>';
    showPanel(`
      <h1>🚁 드론 코인 대모험</h1>
      <div class="howto">
        <p class="big"><b>▲ 위로</b> 버튼을 누르면 드론이 올라가고, 손을 떼면 내려가요!</p>
        <p>🐦 새를 피하고 💰 코인을 모아요. 💗 하트는 3개! 새와 3번 부딪히면 끝나요.</p>
      </div>
      ${stageHtml}
    `, [{ label: unlocked > 1 ? `${unlocked}단계 이어하기` : '게임 시작!', primary: true, onClick: () => showDroneSelect(unlocked - 1) }]);
    panel.classList.add('wide');
    panel.querySelectorAll('.stageBtn').forEach((b) => b.addEventListener('click', () => { Sound.init(); showDroneSelect(+b.dataset.s); }));
  }

  // ===== 드론 고르기 화면 =====
  function lockLabel(s) {
    if (s.stage) return `🔒 ${s.stage}단계`;
    return s.source === 'gift' ? '🎁 선물박스' : '⭐ 별';
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
      <h2>🚁 내 드론을 골라요! <small>(${count} / ${DRONES.skins.length})</small></h2>
      <p><small>단계를 깨면 새 드론이 열려요 · 6단계부터 🎁선물박스, 8단계부터 ⭐별을 잡으면 새 드론을 얻어요!</small></p>
      <div class="droneGrid">${cards}</div>
    `, [
      { label: '이 드론으로 출발! ▶', primary: true, onClick: () => startStage(startIdx) },
      { label: '뒤로', onClick: showTitle },
    ]);
    panel.classList.add('wide');
    panel.querySelectorAll('.droneCard').forEach((card) => {
      const s = DRONES.get(card.dataset.id), cv = card.querySelector('canvas'), g = cv.getContext('2d');
      g.scale(2, 2);
      DRONES.draw(g, s, 60, 42, 0, 0.6, 0.2);
      card.addEventListener('click', () => {
        Sound.init(); Sound.coin();
        skinId = s.id; store.write('droneCoin.skin', skinId);
        panel.querySelectorAll('.droneCard').forEach((c) => c.classList.toggle('selected', c === card));
      });
    });
  }

  function startStage(i) {
    resetStage(i);
    hidePanel();
    state = 'intro';
    upBtn.classList.add('show');
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
      ...(gotSkins.length ? [{ label: '드론 바꾸기', onClick: () => showDroneSelect(stageIdx) }] : []),
      { label: '처음 화면', onClick: showTitle },
    ]);
  }

  // 다음 단계 안내 문구 (방금 깬 단계 번호 기준)
  const NEXT_TIPS = {
    1: '⚠️ 2단계부터는 맨 아래(1층)와 맨 위(5층)에도 새가 나타나요!',
    2: '🎁 3단계부터는 <b>랜덤박스</b>가 나와요! 코인이 0~5개 들어 있어요.',
    5: '🐦 6단계부터는 새가 <b>위아래로 움직여요!</b> 🎁 빨간 <b>선물박스</b>를 잡으면 새 드론을 얻어요!',
    6: '🐦 7단계부터는 새가 1층~5층 전체를 위아래로 움직여요!',
    7: '⭐ 8단계부터는 가끔 <b>별</b>이 나와요! 별을 잡으면 반짝이는 특별한 드론을 얻어요!',
    9: '🚀 마지막 10단계는 <b>우주</b>예요! 힘내요!',
  };

  function stageCleared() {
    state = 'cleared';
    if (stageIdx === LAST) {
      showPanel(`
        <h1>🏆 GAME CLEAR! 🏆</h1>
        <p class="big">10단계를 모두 깼어요! 서울에서 우주까지 날아간 최고의 드론 조종사예요! 🎉</p>
        <p>서울 → 보스턴 → 대전 → 뉴욕 → 놀이터 → 파리 → 런던 → 시카고 → LA → 우주</p>
        ${gotHtml()}
        <p>모은 드론: <b>${DRONES.skins.filter(canUse).length} / ${DRONES.skins.length}</b> · 다시 하면서 드론을 모두 모아 봐요!</p>
      `, [
        { label: '처음 화면', primary: true, onClick: showTitle },
        { label: '10단계 다시', onClick: () => showDroneSelect(LAST) },
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
        ...(newSkins.length || gotSkins.length ? [{ label: '드론 바꾸기', onClick: () => showDroneSelect(stageIdx + 1) }] : []),
        { label: '처음 화면', onClick: showTitle },
      ]);
    }
  }

  // ===== 생성 =====
  function spawnBirds() {
    const st = CONFIG.stages[stageIdx];
    if (st.move) {
      // 위아래로 움직이는 새 (6단계~)
      const [lo, hi] = st.move, used = [];
      const n = randInt(st.birdsMin, st.birdsMax);
      for (let k = 0; k < n; k++) {
        const pool = []; for (let l = lo; l <= hi; l++) if (!used.includes(l)) pool.push(l);
        const a = pick(pool); used.push(a);
        const span = randInt(1, 2);
        let b = Math.max(lo, Math.min(hi, a + (Math.random() < 0.5 ? -span : span)));
        if (b === a) b = a < hi ? a + 1 : a - 1;
        const ya = laneY(a), yb = laneY(b), ph = Math.random() * 6, w = rand(1.6, 2.6);
        const mid = (ya + yb) / 2, amp = Math.abs(ya - yb) / 2;
        objs.push({
          type: 'bird', move: true, x: W + 40 + k * 24, mid, amp, w, phase: ph,
          y: mid + Math.sin(ph * w) * amp, color: pick(BIRD_COLORS),
        });
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
    lanes.forEach((l) => objs.push({
      type: 'bird', lane: l, x: W + 40, y: laneY(l), base: laneY(l),
      phase: Math.random() * 6, color: pick(BIRD_COLORS),
    }));
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
    const pool = DRONES.skins.filter((s) => s.source === kind && !owned.has(s.id));
    burst(o.x, o.y, ['#ffd700', '#ffffff', '#ff80ab', '#80d8ff', '#b9f6ca'], 30, 300);
    if (pool.length) {
      const s = pick(pool);
      owned.add(s.id); saveOwned(); gotSkins.push(s);
      Sound.special();
      banner = { skin: s, kind, life: 2.4 };
    } else {
      const n = kind === 'star' ? 5 : 3;
      coins += n; Sound.box(n);
      floatText(o.x, o.y - 26, `${kind === 'star' ? '⭐' : '🎁'} 드론을 다 모았어요! +${n}개`, '#ff6d00', 28);
    }
  }

  // ===== 효과 =====
  function burst(x, y, colors, n = 12, speed = 220) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, s = rand(speed * 0.3, speed);
      particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: rand(0.4, 0.8), max: 0.8, color: pick(colors), size: rand(3, 6), grav: 300 });
    }
  }
  function floatText(x, y, text, color, size = 30) { texts.push({ x, y, text, color, size, life: 1.1 }); }

  // ===== 업데이트 =====
  function moveObj(o, dt, speed) {
    o.x -= speed * dt;
    o.phase += dt;
    if (o.type === 'bird') {
      if (o.flee) { o.y -= 260 * dt; return; }
      o.y = o.move ? o.mid + Math.sin(o.phase * o.w) * o.amp : o.base + Math.sin(o.phase * 3) * 6;
    } else if (o.type === 'box' || o.type === 'gift') o.y = o.base + Math.sin(o.phase * 2.5) * 4;
    else if (o.type === 'star') o.y = o.base + Math.sin(o.phase * 3) * 14;
  }

  function update(dt) {
    time += dt;
    const st = CONFIG.stages[stageIdx];
    drone.rot += dt * 40;
    if (banner) { banner.life -= dt; if (banner.life <= 0) banner = null; }

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
      objs.forEach((o) => { if (o.type === 'bird') o.flee = true; moveObj(o, dt, st.speed); });
      if (Math.random() < dt * 8) burst(rand(200, 760), rand(120, 300), ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93'], 18, 260);
      updateFx(dt);
      if (phaseT > 1.6) stageCleared();
      return;
    }

    // ---- playing ----
    scroll += st.speed * dt;
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
    spawnT -= dt;
    if (spawnT <= 0) {
      spawnT += st.interval / 2;
      if (nextBirds) spawnBirds(); else spawnCoins();
      nextBirds = !nextBirds;
    }

    // 이동 & 충돌
    const dx0 = CONFIG.droneX;
    for (const o of objs) {
      moveObj(o, dt, st.speed);
      const dx = o.x - dx0, dy = o.y - drone.y;
      if (o.type === 'bird') {
        if (o.flee || invuln > 0) continue;
        const nx = dx / (26 + 16), ny = dy / (14 + 16);
        if (nx * nx + ny * ny < 1) {
          hearts--; o.flee = true;
          burst(dx0, drone.y, ['#ffffff', '#ffd166', '#ff6b6b', o.color], 22, 260);
          if (hearts <= 0) {
            state = 'crashing'; phaseT = 0; drone.vy = -250;
            Sound.crash(); upBtn.classList.remove('show');
            return;
          }
          invuln = CONFIG.invulnTime; Sound.hit();
          floatText(dx0, drone.y - 44, `아야! 💗 ${hearts}개 남았어요`, '#e53935', 26);
        }
      } else if (!o.dead) {
        const r = o.type === 'coin' ? 15 : 20;
        const nx = dx / (34 + r), ny = dy / (22 + r);
        if (nx * nx + ny * ny < 1) {
          o.dead = true;
          if (o.type === 'coin') {
            coins++; Sound.coin();
            burst(o.x, o.y, ['#ffd700', '#fff3a0', '#ffb300'], 8, 160);
            floatText(o.x, o.y - 20, '+1', '#ffb300', 26);
          } else if (o.type === 'box') {
            const n = randInt(0, 5);
            coins += n; Sound.box(n);
            burst(o.x, o.y, ['#b388ff', '#ffd700', '#ffffff', '#ff80ab'], 20, 240);
            floatText(o.x, o.y - 26, n === 0 ? '꽝! 0개 😅' : `🎁 +${n}개!`, n === 0 ? '#7e57c2' : '#ff6d00', 36);
          } else {
            grantSkin(o.type, o);
          }
        }
      }
    }
    objs = objs.filter((o) => o.x > -80 && o.y > -60 && !o.dead);

    // 드론 프로펠러 바람 효과
    if (holding() && Math.random() < dt * 30) {
      particles.push({ x: dx0 + rand(-28, 28), y: drone.y + 16, vx: rand(-30, 30) - 60, vy: rand(80, 160), life: 0.3, max: 0.3, color: 'rgba(255,255,255,0.8)', size: rand(2, 4), grav: 0 });
    }

    updateFx(dt);

    if (coins >= st.target) {
      state = 'clear'; phaseT = 0; invuln = 0;
      newSkins = [];
      if (stageIdx + 2 > unlocked && stageIdx < LAST) {
        unlocked = stageIdx + 2; store.write('droneCoin.unlocked', String(unlocked));
        newSkins = DRONES.skins.filter((s) => s.stage === unlocked);
      }
      upBtn.classList.remove('show');
      Sound.clear();
      floatText(W / 2, H / 2 - 40, stageIdx === LAST ? 'GAME CLEAR!' : 'STAGE CLEAR!', '#ff6d00', 64);
    }
  }

  function updateFx(dt) {
    for (const p of particles) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += p.grav * dt; p.life -= dt; }
    particles = particles.filter((p) => p.life > 0);
    for (const t of texts) { t.y -= 40 * dt; t.life -= dt; }
    texts = texts.filter((t) => t.life > 0);
  }

  // ===== 그리기 =====
  function drawDrone(x, y, ang, rot) {
    DRONES.draw(ctx, DRONES.get(skinId), x, y, ang, rot, time);
  }

  function drawBird(o) {
    const g = ctx, flap = Math.sin(o.phase * 14);
    g.save(); g.translate(o.x, o.y);
    if (o.flee) g.rotate(-0.5);
    // 꼬리
    g.fillStyle = shade(o.color, -25);
    g.beginPath(); g.moveTo(16, -2); g.lineTo(30, -10); g.lineTo(28, 2); g.lineTo(31, 9); g.lineTo(15, 5); g.fill();
    // 뒷날개
    g.fillStyle = shade(o.color, -30);
    g.save(); g.translate(4, -4); g.rotate(-0.4 - flap * 0.7);
    g.beginPath(); g.ellipse(6, -8, 8, 15, 0.3, 0, Math.PI * 2); g.fill(); g.restore();
    // 몸
    g.fillStyle = o.color;
    g.beginPath(); g.ellipse(0, 0, 20, 15, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = shade(o.color, 45);
    g.beginPath(); g.ellipse(-4, 6, 12, 7, 0, 0, Math.PI * 2); g.fill();
    // 앞날개
    g.fillStyle = shade(o.color, -12);
    g.save(); g.translate(2, -2); g.rotate(0.2 + flap * 0.8);
    g.beginPath(); g.ellipse(6, -6, 7, 14, 0.5, 0, Math.PI * 2); g.fill(); g.restore();
    // 부리
    g.fillStyle = '#ffb300';
    g.beginPath(); g.moveTo(-18, -4); g.lineTo(-31, 0); g.lineTo(-18, 4); g.fill();
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
    // 우주 단계에서는 우주 헬멧
    if (stageIdx === LAST) {
      g.fillStyle = 'rgba(180,230,255,0.15)'; g.strokeStyle = 'rgba(200,240,255,0.85)'; g.lineWidth = 2;
      g.beginPath(); g.arc(-4, -2, 28, 0, Math.PI * 2); g.fill(); g.stroke();
      g.fillStyle = 'rgba(255,255,255,0.6)'; g.beginPath(); g.ellipse(-16, -16, 5, 3, -0.6, 0, Math.PI * 2); g.fill();
    }
    g.restore();
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
    for (let i = 0; i < 2; i++) {
      if (Math.random() < 0.3) particles.push({ x: o.x + rand(-20, 20), y: o.y + rand(-20, 20), vx: rand(-40, 40), vy: rand(-40, 40), life: 0.4, max: 0.4, color: pick(['#fff59d', '#ffffff', '#ffd54f']), size: rand(1.5, 3), grav: 0 });
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
    g.font = `22px ${FONT}`; g.fillStyle = '#ff7b00'; g.textAlign = 'left';
    const name = `${stageIdx + 1}단계 · ${BG.stages[stageIdx].name}`;
    g.fillText(name, 28, 31);
    // 하트
    const hx = 28 + g.measureText(name).width + 22;
    for (let i = 0; i < CONFIG.hearts; i++) {
      const pulse = i === hearts - 1 && invuln > 0 ? 1 + 0.15 * Math.sin(time * 20) : 1;
      heart(g, hx + i * 26, 30, 1.25 * pulse, i < hearts);
    }
    // 코인 개수
    drawCoin({ x: 312, y: 30, phase: 0 });
    g.font = `24px ${FONT}`; g.fillStyle = '#5a4632'; g.textAlign = 'left';
    g.fillText(`${Math.min(coins, st.target)} / ${st.target}`, 336, 31);
    // 진행 막대
    const bx = 440, bw = W - 90 - bx - 10, p = Math.min(1, coins / st.target);
    g.fillStyle = '#ffe9b0'; rr(g, bx, 22, bw, 18, 9); g.fill();
    if (p > 0) { g.fillStyle = '#ffb703'; rr(g, bx, 22, Math.max(18, bw * p), 18, 9); g.fill(); }
    g.font = `14px ${FONT}`; g.fillStyle = '#7a5a2a'; g.textAlign = 'center';
    g.fillText(p >= 1 ? '클리어!' : `목표까지 ${st.target - coins}개`, bx + bw / 2, 32);
    g.restore();
  }

  // 새 드론 획득 알림
  function drawBanner() {
    if (!banner) return;
    const g = ctx, a = Math.min(1, banner.life * 2, (2.4 - banner.life) * 4);
    g.save(); g.globalAlpha = Math.max(0, a);
    const bw = 440, bh = 92, x = (W - bw) / 2, y = 70;
    g.fillStyle = banner.kind === 'star' ? '#fff8d6' : '#fff0f0';
    rr(g, x, y, bw, bh, 22); g.fill();
    g.strokeStyle = banner.kind === 'star' ? '#ffb300' : '#e53935'; g.lineWidth = 5; g.stroke();
    DRONES.draw(g, banner.skin, x + 70, y + bh / 2 + 4, 0, time * 40, time);
    g.textAlign = 'left'; g.textBaseline = 'middle';
    g.font = `22px ${FONT}`; g.fillStyle = banner.kind === 'star' ? '#e08a00' : '#d32f2f';
    g.fillText(banner.kind === 'star' ? '⭐ 특별한 드론 획득!' : '🎁 새 드론 획득!', x + 130, y + 30);
    g.font = `28px ${FONT}`; g.fillStyle = '#4a3a28';
    g.fillText(banner.skin.name, x + 130, y + 64);
    g.restore();
  }

  function drawCenterText(big, small, alpha = 1) {
    const g = ctx;
    g.save(); g.globalAlpha = alpha; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = `64px ${FONT}`; g.lineWidth = 10; g.strokeStyle = '#fff'; g.fillStyle = '#ff7b00';
    g.strokeText(big, W / 2, H / 2 - 30); g.fillText(big, W / 2, H / 2 - 30);
    if (small) {
      g.font = `30px ${FONT}`; g.lineWidth = 7; g.fillStyle = '#3a6ea5';
      g.strokeText(small, W / 2, H / 2 + 30); g.fillText(small, W / 2, H / 2 + 30);
    }
    g.restore();
  }

  function render() {
    BG.draw(ctx, stageIdx, scroll, time);
    if (state !== 'title') drawLanes();

    for (const o of objs) {
      if (o.type === 'coin') drawCoin(o);
      else if (o.type === 'box') drawBox(o);
      else if (o.type === 'gift') drawGift(o);
      else if (o.type === 'star') drawStar(o);
    }
    for (const o of objs) if (o.type === 'bird') drawBird(o);

    if (state === 'crashing' || state === 'over') drawDrone(CONFIG.droneX, drone.y, drone.spin, drone.rot);
    else {
      if (invuln > 0 && Math.floor(time * 12) % 2) ctx.globalAlpha = 0.35;
      drawDrone(CONFIG.droneX, drone.y, drone.angle, drone.rot);
      ctx.globalAlpha = 1;
    }

    for (const p of particles) {
      ctx.globalAlpha = Math.max(0, p.life / p.max);
      ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    for (const t of texts) {
      ctx.save(); ctx.globalAlpha = Math.min(1, t.life * 2);
      ctx.font = `${t.size}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.lineWidth = 6; ctx.strokeStyle = '#fff'; ctx.strokeText(t.text, t.x, t.y);
      ctx.fillStyle = t.color; ctx.fillText(t.text, t.x, t.y);
      ctx.restore();
    }

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
