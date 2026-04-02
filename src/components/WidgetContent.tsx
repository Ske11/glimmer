import { useCallback, type ReactNode } from 'react';
import type { WidgetType, SceneId } from '../stores/widgetStore';
import { useResponsivePad } from '../hooks/useResponsivePad';
import ScenePicker from './ScenePicker';
import { WIDGET_LABELS } from '../utils/constants';
import styles from '../styles/widgets.module.css';

interface Props {
  type: WidgetType;
  scene: SceneId;
  width: number;
  height: number;
  onSceneChange: (scene: SceneId) => void;
  onCollapse: () => void;
  onClose: () => void;
  children: ReactNode;
}

export default function WidgetContent({
  type,
  scene,
  width,
  height,
  onSceneChange,
  onCollapse,
  onClose,
  children,
}: Props) {
  const { paddingV, paddingH } = useResponsivePad(width, height);

  const handleMouseDown = useCallback(async (e: React.MouseEvent) => {
    // Only left mouse button
    if (e.button !== 0) return;
    // Skip if clicking on input/textarea (allow text selection)
    const tag = (e.target as HTMLElement).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      await getCurrentWindow().startDragging();
    } catch { /* browser dev mode */ }
  }, []);

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        padding: `${paddingV}px ${paddingH}px`,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
      }}
    >
      <div className={styles.header}>
        <span className={styles.headerLabel}>{WIDGET_LABELS[type].name}</span>
        <div className={styles.headerBtns}>
          <ScenePicker current={scene} onChange={onSceneChange} />
          <button className={styles.headerBtn} onClick={onCollapse} title="收起">
            −
          </button>
          <button className={styles.headerBtn} onClick={onClose} title="关闭">
            ×
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
