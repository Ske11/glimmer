import type { SceneFactory } from './types';

interface Drop {
  x: number;
  y: number;
  speed: number;
  length: number;
  opacity: number;
}

export const createRain: SceneFactory = () => {
  const drops: Drop[] = [];
  for (let i = 0; i < 50; i++) {
    drops.push({
      x: Math.random(),
      y: Math.random(),
      speed: 0.012 + Math.random() * 0.018,
      length: 10 + Math.random() * 18,
      opacity: 0.1 + Math.random() * 0.18,
    });
  }

  return (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.shadowColor = 'rgba(140, 175, 210, 0.3)';
    ctx.shadowBlur = 1;
    for (const d of drops) {
      d.y += d.speed;
      if (d.y > 1.15) {
        d.y = -0.1;
        d.x = Math.random();
      }
      const px = d.x * w;
      const py = d.y * h;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px - 0.3, py + d.length);
      ctx.strokeStyle = `rgba(140, 175, 210, ${d.opacity + 0.08})`;
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  };
};
