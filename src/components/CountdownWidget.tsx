import { useState } from 'react';
import { useWidgetStore, type CountdownContent } from '../stores/widgetStore';
import styles from '../styles/widgets.module.css';

interface Props {
  id: string;
  content: CountdownContent;
}

export default function CountdownWidget({ content }: Props) {
  const updateContent = useWidgetStore((s) => s.updateContent);
  const [label, setLabel] = useState(content.label);
  const [date, setDate] = useState(content.date);

  if (!content.set) {
    return (
      <div className={styles.countdownForm}>
        <input
          className={styles.countdownFormInput}
          placeholder="期待的事..."
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <input
          className={styles.countdownFormInput}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button
          className={styles.countdownStartBtn}
          onClick={() => {
            if (!label.trim() || !date) return;
            updateContent({
              label: label.trim(),
              date,
              set: true,
            } as Partial<CountdownContent>);
          }}
        >
          开始倒数
        </button>
      </div>
    );
  }

  const target = new Date(content.date + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className={styles.countdownDisplay}>
      {diff <= 0 ? (
        <div className={styles.countdownArrived}>✦ 已至</div>
      ) : (
        <>
          <span className={styles.countdownNumber}>
            {diff}
            <span className={styles.countdownUnit}>天</span>
          </span>
        </>
      )}
      <div className={styles.countdownLabel}>{content.label}</div>
      <div className={styles.countdownDate}>{content.date}</div>
    </div>
  );
}
