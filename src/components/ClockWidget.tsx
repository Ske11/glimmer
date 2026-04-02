import { useState, useEffect } from 'react';
import { formatTime, formatDate, getGreeting } from '../utils/greetings';
import styles from '../styles/widgets.module.css';

export default function ClockWidget() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 28 }}>
      <div className={styles.clockTime}>{formatTime(now)}</div>
      <div className={styles.clockDate}>{formatDate(now)}</div>
      <div className={styles.clockGreeting}>{getGreeting()}</div>
    </div>
  );
}
