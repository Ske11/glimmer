import { useEffect, useRef } from 'react';
import type { SceneId } from '../stores/widgetStore';
import type { DrawFn } from '../scenes/types';
import { createRain } from '../scenes/rain';
import { createSnow } from '../scenes/snow';
import { createSunset } from '../scenes/sunset';
import { createNight } from '../scenes/night';
import { createAurora } from '../scenes/aurora';
import { createSakura } from '../scenes/sakura';
import { createMist } from '../scenes/mist';
import { createFirefly } from '../scenes/firefly';

const FACTORIES: Record<SceneId, () => DrawFn> = {
  rain: createRain,
  snow: createSnow,
  sunset: createSunset,
  night: createNight,
  aurora: createAurora,
  sakura: createSakura,
  mist: createMist,
  firefly: createFirefly,
};

// Fixed logical coordinate space — particles always render at this density
const LOGICAL_W = 400;
const LOGICAL_H = 400;

interface Props {
  scene: SceneId;
}

export default function WeatherCanvas({ scene }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef<DrawFn | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    drawRef.current = FACTORIES[scene]();
  }, [scene]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Buffer at fixed resolution * dpr for crisp rendering
    const dpr = window.devicePixelRatio || 2;
    canvas.width = LOGICAL_W * dpr;
    canvas.height = LOGICAL_H * dpr;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    function animate() {
      drawRef.current?.(ctx!, LOGICAL_W, LOGICAL_H);
      rafRef.current = requestAnimationFrame(animate);
    }
    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [scene]);

  // CSS stretches the fixed-res buffer to fill container.
  // Since buffer is 800x800 (at 2x dpr) displayed at ~200px widget,
  // it's actually downscaled = crisp. Particle density stays constant.
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}
