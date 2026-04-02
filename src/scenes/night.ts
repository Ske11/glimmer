import type { SceneFactory } from './types';

interface Star {
  x: number;
  y: number;
  size: number;
  phase: number;
  speed: number;
}

export const createNight: SceneFactory = () => {
  const stars: Star[] = [];
  for (let i = 0; i < 22; i++) {
    stars.push({
      x: Math.random(),
      y: Math.random(),
      size: 0.4 + Math.random() * 1.2,
      phase: Math.random() * Math.PI * 2,
      speed: 0.015 + Math.random() * 0.03,
    });
  }

  return (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      s.phase += s.speed;
      const opacity = 0.18 + Math.sin(s.phase) * 0.45;
      const o = Math.max(0, opacity);
      const px = s.x * w;
      const py = s.y * h;

      // Star glow
      ctx.shadowColor = `rgba(180, 180, 255, ${o * 0.8})`;
      ctx.shadowBlur = 4 + s.size * 2;
      ctx.beginPath();
      ctx.arc(px, py, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 200, 255, ${o})`;
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }
  };
};
