// 드론 코인 대모험 — 드론 디자인(스킨)
// stage: 이 단계까지 열려 있어야 고를 수 있음 (1단계 2개 → 2단계 4개(색깔) → 3단계부터 새로운 모양)
// source: 'gift' = 선물박스(6단계~)로 얻음, 'star' = 별(8단계~)로 얻는 특별 드론
const DRONES = (() => {
  'use strict';

  const SKINS = [
    { id: 'orange',  name: '주황 드론',   stage: 1, shape: 'classic', c1: '#ffb04d', c2: '#f57c00', edge: '#c45f00' },
    { id: 'blue',    name: '파랑 드론',   stage: 1, shape: 'classic', c1: '#7fd0ff', c2: '#1e88e5', edge: '#1259a8' },
    { id: 'green',   name: '초록 드론',   stage: 2, shape: 'classic', c1: '#a5e57a', c2: '#43a047', edge: '#2e7d32' },
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

  const SHAPES = { classic, quad, heli, bee, rocket, ufo, plane, balloon, fish, butterfly, cat, car, starbody, crystal, unicorn, phoenix };


  return {
    skins: SKINS,
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
