import React from 'react';
import styles from './TopBar.module.css';

export default function TopBar() {
  return (
    <div className={styles.bar}>
      <span className={styles.phones}>Утас: 88056420, 98116039, 75155252</span>
      <div className={styles.right}>
        <span className={styles.contact}>Солонгос улсаас автомашин захиалга</span>
        <span className={styles.rate}>Ханш: ₩ 2.40</span>
      </div>
    </div>
  );
}