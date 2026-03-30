import React from 'react';
import { SORT_OPTIONS } from '../../utils/constants';
import styles from './CarSortBar.module.css';

export default function CarSortBar({ total, activeSort, onSort, onClearFilters }) {
  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        {onClearFilters && (
          <button className={styles.clearBtn} onClick={onClearFilters}>
            ✕ Шүүлтүүрийг цэвэрлэх
          </button>
        )}
      </div>
      <div className={styles.right}>
        <span className={styles.total}>Нийт: <b>{total?.toLocaleString()}</b> машин</span>
        <div className={styles.sortBtns}>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`${styles.sortBtn} ${activeSort === opt.value ? styles.active : ''}`}
              onClick={() => onSort(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
