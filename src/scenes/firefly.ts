import type { SceneFactory } from './types';

interface Fly {
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  speed: number;
  size: number;
}

export const createFirefly: SceneFactory = () => {
  const flies: Fly[] = [];
  for (let i = 0; i < 10; i++) {
    flies.push({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.003,
      vy: (Math.random() - 0.5) * 0.003,
      phase: Math.random() * Math.PI * 2,
      speed: 0.03 + Math.random() * 0.04,
      size: 1.2 + Math.random() * 1.2,
    });
  }

  return (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    for (const f of flies) {
      f.phase += f.speed;
      f.x += f.vx + Math.sin(f.phase * 0.5) * 0.001;
      f.y += f.vy + Math.cos(f.phase * 0.7) * 0.001;

      if (f.x < 0 || f.x > 1) f.vx *= -1;
      if (f.y < 0 || f.y > 1) f.vy *= -1;

      const glow = 0.12 + Math.max(0, Math.sin(f.phase)) * 0.6;
      const px = f.x * w;
      const py = f.y * h;

      // Soft glow halo
      ctx.shadowColor = `rgba(180, 210, 60, ${glow * 0.7})`;
      ctx.shadowBlur = 6 + f.size * 3;

      // Inner dot
      ctx.beginPath();
      ctx.arc(px, py, f.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 225, 80, ${glow})`;
      ctx.fill();

      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;

      // Outer glow
      ctx.beginPath();
      ctx.arc(px, py, f.size * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(170, 200, 50, ${glow * 0.15})`;
      ctx.fill();
    }
  };
};
