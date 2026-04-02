import type { SceneFactory } from './types';

interface Petal {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  rotation: number;
  rotSpeed: number;
  opacity: number;
}

export const createSakura: SceneFactory = () => {
  const petals: Petal[] = [];
  for (let i = 0; i < 16; i++) {
    petals.push({
      x: Math.random(),
      y: Math.random(),
      size: 2.5 + Math.random() * 3.5,
      speed: 0.003 + Math.random() * 0.004,
      drift: (Math.random() - 0.5) * 0.004,
      rotation: Math.random() * 360,
      rotSpeed: 0.5 + Math.random() * 1.5,
      opacity: 0.18 + Math.random() * 0.3,
    });
  }

  return (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    for (const p of petals) {
      p.y += p.speed;
      p.x += p.drift + Math.sin(p.y * 3) * 0.002;
      p.rotation += p.rotSpeed;

      if (p.y > 1.1) {
        p.y = -0.08;
        p.x = Math.random();
      }

      ctx.save();
      ctx.translate(p.x * w, p.y * h);
      ctx.rotate(p.rotation * Math.PI / 180);
      ctx.shadowColor = 'rgba(235, 170, 195, 0.2)';
      ctx.shadowBlur = 1.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(235, 170, 195, ${p.opacity + 0.06})`;
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.restore();
    }
  };
};
