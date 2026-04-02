import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { SceneId } from '../stores/widgetStore';
import { SCENE_LIST } from '../utils/constants';
import styles from '../styles/widgets.module.css';

interface Props {
  current: SceneId;
  onChange: (scene: SceneId) => void;
}

export default function ScenePicker({ current, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const updatePos = useCallback(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const margin = 4;
    const rightPos = window.innerWidth - rect.right;

    // Try below first
    const spaceBelow = window.innerHeight - rect.bottom - margin;
    // Try above
    const spaceAbove = rect.top - margin;

    // Estimate dropdown height: 8 items * 29px + 12px padding
    const dropH = 8 * 29 + 12;

    if (spaceBelow >= dropH) {
      // Fits below
      setStyle({
        position: 'fixed',
        top: rect.bottom + margin,
        right: rightPos,
        maxHeight: spaceBelow,
      });
    } else if (spaceAbove >= dropH) {
      // Fits above
      setStyle({
        position: 'fixed',
        bottom: window.innerHeight - rect.top + margin,
        right: rightPos,
        maxHeight: spaceAbove,
      });
    } else {
      // Neither fits — use whichever is larger, with scroll
      if (spaceBelow >= spaceAbove) {
        setStyle({
          position: 'fixed',
          top: rect.bottom + margin,
          right: rightPos,
          maxHeight: spaceBelow,
        });
      } else {
        setStyle({
          position: 'fixed',
          bottom: window.innerHeight - rect.top + margin,
          right: rightPos,
          maxHeight: spaceAbove,
        });
      }
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePos();
    const handler = (e: MouseEvent) => {
      if (
        btnRef.current?.contains(e.target as Node) ||
        dropRef.current?.contains(e.target as Node)
      ) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, updatePos]);

  return (
    <>
      <button
        ref={btnRef}
        className={styles.headerBtn}
        onClick={() => setOpen(!open)}
        title="切换场景"
      >
        ☁
      </button>
      {open && createPortal(
        <div
          ref={dropRef}
          className={styles.sceneDropdown}
          style={style}
        >
          {SCENE_LIST.map((s) => (
            <button
              key={s.id}
              className={`${styles.sceneItem} ${
                current === s.id ? styles.sceneItemActive : ''
              }`}
              onClick={() => {
                onChange(s.id);
                setOpen(false);
              }}
            >
              <span className={`${styles.sceneDot} ${styles[`sceneDot_${s.id}`]}`} />
              <span className={styles.sceneName}>{s.name}</span>
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}
