import React, { useEffect, useState } from 'react';
import { getPriceConfig } from '../../services/api';
import styles from './TopBar.module.css';

export default function TopBar() {
  const [rate, setRate] = useState('2.40');

  useEffect(() => {
    getPriceConfig()
      .then((r) => {
        const val = r?.data?.krwToMntRate ?? r?.krwToMntRate;
        if (val) setRate(Number(val).toFixed(2));
      })
      .catch(() => {});
  }, []);

  return (
    <div className={styles.bar}>
      <div className={styles.right}>
        <span className={styles.contact}>Солонгос улсаас автомашин захиалга</span>
        <span className={styles.rate}>Ханш: ₩ {rate}</span>
      </div>
    </div>
  );
}