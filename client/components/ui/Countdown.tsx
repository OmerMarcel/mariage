'use client';

import { useState, useEffect } from 'react';
import { getCountdown } from '@/lib/utils';
import styles from './Countdown.module.css';

interface CountdownProps {
  weddingDate: string;
}

export default function Countdown({ weddingDate }: CountdownProps) {
  const [countdown, setCountdown] = useState(getCountdown(weddingDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdown(weddingDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [weddingDate]);

  if (countdown.isPast) {
    return (
      <div className={styles.married}>
        <span className={styles.marriedIcon}>💍</span>
        <span className={styles.marriedText}>Nous sommes mariés !</span>
      </div>
    );
  }

  const units = [
    { value: countdown.days, label: 'Jours' },
    { value: countdown.hours, label: 'Heures' },
    { value: countdown.minutes, label: 'Minutes' },
    { value: countdown.seconds, label: 'Secondes' },
  ];

  return (
    <div className={styles.countdown}>
      {units.map((unit, i) => (
        <div key={unit.label} className={styles.unit}>
          <div className={styles.number}>{String(unit.value).padStart(2, '0')}</div>
          <div className={styles.label}>{unit.label}</div>
          {i < units.length - 1 && <div className={styles.separator}>:</div>}
        </div>
      ))}
    </div>
  );
}
