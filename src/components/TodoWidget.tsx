import { useState, useRef } from 'react';
import { useWidgetStore, type TodoContent } from '../stores/widgetStore';
import styles from '../styles/widgets.module.css';

const BURST_COLORS = ['#89b4cc', '#d4976a', '#a8c8dd', '#e0d888', '#bfa0c8'];

interface Props {
  id: string;
  content: TodoContent;
}

export default function TodoWidget({ content }: Props) {
  const [input, setInput] = useState('');
  const updateContent = useWidgetStore((s) => s.updateContent);
  const listRef = useRef<HTMLDivElement>(null);

  const addItem = () => {
    const text = input.trim();
    if (!text) return;
    updateContent({
      items: [{ text: text.slice(0, 40), done: false }, ...content.items],
    } as Partial<TodoContent>);
    setInput('');
  };

  const toggleItem = (index: number, e: React.MouseEvent) => {
    const items = [...content.items];
    if (!items[index].done) {
      spawnBurst(e.clientX, e.clientY);
    }
    items[index] = { ...items[index], done: !items[index].done };
    updateContent({ items } as Partial<TodoContent>);
  };

  const deleteItem = (index: number) => {
    const items = content.items.filter((_, i) => i !== index);
    updateContent({ items } as Partial<TodoContent>);
  };

  const spawnBurst = (cx: number, cy: number) => {
    for (let i = 0; i < 6; i++) {
      const el = document.createElement('div');
      el.style.position = 'fixed';
      el.style.left = `${cx}px`;
      el.style.top = `${cy}px`;
      el.style.width = '3px';
      el.style.height = '3px';
      el.style.borderRadius = '50%';
      el.style.background = BURST_COLORS[i % BURST_COLORS.length];
      el.style.pointerEvents = 'none';
      el.style.zIndex = '9999';
      document.body.appendChild(el);

      const angle = (Math.PI * 2 * i) / 6;
      const dist = 20 + Math.random() * 15;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;

      el.animate(
        [
          { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
          {
            transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0)`,
            opacity: 0,
          },
        ],
        { duration: 360, easing: 'ease-out' }
      ).onfinish = () => el.remove();
    }
  };

  return (
    <>
      <div className={styles.todoInputRow}>
        <input
          className={styles.todoInput}
          placeholder="此刻想做的事..."
          value={input}
          maxLength={40}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
        />
        <button className={styles.todoAddBtn} onClick={addItem}>
          +
        </button>
      </div>
      <div className={styles.todoList} ref={listRef}>
        {content.items.map((item, i) => (
          <div key={i} className={styles.todoItem}>
            <button
              className={`${styles.todoChk} ${item.done ? styles.todoChkDone : ''}`}
              onClick={(e) => toggleItem(i, e)}
            />
            <span
              className={`${styles.todoText} ${item.done ? styles.todoTextDone : ''}`}
            >
              {item.text}
            </span>
            <button className={styles.todoDel} onClick={() => deleteItem(i)}>
              ✕
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
