import type { SceneFactory } from './types';

interface Flake {
  x: number;
  y: number;
  speed: number;
  size: number;
  drift: number;
  opacity: number;
}

export const createSnow: SceneFactory = () => {
  const flakes: Flake[] = [];
  for (let i = 0; i < 28; i++) {
    flakes.push({
      x: Math.random(),
      y: Math.random(),
      speed: 0.002 + Math.random() * 0.004,
      size: 1 + Math.random() * 3,
      drift: (Math.random() - 0.5) * 0.002,
      opacity: 0.2 + Math.random() * 0.45,
    });
  }

  return (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.shadowColor = 'rgba(220, 235, 250, 0.25)';
    ctx.shadowBlur = 1.5;
    for (const f of flakes) {
      f.y += f.speed;
      f.x += f.drift + Math.sin(f.y * 5) * 0.0008;
      if (f.y > 1.1) {
        f.y = -0.05;
        f.x = Math.random();
      }
      ctx.beginPath();
      ctx.arc(f.x * w, f.y * h, f.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 235, 250, ${f.opacity + 0.06})`;
      ctx.fill();
    }
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  };
};
