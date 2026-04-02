import type { SceneFactory } from './types';

export const createAurora: SceneFactory = () => {
  let t = 0;
  const colors = [
    'rgba(50, 200, 140, 0.05)',
    'rgba(90, 60, 200, 0.04)',
    'rgba(35, 150, 110, 0.035)',
  ];

  return (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    t += 0.005;

    for (let i = 0; i < 3; i++) {
      const baseY = h * (0.2 + i * 0.2);
      ctx.beginPath();
      ctx.moveTo(0, baseY);

      for (let x = 0; x <= w; x += 3) {
        const y = baseY
          + Math.sin(x * 0.02 + t + i * 1.5) * 10
          + Math.sin(x * 0.008 + t * 0.7) * 7;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fillStyle = colors[i];
      ctx.fill();
    }
  };
};
