import React from 'react';
import styles from './CarSpecTable.module.css';
import { formatKm } from '../../utils/format';

export default function CarSpecTable({ carInfo }) {
  if (!carInfo) return null;

  const specs = [
    { label: 'Он',            value: carInfo.manufactureYear },
    { label: 'Гүйлт',        value: carInfo.mileage != null ? formatKm(carInfo.mileage) : null },
    { label: 'Хөдөлгүүр',    value: carInfo.cc ? `${carInfo.cc}сс` : null },
    { label: 'Хурдны хайрцаг', value: carInfo.transmission },
    { label: 'Түлш',          value: carInfo.fuelType },
    { label: 'Өнгө',          value: carInfo.color },
    { label: 'Хүч',           value: carInfo.power ? `${carInfo.power}hp` : null },
    { label: 'Дугаар',        value: carInfo.vehicleNo },
  ].filter((s) => s.value);

  return (
    <div className={styles.wrap}>
      <div className={styles.inlineSpecs}>
        {specs.slice(0, 5).map((s) => (
          <span key={s.label} className={styles.inlineItem}>
            <span className={styles.inlineLabel}>{s.label}:</span>
            <span className={styles.inlineValue}>{s.value}</span>
          </span>
        ))}
      </div>

      <div className={styles.table}>
        {specs.map((s) => (
          <div key={s.label} className={styles.row}>
            <span className={styles.label}>{s.label}</span>
            <span className={styles.value}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
