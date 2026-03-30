import React from 'react';
import styles from './LoadingSpinner.module.css';

export default function LoadingSpinner({ size = 'md', text }) {
  return (
    <div className={`${styles.wrap} ${styles[size]}`}>
      <div className={styles.spinner} />
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
}
