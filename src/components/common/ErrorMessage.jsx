import React from 'react';
import styles from './ErrorMessage.module.css';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className={styles.wrap}>
      <span className={styles.icon}>⚠️</span>
      <p className={styles.msg}>{message || 'Алдаа гарлаа. Дахин оролдоно уу.'}</p>
      {onRetry && (
        <button className={styles.retryBtn} onClick={onRetry}>
          Дахин оролдох
        </button>
      )}
    </div>
  );
}
