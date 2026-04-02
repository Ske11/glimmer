import { useMemo } from 'react';

export function useResponsivePad(width: number, height: number) {
  return useMemo(() => {
    const short = Math.min(width, height);
    if (short < 160) return { paddingV: 8, paddingH: 14 };
    if (short <= 230) return { paddingV: 10, paddingH: 20 };
    return { paddingV: 14, paddingH: 28 };
  }, [width, height]);
}
