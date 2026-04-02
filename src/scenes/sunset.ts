import type { SceneFactory } from './types';

export const createSunset: SceneFactory = () => {
  let t = 0;

  return (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    t += 0.004;

    const grad = ctx.createRadialGradient(w * 0.5, h * 1.2, 0, w * 0.5, h * 1.2, h * 0.8);
    grad.addColorStop(0, `rgba(255, 150, 50, ${0.06 + Math.sin(t) * 0.025})`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  };
};
