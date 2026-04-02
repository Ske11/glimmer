import type { SceneFactory } from './types';

interface FogWisp {
  y: number;
  w: number;
}

export const createMist: SceneFactory = () => {
  let t = 0;
  const wisps: FogWisp[] = Array.from({ length: 5 }, (_, i) => ({
    y: 0.15 + i * 0.18,
    w: 0.35 + Math.random() * 0.3,
  }));

  return (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    t += 0.003;

    for (const wi of wisps) {
      const cx = w * (0.5 + Math.sin(t + wi.y * 5) * 0.3);
      const grad = ctx.createRadialGradient(cx, wi.y * h, 0, cx, wi.y * h, w * wi.w);
      grad.addColorStop(0, 'rgba(170, 185, 200, 0.06)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }
  };
};
