// 드론 코인 대모험 — 단계별 배경 그림 (캔버스로 직접 그린 게임풍 그림)
const BG = (() => {
  'use strict';
  const W = 960, H = 540, B = 492; // B = 땅 높이
  const PERIOD = 1920;             // 원경/명소 레이어 반복 길이
  let DPR = 1;

  // ---------- 공통 도우미 ----------
  function rng(seed) { let s = seed % 2147483647; if (s <= 0) s += 2147483646; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
  function layer(w, fn) {
    const c = document.createElement('canvas');
    c.width = Math.round(w * DPR); c.height = Math.round(H * DPR);
    const g = c.getContext('2d'); g.scale(DPR, DPR); fn(g, w);
    return { c, w };
  }
  function rr(g, x, y, w, h, r) {
    g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
  }
  // 끊김 없이 반복되는 언덕 (정수 파수만 사용)
  function hills(g, w, base, color, waves) {
    g.fillStyle = color; g.beginPath(); g.moveTo(0, H);
    for (let x = 0; x <= w; x += 6) {
      let y = base;
      for (const [k, a, p] of waves) y -= a * Math.sin((x / w) * Math.PI * 2 * k + p);
      g.lineTo(x, y);
    }
    g.lineTo(w, H); g.closePath(); g.fill();
  }
  function windows(g, x, y, w, h, color, cw = 7, ch = 9, gx = 14, gy = 16) {
    g.fillStyle = color;
    for (let yy = y + 10; yy < y + h - 14; yy += gy) for (let xx = x + 7; xx < x + w - cw - 3; xx += gx) g.fillRect(xx, yy, cw, ch);
  }
  function building(g, x, w, h, body, win) {
    g.fillStyle = body; g.fillRect(x, B - h, w, h);
    if (win) windows(g, x, B - h, w, h, win);
  }
  function cityFill(g, seed, x0, x1, minH, maxH, colors, win, skip = []) {
    const r = rng(seed); let x = x0;
    while (x < x1) {
      const w = 40 + r() * 50, h = minH + r() * (maxH - minH), col = colors[Math.floor(r() * colors.length)];
      if (x + w > x1) break;
      if (!skip.some(([a, b]) => x + w > a && x < b)) building(g, x, w, h, col, win);
      x += w + r() * 14;
    }
  }
  function tree(g, x, base, s = 1, col = '#4caf50') {
    g.fillStyle = '#8d6e63'; g.fillRect(x - 3 * s, base - 16 * s, 6 * s, 16 * s);
    g.fillStyle = col;
    g.beginPath(); g.arc(x, base - 26 * s, 14 * s, 0, Math.PI * 2); g.arc(x - 9 * s, base - 18 * s, 10 * s, 0, Math.PI * 2);
    g.arc(x + 9 * s, base - 18 * s, 10 * s, 0, Math.PI * 2); g.fill();
    g.fillStyle = 'rgba(255,255,255,0.18)'; g.beginPath(); g.arc(x - 4 * s, base - 31 * s, 5 * s, 0, Math.PI * 2); g.fill();
  }
  function cloud(g, x, y, s) {
    g.fillStyle = 'rgba(255,255,255,0.92)';
    g.beginPath();
    g.arc(x, y, 22 * s, 0, Math.PI * 2); g.arc(x + 26 * s, y - 10 * s, 26 * s, 0, Math.PI * 2);
    g.arc(x + 54 * s, y, 20 * s, 0, Math.PI * 2); g.arc(x + 26 * s, y + 8 * s, 22 * s, 0, Math.PI * 2);
    g.fill();
  }
  function cloudsLayer(seed) {
    return layer(PERIOD, (g) => {
      const r = rng(seed);
      for (let i = 0; i < 9; i++) cloud(g, 80 + i * 200 + r() * 60, 80 + r() * 150, 0.6 + r() * 0.6);
    });
  }

  // ---------- 1단계: 서울 ----------
  function namsanTower(g, cx) {
    g.fillStyle = '#6db56f';
    g.beginPath(); g.moveTo(cx - 300, B); g.quadraticCurveTo(cx, B - 280, cx + 300, B); g.fill();
    for (let t = 0.08; t < 0.95; t += 0.07) {
      const x = cx - 300 + 600 * t, y = B - 2 * t * (1 - t) * 280;
      tree(g, x, y + 14, 0.8, t % 0.14 < 0.07 ? '#3f9a4a' : '#4fae55');
    }
    const base = B - 140;
    g.fillStyle = '#e0e0e0'; g.fillRect(cx - 26, base - 16, 52, 18);
    g.fillStyle = '#f7f7f7'; g.fillRect(cx - 7, base - 175, 14, 162);
    g.fillStyle = '#d3d3d3'; g.fillRect(cx, base - 175, 7, 162);
    const y = base - 200;
    g.fillStyle = '#f2f2f2'; rr(g, cx - 28, y, 56, 30, 9); g.fill();
    g.fillStyle = '#5b7fa6'; g.fillRect(cx - 26, y + 9, 52, 8);
    g.fillStyle = '#e6e6e6'; g.fillRect(cx - 18, y - 9, 36, 10);
    for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#ffffff' : '#e53935'; g.fillRect(cx - 2.5, y - 19 - i * 10, 5, 10); }
  }
  function lotteTower(g, cx) {
    const top = 52;
    g.fillStyle = '#d6dce4'; g.fillRect(cx - 120, B - 50, 240, 50);
    windows(g, cx - 120, B - 50, 240, 50, '#9fb6cc');
    const shape = () => {
      g.beginPath(); g.moveTo(cx - 44, B);
      g.bezierCurveTo(cx - 42, 300, cx - 26, 150, cx - 9, top + 34);
      g.lineTo(cx, top); g.lineTo(cx + 9, top + 34);
      g.bezierCurveTo(cx + 26, 150, cx + 42, 300, cx + 44, B); g.closePath();
    };
    const grd = g.createLinearGradient(cx - 44, 0, cx + 44, 0);
    grd.addColorStop(0, '#c8d6e5'); grd.addColorStop(0.45, '#f5f9fd'); grd.addColorStop(1, '#93a9c0');
    g.fillStyle = grd; shape(); g.fill();
    g.save(); shape(); g.clip();
    g.strokeStyle = 'rgba(120,145,170,0.35)'; g.lineWidth = 1;
    for (let y = top + 40; y < B; y += 9) { g.beginPath(); g.moveTo(cx - 50, y); g.lineTo(cx + 50, y); g.stroke(); }
    g.strokeStyle = 'rgba(255,255,255,0.9)'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(cx, top + 8); g.lineTo(cx, B); g.stroke();
    g.restore();
    g.strokeStyle = '#7f95ab'; g.lineWidth = 1.5;
    for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(cx - 10 + i * 2, top + 34 + i * 6); g.lineTo(cx + 10 - i * 2, top + 34 + i * 6); g.stroke(); }
  }
  function hanokRoof(g, cx, y, w, h, col) {
    const hw = w / 2;
    g.fillStyle = col; g.beginPath();
    g.moveTo(cx - hw - 12, y - 14);
    g.quadraticCurveTo(cx - hw + 20, y + 3, cx - hw + 60, y);
    g.lineTo(cx + hw - 60, y);
    g.quadraticCurveTo(cx + hw - 20, y + 3, cx + hw + 12, y - 14);
    g.quadraticCurveTo(cx + hw - 30, y - h * 0.45, cx + hw - 52, y - h);
    g.lineTo(cx - hw + 52, y - h);
    g.quadraticCurveTo(cx - hw + 30, y - h * 0.45, cx - hw - 12, y - 14);
    g.fill();
    g.strokeStyle = 'rgba(255,255,255,0.12)'; g.lineWidth = 2;
    for (let x = cx - hw + 60; x < cx + hw - 50; x += 10) { g.beginPath(); g.moveTo(x, y - h + 4); g.lineTo(x, y - 2); g.stroke(); }
    g.fillStyle = '#2a2e37'; g.fillRect(cx - hw + 46, y - h - 6, w - 92, 8);
    g.beginPath(); g.moveTo(cx - hw + 46, y - h - 6); g.lineTo(cx - hw + 38, y - h - 14); g.lineTo(cx - hw + 54, y - h + 2); g.fill();
    g.beginPath(); g.moveTo(cx + hw - 46, y - h - 6); g.lineTo(cx + hw - 38, y - h - 14); g.lineTo(cx + hw - 54, y - h + 2); g.fill();
    g.fillStyle = '#2f8f6f'; g.fillRect(cx - hw + 44, y, w - 88, 5);
  }
  function gyeongbokgung(g, cx) {
    g.fillStyle = '#e3d3b0'; g.fillRect(cx - 320, B - 38, 640, 38);
    g.fillStyle = '#4a4f5a'; g.fillRect(cx - 326, B - 46, 652, 9);
    g.fillStyle = '#cfc8b8'; g.fillRect(cx - 185, B - 30, 370, 30);
    g.fillStyle = '#bdb5a3'; g.fillRect(cx - 155, B - 50, 310, 20);
    g.fillStyle = '#a99f8c'; g.fillRect(cx - 30, B - 50, 60, 50);
    const y1 = B - 50, y0 = B - 118;
    g.fillStyle = '#f3e6c4'; g.fillRect(cx - 130, y0, 260, y1 - y0);
    g.fillStyle = '#c98b4e';
    for (let i = 0; i < 7; i++) g.fillRect(cx - 120 + i * 36.5, y0 + 18, 24, y1 - y0 - 18);
    g.fillStyle = '#b8322a';
    for (let i = 0; i < 8; i++) g.fillRect(cx - 130 + i * 35.7, y0, 10, y1 - y0);
    g.fillStyle = '#2f8f6f'; g.fillRect(cx - 136, y0 - 8, 272, 10);
    hanokRoof(g, cx, y0 - 4, 350, 34, '#414652');
    const y2 = y0 - 38, y3 = y0 - 72;
    g.fillStyle = '#f3e6c4'; g.fillRect(cx - 92, y3, 184, y2 - y3);
    g.fillStyle = '#b8322a';
    for (let i = 0; i < 6; i++) g.fillRect(cx - 92 + i * 34.8, y3, 9, y2 - y3);
    g.fillStyle = '#2f8f6f'; g.fillRect(cx - 98, y3 - 8, 196, 10);
    hanokRoof(g, cx, y3 - 4, 270, 40, '#414652');
    // 궁궐 앞 해치/나무
    tree(g, cx - 260, B - 38, 0.9, '#3f9a4a'); tree(g, cx + 260, B - 38, 0.9, '#3f9a4a');
  }
  const seoul = {
    name: '서울', desc: '남산타워 · 롯데월드타워 · 경복궁',
    sky: ['#5ec0f5', '#d6f2ff'], sun: { x: 820, y: 95, r: 36, c: '#fff4b8' },
    far: (g, w) => {
      hills(g, w, 360, '#a9d6b4', [[2, 40, 0], [3, 22, 1.3], [7, 8, 2]]);
      hills(g, w, 420, '#8cc79a', [[3, 22, 0.6], [5, 12, 2], [11, 5, 1]]);
    },
    mid: (g, w) => {
      cityFill(g, 11, 20, w - 120, 50, 150, ['#c9d8e8', '#dcd0e6', '#d2e4d6', '#eadfca', '#f2d4c9'], 'rgba(255,255,255,0.75)',
        [[150, 750], [1290, 1780]]);
      namsanTower(g, 450);
      lotteTower(g, 1000);
      gyeongbokgung(g, 1530);
    },
    ground: (g, w) => {
      g.fillStyle = '#7cc56f'; g.fillRect(0, B - 4, w, 12);
      g.fillStyle = '#d8d4cc'; g.fillRect(0, B + 6, w, 5);
      g.fillStyle = '#6b6f78'; g.fillRect(0, B + 11, w, H - B - 11);
      g.fillStyle = '#ffd54f';
      for (let x = 10; x < w; x += 60) g.fillRect(x, B + 28, 32, 4);
      for (let x = 40; x < w; x += 160) tree(g, x, B + 4, 0.7, '#3f9a4a');
    },
  };

  // ---------- 2단계: 보스턴 ----------
  function bunkerHill(g, cx) {
    g.fillStyle = '#7fbf6a'; g.beginPath(); g.moveTo(cx - 110, B); g.quadraticCurveTo(cx, B - 60, cx + 110, B); g.fill();
    const base = B - 28;
    g.fillStyle = '#d5d0c4';
    g.beginPath(); g.moveTo(cx - 22, base); g.lineTo(cx - 14, 150); g.lineTo(cx, 120); g.lineTo(cx + 14, 150); g.lineTo(cx + 22, base); g.fill();
    g.fillStyle = '#b3ad9f';
    g.beginPath(); g.moveTo(cx, 120); g.lineTo(cx + 14, 150); g.lineTo(cx + 22, base); g.lineTo(cx + 4, base); g.lineTo(cx + 2, 150); g.fill();
    g.fillStyle = '#c7c1b3'; g.fillRect(cx - 30, base - 6, 60, 8);
  }
  function mitDome(g, cx) {
    g.fillStyle = '#ece6d8'; g.fillRect(cx - 160, B - 110, 320, 110);
    windows(g, cx - 160, B - 110, 85, 110, '#8aa1b8', 9, 12, 16, 22);
    windows(g, cx + 75, B - 110, 85, 110, '#8aa1b8', 9, 12, 16, 22);
    g.fillStyle = '#f7f3ea'; g.fillRect(cx - 80, B - 112, 160, 112);
    g.fillStyle = '#c9c1ae';
    for (let i = 0; i < 9; i++) g.fillRect(cx - 74 + i * 17.5, B - 100, 7, 80);
    g.fillStyle = '#e1dacb'; g.fillRect(cx - 86, B - 22, 172, 22);
    g.fillStyle = '#f7f3ea'; g.beginPath(); g.moveTo(cx - 90, B - 112); g.lineTo(cx, B - 140); g.lineTo(cx + 90, B - 112); g.fill();
    g.fillStyle = '#e8e2d4'; g.fillRect(cx - 58, B - 172, 116, 34);
    g.fillStyle = '#c9c1ae'; for (let i = 0; i < 7; i++) g.fillRect(cx - 52 + i * 17, B - 168, 5, 26);
    const dg = g.createLinearGradient(cx - 60, 0, cx + 60, 0);
    dg.addColorStop(0, '#d2cbbd'); dg.addColorStop(0.4, '#f4f0e8'); dg.addColorStop(1, '#b7ae9d');
    g.fillStyle = dg; g.beginPath(); g.arc(cx, B - 172, 60, Math.PI, 0); g.fill();
    g.fillStyle = '#e8e2d4'; g.fillRect(cx - 7, B - 244, 14, 14);
  }
  function harvard(g, cx) {
    g.fillStyle = '#b4533a'; g.fillRect(cx - 120, B - 90, 240, 90);
    g.fillStyle = '#ffffff';
    for (let x = cx - 108; x < cx + 108; x += 26) for (let y = B - 78; y < B - 14; y += 28) { g.fillRect(x - 2, y - 2, 16, 20); }
    g.fillStyle = '#4a6278';
    for (let x = cx - 108; x < cx + 108; x += 26) for (let y = B - 78; y < B - 14; y += 28) { g.fillRect(x, y, 12, 16); }
    g.fillStyle = '#8e3d2a'; g.beginPath(); g.moveTo(cx - 128, B - 90); g.lineTo(cx, B - 120); g.lineTo(cx + 128, B - 90); g.fill();
    g.fillStyle = '#fafafa'; g.fillRect(cx - 20, B - 175, 40, 70);
    g.fillStyle = '#f0f0f0'; g.fillRect(cx - 15, B - 205, 30, 32);
    g.fillStyle = '#4a6278'; g.fillRect(cx - 6, B - 198, 12, 20);
    g.fillStyle = '#fafafa'; g.beginPath(); g.moveTo(cx - 14, B - 205); g.lineTo(cx, B - 275); g.lineTo(cx + 14, B - 205); g.fill();
    g.fillStyle = '#ffcf40'; g.beginPath(); g.arc(cx, B - 150, 9, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#555'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(cx, B - 150); g.lineTo(cx, B - 156); g.moveTo(cx, B - 150); g.lineTo(cx + 4, B - 150); g.stroke();
    tree(g, cx - 150, B, 1.1, '#3d8b40'); tree(g, cx + 150, B, 1.1, '#3d8b40');
  }
  function hancock(g, cx) {
    const top = 66, w = 48;
    const grd = g.createLinearGradient(cx - w, top, cx + w, B);
    grd.addColorStop(0, '#9fd2f7'); grd.addColorStop(0.35, '#4e8fd0'); grd.addColorStop(0.6, '#a9dbff'); grd.addColorStop(1, '#3a75b5');
    g.fillStyle = grd; g.fillRect(cx - w, top, w * 2, B - top);
    g.fillStyle = '#2f62a0'; g.fillRect(cx + w - 10, top, 10, B - top);
    g.strokeStyle = 'rgba(255,255,255,0.25)'; g.lineWidth = 1;
    for (let y = top + 8; y < B; y += 10) { g.beginPath(); g.moveTo(cx - w, y); g.lineTo(cx + w - 10, y); g.stroke(); }
    g.fillStyle = 'rgba(255,255,255,0.35)';
    g.beginPath(); g.moveTo(cx - w, top + 80); g.lineTo(cx - w + 40, top + 30); g.lineTo(cx - w + 60, top + 30); g.lineTo(cx - w, top + 120); g.fill();
  }
  function prudential(g, cx) {
    g.fillStyle = '#a3afbb'; g.fillRect(cx - 30, 110, 60, B - 110);
    windows(g, cx - 30, 110, 60, B - 110, '#d7e1ea', 6, 7, 10, 12);
    g.fillStyle = '#8b97a3'; g.fillRect(cx - 34, 104, 68, 10);
    g.fillStyle = '#6f7a85'; g.fillRect(cx - 2, 50, 4, 56);
  }
  function mgh(g, cx) {
    g.fillStyle = '#f2ece0'; g.fillRect(cx - 130, B - 150, 260, 150);
    windows(g, cx - 130, B - 150, 260, 150, '#7f9db8', 8, 10, 15, 18);
    g.fillStyle = '#e4dccb'; g.fillRect(cx - 40, B - 190, 80, 42);
    g.fillStyle = '#d8cfba'; g.beginPath(); g.arc(cx, B - 190, 30, Math.PI, 0); g.fill();
    g.fillStyle = '#1e5bb8'; rr(g, cx + 60, B - 182, 40, 40, 8); g.fill();
    g.fillStyle = '#fff'; g.font = 'bold 30px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('H', cx + 80, B - 161);
    g.fillStyle = '#e53935'; g.fillRect(cx - 98, B - 182, 30, 10); g.fillRect(cx - 88, B - 192, 10, 30);
  }
  const boston = {
    name: '보스턴', desc: '존 핸콕 타워 · 벙커힐 기념탑 · MIT · 하버드 · 찰스강',
    sky: ['#79b6ea', '#e3f2ff'], sun: { x: 760, y: 85, r: 34, c: '#fff6c8' },
    far: (g, w) => {
      cityFill(g, 21, 10, w - 100, 80, 220, ['#b9cfe0', '#c4d6e6', '#adc4d8'], null);
    },
    mid: (g, w) => {
      cityFill(g, 22, 20, w - 120, 50, 110, ['#a8513e', '#b8694f', '#9b4a3a', '#c98466'], 'rgba(255,240,210,0.7)',
        [[30, 1000], [1100, 1380], [1460, 1780]]);
      bunkerHill(g, 140);
      mitDome(g, 450);
      harvard(g, 820);
      hancock(g, 1170);
      prudential(g, 1320);
      mgh(g, 1620);
    },
    ground: (g, w) => {
      g.fillStyle = '#86c66e'; g.fillRect(0, B - 4, w, 10);
      g.fillStyle = '#3f8fcf'; g.fillRect(0, B + 6, w, H - B - 6);
      g.strokeStyle = 'rgba(255,255,255,0.45)'; g.lineWidth = 2;
      for (let x = 0; x < w; x += 48) { g.beginPath(); g.moveTo(x, B + 22 + (x % 96 ? 10 : 0)); g.quadraticCurveTo(x + 12, B + 16 + (x % 96 ? 10 : 0), x + 24, B + 22 + (x % 96 ? 10 : 0)); g.stroke(); }
      for (const x of [120, 470, 780]) {
        g.fillStyle = '#ffffff'; g.beginPath(); g.moveTo(x, B + 22); g.lineTo(x, B - 22); g.lineTo(x + 24, B + 18); g.fill();
        g.fillStyle = '#ff7043'; g.beginPath(); g.moveTo(x - 2, B + 20); g.lineTo(x - 2, B - 8); g.lineTo(x - 18, B + 18); g.fill();
        g.fillStyle = '#5d4037'; g.beginPath(); g.moveTo(x - 24, B + 22); g.lineTo(x + 30, B + 22); g.lineTo(x + 22, B + 32); g.lineTo(x - 16, B + 32); g.fill();
      }
    },
  };

  // ---------- 3단계: 대전 ----------
  function hanbitTower(g, cx) {
    g.fillStyle = '#cfd8dc'; g.fillRect(cx - 70, B - 16, 140, 16);
    g.fillStyle = '#fafafa';
    g.beginPath(); g.moveTo(cx - 18, B - 16); g.lineTo(cx - 8, B - 300); g.lineTo(cx + 8, B - 300); g.lineTo(cx + 18, B - 16); g.fill();
    g.fillStyle = '#d9dfe3';
    g.beginPath(); g.moveTo(cx, B - 16); g.lineTo(cx, B - 300); g.lineTo(cx + 8, B - 300); g.lineTo(cx + 18, B - 16); g.fill();
    g.fillStyle = '#4a90c8'; for (let y = B - 280; y < B - 30; y += 40) g.fillRect(cx - 9, y, 18, 4);
    const oy = B - 330;
    g.fillStyle = '#9e9e9e'; g.fillRect(cx - 1.5, oy - 90, 3, 70);
    const og = g.createRadialGradient(cx - 10, oy - 10, 4, cx, oy, 32);
    og.addColorStop(0, '#fffbe0'); og.addColorStop(0.5, '#ffd54f'); og.addColorStop(1, '#f39c12');
    g.fillStyle = og; g.beginPath(); g.arc(cx, oy, 30, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#e53935'; g.lineWidth = 3.5;
    g.beginPath(); g.ellipse(cx, oy, 50, 13, -0.3, 0, Math.PI * 2); g.stroke();
    g.strokeStyle = '#1e88e5'; g.lineWidth = 3;
    g.beginPath(); g.ellipse(cx, oy, 50, 13, 0.4, 0, Math.PI * 2); g.stroke();
  }
  function expoBridge(g, x0, x1) {
    const dy = B - 36, mid = (x0 + x1) / 2;
    const P = [[mid - 20, dy], [mid - 10, dy - 120], [mid + 40, dy - 180], [mid + 20, dy - 250]];
    const bz = (t) => {
      const u = 1 - t;
      return [u * u * u * P[0][0] + 3 * u * u * t * P[1][0] + 3 * u * t * t * P[2][0] + t * t * t * P[3][0],
              u * u * u * P[0][1] + 3 * u * u * t * P[1][1] + 3 * u * t * t * P[2][1] + t * t * t * P[3][1]];
    };
    g.strokeStyle = 'rgba(255,255,255,0.95)'; g.lineWidth = 1.5;
    for (let i = 0; i < 9; i++) {
      const t = 0.35 + i * 0.075, [px, py] = bz(t);
      g.beginPath(); g.moveTo(px, py); g.lineTo(x0 + 30 + i * 22, dy); g.stroke();
      g.beginPath(); g.moveTo(px, py); g.lineTo(x1 - 30 - i * 22, dy); g.stroke();
    }
    g.strokeStyle = '#ffffff'; g.lineWidth = 11; g.lineCap = 'round';
    g.beginPath(); g.moveTo(...P[0]); g.bezierCurveTo(...P[1], ...P[2], ...P[3]); g.stroke();
    g.strokeStyle = '#cfd8dc'; g.lineWidth = 4;
    g.beginPath(); g.moveTo(P[0][0] + 3, P[0][1]); g.bezierCurveTo(P[1][0] + 3, P[1][1], P[2][0] + 3, P[2][1], P[3][0] + 3, P[3][1]); g.stroke();
    g.lineCap = 'butt';
    g.fillStyle = '#eceff1'; g.fillRect(x0, dy, x1 - x0, 10);
    g.fillStyle = '#90a4ae'; g.fillRect(x0, dy + 10, x1 - x0, 3);
    g.fillStyle = '#b0bec5'; for (const px of [x0 + 20, mid - 26, x1 - 30]) g.fillRect(px, dy + 13, 10, B - dy - 13);
  }
  function scienceMuseum(g, cx) {
    g.fillStyle = '#e3e9ed'; g.fillRect(cx - 120, B - 70, 240, 70);
    g.fillStyle = '#7fb3d5'; g.fillRect(cx - 120, B - 52, 240, 16);
    const dg = g.createLinearGradient(cx - 62, 0, cx + 62, 0);
    dg.addColorStop(0, '#b0bec5'); dg.addColorStop(0.4, '#f5f7f8'); dg.addColorStop(1, '#90a4ae');
    g.fillStyle = dg; g.beginPath(); g.arc(cx, B - 70, 62, Math.PI, 0); g.fill();
    g.strokeStyle = 'rgba(120,140,155,0.5)'; g.lineWidth = 1;
    for (let a = 1; a < 6; a++) { g.beginPath(); g.ellipse(cx, B - 70, 62 * Math.cos(a * Math.PI / 12), 62, 0, Math.PI, 0); g.stroke(); }
  }
  function rocket(g, cx) {
    g.fillStyle = '#9e9e9e'; g.fillRect(cx - 34, B - 16, 68, 16);
    g.fillStyle = '#e53935';
    g.beginPath(); g.moveTo(cx - 14, B - 70); g.lineTo(cx - 32, B - 18); g.lineTo(cx - 14, B - 30); g.fill();
    g.beginPath(); g.moveTo(cx + 14, B - 70); g.lineTo(cx + 32, B - 18); g.lineTo(cx + 14, B - 30); g.fill();
    g.fillStyle = '#fafafa'; g.fillRect(cx - 14, B - 210, 28, 190);
    g.fillStyle = '#e0e0e0'; g.fillRect(cx + 4, B - 210, 10, 190);
    g.fillStyle = '#e53935'; g.fillRect(cx - 14, B - 150, 28, 10);
    g.fillStyle = '#1e5bb8'; g.fillRect(cx - 14, B - 120, 28, 6);
    g.fillStyle = '#fafafa'; g.beginPath(); g.moveTo(cx - 14, B - 210); g.quadraticCurveTo(cx - 12, B - 250, cx, B - 268); g.quadraticCurveTo(cx + 12, B - 250, cx + 14, B - 210); g.fill();
    g.fillStyle = '#4fc3f7'; g.beginPath(); g.arc(cx, B - 185, 6, 0, Math.PI * 2); g.fill();
  }
  const daejeon = {
    name: '대전', desc: '엑스포 한빛탑 · 엑스포다리 · 갑천 · 계룡산',
    sky: ['#84d3f6', '#effbff'], sun: { x: 860, y: 100, r: 38, c: '#fff1a8' },
    far: (g, w) => {
      hills(g, w, 330, '#9cc5b4', [[2, 50, 0.3], [5, 30, 1.1], [9, 14, 2.2], [17, 6, 0.4]]);
      hills(g, w, 400, '#77ae92', [[3, 30, 1.8], [7, 16, 0.2], [13, 6, 1]]);
    },
    mid: (g, w) => {
      cityFill(g, 31, 20, w - 120, 100, 200, ['#efe5d2', '#e6dccb', '#f4ede0', '#dfe8ee'], 'rgba(140,160,185,0.6)',
        [[290, 470], [700, 1200], [1260, 1620]]);
      hanbitTower(g, 380);
      expoBridge(g, 720, 1180);
      scienceMuseum(g, 1380);
      rocket(g, 1560);
      for (const x of [250, 520, 660, 1240, 1700, 1820]) tree(g, x, B, 1.1, '#43a047');
    },
    ground: (g, w) => {
      g.fillStyle = '#8bc34a'; g.fillRect(0, B - 4, w, 12);
      g.fillStyle = '#4aa3df'; g.fillRect(0, B + 8, w, H - B - 8);
      g.fillStyle = 'rgba(255,255,255,0.35)';
      for (let x = 20; x < w; x += 70) g.fillRect(x, B + 22 + (x % 140 ? 8 : 0), 26, 3);
      g.strokeStyle = '#6d8f3a'; g.lineWidth = 2;
      for (let x = 5; x < w; x += 23) { g.beginPath(); g.moveTo(x, B + 8); g.lineTo(x - 4, B - 10); g.moveTo(x + 3, B + 8); g.lineTo(x + 6, B - 6); g.stroke(); }
      for (const x of [300, 720]) {
        g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(x, B + 26, 12, 7, 0, 0, Math.PI * 2); g.fill();
        g.beginPath(); g.arc(x - 9, B + 18, 6, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#ff9800'; g.beginPath(); g.moveTo(x - 15, B + 17); g.lineTo(x - 21, B + 19); g.lineTo(x - 15, B + 21); g.fill();
        g.fillStyle = '#222'; g.beginPath(); g.arc(x - 10, B + 16, 1.5, 0, Math.PI * 2); g.fill();
      }
    },
  };

  // ---------- 4단계: 뉴욕 ----------
  function liberty(g, cx) {
    g.fillStyle = '#6fbf73'; g.beginPath(); g.ellipse(cx, B, 110, 18, 0, Math.PI, 0); g.fill();
    g.fillStyle = '#c2ad84'; g.fillRect(cx - 60, B - 22, 120, 22);
    g.fillStyle = '#d4c19a';
    g.beginPath(); g.moveTo(cx - 36, B - 22); g.lineTo(cx - 28, B - 110); g.lineTo(cx + 28, B - 110); g.lineTo(cx + 36, B - 22); g.fill();
    g.fillStyle = '#b9a67f'; g.fillRect(cx - 32, B - 112, 64, 8); g.fillRect(cx - 30, B - 70, 60, 4);
    const green = '#5fb3a1', dark = '#468f80';
    g.fillStyle = green;
    g.beginPath(); g.moveTo(cx - 22, B - 112); g.lineTo(cx - 13, B - 210); g.lineTo(cx + 13, B - 210); g.lineTo(cx + 22, B - 112); g.fill();
    g.strokeStyle = dark; g.lineWidth = 1.5;
    for (const k of [-10, -2, 7]) { g.beginPath(); g.moveTo(cx + k, B - 200); g.lineTo(cx + k * 1.4, B - 114); g.stroke(); }
    g.fillStyle = dark; g.save(); g.translate(cx + 15, B - 180); g.rotate(0.2); g.fillRect(-6, -14, 12, 24); g.restore();
    g.strokeStyle = green; g.lineWidth = 9; g.lineCap = 'round';
    g.beginPath(); g.moveTo(cx - 9, B - 202); g.lineTo(cx - 22, B - 268); g.stroke(); g.lineCap = 'butt';
    g.fillStyle = dark; g.fillRect(cx - 27, B - 288, 10, 18);
    g.fillStyle = '#ffb300'; g.beginPath(); g.moveTo(cx - 30, B - 288); g.quadraticCurveTo(cx - 22, B - 316, cx - 14, B - 288); g.fill();
    g.fillStyle = '#ffe082'; g.beginPath(); g.moveTo(cx - 26, B - 288); g.quadraticCurveTo(cx - 22, B - 304, cx - 18, B - 288); g.fill();
    g.fillStyle = green; g.beginPath(); g.arc(cx, B - 220, 11, 0, Math.PI * 2); g.fill();
    for (let k = -3; k <= 3; k++) {
      const a = -Math.PI / 2 + k * 0.33, bx = cx + Math.cos(a) * 10, by = B - 222 + Math.sin(a) * 10;
      g.beginPath(); g.moveTo(bx - Math.sin(a) * 3, by + Math.cos(a) * 3); g.lineTo(cx + Math.cos(a) * 24, B - 222 + Math.sin(a) * 24);
      g.lineTo(bx + Math.sin(a) * 3, by - Math.cos(a) * 3); g.fill();
    }
  }
  function empireState(g, cx) {
    const levels = [[150, 110], [112, 262], [84, 300], [56, 330], [32, 352], [16, 374]];
    for (const [w, h] of levels) {
      g.fillStyle = '#d6d0c2'; g.fillRect(cx - w / 2, B - h, w, h);
      g.fillStyle = '#b3ac9c'; g.fillRect(cx + w / 2 - w * 0.25, B - h, w * 0.25, h);
      g.fillStyle = '#9d9686';
      for (let x = cx - w / 2 + 5; x < cx + w / 2 - 4; x += 8) g.fillRect(x, B - h + 6, 3, h - 10);
    }
    g.fillStyle = '#c4bdae'; g.beginPath(); g.moveTo(cx - 6, B - 374); g.lineTo(cx, B - 446); g.lineTo(cx + 6, B - 374); g.fill();
  }
  function chrysler(g, cx) {
    g.fillStyle = '#c3c9d1'; g.fillRect(cx - 40, B - 292, 80, 292);
    windows(g, cx - 40, B - 292, 80, 292, '#7d8b9b', 6, 8, 11, 13);
    g.fillStyle = '#aab2bc'; g.fillRect(cx - 48, B - 140, 96, 140);
    windows(g, cx - 48, B - 140, 96, 140, '#7d8b9b', 6, 8, 11, 13);
    for (let i = 0; i < 6; i++) {
      const r = 36 - i * 6, cy = B - 292 - i * 17;
      g.fillStyle = i % 2 ? '#dfe4ea' : '#eef1f5'; g.beginPath(); g.arc(cx, cy, r, Math.PI, 0); g.fill();
      g.fillStyle = '#4a5866';
      for (let k = -2; k <= 2; k++) {
        const a = -Math.PI / 2 + k * 0.45, tx = cx + Math.cos(a) * r * 0.65, ty = cy + Math.sin(a) * r * 0.65;
        g.beginPath(); g.moveTo(tx, ty - 4); g.lineTo(tx - 2.5, ty + 3); g.lineTo(tx + 2.5, ty + 3); g.fill();
      }
    }
    g.fillStyle = '#e8ecf0'; g.beginPath(); g.moveTo(cx - 5, B - 385); g.lineTo(cx, B - 440); g.lineTo(cx + 5, B - 385); g.fill();
  }
  function brooklynBridge(g, x0, x1) {
    const tA = x0 + 140, tB = x1 - 140, top = B - 240, dy = B - 72;
    g.fillStyle = '#7e6f63'; g.fillRect(x0, dy, x1 - x0, 12);
    g.fillStyle = '#5f544b'; g.fillRect(x0, dy + 12, x1 - x0, 3);
    const cable = (ax, ay, bx, by, cy) => {
      const cx = (ax + bx) / 2;
      g.beginPath(); g.moveTo(ax, ay); g.quadraticCurveTo(cx, cy, bx, by); g.stroke();
      g.save(); g.lineWidth = 1; g.strokeStyle = 'rgba(80,70,60,0.6)';
      for (let x = ax + 10; x < bx - 4; x += 11) {
        const t = (x - ax) / (bx - ax), y = (1 - t) * (1 - t) * ay + 2 * t * (1 - t) * cy + t * t * by;
        g.beginPath(); g.moveTo(x, y); g.lineTo(x, dy); g.stroke();
      }
      g.restore();
    };
    g.strokeStyle = '#5a4f46'; g.lineWidth = 2.5;
    cable(x0, dy, tA, top + 6, dy - 30);
    cable(tA, top + 6, tB, top + 6, dy + 20);
    cable(tB, top + 6, x1, dy, dy - 30);
    for (const tx of [tA, tB]) {
      g.fillStyle = '#b9a07f'; g.fillRect(tx - 30, top, 60, B - top);
      g.fillStyle = '#a58c6c'; g.fillRect(tx + 14, top, 16, B - top);
      g.fillStyle = '#c9b391'; g.fillRect(tx - 34, top - 8, 68, 10);
      g.save(); g.globalCompositeOperation = 'destination-out';
      for (const ox of [-15, 15]) {
        g.beginPath(); g.moveTo(tx + ox - 8, dy - 4); g.lineTo(tx + ox - 8, top + 60);
        g.quadraticCurveTo(tx + ox - 8, top + 34, tx + ox, top + 26); g.quadraticCurveTo(tx + ox + 8, top + 34, tx + ox + 8, top + 60);
        g.lineTo(tx + ox + 8, dy - 4); g.fill();
      }
      g.restore();
    }
  }
  const newyork = {
    name: '뉴욕', desc: '자유의 여신상 · 엠파이어 스테이트 빌딩 · 브루클린 다리',
    sky: ['#5a8fd6', '#ffd9b0'], sun: { x: 780, y: 170, r: 52, c: '#ffcc80' },
    far: (g, w) => {
      cityFill(g, 41, 10, w - 100, 120, 300, ['#9fb3c8', '#a9bccf', '#93a8bf'], null);
    },
    mid: (g, w) => {
      cityFill(g, 42, 20, w - 120, 80, 200, ['#7f8fa3', '#8d99a8', '#6f8197', '#9a8f88'], 'rgba(255,230,150,0.7)',
        [[60, 330], [1210, 1840]]);
      liberty(g, 190);
      empireState(g, 620);
      chrysler(g, 940);
      brooklynBridge(g, 1230, 1820);
    },
    ground: (g, w) => {
      g.fillStyle = '#9e9e9e'; g.fillRect(0, B - 2, w, 8);
      g.fillStyle = '#44464f'; g.fillRect(0, B + 6, w, H - B - 6);
      g.fillStyle = '#ffd54f'; g.fillRect(0, B + 24, w, 3);
      g.fillStyle = '#ffffff'; for (let x = 0; x < w; x += 50) g.fillRect(x, B + 36, 26, 3);
      for (const x of [140, 560, 820]) {
        g.fillStyle = '#ffc107'; rr(g, x, B + 6, 64, 18, 5); g.fill();
        g.beginPath(); g.moveTo(x + 14, B + 6); g.lineTo(x + 20, B - 6); g.lineTo(x + 46, B - 6); g.lineTo(x + 52, B + 6); g.fill();
        g.fillStyle = '#b3e5fc'; g.fillRect(x + 22, B - 3, 10, 8); g.fillRect(x + 35, B - 3, 10, 8);
        g.fillStyle = '#222'; g.fillRect(x + 26, B - 10, 14, 4);
        g.beginPath(); g.arc(x + 14, B + 24, 6, 0, Math.PI * 2); g.arc(x + 50, B + 24, 6, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#333'; for (let k = 0; k < 5; k++) g.fillRect(x + 6 + k * 12, B + 12, 6, 3);
      }
    },
  };

  // ---------- 5단계: 놀이터 ----------
  function fence(g, w) {
    g.fillStyle = '#ffffff'; g.fillRect(0, B - 36, w, 5); g.fillRect(0, B - 16, w, 5);
    for (let x = 0; x < w; x += 22) {
      g.fillStyle = '#ffffff';
      g.beginPath(); g.moveTo(x, B); g.lineTo(x, B - 42); g.lineTo(x + 6, B - 48); g.lineTo(x + 12, B - 42); g.lineTo(x + 12, B); g.fill();
      g.fillStyle = 'rgba(0,0,0,0.08)'; g.fillRect(x + 9, B - 42, 3, 42);
    }
  }
  function slide(g, cx) {
    g.strokeStyle = '#ff7043'; g.lineWidth = 6;
    g.beginPath(); g.moveTo(cx - 72, B); g.lineTo(cx - 72, B - 160); g.moveTo(cx - 46, B); g.lineTo(cx - 46, B - 160); g.stroke();
    g.lineWidth = 4; for (let y = B - 18; y > B - 150; y -= 20) { g.beginPath(); g.moveTo(cx - 72, y); g.lineTo(cx - 46, y); g.stroke(); }
    g.strokeStyle = '#42a5f5'; g.lineWidth = 6; g.beginPath(); g.moveTo(cx - 14, B); g.lineTo(cx - 14, B - 150); g.stroke();
    g.fillStyle = '#ffca28'; g.fillRect(cx - 78, B - 156, 70, 10);
    g.fillStyle = '#ef5350'; g.beginPath(); g.moveTo(cx - 86, B - 196); g.lineTo(cx - 43, B - 236); g.lineTo(cx, B - 196); g.fill();
    g.strokeStyle = '#ffca28'; g.lineWidth = 4;
    g.beginPath(); g.moveTo(cx - 76, B - 196); g.lineTo(cx - 76, B - 156); g.moveTo(cx - 10, B - 196); g.lineTo(cx - 10, B - 156); g.stroke();
    g.strokeStyle = '#ab47bc'; g.lineWidth = 22; g.lineCap = 'round';
    g.beginPath(); g.moveTo(cx - 8, B - 150); g.bezierCurveTo(cx + 40, B - 140, cx + 50, B - 20, cx + 110, B - 12); g.stroke();
    g.strokeStyle = '#e1bee7'; g.lineWidth = 6;
    g.beginPath(); g.moveTo(cx - 8, B - 154); g.bezierCurveTo(cx + 40, B - 144, cx + 50, B - 24, cx + 110, B - 16); g.stroke();
    g.lineCap = 'butt';
  }
  function swings(g, cx) {
    g.strokeStyle = '#1e88e5'; g.lineWidth = 8; g.lineCap = 'round';
    for (const s of [-1, 1]) {
      g.beginPath(); g.moveTo(cx + s * 140, B); g.lineTo(cx + s * 118, B - 180); g.lineTo(cx + s * 96, B); g.stroke();
    }
    g.strokeStyle = '#1565c0'; g.lineWidth = 10; g.beginPath(); g.moveTo(cx - 122, B - 180); g.lineTo(cx + 122, B - 180); g.stroke();
    g.lineCap = 'butt';
    g.strokeStyle = '#757575'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(cx - 64, B - 176); g.lineTo(cx - 64, B - 58); g.moveTo(cx - 32, B - 176); g.lineTo(cx - 32, B - 58); g.stroke();
    g.fillStyle = '#ef5350'; rr(g, cx - 70, B - 60, 44, 9, 4); g.fill();
    g.beginPath(); g.moveTo(cx + 32, B - 176); g.lineTo(cx + 62, B - 66); g.moveTo(cx + 64, B - 176); g.lineTo(cx + 94, B - 66); g.stroke();
    g.fillStyle = '#ffca28'; g.save(); g.translate(cx + 78, B - 64); g.rotate(-0.26); rr(g, -24, -4, 48, 9, 4); g.fill(); g.restore();
  }
  function seesaw(g, cx) {
    g.fillStyle = '#7e57c2'; g.beginPath(); g.moveTo(cx - 20, B); g.lineTo(cx, B - 38); g.lineTo(cx + 20, B); g.fill();
    g.save(); g.translate(cx, B - 38); g.rotate(-0.2);
    g.fillStyle = '#66bb6a'; rr(g, -120, -6, 240, 12, 5); g.fill();
    g.fillStyle = '#ff7043'; g.fillRect(-100, -22, 6, 16); g.fillRect(94, -22, 6, 16);
    g.fillRect(-104, -24, 14, 5); g.fillRect(90, -24, 14, 5);
    g.restore();
    g.fillStyle = '#5c3a9e'; g.beginPath(); g.arc(cx, B - 38, 6, 0, Math.PI * 2); g.fill();
  }
  function jungleGym(g, cx) {
    const cols = ['#ef5350', '#ffca28', '#42a5f5', '#66bb6a'];
    g.lineWidth = 6; g.lineCap = 'round';
    for (let i = 0; i <= 4; i++) { g.strokeStyle = cols[i % 4]; g.beginPath(); g.moveTo(cx - 100 + i * 50, B); g.lineTo(cx - 100 + i * 50, B - 130); g.stroke(); }
    for (let j = 1; j <= 3; j++) { g.strokeStyle = cols[(j + 1) % 4]; g.beginPath(); g.moveTo(cx - 100, B - j * 43); g.lineTo(cx + 100, B - j * 43); g.stroke(); }
    g.lineCap = 'butt';
  }
  function sandbox(g, cx) {
    g.fillStyle = '#f6d98b'; g.beginPath(); g.ellipse(cx, B - 14, 110, 24, 0, Math.PI, 0); g.fill();
    g.fillStyle = '#a1887f'; g.fillRect(cx - 120, B - 18, 240, 18);
    g.fillStyle = '#8d6e63'; for (let x = cx - 116; x < cx + 116; x += 30) g.fillRect(x, B - 18, 3, 18);
    g.fillStyle = '#e8c070';
    g.fillRect(cx - 50, B - 70, 60, 46); g.fillRect(cx - 64, B - 92, 24, 68); g.fillRect(cx + 0, B - 92, 24, 68);
    for (const tx of [cx - 64, cx]) for (let k = 0; k < 3; k++) g.fillRect(tx + k * 9, B - 100, 6, 8);
    g.fillStyle = '#c99a4a'; g.beginPath(); g.arc(cx - 20, B - 24, 10, Math.PI, 0); g.fill();
    g.strokeStyle = '#5d4037'; g.lineWidth = 2; g.beginPath(); g.moveTo(cx + 12, B - 100); g.lineTo(cx + 12, B - 128); g.stroke();
    g.fillStyle = '#ef5350'; g.beginPath(); g.moveTo(cx + 12, B - 128); g.lineTo(cx + 30, B - 122); g.lineTo(cx + 12, B - 116); g.fill();
    g.fillStyle = '#29b6f6'; g.beginPath(); g.moveTo(cx + 46, B - 48); g.lineTo(cx + 76, B - 48); g.lineTo(cx + 72, B - 20); g.lineTo(cx + 50, B - 20); g.fill();
    g.strokeStyle = '#0277bd'; g.beginPath(); g.arc(cx + 61, B - 48, 13, Math.PI, 0); g.stroke();
    g.strokeStyle = '#ff7043'; g.lineWidth = 4; g.beginPath(); g.moveTo(cx + 88, B - 60); g.lineTo(cx + 98, B - 24); g.stroke();
    g.fillStyle = '#ff7043'; g.beginPath(); g.ellipse(cx + 99, B - 22, 7, 5, 0.3, 0, Math.PI * 2); g.fill();
  }
  function house(g, x, w, h, wall, roof) {
    g.fillStyle = wall; g.fillRect(x, B - h, w, h);
    g.fillStyle = roof; g.beginPath(); g.moveTo(x - 8, B - h); g.lineTo(x + w / 2, B - h - w * 0.45); g.lineTo(x + w + 8, B - h); g.fill();
    g.fillStyle = '#bde3ff'; g.fillRect(x + w * 0.2, B - h * 0.75, w * 0.22, w * 0.22); g.fillRect(x + w * 0.58, B - h * 0.75, w * 0.22, w * 0.22);
  }
  const playground = {
    name: '놀이터', desc: '미끄럼틀 · 그네 · 시소 · 모래놀이터',
    sky: ['#7fd8ff', '#fff7d6'], sun: { x: 840, y: 92, r: 40, c: '#ffe066', face: true },
    far: (g, w) => {
      hills(g, w, 380, '#b6e388', [[2, 30, 0.5], [4, 14, 2], [9, 5, 1]]);
      const r = rng(51);
      for (let x = 40; x < w - 120; x += 140 + r() * 80) {
        house(g, x, 60 + r() * 30, 50 + r() * 40, ['#ffe0b2', '#ffccbc', '#e1f5fe', '#f3e5f5'][Math.floor(r() * 4)], ['#e57373', '#64b5f6', '#81c784', '#ffb74d'][Math.floor(r() * 4)]);
      }
      hills(g, w, 450, '#9ad66b', [[3, 12, 1], [6, 6, 0]]);
    },
    mid: (g, w) => {
      for (const x of [100, 470, 860, 1150, 1480, 1800]) tree(g, x, B - 20, 1.7, '#43a047');
      fence(g, w);
      slide(g, 270);
      swings(g, 680);
      seesaw(g, 1020);
      jungleGym(g, 1320);
      sandbox(g, 1650);
    },
    ground: (g, w) => {
      g.fillStyle = '#7ccf5a'; g.fillRect(0, B - 4, w, 10);
      g.fillStyle = '#f3d58b'; g.fillRect(0, B + 6, w, H - B - 6);
      const r = rng(77);
      for (let i = 0; i < 70; i++) { g.fillStyle = r() < 0.5 ? '#e4c070' : '#fbe6a8'; g.beginPath(); g.arc(r() * w, B + 12 + r() * 40, 1.5 + r() * 2.5, 0, Math.PI * 2); g.fill(); }
      g.fillStyle = '#5bb33f';
      for (let x = 12; x < w; x += 37) { g.beginPath(); g.moveTo(x, B + 2); g.lineTo(x + 4, B - 10); g.lineTo(x + 8, B + 2); g.fill(); }
    },
  };

  // ---------- 6단계: 파리 ----------
  function haussmann(g, x, w, h, detail = true) {
    g.fillStyle = '#ecdfc6'; g.fillRect(x, B - h, w, h);
    g.fillStyle = '#7d8fa3';
    g.beginPath(); g.moveTo(x - 2, B - h); g.lineTo(x + 6, B - h - 18); g.lineTo(x + w - 6, B - h - 18); g.lineTo(x + w + 2, B - h); g.fill();
    g.fillStyle = '#b56d4e'; g.fillRect(x + 10, B - h - 26, 6, 10); g.fillRect(x + w - 18, B - h - 26, 6, 10);
    if (!detail) return;
    g.fillStyle = '#cfd8e3';
    for (let xx = x + 10; xx < x + w - 14; xx += 18) g.fillRect(xx, B - h - 14, 8, 9);
    for (let yy = B - h + 8; yy < B - 20; yy += 24) {
      for (let xx = x + 8; xx < x + w - 10; xx += 16) { g.fillStyle = '#5f7189'; g.fillRect(xx, yy, 7, 14); }
      g.fillStyle = '#4b4b4b'; g.fillRect(x + 4, yy + 14, w - 8, 2);
    }
    g.fillStyle = '#b54848'; g.fillRect(x, B - 18, w, 6);
  }
  function eiffel(g, cx) {
    const col = '#8b6a4c', lat = 'rgba(255,230,190,0.35)';
    const parts = [
      () => { g.beginPath(); g.moveTo(cx - 120, B); g.lineTo(cx - 74, B - 112); g.lineTo(cx + 74, B - 112); g.lineTo(cx + 120, B); g.lineTo(cx + 86, B); g.quadraticCurveTo(cx, B - 150, cx - 86, B); g.closePath(); },
      () => { g.beginPath(); g.moveTo(cx - 62, B - 112); g.lineTo(cx - 33, B - 228); g.lineTo(cx + 33, B - 228); g.lineTo(cx + 62, B - 112); g.lineTo(cx + 40, B - 112); g.quadraticCurveTo(cx, B - 170, cx - 40, B - 112); g.closePath(); },
      () => { g.beginPath(); g.moveTo(cx - 29, B - 228); g.lineTo(cx - 6, B - 400); g.lineTo(cx + 6, B - 400); g.lineTo(cx + 29, B - 228); g.closePath(); },
    ];
    for (const p of parts) {
      g.fillStyle = col; p(); g.fill();
      g.save(); p(); g.clip(); g.strokeStyle = lat; g.lineWidth = 1.5;
      for (let k = -320; k < 320; k += 11) {
        g.beginPath(); g.moveTo(cx + k, B); g.lineTo(cx + k + 300, B - 450); g.moveTo(cx + k, B); g.lineTo(cx + k - 300, B - 450); g.stroke();
      }
      g.restore();
    }
    g.fillStyle = '#6d5038'; g.fillRect(cx - 84, B - 120, 168, 10); g.fillRect(cx - 42, B - 234, 84, 8); g.fillRect(cx - 10, B - 406, 20, 8);
    g.beginPath(); g.moveTo(cx - 4, B - 406); g.lineTo(cx, B - 450); g.lineTo(cx + 4, B - 406); g.fill();
  }
  function arcTriomphe(g, cx) {
    const w = 150, h = 170;
    g.fillStyle = '#eadfc4'; g.fillRect(cx - w / 2, B - h, w, h);
    g.fillStyle = '#d9ccad'; g.fillRect(cx - w / 2 - 4, B - h, w + 8, 14); g.fillRect(cx - w / 2 - 2, B - h + 30, w + 4, 6);
    g.fillStyle = '#8a7d66'; g.fillRect(cx - 24, B - 72, 48, 72); g.beginPath(); g.arc(cx, B - 72, 24, Math.PI, 0); g.fill();
    g.fillStyle = '#cbbd9c'; g.fillRect(cx - 66, B - 112, 30, 42); g.fillRect(cx + 36, B - 112, 30, 42);
    g.fillStyle = '#e53935'; g.fillRect(cx - 3, B - h - 30, 2, 30);
    g.fillStyle = '#1e40af'; g.fillRect(cx - 1, B - h - 30, 6, 14); g.fillStyle = '#fff'; g.fillRect(cx + 5, B - h - 30, 6, 14); g.fillStyle = '#e53935'; g.fillRect(cx + 11, B - h - 30, 6, 14);
  }
  function louvre(g, cx) {
    haussmann(g, cx - 280, 180, 90); haussmann(g, cx + 100, 180, 90);
    const pw = 200, ph = 120;
    const shape = () => { g.beginPath(); g.moveTo(cx - pw / 2, B); g.lineTo(cx, B - ph); g.lineTo(cx + pw / 2, B); g.closePath(); };
    const gr = g.createLinearGradient(cx - pw / 2, 0, cx + pw / 2, 0);
    gr.addColorStop(0, '#cfe8f7'); gr.addColorStop(0.5, '#9fd0ee'); gr.addColorStop(1, '#6faed6');
    g.fillStyle = gr; shape(); g.fill();
    g.save(); shape(); g.clip(); g.strokeStyle = 'rgba(70,90,110,0.5)'; g.lineWidth = 1;
    for (let k = -240; k < 240; k += 12) {
      g.beginPath(); g.moveTo(cx + k, B); g.lineTo(cx + k + 200, B - 240); g.moveTo(cx + k, B); g.lineTo(cx + k - 200, B - 240); g.stroke();
    }
    g.restore();
    g.strokeStyle = '#4d6275'; g.lineWidth = 2; shape(); g.stroke();
  }
  const paris = {
    name: '파리', desc: '에펠탑 · 개선문 · 루브르 피라미드 · 센강',
    sky: ['#8ec5f0', '#ffe3ec'], sun: { x: 800, y: 90, r: 34, c: '#fff4c4' },
    far: (g, w) => {
      cityFill(g, 61, 10, w - 100, 60, 130, ['#ddd3e6', '#e6dbe9', '#d3cbe0'], null);
    },
    mid: (g, w) => {
      const r = rng(62); let x = 20;
      while (x < w - 200) {
        const bw = 90 + r() * 60;
        if (!(x + bw > 270 && x < 580) && !(x + bw > 800 && x < 1000) && !(x + bw > 1110 && x < 1510)) haussmann(g, x, bw, 70 + r() * 60);
        x += bw + 8 + r() * 20;
      }
      eiffel(g, 420);
      arcTriomphe(g, 900);
      louvre(g, 1310);
      for (const x2 of [250, 600, 1040, 1560]) tree(g, x2, B, 1, '#4caf50');
    },
    ground: (g, w) => {
      g.fillStyle = '#d9c9a5'; g.fillRect(0, B - 4, w, 14);
      g.fillStyle = '#5b9bd5'; g.fillRect(0, B + 10, w, H - B - 10);
      g.strokeStyle = 'rgba(255,255,255,0.4)'; g.lineWidth = 2;
      for (let x = 0; x < w; x += 40) { g.beginPath(); g.moveTo(x, B + 30); g.quadraticCurveTo(x + 10, B + 25, x + 20, B + 30); g.stroke(); }
      for (const x of [150, 620]) {
        g.fillStyle = '#f5f5f5'; g.beginPath(); g.moveTo(x, B + 14); g.lineTo(x + 130, B + 14); g.lineTo(x + 118, B + 30); g.lineTo(x + 8, B + 30); g.fill();
        g.fillStyle = 'rgba(180,220,245,0.9)'; rr(g, x + 20, B + 2, 90, 13, 5); g.fill();
        g.fillStyle = '#1e3a5f'; g.fillRect(x + 10, B + 20, 110, 3);
      }
    },
  };

  // ---------- 7단계: 런던 ----------
  function bigBen(g, cx) {
    const st = '#d4b97f', dk = '#a8925f';
    g.fillStyle = st; g.fillRect(cx - 24, B - 230, 48, 230);
    g.fillStyle = dk; for (let x = cx - 20; x < cx + 22; x += 8) g.fillRect(x, B - 225, 2, 220);
    g.fillStyle = st; g.fillRect(cx - 30, B - 292, 60, 62);
    g.fillStyle = '#fffbe6'; g.beginPath(); g.arc(cx, B - 261, 22, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#5d4b2a'; g.lineWidth = 3; g.stroke();
    g.lineWidth = 2; g.beginPath(); g.moveTo(cx, B - 261); g.lineTo(cx, B - 277); g.moveTo(cx, B - 261); g.lineTo(cx + 11, B - 261); g.stroke();
    g.fillStyle = st; g.fillRect(cx - 26, B - 324, 52, 32);
    g.fillStyle = '#5d4b2a'; for (const ox of [-15, 0, 15]) { g.fillRect(cx + ox - 4, B - 314, 8, 18); g.beginPath(); g.arc(cx + ox, B - 314, 4, Math.PI, 0); g.fill(); }
    g.fillStyle = '#4f5d57'; g.beginPath(); g.moveTo(cx - 28, B - 324); g.lineTo(cx, B - 404); g.lineTo(cx + 28, B - 324); g.fill();
    for (const ox of [-30, 24]) { g.beginPath(); g.moveTo(cx + ox, B - 324); g.lineTo(cx + ox + 3, B - 346); g.lineTo(cx + ox + 6, B - 324); g.fill(); }
    g.fillStyle = '#ffd54f'; g.fillRect(cx - 1.5, B - 420, 3, 18);
  }
  function parliament(g, x0, x1) {
    g.fillStyle = '#cdb27a'; g.fillRect(x0, B - 90, x1 - x0, 90);
    g.fillStyle = '#7d6a45'; for (let x = x0 + 6; x < x1 - 6; x += 12) g.fillRect(x, B - 78, 5, 60);
    g.fillStyle = '#cdb27a';
    for (let x = x0; x < x1; x += 28) { g.beginPath(); g.moveTo(x, B - 90); g.lineTo(x + 4, B - 112); g.lineTo(x + 8, B - 90); g.fill(); }
  }
  function londonEye(g, cx) {
    const cy = B - 160, R = 130;
    g.strokeStyle = '#e0e0e0'; g.lineWidth = 6;
    g.beginPath(); g.moveTo(cx - 80, B); g.lineTo(cx, cy); g.lineTo(cx - 30, B); g.stroke();
    g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineWidth = 1;
    for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); g.stroke(); }
    g.strokeStyle = '#fafafa'; g.lineWidth = 4; g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.stroke();
    g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, R - 9, 0, Math.PI * 2); g.stroke();
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      g.fillStyle = '#b3e5fc'; g.beginPath(); g.ellipse(cx + Math.cos(a) * (R + 6), cy + Math.sin(a) * (R + 6), 6, 4, a, 0, Math.PI * 2); g.fill();
    }
    g.fillStyle = '#9e9e9e'; g.beginPath(); g.arc(cx, cy, 8, 0, Math.PI * 2); g.fill();
  }
  function towerBridge(g, x0, x1) {
    const tA = x0 + 170, tB = x1 - 170, dy = B - 60, top = B - 230, blue = '#4f7cac';
    g.fillStyle = blue; g.fillRect(x0, dy, x1 - x0, 10);
    g.strokeStyle = blue; g.lineWidth = 5;
    g.beginPath(); g.moveTo(x0, dy); g.quadraticCurveTo((x0 + tA) / 2, dy - 10, tA - 32, top + 70); g.stroke();
    g.beginPath(); g.moveTo(x1, dy); g.quadraticCurveTo((x1 + tB) / 2, dy - 10, tB + 32, top + 70); g.stroke();
    g.fillStyle = blue; g.fillRect(tA, top + 40, tB - tA, 14);
    g.strokeStyle = '#88aed6'; g.lineWidth = 1.5;
    for (let x = tA; x < tB; x += 12) { g.beginPath(); g.moveTo(x, top + 40); g.lineTo(x + 12, top + 54); g.stroke(); }
    for (const tx of [tA, tB]) {
      g.fillStyle = '#dccfae'; g.fillRect(tx - 32, top + 30, 64, B - top - 30);
      g.fillStyle = '#8a7d63'; g.fillRect(tx - 16, dy - 52, 32, 52); g.beginPath(); g.arc(tx, dy - 52, 16, Math.PI, 0); g.fill();
      g.fillStyle = '#6b7e92'; for (const yy of [top + 60, top + 100]) { g.fillRect(tx - 6, yy, 12, 20); }
      g.fillStyle = '#5b6f86'; g.beginPath(); g.moveTo(tx - 34, top + 30); g.lineTo(tx, top - 24); g.lineTo(tx + 34, top + 30); g.fill();
      for (const ox of [-36, 26]) {
        g.fillStyle = '#dccfae'; g.fillRect(tx + ox, top + 4, 10, 28);
        g.fillStyle = '#5b6f86'; g.beginPath(); g.moveTo(tx + ox - 1, top + 4); g.lineTo(tx + ox + 5, top - 14); g.lineTo(tx + ox + 11, top + 4); g.fill();
      }
      g.fillStyle = '#ffd54f'; g.fillRect(tx - 1.5, top - 36, 3, 14);
    }
  }
  const london = {
    name: '런던', desc: '빅벤 · 런던아이 · 타워브리지 · 빨간 2층 버스',
    sky: ['#9fb8cf', '#e9eef3'], sun: { x: 820, y: 100, r: 30, c: '#fdf6dc' },
    far: (g, w) => {
      cityFill(g, 71, 10, w - 100, 70, 170, ['#c3c8d0', '#b9bec7', '#cfd2d8'], null);
    },
    mid: (g, w) => {
      cityFill(g, 72, 20, w - 120, 50, 120, ['#a7765a', '#b48a6a', '#9c6f55', '#c9b49a'], 'rgba(255,245,220,0.7)',
        [[180, 640], [740, 1060], [1180, 1880]]);
      parliament(g, 320, 620);
      bigBen(g, 270);
      londonEye(g, 920);
      towerBridge(g, 1200, 1860);
    },
    ground: (g, w) => {
      g.fillStyle = '#9e9e9e'; g.fillRect(0, B - 2, w, 8);
      g.fillStyle = '#55575f'; g.fillRect(0, B + 6, w, H - B - 6);
      g.fillStyle = '#ffffff'; for (let x = 0; x < w; x += 50) g.fillRect(x, B + 30, 26, 3);
      for (const x of [120, 560]) {
        g.fillStyle = '#d32f2f'; rr(g, x, B - 26, 84, 46, 6); g.fill();
        g.fillStyle = '#b3e5fc';
        for (let k = 0; k < 5; k++) { g.fillRect(x + 6 + k * 15, B - 21, 11, 10); g.fillRect(x + 6 + k * 15, B - 4, 11, 9); }
        g.fillStyle = '#fff'; g.fillRect(x, B - 8, 84, 2);
        g.fillStyle = '#222'; g.beginPath(); g.arc(x + 18, B + 20, 7, 0, Math.PI * 2); g.arc(x + 66, B + 20, 7, 0, Math.PI * 2); g.fill();
      }
      g.fillStyle = '#d32f2f'; g.fillRect(820, B - 34, 18, 40); g.fillStyle = '#b3e5fc';
      for (let k = 0; k < 3; k++) g.fillRect(823, B - 26 + k * 9, 12, 6);
    },
  };

  // ---------- 8단계: 시카고 ----------
  function willis(g, cx) {
    g.fillStyle = '#2b2f36';
    g.fillRect(cx - 60, B - 280, 120, 280); g.fillRect(cx - 60, B - 335, 84, 60); g.fillRect(cx - 20, B - 395, 60, 65);
    g.strokeStyle = 'rgba(120,135,150,0.35)'; g.lineWidth = 1;
    for (let y = B - 390; y < B; y += 6) { g.beginPath(); g.moveTo(cx - 60, y); g.lineTo(cx + 60, y); g.stroke(); }
    g.fillStyle = '#5a6270'; g.fillRect(cx - 60, B - 200, 120, 4); g.fillRect(cx - 60, B - 120, 120, 4);
    g.fillStyle = '#f5f5f5'; g.fillRect(cx - 8, B - 460, 4, 66); g.fillRect(cx + 24, B - 448, 4, 54);
  }
  function hancockChicago(g, cx) {
    const top = B - 360, hw = (y) => 58 - 22 * (B - y) / 360;
    g.fillStyle = '#262a30';
    g.beginPath(); g.moveTo(cx - 58, B); g.lineTo(cx - 36, top); g.lineTo(cx + 36, top); g.lineTo(cx + 58, B); g.fill();
    g.strokeStyle = '#7c8794'; g.lineWidth = 2;
    for (let k = 0; k < 5; k++) {
      const y0 = B - k * 72, y1 = y0 - 72;
      g.beginPath(); g.moveTo(cx - hw(y0), y0); g.lineTo(cx + hw(y1), y1); g.moveTo(cx + hw(y0), y0); g.lineTo(cx - hw(y1), y1);
      g.moveTo(cx - hw(y1), y1); g.lineTo(cx + hw(y1), y1); g.stroke();
    }
    g.fillStyle = '#eeeeee'; g.fillRect(cx - 16, top - 70, 4, 70); g.fillRect(cx + 12, top - 70, 4, 70);
  }
  function marinaCity(g, cx) {
    for (const tx of [cx - 40, cx + 40]) {
      g.fillStyle = '#d8d3c8'; g.fillRect(tx - 18, B - 250, 36, 250);
      g.fillStyle = '#b8b2a5'; g.fillRect(tx - 24, B - 80, 48, 80);
      g.fillStyle = '#9a9488'; for (let y = B - 74; y < B; y += 10) g.fillRect(tx - 24, y, 48, 3);
      for (let y = B - 86; y > B - 252; y -= 9) {
        g.fillStyle = '#f4f1ea'; g.beginPath(); g.ellipse(tx, y, 26, 5, 0, 0, Math.PI); g.fill();
      }
    }
  }
  function cloudGate(g, cx) {
    g.fillStyle = '#c9c9c9'; g.fillRect(cx - 130, B - 6, 260, 6);
    const shape = () => { g.beginPath(); g.moveTo(cx - 90, B - 6); g.bezierCurveTo(cx - 112, B - 84, cx + 112, B - 84, cx + 90, B - 6); g.quadraticCurveTo(cx, B - 44, cx - 90, B - 6); g.closePath(); };
    const gr = g.createLinearGradient(0, B - 70, 0, B);
    gr.addColorStop(0, '#f7f9fb'); gr.addColorStop(0.45, '#9aa5b1'); gr.addColorStop(0.7, '#e2e8ee'); gr.addColorStop(1, '#7d8996');
    g.fillStyle = gr; shape(); g.fill();
    g.save(); shape(); g.clip();
    g.fillStyle = 'rgba(40,50,60,0.35)'; for (let x = cx - 70; x < cx + 70; x += 14) g.fillRect(x, B - 52, 6, 10 + (x % 28 ? 8 : 0));
    g.fillStyle = 'rgba(255,255,255,0.7)'; g.beginPath(); g.ellipse(cx - 30, B - 58, 30, 6, -0.1, 0, Math.PI * 2); g.fill();
    g.restore();
  }
  function waterTower(g, cx) {
    g.fillStyle = '#e6d8b5'; g.fillRect(cx - 34, B - 70, 68, 70); g.fillRect(cx - 12, B - 170, 24, 100);
    g.fillStyle = '#cdbd95';
    for (let x = cx - 34; x < cx + 34; x += 12) g.fillRect(x, B - 78, 7, 8);
    for (const ox of [-34, 26]) { g.fillRect(cx + ox, B - 96, 8, 26); }
    g.fillStyle = '#7b7b7b'; g.beginPath(); g.moveTo(cx - 12, B - 170); g.lineTo(cx, B - 210); g.lineTo(cx + 12, B - 170); g.fill();
    g.fillStyle = '#8a7a58'; g.fillRect(cx - 5, B - 150, 10, 16); g.fillRect(cx - 9, B - 40, 18, 40);
  }
  const chicago = {
    name: '시카고', desc: '윌리스 타워 · 존 핸콕 센터 · 클라우드 게이트 · 미시간 호수',
    sky: ['#6fb0e8', '#dff1ff'], sun: { x: 850, y: 90, r: 36, c: '#fff4b8' },
    far: (g, w) => {
      cityFill(g, 81, 10, w - 100, 120, 300, ['#a9bdd2', '#b6c8da', '#9db3ca'], null);
    },
    mid: (g, w) => {
      cityFill(g, 82, 20, w - 120, 90, 230, ['#6f7f93', '#8796a8', '#7c8a9c', '#a59a8c'], 'rgba(255,240,190,0.65)',
        [[300, 460], [640, 800], [930, 1070], [1150, 1450], [1500, 1600]]);
      willis(g, 380);
      hancockChicago(g, 720);
      marinaCity(g, 1000);
      cloudGate(g, 1300);
      waterTower(g, 1550);
      for (const x of [1180, 1420, 1650]) tree(g, x, B, 1, '#43a047');
    },
    ground: (g, w) => {
      g.fillStyle = '#b0bec5'; g.fillRect(0, B - 2, w, 10);
      g.fillStyle = '#3aa0c8'; g.fillRect(0, B + 8, w, H - B - 8);
      g.strokeStyle = 'rgba(255,255,255,0.45)'; g.lineWidth = 2;
      for (let x = 0; x < w; x += 36) { g.beginPath(); g.moveTo(x, B + 26 + (x % 72 ? 8 : 0)); g.quadraticCurveTo(x + 9, B + 20 + (x % 72 ? 8 : 0), x + 18, B + 26 + (x % 72 ? 8 : 0)); g.stroke(); }
      const x = 500;
      g.fillStyle = '#ffffff'; g.beginPath(); g.moveTo(x, B + 12); g.lineTo(x + 110, B + 12); g.lineTo(x + 98, B + 30); g.lineTo(x + 8, B + 30); g.fill();
      g.fillStyle = '#1565c0'; g.fillRect(x + 14, B, 76, 12); g.fillStyle = '#b3e5fc';
      for (let k = 0; k < 6; k++) g.fillRect(x + 18 + k * 12, B + 3, 8, 6);
    },
  };

  // ---------- 9단계: LA ----------
  function palm(g, x, base, h) {
    g.strokeStyle = '#8d6e4a'; g.lineWidth = 7; g.lineCap = 'round';
    g.beginPath(); g.moveTo(x, base); g.quadraticCurveTo(x + 14, base - h * 0.6, x + 8, base - h); g.stroke();
    g.strokeStyle = '#6d5436'; g.lineWidth = 1.5;
    for (let k = 0.1; k < 0.95; k += 0.08) { const yy = base - h * k, xx = x + 14 * 2 * k * (1 - k) + 8 * k * k; g.beginPath(); g.moveTo(xx - 4, yy); g.lineTo(xx + 4, yy - 2); g.stroke(); }
    g.strokeStyle = '#2e8b3e'; g.lineWidth = 5;
    const tx = x + 8, ty = base - h;
    for (let i = 0; i < 7; i++) {
      const a = -Math.PI + (i / 6) * Math.PI, ex = tx + Math.cos(a) * 34, ey = ty + Math.sin(a) * 12 + 14;
      g.beginPath(); g.moveTo(tx, ty); g.quadraticCurveTo(tx + Math.cos(a) * 20, ty - 14, ex, ey); g.stroke();
    }
    g.lineCap = 'butt';
  }
  function griffith(g, cx) {
    g.fillStyle = '#b8977a'; g.beginPath(); g.moveTo(cx - 200, B); g.quadraticCurveTo(cx, B - 200, cx + 200, B); g.fill();
    const base = B - 96;
    g.fillStyle = '#fafafa'; g.fillRect(cx - 80, base - 34, 160, 34);
    g.fillStyle = '#e0e0e0'; for (let x = cx - 70; x < cx + 70; x += 14) g.fillRect(x, base - 28, 5, 26);
    g.fillStyle = '#4f6460'; g.beginPath(); g.arc(cx, base - 34, 30, Math.PI, 0); g.fill();
    g.beginPath(); g.arc(cx - 66, base - 34, 13, Math.PI, 0); g.arc(cx + 66, base - 34, 13, Math.PI, 0); g.fill();
    g.fillStyle = '#fafafa'; g.fillRect(cx - 34, base - 40, 68, 6);
  }
  function downtownLA(g, x0) {
    building(g, x0, 60, 220, '#8fb3d3', 'rgba(255,255,255,0.5)');
    building(g, x0 + 70, 70, 260, '#a9c4dc', 'rgba(255,255,255,0.5)');
    // US 뱅크 타워 느낌 (둥근 꼭대기)
    g.fillStyle = '#c2c9d1'; g.fillRect(x0 + 150, B - 320, 56, 320);
    g.fillStyle = '#d9dee3'; g.fillRect(x0 + 156, B - 340, 44, 20); g.fillRect(x0 + 164, B - 352, 28, 12);
    windows(g, x0 + 150, B - 320, 56, 320, '#8797a8', 6, 7, 10, 11);
    // 돛 모양 꼭대기 빌딩
    g.fillStyle = '#5f8fbf'; g.fillRect(x0 + 216, B - 300, 66, 300);
    g.beginPath(); g.moveTo(x0 + 216, B - 300); g.quadraticCurveTo(x0 + 270, B - 320, x0 + 282, B - 360); g.lineTo(x0 + 282, B - 300); g.fill();
    g.fillStyle = '#eceff1'; g.fillRect(x0 + 280, B - 400, 3, 42);
    windows(g, x0 + 216, B - 300, 66, 300, 'rgba(255,255,255,0.45)', 6, 7, 10, 11);
    building(g, x0 + 292, 60, 180, '#7ea3c4', 'rgba(255,255,255,0.5)');
  }
  function pier(g, x0, x1) {
    g.fillStyle = '#7a5a3a'; g.fillRect(x0, B - 40, x1 - x0, 8);
    for (let x = x0 + 6; x < x1; x += 26) g.fillRect(x, B - 32, 5, 32);
    const cx = x0 + 120, cy = B - 140, R = 82, cols = ['#ff5252', '#ffca28', '#66bb6a', '#42a5f5', '#ab47bc', '#ff7043'];
    g.strokeStyle = '#eceff1'; g.lineWidth = 5; g.beginPath(); g.moveTo(cx - 40, B - 40); g.lineTo(cx, cy); g.lineTo(cx + 40, B - 40); g.stroke();
    g.lineWidth = 1.5; g.strokeStyle = 'rgba(255,255,255,0.8)';
    for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); g.stroke(); }
    g.lineWidth = 5;
    for (let i = 0; i < 6; i++) { g.strokeStyle = cols[i]; g.beginPath(); g.arc(cx, cy, R, (i / 6) * Math.PI * 2, ((i + 1) / 6) * Math.PI * 2); g.stroke(); }
    for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; g.fillStyle = cols[i % 6]; g.beginPath(); g.arc(cx + Math.cos(a) * R, cy + Math.sin(a) * R + 6, 5, 0, Math.PI * 2); g.fill(); }
    const rx0 = x0 + 230, rx1 = x1 - 10;
    g.strokeStyle = '#9e9e9e'; g.lineWidth = 2;
    const ty = (x) => B - 90 - Math.sin((x - rx0) / 30) * 30 - (x - rx0) * 0.05;
    for (let x = rx0; x <= rx1; x += 16) { g.beginPath(); g.moveTo(x, B - 40); g.lineTo(x, ty(x)); g.stroke(); }
    g.strokeStyle = '#e53935'; g.lineWidth = 5; g.beginPath();
    for (let x = rx0; x <= rx1; x += 4) { if (x === rx0) g.moveTo(x, ty(x)); else g.lineTo(x, ty(x)); }
    g.stroke();
  }
  const la = {
    name: 'LA', desc: '할리우드 사인 · 그리피스 천문대 · 야자수 · 산타모니카 해변',
    sky: ['#ff9e7a', '#ffe3a3'], sun: { x: 760, y: 180, r: 56, c: '#ffb74d' },
    far: (g, w) => {
      hills(g, w, 380, '#d9b48f', [[2, 40, 0.2], [5, 18, 1.4], [11, 6, 0.3]]);
      g.fillStyle = '#c99f78'; g.beginPath(); g.moveTo(300, B); g.quadraticCurveTo(640, 150, 980, B); g.fill();
      g.fillStyle = '#ffffff'; g.font = 'bold 30px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
      'HOLLYWOOD'.split('').forEach((ch, i) => g.fillText(ch, 530 + i * 28, 336 + (i % 2) * 3));
      hills(g, w, 450, '#b98f6a', [[3, 14, 1], [7, 6, 2]]);
    },
    mid: (g, w) => {
      griffith(g, 300);
      downtownLA(g, 620);
      pier(g, 1300, 1820);
      for (const x of [80, 540, 1000, 1090, 1180, 1250, 1860]) palm(g, x, B, 130 + (x % 3) * 20);
    },
    ground: (g, w) => {
      g.fillStyle = '#f2d49b'; g.fillRect(0, B - 4, w, 22);
      g.fillStyle = '#2fa4d8'; g.fillRect(0, B + 18, w, H - B - 18);
      g.fillStyle = '#ffffff';
      g.beginPath(); g.moveTo(0, B + 18);
      for (let x = 0; x <= w; x += 20) g.quadraticCurveTo(x + 10, B + 24, x + 20, B + 18);
      g.lineTo(w, B + 22); g.lineTo(0, B + 22); g.fill();
      for (const [x, c] of [[160, '#ff5252'], [520, '#42a5f5'], [800, '#ffca28']]) {
        g.strokeStyle = '#795548'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, B + 12); g.lineTo(x, B - 24); g.stroke();
        g.fillStyle = c; g.beginPath(); g.moveTo(x - 24, B - 16); g.quadraticCurveTo(x, B - 40, x + 24, B - 16); g.fill();
      }
      g.fillStyle = '#ff7043'; g.save(); g.translate(330, B + 4); g.rotate(-0.3); rr(g, -6, -22, 12, 40, 6); g.fill(); g.restore();
    },
  };

  // ---------- 10단계: 우주 ----------
  function planetEarth(g, x, y, r) {
    g.fillStyle = 'rgba(120,180,255,0.25)'; g.beginPath(); g.arc(x, y, r + 8, 0, Math.PI * 2); g.fill();
    g.save(); g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.clip();
    g.fillStyle = '#2f7fd8'; g.fillRect(x - r, y - r, r * 2, r * 2);
    g.fillStyle = '#4caf50';
    g.beginPath(); g.ellipse(x - 14, y - 10, 20, 14, 0.4, 0, Math.PI * 2); g.ellipse(x + 20, y + 16, 16, 22, -0.3, 0, Math.PI * 2); g.ellipse(x - 30, y + 28, 10, 8, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = 'rgba(255,255,255,0.7)'; g.beginPath(); g.ellipse(x + 4, y - 30, 24, 5, 0.1, 0, Math.PI * 2); g.ellipse(x - 10, y + 6, 18, 4, -0.2, 0, Math.PI * 2); g.fill();
    g.fillStyle = 'rgba(0,0,30,0.35)'; g.beginPath(); g.arc(x + r * 0.5, y + r * 0.3, r, 0, Math.PI * 2); g.fill();
    g.restore();
  }
  function saturn(g, x, y, r) {
    g.strokeStyle = '#e8d3a2'; g.lineWidth = 6;
    g.beginPath(); g.ellipse(x, y, r * 2, r * 0.45, -0.25, Math.PI, Math.PI * 2); g.stroke();
    const gr = g.createLinearGradient(x, y - r, x, y + r); gr.addColorStop(0, '#f3d9a4'); gr.addColorStop(1, '#c79a5b');
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
    g.fillStyle = 'rgba(160,110,60,0.35)'; g.fillRect(x - r, y - 6, r * 2, 5); g.fillRect(x - r, y + 10, r * 2, 4);
    g.strokeStyle = '#e8d3a2'; g.lineWidth = 6;
    g.beginPath(); g.ellipse(x, y, r * 2, r * 0.45, -0.25, 0, Math.PI); g.stroke();
  }
  function spaceStation(g, cx, cy) {
    g.fillStyle = '#9e9e9e'; g.fillRect(cx - 170, cy - 3, 340, 6);
    for (const sx of [-150, -100, 100, 150]) {
      for (const sy of [-44, 8]) {
        g.fillStyle = '#1e3a8a'; g.fillRect(cx + sx - 20, cy + sy, 40, 36);
        g.strokeStyle = '#60a5fa'; g.lineWidth = 1;
        for (let k = 1; k < 4; k++) { g.beginPath(); g.moveTo(cx + sx - 20 + k * 10, cy + sy); g.lineTo(cx + sx - 20 + k * 10, cy + sy + 36); g.stroke(); }
        g.beginPath(); g.moveTo(cx + sx - 20, cy + sy + 18); g.lineTo(cx + sx + 20, cy + sy + 18); g.stroke();
      }
    }
    g.fillStyle = '#eceff1'; rr(g, cx - 60, cy - 14, 120, 28, 12); g.fill();
    g.fillStyle = '#cfd8dc'; rr(g, cx - 14, cy - 40, 28, 80, 12); g.fill();
    g.fillStyle = '#90caf9'; for (const ox of [-40, -20, 20, 40]) { g.beginPath(); g.arc(cx + ox, cy, 4, 0, Math.PI * 2); g.fill(); }
  }
  function astronaut(g, x, y) {
    g.save(); g.translate(x, y); g.rotate(-0.3);
    g.fillStyle = '#cfd8dc'; rr(g, -18, -6, 12, 30, 4); g.fill();
    g.fillStyle = '#fafafa'; rr(g, -10, -4, 24, 30, 8); g.fill();
    g.fillRect(-16, 22, 10, 18); g.fillRect(4, 22, 10, 18);
    g.fillRect(12, 0, 16, 8); g.fillRect(-20, 4, 12, 8);
    g.beginPath(); g.arc(2, -16, 15, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#263238'; g.beginPath(); g.ellipse(5, -16, 10, 8, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = 'rgba(255,255,255,0.6)'; g.beginPath(); g.ellipse(1, -19, 3, 2, -0.5, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#e53935'; g.fillRect(-4, 4, 8, 5);
    g.restore();
  }
  function spaceRocket(g, x, y) {
    g.save(); g.translate(x, y); g.rotate(0.5);
    g.fillStyle = '#ff9800'; g.beginPath(); g.moveTo(-8, 40); g.lineTo(0, 70); g.lineTo(8, 40); g.fill();
    g.fillStyle = '#ffeb3b'; g.beginPath(); g.moveTo(-4, 40); g.lineTo(0, 58); g.lineTo(4, 40); g.fill();
    g.fillStyle = '#e53935'; g.beginPath(); g.moveTo(-12, 20); g.lineTo(-22, 42); g.lineTo(-12, 38); g.fill(); g.beginPath(); g.moveTo(12, 20); g.lineTo(22, 42); g.lineTo(12, 38); g.fill();
    g.fillStyle = '#fafafa'; g.beginPath(); g.moveTo(-12, 40); g.lineTo(-12, -10); g.quadraticCurveTo(0, -46, 12, -10); g.lineTo(12, 40); g.fill();
    g.fillStyle = '#4fc3f7'; g.beginPath(); g.arc(0, 0, 6, 0, Math.PI * 2); g.fill();
    g.restore();
  }
  const space = {
    name: '우주', desc: '지구 · 토성 · 우주정거장 · 달 표면',
    sky: ['#070b24', '#2a1b5e'], sun: null, noClouds: true, stars: true,
    far: (g, w) => {
      const r = rng(91);
      for (let i = 0; i < 220; i++) {
        g.fillStyle = `rgba(255,255,255,${0.3 + r() * 0.6})`;
        g.beginPath(); g.arc(r() * w, r() * 470, 0.6 + r() * 1.4, 0, Math.PI * 2); g.fill();
      }
      const neb = g.createRadialGradient(1000, 200, 10, 1000, 200, 180);
      neb.addColorStop(0, 'rgba(190,120,255,0.35)'); neb.addColorStop(1, 'rgba(190,120,255,0)');
      g.fillStyle = neb; g.fillRect(800, 0, 400, 400);
      planetEarth(g, 360, 150, 56);
      saturn(g, 1450, 190, 40);
      g.fillStyle = '#cfcfd6'; g.beginPath(); g.arc(1780, 90, 18, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#b0b0ba'; g.beginPath(); g.arc(1774, 85, 4, 0, Math.PI * 2); g.arc(1786, 96, 3, 0, Math.PI * 2); g.fill();
    },
    mid: (g, w) => {
      spaceStation(g, 620, 230);
      const sx = 1150, sy = 170;
      g.fillStyle = '#ffca28'; g.fillRect(sx - 14, sy - 12, 28, 24);
      g.fillStyle = '#1e3a8a'; g.fillRect(sx - 64, sy - 8, 44, 16); g.fillRect(sx + 20, sy - 8, 44, 16);
      g.strokeStyle = '#bdbdbd'; g.lineWidth = 2; g.beginPath(); g.moveTo(sx, sy - 12); g.lineTo(sx, sy - 30); g.stroke();
      g.fillStyle = '#e0e0e0'; g.beginPath(); g.arc(sx, sy - 32, 6, Math.PI, 0); g.fill();
      spaceRocket(g, 1500, 330);
      astronaut(g, 1760, 250);
      astronaut(g, 160, 300);
    },
    ground: (g, w) => {
      g.fillStyle = '#a4a4b0';
      g.beginPath(); g.moveTo(0, H);
      for (let x = 0; x <= w; x += 20) g.lineTo(x, B - 4 + Math.sin((x / w) * Math.PI * 2 * 6) * 4);
      g.lineTo(w, H); g.fill();
      const r = rng(97);
      for (let i = 0; i < 14; i++) {
        const x = 30 + r() * (w - 60), y = B + 12 + r() * 30, rw = 10 + r() * 22;
        g.fillStyle = '#8c8c99'; g.beginPath(); g.ellipse(x, y, rw, rw * 0.3, 0, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#b8b8c4'; g.beginPath(); g.ellipse(x, y + 2, rw * 0.8, rw * 0.18, 0, 0, Math.PI); g.fill();
      }
      g.strokeStyle = '#eee'; g.lineWidth = 2; g.beginPath(); g.moveTo(700, B + 6); g.lineTo(700, B - 40); g.stroke();
      g.fillStyle = '#ff5252'; g.fillRect(701, B - 40, 22, 14);
    },
  };

  // ---------- 11단계: 샌프란시스코 ----------
  function goldenGate(g, x0, x1) {
    const red = '#c0392b', dark = '#962d22', tA = x0 + 170, tB = x1 - 170, top = B - 300, dy = B - 85;
    g.strokeStyle = red; g.lineWidth = 4;
    const cable = (ax, ay, cx, cy, bx, by) => {
      g.beginPath(); g.moveTo(ax, ay); g.quadraticCurveTo(cx, cy, bx, by); g.stroke();
      g.save(); g.strokeStyle = 'rgba(150,40,30,0.7)'; g.lineWidth = 1;
      for (let x = Math.min(ax, bx) + 8; x < Math.max(ax, bx) - 4; x += 12) {
        const t = (x - ax) / (bx - ax);
        const y = (1 - t) * (1 - t) * ay + 2 * t * (1 - t) * cy + t * t * by;
        g.beginPath(); g.moveTo(x, y); g.lineTo(x, dy); g.stroke();
      }
      g.restore();
    };
    cable(x0, dy, (x0 + tA) / 2, dy - 10, tA, top + 12);
    cable(tA, top + 12, (tA + tB) / 2, dy + 70, tB, top + 12);
    cable(tB, top + 12, (tB + x1) / 2, dy - 10, x1, dy);
    g.fillStyle = red; g.fillRect(x0, dy, x1 - x0, 9);
    g.fillStyle = dark; g.fillRect(x0, dy + 9, x1 - x0, 6);
    g.strokeStyle = dark; g.lineWidth = 1.5;
    for (let x = x0; x < x1; x += 14) { g.beginPath(); g.moveTo(x, dy + 9); g.lineTo(x + 7, dy + 15); g.lineTo(x + 14, dy + 9); g.stroke(); }
    for (const tx of [tA, tB]) {
      g.fillStyle = red; g.fillRect(tx - 24, top, 14, B - top); g.fillRect(tx + 10, top, 14, B - top);
      g.fillStyle = dark; g.fillRect(tx + 18, top, 6, B - top);
      g.fillStyle = red; for (const y of [top, top + 60, top + 125, dy - 34]) g.fillRect(tx - 24, y, 48, 12);
      g.fillStyle = '#9e9e9e'; g.fillRect(tx - 30, B - 12, 60, 12);
    }
  }
  function transamerica(g, cx) {
    g.fillStyle = '#eef1f4'; g.beginPath(); g.moveTo(cx - 34, B); g.lineTo(cx - 4, B - 330); g.lineTo(cx + 4, B - 330); g.lineTo(cx + 34, B); g.fill();
    g.fillStyle = '#d5dbe1'; g.beginPath(); g.moveTo(cx, B - 330); g.lineTo(cx + 4, B - 330); g.lineTo(cx + 34, B); g.lineTo(cx, B); g.fill();
    g.fillStyle = '#e3e8ec';
    g.beginPath(); g.moveTo(cx - 22, B - 160); g.lineTo(cx - 30, B - 160); g.lineTo(cx - 12, B - 240); g.lineTo(cx - 10, B - 220); g.fill();
    g.beginPath(); g.moveTo(cx + 22, B - 160); g.lineTo(cx + 30, B - 160); g.lineTo(cx + 12, B - 240); g.lineTo(cx + 10, B - 220); g.fill();
    g.fillStyle = '#9fb0c0';
    for (let y = B - 310; y < B - 10; y += 9) { const hw = 34 * (B - y) / 330 - 4; for (let x = cx - hw; x < cx + hw; x += 6) g.fillRect(x, y, 2, 4); }
    g.fillStyle = '#cfd8dc'; g.fillRect(cx - 1, B - 368, 2, 40);
  }
  function paintedLady(g, x, w, h, col) {
    g.fillStyle = col; g.fillRect(x, B - h, w, h);
    g.fillStyle = '#fafafa'; g.fillRect(x - 2, B - h, w + 4, 5);
    g.fillStyle = col; g.beginPath(); g.moveTo(x - 4, B - h); g.lineTo(x + w / 2, B - h - 34); g.lineTo(x + w + 4, B - h); g.fill();
    g.strokeStyle = '#fafafa'; g.lineWidth = 3; g.stroke();
    g.fillStyle = '#ffffff'; g.fillRect(x + 6, B - h + 14, 22, h - 50);
    g.fillStyle = '#5c7a99'; g.fillRect(x + 9, B - h + 18, 7, 18); g.fillRect(x + 18, B - h + 18, 7, 18); g.fillRect(x + 9, B - h + 44, 7, 18); g.fillRect(x + 18, B - h + 44, 7, 18);
    g.fillRect(x + w - 20, B - h + 18, 10, 16); g.fillRect(x + w / 2 - 4, B - h - 20, 8, 12);
    g.fillStyle = '#6d4c41'; g.fillRect(x + w - 22, B - 30, 14, 30);
    g.fillStyle = '#fafafa'; g.fillRect(x + w - 26, B - 34, 22, 4);
  }
  function cableCar(g, x) {
    g.fillStyle = '#c62828'; rr(g, x, B - 30, 90, 26, 5); g.fill();
    g.fillStyle = '#fff3e0'; g.fillRect(x + 4, B - 26, 82, 10);
    g.fillStyle = '#5d4037'; for (let k = 0; k < 6; k++) g.fillRect(x + 8 + k * 13, B - 25, 8, 8);
    g.fillStyle = '#8d6e63'; g.fillRect(x - 4, B - 34, 98, 5);
    g.fillStyle = '#222'; g.beginPath(); g.arc(x + 18, B - 2, 5, 0, Math.PI * 2); g.arc(x + 72, B - 2, 5, 0, Math.PI * 2); g.fill();
  }
  const sanfrancisco = {
    name: '샌프란시스코', desc: '금문교 · 트랜스아메리카 피라미드 · 페인티드 레이디 · 케이블카',
    sky: ['#7fb9e6', '#e7f2fb'], sun: { x: 820, y: 95, r: 34, c: '#fff4c4' },
    far: (g, w) => {
      hills(g, w, 360, '#a7c4a0', [[2, 36, 0.4], [5, 16, 1.6], [9, 6, 0.3]]);
      g.fillStyle = 'rgba(255,255,255,0.55)';
      for (let x = 0; x < w; x += 160) { g.beginPath(); g.ellipse(x + 60, 390, 140, 22, 0, 0, Math.PI * 2); g.fill(); }
      hills(g, w, 430, '#93b48a', [[3, 14, 1], [7, 6, 2]]);
    },
    mid: (g, w) => {
      cityFill(g, 111, 1050, 1340, 60, 160, ['#d7d2c8', '#c9c4bb', '#e1ddd4'], 'rgba(120,140,160,0.6)');
      goldenGate(g, 120, 980);
      transamerica(g, 1200);
      ['#f8bbd0', '#b3e5fc', '#fff59d', '#c5e1a5', '#d1c4e9'].forEach((c, i) => paintedLady(g, 1370 + i * 72, 64, 120 + (i % 2) * 10, c));
      g.fillStyle = '#86b36e'; g.beginPath(); g.moveTo(1740, B); g.quadraticCurveTo(1830, B - 90, 1910, B); g.fill();
      g.fillStyle = '#f5f5f5'; g.fillRect(1818, B - 150, 22, 104); g.fillStyle = '#e0e0e0'; g.fillRect(1814, B - 156, 30, 8);
      g.fillStyle = '#90a4ae'; for (let k = 0; k < 4; k++) g.fillRect(1820 + k * 5, B - 148, 2, 10);
      cableCar(g, 1600);
    },
    ground: (g, w) => {
      g.fillStyle = '#9e9e9e'; g.fillRect(0, B - 2, w, 8);
      g.fillStyle = '#2f80c2'; g.fillRect(0, B + 6, w, H - B - 6);
      g.strokeStyle = 'rgba(255,255,255,0.45)'; g.lineWidth = 2;
      for (let x = 0; x < w; x += 40) { g.beginPath(); g.moveTo(x, B + 24 + (x % 80 ? 8 : 0)); g.quadraticCurveTo(x + 10, B + 18 + (x % 80 ? 8 : 0), x + 20, B + 24 + (x % 80 ? 8 : 0)); g.stroke(); }
      for (const x of [200, 640]) {
        g.fillStyle = '#ffffff'; g.beginPath(); g.moveTo(x, B + 14); g.lineTo(x + 70, B + 14); g.lineTo(x + 62, B + 26); g.lineTo(x + 6, B + 26); g.fill();
        g.fillStyle = '#ffca28'; g.fillRect(x + 14, B + 4, 40, 10);
      }
    },
  };

  // ---------- 12단계: 워싱턴 DC ----------
  function cherryTree(g, x, base, s = 1) {
    g.fillStyle = '#6d4c41'; g.fillRect(x - 3 * s, base - 20 * s, 6 * s, 20 * s);
    g.fillStyle = '#f8bbd0';
    g.beginPath(); g.arc(x, base - 30 * s, 16 * s, 0, Math.PI * 2); g.arc(x - 12 * s, base - 22 * s, 11 * s, 0, Math.PI * 2); g.arc(x + 12 * s, base - 22 * s, 11 * s, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#f48fb1'; for (const [dx, dy] of [[-6, -34], [8, -28], [-12, -20], [4, -20]]) { g.beginPath(); g.arc(x + dx * s, base + dy * s, 2.5 * s, 0, Math.PI * 2); g.fill(); }
  }
  function washingtonMonument(g, cx) {
    g.fillStyle = '#f3f1ea'; g.beginPath(); g.moveTo(cx - 18, B); g.lineTo(cx - 12, B - 380); g.lineTo(cx, B - 410); g.lineTo(cx + 12, B - 380); g.lineTo(cx + 18, B); g.fill();
    g.fillStyle = '#d9d5c8'; g.beginPath(); g.moveTo(cx, B - 410); g.lineTo(cx + 12, B - 380); g.lineTo(cx + 18, B); g.lineTo(cx + 2, B); g.fill();
    g.fillStyle = '#e8e2d2'; g.fillRect(cx - 14, B - 150, 30, 3);
    for (let k = -3; k <= 3; k++) {
      const x = cx + k * 16; g.strokeStyle = '#bbb'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x, B); g.lineTo(x, B - 30); g.stroke();
      g.fillStyle = k % 2 ? '#e53935' : '#1e40af'; g.fillRect(x + 1, B - 30, 8, 5);
    }
  }
  function capitol(g, cx) {
    g.fillStyle = '#f7f5ef'; g.fillRect(cx - 230, B - 80, 460, 80);
    g.fillStyle = '#d9d4c7'; for (let x = cx - 222; x < cx + 222; x += 14) if (Math.abs(x - cx) > 92) g.fillRect(x, B - 70, 4, 56);
    g.fillStyle = '#ffffff'; g.fillRect(cx - 92, B - 112, 184, 112);
    g.fillStyle = '#d9d4c7'; for (let x = cx - 80; x < cx + 80; x += 16) g.fillRect(x, B - 100, 6, 74);
    g.fillStyle = '#ffffff'; g.beginPath(); g.moveTo(cx - 96, B - 112); g.lineTo(cx, B - 140); g.lineTo(cx + 96, B - 112); g.fill();
    g.fillStyle = '#f3f0e8'; g.fillRect(cx - 62, B - 190, 124, 52);
    g.fillStyle = '#d0cabc'; for (let x = cx - 56; x < cx + 56; x += 12) g.fillRect(x, B - 186, 5, 44);
    const dg = g.createLinearGradient(cx - 62, 0, cx + 62, 0); dg.addColorStop(0, '#e0dbcf'); dg.addColorStop(0.4, '#ffffff'); dg.addColorStop(1, '#c9c2b2');
    g.fillStyle = dg; g.beginPath(); g.ellipse(cx, B - 190, 62, 70, 0, Math.PI, 0); g.fill();
    g.strokeStyle = 'rgba(150,140,120,0.5)'; g.lineWidth = 1.2;
    for (const k of [0.3, 0.6, 0.85]) { g.beginPath(); g.ellipse(cx, B - 190, 62 * k, 70, 0, Math.PI, 0); g.stroke(); }
    g.fillStyle = '#f7f5ef'; g.fillRect(cx - 12, B - 278, 24, 20);
    g.beginPath(); g.arc(cx, B - 278, 12, Math.PI, 0); g.fill();
    g.fillStyle = '#8d8d8d'; g.fillRect(cx - 2, B - 304, 4, 16); g.beginPath(); g.arc(cx, B - 306, 4, 0, Math.PI * 2); g.fill();
  }
  function whiteHouse(g, cx) {
    g.fillStyle = '#fafafa'; g.fillRect(cx - 140, B - 84, 280, 84);
    g.fillStyle = '#9fb3c8';
    for (let x = cx - 128; x < cx + 128; x += 22) { if (Math.abs(x - cx + 4) < 46) continue; g.fillRect(x, B - 72, 10, 16); g.fillRect(x, B - 38, 10, 16); }
    g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(cx, B - 4, 50, 14, 0, Math.PI, 0); g.fill();
    g.fillStyle = '#e0e0e0'; for (let x = cx - 40; x <= cx + 36; x += 13) g.fillRect(x, B - 88, 6, 84);
    g.fillStyle = '#f0f0f0'; g.fillRect(cx - 52, B - 96, 104, 10); g.fillRect(cx - 144, B - 92, 288, 8);
    g.strokeStyle = '#bbb'; g.lineWidth = 2; g.beginPath(); g.moveTo(cx, B - 96); g.lineTo(cx, B - 130); g.stroke();
    for (let k = 0; k < 5; k++) { g.fillStyle = k % 2 ? '#fff' : '#e53935'; g.fillRect(cx + 1, B - 130 + k * 3, 22, 3); }
    g.fillStyle = '#1e40af'; g.fillRect(cx + 1, B - 130, 9, 9);
  }
  function lincolnMemorial(g, cx) {
    g.fillStyle = '#d9d4c7'; g.fillRect(cx - 120, B - 18, 240, 18); g.fillRect(cx - 108, B - 28, 216, 10);
    g.fillStyle = '#f5f2ea'; g.fillRect(cx - 100, B - 120, 200, 92);
    g.fillStyle = '#7c7466'; g.fillRect(cx - 90, B - 108, 180, 80);
    g.fillStyle = '#f5f2ea'; for (let i = 0; i < 12; i++) g.fillRect(cx - 96 + i * 16.6, B - 110, 9, 82);
    g.fillStyle = '#ece7dc'; g.fillRect(cx - 104, B - 140, 208, 22); g.fillRect(cx - 90, B - 158, 180, 18);
    g.fillStyle = '#c9c2b2'; g.fillRect(cx - 14, B - 64, 28, 30);
  }
  const washington = {
    name: '워싱턴 DC', desc: '국회의사당 · 워싱턴 기념탑 · 백악관 · 링컨 기념관 · 벚꽃',
    sky: ['#79b8ee', '#eaf5ff'], sun: { x: 820, y: 90, r: 34, c: '#fff5c8' },
    far: (g, w) => {
      hills(g, w, 420, '#a8d19e', [[2, 18, 0.4], [6, 8, 1.4]]);
      const r = rng(121); for (let x = 20; x < w; x += 40 + r() * 30) tree(g, x, 440, 0.9 + r() * 0.4, '#7cb86f');
    },
    mid: (g, w) => {
      washingtonMonument(g, 260);
      capitol(g, 720);
      whiteHouse(g, 1220);
      lincolnMemorial(g, 1640);
      for (const x of [90, 420, 480, 990, 1050, 1420, 1830, 1880]) cherryTree(g, x, B, 1.2);
    },
    ground: (g, w) => {
      g.fillStyle = '#8bc34a'; g.fillRect(0, B - 4, w, 12);
      g.fillStyle = '#cfd8dc'; g.fillRect(0, B + 8, w, 6);
      g.fillStyle = '#6fb3e0'; g.fillRect(0, B + 14, w, 22);
      g.fillStyle = 'rgba(255,255,255,0.35)'; for (let x = 10; x < w; x += 60) g.fillRect(x, B + 22, 26, 2);
      g.fillStyle = '#cfd8dc'; g.fillRect(0, B + 36, w, H - B - 36);
      g.fillStyle = '#f8bbd0'; for (let x = 7; x < w; x += 31) { g.beginPath(); g.arc(x, B + 4, 2, 0, Math.PI * 2); g.fill(); }
    },
  };

  // ---------- 13단계: 세종시 ----------
  function govComplex(g, x0, x1) {
    const r = rng(131); let x = x0, h = 60;
    while (x < x1) {
      const w = 70 + r() * 30; h = Math.max(45, Math.min(100, h + (r() - 0.5) * 30));
      g.fillStyle = '#e8eaed'; g.fillRect(x, B - h, w + 2, h);
      g.fillStyle = '#8fb0cc'; for (let yy = B - h + 14; yy < B - 8; yy += 12) g.fillRect(x + 4, yy, w - 6, 5);
      g.fillStyle = '#7cb342'; g.fillRect(x - 1, B - h - 7, w + 4, 8);
      for (let tx = x + 10; tx < x + w; tx += 22) { g.fillStyle = '#558b2f'; g.beginPath(); g.arc(tx, B - h - 10, 6, 0, Math.PI * 2); g.fill(); }
      x += w;
    }
  }
  function sejongLibrary(g, cx) {
    g.fillStyle = '#f5f5f5';
    g.beginPath(); g.moveTo(cx - 130, B); g.lineTo(cx - 130, B - 60); g.quadraticCurveTo(cx + 10, B - 60, cx + 130, B - 160); g.lineTo(cx + 130, B); g.closePath(); g.fill();
    g.strokeStyle = '#bdbdbd'; g.lineWidth = 3; g.beginPath(); g.moveTo(cx - 130, B - 60); g.quadraticCurveTo(cx + 10, B - 60, cx + 130, B - 160); g.stroke();
    g.fillStyle = '#90caf9'; g.fillRect(cx - 124, B - 46, 248, 30);
    g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 1; for (let x = cx - 120; x < cx + 124; x += 12) { g.beginPath(); g.moveTo(x, B - 46); g.lineTo(x, B - 16); g.stroke(); }
  }
  function ieungBridge(g, cx) {
    g.strokeStyle = '#b0bec5'; g.lineWidth = 4;
    for (let k = -4; k <= 4; k++) { const x = cx + k * 38; g.beginPath(); g.moveTo(x, B - 30); g.lineTo(x, B); g.stroke(); }
    g.strokeStyle = '#eceff1'; g.lineWidth = 12; g.beginPath(); g.ellipse(cx, B - 40, 180, 30, 0, 0, Math.PI * 2); g.stroke();
    g.strokeStyle = '#90a4ae'; g.lineWidth = 2; g.beginPath(); g.ellipse(cx, B - 46, 180, 30, 0, 0, Math.PI * 2); g.stroke();
    g.strokeStyle = '#4fc3f7'; g.lineWidth = 3; g.beginPath(); g.ellipse(cx, B - 34, 182, 31, 0, 0.1, Math.PI - 0.1); g.stroke();
  }
  function apartment(g, x, w, h, col, num) {
    g.fillStyle = col; g.fillRect(x, B - h, w, h);
    g.fillStyle = 'rgba(255,255,255,0.85)'; for (let yy = B - h + 10; yy < B - 6; yy += 10) g.fillRect(x + 4, yy, w - 8, 4);
    g.fillStyle = '#5d6d7e'; g.font = 'bold 13px sans-serif'; g.textAlign = 'center'; g.fillText(num, x + w / 2, B - h + 4 + 13);
  }
  const sejong = {
    name: '세종', desc: '정부세종청사 · 국립세종도서관 · 이응다리 · 세종호수공원',
    sky: ['#86cff5', '#effaff'], sun: { x: 830, y: 95, r: 36, c: '#fff1a8' },
    far: (g, w) => {
      hills(g, w, 370, '#94c3a0', [[2, 34, 0.9], [4, 18, 0.2], [9, 6, 1.4]]);
      hills(g, w, 430, '#7fb48b', [[3, 14, 1.7], [8, 5, 0.6]]);
    },
    mid: (g, w) => {
      govComplex(g, 40, 760);
      sejongLibrary(g, 940);
      ieungBridge(g, 1320);
      ['#f3e5d8', '#e3ecf3', '#efe7f5', '#e8f3e3'].forEach((c, i) => apartment(g, 1560 + i * 82, 62, 200 + (i % 2) * 40, c, `${101 + i}동`));
      for (const x of [800, 1100, 1530]) tree(g, x, B, 1.1, '#43a047');
    },
    ground: (g, w) => {
      g.fillStyle = '#8bc34a'; g.fillRect(0, B - 4, w, 14);
      g.fillStyle = '#4fb0e5'; g.fillRect(0, B + 10, w, H - B - 10);
      g.fillStyle = 'rgba(255,255,255,0.4)'; for (let x = 15; x < w; x += 55) g.fillRect(x, B + 24 + (x % 110 ? 8 : 0), 24, 3);
      for (const x of [260, 700]) {
        g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(x, B + 22, 16, 8, 0, 0, Math.PI * 2); g.fill();
        g.beginPath(); g.arc(x + 12, B + 12, 7, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#ff7043'; g.beginPath(); g.moveTo(x + 18, B + 11); g.lineTo(x + 25, B + 13); g.lineTo(x + 18, B + 15); g.fill();
      }
    },
  };

  // ---------- 14단계: 마드리드 ----------
  function royalPalace(g, cx) {
    g.fillStyle = '#efe7d6'; g.fillRect(cx - 230, B - 130, 460, 130);
    g.fillStyle = '#ddd1b8'; g.fillRect(cx - 230, B - 44, 460, 44);
    g.fillStyle = '#8fa3b5';
    for (let x = cx - 218; x < cx + 218; x += 26) { g.fillRect(x, B - 112, 12, 26); g.beginPath(); g.arc(x + 6, B - 112, 6, Math.PI, 0); g.fill(); g.fillRect(x, B - 74, 12, 22); }
    g.fillStyle = '#e3d8c2'; for (let x = cx - 224; x < cx + 224; x += 26) g.fillRect(x - 4, B - 124, 4, 80);
    g.fillStyle = '#f5efe1'; g.fillRect(cx - 236, B - 140, 472, 12);
    for (let x = cx - 230; x < cx + 230; x += 30) { g.fillStyle = '#d8ccb3'; g.fillRect(x, B - 154, 6, 14); g.beginPath(); g.arc(x + 3, B - 156, 4, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = '#f5efe1'; g.fillRect(cx - 70, B - 160, 140, 30);
    g.beginPath(); g.moveTo(cx - 76, B - 160); g.lineTo(cx, B - 184); g.lineTo(cx + 76, B - 160); g.fill();
    g.fillStyle = '#c9a227'; g.beginPath(); g.arc(cx, B - 170, 6, 0, Math.PI * 2); g.fill();
  }
  function puertaAlcala(g, cx) {
    g.fillStyle = '#ddd0b2'; g.fillRect(cx - 130, B - 140, 260, 140);
    g.fillStyle = '#cfc09f'; g.fillRect(cx - 134, B - 150, 268, 12);
    g.fillStyle = '#5f5546';
    for (const ox of [-55, 0, 55]) { g.fillRect(cx + ox - 16, B - 90, 32, 90); g.beginPath(); g.arc(cx + ox, B - 90, 16, Math.PI, 0); g.fill(); }
    for (const ox of [-106, 106]) g.fillRect(cx + ox - 10, B - 70, 20, 70);
    g.fillStyle = '#e6dac0'; for (const ox of [-80, -28, 28, 80]) g.fillRect(cx + ox - 4, B - 138, 8, 138);
    g.fillStyle = '#ddd0b2'; g.fillRect(cx - 50, B - 182, 100, 32);
    g.beginPath(); g.moveTo(cx - 54, B - 182); g.lineTo(cx, B - 204); g.lineTo(cx + 54, B - 182); g.fill();
    g.fillStyle = '#b9a984'; g.beginPath(); g.arc(cx, B - 166, 12, 0, Math.PI * 2); g.fill();
  }
  function cibeles(g, cx) {
    g.fillStyle = '#90caf9'; g.beginPath(); g.ellipse(cx, B - 6, 70, 12, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#cfd8dc'; g.lineWidth = 4; g.stroke();
    g.fillStyle = '#e0e0e0'; g.fillRect(cx - 30, B - 46, 60, 34);
    g.fillStyle = '#bdbdbd'; g.beginPath(); g.arc(cx - 20, B - 14, 9, 0, Math.PI * 2); g.arc(cx + 20, B - 14, 9, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#c8c8c8'; g.beginPath(); g.ellipse(cx - 44, B - 34, 16, 10, 0, 0, Math.PI * 2); g.ellipse(cx - 62, B - 40, 7, 7, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#e8e8e8'; g.beginPath(); g.moveTo(cx - 12, B - 46); g.lineTo(cx - 6, B - 86); g.lineTo(cx + 6, B - 86); g.lineTo(cx + 12, B - 46); g.fill();
    g.beginPath(); g.arc(cx, B - 92, 7, 0, Math.PI * 2); g.fill();
    g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 2;
    for (const k of [-1, 1]) { g.beginPath(); g.moveTo(cx + k * 34, B - 20); g.quadraticCurveTo(cx + k * 50, B - 44, cx + k * 60, B - 8); g.stroke(); }
  }
  function cuatroTorres(g, x0) {
    g.fillStyle = '#3d5a73'; g.fillRect(x0, B - 320, 18, 320); g.fillRect(x0 + 52, B - 320, 18, 320);
    g.fillStyle = '#8fb3d1'; g.fillRect(x0 + 18, B - 280, 34, 280); g.fillStyle = '#3d5a73'; g.fillRect(x0, B - 330, 70, 14);
    g.fillStyle = '#5f8fae'; rr(g, x0 + 100, B - 300, 70, 300, 18); g.fill();
    windows(g, x0 + 100, B - 300, 70, 300, 'rgba(255,255,255,0.4)', 6, 6, 10, 10);
    g.fillStyle = '#9ec6e3'; g.beginPath(); g.moveTo(x0 + 200, B); g.lineTo(x0 + 200, B - 300); g.lineTo(x0 + 270, B - 330); g.lineTo(x0 + 270, B); g.fill();
    g.fillStyle = '#66bb6a'; g.beginPath(); g.moveTo(x0 + 200, B - 300); g.lineTo(x0 + 270, B - 330); g.lineTo(x0 + 270, B - 322); g.lineTo(x0 + 200, B - 294); g.fill();
    g.fillStyle = '#c7d3dd'; g.beginPath(); g.moveTo(x0 + 300, B); g.lineTo(x0 + 300, B - 260); g.quadraticCurveTo(x0 + 335, B - 300, x0 + 370, B - 260); g.lineTo(x0 + 370, B); g.fill();
    windows(g, x0 + 300, B - 260, 70, 260, '#8ea3b5', 6, 6, 10, 10);
  }
  function bearTree(g, cx) {
    g.fillStyle = '#9e9e9e'; g.fillRect(cx - 34, B - 26, 68, 26);
    g.fillStyle = '#6d4c41'; g.fillRect(cx + 10, B - 90, 8, 64);
    g.fillStyle = '#388e3c'; g.beginPath(); g.arc(cx + 14, B - 104, 26, 0, Math.PI * 2); g.arc(cx + 30, B - 92, 16, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#e53935'; for (const [x, y] of [[0, -110], [24, -100], [14, -88], [34, -110], [6, -96]]) { g.beginPath(); g.arc(cx + x, B + y, 3.5, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = '#5d4037'; g.beginPath(); g.ellipse(cx - 8, B - 52, 15, 26, 0.2, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.arc(cx - 2, B - 82, 11, 0, Math.PI * 2); g.fill(); g.beginPath(); g.arc(cx - 8, B - 92, 4, 0, Math.PI * 2); g.arc(cx + 4, B - 92, 4, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#5d4037'; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx - 2, B - 66); g.lineTo(cx + 10, B - 80); g.stroke(); g.lineCap = 'butt';
  }
  const madrid = {
    name: '마드리드', desc: '왕궁 · 알칼라 문 · 시벨레스 분수 · 쿠아트로 토레스',
    sky: ['#5fb0f0', '#fff0d0'], sun: { x: 800, y: 100, r: 40, c: '#ffe082' },
    far: (g, w) => {
      cityFill(g, 141, 10, w - 100, 50, 120, ['#e8d9c0', '#f0e2cc', '#dfcfb5'], null);
    },
    mid: (g, w) => {
      cityFill(g, 142, 20, w - 120, 50, 110, ['#e9c9a5', '#f3d8b6', '#d9b48f', '#f1e0c8'], 'rgba(120,90,70,0.45)',
        [[100, 600], [640, 1100], [1220, 1600], [1720, 1860]]);
      royalPalace(g, 350);
      puertaAlcala(g, 800);
      cibeles(g, 1050);
      cuatroTorres(g, 1230);
      bearTree(g, 1780);
    },
    ground: (g, w) => {
      g.fillStyle = '#e6d3b3'; g.fillRect(0, B - 4, w, H - B + 4);
      g.strokeStyle = 'rgba(160,130,90,0.4)'; g.lineWidth = 1;
      for (let x = 0; x < w; x += 24) { g.beginPath(); g.moveTo(x, B); g.lineTo(x - 10, H); g.stroke(); }
      for (let y = B + 10; y < H; y += 12) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
      for (const x of [120, 470, 820]) {
        g.fillStyle = '#795548'; g.fillRect(x, B - 4, 90, 10);
        g.fillStyle = '#e53935'; for (let k = 0; k < 9; k++) { g.beginPath(); g.arc(x + 6 + k * 10, B - 6, 4, 0, Math.PI * 2); g.fill(); }
        g.fillStyle = '#43a047'; for (let k = 0; k < 9; k++) g.fillRect(x + 5 + k * 10, B - 2, 3, 4);
      }
    },
  };

  // ---------- 15단계: 공룡시대 ----------
  function volcano(g, cx, base, w, h, col) {
    g.fillStyle = col; g.beginPath(); g.moveTo(cx - w, base); g.lineTo(cx - 24, base - h); g.lineTo(cx + 24, base - h); g.lineTo(cx + w, base); g.fill();
    g.fillStyle = '#ff7043'; g.beginPath(); g.ellipse(cx, base - h, 24, 6, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#ff5722';
    g.beginPath(); g.moveTo(cx - 10, base - h); g.quadraticCurveTo(cx - 20, base - h + 60, cx - 38, base - h + 110); g.lineTo(cx - 30, base - h + 110); g.quadraticCurveTo(cx - 12, base - h + 60, cx - 2, base - h); g.fill();
    g.fillStyle = 'rgba(120,110,110,0.55)';
    for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(cx + k * 14 - 6, base - h - 20 - k * 22, 14 + k * 5, 0, Math.PI * 2); g.fill(); }
  }
  function brachio(g, cx) {
    const c = '#7a9a62';
    g.fillStyle = c;
    g.beginPath(); g.ellipse(cx, B - 70, 70, 38, 0, 0, Math.PI * 2); g.fill();
    for (const ox of [-46, -22, 22, 46]) g.fillRect(cx + ox - 9, B - 50, 18, 50);
    g.beginPath(); g.moveTo(cx - 64, B - 80); g.quadraticCurveTo(cx - 130, B - 70, cx - 160, B - 30); g.lineTo(cx - 150, B - 26); g.quadraticCurveTo(cx - 120, B - 56, cx - 60, B - 60); g.fill();
    g.beginPath(); g.moveTo(cx + 40, B - 96); g.quadraticCurveTo(cx + 70, B - 200, cx + 100, B - 250); g.lineTo(cx + 120, B - 244); g.quadraticCurveTo(cx + 88, B - 190, cx + 66, B - 80); g.fill();
    g.beginPath(); g.ellipse(cx + 122, B - 252, 22, 12, 0.2, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#222'; g.beginPath(); g.arc(cx + 128, B - 256, 2.5, 0, Math.PI * 2); g.fill();
    g.fillStyle = 'rgba(255,255,255,0.15)'; g.beginPath(); g.ellipse(cx - 10, B - 92, 40, 10, 0, 0, Math.PI * 2); g.fill();
  }
  function stego(g, cx) {
    g.fillStyle = '#ff8a65';
    for (let k = 0; k < 6; k++) { const x = cx - 50 + k * 20; g.beginPath(); g.moveTo(x - 9, B - 50); g.lineTo(x, B - 80 + Math.abs(k - 2.5) * 6); g.lineTo(x + 9, B - 50); g.fill(); }
    g.fillStyle = '#8d9f5a'; g.beginPath(); g.ellipse(cx, B - 36, 62, 26, 0, 0, Math.PI * 2); g.fill();
    for (const ox of [-36, -14, 16, 38]) g.fillRect(cx + ox - 7, B - 22, 14, 22);
    g.beginPath(); g.moveTo(cx - 58, B - 40); g.quadraticCurveTo(cx - 100, B - 40, cx - 116, B - 20); g.lineTo(cx - 56, B - 26); g.fill();
    g.beginPath(); g.ellipse(cx + 66, B - 28, 14, 9, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#222'; g.beginPath(); g.arc(cx + 72, B - 30, 2, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#fff3e0'; for (const x of [-112, -104]) { g.beginPath(); g.moveTo(cx + x, B - 22); g.lineTo(cx + x - 4, B - 34); g.lineTo(cx + x + 4, B - 24); g.fill(); }
  }
  function fern(g, x, base, s) {
    g.strokeStyle = '#2e7d32'; g.lineWidth = 3;
    for (let k = -3; k <= 3; k++) {
      const a = -Math.PI / 2 + k * 0.32;
      g.beginPath(); g.moveTo(x, base); g.quadraticCurveTo(x + Math.cos(a) * 30 * s, base + Math.sin(a) * 40 * s, x + Math.cos(a) * 55 * s, base + Math.sin(a) * 45 * s + 18 * s); g.stroke();
    }
  }
  function cycad(g, x, base, h) {
    g.fillStyle = '#795548'; g.fillRect(x - 6, base - h, 12, h);
    g.fillStyle = '#5d4037'; for (let y = base - h; y < base; y += 8) g.fillRect(x - 6, y, 12, 2);
    g.strokeStyle = '#388e3c'; g.lineWidth = 5;
    for (let k = 0; k < 8; k++) { const a = -Math.PI + (k / 7) * Math.PI; g.beginPath(); g.moveTo(x, base - h); g.quadraticCurveTo(x + Math.cos(a) * 26, base - h - 22, x + Math.cos(a) * 44, base - h + Math.sin(a) * 10 + 16); g.stroke(); }
  }
  const dinosaur = {
    name: '공룡시대', desc: '화산 · 브라키오사우루스 · 스테고사우루스 · 익룡 조심!',
    sky: ['#ff9966', '#ffe0b2'], sun: { x: 780, y: 110, r: 50, c: '#ffcc80' },
    far: (g, w) => {
      hills(g, w, 360, '#b58a7a', [[2, 40, 0.3], [5, 20, 1.2], [11, 8, 2]]);
      volcano(g, 520, 420, 220, 220, '#7a5a52');
      volcano(g, 1500, 420, 180, 170, '#86655c');
      hills(g, w, 440, '#9c7a63', [[3, 14, 0.5], [7, 6, 1.8]]);
    },
    mid: (g, w) => {
      brachio(g, 350);
      stego(g, 900);
      for (const [x, h] of [[120, 120], [560, 150], [640, 110], [1160, 140], [1650, 130], [1820, 100]]) cycad(g, x, B, h);
      for (const x of [220, 760, 1060, 1300, 1450, 1740]) fern(g, x, B, 1);
      g.fillStyle = '#f5f0e1'; for (const [x, y] of [[1380, -12], [1396, -10], [1388, -22]]) { g.beginPath(); g.ellipse(x, B + y, 8, 11, 0, 0, Math.PI * 2); g.fill(); }
      g.strokeStyle = '#8d6e63'; g.lineWidth = 4; g.beginPath(); g.ellipse(1390, B - 6, 26, 8, 0, 0, Math.PI); g.stroke();
    },
    ground: (g, w) => {
      g.fillStyle = '#8d6e4f'; g.fillRect(0, B - 4, w, H - B + 4);
      g.fillStyle = '#6d8f3a'; g.fillRect(0, B - 4, w, 6);
      g.strokeStyle = '#ff7043'; g.lineWidth = 3;
      for (const x of [140, 520, 830]) { g.beginPath(); g.moveTo(x, B + 14); g.lineTo(x + 20, B + 24); g.lineTo(x + 10, B + 36); g.lineTo(x + 34, B + 44); g.stroke(); }
      g.fillStyle = '#efe6d2';
      for (const x of [300, 690]) { g.fillRect(x, B + 22, 34, 6); g.beginPath(); g.arc(x, B + 25, 6, 0, Math.PI * 2); g.arc(x + 34, B + 25, 6, 0, Math.PI * 2); g.fill(); }
      g.fillStyle = '#5b8a32'; for (let x = 10; x < w; x += 29) { g.beginPath(); g.moveTo(x, B + 2); g.lineTo(x + 4, B - 12); g.lineTo(x + 8, B + 2); g.fill(); }
    },
  };

  const STAGES = [seoul, boston, daejeon, newyork, playground, paris, london, chicago, la, space,
    sanfrancisco, washington, sejong, madrid, dinosaur];
  const cache = [];
  const TWINKLE = (() => { const r = rng(5); return Array.from({ length: 60 }, () => ({ x: r() * W, y: r() * 440, r: 1 + r() * 1.8, sp: 1 + r() * 3, ph: r() * 6 })); })();

  function build(i) {
    const s = STAGES[i];
    cache[i] = {
      clouds: s.noClouds ? null : cloudsLayer(100 + i),
      far: layer(PERIOD, s.far),
      mid: layer(PERIOD, s.mid),
      ground: layer(W, s.ground),
    };
    return cache[i];
  }
  function tile(ctx, L, offset) {
    const o = ((offset % L.w) + L.w) % L.w;
    ctx.drawImage(L.c, -o, 0, L.w, H);
    if (L.w - o < W) ctx.drawImage(L.c, L.w - o, 0, L.w, H);
  }
  function drawSun(ctx, s, t) {
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,220,0.35)'; ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = s.c; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
    if (s.face) {
      ctx.strokeStyle = '#ffb300'; ctx.lineWidth = 4; ctx.lineCap = 'round';
      for (let k = 0; k < 12; k++) {
        const a = (k / 12) * Math.PI * 2 + t * 0.3;
        ctx.beginPath(); ctx.moveTo(s.x + Math.cos(a) * (s.r + 8), s.y + Math.sin(a) * (s.r + 8));
        ctx.lineTo(s.x + Math.cos(a) * (s.r + 20), s.y + Math.sin(a) * (s.r + 20)); ctx.stroke();
      }
      ctx.fillStyle = '#5d4037';
      ctx.beginPath(); ctx.arc(s.x - 12, s.y - 6, 4, 0, Math.PI * 2); ctx.arc(s.x + 12, s.y - 6, 4, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#5d4037'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(s.x, s.y + 4, 13, 0.2, Math.PI - 0.2); ctx.stroke();
      ctx.fillStyle = 'rgba(255,120,120,0.5)';
      ctx.beginPath(); ctx.arc(s.x - 22, s.y + 6, 5, 0, Math.PI * 2); ctx.arc(s.x + 22, s.y + 6, 5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  return {
    stages: STAGES.map((s) => ({ name: s.name, desc: s.desc })),
    init(dpr) { DPR = dpr || 1; },
    draw(ctx, i, scroll, t) {
      const s = STAGES[i], L = cache[i] || build(i);
      const grd = ctx.createLinearGradient(0, 0, 0, H);
      grd.addColorStop(0, s.sky[0]); grd.addColorStop(1, s.sky[1]);
      ctx.fillStyle = grd; ctx.fillRect(0, 0, W, H);
      if (s.stars) {
        for (const st of TWINKLE) {
          ctx.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(t * st.sp + st.ph));
          ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      if (s.sun) drawSun(ctx, s.sun, t);
      if (L.clouds) tile(ctx, L.clouds, scroll * 0.06 + t * 8);
      tile(ctx, L.far, scroll * 0.15);
      tile(ctx, L.mid, scroll * 0.35);
      tile(ctx, L.ground, scroll);
    },
  };
})();
