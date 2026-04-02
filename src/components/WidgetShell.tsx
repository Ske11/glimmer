import { useState, useEffect, useRef, type ReactNode } from 'react';
import { useWidgetStore } from '../stores/widgetStore';
import { WIDGET_DEFAULTS } from '../utils/constants';
import WeatherCanvas from './WeatherCanvas';
import WidgetContent from './WidgetContent';
import glass from '../styles/glass.module.css';
import scenes from '../styles/scenes.module.css';

interface Props {
  children: ReactNode;
}

export default function WidgetShell({ children }: Props) {
  const type = useWidgetStore((s) => s.type);
  const scene = useWidgetStore((s) => s.scene);
  const collapsed = useWidgetStore((s) => s.collapsed);
  const setCollapsed = useWidgetStore((s) => s.setCollapsed);
  const setScene = useWidgetStore((s) => s.setScene);

  const [size, setSize] = useState({ width: WIDGET_DEFAULTS[type].width, height: WIDGET_DEFAULTS[type].height });
  const prevSizeRef = useRef<{ width: number; height: number } | null>(null);

  // Track actual window size
  useEffect(() => {
    const update = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Handle collapse: resize Tauri window to 38x38 bubble, restore on expand
  useEffect(() => {
    (async () => {
      try {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        const { LogicalSize } = await import('@tauri-apps/api/dpi');
        const win = getCurrentWindow();
        if (collapsed) {
          prevSizeRef.current = { ...size };
          await win.setMinSize(null);
          await win.setResizable(false);
          await win.setSize(new LogicalSize(28, 28));
        } else if (prevSizeRef.current) {
          const restoreW = prevSizeRef.current.width;
          const restoreH = prevSizeRef.current.height;
          const mins = WIDGET_DEFAULTS[type];
          await win.setResizable(true);
          await win.setMinSize(new LogicalSize(mins.minWidth, mins.minHeight));
          await win.setSize(new LogicalSize(restoreW, restoreH));
        }
      } catch { /* browser dev mode */ }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsed]);

  const handleClose = async () => {
    try {
      localStorage.removeItem(`glimmer-${useWidgetStore.getState().wid}`);
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      await getCurrentWindow().close();
    } catch { /* browser dev mode */ }
  };

  if (collapsed) {
    return (
      <div
        className={`${glass.wCollapsed} ${scenes[scene]}`}
        style={{ position: 'fixed', inset: 0, width: '100%', height: '100%' }}
        data-tauri-drag-region
        onClick={() => setCollapsed(false)}
      >
        <div className={glass.wOrbDot} />
      </div>
    );
  }

  return (
    <div
      className={`${glass.wOuter} ${scenes[scene]}`}
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%' }}
    >
      {/* Outer frame layers */}
      <div className={glass.wOuterGlass} />
      <div className={glass.wOuterFill} />
      <div className={glass.wOuterBorder} />

      {/* Inner panel */}
      <div className={glass.wInner}>
        <div className={glass.wBlur} />
        <div className={glass.wFrost} />
        <div className={glass.wTint} />
        <div className={glass.wNoise} />
        <div className={glass.wSheen} />
        <div className={glass.wWeather}>
          <WeatherCanvas scene={scene} />
        </div>
        <div className={glass.wContent}>
          <WidgetContent
            type={type}
            scene={scene}
            width={size.width}
            height={size.height}
            onSceneChange={setScene}
            onCollapse={() => setCollapsed(true)}
            onClose={handleClose}
          >
            {children}
          </WidgetContent>
        </div>
      </div>
    </div>
  );
}
