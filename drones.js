// 드론 코인 대모험 — 드론 디자인(스킨)
// stage: 이 단계까지 열려 있어야 고를 수 있음 (1단계 2개 → 2단계 4개(색깔) → 3단계부터 새로운 모양)
// source: 'gift' = 선물박스(6단계~)로 얻음, 'star' = 별(8단계~)로 얻는 특별 드론
const DRONES = (() => {
  'use strict';

  const SKINS = [
    { id: 'orange',  name: '주황 드론',   stage: 1, shape: 'classic', c1: '#ffb04d', c2: '#f57c00', edge: '#c45f00' },
    { id: 'blue',    name: '파랑 드론',   stage: 1, shape: 'classic', c1: '#7fd0ff', c2: '#1e88e5', edge: '#1259a8' },
    { id: 'green',   name: '초록 드론',   stage: 2, shape: 'classic', c1: '#a5e57a', c2: '#43a047', edge: '#2e7d32', bonusHeart: 1 },
    { id: 'pink',    name: '분홍 드론',   stage: 2, shape: 'classic', c1: '#ffb3d1', c2: '#ec407a', edge: '#b0285a' },
    { id: 'quad',    name: '쿼드콥터',    stage: 3, shape: 'quad',    c1: '#d1b3ff', c2: '#7c4dff', edge: '#5530c0' },
    { id: 'heli',    name: '헬리콥터',    stage: 3, shape: 'heli',    c1: '#fff59d', c2: '#fbc02d', edge: '#c49000' },
    { id: 'bee',     name: '꿀벌 드론',   stage: 4, shape: 'bee',     c1: '#ffe066', c2: '#ffb300', edge: '#8a5a00' },
    { id: 'rocket',  name: '로켓 드론',   stage: 4, shape: 'rocket',  c1: '#ffffff', c2: '#cfd8dc', edge: '#78909c' },
    { id: 'ufo',     name: 'UFO 드론',    stage: 5, shape: 'ufo',     c1: '#d7f5d8', c2: '#66bb6a', edge: '#2e7d32' },
    { id: 'rainbow', name: '무지개 드론', stage: 5, shape: 'classic', rainbow: true, edge: '#7b4bb3' },
    // 🎁 선물박스로 얻는 드론 (6단계부터)
    { id: 'plane',     name: '비행기 드론', source: 'gift', shape: 'plane',     c1: '#ff8a80', c2: '#e53935', edge: '#a32020' },
    { id: 'balloon',   name: '열기구 드론', source: 'gift', shape: 'balloon',   c1: '#ffd54f', c2: '#ff7043', edge: '#bf4a1f' },
    { id: 'fish',      name: '물고기 드론', source: 'gift', shape: 'fish',      c1: '#80deea', c2: '#00acc1', edge: '#00727f' },
    { id: 'butterfly', name: '나비 드론',   source: 'gift', shape: 'butterfly', c1: '#f48fb1', c2: '#ab47bc', edge: '#6a1b9a' },
    { id: 'cat',       name: '고양이 드론', source: 'gift', shape: 'cat',       c1: '#ffcc80', c2: '#fb8c00', edge: '#a85d00' },
    { id: 'car',       name: '하늘 자동차', source: 'gift', shape: 'car',       c1: '#90caf9', c2: '#1e88e5', edge: '#0d47a1' },
    // ⭐ 별로 얻는 특별한 드론 (8단계부터, 반짝이는 빛이 남)
    { id: 'goldstar', name: '황금별 드론',   source: 'star', shape: 'starbody', c1: '#fff59d', c2: '#ffb300', edge: '#b77d00', special: true },
    { id: 'crystal',  name: '크리스탈 드론', source: 'star', shape: 'crystal',  c1: '#e0f7fa', c2: '#4dd0e1', edge: '#00838f', special: true },
    { id: 'galaxy',   name: '은하수 드론',   source: 'star', shape: 'classic',  galaxy: true, edge: '#311b92', special: true },
    { id: 'unicorn',  name: '유니콘 드론',   source: 'star', shape: 'unicorn',  c1: '#ffffff', c2: '#f8bbd0', edge: '#c2185b', special: true },
    { id: 'phoenix',  name: '불사조 드론',   source: 'star', shape: 'phoenix',  c1: '#ffcc80', c2: '#ff5722', edge: '#bf360c', special: true },
    // 🎁 선물박스로 얻는 새 드론 (과일·동물)
    { id: 'mango',       name: '망고 드론',     source: 'gift', shape: 'mango',       c1: '#ffe082', c2: '#ffa000', edge: '#c77800' },
    { id: 'pineapple',   name: '파인애플 드론', source: 'gift', shape: 'pineapple',   c1: '#ffe57f', c2: '#fbc02d', edge: '#a87400' },
    { id: 'orangefruit', name: '오렌지 드론',   source: 'gift', shape: 'orangeFruit', c1: '#ffb74d', c2: '#f57c00', edge: '#b45300' },
    { id: 'strawberry',  name: '딸기 드론',     source: 'gift', shape: 'strawberry',  c1: '#ff6b81', c2: '#e53935', edge: '#a31515' },
    { id: 'watermelon',  name: '수박 드론',     source: 'gift', shape: 'watermelon',  c1: '#81c784', c2: '#43a047', edge: '#1b5e20' },
    { id: 'banana',      name: '바나나 드론',   source: 'gift', shape: 'banana',      c1: '#fff59d', c2: '#fdd835', edge: '#a89200' },
    { id: 'penguin',     name: '펭귄 드론',     source: 'gift', shape: 'penguin',     c1: '#ffffff', c2: '#263238', edge: '#111' },
    { id: 'rabbit',      name: '토끼 드론',     source: 'gift', shape: 'rabbit',      c1: '#ffffff', c2: '#eceff1', edge: '#b0bec5' },
    { id: 'turtle',      name: '거북이 드론',   source: 'gift', shape: 'turtle',      c1: '#8bc34a', c2: '#558b2f', edge: '#33691e' },
    // ⭐ 별로 얻는 새 특별 드론
    { id: 'shark',   name: '상어 드론',   source: 'star', shape: 'shark',   c1: '#90a4ae', c2: '#546e7a', edge: '#37474f', special: true },
    { id: 'tiger',   name: '호랑이 드론', source: 'star', shape: 'tiger',   c1: '#ffb74d', c2: '#f57c00', edge: '#8d4a00', special: true },
    { id: 'octopus', name: '문어 드론',   source: 'star', shape: 'octopus', c1: '#ce93d8', c2: '#8e24aa', edge: '#5e1675', special: true },
    { id: 'panda',   name: '판다 드론',   source: 'star', shape: 'panda',   c1: '#ffffff', c2: '#eeeeee', edge: '#9e9e9e', special: true },
    { id: 'dragon',  name: '용 드론',     source: 'star', shape: 'dragon',  c1: '#81c784', c2: '#2e7d32', edge: '#1b5e20', special: true },
    { id: 'robot',   name: '로봇 드론',   source: 'star', shape: 'robot',   c1: '#cfd8dc', c2: '#90a4ae', edge: '#546e7a', special: true },
  ];

  function rr(g, x, y, w, h, r) {
    g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
  }
  function bodyFill(g, s, y0, y1) {
    if (s.galaxy) {
      const gr = g.createLinearGradient(-24, -12, 24, 14);
      gr.addColorStop(0, '#1a237e'); gr.addColorStop(0.5, '#6a1b9a'); gr.addColorStop(1, '#0d47a1');
      return gr;
    }
    if (s.rainbow) {
      const gr = g.createLinearGradient(-24, 0, 24, 0);
      ['#ff5252', '#ffa726', '#ffee58', '#66bb6a', '#42a5f5', '#ab47bc'].forEach((c, i) => gr.addColorStop(i / 5, c));
      return gr;
    }
    const gr = g.createLinearGradient(0, y0, 0, y1);
    gr.addColorStop(0, s.c1); gr.addColorStop(1, s.c2);
    return gr;
  }
  // 오른쪽을 바라보는 귀여운 눈
  function eyes(g, x, y, k = 1) {
    g.fillStyle = '#fff';
    g.beginPath(); g.arc(x, y, 4.2 * k, 0, Math.PI * 2); g.arc(x + 9 * k, y, 4.2 * k, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#222';
    g.beginPath(); g.arc(x + 1.5 * k, y + 0.5, 2.2 * k, 0, Math.PI * 2); g.arc(x + 10.5 * k, y + 0.5, 2.2 * k, 0, Math.PI * 2); g.fill();
  }
  function rotor(g, x, y, half, rot, alpha = 1) {
    const s = Math.abs(Math.cos(rot));
    g.globalAlpha = alpha;
    g.fillStyle = 'rgba(200, 230, 255, 0.45)';
    g.beginPath(); g.ellipse(x, y, half, 4, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#546e7a';
    g.beginPath(); g.ellipse(x, y, half * s + 2, 2.5, 0, 0, Math.PI * 2); g.fill();
    g.globalAlpha = 1;
  }
  function skids(g) {
    g.strokeStyle = '#455a64'; g.lineWidth = 3; g.lineCap = 'round';
    g.beginPath(); g.moveTo(-14, 12); g.lineTo(-18, 22); g.moveTo(14, 12); g.lineTo(18, 22);
    g.moveTo(-24, 22); g.lineTo(-10, 22); g.moveTo(10, 22); g.lineTo(24, 22); g.stroke();
  }

  // ---- 기본형 (색깔만 다름) ----
  function classic(g, s, rot, t) {
    skids(g);
    g.strokeStyle = '#37474f'; g.lineWidth = 5;
    g.beginPath(); g.moveTo(-14, -4); g.lineTo(-32, -12); g.moveTo(14, -4); g.lineTo(32, -12); g.stroke();
    g.fillStyle = '#263238'; g.fillRect(-36, -18, 8, 8); g.fillRect(28, -18, 8, 8);
    rotor(g, -32, -20, 22, rot); rotor(g, 32, -20, 22, rot + 1);
    g.fillStyle = bodyFill(g, s, -14, 14); rr(g, -24, -12, 48, 26, 12); g.fill();
    g.strokeStyle = s.edge; g.lineWidth = 2; g.stroke();
    if (s.galaxy) {
      g.save(); rr(g, -24, -12, 48, 26, 12); g.clip();
      [[-18, -6], [-10, 6], [-4, -4], [-14, 2], [-20, 8], [-6, 9]].forEach(([x, y], i) => {
        g.fillStyle = i % 2 ? '#fff59d' : '#ffffff'; g.globalAlpha = 0.5 + 0.5 * Math.abs(Math.sin(t * 3 + i));
        g.beginPath(); g.arc(x, y, 1.4, 0, Math.PI * 2); g.fill();
      });
      g.globalAlpha = 1; g.restore();
    }
    g.fillStyle = '#d6f1ff'; rr(g, 0, -8, 22, 16, 7); g.fill();
    eyes(g, 7, -1);
    g.fillStyle = 'rgba(255, 90, 90, 0.5)'; g.beginPath(); g.arc(-4, 5, 3, 0, Math.PI * 2); g.fill();
    g.fillStyle = (Math.floor(t * 4) % 2) ? '#4dff88' : '#1b7a3c';
    g.beginPath(); g.arc(-17, -4, 2.6, 0, Math.PI * 2); g.fill();
    g.fillStyle = 'rgba(255,255,255,0.45)'; rr(g, -18, -9, 16, 4, 2); g.fill();
  }

  // ---- 쿼드콥터: 프로펠러 4개 ----
  function quad(g, s, rot, t) {
    // 뒤쪽 프로펠러 2개 (작고 흐리게)
    g.strokeStyle = '#78909c'; g.lineWidth = 4;
    g.beginPath(); g.moveTo(-8, -8); g.lineTo(-20, -18); g.moveTo(8, -8); g.lineTo(20, -18); g.stroke();
    rotor(g, -20, -24, 15, rot + 0.5, 0.6); rotor(g, 20, -24, 15, rot + 1.5, 0.6);
    skids(g);
    g.strokeStyle = '#37474f'; g.lineWidth = 5;
    g.beginPath(); g.moveTo(-10, 0); g.lineTo(-34, -10); g.moveTo(10, 0); g.lineTo(34, -10); g.stroke();
    g.fillStyle = '#263238'; g.fillRect(-38, -16, 8, 8); g.fillRect(30, -16, 8, 8);
    rotor(g, -34, -18, 19, rot); rotor(g, 34, -18, 19, rot + 1);
    g.fillStyle = bodyFill(g, s, -18, 16);
    g.beginPath(); g.arc(0, 0, 18, 0, Math.PI * 2); g.fill();
    g.strokeStyle = s.edge; g.lineWidth = 2; g.stroke();
    g.fillStyle = '#d6f1ff'; g.beginPath(); g.arc(6, -1, 10, 0, Math.PI * 2); g.fill();
    eyes(g, 1, -1, 0.9);
    g.strokeStyle = '#37474f'; g.lineWidth = 2; g.beginPath(); g.moveTo(-4, -17); g.lineTo(-8, -28); g.stroke();
    g.fillStyle = (Math.floor(t * 4) % 2) ? '#ff5252' : '#8b1d1d'; g.beginPath(); g.arc(-8, -29, 3, 0, Math.PI * 2); g.fill();
  }

  // ---- 헬리콥터: 큰 프로펠러 + 꼬리 ----
  function heli(g, s, rot, t) {
    g.strokeStyle = '#455a64'; g.lineWidth = 3; g.lineCap = 'round';
    g.beginPath(); g.moveTo(-10, 12); g.lineTo(-12, 20); g.moveTo(10, 12); g.lineTo(12, 20);
    g.moveTo(-22, 20); g.lineTo(24, 20); g.stroke();
    // 꼬리
    g.fillStyle = s.c2; g.beginPath(); g.moveTo(-18, -6); g.lineTo(-50, -4); g.lineTo(-50, 2); g.lineTo(-18, 6); g.fill();
    g.fillStyle = s.edge; g.beginPath(); g.moveTo(-46, -4); g.lineTo(-54, -16); g.lineTo(-50, -4); g.fill();
    const tr = Math.abs(Math.cos(rot * 1.3));
    g.fillStyle = 'rgba(200,230,255,0.5)'; g.beginPath(); g.arc(-50, -1, 8, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#546e7a'; g.beginPath(); g.ellipse(-50, -1, 2, 8 * tr + 1, 0, 0, Math.PI * 2); g.fill();
    // 몸통
    g.fillStyle = bodyFill(g, s, -15, 15);
    g.beginPath(); g.ellipse(0, 0, 26, 15, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = s.edge; g.lineWidth = 2; g.stroke();
    g.fillStyle = '#d6f1ff'; g.beginPath(); g.ellipse(12, -3, 12, 10, 0, -Math.PI / 2, Math.PI / 2); g.lineTo(6, 7); g.lineTo(6, -13); g.fill();
    eyes(g, 8, -3, 0.9);
    // 메인 프로펠러
    g.fillStyle = '#37474f'; g.fillRect(-2, -22, 4, 8);
    rotor(g, 0, -23, 44, rot);
  }

  // ---- 꿀벌 드론: 줄무늬 + 날개 ----
  function bee(g, s, rot, t) {
    const flap = Math.sin(rot * 1.5);
    g.fillStyle = 'rgba(220,240,255,0.75)'; g.strokeStyle = 'rgba(120,160,200,0.8)'; g.lineWidth = 1.5;
    g.save(); g.translate(-4, -12); g.rotate(-0.5 + flap * 0.5);
    g.beginPath(); g.ellipse(0, -12, 9, 15, 0, 0, Math.PI * 2); g.fill(); g.stroke(); g.restore();
    g.save(); g.translate(4, -12); g.rotate(0.3 - flap * 0.5);
    g.beginPath(); g.ellipse(0, -12, 8, 14, 0, 0, Math.PI * 2); g.fill(); g.stroke(); g.restore();
    // 침
    g.fillStyle = '#3e2723'; g.beginPath(); g.moveTo(-24, -3); g.lineTo(-34, 0); g.lineTo(-24, 3); g.fill();
    // 몸통 + 줄무늬
    g.save();
    g.beginPath(); g.ellipse(0, 0, 26, 16, 0, 0, Math.PI * 2);
    g.fillStyle = bodyFill(g, s, -16, 16); g.fill(); g.clip();
    g.fillStyle = '#3e2723'; for (const x of [-18, -8, 2]) g.fillRect(x, -20, 6, 40);
    g.restore();
    g.strokeStyle = s.edge; g.lineWidth = 2; g.beginPath(); g.ellipse(0, 0, 26, 16, 0, 0, Math.PI * 2); g.stroke();
    // 더듬이
    g.strokeStyle = '#3e2723'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(16, -12); g.quadraticCurveTo(20, -26, 28, -26); g.moveTo(20, -10); g.quadraticCurveTo(28, -20, 34, -18); g.stroke();
    g.fillStyle = '#3e2723'; g.beginPath(); g.arc(28, -26, 2.5, 0, Math.PI * 2); g.arc(34, -18, 2.5, 0, Math.PI * 2); g.fill();
    eyes(g, 11, -3, 0.95);
    g.fillStyle = 'rgba(255, 90, 90, 0.5)'; g.beginPath(); g.arc(14, 7, 3, 0, Math.PI * 2); g.fill();
  }

  // ---- 로켓 드론: 뒤에서 불꽃 ----
  function rocket(g, s, rot, t) {
    const fl = 10 + Math.abs(Math.sin(t * 30)) * 10;
    g.fillStyle = '#ff9800'; g.beginPath(); g.moveTo(-26, -7); g.lineTo(-26 - fl - 6, 0); g.lineTo(-26, 7); g.fill();
    g.fillStyle = '#ffeb3b'; g.beginPath(); g.moveTo(-26, -4); g.lineTo(-26 - fl, 0); g.lineTo(-26, 4); g.fill();
    g.fillStyle = '#e53935';
    g.beginPath(); g.moveTo(-14, -10); g.lineTo(-28, -22); g.lineTo(-24, -10); g.fill();
    g.beginPath(); g.moveTo(-14, 10); g.lineTo(-28, 22); g.lineTo(-24, 10); g.fill();
    g.fillStyle = bodyFill(g, s, -12, 12);
    g.beginPath(); g.moveTo(-26, -12); g.lineTo(12, -12); g.quadraticCurveTo(34, -10, 36, 0); g.quadraticCurveTo(34, 10, 12, 12); g.lineTo(-26, 12); g.closePath(); g.fill();
    g.strokeStyle = s.edge; g.lineWidth = 2; g.stroke();
    g.fillStyle = '#e53935'; g.fillRect(-20, -12, 6, 24);
    g.fillStyle = '#e53935'; g.beginPath(); g.moveTo(26, -7); g.quadraticCurveTo(36, -4, 36, 0); g.quadraticCurveTo(36, 4, 26, 7); g.fill();
    g.fillStyle = '#90caf9'; g.beginPath(); g.arc(6, 0, 9, 0, Math.PI * 2); g.fill();
    g.strokeStyle = s.edge; g.lineWidth = 2; g.stroke();
    eyes(g, 2, 0, 0.75);
    // 위쪽 작은 프로펠러
    g.fillStyle = '#37474f'; g.fillRect(-6, -18, 4, 7);
    rotor(g, -4, -19, 16, rot);
  }

  // ---- UFO 드론: 비행접시 ----
  function ufo(g, s, rot, t) {
    g.fillStyle = 'rgba(180, 255, 180, 0.25)';
    g.beginPath(); g.moveTo(-14, 8); g.lineTo(14, 8); g.lineTo(22, 28); g.lineTo(-22, 28); g.fill();
    g.fillStyle = 'rgba(190, 235, 255, 0.85)';
    g.beginPath(); g.arc(0, -4, 17, Math.PI, 0); g.fill();
    g.strokeStyle = '#7aa7c7'; g.lineWidth = 1.5; g.stroke();
    // 작은 외계인 얼굴
    g.fillStyle = '#9ccc65'; g.beginPath(); g.ellipse(2, -8, 9, 8, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#222'; g.beginPath(); g.ellipse(-1, -9, 2.4, 3.2, 0, 0, Math.PI * 2); g.ellipse(6, -9, 2.4, 3.2, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#fff'; g.beginPath(); g.arc(-0.5, -10, 1, 0, Math.PI * 2); g.arc(6.5, -10, 1, 0, Math.PI * 2); g.fill();
    g.fillStyle = bodyFill(g, s, -6, 10);
    g.beginPath(); g.ellipse(0, 2, 36, 10, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = s.edge; g.lineWidth = 2; g.stroke();
    const cols = ['#ff5252', '#ffeb3b', '#40c4ff', '#ff80ab', '#b2ff59'];
    for (let i = 0; i < 5; i++) {
      g.fillStyle = cols[(i + Math.floor(t * 6)) % 5];
      g.beginPath(); g.arc(-24 + i * 12, 4, 3, 0, Math.PI * 2); g.fill();
    }
    g.strokeStyle = '#78909c'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, -21); g.lineTo(0, -28); g.stroke();
    g.fillStyle = (Math.floor(t * 3) % 2) ? '#ff5252' : '#ffeb3b'; g.beginPath(); g.arc(0, -29, 3, 0, Math.PI * 2); g.fill();
  }

  // ===== 🎁 선물박스 드론 =====
  function plane(g, s, rot, t) {
    g.fillStyle = s.c2; g.beginPath(); g.moveTo(-20, -4); g.lineTo(-34, -20); g.lineTo(-27, -20); g.lineTo(-12, -4); g.fill();
    g.fillStyle = s.edge; g.beginPath(); g.ellipse(-26, 2, 9, 3, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = bodyFill(g, s, -11, 11); g.beginPath(); g.ellipse(0, 0, 30, 11, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = s.edge; g.lineWidth = 2; g.stroke();
    g.fillStyle = '#ffffff'; g.fillRect(-16, -2, 22, 4);
    g.fillStyle = s.edge; g.beginPath(); g.ellipse(-2, 5, 15, 5, 0.1, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#d6f1ff'; g.beginPath(); g.ellipse(10, -6, 10, 7, 0, Math.PI, Math.PI * 2); g.fill();
    eyes(g, 5, -6, 0.75);
    g.fillStyle = '#455a64'; g.beginPath(); g.arc(31, 0, 3.5, 0, Math.PI * 2); g.fill();
    g.fillStyle = 'rgba(200,230,255,0.5)'; g.beginPath(); g.ellipse(33, 0, 2.5, 15, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#546e7a'; g.beginPath(); g.ellipse(33, 0, 2, 14 * Math.abs(Math.cos(rot)) + 1, 0, 0, Math.PI * 2); g.fill();
  }
  function balloon(g, s, rot, t) {
    g.strokeStyle = '#6d4c41'; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(-14, 4); g.lineTo(-8, 16); g.moveTo(14, 4); g.lineTo(8, 16); g.stroke();
    g.save(); g.beginPath(); g.arc(0, -10, 21, 0, Math.PI * 2); g.clip();
    for (let i = -3; i <= 3; i++) { g.fillStyle = i % 2 ? s.c1 : s.c2; g.fillRect(i * 7 - 3.5, -32, 7, 44); }
    g.restore();
    g.strokeStyle = s.edge; g.lineWidth = 2; g.beginPath(); g.arc(0, -10, 21, 0, Math.PI * 2); g.stroke();
    g.fillStyle = 'rgba(255,255,255,0.4)'; g.beginPath(); g.ellipse(-8, -20, 5, 8, -0.4, 0, Math.PI * 2); g.fill();
    eyes(g, 0, -10);
    g.fillStyle = 'rgba(255, 90, 90, 0.5)'; g.beginPath(); g.arc(-6, -2, 3, 0, Math.PI * 2); g.fill();
    const f = 4 + Math.abs(Math.sin(t * 20)) * 4;
    g.fillStyle = '#ff9800'; g.beginPath(); g.moveTo(-3, 15); g.lineTo(0, 15 - f); g.lineTo(3, 15); g.fill();
    g.fillStyle = '#8d6e63'; g.fillRect(-9, 15, 18, 10);
    g.strokeStyle = '#5d4037'; g.lineWidth = 1; g.beginPath(); g.moveTo(-3, 15); g.lineTo(-3, 25); g.moveTo(3, 15); g.lineTo(3, 25); g.stroke();
  }
  function fish(g, s, rot, t) {
    const wag = Math.sin(t * 10) * 3;
    g.fillStyle = s.c2; g.beginPath(); g.moveTo(-18, 0); g.lineTo(-34, -13 + wag); g.lineTo(-29, 0); g.lineTo(-34, 13 + wag); g.fill();
    g.fillStyle = '#37474f'; g.fillRect(-3, -26, 3, 14);
    rotor(g, -2, -27, 18, rot);
    g.fillStyle = bodyFill(g, s, -14, 14); g.beginPath(); g.ellipse(0, 0, 24, 14, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = s.edge; g.lineWidth = 2; g.stroke();
    g.fillStyle = 'rgba(255,255,255,0.45)'; g.beginPath(); g.ellipse(2, 6, 16, 5, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = 'rgba(0,80,90,0.35)'; g.lineWidth = 1.5;
    for (const x of [-10, -3, 4]) { g.beginPath(); g.arc(x, 0, 6, -0.9, 0.9); g.stroke(); }
    g.fillStyle = s.c2; g.beginPath(); g.moveTo(-4, 6); g.lineTo(-12, 16); g.lineTo(4, 10); g.fill();
    eyes(g, 9, -4, 0.9);
    g.fillStyle = '#e57373'; g.beginPath(); g.arc(22, 3, 2, 0, Math.PI * 2); g.fill();
  }
  function butterfly(g, s, rot, t) {
    const k = 0.55 + 0.45 * Math.abs(Math.sin(t * 9));
    g.save(); g.scale(1, k);
    g.fillStyle = s.c2; g.beginPath(); g.ellipse(-8, -16 / k, 13, 18, -0.4, 0, Math.PI * 2); g.fill();
    g.fillStyle = s.c1; g.beginPath(); g.ellipse(6, -15 / k, 11, 16, 0.4, 0, Math.PI * 2); g.fill();
    g.fillStyle = 'rgba(255,255,255,0.75)'; g.beginPath(); g.arc(-10, -20 / k, 4, 0, Math.PI * 2); g.arc(7, -18 / k, 3.5, 0, Math.PI * 2); g.fill();
    g.restore();
    g.fillStyle = s.c1; g.beginPath(); g.ellipse(-6, 8, 10, 8, 0.5, 0, Math.PI * 2); g.fill();
    g.fillStyle = s.c2; g.beginPath(); g.ellipse(6, 8, 9, 7, -0.5, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#4a148c'; g.beginPath(); g.ellipse(0, 0, 18, 6, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.arc(18, -2, 8, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#4a148c'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(20, -8); g.quadraticCurveTo(24, -20, 30, -20); g.moveTo(22, -7); g.quadraticCurveTo(30, -14, 34, -12); g.stroke();
    eyes(g, 15, -3, 0.6);
  }
  function cat(g, s, rot, t) {
    skids(g);
    g.strokeStyle = '#37474f'; g.lineWidth = 5;
    g.beginPath(); g.moveTo(-14, -2); g.lineTo(-34, -12); g.moveTo(14, -2); g.lineTo(34, -12); g.stroke();
    rotor(g, -34, -18, 18, rot); rotor(g, 34, -18, 18, rot + 1);
    g.strokeStyle = s.c2; g.lineWidth = 5; g.lineCap = 'round';
    g.beginPath(); g.moveTo(-20, 6); g.quadraticCurveTo(-40, 4, -34, -10); g.stroke();
    g.fillStyle = s.c2;
    g.beginPath(); g.moveTo(-16, -8); g.lineTo(-10, -26); g.lineTo(-2, -10); g.fill();
    g.beginPath(); g.moveTo(4, -10); g.lineTo(12, -26); g.lineTo(18, -8); g.fill();
    g.fillStyle = '#ffab91';
    g.beginPath(); g.moveTo(-12, -10); g.lineTo(-10, -20); g.lineTo(-6, -11); g.fill();
    g.beginPath(); g.moveTo(8, -11); g.lineTo(12, -20); g.lineTo(14, -10); g.fill();
    g.fillStyle = bodyFill(g, s, -14, 14); rr(g, -22, -13, 44, 28, 13); g.fill();
    g.strokeStyle = s.edge; g.lineWidth = 2; g.stroke();
    eyes(g, 2, -2);
    g.fillStyle = '#ec407a'; g.beginPath(); g.moveTo(12, 5); g.lineTo(18, 5); g.lineTo(15, 8); g.fill();
    g.strokeStyle = '#5d4037'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(18, 7); g.lineTo(30, 4); g.moveTo(18, 9); g.lineTo(30, 10); g.stroke();
    g.lineCap = 'butt';
  }
  function car(g, s, rot, t) {
    g.fillStyle = '#37474f'; g.fillRect(-21, -24, 3, 10); g.fillRect(18, -24, 3, 10);
    rotor(g, -20, -25, 17, rot); rotor(g, 20, -25, 17, rot + 1);
    g.fillStyle = bodyFill(g, s, -16, 0); rr(g, -18, -16, 34, 16, 7); g.fill();
    g.fillStyle = bodyFill(g, s, -4, 12); rr(g, -30, -4, 62, 16, 7); g.fill();
    g.strokeStyle = s.edge; g.lineWidth = 2; g.stroke();
    g.fillStyle = '#d6f1ff'; rr(g, -14, -13, 12, 9, 3); g.fill(); rr(g, 1, -13, 13, 9, 3); g.fill();
    eyes(g, 2, -9, 0.6);
    g.fillStyle = '#fff59d'; g.beginPath(); g.arc(29, 3, 3, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#263238'; g.beginPath(); g.arc(-17, 13, 6, 0, Math.PI * 2); g.arc(18, 13, 6, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#b0bec5'; g.beginPath(); g.arc(-17, 13, 2.5, 0, Math.PI * 2); g.arc(18, 13, 2.5, 0, Math.PI * 2); g.fill();
  }

  // ===== ⭐ 별 드론 (특별 디자인) =====
  function aura(g, t) {
    const gr = g.createRadialGradient(0, 0, 4, 0, 0, 46);
    gr.addColorStop(0, 'rgba(255,250,200,0.55)'); gr.addColorStop(1, 'rgba(255,250,200,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 46, 0, Math.PI * 2); g.fill();
    for (let i = 0; i < 4; i++) {
      const a = t * 2 + (i * Math.PI) / 2, x = Math.cos(a) * 40, y = Math.sin(a) * 28, sz = 3 + 2 * Math.abs(Math.sin(t * 5 + i));
      g.fillStyle = ['#fff59d', '#ffffff', '#b3e5fc', '#f8bbd0'][i];
      g.beginPath(); g.moveTo(x, y - sz * 1.6); g.lineTo(x + sz * 0.5, y); g.lineTo(x, y + sz * 1.6); g.lineTo(x - sz * 0.5, y); g.fill();
      g.beginPath(); g.moveTo(x - sz * 1.6, y); g.lineTo(x, y + sz * 0.5); g.lineTo(x + sz * 1.6, y); g.lineTo(x, y - sz * 0.5); g.fill();
    }
  }
  function starPath(g, R, r) {
    g.beginPath();
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, d = i % 2 ? r : R; g.lineTo(Math.cos(a) * d, Math.sin(a) * d + 2); }
    g.closePath();
  }
  function starbody(g, s, rot, t) {
    g.fillStyle = '#37474f'; g.fillRect(-1.5, -32, 3, 10);
    rotor(g, 0, -33, 20, rot);
    g.fillStyle = bodyFill(g, s, -24, 24); starPath(g, 27, 13); g.fill();
    g.strokeStyle = s.edge; g.lineWidth = 2; g.stroke();
    g.fillStyle = 'rgba(255,255,255,0.6)'; g.beginPath(); g.ellipse(-6, -6, 4, 7, -0.5, 0, Math.PI * 2); g.fill();
    eyes(g, -2, 1, 0.85);
    g.fillStyle = 'rgba(255, 90, 90, 0.5)'; g.beginPath(); g.arc(-7, 9, 2.5, 0, Math.PI * 2); g.arc(15, 9, 2.5, 0, Math.PI * 2); g.fill();
  }
  function crystal(g, s, rot, t) {
    g.fillStyle = '#37474f'; g.fillRect(-1.5, -26, 3, 10);
    rotor(g, 0, -27, 22, rot);
    const pts = [[-26, -2], [-13, -17], [13, -17], [26, -2], [0, 22]];
    g.fillStyle = bodyFill(g, s, -17, 22);
    g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.fill();
    g.strokeStyle = s.edge; g.lineWidth = 2; g.stroke();
    g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 1.2;
    g.beginPath(); g.moveTo(-26, -2); g.lineTo(26, -2); g.moveTo(-13, -17); g.lineTo(-6, -2); g.lineTo(0, 22);
    g.moveTo(13, -17); g.lineTo(6, -2); g.lineTo(0, 22); g.moveTo(-6, -2); g.lineTo(0, -17); g.lineTo(6, -2); g.stroke();
    const sh = (t * 0.8) % 2;
    g.fillStyle = `rgba(255,255,255,${0.7 * Math.max(0, 1 - Math.abs(sh - 0.5) * 2)})`;
    g.beginPath(); g.ellipse(-10 + sh * 20, -8, 3, 9, 0.6, 0, Math.PI * 2); g.fill();
    eyes(g, -4, 4, 0.75);
  }
  function unicorn(g, s, rot, t) {
    classic(g, s, rot, t);
    const cols = ['#ff5252', '#ffa726', '#ffee58', '#66bb6a', '#42a5f5', '#ab47bc'];
    cols.forEach((c, i) => { g.fillStyle = c; g.beginPath(); g.arc(-20 + i * 5, -12 - Math.sin(i + t * 4) * 1.5, 4.5, 0, Math.PI * 2); g.fill(); });
    g.fillStyle = '#ffd54f'; g.beginPath(); g.moveTo(10, -11); g.lineTo(22, -34); g.lineTo(18, -10); g.fill();
    g.strokeStyle = '#ff8f00'; g.lineWidth = 1.2;
    g.beginPath(); g.moveTo(12, -15); g.lineTo(19, -16); g.moveTo(14, -21); g.lineTo(20, -22); g.moveTo(17, -27); g.lineTo(21, -28); g.stroke();
  }
  function phoenix(g, s, rot, t) {
    for (let i = 0; i < 3; i++) {
      const f = Math.sin(t * 12 + i * 2) * 4, y = -6 + i * 6;
      g.fillStyle = ['#ff5722', '#ff9800', '#ffeb3b'][i];
      g.beginPath(); g.moveTo(-14, y - 4); g.quadraticCurveTo(-34, y + f - 6, -46 + i * 4, y + f); g.quadraticCurveTo(-30, y + f + 4, -14, y + 4); g.fill();
    }
    const flap = Math.sin(t * 9);
    g.save(); g.translate(-2, -6); g.rotate(-0.6 + flap * 0.5);
    const wg = g.createLinearGradient(0, -30, 0, 0); wg.addColorStop(0, '#ffeb3b'); wg.addColorStop(1, '#ff5722');
    g.fillStyle = wg; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(-10, -30, 8, -34); g.quadraticCurveTo(6, -18, 16, -8); g.closePath(); g.fill();
    g.restore();
    g.fillStyle = bodyFill(g, s, -13, 13); g.beginPath(); g.ellipse(0, 0, 21, 13, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = s.edge; g.lineWidth = 2; g.stroke();
    g.fillStyle = '#ffeb3b'; g.beginPath(); g.moveTo(10, -11); g.lineTo(14, -22); g.lineTo(17, -11); g.lineTo(21, -18); g.lineTo(20, -8); g.fill();
    g.fillStyle = '#ffc107'; g.beginPath(); g.moveTo(20, -3); g.lineTo(31, 1); g.lineTo(20, 4); g.fill();
    eyes(g, 6, -4, 0.8);
  }

  // ===== 새로 추가된 드론 15종 =====
  function topRotor(g, rot, y = -24, half = 20) {
    g.fillStyle = '#37474f'; g.fillRect(-1.5, y + 1, 3, 9);
    rotor(g, 0, y, half, rot);
  }
  function armRotors(g, rot, y = -16, x = 32) {
    g.strokeStyle = '#37474f'; g.lineWidth = 4;
    g.beginPath(); g.moveTo(-12, -2); g.lineTo(-x, y + 4); g.moveTo(12, -2); g.lineTo(x, y + 4); g.stroke();
    rotor(g, -x, y, 17, rot); rotor(g, x, y, 17, rot + 1);
  }
  function cheeks(g, x1, x2, y) {
    g.fillStyle = 'rgba(255, 90, 90, 0.45)'; g.beginPath(); g.arc(x1, y, 3, 0, Math.PI * 2); g.arc(x2, y, 3, 0, Math.PI * 2); g.fill();
  }
  function mango(g, s, rot, t) {
    topRotor(g, rot, -26);
    g.save(); g.rotate(-0.25);
    g.fillStyle = bodyFill(g, s, -16, 16); g.beginPath(); g.ellipse(0, 0, 25, 17, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = s.edge; g.lineWidth = 2; g.stroke();
    g.fillStyle = 'rgba(255,90,60,0.35)'; g.beginPath(); g.ellipse(-10, -6, 12, 8, 0, 0, Math.PI * 2); g.fill();
    g.restore();
    g.fillStyle = '#43a047'; g.beginPath(); g.ellipse(-8, -18, 9, 4, -0.5, 0, Math.PI * 2); g.fill();
    eyes(g, 3, -2); cheeks(g, -2, 18, 6);
  }
  function pineapple(g, s, rot, t) {
    armRotors(g, rot, -12, 34);
    g.fillStyle = '#2e7d32';
    for (let i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(i * 5 - 4, -14); g.lineTo(i * 7, -32 + Math.abs(i) * 4); g.lineTo(i * 5 + 4, -14); g.fill(); }
    g.fillStyle = bodyFill(g, s, -16, 18); g.beginPath(); g.ellipse(0, 2, 20, 18, 0, 0, Math.PI * 2); g.fill();
    g.save(); g.beginPath(); g.ellipse(0, 2, 20, 18, 0, 0, Math.PI * 2); g.clip();
    g.strokeStyle = 'rgba(150,90,0,0.55)'; g.lineWidth = 1.3;
    for (let k = -40; k < 40; k += 8) { g.beginPath(); g.moveTo(k, -20); g.lineTo(k + 40, 24); g.moveTo(k + 40, -20); g.lineTo(k, 24); g.stroke(); }
    g.restore();
    g.strokeStyle = s.edge; g.lineWidth = 2; g.beginPath(); g.ellipse(0, 2, 20, 18, 0, 0, Math.PI * 2); g.stroke();
    eyes(g, 2, 0); cheeks(g, -3, 17, 8);
  }
  function orangeFruit(g, s, rot, t) {
    topRotor(g, rot, -28);
    g.fillStyle = bodyFill(g, s, -19, 19); g.beginPath(); g.arc(0, 0, 19, 0, Math.PI * 2); g.fill();
    g.strokeStyle = s.edge; g.lineWidth = 2; g.stroke();
    g.fillStyle = 'rgba(255,255,255,0.25)';
    for (const [x, y] of [[-10, -4], [-6, 8], [8, 10], [-12, 6], [4, -12]]) { g.beginPath(); g.arc(x, y, 1.3, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = '#43a047'; g.beginPath(); g.ellipse(6, -19, 7, 3.5, 0.4, 0, Math.PI * 2); g.fill();
    eyes(g, 2, -2); cheeks(g, -2, 17, 6);
  }
  function strawberry(g, s, rot, t) {
    topRotor(g, rot, -30);
    g.fillStyle = bodyFill(g, s, -16, 20);
    g.beginPath(); g.moveTo(-20, -8); g.quadraticCurveTo(-22, 10, 0, 22); g.quadraticCurveTo(22, 10, 20, -8); g.quadraticCurveTo(0, -18, -20, -8); g.fill();
    g.strokeStyle = s.edge; g.lineWidth = 2; g.stroke();
    g.fillStyle = '#fff59d';
    for (const [x, y] of [[-12, -2], [-6, 8], [0, 14], [-14, 6], [8, 10], [12, 2], [-4, -4]]) { g.beginPath(); g.ellipse(x, y, 1.2, 2, 0, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = '#2e7d32';
    for (let i = -2; i <= 2; i++) { g.beginPath(); g.ellipse(i * 6, -13, 6, 3, i * 0.5, 0, Math.PI * 2); g.fill(); }
    eyes(g, 3, 0, 0.9);
  }
  function watermelon(g, s, rot, t) {
    topRotor(g, rot, -28);
    g.fillStyle = s.c2; g.beginPath(); g.arc(0, 0, 20, 0, Math.PI * 2); g.fill();
    g.save(); g.beginPath(); g.arc(0, 0, 20, 0, Math.PI * 2); g.clip();
    g.strokeStyle = '#1b5e20'; g.lineWidth = 4;
    for (let k = -16; k <= 16; k += 9) { g.beginPath(); g.moveTo(k, -22); g.quadraticCurveTo(k + 6, 0, k, 22); g.stroke(); }
    g.restore();
    g.strokeStyle = s.edge; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, 20, 0, Math.PI * 2); g.stroke();
    g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(7, -1, 12, 9, 0, 0, Math.PI * 2); g.fill();
    eyes(g, 3, -1, 0.9);
    g.fillStyle = '#e53935'; g.beginPath(); g.arc(8, 6, 3, 0, Math.PI); g.fill();
  }
  function banana(g, s, rot, t) {
    armRotors(g, rot, -18, 30);
    g.fillStyle = bodyFill(g, s, -10, 14);
    g.beginPath(); g.moveTo(-30, -6); g.quadraticCurveTo(0, 26, 30, -6); g.quadraticCurveTo(0, 8, -30, -6); g.fill();
    g.beginPath(); g.moveTo(-26, -4); g.quadraticCurveTo(0, 16, 26, -4); g.quadraticCurveTo(0, -12, -26, -4); g.fill();
    g.strokeStyle = s.edge; g.lineWidth = 2;
    g.beginPath(); g.moveTo(-30, -6); g.quadraticCurveTo(0, 26, 30, -6); g.stroke();
    g.fillStyle = '#5d4037'; g.fillRect(-33, -9, 5, 5); g.fillRect(28, -9, 5, 5);
    eyes(g, 0, 2, 0.85);
  }
  function shark(g, s, rot, t) {
    const wag = Math.sin(t * 9) * 3;
    g.fillStyle = s.c2; g.beginPath(); g.moveTo(-20, 0); g.lineTo(-36, -14 + wag); g.lineTo(-30, 0); g.lineTo(-36, 10 + wag); g.fill();
    g.beginPath(); g.moveTo(-6, -11); g.lineTo(2, -28); g.lineTo(10, -11); g.fill();
    g.fillStyle = '#37474f'; g.fillRect(1, -36, 3, 9); rotor(g, 2, -37, 16, rot);
    g.fillStyle = bodyFill(g, s, -12, 12); g.beginPath(); g.ellipse(0, 0, 28, 13, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = s.edge; g.lineWidth = 2; g.stroke();
    g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(4, 6, 20, 6, 0, 0, Math.PI); g.fill();
    g.fillStyle = '#fff'; for (let x = 12; x < 26; x += 4) { g.beginPath(); g.moveTo(x, 3); g.lineTo(x + 2, 7); g.lineTo(x + 4, 3); g.fill(); }
    g.strokeStyle = 'rgba(0,0,0,0.3)'; g.lineWidth = 1.2; for (const x of [-4, -1, 2]) { g.beginPath(); g.moveTo(x, -4); g.lineTo(x - 2, 4); g.stroke(); }
    eyes(g, 10, -4, 0.75);
  }
  function tiger(g, s, rot, t) {
    armRotors(g, rot, -18, 34);
    const sw = Math.sin(t * 6) * 0.3;
    g.save(); g.translate(-20, 4); g.rotate(sw);
    g.strokeStyle = s.c2; g.lineWidth = 6; g.lineCap = 'round';
    g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(-18, 4, -16, -14); g.stroke();
    g.strokeStyle = '#222'; g.lineWidth = 2; g.beginPath(); g.moveTo(-8, 3); g.lineTo(-10, -1); g.moveTo(-15, -4); g.lineTo(-19, -6); g.stroke();
    g.restore(); g.lineCap = 'butt';
    g.fillStyle = s.c2;
    g.beginPath(); g.arc(-8, -13, 6, 0, Math.PI * 2); g.arc(10, -13, 6, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#ffccbc'; g.beginPath(); g.arc(-8, -13, 3, 0, Math.PI * 2); g.arc(10, -13, 3, 0, Math.PI * 2); g.fill();
    g.save(); rr(g, -22, -12, 44, 28, 13); g.fillStyle = bodyFill(g, s, -12, 16); g.fill(); g.clip();
    g.fillStyle = '#222';
    for (const x of [-16, -8, 16]) { g.beginPath(); g.moveTo(x, -12); g.lineTo(x + 3, -4); g.lineTo(x + 6, -12); g.fill(); }
    g.fillStyle = '#fff3e0'; g.beginPath(); g.ellipse(8, 8, 12, 7, 0, 0, Math.PI * 2); g.fill();
    g.restore();
    g.strokeStyle = s.edge; g.lineWidth = 2; rr(g, -22, -12, 44, 28, 13); g.stroke();
    eyes(g, 3, -1);
    g.fillStyle = '#5d4037'; g.beginPath(); g.moveTo(10, 6); g.lineTo(16, 6); g.lineTo(13, 9); g.fill();
  }
  function penguin(g, s, rot, t) {
    topRotor(g, rot, -30, 18);
    g.fillStyle = '#ff9800'; g.beginPath(); g.ellipse(-6, 20, 6, 3, 0, 0, Math.PI * 2); g.ellipse(8, 20, 6, 3, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#263238'; g.beginPath(); g.ellipse(0, 0, 19, 22, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(-18, 2, 5, 12, 0.4, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(4, 4, 12, 16, 0, 0, Math.PI * 2); g.fill();
    eyes(g, 0, -8, 0.8);
    g.fillStyle = '#ff9800'; g.beginPath(); g.moveTo(10, -3); g.lineTo(20, 0); g.lineTo(10, 3); g.fill();
    cheeks(g, -2, 16, 3);
  }
  function octopus(g, s, rot, t) {
    topRotor(g, rot, -30);
    g.strokeStyle = s.c2; g.lineWidth = 5; g.lineCap = 'round';
    for (let i = 0; i < 5; i++) {
      const x = -14 + i * 7, w = Math.sin(t * 6 + i) * 4;
      g.beginPath(); g.moveTo(x, 8); g.quadraticCurveTo(x + w, 18, x - w, 26); g.stroke();
    }
    g.lineCap = 'butt';
    g.fillStyle = bodyFill(g, s, -20, 12); g.beginPath(); g.ellipse(0, -4, 20, 18, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = s.edge; g.lineWidth = 2; g.stroke();
    g.fillStyle = 'rgba(255,255,255,0.35)'; for (const [x, y] of [[-10, -12], [-4, -16], [-12, -4]]) { g.beginPath(); g.arc(x, y, 2.5, 0, Math.PI * 2); g.fill(); }
    eyes(g, 2, -4); cheeks(g, -2, 18, 4);
  }
  function panda(g, s, rot, t) {
    armRotors(g, rot, -18, 34);
    g.fillStyle = '#222'; g.beginPath(); g.arc(-12, -15, 7, 0, Math.PI * 2); g.arc(12, -15, 7, 0, Math.PI * 2); g.fill();
    g.fillStyle = bodyFill(g, s, -16, 16); g.beginPath(); g.ellipse(0, 0, 22, 18, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = s.edge; g.lineWidth = 2; g.stroke();
    g.fillStyle = '#222'; g.beginPath(); g.ellipse(4, -2, 6, 7, 0.4, 0, Math.PI * 2); g.ellipse(14, -2, 5, 6, -0.4, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#fff'; g.beginPath(); g.arc(5, -2, 2.6, 0, Math.PI * 2); g.arc(14, -2, 2.4, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#222'; g.beginPath(); g.arc(6, -2, 1.4, 0, Math.PI * 2); g.arc(15, -2, 1.3, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(10, 6, 3, 2, 0, 0, Math.PI * 2); g.fill();
    cheeks(g, -2, 20, 7);
  }
  function dragon(g, s, rot, t) {
    const flap = Math.sin(t * 8);
    g.fillStyle = s.c2; g.beginPath(); g.moveTo(-18, 2); g.quadraticCurveTo(-38, 10, -44, -6); g.lineTo(-36, -2); g.quadraticCurveTo(-30, 2, -18, -4); g.fill();
    g.save(); g.translate(-4, -8); g.rotate(-0.5 + flap * 0.5);
    g.fillStyle = '#81c784'; g.beginPath(); g.moveTo(0, 0); g.lineTo(-6, -30); g.lineTo(6, -22); g.lineTo(14, -28); g.lineTo(16, -4); g.fill();
    g.restore();
    g.fillStyle = bodyFill(g, s, -13, 13); g.beginPath(); g.ellipse(0, 0, 22, 13, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = s.edge; g.lineWidth = 2; g.stroke();
    g.fillStyle = '#ffeb3b'; for (const x of [-14, -6, 2]) { g.beginPath(); g.moveTo(x, -11); g.lineTo(x + 3, -18); g.lineTo(x + 6, -11); g.fill(); }
    g.fillStyle = bodyFill(g, s, -16, 8); g.beginPath(); g.ellipse(20, -6, 11, 9, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#fff59d'; g.beginPath(); g.moveTo(16, -14); g.lineTo(14, -24); g.lineTo(20, -14); g.fill(); g.beginPath(); g.moveTo(22, -14); g.lineTo(24, -24); g.lineTo(26, -13); g.fill();
    g.fillStyle = '#fff3e0'; g.beginPath(); g.ellipse(4, 6, 12, 5, 0, 0, Math.PI); g.fill();
    eyes(g, 17, -8, 0.7);
    g.fillStyle = '#1b5e20'; g.beginPath(); g.arc(29, -4, 1.3, 0, Math.PI * 2); g.fill();
  }
  function rabbit(g, s, rot, t) {
    armRotors(g, rot, -12, 34);
    g.fillStyle = bodyFill(g, s, -40, 0);
    g.beginPath(); g.ellipse(-6, -24, 5, 14, -0.15, 0, Math.PI * 2); g.ellipse(8, -24, 5, 14, 0.15, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#f8bbd0'; g.beginPath(); g.ellipse(-6, -24, 2.5, 10, -0.15, 0, Math.PI * 2); g.ellipse(8, -24, 2.5, 10, 0.15, 0, Math.PI * 2); g.fill();
    g.fillStyle = bodyFill(g, s, -14, 16); g.beginPath(); g.ellipse(0, 2, 21, 16, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = s.edge; g.lineWidth = 2; g.stroke();
    g.fillStyle = '#fff'; g.beginPath(); g.arc(-21, 6, 5, 0, Math.PI * 2); g.fill();
    eyes(g, 2, 0);
    g.fillStyle = '#ec407a'; g.beginPath(); g.arc(15, 6, 2, 0, Math.PI * 2); g.fill();
    cheeks(g, -2, 20, 8);
  }
  function turtle(g, s, rot, t) {
    topRotor(g, rot, -28, 20);
    g.fillStyle = '#a5d6a7';
    g.beginPath(); g.ellipse(-14, 12, 5, 4, 0, 0, Math.PI * 2); g.ellipse(12, 12, 5, 4, 0, 0, Math.PI * 2); g.ellipse(-24, 6, 5, 2.5, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(24, 0, 9, 8, 0, 0, Math.PI * 2); g.fill();
    eyes(g, 21, -2, 0.6);
    g.fillStyle = bodyFill(g, s, -18, 8); g.beginPath(); g.ellipse(-2, 4, 22, 18, 0, Math.PI, 0); g.closePath(); g.fill();
    g.strokeStyle = s.edge; g.lineWidth = 2; g.stroke();
    g.fillStyle = 'rgba(255,255,255,0.25)';
    for (const [x, y] of [[-10, -4], [2, -6], [-4, -12], [8, 0], [-16, 1]]) { g.beginPath(); g.arc(x, y, 4, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = '#6d4c41'; g.fillRect(-24, 2, 44, 4);
  }
  function robot(g, s, rot, t) {
    armRotors(g, rot, -18, 34);
    g.strokeStyle = '#78909c'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, -16); g.lineTo(0, -26); g.stroke();
    g.fillStyle = (Math.floor(t * 4) % 2) ? '#ff5252' : '#40c4ff'; g.beginPath(); g.arc(0, -27, 3.5, 0, Math.PI * 2); g.fill();
    g.fillStyle = bodyFill(g, s, -16, 16); rr(g, -20, -16, 40, 32, 6); g.fill();
    g.strokeStyle = s.edge; g.lineWidth = 2; g.stroke();
    g.fillStyle = '#263238'; rr(g, -12, -9, 30, 12, 4); g.fill();
    g.fillStyle = '#40c4ff'; g.fillRect(-6, -6, 7, 6); g.fillRect(7, -6, 7, 6);
    g.fillStyle = '#90a4ae'; for (let x = -10; x < 14; x += 5) g.fillRect(x, 7, 3, 4);
    g.fillStyle = '#ffca28'; g.beginPath(); g.arc(-22, 0, 3, 0, Math.PI * 2); g.arc(22, 0, 3, 0, Math.PI * 2); g.fill();
  }

  const SHAPES = { classic, quad, heli, bee, rocket, ufo, plane, balloon, fish, butterfly, cat, car, starbody, crystal, unicorn, phoenix,
    mango, pineapple, orangeFruit, strawberry, watermelon, banana, shark, tiger, penguin, octopus, panda, dragon, rabbit, turtle, robot };

  // ===== 특수 기능 (드론마다 1개, 한 판에 3번) =====
  // type: shield(방패) proj(발사) cone(앞으로 내뿜기) swipe(주변 휘두르기) ring(퍼지는 파동) beam(레이저)
  //       lightning(번개) clear(화면의 새 모두 퇴치) tocoins(새를 코인으로) magnet(코인 자석) slow(느리게)
  //       double(코인 2배) dash(돌진) heal(하트 회복)
  const ABILITIES = {
    magnet:    { name: '코인 자석',      icon: '🧲', type: 'magnet', dur: 6, desc: '6초 동안 코인을 끌어당겨요' },
    bubble:    { name: '물방울 방패',    icon: '💧', type: 'shield', dur: 5, look: 'bubble', desc: '5초 동안 새를 막아요' },
    clover:    { name: '네잎클로버 방패', icon: '🍀', type: 'shield', dur: 6, look: 'clover', desc: '6초 동안 네잎클로버가 지켜줘요' },
    heal:      { name: '사랑의 하트',    icon: '💗', type: 'heal', desc: '하트를 1개 채워요' },
    missiles:  { name: '미니 미사일',    icon: '🎯', type: 'proj', look: 'missile', shots: [-0.12, 0.12], speed: 620, r: 10, desc: '미사일 2발로 새를 물리쳐요' },
    wind:      { name: '회오리 바람',    icon: '🌀', type: 'cone', dur: 1.3, len: 260, look: 'wind', desc: '바람으로 앞의 새를 날려 보내요' },
    sting:     { name: '벌침 발사',      icon: '🐝', type: 'proj', look: 'sting', shots: [-0.08, 0, 0.08], speed: 700, r: 8, desc: '벌침 3개를 쏴요' },
    dash:      { name: '로켓 돌진',      icon: '🚀', type: 'dash', dur: 3, desc: '3초 동안 부딪히는 새를 물리쳐요' },
    ufoBeam:   { name: 'UFO 광선',       icon: '🛸', type: 'beam', dur: 1, look: 'ufo', desc: '앞으로 긴 광선을 쏴요' },
    rainbow:   { name: '무지개 마법',    icon: '🌈', type: 'tocoins', desc: '화면의 새가 모두 코인으로 변해요' },
    bullets:   { name: '연속 발사',      icon: '✈️', type: 'proj', look: 'bullet', shots: [0, 0, 0, 0, 0], burst: 0.09, speed: 800, r: 7, desc: '총알 5발을 연달아 쏴요' },
    slow:      { name: '느릿느릿 구름',  icon: '⏳', type: 'slow', dur: 5, desc: '5초 동안 모두 느려져요' },
    bubbles:   { name: '거품 발사',      icon: '🔵', type: 'proj', look: 'bubble', shots: [-0.2, 0, 0.2], speed: 480, r: 14, desc: '거품 3개로 새를 가둬요' },
    pollen:    { name: '잠자는 꽃가루',  icon: '💤', type: 'cone', dur: 1.4, len: 240, look: 'pollen', desc: '꽃가루로 새를 재워요' },
    meow:      { name: '냐옹 파동',      icon: '🐾', type: 'ring', radius: 300, desc: '퍼지는 소리로 주변 새를 쫓아요' },
    smoke:     { name: '매연 뿜기',      icon: '💨', type: 'cone', dur: 1.4, len: 240, look: 'smoke', desc: '매연을 뿜어서 새를 물리쳐요' },
    double:    { name: '코인 2배',       icon: '✨', type: 'double', dur: 7, desc: '7초 동안 코인이 2배!' },
    crystal:   { name: '크리스탈 방패',  icon: '💎', type: 'shield', dur: 6, look: 'crystal', desc: '6초 동안 단단한 방패' },
    warp:      { name: '은하수 워프',    icon: '🌌', type: 'clear', desc: '화면의 새를 모두 물리쳐요' },
    uniBeam:   { name: '무지개 광선',    icon: '🦄', type: 'beam', dur: 1.2, look: 'rainbow', desc: '무지개 광선을 쏴요' },
    fire:      { name: '불 뿜기',        icon: '火', type: 'cone', dur: 1.5, len: 270, look: 'fire', desc: '불을 내뿜어서 새를 물리쳐요' },
    bigSeed:   { name: '왕 씨앗',        icon: '🥭', type: 'proj', look: 'bigseed', shots: [0], speed: 520, r: 22, pierce: true, desc: '큰 씨앗이 새를 뚫고 날아가요' },
    spikes:    { name: '가시 발사',      icon: '🍍', type: 'proj', look: 'spike', shots: [-0.36, -0.18, 0, 0.18, 0.36], speed: 650, r: 8, desc: '가시 5개를 부채꼴로 쏴요' },
    juice:     { name: '오렌지 주스',    icon: '🍊', type: 'cone', dur: 1.4, len: 250, look: 'juice', desc: '주스를 뿜어서 새를 물리쳐요' },
    wave:      { name: '큰 파도',        icon: '🌊', type: 'proj', look: 'wave', shots: [0], speed: 420, r: 55, pierce: true, desc: '큰 파도가 새를 쓸어가요' },
    seeds:     { name: '딸기씨 발사',    icon: '🍓', type: 'proj', look: 'seed', shots: [-0.15, 0, 0.15], speed: 700, r: 7, desc: '씨앗 3개를 쏴요' },
    tail:      { name: '꼬리 휘두르기',  icon: '🐯', type: 'swipe', dur: 0.7, radius: 130, desc: '꼬리로 주변 새를 물리쳐요' },
    melonBomb: { name: '수박 폭탄',      icon: '🍉', type: 'proj', look: 'melon', shots: [0], speed: 460, r: 16, bomb: 140, desc: '수박이 펑! 터져요' },
    boomerang: { name: '바나나 부메랑',  icon: '🍌', type: 'proj', look: 'banana', shots: [0], speed: 760, r: 14, pierce: true, boomerang: true, desc: '갔다가 돌아오는 부메랑' },
    ice:       { name: '꽁꽁 얼음',      icon: '❄️', type: 'cone', dur: 1.3, len: 250, look: 'ice', desc: '얼음으로 새를 얼려요' },
    ink:       { name: '먹물 구름',      icon: '🐙', type: 'cone', dur: 1.4, len: 240, look: 'ink', desc: '먹물로 새를 쫓아요' },
    bamboo:    { name: '대나무 창',      icon: '🎋', type: 'proj', look: 'bamboo', shots: [0], speed: 760, r: 12, pierce: true, desc: '대나무가 길게 날아가요' },
    lightning: { name: '번개',           icon: '⚡', type: 'lightning', count: 4, desc: '가까운 새 4마리에 번개!' },
    carrots:   { name: '당근 발사',      icon: '🥕', type: 'proj', look: 'carrot', shots: [-0.1, 0.1], speed: 650, r: 9, desc: '당근 2개를 쏴요' },
    shell:     { name: '등껍질 방패',    icon: '🐢', type: 'shield', dur: 7, look: 'shell', desc: '7초 동안 등껍질로 숨어요' },
    laser:     { name: '로봇 레이저',    icon: '🤖', type: 'beam', dur: 1.1, look: 'laser', desc: '레이저로 새를 물리쳐요' },
  };
  const ABILITY_OF = {
    orange: 'magnet', blue: 'bubble', green: 'clover', pink: 'heal', quad: 'missiles', heli: 'wind', bee: 'sting', rocket: 'dash',
    ufo: 'ufoBeam', rainbow: 'rainbow', plane: 'bullets', balloon: 'slow', fish: 'bubbles', butterfly: 'pollen', cat: 'meow',
    car: 'smoke', goldstar: 'double', crystal: 'crystal', galaxy: 'warp', unicorn: 'uniBeam', phoenix: 'fire',
    mango: 'bigSeed', pineapple: 'spikes', orangefruit: 'juice', shark: 'wave', strawberry: 'seeds', tiger: 'tail',
    watermelon: 'melonBomb', banana: 'boomerang', penguin: 'ice', octopus: 'ink', panda: 'bamboo', dragon: 'lightning',
    rabbit: 'carrots', turtle: 'shell', robot: 'laser',
  };
  SKINS.forEach((s) => { s.ability = ABILITIES[ABILITY_OF[s.id]]; });


  return {
    skins: SKINS,
    abilities: ABILITIES,
    get(id) { return SKINS.find((s) => s.id === id) || SKINS[0]; },
    // 고를 수 있는지: 단계 드론은 열린 단계로, 선물/별 드론은 얻었는지로 판단
    isAvailable(s, unlockedStage, owned) { return s.stage ? s.stage <= unlockedStage : owned.has(s.id); },
    draw(g, skin, x, y, ang, rot, t) {
      g.save(); g.translate(x, y);
      if (skin.special) aura(g, t);
      g.rotate(ang);
      (SHAPES[skin.shape] || classic)(g, skin, rot, t);
      g.restore();
    },
  };
})();
